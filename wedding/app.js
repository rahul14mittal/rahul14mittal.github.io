// Rahul & Shinjini Wedding Engine (#RahulKiJini)

document.addEventListener('DOMContentLoaded', () => {
  initEntryGate();
  initPetalCanvas();
  initCountdown();
  initScratchCard();
  initAudioPlayer();
});

// 1. ENTRY GATE & UNLOCK TRANSITION
function initEntryGate() {
  const gate = document.getElementById('entry-gate');
  const mainContent = document.getElementById('main-content');
  
  if (!gate) return;
  
  function openGate() {
    if (gate.classList.contains('hidden')) return;
    gate.classList.add('hidden');
    if (mainContent) {
      mainContent.style.display = 'block';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    toggleAudio(true);
  }
  
  gate.addEventListener('click', openGate);
  gate.addEventListener('touchstart', openGate, { passive: true });

  // Auto-tap / transition after 7 seconds if user doesn't click
  setTimeout(() => {
    openGate();
  }, 7000);
}

// 2. AMBIENT AUDIO PLAYER (Supports custom MP3 with Web Audio fallback)
let isPlaying = false;
let audioCtx = null;
let bgAudioElement = null;

function initAudioPlayer() {
  const btn = document.getElementById('audio-btn');

  // Create standard audio element for assets/music.mp3
  bgAudioElement = new Audio('assets/music.mp3');
  bgAudioElement.loop = true;
  bgAudioElement.volume = 0.5;

  if (btn) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAudio(!isPlaying);
    });
  }

  // Global touch & tap fallback to guarantee music starts on first user interaction if 7s timer autoplay was restricted
  function unlockAudioOnFirstTap() {
    if (!isPlaying) {
      toggleAudio(true);
    }
    document.removeEventListener('click', unlockAudioOnFirstTap);
    document.removeEventListener('touchstart', unlockAudioOnFirstTap);
  }

  document.addEventListener('click', unlockAudioOnFirstTap);
  document.addEventListener('touchstart', unlockAudioOnFirstTap);
}

function toggleAudio(play) {
  const btn = document.getElementById('audio-btn');
  if (!btn) return;
  
  if (play && !isPlaying) {
    // Try playing MP3 first
    if (bgAudioElement) {
      const playPromise = bgAudioElement.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isPlaying = true;
          btn.classList.add('playing');
        }).catch(err => {
          console.log("MP3 file assets/music.mp3 not found or blocked; falling back to Web Audio Synth", err);
          startSynthAudio();
        });
      }
    } else {
      startSynthAudio();
    }
  } else if (!play && isPlaying) {
    if (bgAudioElement) {
      bgAudioElement.pause();
    }
    if (audioCtx) {
      audioCtx.suspend();
    }
    isPlaying = false;
    btn.classList.remove('playing');
  }
}

function startSynthAudio() {
  const btn = document.getElementById('audio-btn');
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    playAmbientMelody();
    isPlaying = true;
    if (btn) btn.classList.add('playing');
  } catch (e) {
    console.log("Web Audio error", e);
  }
}

// Generates soft Indian Classical / Shehnai Pentatonic Drone & Melody Synth
function playAmbientMelody() {
  if (!audioCtx) return;
  
  const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // Sa Re Ga Pa Dha Sa pentatonic
  let index = 0;
  
  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  masterGain.connect(audioCtx.destination);
  
  function playNextTone() {
    if (!isPlaying || !audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(notes[index], audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.5);
    
    osc.connect(gain);
    gain.connect(masterGain);
    
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 2.6);
    
    index = (index + 1) % notes.length;
    setTimeout(playNextTone, 1400);
  }
  
  playNextTone();
}

// 3. FALLING PETALS CANVAS ENGINE
function initPetalCanvas() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
  
  const petalsCount = 35;
  const petals = [];
  const colors = ['#9e1b22', '#d4af37', '#e28d93', '#b83b43', '#f7efc8'];
  
  for (let i = 0; i < petalsCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedY: Math.random() * 1.5 + 0.8,
      speedX: Math.sin(Math.random() * Math.PI) * 0.8,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.04,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: Math.random() > 0.8 ? 'butterfly' : 'petal'
    });
  }
  
  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    
    if (p.type === 'butterfly') {
      ctx.font = `${p.size * 1.8}px Arial`;
      ctx.fillText('🦋', -p.size/2, p.size/2);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(p.size / 2, -p.size, p.size, -p.size / 3, 0, p.size);
      ctx.bezierCurveTo(-p.size, -p.size / 3, -p.size / 2, -p.size, 0, 0);
      ctx.fill();
    }
    
    ctx.restore();
  }
  
  function animate() {
    ctx.clearRect(0, 0, width, height);
    petals.forEach(p => {
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.01) * 0.6;
      p.rotation += p.rotationSpeed;
      
      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      drawPetal(p);
    });
    requestAnimationFrame(animate);
  }
  
  animate();
}

// 4. COUNTDOWN ENGINE TO DEC 11, 2026 (MONTHS & DAYS)
function initCountdown() {
  const targetDate = new Date('December 11, 2026 10:00:00 GMT+0530');
  
  function updateTimer() {
    const now = new Date();
    if (now >= targetDate) {
      const elMonths = document.getElementById('cd-months');
      const elDays = document.getElementById('cd-days');
      if (elMonths) elMonths.innerText = "00";
      if (elDays) elDays.innerText = "00";
      return;
    }
    
    let months = (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth());
    let tempDate = new Date(now.getFullYear(), now.getMonth() + months, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
    
    if (tempDate > targetDate) {
      months--;
      tempDate = new Date(now.getFullYear(), now.getMonth() + months, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
    }
    
    const diffTime = targetDate - tempDate;
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const elMonths = document.getElementById('cd-months');
    const elDays = document.getElementById('cd-days');
    
    if (elMonths) elMonths.innerText = String(months).padStart(2, '0');
    if (elDays) elDays.innerText = String(days).padStart(2, '0');
  }
  
  updateTimer();
  setInterval(updateTimer, 60000);
}

// 5. INTERACTIVE SCRATCH CARD
function initScratchCard() {
  const canvas = document.getElementById('scratch-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const w = canvas.width = 320;
  const h = canvas.height = 190;
  
  ctx.fillStyle = '#d4af37';
  ctx.fillRect(0, 0, w, h);
  
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, 'rgba(235, 214, 138, 0.9)');
  grad.addColorStop(0.5, 'rgba(170, 134, 28, 0.9)');
  grad.addColorStop(1, 'rgba(249, 243, 217, 0.9)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  
  ctx.fillStyle = '#7a1f26';
  ctx.font = 'bold 15px "Tenor Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✨ TOUCH HERE ✨', w / 2, h / 2 + 5);
  
  let isScratching = false;
  
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }
  
  function scratch(e) {
    if (!isScratching) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
    ctx.fill();
  }
  
  canvas.addEventListener('mousedown', (e) => { isScratching = true; scratch(e); });
  canvas.addEventListener('mousemove', scratch);
  canvas.addEventListener('mouseup', () => { isScratching = false; });
  canvas.addEventListener('mouseleave', () => { isScratching = false; });
  
  canvas.addEventListener('touchstart', (e) => { isScratching = true; scratch(e); });
  canvas.addEventListener('touchmove', scratch);
  canvas.addEventListener('touchend', () => { isScratching = false; });
}
