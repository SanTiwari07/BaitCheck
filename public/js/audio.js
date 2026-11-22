'use strict';

(function (global) {
  function createAudioController(state) {
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

    return {
      unlockAudio,
      playIncomingChime,
      playTickSound,
      playPassChime,
      playTrapBuzz,
      stopSpeech,
      speakCaption
    };
  }

  global.BaitCheckAudio = { createAudioController };
})(window);
