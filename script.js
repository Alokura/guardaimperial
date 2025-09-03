// script.js

// caminhos conforme tua pasta: Image/PNG/<arquivo>.png
const REGIOES = {
  vermelho: 'Image/PNG/Vermelho.png'
}

function abrirRegiao(){ alert('clicou no vermelho'); }

document.addEventListener('DOMContentLoaded', () => {
  const p = document.getElementById('vermelho');
  if (p) p.addEventListener('click', abrirRegiao);
});

function fecharZoom(){
  document.getElementById('zoom-area').classList.add('hidden')
  document.getElementById('zoom-img').src = ''
}

document.addEventListener('DOMContentLoaded', () => {
  const poly = document.getElementById('vermelho')
  poly.style.cursor = 'pointer'
  poly.addEventListener('mouseenter', () => poly.style.fill = 'rgba(255,0,0,.25)')
  poly.addEventListener('mouseleave', () => poly.style.fill = 'transparent')
  poly.addEventListener('click', () => abrirRegiao('vermelho'))
})

document.addEventListener('DOMContentLoaded', () => {
  // liga cliques e hover leve nas regiões
  document.querySelectorAll('#mapa-overlay .regiao').forEach(p => {
    p.style.cursor = 'pointer'
    p.addEventListener('mouseenter', () => p.style.fill = 'rgba(255,255,255,.12)')
    p.addEventListener('mouseleave', () => p.style.fill = 'transparent')
    p.addEventListener('click', () => abrirRegiao(p.id))
  })

  // esc pra fechar
  window.addEventListener('keydown', e => {
    if(e.key === 'Escape') fecharZoom()
  })
})

/* util para marcar pontos direto no navegador
   use no console:  window._desenhar('vermelho')
   clique para adicionar vértices  enter para copiar os points
*/
window._desenhar = function(id){
  const svg = document.getElementById('mapa-overlay')
  let poly = document.getElementById(id)
  if(!poly){
    poly = document.createElementNS('http://www.w3.org/2000/svg','polygon')
    poly.setAttribute('id', id)
    poly.setAttribute('class','regiao')
    poly.setAttribute('fill','rgba(255,255,255,.12)')
    svg.appendChild(poly)
  }
  let pts = (poly.getAttribute('points')||'').trim()
             .split(/\s+/).filter(Boolean)
  const click = e => {
    const r = svg.getBoundingClientRect()
    const x = ((e.clientX - r.left)/r.width)*1000
    const y = ((e.clientY - r.top)/r.height)*1000
    pts.push(`${x.toFixed(0)},${y.toFixed(0)}`)
    poly.setAttribute('points', pts.join(' '))
  }
  const key = e => {
    if(e.key === 'Enter'){
      const text = poly.getAttribute('points')
      navigator.clipboard.writeText(text).catch(()=>{})
      svg.removeEventListener('click', click)
      window.removeEventListener('keydown', key)
      console.log('points copiados')
    }
    if(e.key === 'Backspace'){
      pts.pop()
      poly.setAttribute('points', pts.join(' '))
    }
  }
  svg.addEventListener('click', click)
  window.addEventListener('keydown', key)
  console.log('modo desenho  enter copia  backspace desfaz último ponto')
}
