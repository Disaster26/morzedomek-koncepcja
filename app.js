(function(){
  var burger=document.querySelector('.burger'),menu=document.getElementById('menu');
  function zamknij(){menu.classList.remove('otwarte');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Otwórz menu');document.body.style.overflow='';document.body.classList.remove('menu-on');}
  burger.addEventListener('click',function(){
    var o=!menu.classList.contains('otwarte');
    menu.classList.toggle('otwarte',o);burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');document.body.style.overflow=o?'hidden':'';document.body.classList.toggle('menu-on',o);
  });
  menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',zamknij);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')zamknij();});

  // aktywna pozycja menu
  var linki={};menu.querySelectorAll('a[href^="#"]').forEach(function(a){linki[a.getAttribute('href').slice(1)]=a;});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){Object.keys(linki).forEach(function(k){linki[k].classList.toggle('aktywny',k===e.target.id);});}
      else if(e.target.id && linki[e.target.id] && e.boundingClientRect.top>0){linki[e.target.id].classList.remove('aktywny');}
    });},{rootMargin:'-45% 0px -50% 0px'});
    Object.keys(linki).forEach(function(k){var s=document.getElementById(k);if(s)io.observe(s);});
    // pasek mobilny po przewinieciu za przycisk
    var mob=document.getElementById('mob'),cta=document.getElementById('hero-cta');
    new IntersectionObserver(function(es){var e=es[0];mob.classList.toggle('widac',!e.isIntersecting&&e.boundingClientRect.top<0);}).observe(cta);
  }

  // karuzele: palec, mysz, strzalki, licznik
  document.querySelectorAll('[data-karuzela]').forEach(function(k){
    var tor=k.querySelector('.tor'),el=tor.children,licz=k.querySelector('.kar-licz'),prev=k.querySelector('.kar-prev'),next=k.querySelector('.kar-next');
    function idx(){var l=tor.getBoundingClientRect().left+parseFloat(getComputedStyle(tor).paddingLeft),b=0,bd=1e9;for(var i=0;i<el.length;i++){var d=Math.abs(el[i].getBoundingClientRect().left-l);if(d<bd){bd=d;b=i;}}return b;}
    function odswiez(){var i=idx(),koniec=tor.scrollLeft+tor.clientWidth>=tor.scrollWidth-4;if(koniec)i=el.length-1;if(licz)licz.textContent=(i+1)+' / '+el.length;if(prev)prev.disabled=tor.scrollLeft<4;if(next)next.disabled=koniec;}
    function idz(n){var i=Math.max(0,Math.min(el.length-1,idx()+n));var l=el[i].offsetLeft-parseFloat(getComputedStyle(tor).paddingLeft);tor.scrollTo({left:l,behavior:'smooth'});}
    if(prev)prev.addEventListener('click',function(){idz(-1);});
    if(next)next.addEventListener('click',function(){idz(1);});
    var t;tor.addEventListener('scroll',function(){clearTimeout(t);t=setTimeout(odswiez,60);},{passive:true});
    window.addEventListener('resize',odswiez);odswiez();
    tor.setAttribute('tabindex','0');
    tor.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();idz(1);}if(e.key==='ArrowLeft'){e.preventDefault();idz(-1);}});
    // przeciaganie mysza
    var start=null,sl=0,ruch=false;
    tor.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button!==0)return;start=e.clientX;sl=tor.scrollLeft;ruch=false;});
    window.addEventListener('pointermove',function(e){if(start===null)return;var dx=e.clientX-start;if(!ruch&&Math.abs(dx)>5){ruch=true;tor.classList.add('ciagnie');}if(ruch){tor.scrollLeft=sl-dx;}});
    window.addEventListener('pointerup',function(){if(start===null)return;start=null;if(ruch){tor.classList.remove('ciagnie');var i=idx();var l=el[i].offsetLeft-parseFloat(getComputedStyle(tor).paddingLeft);tor.scrollTo({left:l,behavior:'smooth'});}});
    tor.addEventListener('click',function(e){if(ruch){e.preventDefault();e.stopPropagation();ruch=false;}},true);
  });

  // formularz pokazowy
  var f=document.getElementById('form');
  f.addEventListener('submit',function(e){e.preventDefault();document.getElementById('form-info').textContent='To podgląd strony - na gotowej stronie zapytanie trafi na kontakt@morze-domek.pl.';});
  var r=document.getElementById('rok');if(r)r.textContent=new Date().getFullYear();
})();
