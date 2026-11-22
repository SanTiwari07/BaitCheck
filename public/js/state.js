'use strict';

(function (global) {
  const MAX_XRAY_LENGTH = 2000;
  const REPORT_POLL_MS = 4000;
  const RECENT_CHALLENGES_KEY = 'baitcheck_recent_challenges_v1';
  const MAX_RECENT_CHALLENGES = 5;

  function createAppState() {
    return {
      lang: 'en',
      muted: false,
      largeText: false,
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
      drillOutcomes: [],
      drillStartPerf: 0,
      drillRemainingMs: 15000,
      drillLastTickSec: null,
      drillAnswered: false,
      drillTimerId: null,
      apkNoticeShown: false,
      syncStatus: null,
      ticketDownloadedMsg: '',
      ticketPreviewUrl: '',
      ticketBadgeUrl: '',
      learningLibraryOpen: false,
      learningOpenScenarioId: null,
      learningAnswers: {},

      // Active challenge context (when on /c/:id)
      activeChallenge: null,
      challengeLoadError: null,

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
  }

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

  function saveRecentChallenge(state, data) {
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

  global.BaitCheckState = {
    MAX_XRAY_LENGTH,
    REPORT_POLL_MS,
    createAppState,
    parseRoute,
    loadRecentChallenges,
    saveRecentChallenge
  };
})(window);
