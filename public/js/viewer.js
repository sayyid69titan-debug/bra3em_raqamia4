(function(){
  function ready(fn){if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',fn)}else{fn()}}
  function ensureModal(){
    let modal=document.getElementById('viewerModal');
    if(!modal){
      modal=document.createElement('div');
      modal.id='viewerModal';
      modal.className='viewer-modal';
      document.body.appendChild(modal);
    }
    if(!modal.querySelector('.viewer-panel')){
      modal.className='viewer-modal';
      modal.innerHTML=`<div class="viewer-panel"><div class="viewer-top"><div><h3 id="viewerTitle">عرض مكبر</h3><p class="viewer-note" id="viewerNote"></p></div><button class="viewer-close" type="button" aria-label="إغلاق">×</button></div><div class="viewer-body" id="viewerBody"></div></div>`;
      modal.addEventListener('click',e=>{if(e.target===modal) closeModal()});
      modal.querySelector('.viewer-close').addEventListener('click',closeModal);
      document.addEventListener('keydown',e=>{if(e.key==='Escape') closeModal()});
    }
    return modal;
  }
  function closeModal(){
    const modal=document.getElementById('viewerModal');
    if(!modal) return;
    const body=modal.querySelector('#viewerBody');
    body.querySelectorAll('.game-area').forEach(area=>{ if(window.BaraemGames && window.BaraemGames.cleanup) window.BaraemGames.cleanup(area); });
    modal.classList.remove('open');
    body.innerHTML='';
  }
  function openImage(img){
    const modal=ensureModal();
    modal.querySelector('#viewerTitle').textContent=img.alt || 'صورة مكبرة';
    modal.querySelector('#viewerNote').textContent='اضغط خارج النافذة أو على زر الإغلاق للعودة إلى الصفحة.';
    const body=modal.querySelector('#viewerBody');
    body.innerHTML='';
    const big=document.createElement('img');
    big.src=img.currentSrc || img.src;
    big.alt=img.alt || '';
    body.appendChild(big);
    modal.classList.add('open');
  }
  function buildFreshGameView(card, body){
    const shell=document.createElement('section');
    shell.className='glass card viewer-game-shell';
    const intro=document.createElement('div');
    intro.className='viewer-game-intro';
    const bodyText=card.dataset.gameDesc || card.querySelector('p')?.textContent || '';
    if(bodyText){
      const p=document.createElement('p');
      p.textContent=bodyText;
      intro.appendChild(p);
    }
    if(intro.childNodes.length) shell.appendChild(intro);
    const area=document.createElement('div');
    area.className='game-area viewer-game-area';
    area.id='viewer-game-' + Math.random().toString(36).slice(2);
    shell.appendChild(area);
    body.appendChild(shell);
    return area;
  }
  function openGameCard(card){
    const modal=ensureModal();
    const title=card.dataset.gameTitle || card.querySelector('h4')?.textContent || card.querySelector('h3')?.textContent || 'لعبة تفاعلية';
    const desc=card.dataset.gameDesc || card.querySelector('p')?.textContent || 'يمكنك الآن تجربة النشاط بحجم أكبر.';
    modal.querySelector('#viewerTitle').textContent=title;
    modal.querySelector('#viewerNote').textContent=desc;
    const body=modal.querySelector('#viewerBody');
    body.innerHTML='';

    const gameType=card.dataset.gameType;
    const programLab=card.dataset.programLab;

    if((gameType && window.BaraemGames) || (programLab && window.ProgrammingLabs)){
      const target=buildFreshGameView(card, body);
      if(gameType && window.BaraemGames){
        target.innerHTML='';
        window.BaraemGames.mount(gameType,target);
      }
      if(programLab && window.ProgrammingLabs){
        target.innerHTML='';
        window.ProgrammingLabs.mount(programLab,target);
      }
    } else {
      const copy=card.cloneNode(true);
      copy.classList.add('glass','card');
      const btn=copy.querySelector('.zoom-btn'); if(btn) btn.remove();
      body.appendChild(copy);
    }

    modal.classList.add('open');
  }
  function bind(){
    document.querySelectorAll('img.zoomable-image, .gallery-grid img, .video-grid img').forEach(img=>{
      if(img.dataset.zoomBound) return;
      img.dataset.zoomBound='1';
      img.addEventListener('click',e=>{e.preventDefault(); e.stopPropagation(); openImage(img)});
    });
    document.querySelectorAll('.interactive-card').forEach(card=>{
      if(card.dataset.viewerBound) return;
      card.dataset.viewerBound='1';
      const trigger=()=>openGameCard(card);
      const zoom=card.querySelector('.zoom-btn');
      if(zoom){zoom.addEventListener('click',e=>{e.preventDefault(); e.stopPropagation(); trigger()})}
      card.addEventListener('click',e=>{
        if(e.target.closest('button,input,select,textarea,label,a,canvas,video')) return;
        trigger();
      });
    });
  }
  ready(bind);
  window.BaraemViewer={bind,openImage,openGameCard};
})();
