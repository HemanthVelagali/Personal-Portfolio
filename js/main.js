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
