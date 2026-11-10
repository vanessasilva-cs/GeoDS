// Mapas das publicações: comparador (swipe) e ampliar ao clicar.
(function () {
  // Comparador
  document.querySelectorAll('.comparar').forEach(function (c) {
    var r = c.querySelector('input');
    r.addEventListener('input', function () { c.style.setProperty('--pos', r.value + '%'); });
  });

  // Janela de ampliação
  var fundo = document.createElement('div');
  fundo.className = 'ampliar-fundo';
  fundo.setAttribute('role', 'dialog');
  fundo.setAttribute('aria-modal', 'true');
  fundo.setAttribute('aria-label', 'Mapa ampliado');
  fundo.hidden = true;
  fundo.innerHTML = '<button type="button" class="ampliar-fechar" aria-label="Fechar">&times;</button><div class="ampliar-conteudo"></div>';
  document.body.appendChild(fundo);
  var conteudo = fundo.querySelector('.ampliar-conteudo');
  var fechar = fundo.querySelector('.ampliar-fechar');
  var origem = null, marcador = null, comparadorAberto = null;

  function ajustar() {
    if (!comparadorAberto) return;
    var img = comparadorAberto.querySelector('img');
    var prop = (img.naturalWidth || 1800) / (img.naturalHeight || 1273);
    comparadorAberto.style.width = Math.min(window.innerWidth * 0.96, window.innerHeight * 0.88 * prop) + 'px';
  }

  function abrir(el, quem) {
    origem = quem;
    if (el.classList.contains('comparar')) {
      marcador = document.createElement('div');
      marcador.style.height = el.offsetHeight + 'px';
      el.parentNode.insertBefore(marcador, el);
      conteudo.appendChild(el);
      comparadorAberto = el;
      ajustar();
    } else {
      var img = document.createElement('img');
      img.src = el.currentSrc || el.src;
      img.alt = el.alt;
      conteudo.appendChild(img);
    }
    fundo.hidden = false;
    document.body.style.overflow = 'hidden';
    fechar.focus();
  }

  function fecharJanela() {
    if (fundo.hidden) return;
    if (comparadorAberto) {
      comparadorAberto.style.width = '';
      marcador.parentNode.replaceChild(comparadorAberto, marcador);
      comparadorAberto = marcador = null;
    }
    conteudo.innerHTML = '';
    fundo.hidden = true;
    document.body.style.overflow = '';
    if (origem) origem.focus();
  }

  fechar.addEventListener('click', fecharJanela);
  fundo.addEventListener('click', function (e) { if (e.target === fundo || e.target === conteudo) fecharJanela(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecharJanela(); });
  window.addEventListener('resize', ajustar);

  // Imagens simples: clicar amplia
  document.querySelectorAll('.publicacao figure img').forEach(function (img) {
    if (img.closest('.comparar')) return;
    img.classList.add('ampliavel');
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'Ampliar mapa: ' + img.alt);
    img.addEventListener('click', function () { abrir(img, img); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(img, img); }
    });
  });

  // Comparador: botão de ampliar (clicar no mapa move a barra)
  document.querySelectorAll('.comparar').forEach(function (c) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'comparar-ampliar';
    b.setAttribute('aria-label', 'Ampliar comparação');
    b.innerHTML = '&#x2922;';
    b.addEventListener('click', function () {
      if (comparadorAberto === c) fecharJanela(); else abrir(c, b);
    });
    c.appendChild(b);
  });
})();
