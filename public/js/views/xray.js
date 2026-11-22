'use strict';

(function (global) {
  function createXrayView({
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
  }) {
    function getXrayErrorText() {
      if (state.xrayErrorKey) return t(state.xrayErrorKey);
      return state.xrayErrorCustom || '';
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

      if (state.xrayLoading) {
        const loadingWrap = createEl('div', 'xray-loading-status');
        loadingWrap.setAttribute('role', 'status');
        loadingWrap.setAttribute('aria-live', 'polite');
        const scanTrack = createEl('div', 'xray-scan-track');
        scanTrack.appendChild(createEl('div', 'xray-scan-bar'));
        loadingWrap.appendChild(scanTrack);
        loadingWrap.appendChild(createEl('span', 'caption-txt', t('xrayScanningBtn')));
        inputWrap.appendChild(loadingWrap);
      }

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
        sheet.appendChild(createEl('p', 'caption-txt xray-confidence-note', t('xrayCaveat')));

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
          warnBox.appendChild(createEl('strong', 'body-md', t('upiWarningLabel')));
          warnBox.appendChild(createEl('strong', 'body-md', localizeUpiWarning(res.upiDecoded)));
          upiCard.appendChild(warnBox);

          const paymentDetails = [
            [t('upiWhoGetsPaid'), res.upiDecoded.pa],
            [t('upiPayeeName'), res.upiDecoded.pn],
            [t('upiAmountLeaving'), res.upiDecoded.am ? `₹${res.upiDecoded.am}` : ''],
            [t('upiPaymentNote'), res.upiDecoded.tn]
          ];
          const receipt = createEl('dl', 'payment-details');
          for (const [label, value] of paymentDetails) {
            if (!value) continue;
            receipt.appendChild(createEl('dt', '', label));
            receipt.appendChild(createEl('dd', 'mono-tabular', value));
          }
          upiCard.appendChild(receipt);
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
                t('xrayRiskUnit')
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

        const motion = global.BaitCheckMotion;
        const scanKey = `${state.xrayInput}|${res.riskScore}|${(res.findings || []).length}`;
        if (motion && motion.consumeKey('xray-result', scanKey)) {
          meterCard.classList.add('bc-step-enter');
          motion.animateScaleXFill(fill);
          const hlBox = sheet.querySelector('.xray-highlight-box');
          if (hlBox) {
            hlBox.parentElement.classList.add('bc-feedback-enter');
            motion.applyStagger(hlBox, 'mark', 90, 120);
          }
          motion.applyStagger(findingsWrap, '.finding-swatch, .safe-pass-banner', 70, 140);
          const upiReceipt = sheet.querySelector('.payment-details');
          if (upiReceipt) {
            upiReceipt.parentElement.classList.add('bc-feedback-enter');
            motion.applyStagger(upiReceipt, 'dd', 55, 100);
          }
        }
      }

      container.appendChild(sheet);
    }

    return { renderXrayView };
  }

  global.BaitCheckViews = global.BaitCheckViews || {};
  global.BaitCheckViews.createXrayView = createXrayView;
})(window);
