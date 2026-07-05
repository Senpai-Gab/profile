/* ============================================================
   GVV_OS — main.js
   ============================================================ */
(function(){
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- BOOT SEQUENCE ---------- */
  function runBoot(){
    const bootScreen = document.getElementById('boot-screen');
    const bootLog = document.getElementById('boot-log');
    const bootFill = document.getElementById('boot-bar-fill');
    const bootPct = document.getElementById('boot-pct');
    if(!bootScreen) return;

    const lines = [
      'INITIALIZING NEURAL LINK...',
      'MOUNTING SKILLS.DLL...',
      'CONNECTING TO MAINFRAME...',
      'DECRYPTING PROFILE_DATA...',
      'LOADING PROJECTS.DB...',
      'SYSTEM READY.'
    ];

    if(prefersReducedMotion){
      bootScreen.classList.add('is-hidden');
      document.body.classList.remove('boot-lock');
      setTimeout(()=>bootScreen.remove(), 700);
      return;
    }

    document.body.classList.add('boot-lock');
    let pct = 0;
    let lineIndex = 0;

    const lineInterval = setInterval(()=>{
      if(lineIndex >= lines.length){ clearInterval(lineInterval); return; }
      const div = document.createElement('div');
      const isLast = lineIndex === lines.length - 1;
      div.textContent = (isLast ? '> ' : '> ') + lines[lineIndex];
      if(isLast) div.classList.add('ok');
      bootLog.appendChild(div);
      if(bootLog.children.length > 4){ bootLog.removeChild(bootLog.firstChild); }
      lineIndex++;
    }, 320);

    const pctInterval = setInterval(()=>{
      pct += Math.random() * 14 + 6;
      if(pct >= 100){
        pct = 100;
        clearInterval(pctInterval);
        bootFill.style.width = '100%';
        bootPct.textContent = '100%';
        setTimeout(()=>{
          bootScreen.classList.add('is-hidden');
          document.body.classList.remove('boot-lock');
          setTimeout(()=>bootScreen.remove(), 700);
          startHeroSequence();
        }, 380);
        return;
      }
      bootFill.style.width = pct + '%';
      bootPct.textContent = Math.floor(pct) + '%';
    }, 220);
  }

  /* ---------- CUSTOM CURSOR ---------- */
  function initCursor(){
    if(window.matchMedia("(pointer: coarse)").matches) return;
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if(!dot || !ring) return;
    let mx = window.innerWidth/2, my = window.innerHeight/2;
    let rx = mx, ry = my;

    window.addEventListener('mousemove', (e)=>{
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });

    function raf(){
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(raf);
    }
    raf();

    document.querySelectorAll('a, button, .panel, input, textarea').forEach(el=>{
      el.addEventListener('mouseenter', ()=>ring.classList.add('is-active'));
      el.addEventListener('mouseleave', ()=>ring.classList.remove('is-active'));
    });
  }

  /* ---------- PARTICLE FIELD ---------- */
  function initParticles(){
    const canvas = document.getElementById('particle-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles;
    const COLORS = ['rgba(0,245,255,', 'rgba(255,0,122,', 'rgba(252,238,9,'];

    function resize(){
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    function makeParticles(){
      const count = window.innerWidth < 700 ? 26 : 55;
      particles = Array.from({length: count}, ()=>({
        x: Math.random()*w, y: Math.random()*h,
        r: Math.random()*1.6 + 0.4,
        vy: -(Math.random()*0.25 + 0.05),
        vx: (Math.random()-0.5)*0.15,
        c: COLORS[Math.floor(Math.random()*COLORS.length)],
        a: Math.random()*0.5 + 0.15
      }));
    }
    function tick(){
      ctx.clearRect(0,0,w,h);
      particles.forEach(p=>{
        p.x += p.vx; p.y += p.vy;
        if(p.y < -10){ p.y = h + 10; p.x = Math.random()*w; }
        if(p.x < -10) p.x = w + 10;
        if(p.x > w+10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = p.c + p.a + ')';
        ctx.shadowColor = p.c + '1)';
        ctx.shadowBlur = 6;
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }
    resize(); makeParticles();
    window.addEventListener('resize', ()=>{ resize(); makeParticles(); });
    if(!prefersReducedMotion) tick();
  }

  /* ---------- SCROLL PROGRESS + NAV STATE ---------- */
  function initScrollUI(){
    const progress = document.getElementById('scroll-progress');
    const nav = document.getElementById('site-nav');
    const backToTop = document.getElementById('back-to-top');
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-link');

    function onScroll(){
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if(progress) progress.style.width = pct + '%';
      if(nav){ nav.classList.toggle('is-scrolled', scrollTop > 40); }
      if(backToTop) backToTop.style.opacity = scrollTop > 500 ? '1' : '0';

      let current = sections[0] ? sections[0].id : '';
      sections.forEach(sec=>{
        const rect = sec.getBoundingClientRect();
        if(rect.top <= 140) current = sec.id;
      });
      navLinks.forEach(link=>{
        link.classList.toggle('active', link.dataset.section === current);
      });
    }
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();

    if(backToTop){
      backToTop.style.transition = 'opacity .3s';
      backToTop.addEventListener('click', ()=> window.scrollTo({ top:0, behavior:'smooth' }));
    }
  }

  /* ---------- MOBILE NAV ---------- */
  function initMobileNav(){
    const burger = document.getElementById('nav-burger');
    const mobile = document.getElementById('nav-mobile');
    const navLinks = document.getElementById('nav-links');
    const navClock = document.getElementById('nav-clock');
    const backdrop = document.getElementById('nav-backdrop');
    if(!burger || !mobile) return;

    const BREAKPOINT = 900;

    function isMobile(){ return window.innerWidth <= BREAKPOINT; }

    /* Apply the correct show/hide state based on viewport */
    function applyLayout(){
      if(isMobile()){
        burger.style.display = 'flex';
        if(navLinks) navLinks.style.display = 'none';
        if(navClock) navClock.style.display = 'none';
      } else {
        burger.style.display = 'none';
        if(navLinks) navLinks.style.display = 'flex';
        if(navClock) navClock.style.display = 'block';
      }
    }

    function openMenu(){
      mobile.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      if(backdrop) backdrop.classList.add('is-open');
    }

    function closeMenu(){
      mobile.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      if(backdrop) backdrop.classList.remove('is-open');
    }

    /* Run on load */
    applyLayout();

    burger.addEventListener('click', ()=>{
      if(mobile.classList.contains('is-open')){
        closeMenu();
      } else {
        openMenu();
      }
    });

    /* Close on nav link click */
    mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    /* Close on backdrop click */
    if(backdrop) backdrop.addEventListener('click', closeMenu);

    /* Close on Escape key */
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape' && mobile.classList.contains('is-open')) closeMenu();
    });

    /* Re-apply layout on resize (debounced) */
    let resizeTimer;
    window.addEventListener('resize', ()=>{
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(()=>{
        applyLayout();
        if(!isMobile()) closeMenu();
      }, 80);
    });
  }

  /* ---------- CLOCK ---------- */
  function initClock(){
    const clock = document.getElementById('nav-clock');
    if(!clock) return;
    function tick(){
      const d = new Date();
      clock.textContent = d.toLocaleTimeString('en-GB', { hour12:false });
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- TYPING EFFECT ---------- */
  function initTypingEffect(){
    const el = document.getElementById('typed-title');
    if(!el) return;
    const phrases = ['IT Specialist & Technician', 'Full-Stack Web Developer', 'Network Administrator', 'Hardware & ATM Support'];
    let pIndex = 0, cIndex = 0, deleting = false;

    function step(){
      const phrase = phrases[pIndex];
      if(!deleting){
        cIndex++;
        el.textContent = phrase.slice(0, cIndex);
        if(cIndex === phrase.length){
          deleting = true;
          setTimeout(step, 1800);
          return;
        }
      } else {
        cIndex--;
        el.textContent = phrase.slice(0, cIndex);
        if(cIndex === 0){
          deleting = false;
          pIndex = (pIndex + 1) % phrases.length;
        }
      }
      setTimeout(step, deleting ? 35 : 65);
    }
    if(prefersReducedMotion){
      el.textContent = phrases[0];
    } else {
      step();
    }
  }

  /* ---------- GLITCH ON NAME ---------- */
  function initGlitch(){
    const el = document.querySelector('[data-glitch]');
    if(!el || prefersReducedMotion) return;
    function trigger(){
      el.classList.add('is-glitching');
      setTimeout(()=>el.classList.remove('is-glitching'), 380);
      setTimeout(trigger, Math.random()*4000 + 3000);
    }
    setTimeout(trigger, 1200);
  }

  /* ---------- COUNTERS ---------- */
  function initCounters(){
    const counters = document.querySelectorAll('[data-count]');
    if(!counters.length) return;
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1200;
        const start = performance.now();
        function frame(now){
          const t = Math.min((now - start) / duration, 1);
          const val = Math.floor(t * target);
          el.textContent = val + suffix;
          if(t < 1) requestAnimationFrame(frame);
          else el.textContent = target + suffix;
        }
        if(prefersReducedMotion){ el.textContent = target + suffix; }
        else requestAnimationFrame(frame);
        observer.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(el=>observer.observe(el));
  }

  /* ---------- SKILL BARS ---------- */
  function initSkillBars(){
    const bars = document.querySelectorAll('.skill-bar');
    if(!bars.length) return;
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting) return;
        const bar = entry.target;
        const val = bar.dataset.value || 0;
        const fill = bar.querySelector('.skill-bar-fill');
        if(fill) fill.style.width = val + '%';
        observer.unobserve(bar);
      });
    }, { threshold: 0.3 });
    bars.forEach(b=>observer.observe(b));
  }


  /* ---------- CONTACT FORM (front-end only demo) ---------- */
  function initContactForm(){
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if(!form) return;
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      if(status) status.textContent = '> TRANSMITTING...';
      setTimeout(()=>{
        if(status) status.textContent = '> MESSAGE QUEUED. Gabriel will respond via email shortly.';
        form.reset();
      }, 900);
    });
  }

  /* ---------- FOOTER YEAR ---------- */
  function initFooterYear(){
    const el = document.getElementById('footer-year');
    if(el) el.textContent = new Date().getFullYear();
  }

  /* ---------- GSAP SCROLL REVEALS (panels not covered by AOS) ---------- */
  function initGsap(){
    if(typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.timeline-item').forEach((item)=>{
      gsap.fromTo(item, { opacity:0, x: -30 }, {
        opacity:1, x:0, duration: .8, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 85%' }
      });
    });

    gsap.utils.toArray('.hud-corner').forEach((corner, i)=>{
      gsap.fromTo(corner, { opacity:0 }, { opacity:.75, duration:.6, delay: i*.1 });
    });
  }

  /* ---------- HERO INTRO SEQUENCE ---------- */
  function startHeroSequence(){
    if(typeof gsap === 'undefined' || prefersReducedMotion) return;
    gsap.timeline()
      .from('.hero-greeting', { opacity:0, y: 10, duration:.5 })
      .from('.hero-name', { opacity:0, y: 20, duration:.6 }, '-=.2')
      .from('.hero-title', { opacity:0, y: 15, duration:.5 }, '-=.3')
      .from('.hero-intro', { opacity:0, y: 15, duration:.5 }, '-=.3')
      .from('.hero-actions .btn', { opacity:0, y: 15, duration:.4, stagger:.1 }, '-=.3')
      .from('.hero-stats .hero-stat, .hero-stats > *', { opacity:0, y: 15, duration:.4, stagger:.1 }, '-=.2');
  }

  /* ---------- INIT ---------- */
  document.addEventListener('DOMContentLoaded', ()=>{
    if(typeof AOS !== 'undefined'){
      AOS.init({ duration: 700, once: true, offset: 60, easing: 'ease-out-cubic' });
    }
    initScrollUI();
    initMobileNav();
    initClock();
    initTypingEffect();
    initGlitch();
    initCounters();
    initSkillBars();

    initContactForm();
    initFooterYear();
    initCursor();
    initParticles();
    initGsap();
    runBoot();
  });
})();
