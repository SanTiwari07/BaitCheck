'use strict';

(function () {
  const MAX_XRAY_LENGTH = 2000;
  const REPORT_POLL_MS = 4000;
  const RECENT_CHALLENGES_KEY = 'baitcheck_recent_challenges_v1';
  const MAX_RECENT_CHALLENGES = 5;

  const {
    I18N,
    localizeXrayVerdict: i18nXrayVerdict,
    localizeXrayFinding: i18nXrayFinding,
    localizeUpiWarning: i18nUpiWarning,
    formatMissedFlag: i18nFormatMissedFlag
  } = window.BaitCheckI18n;

  const state = {
    lang: 'en',
    muted: false,
    route: { mode: 'tab', tab: 'drill', challengeId: null },

    // Server payload cache
    loaded: false,
    loadError: false,
    drills: [],
    playbook: null,
    presets: [],
    stats: null,

    // Audio
    audioCtx: null,

    // Drill state
    drillPhase: 'hero', // 'hero' | 'active' | 'finale'
    drillIndex: 0,
    drillOutcomes: [], // [{ scenarioId, title, weight, passed, points, reactionMs, missedFlag, lossLabel, lossInr }]
    drillStartPerf: 0,
    drillRemainingMs: 15000,
    drillLastTickSec: null,
    drillAnswered: false,
    drillTimerId: null,
    apkNoticeShown: false,
    syncStatus: null, // null | 'saving' | 'saved' | 'error'
    ticketDownloadedMsg: '',
    ticketPreviewUrl: '',
    ticketBadgeUrl: '',

    // Active challenge context (when on /c/:id)
    activeChallenge: null,
    challengeLoadError: null, // null | 'not-found' | 'error'

    // X-Ray state
    xrayInput: '',
    xraySelectedPresetId: null,
    xrayLoading: false,
    xrayErrorKey: '',
    xrayErrorCustom: '',
    xrayResult: null,

    // Challenge Creator state
    challengeCreatorName: '',
    challengeTargetLabel: '',
    challengeFormLang: 'en',
    challengeSubmitting: false,
    challengeErrorKey: '',
    challengeErrorCustom: '',
    createdChallenge: null,
    recentChallenges: [],
    copiedKey: '',

    // Live Report state
    reportId: null,
    reportLoading: false,
    reportError: null,
    reportData: null,
    reportPollId: null
  };

  const els = {};

  function t(key) {
    const pack = I18N[state.lang] || I18N.en;
    return pack[key] !== undefined ? pack[key] : (I18N.en[key] || key);
  }

  function loc(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[state.lang] || obj.en || '';
  }

  const {
    createEl,
    clearEl,
    buildCallerEmblemSvg,
    buildSilhouetteSvg
  } = window.BaitCheckDom;

  // Audio Engine (Tap-to-Unlock WebAudio + Conditional en-IN/hi-IN TTS)
  // =========================================================================

  function unlockAudio() {
    if (state.muted) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    try {
      if (!state.audioCtx) {
        state.audioCtx = new AudioCtx();
      }
      if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }
    } catch {
      // Ignore WebAudio restrictions cleanly.
    }
  }

  function playTone(freq, durationSec, type, gainPeak, delaySec) {
    if (state.muted || !state.audioCtx) return;
    try {
      const ctx = state.audioCtx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const startAt = ctx.currentTime + (delaySec || 0);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, startAt);
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(gainPeak || 0.08, startAt + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + durationSec);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startAt);
      osc.stop(startAt + durationSec + 0.02);
    } catch {
      // Silent fallback on audio failure.
    }
  }

  function playIncomingChime() {
    playTone(784, 0.12, 'triangle', 0.09, 0);
    playTone(987.77, 0.18, 'triangle', 0.09, 0.13);
  }

  function playTickSound(isUrgent) {
    playTone(isUrgent ? 1046 : 660, 0.045, 'square', isUrgent ? 0.045 : 0.025, 0);
  }

  function playPassChime() {
    playTone(587.33, 0.11, 'triangle', 0.09, 0);
    playTone(880, 0.2, 'triangle', 0.1, 0.11);
  }

  function playTrapBuzz() {
    playTone(220, 0.18, 'sawtooth', 0.08, 0);
    playTone(164.81, 0.26, 'sawtooth', 0.08, 0.16);
  }

  function stopSpeech() {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore synthesis cancel errors.
    }
  }

  function speakCaption(text, lang) {
    if (state.muted || !text || !('speechSynthesis' in window)) return;
    try {
      const synth = window.speechSynthesis;
      const voices = synth.getVoices ? synth.getVoices() : [];
      if (!voices || voices.length === 0) return;

      const targetRe = lang === 'hi' ? /^hi[-_]IN$/i : /^en[-_]IN$/i;
      const matchedVoice = voices.find((v) => targetRe.test(v.lang || ''));
      if (!matchedVoice) return;

      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.voice = matchedVoice;
      utter.lang = matchedVoice.lang;
      utter.rate = 1.02;
      synth.speak(utter);
    } catch {
      // Visual captions are primary; ignore TTS runtime errors.
    }
  }

  // =========================================================================
  // URL Routing & Timer Lifecycle
  // =========================================================================

  function parseRoute(pathname, search) {
    const cleanPath = pathname || '/';
    const reportMatch = /^\/c\/([a-z0-9-]{2,40})\/report\/?$/.exec(cleanPath);
    if (reportMatch) {
      return { mode: 'report', tab: 'challenge', challengeId: reportMatch[1] };
    }
    const challengeMatch = /^\/c\/([a-z0-9-]{2,40})\/?$/.exec(cleanPath);
    if (challengeMatch) {
      return { mode: 'challenge-drill', tab: 'drill', challengeId: challengeMatch[1] };
    }
    const params = new URLSearchParams(search || '');
    const tabParam = params.get('tab');
    if (tabParam === 'xray') {
      return { mode: 'tab', tab: 'xray', challengeId: null };
    }
    if (tabParam === 'challenge') {
      return { mode: 'tab', tab: 'challenge', challengeId: null };
    }
    return { mode: 'tab', tab: 'drill', challengeId: null };
  }

  function stopDrillTimer() {
    if (state.drillTimerId !== null) {
      clearInterval(state.drillTimerId);
      state.drillTimerId = null;
    }
  }

  function pauseActiveDrillTimer() {
    if (state.drillPhase === 'active' && !state.drillAnswered && state.drillTimerId !== null) {
      const drill = state.drills[state.drillIndex];
      const durationMs = ((drill && Number(drill.durationSec)) || 15) * 1000;
      const elapsed = performance.now() - state.drillStartPerf;
      state.drillRemainingMs = Math.max(0, Math.min(durationMs, durationMs - elapsed));
    }
    stopDrillTimer();
  }

  function startDrillCountdownInterval(drill, durationMs) {
    stopDrillTimer();
    state.drillTimerId = setInterval(() => {
      if (state.drillPhase !== 'active' || state.drillAnswered) {
        stopDrillTimer();
        return;
      }
      const elapsed = performance.now() - state.drillStartPerf;
      const remaining = Math.max(0, durationMs - elapsed);
      state.drillRemainingMs = remaining;

      const secCeil = Math.ceil(remaining / 1000);
      if (secCeil !== state.drillLastTickSec) {
        state.drillLastTickSec = secCeil;
        if (secCeil > 0 && secCeil <= 5) {
          playTickSound(secCeil <= 3);
        }
      }

      updateCountdownDom(remaining, durationMs);

      if (remaining <= 0) {
        handleDrillTimeout();
      }
    }, 100);
  }

  function resumeActiveDrillTimer() {
    if (state.drillPhase !== 'active' || state.drillAnswered) return;
    const drill = state.drills[state.drillIndex];
    if (!drill) return;

    const durationMs = (Number(drill.durationSec) || 15) * 1000;
    const remainingMs = Math.max(0, Math.min(durationMs, Number(state.drillRemainingMs) || 0));
    state.drillRemainingMs = remainingMs;
    state.drillStartPerf = performance.now() - (durationMs - remainingMs);
    state.drillLastTickSec = Math.ceil(remainingMs / 1000);

    if (remainingMs <= 0) {
      handleDrillTimeout();
      return;
    }

    updateCountdownDom(remainingMs, durationMs);
    startDrillCountdownInterval(drill, durationMs);
  }

  function stopReportPolling() {
    if (state.reportPollId !== null) {
      clearInterval(state.reportPollId);
      state.reportPollId = null;
    }
  }

  function navigateTo(urlPath, opts) {
    const options = opts || {};
    pauseActiveDrillTimer();
    stopReportPolling();
    stopSpeech();

    const parsedUrl = new URL(urlPath, window.location.origin);
    if (!options.fromPopstate && (parsedUrl.pathname + parsedUrl.search) !== (window.location.pathname + window.location.search)) {
      window.history.pushState({}, '', parsedUrl.pathname + parsedUrl.search);
    }

    state.route = parseRoute(parsedUrl.pathname, parsedUrl.search);
    syncRouteView();
  }

  function syncRouteView() {
    const route = state.route;

    if (route.mode === 'challenge-drill') {
      const sameActiveChallenge =
        state.activeChallenge &&
        state.activeChallenge.id === route.challengeId &&
        state.drillPhase === 'active';
      if (!sameActiveChallenge) {
        state.drillPhase = 'hero';
        state.drillIndex = 0;
        state.drillOutcomes = [];
        state.ticketPreviewUrl = '';
        state.ticketBadgeUrl = '';
        state.activeChallenge = null;
        state.challengeLoadError = null;
        loadChallengeForDrill(route.challengeId);
      }
    } else if (route.mode === 'report') {
      state.reportId = route.challengeId;
      state.reportLoading = true;
      state.reportError = null;
      state.reportData = null;
      loadReport(route.challengeId, true);
    } else {
      if (route.tab === 'drill' && state.activeChallenge) {
        state.activeChallenge = null;
        state.challengeLoadError = null;
        state.drillPhase = 'hero';
        state.drillIndex = 0;
        state.drillOutcomes = [];
        state.ticketPreviewUrl = '';
        state.ticketBadgeUrl = '';
      }
    }

    renderAll();

    const onDrillView =
      route.mode === 'challenge-drill' || (route.mode === 'tab' && route.tab === 'drill');
    if (onDrillView && state.drillPhase === 'active' && !state.drillAnswered) {
      resumeActiveDrillTimer();
    }
  }

  // =========================================================================
  // Data Fetching
  // =========================================================================

  async function fetchDrillsAndStats() {
    try {
      const [drillsRes, statsRes] = await Promise.all([
        fetch('/api/drills'),
        fetch('/api/stats')
      ]);

      if (!drillsRes.ok) {
        throw new Error('Failed to load drills');
      }
      const drillsPayload = await drillsRes.json();
      state.drills = Array.isArray(drillsPayload.drills) ? drillsPayload.drills : [];
      state.playbook = drillsPayload.playbook || null;
      state.presets = Array.isArray(drillsPayload.presets) ? drillsPayload.presets : [];
      state.loaded = true;
      state.loadError = false;

      if (statsRes.ok) {
        state.stats = await statsRes.json();
      }
    } catch {
      state.loadError = true;
    }
    renderAll();
  }

  async function refreshCohortStats() {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        state.stats = await res.json();
        renderCohortPanel();
      }
    } catch {
      // Ignore silent background stat refresh error.
    }
  }

  async function loadChallengeForDrill(challengeId) {
    try {
      const res = await fetch('/api/challenge/' + encodeURIComponent(challengeId));
      if (res.status === 404) {
        state.challengeLoadError = 'not-found';
        renderDrillView();
        return;
      }
      if (!res.ok) {
        state.challengeLoadError = 'error';
        renderDrillView();
        return;
      }
      const data = await res.json();
      state.activeChallenge = data.challenge || null;
      state.challengeLoadError = null;
      if (state.activeChallenge && state.activeChallenge.lang === 'hi') {
        state.lang = 'hi';
      } else if (state.activeChallenge && state.activeChallenge.lang === 'en') {
        state.lang = 'en';
      }
      renderAll();
    } catch {
      state.challengeLoadError = 'error';
      renderDrillView();
    }
  }

  async function postChallengeDrillResult(outcome) {
    if (state.route.mode !== 'challenge-drill' || !state.route.challengeId) return;
    state.syncStatus = 'saving';
    renderDrillView();

    try {
      const res = await fetch(
        '/api/challenge/' + encodeURIComponent(state.route.challengeId) + '/result',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenarioId: outcome.scenarioId,
            passed: outcome.passed,
            reactionMs: outcome.reactionMs,
            missedFlag: outcome.missedFlag
          })
        }
      );
      if (!res.ok) {
        state.syncStatus = 'error';
      } else {
        state.syncStatus = 'saved';
        refreshCohortStats();
      }
    } catch {
      state.syncStatus = 'error';
    }
    renderDrillView();
  }

  async function loadReport(challengeId, isInitial) {
    if (isInitial) {
      state.reportLoading = true;
      renderReportView();
    }
    try {
      const res = await fetch('/api/challenge/' + encodeURIComponent(challengeId));
      if (res.status === 404) {
        state.reportLoading = false;
        state.reportError = 'not-found';
        stopReportPolling();
        renderReportView();
        return;
      }
      if (!res.ok) {
        state.reportLoading = false;
        state.reportError = 'error';
        renderReportView();
        return;
      }
      const data = await res.json();
      state.reportLoading = false;
      state.reportError = null;
      state.reportData = data;
      renderReportView();

      const completed = data && data.summary ? Number(data.summary.completedCount || 0) : 0;
      const total = data && data.summary ? Number(data.summary.totalScenarios || 3) : 3;

      if (completed >= total) {
        stopReportPolling();
      } else if (state.route.mode === 'report' && state.route.challengeId === challengeId && state.reportPollId === null) {
        state.reportPollId = setInterval(() => {
          if (state.route.mode === 'report' && state.route.challengeId === challengeId) {
            loadReport(challengeId, false);
          } else {
            stopReportPolling();
          }
        }, REPORT_POLL_MS);
      }
    } catch {
      state.reportLoading = false;
      state.reportError = 'error';
      renderReportView();
    }
  }

  // =========================================================================
  // Drill Engine
  // =========================================================================

  function startDrillSequence() {
    if (!state.drills.length) return;
    unlockAudio();
    playIncomingChime();

    state.drillPhase = 'active';
    state.drillIndex = 0;
    state.drillOutcomes = [];
    state.ticketDownloadedMsg = '';
    state.ticketPreviewUrl = '';
    state.ticketBadgeUrl = '';
    beginCurrentDrill();
  }

  function beginCurrentDrill() {
    stopDrillTimer();
    stopSpeech();

    const drill = state.drills[state.drillIndex];
    if (!drill) {
      state.drillPhase = 'finale';
      renderDrillView();
      return;
    }

    const durationMs = (Number(drill.durationSec) || 15) * 1000;
    state.drillStartPerf = performance.now();
    state.drillRemainingMs = durationMs;
    state.drillLastTickSec = Math.ceil(durationMs / 1000);
    state.drillAnswered = false;
    state.apkNoticeShown = false;
    state.syncStatus = null;

    renderDrillView();
    speakCaption(loc(drill.script), state.lang);
    startDrillCountdownInterval(drill, durationMs);
  }

  function updateCountdownDom(remainingMs, totalMs) {
    const timeEl = document.getElementById('drill-countdown-time');
    const fillEl = document.getElementById('drill-countdown-fill');
    const secStr = (remainingMs / 1000).toFixed(1) + 's';
    const pct = Math.max(0, Math.min(100, (remainingMs / totalMs) * 100));
    const urgent = remainingMs <= 5000;

    if (timeEl) {
      timeEl.textContent = secStr;
      timeEl.classList.toggle('is-urgent', urgent);
    }
    if (fillEl) {
      fillEl.style.width = pct.toFixed(1) + '%';
      fillEl.classList.toggle('is-urgent', urgent);
    }
  }

  function handleDrillChoice(choice) {
    if (state.drillAnswered || state.drillPhase !== 'active') return;
    const drill = state.drills[state.drillIndex];
    if (!drill) return;

    stopDrillTimer();
    stopSpeech();

    const durationMs = (Number(drill.durationSec) || 15) * 1000;
    const rawElapsed = Math.round(performance.now() - state.drillStartPerf);
    const reactionMs = Math.max(120, Math.min(durationMs, rawElapsed));

    state.drillAnswered = true;
    const passed = Boolean(choice.passed);

    if (passed) {
      playPassChime();
    } else {
      playTrapBuzz();
    }

    const outcome = {
      scenarioId: drill.id,
      title: drill.title,
      weight: Number(drill.weight) || 0,
      choiceId: choice.id,
      passed,
      timedOut: false,
      points: passed ? (Number(choice.points) || Number(drill.weight) || 0) : 0,
      reactionMs,
      missedFlag: passed ? null : (choice.missed_flag || drill.timeoutFlag || 'trap-triggered'),
      lossLabel: passed ? null : (choice.loss_label || null),
      lossInr: passed ? 0 : (Number(choice.simulated_loss_inr) || 0)
    };

    state.drillOutcomes.push(outcome);
    renderDrillView();
    postChallengeDrillResult(outcome);
  }

  function handleDrillTimeout() {
    if (state.drillAnswered || state.drillPhase !== 'active') return;
    const drill = state.drills[state.drillIndex];
    if (!drill) return;

    stopDrillTimer();
    stopSpeech();

    const durationMs = (Number(drill.durationSec) || 15) * 1000;
    state.drillAnswered = true;
    state.drillRemainingMs = 0;
    playTrapBuzz();

    const failChoice = (drill.choices || []).find((c) => !c.passed);
    const outcome = {
      scenarioId: drill.id,
      title: drill.title,
      weight: Number(drill.weight) || 0,
      choiceId: null,
      passed: false,
      timedOut: true,
      points: 0,
      reactionMs: durationMs,
      missedFlag: drill.timeoutFlag || (failChoice ? failChoice.missed_flag : 'timeout'),
      lossLabel: failChoice ? failChoice.loss_label : '-₹50,000',
      lossInr: failChoice ? Number(failChoice.simulated_loss_inr) || 50000 : 50000
    };

    state.drillOutcomes.push(outcome);
    renderDrillView();
    postChallengeDrillResult(outcome);
  }

  function advanceDrill() {
    if (state.drillIndex + 1 < state.drills.length) {
      state.drillIndex += 1;
      beginCurrentDrill();
    } else {
      state.drillPhase = 'finale';
      renderDrillView();
    }
  }

  function computeFinaleMetrics() {
    const outcomes = state.drillOutcomes;
    let immunity = 0;
    let dodgedCount = 0;
    let totalReaction = 0;
    let totalLossInr = 0;

    for (let i = 0; i < outcomes.length; i++) {
      const o = outcomes[i];
      immunity += o.points;
      if (o.passed) dodgedCount += 1;
      totalReaction += o.reactionMs;
      totalLossInr += o.lossInr;
    }

    const avgMs = outcomes.length > 0 ? Math.round(totalReaction / outcomes.length) : 0;
    return {
      immunity: Math.max(0, Math.min(100, immunity)),
      dodgedCount,
      totalDrills: state.drills.length || 3,
      avgMs,
      avgSecStr: (avgMs / 1000).toFixed(1) + 's',
      totalLossInr
    };
  }

  // =========================================================================
  // 1080x1350 Verdict Ticket PNG Canvas Generator (Feature 3.1)
  // =========================================================================

  function triggerDataUrlDownload(dataUrl, filename) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function triggerCanvasDownload(canvas, dataUrl, filename) {
    if (typeof canvas.toBlob === 'function') {
      canvas.toBlob((blob) => {
        if (blob && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
          const objUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = objUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => {
            try {
              URL.revokeObjectURL(objUrl);
            } catch {
              // Ignore object URL revoke failure.
            }
          }, 4000);
          return;
        }
        triggerDataUrlDownload(dataUrl, filename);
      }, 'image/png');
    } else {
      triggerDataUrlDownload(dataUrl, filename);
    }
  }

  async function uploadTicketBadge(dataUrl) {
    try {
      const res = await fetch('/api/badge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: 'baitcheck-verdict-' + Date.now() + '.png',
          dataUrl
        })
      });
      if (!res.ok) return;
      const payload = await res.json();
      if (payload && payload.uploaded && payload.url) {
        state.ticketBadgeUrl = payload.url;
        if (state.drillPhase === 'finale') {
          renderDrillView();
        }
      }
    } catch {
      // Quietly rely on local PNG download + inline preview when badge storage is off.
    }
  }

  async function downloadVerdictTicketPng() {
    try {
      if (document.fonts && document.fonts.ready) {
        await Promise.race([
          document.fonts.ready,
          new Promise((resolve) => setTimeout(resolve, 300))
        ]);
      }
    } catch {
      // Proceed cleanly with system fallback fonts.
    }

    const metrics = computeFinaleMetrics();
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Dark paste-up wall background
    ctx.fillStyle = '#161616';
    ctx.fillRect(0, 0, 1080, 1350);

    // 2. Top Signal Yellow safety ribbon
    ctx.fillStyle = '#FEC917';
    ctx.fillRect(0, 0, 1080, 62);
    ctx.fillStyle = '#0D0D0D';
    ctx.font = 'bold 21px Archivo, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t('ticketRibbon'), 540, 39, 1020);

    // 3. Brand stamp + serial header
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FEC917';
    ctx.fillRect(64, 104, 240, 56);
    ctx.fillStyle = '#0D0D0D';
    ctx.font = '800 32px "Archivo Narrow", Impact, sans-serif';
    ctx.fillText('BAITCHECK®', 88, 143, 200);

    const serialCode = 'BC-' + String(Math.floor(1000 + Math.random() * 9000));
    const serialNo = t('ticketSerialPrefix') + serialCode;
    ctx.fillStyle = '#B5B1A6';
    ctx.font = 'bold 24px Consolas, monospace';
    ctx.textAlign = 'right';
    ctx.fillText(serialNo, 1016, 142, 340);

    // 4. Main Verdict Headline
    ctx.textAlign = 'left';
    ctx.fillStyle = '#F7F5EF';
    ctx.font = '800 80px "Archivo Narrow", Impact, sans-serif';
    const headline =
      metrics.immunity === 100
        ? t('finaleDodged')
        : metrics.immunity >= 65
          ? t('finalePartial')
          : t('finaleTrapped');
    ctx.fillText(headline, 64, 256, 952);

    ctx.fillStyle = '#FEC917';
    ctx.font = 'bold 26px Archivo, Arial, sans-serif';
    const subLine = state.activeChallenge
      ? `${t('ticketSubChallengePrefix')}${state.activeChallenge.target_label} (${t('ticketSubChallengeFrom')}${state.activeChallenge.creator_name})`
      : t('ticketSubDefault');
    ctx.fillText(subLine, 64, 304, 952);

    // 5. Split-Flap Metrics Row
    const boxW = 296;
    const boxY = 342;
    const boxH = 166;
    const boxes = [
      { val: metrics.immunity + '%', lbl: t('metricImmunity') },
      { val: metrics.avgSecStr, lbl: t('metricAvgSpeed') },
      { val: `${metrics.dodgedCount}/${metrics.totalDrills}`, lbl: t('metricDodged') }
    ];

    for (let i = 0; i < boxes.length; i++) {
      const bx = 64 + i * (boxW + 32);
      ctx.fillStyle = '#0D0D0D';
      ctx.fillRect(bx, boxY, boxW, boxH);
      ctx.strokeStyle = '#FEC917';
      ctx.lineWidth = 3;
      ctx.strokeRect(bx, boxY, boxW, boxH);

      // Split-flap horizontal line centered cleanly across tile digits
      ctx.strokeStyle = 'rgba(255,255,255,0.16)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bx, boxY + 76);
      ctx.lineTo(bx + boxW, boxY + 76);
      ctx.stroke();

      ctx.fillStyle = '#FEC917';
      ctx.textAlign = 'center';
      ctx.font = '800 64px "Archivo Narrow", Impact, sans-serif';
      ctx.fillText(boxes[i].val, bx + boxW / 2, boxY + 96, boxW - 24);

      ctx.fillStyle = '#B5B1A6';
      ctx.font = 'bold 20px Archivo, Arial, sans-serif';
      ctx.fillText(boxes[i].lbl, bx + boxW / 2, boxY + 142, boxW - 24);
    }

    // 6. Perforated Ticket Card
    const cardX = 64;
    const cardY = 552;
    const cardW = 952;
    const cardH = 520;

    // Hard ink shadow
    ctx.fillStyle = '#000000';
    ctx.fillRect(cardX + 10, cardY + 10, cardW, cardH);

    // White ticket paper
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(cardX, cardY, cardW, cardH);

    // Yellow stub on left
    ctx.fillStyle = '#FEC917';
    ctx.fillRect(cardX, cardY, 176, cardH);

    // Ticket border
    ctx.strokeStyle = '#0D0D0D';
    ctx.lineWidth = 4;
    ctx.strokeRect(cardX, cardY, cardW, cardH);

    // Dashed tear line
    ctx.setLineDash([12, 10]);
    ctx.beginPath();
    ctx.moveTo(cardX + 176, cardY);
    ctx.lineTo(cardX + 176, cardY + cardH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Mechanical punch hole
    ctx.fillStyle = '#161616';
    ctx.beginPath();
    ctx.arc(cardX + 88, cardY + 72, 22, 0, Math.PI * 2);
    ctx.fill();

    // Stub vertical label
    ctx.save();
    ctx.translate(cardX + 102, cardY + 460);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#0D0D0D';
    ctx.textAlign = 'left';
    ctx.font = '800 28px "Archivo Narrow", Impact, sans-serif';
    ctx.fillText(t('ticketStubVertical') + serialCode, 0, 0, 350);
    ctx.restore();

    // Ticket body rows
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0D0D0D';
    ctx.font = '800 34px "Archivo Narrow", Impact, sans-serif';
    ctx.fillText(t('ticketHeadline'), cardX + 216, cardY + 64, 700);

    const outcomes = state.drillOutcomes;
    for (let i = 0; i < outcomes.length; i++) {
      const o = outcomes[i];
      const ry = cardY + 102 + i * 114;
      ctx.fillStyle = '#FCFAF6';
      ctx.fillRect(cardX + 216, ry, 700, 92);
      ctx.strokeStyle = '#0D0D0D';
      ctx.lineWidth = 2;
      ctx.strokeRect(cardX + 216, ry, 700, 92);

      const titleTxt = loc(o.title) || o.scenarioId;
      ctx.fillStyle = '#0D0D0D';
      ctx.font = 'bold 24px Archivo, Arial, sans-serif';
      ctx.fillText((i + 1) + '. ' + titleTxt, cardX + 236, ry + 38, 474);

      ctx.fillStyle = '#5A5850';
      ctx.font = 'bold 21px Consolas, monospace';
      ctx.fillText(
        `${t('reactionLabel')}: ${(o.reactionMs / 1000).toFixed(1)}s`,
        cardX + 236,
        ry + 72,
        474
      );

      const badgeW = 170;
      const badgeX = cardX + 730;
      ctx.fillStyle = o.passed ? '#067647' : '#D92D20';
      ctx.fillRect(badgeX, ry + 22, badgeW, 48);
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.font = '800 22px "Archivo Narrow", Impact, sans-serif';
      ctx.fillText(
        o.passed ? t('passTag') : (o.lossLabel || t('failTag')),
        badgeX + badgeW / 2,
        ry + 54,
        badgeW - 16
      );
      ctx.textAlign = 'left';
    }

    // Simulated loss summary line inside ticket
    ctx.fillStyle = metrics.totalLossInr > 0 ? '#D92D20' : '#067647';
    ctx.font = '800 25px Archivo, Arial, sans-serif';
    const lossLine =
      metrics.totalLossInr > 0
        ? `${t('ticketLostTag')} -₹${metrics.totalLossInr.toLocaleString('en-IN')}${t('ticketLossRetry')}`
        : t('ticketLossZero');
    ctx.fillText(lossLine, cardX + 216, cardY + 482, 700);

    // 7. 1930 Golden-Hour Strip & Footer
    ctx.fillStyle = '#F2EFE7';
    ctx.fillRect(64, 1110, 952, 116);
    ctx.fillStyle = '#0D0D0D';
    ctx.font = '800 24px "Archivo Narrow", Impact, sans-serif';
    ctx.fillText(t('ticketPlaybookTitle'), 88, 1152, 904);
    ctx.font = 'bold 21px Archivo, Arial, sans-serif';
    ctx.fillText(t('ticketPlaybookSteps'), 88, 1194, 904);

    ctx.fillStyle = '#FEC917';
    ctx.font = 'bold 28px Consolas, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('baitcheck.embarko.app', 64, 1292, 420);

    ctx.fillStyle = '#B5B1A6';
    ctx.font = 'bold 20px Archivo, Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(t('ticketFooterTagline'), 1016, 1292, 500);

    const dataUrl = canvas.toDataURL('image/png');
    state.ticketPreviewUrl = dataUrl;
    state.ticketDownloadedMsg = t('downloadSuccess');
    triggerCanvasDownload(canvas, dataUrl, 'baitcheck-verdict-ticket.png');
    renderDrillView();
    uploadTicketBadge(dataUrl);
  }

  // =========================================================================
  // Localization Helpers & Link X-Ray Actions
  // =========================================================================

  function localizeXrayVerdict(res) {
    return i18nXrayVerdict(res, state.lang);
  }

  function localizeXrayFinding(f) {
    return i18nXrayFinding(f, state.lang);
  }

  function localizeUpiWarning(upiDecoded) {
    return i18nUpiWarning(upiDecoded, state.lang);
  }

  function formatMissedFlag(flag) {
    return i18nFormatMissedFlag(flag, state.lang);
  }

  function getXrayErrorText() {
    if (state.xrayErrorKey) return t(state.xrayErrorKey);
    return state.xrayErrorCustom || '';
  }

  function getChallengeErrorText() {
    if (state.challengeErrorKey) return t(state.challengeErrorKey);
    return state.challengeErrorCustom || '';
  }

  async function runForensicScan() {
    const trimmed = state.xrayInput.trim();
    if (!trimmed) {
      state.xrayErrorKey = 'xrayEmptyErr';
      state.xrayErrorCustom = '';
      state.xrayResult = null;
      renderXrayView();
      return;
    }

    state.xrayLoading = true;
    state.xrayErrorKey = '';
    state.xrayErrorCustom = '';
    renderXrayView();

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: state.xrayInput })
      });
      const payload = await res.json();
      if (!res.ok) {
        if (payload && payload.code === 'EMPTY_INPUT') {
          state.xrayErrorKey = 'xrayEmptyErr';
          state.xrayErrorCustom = '';
        } else if (payload && payload.error && state.lang === 'en') {
          state.xrayErrorKey = '';
          state.xrayErrorCustom = payload.error;
        } else {
          state.xrayErrorKey = 'xrayFailErr';
          state.xrayErrorCustom = '';
        }
        state.xrayResult = null;
      } else {
        state.xrayResult = payload;
        refreshCohortStats();
      }
    } catch {
      state.xrayErrorKey = 'xrayNetErr';
      state.xrayErrorCustom = '';
      state.xrayResult = null;
    }

    state.xrayLoading = false;
    renderXrayView();
  }

  // =========================================================================
  // Challenge Creator Actions & Local Recent History
  // =========================================================================

  function loadRecentChallenges() {
    try {
      const raw = window.localStorage.getItem(RECENT_CHALLENGES_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((item) => item && typeof item.id === 'string' && typeof item.reportUrl === 'string')
        .slice(0, MAX_RECENT_CHALLENGES);
    } catch {
      return [];
    }
  }

  function saveRecentChallenge(data) {
    if (!data || !data.id) return;
    const entry = {
      id: String(data.id),
      creator_name: String(data.creator_name || ''),
      target_label: String(data.target_label || ''),
      lang: data.lang === 'hi' ? 'hi' : 'en',
      challengeUrl: String(data.challengeUrl || '/c/' + data.id),
      reportUrl: String(data.reportUrl || '/c/' + data.id + '/report'),
      createdAt: data.created_at || new Date().toISOString()
    };
    const existing = loadRecentChallenges().filter((item) => item.id !== entry.id);
    const updated = [entry, ...existing].slice(0, MAX_RECENT_CHALLENGES);
    state.recentChallenges = updated;
    try {
      window.localStorage.setItem(RECENT_CHALLENGES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage quota or private-browsing errors cleanly.
    }
  }

  async function submitChallengeForm(e) {
    e.preventDefault();
    const creatorName = state.challengeCreatorName.trim();
    const targetLabel = state.challengeTargetLabel.trim();

    if (!creatorName || creatorName.length > 40) {
      state.challengeErrorKey = 'challengeCreatorErr';
      state.challengeErrorCustom = '';
      renderChallengeView();
      return;
    }
    if (!targetLabel || targetLabel.length > 40) {
      state.challengeErrorKey = 'challengeTargetErr';
      state.challengeErrorCustom = '';
      renderChallengeView();
      return;
    }

    state.challengeSubmitting = true;
    state.challengeErrorKey = '';
    state.challengeErrorCustom = '';
    renderChallengeView();

    try {
      const res = await fetch('/api/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorName,
          targetLabel,
          lang: state.challengeFormLang
        })
      });
      const data = await res.json();
      if (!res.ok) {
        if (data && data.error && state.lang === 'en') {
          state.challengeErrorKey = '';
          state.challengeErrorCustom = data.error;
        } else {
          state.challengeErrorKey = 'challengeFailErr';
          state.challengeErrorCustom = '';
        }
      } else {
        state.createdChallenge = data;
        state.copiedKey = '';
        saveRecentChallenge(data);
      }
    } catch {
      state.challengeErrorKey = 'challengeNetErr';
      state.challengeErrorCustom = '';
    }

    state.challengeSubmitting = false;
    renderChallengeView();
  }

  async function copyTextSafe(text, keyName) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const tmp = document.createElement('textarea');
        tmp.value = text;
        tmp.setAttribute('readonly', 'true');
        tmp.style.position = 'fixed';
        tmp.style.left = '-9999px';
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand('copy');
        document.body.removeChild(tmp);
      }
      state.copiedKey = keyName;
      renderAll();
      setTimeout(() => {
        if (state.copiedKey === keyName) {
          state.copiedKey = '';
          renderAll();
        }
      }, 2200);
    } catch {
      // Ignore clipboard permission failures gracefully.
    }
  }

  // =========================================================================
  // Rendering: Shell, Drill View, X-Ray, Challenge, Report, Companion
  // =========================================================================

  function renderTopBar() {
    document.documentElement.lang = state.lang;
    els.safetyRibbonText.textContent = t('safetyRibbon');
    els.footerDisclaimer.textContent = t('footerDisclaimer');

    els.langEnBtn.classList.toggle('is-active', state.lang === 'en');
    els.langEnBtn.setAttribute('aria-pressed', state.lang === 'en' ? 'true' : 'false');
    els.langHiBtn.classList.toggle('is-active', state.lang === 'hi');
    els.langHiBtn.setAttribute('aria-pressed', state.lang === 'hi' ? 'true' : 'false');

    els.soundToggleLabel.textContent = state.muted ? t('soundOff') : t('soundOn');
    els.soundToggleBtn.classList.toggle('is-muted', state.muted);
    els.soundToggleBtn.setAttribute('aria-pressed', state.muted ? 'false' : 'true');

    els.tabDrillLabel.textContent = t('tabDrill');
    els.tabXrayLabel.textContent = t('tabXray');
    els.tabChallengeLabel.textContent = t('tabChallenge');

    const activeTab =
      state.route.mode === 'report'
        ? 'challenge'
        : state.route.mode === 'challenge-drill'
          ? 'drill'
          : state.route.tab;

    els.tabDrillBtn.classList.toggle('is-active', activeTab === 'drill');
    els.tabXrayBtn.classList.toggle('is-active', activeTab === 'xray');
    els.tabChallengeBtn.classList.toggle('is-active', activeTab === 'challenge');

    if (activeTab === 'drill') els.tabDrillBtn.setAttribute('aria-current', 'page');
    else els.tabDrillBtn.removeAttribute('aria-current');

    if (activeTab === 'xray') els.tabXrayBtn.setAttribute('aria-current', 'page');
    else els.tabXrayBtn.removeAttribute('aria-current');

    if (activeTab === 'challenge') els.tabChallengeBtn.setAttribute('aria-current', 'page');
    else els.tabChallengeBtn.removeAttribute('aria-current');

    els.viewDrill.classList.toggle(
      'is-hidden',
      !(state.route.mode === 'challenge-drill' || (state.route.mode === 'tab' && state.route.tab === 'drill'))
    );
    els.viewXray.classList.toggle('is-hidden', !(state.route.mode === 'tab' && state.route.tab === 'xray'));
    els.viewChallenge.classList.toggle('is-hidden', !(state.route.mode === 'tab' && state.route.tab === 'challenge'));
    els.viewReport.classList.toggle('is-hidden', state.route.mode !== 'report');
  }

  function renderDrillView() {
    const container = els.viewDrill;
    clearEl(container);

    // 404 or error on /c/:id
    if (state.route.mode === 'challenge-drill' && state.challengeLoadError) {
      const sheet = createEl('div', 'newsprint-sheet');
      const card = createEl('div', 'paper-card stack-base');
      card.appendChild(createEl('p', 'eyebrow', '404 • CHALLENGE'));
      card.appendChild(createEl('h1', 'display-md', t('challengeNotFoundTitle')));
      card.appendChild(createEl('p', 'body-md', t('challengeNotFoundBody')));

      const actions = createEl('div', 'stack-sm');
      const freshBtn = createEl('button', 'button-primary button-full', t('startFreshDrillBtn'));
      freshBtn.type = 'button';
      freshBtn.addEventListener('click', () => navigateTo('/'));
      actions.appendChild(freshBtn);

      const newChalBtn = createEl('button', 'button-dark button-full', t('createChallengeBtn'));
      newChalBtn.type = 'button';
      newChalBtn.addEventListener('click', () => navigateTo('/?tab=challenge'));
      actions.appendChild(newChalBtn);

      card.appendChild(actions);
      sheet.appendChild(card);
      container.appendChild(sheet);
      return;
    }

    // Loading /api/drills
    if (!state.loaded && !state.loadError) {
      const wall = createEl('div', 'poster-wall');
      const card = createEl('div', 'incoming-call-card stack-sm');
      card.appendChild(createEl('h1', 'display-md', t('loadingTitle')));
      card.appendChild(createEl('p', 'body-md', t('loadingBody')));
      wall.appendChild(card);
      container.appendChild(wall);
      return;
    }

    if (state.loadError) {
      const sheet = createEl('div', 'newsprint-sheet');
      const card = createEl('div', 'trap-alert-banner stack-md');
      card.appendChild(createEl('h1', 'display-md', t('loadErrorTitle')));
      card.appendChild(createEl('p', 'body-md', t('loadErrorBody')));
      const retry = createEl('button', 'button-primary button-full', t('retryBtn'));
      retry.type = 'button';
      retry.addEventListener('click', fetchDrillsAndStats);
      card.appendChild(retry);
      sheet.appendChild(card);
      container.appendChild(sheet);
      return;
    }

    // Phase 0: Screen 0 Incoming Call Hero
    if (state.drillPhase === 'hero') {
      const wall = createEl('div', 'poster-wall');

      if (state.activeChallenge) {
        const banner = createEl('div', 'challenge-banner');
        const bannerTitle = createEl(
          'p',
          'challenge-banner-title',
          `${t('challengeBannerPrefix')} ${state.activeChallenge.creator_name} ${t('challengeBannerFor')} ${state.activeChallenge.target_label}`
        );
        banner.appendChild(bannerTitle);
        wall.appendChild(banner);
      }

      const card = createEl('div', 'incoming-call-card');
      const meta = createEl('div', 'call-header-meta');
      meta.appendChild(createEl('span', 'eyebrow eyebrow--dark', t('heroEyebrow')));

      const recPill = createEl('span', 'rec-pill');
      recPill.appendChild(createEl('span', 'rec-dot'));
      recPill.appendChild(document.createTextNode('INCOMING • SIMULATED'));
      meta.appendChild(recPill);
      card.appendChild(meta);

      const callerStage = createEl('div', 'caller-ring-stage');
      const pulseFrame = createEl('div', 'pulse-frame');
      pulseFrame.appendChild(buildCallerEmblemSvg());
      callerStage.appendChild(pulseFrame);

      const callerMeta = createEl('div', 'caller-meta');
      const firstDrill = state.drills[0];
      const entityName = firstDrill ? loc(firstDrill.entity) : 'Central Cyber Desk (Simulated)';
      callerMeta.appendChild(createEl('p', 'caller-name', entityName));
      callerMeta.appendChild(createEl('p', 'caller-sub', t('heroCallerSub')));
      callerStage.appendChild(callerMeta);
      card.appendChild(callerStage);

      const h1 = createEl('h1', 'display-xl');
      h1.appendChild(document.createTextNode(t('heroHeadlinePre')));
      h1.appendChild(createEl('span', 'highlight-mark', t('heroHeadlineMark')));
      card.appendChild(h1);

      card.appendChild(createEl('p', 'hero-value-prop', t('heroValueProp')));

      const statsRow = createEl('div', 'hero-checklist');
      const chips = [
        [t('statTrapsVal'), t('statTrapsLbl')],
        [t('statClockVal'), t('statClockLbl')],
        [t('statLangVal'), t('statLangLbl')]
      ];
      for (let i = 0; i < chips.length; i++) {
        const chip = createEl('div', 'hero-stat-chip');
        chip.appendChild(createEl('strong', '', chips[i][0]));
        chip.appendChild(createEl('span', '', chips[i][1]));
        statsRow.appendChild(chip);
      }
      card.appendChild(statsRow);

      const answerBtn = createEl('button', 'button-primary button-full', t('answerCta'));
      answerBtn.type = 'button';
      answerBtn.id = 'answer-start-drill-btn';
      answerBtn.addEventListener('click', startDrillSequence);
      card.appendChild(answerBtn);

      const quickRow = createEl('div', 'quick-links-row');
      const qXray = createEl('button', 'button-dark', t('quickXrayBtn'));
      qXray.type = 'button';
      qXray.addEventListener('click', () => navigateTo('/?tab=xray'));
      quickRow.appendChild(qXray);

      const qChal = createEl('button', 'button-dark', t('quickChallengeBtn'));
      qChal.type = 'button';
      qChal.addEventListener('click', () => navigateTo('/?tab=challenge'));
      quickRow.appendChild(qChal);
      card.appendChild(quickRow);

      wall.appendChild(card);
      container.appendChild(wall);
      return;
    }

    // Phase 1: Active Drill 1, 2, or 3
    if (state.drillPhase === 'active') {
      const drill = state.drills[state.drillIndex];
      const sheet = createEl('div', 'newsprint-sheet');

      if (state.activeChallenge) {
        const banner = createEl('div', 'challenge-banner');
        banner.appendChild(
          createEl(
            'p',
            'challenge-banner-title',
            `${t('challengeBannerPrefix')} ${state.activeChallenge.creator_name} ${t('challengeBannerFor')} ${state.activeChallenge.target_label}`
          )
        );
        sheet.appendChild(banner);
      }

      const topStrip = createEl('div', 'drill-top-strip');
      topStrip.appendChild(
        createEl('span', 'eyebrow', `${t('drillPrefix')} ${state.drillIndex + 1} ${t('ofLabel')} ${state.drills.length}`)
      );
      topStrip.appendChild(createEl('span', 'status-tag status-tag--warn', drill.badge || 'SIMULATED'));
      sheet.appendChild(topStrip);

      // Countdown bar
      const durationMs = (Number(drill.durationSec) || 15) * 1000;
      const countdownBox = createEl('div', 'countdown-box');
      const cdHeader = createEl('div', 'countdown-header');
      cdHeader.appendChild(createEl('span', 'eyebrow eyebrow--dark', t('clockLabel')));
      const cdTime = createEl('span', 'countdown-time', (state.drillRemainingMs / 1000).toFixed(1) + 's');
      cdTime.id = 'drill-countdown-time';
      if (state.drillRemainingMs <= 5000) cdTime.classList.add('is-urgent');
      cdHeader.appendChild(cdTime);
      countdownBox.appendChild(cdHeader);

      const cdTrack = createEl('div', 'countdown-track');
      const cdFill = createEl('div', 'countdown-fill');
      cdFill.id = 'drill-countdown-fill';
      cdFill.style.width = Math.max(0, Math.min(100, (state.drillRemainingMs / durationMs) * 100)).toFixed(1) + '%';
      if (state.drillRemainingMs <= 5000) cdFill.classList.add('is-urgent');
      cdTrack.appendChild(cdFill);
      countdownBox.appendChild(cdTrack);
      sheet.appendChild(countdownBox);

      const drillCard = createEl('div', 'paper-card');
      drillCard.appendChild(createEl('div', 'masking-tape'));
      drillCard.appendChild(createEl('p', 'eyebrow', loc(drill.entity)));
      drillCard.appendChild(createEl('h2', 'display-md', loc(drill.title)));

      // Mode-specific prop
      if (drill.mode === 'video-call') {
        const frame = createEl('div', 'drill-visual-frame drill-visual--video');
        const info = createEl('div', 'stack-sm');
        const rec = createEl('span', 'rec-pill');
        rec.appendChild(createEl('span', 'rec-dot'));
        rec.appendChild(document.createTextNode(drill.badge));
        info.appendChild(rec);
        info.appendChild(createEl('strong', 'body-md', loc(drill.entity)));
        frame.appendChild(info);

        const sil = createEl('div', 'silhouette-box');
        sil.appendChild(buildSilhouetteSvg());
        frame.appendChild(sil);
        drillCard.appendChild(frame);
      } else if (drill.mode === 'chat-attachment') {
        const frame = createEl('div', 'drill-visual-frame drill-visual--chat');
        frame.appendChild(createEl('div', 'chat-bubble-meta', loc(drill.entity) + ' • CHAT LURE'));
        frame.appendChild(createEl('div', 'caption-txt', t('inspectApkHint')));

        const pillBtn = createEl('button', 'apk-pill-btn');
        pillBtn.type = 'button';
        pillBtn.appendChild(createEl('span', '', drill.attachment ? drill.attachment.pillText : 'Notice.pdf.apk'));
        pillBtn.appendChild(createEl('span', 'apk-pill-badge', 'SIMULATED'));
        pillBtn.addEventListener('click', () => {
          state.apkNoticeShown = true;
          renderDrillView();
        });
        frame.appendChild(pillBtn);

        if (state.apkNoticeShown) {
          frame.appendChild(createEl('div', 'apk-sim-notice', t('apkSimNotice')));
        }
        drillCard.appendChild(frame);
      } else if (drill.mode === 'upi-collect') {
        const frame = createEl('div', 'drill-visual-frame drill-visual--upi');
        frame.appendChild(createEl('p', 'eyebrow', t('upiCollectHeader')));
        const row = createEl('div', 'upi-amount-row');
        row.appendChild(createEl('span', 'upi-amount-big', drill.collectMeta ? drill.collectMeta.amountDisplay : '₹4,500'));
        row.appendChild(createEl('span', 'status-tag status-tag--warn', 'COLLECT'));
        frame.appendChild(row);
        frame.appendChild(
          createEl('div', 'body-md', drill.collectMeta ? loc(drill.collectMeta.prompt) : '')
        );
        frame.appendChild(createEl('div', 'caption-txt', t('upiCollectSub')));
        drillCard.appendChild(frame);
      }

      // Always-on >=18px Caption Box
      const capBox = createEl('div', 'caption-box');
      capBox.appendChild(createEl('span', 'caption-label', t('captionLabel')));
      capBox.appendChild(createEl('p', 'caption-script', loc(drill.script)));
      drillCard.appendChild(capBox);

      // Choice buttons
      const choicesList = createEl('div', 'choices-list');
      const lastOutcome = state.drillAnswered ? state.drillOutcomes[state.drillOutcomes.length - 1] : null;
      const choices = drill.choices || [];

      for (let i = 0; i < choices.length; i++) {
        const ch = choices[i];
        const btn = createEl('button', 'drill-choice-card');
        btn.type = 'button';
        btn.disabled = state.drillAnswered;

        if (lastOutcome && lastOutcome.choiceId === ch.id) {
          btn.classList.add(ch.passed ? 'is-selected-pass' : 'is-selected-fail');
        }

        btn.appendChild(createEl('span', '', loc(ch.label)));
        btn.addEventListener('click', () => handleDrillChoice(ch));
        choicesList.appendChild(btn);
      }
      drillCard.appendChild(choicesList);

      // Immediate Debrief Banner
      if (state.drillAnswered && lastOutcome) {
        const banner = createEl('div', lastOutcome.passed ? 'safe-pass-banner' : 'trap-alert-banner');
        const headingText = lastOutcome.timedOut
          ? `${t('timeoutTitle')} (${lastOutcome.lossLabel || '-₹50,000'})`
          : lastOutcome.passed
            ? loc(drill.debrief.passTitle)
            : loc(drill.debrief.trapTitle);

        banner.appendChild(createEl('h3', 'debrief-title', headingText));
        banner.appendChild(
          createEl(
            'p',
            'mono-tabular',
            `${t('reactionLabel')}: ${(lastOutcome.reactionMs / 1000).toFixed(1)}s (${lastOutcome.reactionMs} ms)`
          )
        );
        banner.appendChild(createEl('p', 'debrief-body', loc(drill.debrief.explanation)));

        if (state.syncStatus === 'saving') {
          banner.appendChild(createEl('p', 'caption-txt', t('savingResult')));
        } else if (state.syncStatus === 'saved') {
          banner.appendChild(createEl('p', 'caption-txt', t('savedResult')));
        } else if (state.syncStatus === 'error') {
          banner.appendChild(createEl('p', 'caption-txt', t('saveResultErr')));
        }

        const nextLabel =
          state.drillIndex + 1 < state.drills.length ? t('nextDrillBtn') : t('viewVerdictBtn');
        const nextBtn = createEl('button', 'button-primary button-full', nextLabel);
        nextBtn.type = 'button';
        nextBtn.addEventListener('click', advanceDrill);
        banner.appendChild(nextBtn);

        drillCard.appendChild(banner);
      }

      sheet.appendChild(drillCard);
      container.appendChild(sheet);
      return;
    }

    // Phase 2: Finale Verdict Ticket
    renderFinaleView(container);
  }

  function renderFinaleView(container) {
    const metrics = computeFinaleMetrics();
    const wall = createEl('div', 'poster-wall');

    if (state.activeChallenge) {
      const banner = createEl('div', 'challenge-banner');
      banner.appendChild(
        createEl(
          'p',
          'challenge-banner-title',
          `${t('challengeBannerPrefix')} ${state.activeChallenge.creator_name} ${t('challengeBannerFor')} ${state.activeChallenge.target_label}`
        )
      );
      wall.appendChild(banner);
    }

    wall.appendChild(createEl('p', 'eyebrow eyebrow--dark', t('finaleEyebrow')));

    const headlineText =
      metrics.immunity === 100
        ? t('finaleDodged')
        : metrics.immunity >= 65
          ? t('finalePartial')
          : t('finaleTrapped');
    wall.appendChild(createEl('h1', 'display-xl', headlineText));
    wall.appendChild(
      createEl(
        'p',
        'body-md',
        metrics.immunity === 100 ? t('finaleSubDodged') : t('finaleSubTrapped')
      )
    );

    // Split-Flap Tiles
    const flapGrid = createEl('div', 'split-flap-grid');
    const flapData = [
      [metrics.immunity + '%', t('metricImmunity')],
      [metrics.avgSecStr, t('metricAvgSpeed')],
      [`${metrics.dodgedCount}/${metrics.totalDrills}`, t('metricDodged')]
    ];
    for (let i = 0; i < flapData.length; i++) {
      const tile = createEl('div', 'split-flap-tile');
      tile.appendChild(createEl('span', 'split-flap-val', flapData[i][0]));
      tile.appendChild(createEl('span', 'split-flap-lbl', flapData[i][1]));
      flapGrid.appendChild(tile);
    }
    wall.appendChild(flapGrid);

    // Perforated Verdict Ticket
    const ticket = createEl('div', 'verdict-ticket');
    const stub = createEl('div', 'ticket-stub');
    stub.appendChild(createEl('div', 'ticket-punch-hole'));
    const stubMeta = createEl('div');
    stubMeta.appendChild(createEl('div', 'mono-tabular', 'NO. BC-2026'));
    stubMeta.appendChild(createEl('div', 'title-card', t('ticketStubTitle')));
    stub.appendChild(stubMeta);
    ticket.appendChild(stub);

    const tbody = createEl('div', 'ticket-body');
    tbody.appendChild(createEl('h2', 'title-card', t('ticketHeadline')));
    const lossSummary =
      metrics.totalLossInr > 0
        ? `${t('ticketLostTag')} -₹${metrics.totalLossInr.toLocaleString('en-IN')}`
        : t('ticketSavedTag');
    tbody.appendChild(createEl('p', 'mono-tabular', lossSummary));

    const rowsWrap = createEl('div', 'ticket-rows');
    for (let i = 0; i < state.drillOutcomes.length; i++) {
      const o = state.drillOutcomes[i];
      const row = createEl('div', 'ticket-drill-row');
      const left = createEl('div');
      left.appendChild(createEl('div', 'body-md', `${i + 1}. ${loc(o.title)}`));
      left.appendChild(createEl('div', 'mono-tabular', `${(o.reactionMs / 1000).toFixed(1)}s`));
      row.appendChild(left);

      const tag = createEl(
        'span',
        'status-tag ' + (o.passed ? 'status-tag--pass' : 'status-tag--fail'),
        o.passed ? t('passTag') : (o.lossLabel || t('failTag'))
      );
      row.appendChild(tag);
      rowsWrap.appendChild(row);
    }
    tbody.appendChild(rowsWrap);
    ticket.appendChild(tbody);
    wall.appendChild(ticket);

    // Action Buttons
    const actions = createEl('div', 'stack-sm');

    const dlBtn = createEl('button', 'button-primary button-full', t('downloadTicketBtn'));
    dlBtn.type = 'button';
    dlBtn.addEventListener('click', downloadVerdictTicketPng);
    actions.appendChild(dlBtn);

    if (state.ticketDownloadedMsg) {
      actions.appendChild(createEl('p', 'caption-txt', state.ticketDownloadedMsg));
    }

    if (state.ticketPreviewUrl) {
      const previewWrap = createEl('div', 'ticket-preview-box stack-sm');
      previewWrap.appendChild(createEl('span', 'eyebrow eyebrow--dark', t('ticketPreviewLabel')));
      const img = createEl('img', 'ticket-preview-img');
      img.src = state.ticketPreviewUrl;
      img.alt = t('ticketPreviewLabel');
      previewWrap.appendChild(img);
      previewWrap.appendChild(createEl('p', 'caption-txt ticket-preview-hint', t('ticketPreviewHint')));
      if (state.ticketBadgeUrl) {
        previewWrap.appendChild(createEl('span', 'eyebrow eyebrow--dark', t('ticketBadgeUrlLabel')));
        const badgeLink = createEl('a', 'share-url-box', state.ticketBadgeUrl);
        badgeLink.href = state.ticketBadgeUrl;
        badgeLink.target = '_blank';
        badgeLink.rel = 'noopener noreferrer';
        previewWrap.appendChild(badgeLink);
      }
      actions.appendChild(previewWrap);
    }

    if (state.route.mode === 'challenge-drill' && state.route.challengeId) {
      const reportBtn = createEl('button', 'button-dark button-full', t('openChallengeReportBtn'));
      reportBtn.type = 'button';
      reportBtn.addEventListener('click', () =>
        navigateTo('/c/' + encodeURIComponent(state.route.challengeId) + '/report')
      );
      actions.appendChild(reportBtn);
    }

    const chalBtn = createEl('button', 'button-dark button-full', t('challengeFamilyBtn'));
    chalBtn.type = 'button';
    chalBtn.addEventListener('click', () => navigateTo('/?tab=challenge'));
    actions.appendChild(chalBtn);

    const replayBtn = createEl('button', 'button-ghost-light button-full', t('replayDrillBtn'));
    replayBtn.type = 'button';
    replayBtn.addEventListener('click', () => {
      state.drillPhase = 'hero';
      state.drillIndex = 0;
      state.drillOutcomes = [];
      state.ticketDownloadedMsg = '';
      state.ticketPreviewUrl = '';
      state.ticketBadgeUrl = '';
      renderDrillView();
    });
    actions.appendChild(replayBtn);

    wall.appendChild(actions);
    container.appendChild(wall);
  }

  function renderXrayView() {
    const container = els.viewXray;
    clearEl(container);

    const sheet = createEl('div', 'newsprint-sheet stack-base');
    const head = createEl('div');
    head.appendChild(createEl('p', 'eyebrow', t('xrayEyebrow')));
    head.appendChild(createEl('h1', 'display-md', t('xrayTitle')));
    head.appendChild(createEl('p', 'body-md', t('xraySub')));
    sheet.appendChild(head);

    // 1-Tap Sample Presets
    const presetsWrap = createEl('div');
    presetsWrap.appendChild(createEl('span', 'eyebrow', t('xrayPresetsLbl')));
    const presetGrid = createEl('div', 'preset-grid');
    for (let i = 0; i < state.presets.length; i++) {
      const preset = state.presets[i];
      const chip = createEl('button', 'preset-chip', loc(preset.label));
      chip.type = 'button';
      if (state.xraySelectedPresetId === preset.id) {
        chip.classList.add('is-active');
      }
      chip.addEventListener('click', () => {
        state.xraySelectedPresetId = preset.id;
        state.xrayInput = preset.text;
        state.xrayErrorKey = '';
        state.xrayErrorCustom = '';
        runForensicScan();
      });
      presetGrid.appendChild(chip);
    }
    presetsWrap.appendChild(presetGrid);
    sheet.appendChild(presetsWrap);

    // Textarea + Char Counter
    const inputWrap = createEl('div', 'stack-sm');
    const lblRow = createEl('label', 'field-label');
    lblRow.setAttribute('for', 'xray-textarea');
    lblRow.appendChild(createEl('span', '', t('xrayInputLbl')));
    const counterSpan = createEl('span', 'mono-tabular', `${state.xrayInput.length} / ${MAX_XRAY_LENGTH}`);
    counterSpan.id = 'xray-char-counter';
    lblRow.appendChild(counterSpan);
    inputWrap.appendChild(lblRow);

    const textarea = createEl('textarea', 'editorial-textarea');
    textarea.id = 'xray-textarea';
    textarea.maxLength = MAX_XRAY_LENGTH;
    textarea.placeholder = t('xrayPlaceholder');
    textarea.value = state.xrayInput;
    textarea.addEventListener('input', (e) => {
      state.xrayInput = e.target.value;
      state.xraySelectedPresetId = null;
      const c = document.getElementById('xray-char-counter');
      if (c) c.textContent = `${state.xrayInput.length} / ${MAX_XRAY_LENGTH}`;
    });
    inputWrap.appendChild(textarea);

    const btnRow = createEl('div', 'row-wrap');
    const analyzeBtn = createEl(
      'button',
      'button-primary',
      state.xrayLoading ? t('xrayScanningBtn') : t('xrayAnalyzeBtn')
    );
    analyzeBtn.type = 'button';
    analyzeBtn.style.flex = '1 1 200px';
    analyzeBtn.disabled = state.xrayLoading;
    analyzeBtn.addEventListener('click', runForensicScan);
    btnRow.appendChild(analyzeBtn);

    const clearBtn = createEl('button', 'button-ghost-light', t('xrayClearBtn'));
    clearBtn.type = 'button';
    clearBtn.addEventListener('click', () => {
      state.xrayInput = '';
      state.xraySelectedPresetId = null;
      state.xrayResult = null;
      state.xrayErrorKey = '';
      state.xrayErrorCustom = '';
      renderXrayView();
    });
    btnRow.appendChild(clearBtn);
    inputWrap.appendChild(btnRow);

    const xrayErrorText = getXrayErrorText();
    if (xrayErrorText) {
      inputWrap.appendChild(createEl('div', 'trap-alert-banner', xrayErrorText));
    }
    sheet.appendChild(inputWrap);

    // Results Panel
    if (state.xrayResult) {
      const res = state.xrayResult;
      const meterCard = createEl('div', 'risk-meter-wrap stack-sm');

      const scoreRow = createEl('div', 'risk-score-row');
      const leftScore = createEl('div');
      leftScore.appendChild(createEl('span', 'eyebrow', t('xrayRiskScoreLbl')));
      leftScore.appendChild(createEl('div', 'display-xl', `${res.riskScore}/100`));
      scoreRow.appendChild(leftScore);

      const rightMeta = createEl('div', 'stack-sm');
      rightMeta.style.alignItems = 'flex-end';
      const verdictClass =
        res.verdictLevel === 'high'
          ? 'status-tag--fail'
          : res.verdictLevel === 'medium'
            ? 'status-tag--warn'
            : 'status-tag--pass';
      rightMeta.appendChild(createEl('span', 'status-tag ' + verdictClass, localizeXrayVerdict(res)));
      rightMeta.appendChild(createEl('span', 'mono-tabular', `${t('xrayLatencyLbl')}: ${res.elapsedMs} ms`));
      scoreRow.appendChild(rightMeta);
      meterCard.appendChild(scoreRow);

      const track = createEl('div', 'risk-bar-track');
      const fill = createEl('div', 'risk-bar-fill');
      fill.style.width = `${Math.max(4, Math.min(100, res.riskScore))}%`;
      if (res.verdictLevel === 'high') fill.classList.add('is-high');
      else if (res.verdictLevel === 'medium') fill.classList.add('is-medium');
      track.appendChild(fill);
      meterCard.appendChild(track);
      sheet.appendChild(meterCard);

      // Inline Highlighted Preview (Strictly built with createElement + textContent)
      if (Array.isArray(res.highlightedSegments) && res.highlightedSegments.length > 0) {
        const hlCard = createEl('div', 'paper-card stack-sm');
        hlCard.appendChild(createEl('span', 'eyebrow', t('xrayHighlightTitle')));
        const preview = createEl('div', 'xray-highlight-box');
        for (let i = 0; i < res.highlightedSegments.length; i++) {
          const seg = res.highlightedSegments[i];
          if (seg.highlight === 'danger') {
            preview.appendChild(createEl('mark', 'hl-danger', seg.text));
          } else if (seg.highlight === 'warn') {
            preview.appendChild(createEl('mark', 'hl-warn', seg.text));
          } else {
            preview.appendChild(document.createTextNode(seg.text));
          }
        }
        hlCard.appendChild(preview);
        sheet.appendChild(hlCard);
      }

      // Decoded UPI Table
      if (res.upiDecoded) {
        const upiCard = createEl('div', 'paper-card stack-sm');
        upiCard.appendChild(createEl('span', 'eyebrow', t('xrayUpiTitle')));

        const warnBox = createEl('div', 'trap-alert-banner');
        warnBox.style.marginTop = '0';
        warnBox.appendChild(createEl('strong', 'body-md', localizeUpiWarning(res.upiDecoded)));
        upiCard.appendChild(warnBox);

        const table = createEl('table', 'upi-table');
        const tbody = createEl('tbody');
        const isHi = state.lang === 'hi';
        const fields = [
          [isHi ? 'pa (भुगतान VPA)' : 'pa (Payee VPA)', res.upiDecoded.pa],
          [isHi ? 'pn (पाने वाले का नाम)' : 'pn (Payee Name)', res.upiDecoded.pn],
          [isHi ? 'am (राशि ₹)' : 'am (Amount ₹)', res.upiDecoded.am],
          [isHi ? 'cu (मुद्रा)' : 'cu (Currency)', res.upiDecoded.cu],
          [isHi ? 'tn (विवरण)' : 'tn (Note)', res.upiDecoded.tn],
          ['mode', res.upiDecoded.mode],
          [isHi ? 'tr (संदर्भ)' : 'tr (Ref)', res.upiDecoded.tr]
        ];
        for (let i = 0; i < fields.length; i++) {
          if (!fields[i][1]) continue;
          const tr = createEl('tr');
          tr.appendChild(createEl('th', '', fields[i][0]));
          tr.appendChild(createEl('td', 'mono-tabular', fields[i][1]));
          tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        upiCard.appendChild(table);
        sheet.appendChild(upiCard);
      }

      // Forensic Findings
      const findingsWrap = createEl('div', 'stack-sm');
      findingsWrap.appendChild(createEl('span', 'eyebrow', t('xrayFindingsTitle')));

      if (Array.isArray(res.findings) && res.findings.length > 0) {
        for (let i = 0; i < res.findings.length; i++) {
          const f = res.findings[i];
          const locF = localizeXrayFinding(f);
          const sw = createEl('div', 'finding-swatch' + (f.severity === 'danger' ? ' is-danger' : ''));
          const top = createEl('div', 'row-wrap');
          top.style.justifyContent = 'space-between';
          top.appendChild(createEl('strong', 'title-card', locF.title));
          top.appendChild(
            createEl(
              'span',
              'status-tag ' + (f.severity === 'danger' ? 'status-tag--fail' : 'status-tag--warn'),
              `+${f.points} ${t('xrayRiskUnit')}`
            )
          );
          sw.appendChild(top);
          sw.appendChild(createEl('p', 'body-md', locF.detail));

          if (Array.isArray(f.matchedTokens) && f.matchedTokens.length > 0) {
            const chips = createEl('div', 'token-chips');
            for (let j = 0; j < f.matchedTokens.length; j++) {
              chips.appendChild(createEl('span', 'token-chip', f.matchedTokens[j]));
            }
            sw.appendChild(chips);
          }
          findingsWrap.appendChild(sw);
        }
      } else {
        const safeBanner = createEl('div', 'safe-pass-banner');
        safeBanner.style.marginTop = '0';
        safeBanner.appendChild(createEl('h3', 'debrief-title', t('xraySafeTitle')));
        safeBanner.appendChild(createEl('p', 'debrief-body', t('xraySafeBody')));
        findingsWrap.appendChild(safeBanner);
      }
      sheet.appendChild(findingsWrap);
    }

    container.appendChild(sheet);
  }

  function renderChallengeView() {
    const container = els.viewChallenge;
    clearEl(container);

    const sheet = createEl('div', 'newsprint-sheet stack-base');
    const head = createEl('div');
    head.appendChild(createEl('p', 'eyebrow', t('challengeEyebrow')));
    head.appendChild(createEl('h1', 'display-md', t('challengeTitle')));
    head.appendChild(createEl('p', 'body-md', t('challengeSub')));
    sheet.appendChild(head);

    sheet.appendChild(createEl('div', 'privacy-note', t('privacyNote')));

    const formCard = createEl('form', 'paper-card stack-md');
    formCard.addEventListener('submit', submitChallengeForm);

    const creatorGroup = createEl('div');
    const creatorLbl = createEl('label', 'field-label', t('creatorLbl'));
    creatorLbl.setAttribute('for', 'challenge-creator-input');
    creatorGroup.appendChild(creatorLbl);
    const creatorInput = createEl('input', 'editorial-input');
    creatorInput.id = 'challenge-creator-input';
    creatorInput.type = 'text';
    creatorInput.maxLength = 40;
    creatorInput.required = true;
    creatorInput.placeholder = t('creatorPlaceholder');
    creatorInput.value = state.challengeCreatorName;
    creatorInput.addEventListener('input', (e) => {
      state.challengeCreatorName = e.target.value;
    });
    creatorGroup.appendChild(creatorInput);
    formCard.appendChild(creatorGroup);

    const targetGroup = createEl('div');
    const targetLbl = createEl('label', 'field-label', t('targetLbl'));
    targetLbl.setAttribute('for', 'challenge-target-input');
    targetGroup.appendChild(targetLbl);
    const targetInput = createEl('input', 'editorial-input');
    targetInput.id = 'challenge-target-input';
    targetInput.type = 'text';
    targetInput.maxLength = 40;
    targetInput.required = true;
    targetInput.placeholder = t('targetPlaceholder');
    targetInput.value = state.challengeTargetLabel;
    targetInput.addEventListener('input', (e) => {
      state.challengeTargetLabel = e.target.value;
    });
    targetGroup.appendChild(targetInput);
    formCard.appendChild(targetGroup);

    const langGroup = createEl('div');
    langGroup.appendChild(createEl('span', 'field-label', t('challengeLangLbl')));
    const radioRow = createEl('div', 'radio-row');

    const enBtn = createEl('button', 'radio-chip' + (state.challengeFormLang === 'en' ? ' is-active' : ''), 'ENGLISH (EN)');
    enBtn.type = 'button';
    enBtn.addEventListener('click', () => {
      state.challengeFormLang = 'en';
      renderChallengeView();
    });
    radioRow.appendChild(enBtn);

    const hiBtn = createEl('button', 'radio-chip' + (state.challengeFormLang === 'hi' ? ' is-active' : ''), 'हिन्दी (HI)');
    hiBtn.type = 'button';
    hiBtn.addEventListener('click', () => {
      state.challengeFormLang = 'hi';
      renderChallengeView();
    });
    radioRow.appendChild(hiBtn);

    langGroup.appendChild(radioRow);
    formCard.appendChild(langGroup);

    const chalErr = getChallengeErrorText();
    if (chalErr) {
      formCard.appendChild(createEl('div', 'trap-alert-banner', chalErr));
    }

    const submitBtn = createEl(
      'button',
      'button-primary button-full',
      state.challengeSubmitting ? t('challengeCreatingBtn') : t('challengeSubmitBtn')
    );
    submitBtn.type = 'submit';
    submitBtn.disabled = state.challengeSubmitting;
    formCard.appendChild(submitBtn);

    sheet.appendChild(formCard);

    if (state.createdChallenge) {
      const ch = state.createdChallenge;
      const fullChallengeUrl = window.location.origin + ch.challengeUrl;
      const readyCard = createEl('div', 'paper-card stack-md');
      readyCard.appendChild(createEl('span', 'status-tag status-tag--pass', t('challengeReadyTitle')));
      readyCard.appendChild(
        createEl('div', 'title-card', `${ch.creator_name} → ${ch.target_label} (${ch.lang.toUpperCase()})`)
      );
      readyCard.appendChild(createEl('div', 'share-url-box', fullChallengeUrl));

      const copyBtn = createEl(
        'button',
        'button-primary button-full',
        state.copiedKey === 'creator' ? t('copiedBtn') : t('copyLinkBtn')
      );
      copyBtn.type = 'button';
      copyBtn.addEventListener('click', () => copyTextSafe(fullChallengeUrl, 'creator'));
      readyCard.appendChild(copyBtn);

      const waMsg = `Try this 60-second scam survival drill I created for ${ch.target_label} on BaitCheck (Simulated): ${fullChallengeUrl}`;
      const waLink = createEl('a', 'button-dark button-full', t('whatsappBtn'));
      waLink.href = 'https://wa.me/?text=' + encodeURIComponent(waMsg);
      waLink.target = '_blank';
      waLink.rel = 'noopener noreferrer';
      readyCard.appendChild(waLink);

      const openReportBtn = createEl('button', 'button-dark button-full', t('openLiveReportBtn'));
      openReportBtn.type = 'button';
      openReportBtn.addEventListener('click', () => navigateTo(ch.reportUrl));
      readyCard.appendChild(openReportBtn);

      const testNowBtn = createEl('button', 'button-ghost-light button-full', t('testChallengeNowBtn'));
      testNowBtn.type = 'button';
      testNowBtn.addEventListener('click', () => {
        state.drillPhase = 'hero';
        state.drillIndex = 0;
        state.drillOutcomes = [];
        state.ticketPreviewUrl = '';
        state.ticketBadgeUrl = '';
        navigateTo(ch.challengeUrl);
      });
      readyCard.appendChild(testNowBtn);

      sheet.appendChild(readyCard);
    }

    if (state.recentChallenges.length > 0) {
      const recentCard = createEl('div', 'paper-card stack-sm');
      recentCard.appendChild(createEl('h2', 'title-card', t('recentChallengesTitle')));
      const recentList = createEl('div', 'stack-sm');

      for (let i = 0; i < state.recentChallenges.length; i++) {
        const item = state.recentChallenges[i];
        const row = createEl('div', 'recent-challenge-row');

        const meta = createEl('div', 'recent-challenge-meta');
        meta.appendChild(createEl('strong', 'body-md', `${item.creator_name} → ${item.target_label}`));
        meta.appendChild(
          createEl('div', 'mono-tabular', `${item.challengeUrl} • ${(item.lang || 'en').toUpperCase()}`)
        );
        row.appendChild(meta);

        const rowActions = createEl('div', 'recent-challenge-actions');
        const reportBtn = createEl('button', 'button-primary', t('recentReportBtn'));
        reportBtn.type = 'button';
        reportBtn.addEventListener('click', () => navigateTo(item.reportUrl));
        rowActions.appendChild(reportBtn);

        const copyKey = 'recent-' + item.id;
        const copyItemBtn = createEl(
          'button',
          'button-ghost-light',
          state.copiedKey === copyKey ? t('copiedBtn') : t('copyLinkBtn')
        );
        copyItemBtn.type = 'button';
        copyItemBtn.addEventListener('click', () =>
          copyTextSafe(window.location.origin + item.challengeUrl, copyKey)
        );
        rowActions.appendChild(copyItemBtn);

        row.appendChild(rowActions);
        recentList.appendChild(row);
      }

      recentCard.appendChild(recentList);
      sheet.appendChild(recentCard);
    }

    container.appendChild(sheet);
  }

  function renderReportView() {
    const container = els.viewReport;
    clearEl(container);

    const sheet = createEl('div', 'newsprint-sheet stack-base');

    if (state.reportLoading && !state.reportData) {
      const card = createEl('div', 'paper-card');
      card.appendChild(createEl('h1', 'display-md', t('loadingTitle')));
      sheet.appendChild(card);
      container.appendChild(sheet);
      return;
    }

    if (state.reportError === 'not-found') {
      const card = createEl('div', 'paper-card stack-md');
      card.appendChild(createEl('p', 'eyebrow', '404 • REPORT'));
      card.appendChild(createEl('h1', 'display-md', t('challengeNotFoundTitle')));
      card.appendChild(createEl('p', 'body-md', t('challengeNotFoundBody')));
      const createBtn = createEl('button', 'button-primary button-full', t('createChallengeBtn'));
      createBtn.type = 'button';
      createBtn.addEventListener('click', () => navigateTo('/?tab=challenge'));
      card.appendChild(createBtn);
      sheet.appendChild(card);
      container.appendChild(sheet);
      return;
    }

    if (state.reportError && !state.reportData) {
      const errCard = createEl('div', 'trap-alert-banner stack-md');
      errCard.appendChild(createEl('h1', 'display-md', t('loadErrorTitle')));
      const retry = createEl('button', 'button-primary button-full', t('retryBtn'));
      retry.type = 'button';
      retry.addEventListener('click', () => loadReport(state.reportId, true));
      errCard.appendChild(retry);
      sheet.appendChild(errCard);
      container.appendChild(sheet);
      return;
    }

    if (!state.reportData) return;

    const data = state.reportData;
    const challenge = data.challenge;
    const summary = data.summary || {
      immunityScore: 0,
      completedCount: 0,
      totalScenarios: 3,
      averageReactionMs: null
    };
    const isComplete = Number(summary.completedCount) >= Number(summary.totalScenarios || 3);

    const header = createEl('div', 'stack-sm');
    header.appendChild(createEl('p', 'eyebrow', t('reportEyebrow')));
    header.appendChild(createEl('h1', 'display-md', `${t('reportFor')} ${challenge.target_label}`));
    header.appendChild(
      createEl('p', 'body-md', `${t('reportSentBy')} ${challenge.creator_name} • /c/${challenge.id}`)
    );

    const pollBadge = createEl(
      'span',
      'status-tag ' + (isComplete ? 'status-tag--pass' : 'status-tag--warn'),
      isComplete ? t('reportComplete') : t('reportPolling')
    );
    header.appendChild(pollBadge);
    sheet.appendChild(header);

    // Split-Flap Summary
    const flapGrid = createEl('div', 'split-flap-grid');
    const avgStr =
      summary.averageReactionMs !== null && summary.averageReactionMs !== undefined
        ? (Number(summary.averageReactionMs) / 1000).toFixed(1) + 's'
        : '--';
    const items = [
      [`${summary.immunityScore}%`, t('metricImmunity')],
      [avgStr, t('metricAvgSpeed')],
      [`${summary.completedCount}/${summary.totalScenarios}`, t('reportCompletedLbl')]
    ];
    for (let i = 0; i < items.length; i++) {
      const tile = createEl('div', 'split-flap-tile');
      tile.appendChild(createEl('span', 'split-flap-val', items[i][0]));
      tile.appendChild(createEl('span', 'split-flap-lbl', items[i][1]));
      flapGrid.appendChild(tile);
    }
    sheet.appendChild(flapGrid);

    // Latest result per scenario
    const latestMap = new Map();
    const results = Array.isArray(data.results) ? data.results : [];
    for (let i = 0; i < results.length; i++) {
      latestMap.set(results[i].scenario_id, results[i]);
    }

    const drills = state.drills.length
      ? state.drills
      : [
          { id: 'drill-1-call', weight: 35, title: { en: 'Digital Arrest Video Call', hi: 'डिजिटल अरेस्ट वीडियो कॉल' } },
          { id: 'drill-2-apk', weight: 35, title: { en: 'Fake Utility Bill .pdf.apk Forward', hi: 'नकली बिजली बिल .pdf.apk मैसेज' } },
          { id: 'drill-3-upi', weight: 30, title: { en: 'UPI Cashback Collect Trap', hi: 'UPI कैशबैक कलेक्ट जाल' } }
        ];

    const breakdownCard = createEl('div', 'paper-card stack-sm');
    breakdownCard.appendChild(createEl('h2', 'title-card', t('ticketHeadline')));

    for (let i = 0; i < drills.length; i++) {
      const d = drills[i];
      const latest = latestMap.get(d.id);
      const row = createEl('div', 'ticket-drill-row');
      const left = createEl('div');
      left.appendChild(createEl('strong', 'body-md', `${i + 1}. ${loc(d.title)}`));

      if (latest) {
        const passed = Boolean(latest.passed);
        left.appendChild(
          createEl(
            'div',
            'mono-tabular',
            `${t('reactionLabel')}: ${(Number(latest.reaction_ms) / 1000).toFixed(1)}s (${latest.reaction_ms} ms)`
          )
        );
        if (!passed && latest.missed_flag) {
          left.appendChild(
            createEl('div', 'caption-txt', `${t('reportMissedFlagLbl')} ${formatMissedFlag(latest.missed_flag)}`)
          );
        }
        row.appendChild(left);
        row.appendChild(
          createEl(
            'span',
            'status-tag ' + (passed ? 'status-tag--pass' : 'status-tag--fail'),
            passed ? `${t('passTag')} +${d.weight}` : t('failTag')
          )
        );
      } else {
        left.appendChild(createEl('div', 'mono-tabular', `${d.weight} PTS`));
        row.appendChild(left);
        row.appendChild(createEl('span', 'status-tag status-tag--pending', t('pendingTag')));
      }
      breakdownCard.appendChild(row);
    }
    sheet.appendChild(breakdownCard);

    // Controls
    const fullLink = `${window.location.origin}/c/${challenge.id}`;
    const actions = createEl('div', 'stack-sm');

    const refreshBtn = createEl('button', 'button-primary button-full', t('reportRefreshBtn'));
    refreshBtn.type = 'button';
    refreshBtn.addEventListener('click', () => loadReport(challenge.id, false));
    actions.appendChild(refreshBtn);

    const copyBtn = createEl(
      'button',
      'button-dark button-full',
      state.copiedKey === 'report' ? t('copiedBtn') : t('reportCopyBtn')
    );
    copyBtn.type = 'button';
    copyBtn.addEventListener('click', () => copyTextSafe(fullLink, 'report'));
    actions.appendChild(copyBtn);

    const runBtn = createEl('button', 'button-dark button-full', t('reportRunBtn'));
    runBtn.type = 'button';
    runBtn.addEventListener('click', () => {
      state.drillPhase = 'hero';
      state.drillIndex = 0;
      state.drillOutcomes = [];
      state.ticketPreviewUrl = '';
      state.ticketBadgeUrl = '';
      navigateTo('/c/' + encodeURIComponent(challenge.id));
    });
    actions.appendChild(runBtn);

    const backBtn = createEl('button', 'button-ghost-light button-full', t('reportBackBtn'));
    backBtn.type = 'button';
    backBtn.addEventListener('click', () => navigateTo('/'));
    actions.appendChild(backBtn);

    sheet.appendChild(actions);
    container.appendChild(sheet);
  }

  function renderCohortPanel() {
    const panel = els.cohortPanel;
    clearEl(panel);

    panel.appendChild(createEl('p', 'eyebrow eyebrow--dark', t('cohortEyebrow')));
    const h2 = createEl('h2', 'display-md', t('cohortTitle'));
    h2.id = 'cohort-heading';
    panel.appendChild(h2);

    const stats = state.stats || {
      totalDrills: 142,
      passRatePct: 61.5,
      topMissedScenario: 'drill-2-apk',
      totalScans: 0
    };

    const grid = createEl('div', 'split-flap-grid split-flap-grid--two');
    const TOP_MISSED_SHORT_LABELS = {
      'drill-1-call': { en: 'DIGITAL ARREST', hi: 'डिजिटल अरेस्ट' },
      'drill-2-apk': { en: '.PDF.APK', hi: 'बिल .APK' },
      'drill-3-upi': { en: 'UPI COLLECT', hi: 'UPI कलेक्ट' }
    };
    const mappedMissed = TOP_MISSED_SHORT_LABELS[stats.topMissedScenario];
    const topMissedLabel = mappedMissed
      ? loc(mappedMissed)
      : String(stats.topMissedScenario || 'DRILL-2');

    const tiles = [
      [String(stats.totalDrills), t('cohortDrillsLbl')],
      [`${stats.passRatePct}%`, t('cohortPassLbl')],
      [String(stats.totalScans || 0), t('cohortScansLbl')],
      [topMissedLabel, t('cohortTopMissedLbl')]
    ];

    for (let i = 0; i < tiles.length; i++) {
      const tile = createEl('div', 'split-flap-tile');
      tile.appendChild(createEl('span', 'split-flap-val', tiles[i][0]));
      tile.appendChild(createEl('span', 'split-flap-lbl', tiles[i][1]));
      grid.appendChild(tile);
    }

    panel.appendChild(grid);
  }

  function renderPlaybookPanel() {
    const panel = els.playbookPanel;
    clearEl(panel);

    panel.appendChild(createEl('p', 'eyebrow', t('playbookEyebrow')));
    const pb = state.playbook;
    const h2 = createEl(
      'h2',
      'display-md',
      pb ? loc(pb.title) : '1930 Golden-Hour Emergency Playbook'
    );
    h2.id = 'playbook-heading';
    panel.appendChild(h2);
    panel.appendChild(createEl('p', 'caption-txt', t('playbookHint')));

    const steps = pb && Array.isArray(pb.steps) ? pb.steps : [];
    const list = createEl('div', 'swatch-list');

    for (let i = 0; i < steps.length; i++) {
      const st = steps[i];
      const strip = createEl('div', 'swatch-strip');
      const badge = createEl(
        'div',
        `swatch-step-badge swatch-step-${Math.min(3, Math.max(1, Number(st.step) || i + 1))}`,
        String(st.step || i + 1)
      );
      strip.appendChild(badge);

      const content = createEl('div');
      content.appendChild(createEl('h3', 'swatch-title', loc(st.title)));
      content.appendChild(createEl('p', 'swatch-detail', loc(st.detail)));
      strip.appendChild(content);

      list.appendChild(strip);
    }

    panel.appendChild(list);
  }

  function renderAll() {
    renderTopBar();
    renderDrillView();
    renderXrayView();
    renderChallengeView();
    renderReportView();
    renderCohortPanel();
    renderPlaybookPanel();
  }

  // =========================================================================
  // Initialization & Event Binding
  // =========================================================================

  function bindStaticControls() {
    els.safetyRibbonText = document.getElementById('safety-ribbon-text');
    els.brandHomeBtn = document.getElementById('brand-home-btn');
    els.langEnBtn = document.getElementById('lang-en-btn');
    els.langHiBtn = document.getElementById('lang-hi-btn');
    els.soundToggleBtn = document.getElementById('sound-toggle-btn');
    els.soundToggleLabel = document.getElementById('sound-toggle-label');
    els.tabDrillBtn = document.getElementById('tab-drill-btn');
    els.tabXrayBtn = document.getElementById('tab-xray-btn');
    els.tabChallengeBtn = document.getElementById('tab-challenge-btn');
    els.tabDrillLabel = document.getElementById('tab-drill-label');
    els.tabXrayLabel = document.getElementById('tab-xray-label');
    els.tabChallengeLabel = document.getElementById('tab-challenge-label');
    els.viewDrill = document.getElementById('view-drill');
    els.viewXray = document.getElementById('view-xray');
    els.viewChallenge = document.getElementById('view-challenge');
    els.viewReport = document.getElementById('view-report');
    els.cohortPanel = document.getElementById('cohort-panel');
    els.playbookPanel = document.getElementById('playbook-panel');
    els.footerDisclaimer = document.getElementById('footer-disclaimer');

    els.brandHomeBtn.addEventListener('click', () => {
      state.drillPhase = 'hero';
      state.drillIndex = 0;
      state.drillOutcomes = [];
      state.ticketPreviewUrl = '';
      state.ticketBadgeUrl = '';
      navigateTo('/');
    });

    els.langEnBtn.addEventListener('click', () => {
      state.lang = 'en';
      stopSpeech();
      renderAll();
    });

    els.langHiBtn.addEventListener('click', () => {
      state.lang = 'hi';
      stopSpeech();
      renderAll();
    });

    els.soundToggleBtn.addEventListener('click', () => {
      state.muted = !state.muted;
      if (state.muted) {
        stopSpeech();
      } else {
        unlockAudio();
      }
      renderTopBar();
    });

    els.tabDrillBtn.addEventListener('click', () => navigateTo('/'));
    els.tabXrayBtn.addEventListener('click', () => navigateTo('/?tab=xray'));
    els.tabChallengeBtn.addEventListener('click', () => navigateTo('/?tab=challenge'));

    window.addEventListener('popstate', () => {
      pauseActiveDrillTimer();
      stopReportPolling();
      stopSpeech();
      state.route = parseRoute(window.location.pathname, window.location.search);
      syncRouteView();
    });

    document.addEventListener('visibilitychange', () => {
      const onDrillView =
        state.route.mode === 'challenge-drill' ||
        (state.route.mode === 'tab' && state.route.tab === 'drill');
      if (!onDrillView) return;
      if (document.hidden) {
        pauseActiveDrillTimer();
      } else if (state.drillPhase === 'active' && !state.drillAnswered) {
        resumeActiveDrillTimer();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindStaticControls();
    state.recentChallenges = loadRecentChallenges();
    state.route = parseRoute(window.location.pathname, window.location.search);
    syncRouteView();
    fetchDrillsAndStats();
  });
})();
