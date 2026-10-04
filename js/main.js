// js/main.js

// CURSOR
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => { 
  mx=e.clientX; 
  my=e.clientY; 
  dot.style.left=mx+'px'; 
  dot.style.top=my+'px'; 
});

(function animRing(){ 
  rx+=(mx-rx)*0.11; 
  ry+=(my-ry)*0.11; 
  ring.style.left=rx+'px'; 
  ring.style.top=ry+'px'; 
  requestAnimationFrame(animRing); 
})();

document.querySelectorAll('a, button, .proj-card, .paper-card, .ach-card, .article-row, .contact-link').forEach(el => {
  el.addEventListener('mouseenter',()=>{ 
    ring.style.width='50px'; 
    ring.style.height='50px'; 
    ring.style.borderColor='var(--teal)'; 
  });
  el.addEventListener('mouseleave',()=>{ 
    ring.style.width='32px'; 
    ring.style.height='32px'; 
    ring.style.borderColor='var(--teal-mid)'; 
  });
});

// NAV SCROLL
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', scrollY > 30);
});

// ACTIVE NAV
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      navLinks.forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if(link) link.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => observer.observe(s));

// SCROLL REVEAL
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

// Dual image cursor tracking removed as Hero section is now static.

// TYPEWRITER (nav terminal)
const cmds = ['python train.py','./run_inference.sh','git commit -m "edge AI"','docker run llm-service','python deploy.py --edge'];
let ci=0,ci2=0,typing=true,waiting=false;
const cmdEl = document.getElementById('terminal-cmd');
if(cmdEl) {
  setInterval(()=>{
    if(waiting) return;
    const t = cmds[ci];
    if(typing){ 
        cmdEl.textContent='$ '+t.slice(0,ci2+1); 
        ci2++; 
        if(ci2>=t.length){ typing=false; waiting=true; setTimeout(()=>waiting=false,2400); } 
    } else { 
        cmdEl.textContent='$ '+t.slice(0,ci2-1); 
        ci2--; 
        if(ci2<=0){ typing=true; ci=(ci+1)%cmds.length; waiting=true; setTimeout(()=>waiting=false,400); } 
    }
  }, 75);
}

// ─── EMAIL MATRIX DECRYPT EFFECT ───
(function initEmailGlitch() {
  const el = document.getElementById('email-glitch-target');
  if (!el) return;
  const real = el.dataset.text;
  const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let hasRun = false;

  function randomChar() {
    return matrixChars[Math.floor(Math.random() * matrixChars.length)];
  }

  function runDecrypt() {
    if (hasRun) return;
    hasRun = true;

    const totalFrames = 28;  
    const revealDelay = 3;   
    let frame = 0;

    const interval = setInterval(() => {
      let output = '';
      for (let i = 0; i < real.length; i++) {
        const lockFrame = i * revealDelay;
        if (frame >= lockFrame + 6) {
          // Locked: show real char
          output += real[i];
        } else if (frame >= lockFrame) {
          // Scrambling: show random char
          output += (real[i] === '@' || real[i] === '.') ? real[i] : randomChar();
        } else {
          // Not started yet: show scrambled
          output += randomChar();
        }
      }
      el.textContent = output;

      frame++;
      if (frame > totalFrames + real.length * revealDelay / 2) {
        clearInterval(interval);
        el.textContent = real; // ensure final state is correct
      }
    }, 40);
  }

  const contactSection = document.getElementById('contact');
  if (contactSection) {
    const glitchObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(runDecrypt, 600); 
          glitchObs.disconnect();
        }
      });
    }, { threshold: 0.3 });
    glitchObs.observe(contactSection);
  }
})();

// ─── GEOLOCATION-BASED CONTENT VISIBILITY (SIH FILTER) ───
(function initGeoFiltering() {
  function applyGeoVisibility(countryCode) {
    const code = (countryCode || '').toUpperCase();
    const isIndia = code === 'IN';
    const docEl = document.documentElement;

    docEl.classList.toggle('geo-in', isIndia);
    docEl.classList.toggle('geo-foreign', !isIndia && !!code);

    document.querySelectorAll('[data-geo-hide-in="IN"]').forEach(el => {
      el.classList.toggle('geo-hidden', isIndia);
      if (isIndia) {
        el.style.setProperty('display', 'none', 'important');
      } else {
        el.style.removeProperty('display');
      }
    });

    const achGrid = document.querySelector('.ach-grid');
    if (achGrid) {
      achGrid.classList.toggle('two-cols', isIndia);
    }

    let rank = 1;
    document.querySelectorAll('.ach-grid .ach-card').forEach(card => {
      const isCardHidden = isIndia && card.hasAttribute('data-geo-hide-in');
      if (!isCardHidden) {
        card.classList.remove('reveal-d1', 'reveal-d2', 'reveal-d3');
        card.classList.add('reveal-d' + rank);
        const rankEl = card.querySelector('.ach-rank');
        if (rankEl) {
          rankEl.textContent = String(rank).padStart(2, '0');
        }
        rank++;
      }
    });

    console.info(`[GeoFilter] Visitor Country: ${code || 'Unknown'} | SIH Finalist: ${isIndia ? 'Hidden (India IP)' : 'Visible (International IP)'}`);
  }

  // Developer / testing hook: window.setGeoCountry('US') or window.setGeoCountry('IN') or window.setGeoCountry('reset')
  window.setGeoCountry = function(code) {
    if (!code || code === 'reset') {
      sessionStorage.removeItem('visitor_country');
      console.info('[GeoFilter] Country reset. Reloading...');
      window.location.reload();
      return;
    }
    const cleanCode = code.toUpperCase();
    sessionStorage.setItem('visitor_country', cleanCode);
    applyGeoVisibility(cleanCode);
    console.info(`[GeoFilter] Country manually set to: ${cleanCode}`);
  };

  async function fetchCountryWithTimeout(url, parser, ms = 3000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) return null;
      return await parser(res);
    } catch (e) {
      clearTimeout(timer);
      return null;
    }
  }

  async function detectVisitorCountry() {
    // 1. URL parameter override (?geo=US or ?geo=IN or ?geo=reset)
    try {
      const params = new URLSearchParams(window.location.search);
      const override = params.get('geo') || params.get('country');
      if (override) {
        if (override.toLowerCase() === 'reset') {
          sessionStorage.removeItem('visitor_country');
        } else {
          const clean = override.toUpperCase();
          sessionStorage.setItem('visitor_country', clean);
          return clean;
        }
      }
    } catch (e) {}

    // 2. Cached in sessionStorage
    try {
      const cached = sessionStorage.getItem('visitor_country');
      if (cached) return cached;
    } catch (e) {}

    // 3. Multi-service detection chain
    // Service 1: Cloudflare trace (fastest, high availability)
    let country = await fetchCountryWithTimeout('https://cloudflare.com/cdn-cgi/trace', async res => {
      const text = await res.text();
      const match = text.match(/loc=([A-Z]{2})/i);
      return match ? match[1].toUpperCase() : null;
    });

    // Service 2: ipwho.is
    if (!country) {
      country = await fetchCountryWithTimeout('https://ipwho.is/', async res => {
        const data = await res.json();
        return data && data.country_code ? data.country_code.toUpperCase() : null;
      });
    }

    // Service 3: api.country.is
    if (!country) {
      country = await fetchCountryWithTimeout('https://api.country.is', async res => {
        const data = await res.json();
        return data && data.country ? data.country.toUpperCase() : null;
      });
    }

    // 4. Heuristic Fallback: Timezone & Offset if network APIs are blocked by adblockers or offline
    if (!country) {
      const tz = (Intl && Intl.DateTimeFormat) ? Intl.DateTimeFormat().resolvedOptions().timeZone : '';
      const offset = new Date().getTimezoneOffset();
      if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta' || offset === -330) {
        country = 'IN';
      }
    }

    if (country) {
      try {
        sessionStorage.setItem('visitor_country', country);
      } catch (e) {}
    }

    return country;
  }

  // Pre-apply cached or timezone heuristic immediately to avoid layout jumps
  let initialCountry = null;
  try {
    initialCountry = sessionStorage.getItem('visitor_country');
    if (!initialCountry) {
      const tz = (Intl && Intl.DateTimeFormat) ? Intl.DateTimeFormat().resolvedOptions().timeZone : '';
      const offset = new Date().getTimezoneOffset();
      if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta' || offset === -330) {
        initialCountry = 'IN';
      }
    }
  } catch (e) {}

  if (initialCountry) {
    applyGeoVisibility(initialCountry);
  }

  detectVisitorCountry().then(country => {
    if (country) {
      applyGeoVisibility(country);
    }
  });
})();


