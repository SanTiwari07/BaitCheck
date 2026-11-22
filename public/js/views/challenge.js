'use strict';

(function (global) {
  function createChallengeView({
    state,
    els,
    t,
    createEl,
    clearEl,
    navigateTo,
    saveRecentChallenge,
    copyTextSafe
  }) {
    function getChallengeErrorText() {
      if (state.challengeErrorKey) return t(state.challengeErrorKey);
      return state.challengeErrorCustom || '';
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

      const targetPresetGroup = createEl('div', 'target-presets');
      targetPresetGroup.setAttribute('role', 'group');
      targetPresetGroup.setAttribute('aria-label', t('targetPresetsLbl'));
      const targetPresets = [
        ['Mom', 'targetPresetMom'],
        ['Dad', 'targetPresetDad'],
        ['Grandparent', 'targetPresetGrandparent'],
        ['Sibling', 'targetPresetSibling'],
        ['Friend', 'targetPresetFriend']
      ];
      for (const [value, labelKey] of targetPresets) {
        const presetBtn = createEl(
          'button',
          'radio-chip' + (state.challengeTargetLabel === value ? ' is-active' : ''),
          t(labelKey)
        );
        presetBtn.type = 'button';
        presetBtn.setAttribute('aria-pressed', state.challengeTargetLabel === value ? 'true' : 'false');
        presetBtn.addEventListener('click', () => {
          state.challengeTargetLabel = value;
          renderChallengeView();
        });
        targetPresetGroup.appendChild(presetBtn);
      }
      targetGroup.appendChild(targetPresetGroup);
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

    return { renderChallengeView };
  }

  global.BaitCheckViews = global.BaitCheckViews || {};
  global.BaitCheckViews.createChallengeView = createChallengeView;
})(window);
