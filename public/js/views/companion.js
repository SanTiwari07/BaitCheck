'use strict';

(function (global) {
  function createCompanionView({ state, els, t, loc, createEl, clearEl }) {
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

    return { renderCohortPanel, renderPlaybookPanel };
  }

  global.BaitCheckViews = global.BaitCheckViews || {};
  global.BaitCheckViews.createCompanionView = createCompanionView;
})(window);
