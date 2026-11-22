'use strict';

(function (global) {
  function createSimulatorView({
    state,
    t,
    loc,
    createEl,
    onRenderDrillView,
    scrollToStageTop,
    navigateTo,
    unlockAudio,
    playIncomingChime,
    playPassChime,
    playTrapBuzz,
    stopSpeech
  }) {
    function scrollTop() {
      if (typeof scrollToStageTop === 'function') {
        scrollToStageTop();
      }
    }

    function getScams() {
      return Array.isArray(global.BaitCheckRealLifeScams) ? global.BaitCheckRealLifeScams : [];
    }

    function getParentLessons() {
      return Array.isArray(global.BaitCheckParentLessons) ? global.BaitCheckParentLessons : [];
    }

    function getActiveScam() {
      if (!state.simActiveId) return null;
      return getScams().find((s) => s.id === state.simActiveId) || null;
    }

    function startSimulation(scamId) {
      const scam = getScams().find((s) => s.id === scamId);
      if (!scam) return;
      unlockAudio();
      playIncomingChime();
      stopSpeech();
      state.simActiveId = scam.id;
      state.simStepIndex = 0;
      state.simSelectedChoiceId = null;
      state.simHistory = [];
      state.simCompleted = false;
      state.simCluesOpen = false;
      onRenderDrillView();
      scrollTop();
    }

    function exitSimulation() {
      stopSpeech();
      state.simActiveId = null;
      state.simStepIndex = 0;
      state.simSelectedChoiceId = null;
      state.simHistory = [];
      state.simCompleted = false;
      state.simCluesOpen = false;
      onRenderDrillView();
      scrollTop();
    }

    function selectChoice(scam, step, choice) {
      stopSpeech();
      unlockAudio();
      if (choice.outcomeType === 'safe') {
        playPassChime();
      } else {
        playTrapBuzz();
      }
      state.simSelectedChoiceId = choice.id;
      state.simCluesOpen = true;

      const existingIdx = state.simHistory.findIndex((h) => h.stepNumber === step.stepNumber);
      const entry = {
        stepNumber: step.stepNumber,
        stageHeader: step.stageHeader,
        choiceId: choice.id,
        choiceLabel: choice.label,
        outcomeType: choice.outcomeType,
        tacticExposed: choice.tacticExposed
      };
      if (existingIdx >= 0) {
        state.simHistory[existingIdx] = entry;
      } else {
        state.simHistory.push(entry);
      }
      onRenderDrillView();
    }

    function goToNextStep(scam) {
      stopSpeech();
      const nextIdx = state.simStepIndex + 1;
      if (nextIdx < scam.steps.length) {
        state.simStepIndex = nextIdx;
        state.simSelectedChoiceId = null;
        state.simCluesOpen = false;
        onRenderDrillView();
        scrollTop();
      } else {
        state.simCompleted = true;
        onRenderDrillView();
        scrollTop();
      }
    }

    function renderStepProgressDots(totalSteps, currentIndex) {
      const bar = createEl('div', 'edu-progress-bar');
      bar.setAttribute('aria-label', `${t('simStepPrefix')} ${currentIndex + 1} ${t('ofLabel')} ${totalSteps}`);
      for (let i = 0; i < totalSteps; i++) {
        const dot = createEl('div', 'edu-progress-seg');
        if (i < currentIndex) dot.classList.add('is-done');
        if (i === currentIndex) dot.classList.add('is-current');
        bar.appendChild(dot);
      }
      return bar;
    }

    function renderEvidencePhoneFrame(scam, step) {
      const frame = createEl('div', `sim-phone-frame sim-mode--${step.uiMode || 'video-call'}`);

      const statusBar = createEl('div', 'sim-phone-topbar');
      statusBar.appendChild(createEl('span', 'sim-phone-channel', loc(step.stageHeader)));
      const livePill = createEl('span', 'sim-live-pill');
      livePill.appendChild(createEl('span', 'rec-dot'));
      livePill.appendChild(document.createTextNode(loc(step.liveTag)));
      statusBar.appendChild(livePill);
      frame.appendChild(statusBar);

      const mediaWrap = createEl('div', 'sim-media-stage');
      if (step.video) {
        const video = createEl('video', 'sim-evidence-video');
        video.src = loc(step.video);
        if (step.image) video.poster = step.image;
        video.autoplay = true;
        video.loop = true;
        video.muted = Boolean(state.muted);
        video.defaultMuted = Boolean(state.muted);
        video.controls = true;
        video.playsInline = true;
        video.setAttribute('autoplay', '');
        video.setAttribute('loop', '');
        if (state.muted) {
          video.setAttribute('muted', '');
        }
        video.setAttribute('playsinline', '');
        video.setAttribute('aria-label', loc(step.imageAlt));
        mediaWrap.appendChild(video);
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {});
        }
      } else {
        const img = createEl('img', 'sim-evidence-img');
        img.src = step.image;
        img.alt = loc(step.imageAlt);
        img.loading = 'eager';
        mediaWrap.appendChild(img);
      }

      if (step.uiMode === 'video-call' || step.uiMode === 'voice-call') {
        const pip = createEl('div', 'sim-pip-self');
        pip.appendChild(createEl('span', 'mono-tabular', 'YOU • CAM'));
        mediaWrap.appendChild(pip);

        const callHud = createEl('div', 'sim-call-hud');
        const isFictionalPoliceScene = scam.id === 'digital-arrest-cyber-lock' ||
          (scam.id === 'customs-seized-parcel' && step.stepNumber === 2);
        callHud.appendChild(createEl(
          'span',
          'sim-call-entity',
          isFictionalPoliceScene ? 'Unknown caller (fictional)' : loc(scam.callerMeta.name)
        ));
        callHud.appendChild(createEl(
          'span',
          'sim-call-num',
          isFictionalPoliceScene ? 'TRAINING SIMULATION' : scam.callerMeta.number
        ));
        mediaWrap.appendChild(callHud);
      } else if (step.uiMode === 'browser-phish') {
        const urlBar = createEl('div', 'sim-fake-urlbar');
        urlBar.appendChild(createEl('span', 'sim-lock-icon', 'URL'));
        urlBar.appendChild(createEl('span', 'mono-tabular', 'https://xn--metrobank-kyc-9x2a.example/kyc'));
        mediaWrap.appendChild(urlBar);
      }

      frame.appendChild(mediaWrap);

      const toolsRow = createEl('div', 'sim-evidence-tools');

      const learningLink = scam.id === 'digital-arrest-cyber-lock'
        ? { label: t('simOfficerBriefingLink'), href: 'https://www.youtube.com/watch?v=INW2UjkgRjk' }
        : scam.id === 'utility-apk-disconnection'
          ? { label: t('simOfficialSourceLink'), href: 'https://sancharsaathi.gov.in/SancharSaathiDocuments/ImportantDocuments/Press%20Release-DoT%20takes%20action%20against%20Electricity%20KYC%20Update%20Scam.pdf' }
          : scam.id === 'upi-qr-cashback'
            ? { label: t('simOfficialSourceLink'), href: 'https://rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=53185' }
            : null;
      if (learningLink) {
        const sourceLink = createEl('a', 'button-ghost-light sim-tool-btn', learningLink.label);
        sourceLink.href = learningLink.href;
        sourceLink.target = '_blank';
        sourceLink.rel = 'noopener noreferrer';
        toolsRow.appendChild(sourceLink);
      }

      const cluesBtn = createEl(
        'button',
        'button-ghost-light sim-tool-btn',
        state.simCluesOpen ? t('simHideCluesBtn') : t('simInspectCluesBtn')
      );
      cluesBtn.type = 'button';
      cluesBtn.setAttribute('aria-expanded', state.simCluesOpen ? 'true' : 'false');
      cluesBtn.addEventListener('click', () => {
        state.simCluesOpen = !state.simCluesOpen;
        onRenderDrillView();
      });
      toolsRow.appendChild(cluesBtn);

      frame.appendChild(toolsRow);

      if (state.simCluesOpen && Array.isArray(step.redFlags) && step.redFlags.length > 0) {
        const clueDrawer = createEl('div', 'sim-clue-drawer');
        clueDrawer.appendChild(createEl('p', 'eyebrow', t('simCluesTitle')));
        const ul = createEl('ul', 'sim-clue-list');
        for (const flag of step.redFlags) {
          ul.appendChild(createEl('li', 'body-md', loc(flag)));
        }
        clueDrawer.appendChild(ul);
        frame.appendChild(clueDrawer);
      }

      return frame;
    }

    function renderSimCompleteAnatomy(container, scam) {
      const sheet = createEl('div', 'newsprint-sheet');

      const topBar = createEl('div', 'sim-stage-nav');
      const backBtn = createEl('button', 'button-ghost-light sim-back-btn', t('simBackBtn'));
      backBtn.type = 'button';
      backBtn.addEventListener('click', exitSimulation);
      topBar.appendChild(backBtn);
      topBar.appendChild(createEl('span', 'status-tag status-tag--pass', loc(scam.categoryLabel)));
      sheet.appendChild(topBar);

      const card = createEl('div', 'paper-card stack-base');
      card.appendChild(createEl('p', 'eyebrow', t('simAnatomyEyebrow')));
      card.appendChild(createEl('h1', 'display-md', loc(scam.title)));

      const lossBanner = createEl('div', 'sim-loss-meta');
      lossBanner.appendChild(createEl('span', 'eyebrow', t('simTypicalLossLbl')));
      lossBanner.appendChild(createEl('strong', 'mono-tabular', scam.typicalLoss));
      card.appendChild(lossBanner);

      const howBox = createEl('div', 'sim-anatomy-section');
      howBox.appendChild(createEl('h2', 'title-card', t('simHowWorksTitle')));
      howBox.appendChild(createEl('p', 'body-md', loc(scam.fullAnalysis.howItWorks)));
      card.appendChild(howBox);

      if (state.simHistory.length > 0) {
        const pathBox = createEl('div', 'sim-anatomy-section');
        pathBox.appendChild(createEl('h2', 'title-card', t('simYourPathTitle')));
        const pathList = createEl('div', 'sim-path-list');
        for (const item of state.simHistory) {
          const row = createEl(
            'div',
            `sim-path-row ${item.outcomeType === 'safe' ? 'is-safe' : 'is-warn'}`
          );
          row.appendChild(
            createEl(
              'span',
              'mono-tabular',
              `${t('simStepPrefix')} ${item.stepNumber} • ${item.outcomeType === 'safe' ? t('passTag') : loc(item.tacticExposed)}`
            )
          );
          row.appendChild(createEl('p', 'body-md', loc(item.choiceLabel)));
          pathList.appendChild(row);
        }
        pathBox.appendChild(pathList);
        card.appendChild(pathBox);
      }

      const flagsBox = createEl('div', 'sim-anatomy-section');
      flagsBox.appendChild(createEl('h2', 'title-card', t('simNeverIgnoreTitle')));
      const flagsList = createEl('ul', 'sim-bullet-list');
      for (const flag of scam.fullAnalysis.neverIgnoreFlags) {
        flagsList.appendChild(createEl('li', 'body-md', loc(flag)));
      }
      flagsBox.appendChild(flagsList);
      card.appendChild(flagsBox);

      const sourceUrl = scam.id === 'digital-arrest-cyber-lock'
        ? 'https://cybercrime.gov.in/pdf/Advisories/ADVISORYTAU-ADV-003DigitalArrest06.03.2025.pdf'
        : scam.id === 'utility-apk-disconnection'
          ? 'https://sancharsaathi.gov.in/SancharSaathiDocuments/ImportantDocuments/Press%20Release-DoT%20takes%20action%20against%20Electricity%20KYC%20Update%20Scam.pdf'
          : scam.id === 'upi-qr-cashback'
            ? 'https://rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=53185'
            : '';
      if (sourceUrl) {
        const source = createEl('a', 'sim-source-link', t('simOfficialSourceLink'));
        source.href = sourceUrl;
        source.target = '_blank';
        source.rel = 'noopener noreferrer';
        card.appendChild(source);
      }

      const actionBox = createEl('div', 'sim-anatomy-section is-highlight');
      actionBox.appendChild(createEl('h2', 'title-card', t('simActionPlanTitle')));
      const actionList = createEl('ol', 'sim-bullet-list');
      for (const act of scam.fullAnalysis.whatToDoIfTargeted) {
        actionList.appendChild(createEl('li', 'body-md', loc(act)));
      }
      actionBox.appendChild(actionList);
      card.appendChild(actionBox);

      const actions = createEl('div', 'stack-sm');
      const replayBtn = createEl('button', 'button-primary button-full', t('simReplayBtn'));
      replayBtn.type = 'button';
      replayBtn.addEventListener('click', () => startSimulation(scam.id));
      actions.appendChild(replayBtn);

      const xrayBtn = createEl('button', 'button-dark button-full', t('simCheckXrayBtn'));
      xrayBtn.type = 'button';
      xrayBtn.addEventListener('click', () => navigateTo('/?tab=xray'));
      actions.appendChild(xrayBtn);

      const backAllBtn = createEl('button', 'button-ghost-light button-full', t('simBackBtn'));
      backAllBtn.type = 'button';
      backAllBtn.addEventListener('click', exitSimulation);
      actions.appendChild(backAllBtn);

      card.appendChild(actions);
      sheet.appendChild(card);
      container.appendChild(sheet);
    }

    function renderActiveSimulation(container) {
      const scam = getActiveScam();
      if (!scam) {
        exitSimulation();
        return;
      }

      if (state.simCompleted) {
        renderSimCompleteAnatomy(container, scam);
        return;
      }

      const step = scam.steps[state.simStepIndex] || scam.steps[0];
      const sheet = createEl('div', 'newsprint-sheet');

      const topBar = createEl('div', 'sim-stage-nav');
      const backBtn = createEl('button', 'button-ghost-light sim-back-btn', t('simBackBtn'));
      backBtn.type = 'button';
      backBtn.addEventListener('click', exitSimulation);
      topBar.appendChild(backBtn);

      topBar.appendChild(
        createEl(
          'span',
          'status-tag status-tag--warn',
          `${t('simStepPrefix')} ${step.stepNumber} ${t('ofLabel')} ${scam.steps.length}`
        )
      );
      sheet.appendChild(topBar);
      sheet.appendChild(renderStepProgressDots(scam.steps.length, state.simStepIndex));

      const card = createEl('div', 'paper-card');
      card.appendChild(createEl('p', 'eyebrow', loc(scam.categoryLabel)));
      card.appendChild(createEl('h1', 'display-md', loc(scam.title)));

      if (scam.id === 'digital-arrest-cyber-lock' ||
          (scam.id === 'customs-seized-parcel' && step.uiMode === 'video-call')) {
        const trainingNote = createEl('p', 'sim-training-note', t('simFictionNotice'));
        card.appendChild(trainingNote);
      }
      card.appendChild(renderEvidencePhoneFrame(scam, step));

      const quoteBox = createEl('div', 'caption-box sim-quote-box');
      quoteBox.appendChild(createEl('span', 'caption-label', t('simScammerSaysLbl')));
      quoteBox.appendChild(createEl('p', 'caption-script', loc(step.scammerQuote)));
      card.appendChild(quoteBox);

      card.appendChild(createEl('h2', 'sim-question-heading', t('simQuestionPrompt')));

      const selectedChoice = step.choices.find((c) => c.id === state.simSelectedChoiceId) || null;
      const choicesList = createEl('div', 'choices-list');
      const LETTERS = ['A', 'B', 'C', 'D'];

      for (let i = 0; i < step.choices.length; i++) {
        const ch = step.choices[i];
        const btn = createEl('button', 'drill-choice-card');
        btn.type = 'button';
        if (selectedChoice && selectedChoice.id === ch.id) {
          btn.classList.add(ch.outcomeType === 'safe' ? 'is-selected-pass' : 'is-selected-fail');
        }
        btn.appendChild(createEl('span', 'choice-letter-badge', LETTERS[i] || String(i + 1)));
        btn.appendChild(createEl('span', 'choice-label-text', loc(ch.label)));
        btn.addEventListener('click', () => selectChoice(scam, step, ch));
        choicesList.appendChild(btn);
      }
      card.appendChild(choicesList);

      if (selectedChoice) {
        const isSafe = selectedChoice.outcomeType === 'safe';
        const banner = createEl('div', isSafe ? 'safe-pass-banner' : 'trap-alert-banner');
        banner.setAttribute('role', 'status');

        const titleKey = isSafe
          ? 'simSafeOutcomeTitle'
          : selectedChoice.outcomeType === 'loss'
            ? 'simLossOutcomeTitle'
            : 'simEscalateOutcomeTitle';
        banner.appendChild(createEl('h3', 'debrief-title', t(titleKey)));

        const tacticP = createEl('p', 'sim-tactic-line');
        tacticP.appendChild(createEl('strong', '', `${t('simTacticLbl')} `));
        tacticP.appendChild(document.createTextNode(loc(selectedChoice.tacticExposed)));
        banner.appendChild(tacticP);

        banner.appendChild(createEl('p', 'debrief-body', loc(selectedChoice.consequence)));

        const saferBox = createEl('div', 'sim-safer-box');
        saferBox.appendChild(createEl('strong', '', `${t('simSaferMoveLbl')} `));
        saferBox.appendChild(createEl('span', '', loc(selectedChoice.saferMove)));
        banner.appendChild(saferBox);

        const nextActions = createEl('div', 'stack-sm sim-outcome-actions');
        const hasMoreSteps = state.simStepIndex + 1 < scam.steps.length;
        const nextBtn = createEl(
          'button',
          'button-primary button-full',
          hasMoreSteps ? t('simNextStepBtn') : t('simFinishBtn')
        );
        nextBtn.type = 'button';
        nextBtn.addEventListener('click', () => goToNextStep(scam));
        nextActions.appendChild(nextBtn);

        if (!hasMoreSteps || !isSafe) {
          if (hasMoreSteps && !isSafe) {
            const finishEarlyBtn = createEl('button', 'button-ghost-light button-full', t('simFinishBtn'));
            finishEarlyBtn.type = 'button';
            finishEarlyBtn.addEventListener('click', () => {
              state.simCompleted = true;
              onRenderDrillView();
              scrollTop();
            });
            nextActions.appendChild(finishEarlyBtn);
          }
          const retryChoiceBtn = createEl('button', 'button-ghost-light button-full', t('simTryOtherChoiceBtn'));
          retryChoiceBtn.type = 'button';
          retryChoiceBtn.addEventListener('click', () => {
            state.simSelectedChoiceId = null;
            onRenderDrillView();
          });
          nextActions.appendChild(retryChoiceBtn);
        } else if (isSafe && hasMoreSteps) {
          const finishNowBtn = createEl('button', 'button-dark button-full', t('simFinishBtn'));
          finishNowBtn.type = 'button';
          finishNowBtn.addEventListener('click', () => {
            state.simCompleted = true;
            onRenderDrillView();
            scrollTop();
          });
          nextActions.appendChild(finishNowBtn);
        }

        banner.appendChild(nextActions);
        card.appendChild(banner);
      }

      sheet.appendChild(card);
      container.appendChild(sheet);
    }

    function renderScamCard(scam, lessonNum, isFeatured) {
      const card = createEl('article', 'sim-scam-card' + (isFeatured ? ' is-featured' : ''));

      const thumbWrap = createEl('div', 'sim-card-thumb');
      const img = createEl('img', 'sim-card-img');
      img.src = scam.coverImage;
      img.alt = loc(scam.title);
      img.loading = 'eager';
      thumbWrap.appendChild(img);
      card.appendChild(thumbWrap);

      const body = createEl('div', 'sim-card-body');
      const badgeRow = createEl('div', 'sim-card-badge-row');
      badgeRow.appendChild(createEl('span', 'sim-card-badge', loc(scam.badge)));
      const stepWord = scam.steps.length === 1 ? t('simStepSingular') : t('simStepsPlural');
      badgeRow.appendChild(
        createEl('span', 'mono-tabular sim-steps-pill', `${scam.steps.length} ${stepWord}`)
      );
      body.appendChild(badgeRow);

      const metaRow = createEl('div', 'sim-card-meta');
      metaRow.appendChild(
        createEl('span', 'edu-lesson-num', `${t('lessonPrefix')} ${lessonNum} • ${loc(scam.categoryLabel)}`)
      );
      body.appendChild(metaRow);

      body.appendChild(createEl('h3', 'title-card sim-card-title', loc(scam.title)));
      body.appendChild(createEl('p', 'body-md sim-card-summary', loc(scam.summary)));
      body.appendChild(
        createEl('p', 'mono-tabular sim-loss-tag', `${t('simTypicalLossLbl')} ${scam.typicalLoss}`)
      );

      const launchBtn = createEl(
        'button',
        (isFeatured ? 'button-primary' : 'button-dark') + ' button-full sim-launch-btn',
        t('simLaunchBtn')
      );
      launchBtn.type = 'button';
      launchBtn.dataset.simId = scam.id;
      launchBtn.addEventListener('click', () => startSimulation(scam.id));
      body.appendChild(launchBtn);

      card.appendChild(body);
      return card;
    }

    function renderParentKidMode(hub, allScams) {
      const guide = createEl('div', 'edu-guide-card edu-guide--parent stack-base');
      guide.id = 'parent-guide-card';
      guide.appendChild(createEl('h3', 'display-md', t('parentGuideTitle')));
      guide.appendChild(createEl('p', 'body-md', t('parentGuideSub')));

      const rulesBox = createEl('div', 'edu-rules-box stack-sm');
      rulesBox.appendChild(createEl('h4', 'title-card', t('parentRuleTitle')));
      rulesBox.appendChild(createEl('p', 'body-md edu-rule-item', t('parentRule1')));
      rulesBox.appendChild(createEl('p', 'body-md edu-rule-item', t('parentRule2')));
      rulesBox.appendChild(createEl('p', 'body-md edu-rule-item', t('parentRule3')));
      guide.appendChild(rulesBox);

      const lessons = getParentLessons();
      if (lessons.length > 0) {
        guide.appendChild(createEl('h4', 'title-card', t('parentQuizTitle')));
        const lessonList = createEl('div', 'stack-md');
        for (const lesson of lessons) {
          const item = createEl('article', 'edu-mini-lesson stack-sm');
          item.appendChild(createEl('span', 'learning-category', loc(lesson.badge)));
          item.appendChild(createEl('h5', 'title-card', loc(lesson.title)));
          item.appendChild(createEl('p', 'learning-story', loc(lesson.story)));

          const choiceWrap = createEl('div', 'choices-list');
          const pickedId = state.parentLessonAnswers[lesson.id];
          for (let i = 0; i < lesson.choices.length; i++) {
            const ch = lesson.choices[i];
            const btn = createEl('button', 'drill-choice-card');
            btn.type = 'button';
            if (pickedId === ch.id) {
              btn.classList.add(ch.safe ? 'is-selected-pass' : 'is-selected-fail');
            }
            btn.appendChild(createEl('span', 'choice-letter-badge', i === 0 ? 'A' : 'B'));
            btn.appendChild(createEl('span', 'choice-label-text', loc(ch.label)));
            btn.addEventListener('click', () => {
              unlockAudio();
              if (ch.safe) playPassChime();
              else playTrapBuzz();
              state.parentLessonAnswers[lesson.id] = ch.id;
              onRenderDrillView();
            });
            choiceWrap.appendChild(btn);
          }
          item.appendChild(choiceWrap);

          const picked = lesson.choices.find((c) => c.id === pickedId);
          if (picked) {
            const fb = createEl(
              'div',
              picked.safe ? 'safe-pass-banner' : 'trap-alert-banner'
            );
            fb.appendChild(
              createEl('strong', 'debrief-title', t(picked.safe ? 'learnSafeTitle' : 'learnTryAgainTitle'))
            );
            fb.appendChild(createEl('p', 'body-md', loc(lesson.teachPoint)));
            item.appendChild(fb);
          }
          lessonList.appendChild(item);
        }
        guide.appendChild(lessonList);
      }

      hub.appendChild(guide);

      const parentSimIds = [
        'ai-voice-family-emergency',
        'upi-qr-cashback',
        'remote-screen-share',
        'digital-arrest-cyber-lock'
      ];
      const related = parentSimIds
        .map((id) => allScams.find((s) => s.id === id))
        .filter(Boolean);

      hub.appendChild(createEl('h3', 'title-card edu-sub-heading', t('parentSimTitle')));
      const grid = createEl('div', 'sim-cards-grid');
      for (let i = 0; i < related.length; i++) {
        grid.appendChild(renderScamCard(related[i], i + 1, i === 0));
      }
      hub.appendChild(grid);
    }

    function renderElderSafeMode(hub, allScams) {
      const guide = createEl('div', 'edu-guide-card edu-guide--elder stack-base');
      guide.id = 'elder-guide-card';
      guide.appendChild(createEl('h3', 'display-md', t('elderGuideTitle')));
      guide.appendChild(createEl('p', 'body-lg', t('elderGuideSub')));

      const rulesBox = createEl('div', 'edu-rules-box stack-sm');
      rulesBox.appendChild(createEl('p', 'body-lg edu-rule-item', t('elderRule1')));
      rulesBox.appendChild(createEl('p', 'body-lg edu-rule-item', t('elderRule2')));
      rulesBox.appendChild(createEl('p', 'body-lg edu-rule-item', t('elderRule3')));
      guide.appendChild(rulesBox);
      hub.appendChild(guide);

      const elderSimIds = [
        'digital-arrest-cyber-lock',
        'utility-apk-disconnection',
        'fake-bank-kyc-phish',
        'upi-qr-cashback'
      ];
      const related = elderSimIds
        .map((id) => allScams.find((s) => s.id === id))
        .filter(Boolean);

      hub.appendChild(createEl('h3', 'title-card edu-sub-heading', t('elderSimTitle')));
      const grid = createEl('div', 'sim-cards-grid sim-cards-grid--elder');
      for (let i = 0; i < related.length; i++) {
        grid.appendChild(renderScamCard(related[i], i + 1, i === 0));
      }
      hub.appendChild(grid);
    }

    function renderSimulatorHub(container) {
      const scams = getScams();
      if (!scams.length) return;

      const hub = createEl('section', 'sim-hub-section edu-hub-sheet');
      hub.id = 'real-life-simulator-hub';

      const header = createEl('div', 'sim-hub-header');
      header.appendChild(createEl('p', 'eyebrow', t('simHubEyebrow')));
      header.appendChild(createEl('h2', 'display-md sim-hub-title', t('simHubTitle')));
      header.appendChild(createEl('p', 'body-md sim-hub-sub', t('simHubSub')));
      hub.appendChild(header);

      const audienceWrap = createEl('details', 'edu-audience-wrap');
      audienceWrap.open = state.learningAudience !== 'all';
      audienceWrap.appendChild(createEl('summary', 'edu-audience-summary', t('audienceDisclosure')));
      const audienceModes = [
        ['all', t('audienceAllBtn')],
        ['parent-kid', t('audienceParentBtn')],
        ['elder', t('audienceElderBtn')]
      ];
      const audienceRow = createEl('div', 'edu-audience-row');
      for (const [modeKey, modeLabel] of audienceModes) {
        const mBtn = createEl(
          'button',
          'edu-audience-btn' + (state.learningAudience === modeKey ? ' is-active' : ''),
          modeLabel
        );
        mBtn.type = 'button';
        mBtn.dataset.audienceMode = modeKey;
        mBtn.setAttribute('aria-pressed', state.learningAudience === modeKey ? 'true' : 'false');
        mBtn.addEventListener('click', () => {
          state.learningAudience = modeKey;
          onRenderDrillView();
        });
        audienceRow.appendChild(mBtn);
      }
      audienceWrap.appendChild(audienceRow);

      if (state.learningAudience === 'parent-kid') {
        hub.appendChild(audienceWrap);
        renderParentKidMode(hub, scams);
        container.appendChild(hub);
        return;
      }

      if (state.learningAudience === 'elder') {
        hub.appendChild(audienceWrap);
        renderElderSafeMode(hub, scams);
        container.appendChild(hub);
        return;
      }

      const filters = [
        ['all', t('simFilterAll')],
        ['calls', t('simFilterCalls')],
        ['messages', t('simFilterMessages')],
        ['payments', t('simFilterPayments')],
        ['jobs', t('simFilterJobs')]
      ];
      const filterDisclosure = createEl('details', 'sim-filter-disclosure');
      filterDisclosure.open = state.simCategoryFilter !== 'all';
      filterDisclosure.appendChild(createEl('summary', 'sim-filter-summary', t('simBrowseTopics')));
      const filterRow = createEl('div', 'sim-filter-row');
      for (const [key, label] of filters) {
        const fBtn = createEl(
          'button',
          'sim-filter-btn' + (state.simCategoryFilter === key ? ' is-active' : ''),
          label
        );
        fBtn.type = 'button';
        fBtn.setAttribute('aria-pressed', state.simCategoryFilter === key ? 'true' : 'false');
        fBtn.addEventListener('click', () => {
          state.simCategoryFilter = key;
          state.simShowAll = key !== 'all';
          onRenderDrillView();
        });
        filterRow.appendChild(fBtn);
      }
      filterDisclosure.appendChild(filterRow);

      const filteredScams = state.simCategoryFilter === 'all'
        ? scams
        : scams.filter((s) => s.category === state.simCategoryFilter);
      const visibleScams = state.simShowAll || state.simCategoryFilter !== 'all'
        ? filteredScams
        : filteredScams.filter((s) => s.featured).slice(0, 2);

      const grid = createEl('div', 'sim-cards-grid');
      for (let i = 0; i < visibleScams.length; i++) {
        const scam = visibleScams[i];
        grid.appendChild(renderScamCard(scam, i + 1, Boolean(scam.featured)));
      }
      hub.appendChild(grid);

      if (state.simCategoryFilter === 'all' && filteredScams.length > visibleScams.length) {
        const moreBtn = createEl(
          'button',
          'button-ghost-light sim-show-more-btn',
          state.simShowAll ? t('simShowFewer') : t('simShowAll')
        );
        moreBtn.type = 'button';
        moreBtn.setAttribute('aria-expanded', state.simShowAll ? 'true' : 'false');
        moreBtn.addEventListener('click', () => {
          state.simShowAll = !state.simShowAll;
          onRenderDrillView();
        });
        hub.appendChild(moreBtn);
      }
      hub.appendChild(filterDisclosure);
      hub.appendChild(audienceWrap);
      container.appendChild(hub);
    }

    return {
      startSimulation,
      exitSimulation,
      renderActiveSimulation,
      renderSimulatorHub
    };
  }

  global.BaitCheckViews = global.BaitCheckViews || {};
  global.BaitCheckViews.createSimulatorView = createSimulatorView;
})(window);
