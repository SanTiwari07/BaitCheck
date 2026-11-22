'use strict';

(function () {
  const {
    MAX_XRAY_LENGTH,
    REPORT_POLL_MS,
    createAppState,
    parseRoute,
    loadRecentChallenges,
    saveRecentChallenge: storeRecentChallenge
  } = window.BaitCheckState;

  const {
    I18N,
    localizeXrayVerdict: i18nXrayVerdict,
    localizeXrayFinding: i18nXrayFinding,
    localizeUpiWarning: i18nUpiWarning,
    formatMissedFlag: i18nFormatMissedFlag
  } = window.BaitCheckI18n;

  const state = createAppState();

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

  const {
    unlockAudio,
    playIncomingChime,
    playTickSound,
    playPassChime,
    playTrapBuzz,
    stopSpeech,
    speakCaption
  } = window.BaitCheckAudio.createAudioController(state);

  // URL Routing & Timer Lifecycle
  // =========================================================================

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

  const {
    computeFinaleMetrics,
    downloadVerdictTicketPng
  } = window.BaitCheckTicket.createTicketManager({
    state,
    t,
    loc,
    onRenderDrillView: () => renderDrillView()
  });

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

  function saveRecentChallenge(data) { storeRecentChallenge(state, data); }

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
    document.documentElement.classList.toggle('large-text', state.largeText);
    els.safetyRibbonText.textContent = t('safetyRibbon');
    els.footerDisclaimer.textContent = t('footerDisclaimer');

    els.langEnBtn.classList.toggle('is-active', state.lang === 'en');
    els.langEnBtn.setAttribute('aria-pressed', state.lang === 'en' ? 'true' : 'false');
    els.langHiBtn.classList.toggle('is-active', state.lang === 'hi');
    els.langHiBtn.setAttribute('aria-pressed', state.lang === 'hi' ? 'true' : 'false');

    els.soundToggleLabel.textContent = state.muted ? t('soundOff') : t('soundOn');
    els.soundToggleBtn.classList.toggle('is-muted', state.muted);
    els.soundToggleBtn.setAttribute('aria-pressed', state.muted ? 'false' : 'true');
    els.textSizeToggleBtn.setAttribute('aria-pressed', state.largeText ? 'true' : 'false');
    els.textSizeToggleBtn.setAttribute('aria-label', t(state.largeText ? 'textSizeStandard' : 'textSizeLarge'));
    els.textSizeToggleBtn.classList.toggle('is-muted', !state.largeText);

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

  const { renderDrillView } = window.BaitCheckViews.createDrillView({
    state,
    els,
    t,
    loc,
    createEl,
    clearEl,
    buildCallerEmblemSvg,
    buildSilhouetteSvg,
    navigateTo,
    fetchDrillsAndStats,
    startDrillSequence,
    handleDrillChoice,
    advanceDrill,
    computeFinaleMetrics,
    downloadVerdictTicketPng
  });

  const { renderXrayView } = window.BaitCheckViews.createXrayView({
    state,
    els,
    MAX_XRAY_LENGTH,
    t,
    loc,
    createEl,
    clearEl,
    localizeXrayVerdict,
    localizeXrayFinding,
    localizeUpiWarning,
    refreshCohortStats
  });

  const { renderChallengeView } = window.BaitCheckViews.createChallengeView({
    state,
    els,
    t,
    createEl,
    clearEl,
    navigateTo,
    saveRecentChallenge,
    copyTextSafe
  });

  const { loadReport, renderReportView } = window.BaitCheckViews.createReportView({
    state,
    els,
    REPORT_POLL_MS,
    t,
    loc,
    createEl,
    clearEl,
    formatMissedFlag,
    navigateTo,
    copyTextSafe,
    stopReportPolling
  });

  const { renderCohortPanel, renderPlaybookPanel } = window.BaitCheckViews.createCompanionView({
    state,
    els,
    t,
    loc,
    createEl,
    clearEl
  });

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
    els.textSizeToggleBtn = document.getElementById('text-size-toggle-btn');
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

    try {
      state.largeText = window.localStorage.getItem('baitcheck_large_text') === 'true';
    } catch {
      state.largeText = false;
    }
    els.textSizeToggleBtn.addEventListener('click', () => {
      state.largeText = !state.largeText;
      try {
        window.localStorage.setItem('baitcheck_large_text', String(state.largeText));
      } catch {
        // Text size remains available for this page if storage is unavailable.
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
