'use strict';

(function (global) {
  function createTicketManager({ state, t, loc, onRenderDrillView }) {
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
            onRenderDrillView();
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
      ctx.fillText('BAITCHECK', 88, 143, 200);

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

      ctx.fillStyle = '#000000';
      ctx.fillRect(cardX + 10, cardY + 10, cardW, cardH);

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(cardX, cardY, cardW, cardH);

      ctx.fillStyle = '#FEC917';
      ctx.fillRect(cardX, cardY, 176, cardH);

      ctx.strokeStyle = '#0D0D0D';
      ctx.lineWidth = 4;
      ctx.strokeRect(cardX, cardY, cardW, cardH);

      ctx.setLineDash([12, 10]);
      ctx.beginPath();
      ctx.moveTo(cardX + 176, cardY);
      ctx.lineTo(cardX + 176, cardY + cardH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#161616';
      ctx.beginPath();
      ctx.arc(cardX + 88, cardY + 72, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(cardX + 102, cardY + 460);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = '#0D0D0D';
      ctx.textAlign = 'left';
      ctx.font = '800 28px "Archivo Narrow", Impact, sans-serif';
      ctx.fillText(t('ticketStubVertical') + serialCode, 0, 0, 350);
      ctx.restore();

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
      onRenderDrillView();
      uploadTicketBadge(dataUrl);
    }

    return {
      computeFinaleMetrics,
      downloadVerdictTicketPng
    };
  }

  global.BaitCheckTicket = { createTicketManager };
})(window);
