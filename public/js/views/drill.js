'use strict';

(function (global) {
  function createDrillView({
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
  }) {
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

    function renderDrillView() {
      const container = els.viewDrill;
      clearEl(container);

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

        const capBox = createEl('div', 'caption-box');
        capBox.appendChild(createEl('span', 'caption-label', t('captionLabel')));
        capBox.appendChild(createEl('p', 'caption-script', loc(drill.script)));
        drillCard.appendChild(capBox);

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

      renderFinaleView(container);
    }

    return { renderDrillView };
  }

  global.BaitCheckViews = global.BaitCheckViews || {};
  global.BaitCheckViews.createDrillView = createDrillView;
})(window);
