'use strict';

(function (global) {
  function createEl(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function clearEl(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function makeSvg(viewBox, width, height, buildFn) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', viewBox);
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.setAttribute('aria-hidden', 'true');
    buildFn(svg);
    return svg;
  }

  function svgEl(tag, attrs) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    const keys = Object.keys(attrs);
    for (let i = 0; i < keys.length; i++) {
      node.setAttribute(keys[i], String(attrs[keys[i]]));
    }
    return node;
  }

  function buildCallerEmblemSvg() {
    return makeSvg('0 0 48 48', 40, 40, (svg) => {
      svg.appendChild(svgEl('polygon', {
        points: '24,3 43,13 43,35 24,45 5,35 5,13',
        fill: 'none',
        stroke: '#FEC917',
        'stroke-width': '2.5'
      }));
      svg.appendChild(svgEl('circle', {
        cx: '24',
        cy: '19',
        r: '6',
        fill: '#FEC917'
      }));
      svg.appendChild(svgEl('path', {
        d: 'M13,36 C13,29 35,29 35,36',
        fill: 'none',
        stroke: '#F7F5EF',
        'stroke-width': '2.5'
      }));
    });
  }

  function buildSilhouetteSvg() {
    return makeSvg('0 0 64 64', 52, 52, (svg) => {
      svg.appendChild(svgEl('rect', {
        x: '4',
        y: '4',
        width: '56',
        height: '56',
        fill: '#0D0D0D',
        stroke: '#FEC917',
        'stroke-width': '2'
      }));
      svg.appendChild(svgEl('circle', {
        cx: '32',
        cy: '24',
        r: '10',
        fill: '#8E8B80'
      }));
      svg.appendChild(svgEl('path', {
        d: 'M15,54 C15,40 49,40 49,54',
        fill: '#8E8B80'
      }));
      svg.appendChild(svgEl('line', {
        x1: '10',
        y1: '14',
        x2: '54',
        y2: '14',
        stroke: '#D92D20',
        'stroke-width': '2'
      }));
    });
  }

  global.BaitCheckDom = {
    createEl,
    clearEl,
    makeSvg,
    svgEl,
    buildCallerEmblemSvg,
    buildSilhouetteSvg
  };
})(window);
