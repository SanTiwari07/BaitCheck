'use strict';

(function (global) {
  function createReportView({
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
  }) {
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

    return { loadReport, renderReportView };
  }

  global.BaitCheckViews = global.BaitCheckViews || {};
  global.BaitCheckViews.createReportView = createReportView;
})(window);
