// ========================================
// Puzzle Configuration
// ========================================

// Puzzle data - each number maps to a letter
const lines = [
  [16, 1, 25, 25, 11],
  [6, 22, 25, 13, 4, 17, 16, 12, 4],
  [9, 25, 3, 16],
  [17, 22, 1],
  [12, 19, 3, 17, 22, 1, 25, 10, 12, 19, 26],
  [12, 5, 1, 19, 6, 11]
];

// Number to letter mapping
const mapping = {
  1: 'E', 2: 'K', 3: 'O', 4: 'S', 5: 'G', 6: 'C', 7: 'P', 8: 'U',
  9: 'F', 10: 'L', 11: 'Y', 12: 'A', 13: 'I', 14: 'B', 15: 'J', 16: 'M',
  17: 'T', 18: 'Q', 19: 'N', 20: 'W', 21: 'Z', 22: 'H', 23: 'X', 24: 'V',
  25: 'R', 26: 'D'
};

// ========================================
// DOM Elements
// ========================================

const linesContainer = document.getElementById('lines');
const decoderGrid = document.getElementById('decoderGrid');
const flipSound = document.getElementById('flipSound');

// ========================================
// Build Puzzle UI
// ========================================

// Build puzzle rows
lines.forEach((row, rIdx) => {
  const rowEl = document.createElement('div');
  rowEl.className = 'line';
  rowEl.dataset.idx = rIdx;

  row.forEach(n => {
    const token = document.createElement('div');
    token.className = 'token';
    token.textContent = n;
    token.dataset.n = n;
    token.tabIndex = 0;
    token.addEventListener('click', onTokenClick);
    rowEl.appendChild(token);
  });

  linesContainer.appendChild(rowEl);
});

// Build decoder grid (reference key)
for (let i = 1; i <= 26; i++) {
  const card = document.createElement('div');
  card.className = 'decoder-card';
  card.innerHTML = `<small>${i}</small><strong>${mapping[i] || '?'}</strong>`;
  decoderGrid.appendChild(card);
}

// ========================================
// Token Reveal Logic
// ========================================

function revealToken(el) {
  if (el.classList.contains('revealed')) return;

  const n = Number(el.dataset.n);
  el.classList.add('revealed');
  el.textContent = mapping[n] || '?';

  // Play flip sound
  try {
    flipSound.currentTime = 0;
    flipSound.play();
  } catch (e) {
    // Ignore audio errors
  }

  checkSolved();
}

function onTokenClick(e) {
  revealToken(e.currentTarget);
}

// ========================================
// Button Controls
// ========================================

// Reveal All button
document.getElementById('revealAll').addEventListener('click', () => {
  document.querySelectorAll('.token').forEach(t => revealToken(t));
});

// Reset button
document.getElementById('resetBtn').addEventListener('click', () => {
  document.querySelectorAll('.token').forEach(t => {
    t.classList.remove('revealed');
    t.textContent = t.dataset.n;
  });
  document.getElementById('modal').style.display = 'none';
});

// Hint button - reveals one random hidden token
document.getElementById('hintBtn').addEventListener('click', () => {
  const hidden = [...document.querySelectorAll('.token')].filter(t => !t.classList.contains('revealed'));
  if (hidden.length === 0) return;

  const randomToken = hidden[Math.floor(Math.random() * hidden.length)];
  revealToken(randomToken);
});

// ========================================
// Keyboard Shortcuts
// ========================================

// Quick-reveal with number keys when hovering over a row
let activeRow = null;

document.querySelectorAll('.line').forEach(row => {
  row.addEventListener('mouseenter', () => activeRow = row);
  row.addEventListener('mouseleave', () => activeRow = null);
});

window.addEventListener('keydown', ev => {
  if (!activeRow) return;

  const k = ev.key;
  if (!/^[0-9]$/.test(k)) return;

  const num = (k === '0') ? 10 : Number(k);
  const btn = [...activeRow.querySelectorAll('.token')].find(b => Number(b.dataset.n) === num);

  if (btn) revealToken(btn);
});

// ========================================
// Win Condition
// ========================================

function checkSolved() {
  const allTokens = [...document.querySelectorAll('.token')];

  if (allTokens.every(t => t.classList.contains('revealed'))) {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
    triggerConfetti();
  }
}

// Close modal button
document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
});

// ========================================
// Confetti Animation
// ========================================

function triggerConfetti() {
  const confettiCount = 60;

  for (let i = 0; i < confettiCount; i++) {
    const el = document.createElement('div');

    // Style confetti piece
    el.style.position = 'fixed';
    el.style.zIndex = 9999;
    el.style.left = (Math.random() * 100) + '%';
    el.style.top = '-10px';
    el.style.width = '9px';
    el.style.height = '14px';
    el.style.background = ['#fff', '#dfe8f0', '#b11226', '#7fb6c2'][Math.floor(Math.random() * 4)];
    el.style.opacity = 0.95;
    el.style.borderRadius = '2px';
    el.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';

    document.body.appendChild(el);

    // Animate confetti
    const dx = (Math.random() * 80) - 40;
    const duration = 1600 + Math.random() * 900;

    el.animate([
      { transform: `translateY(0px) rotate(0deg)` },
      { transform: `translate(${dx}px, ${600 + Math.random() * 200}px) rotate(520deg)` }
    ], {
      duration,
      easing: 'cubic-bezier(.2,.7,.2,1)',
      iterations: 1
    });

    // Remove confetti after animation
    setTimeout(() => el.remove(), duration + 50);
  }
}

// ========================================
// Snow Canvas Animation
// ========================================

const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');

let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

// Resize canvas on window resize
window.addEventListener('resize', () => {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
});

// Create snowflakes
const snowflakes = Array.from({ length: 120 }).map(() => ({
  x: Math.random() * w,
  y: Math.random() * h,
  r: 1 + Math.random() * 3,
  d: Math.random() * 1.5
}));

// Animation loop
function draw() {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';

  snowflakes.forEach(flake => {
    ctx.beginPath();
    ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
    ctx.fill();

    // Update snowflake position
    flake.y += flake.d + Math.sin(flake.x * 0.01);

    // Reset snowflake to top when it falls off screen
    if (flake.y > h + 10) {
      flake.y = -10;
      flake.x = Math.random() * w;
    }
  });

  requestAnimationFrame(draw);
}

// Start animation
draw();

// ========================================
// Background Music & Volume Overlay
// ========================================

const bgMusic = document.getElementById('bgMusic');
const volumeOverlay = document.getElementById('volumeOverlay');

// Show volume overlay - Click to start music
window.addEventListener('load', () => {
  // Overlay stays visible until user clicks
  // No auto-play - user must interact to start music

  // Scroll to top to ensure wax seal is visible
  window.scrollTo(0, 0);
});

// Click overlay to start music and enter site
volumeOverlay.addEventListener('click', () => {
  // Start music playback
  bgMusic.play().then(() => {
    console.log('Music started successfully');
  }).catch(error => {
    console.log('Playback error:', error);
  });

  // Hide overlay with animation
  volumeOverlay.style.animation = 'fadeIn 0.5s ease reverse';
  setTimeout(() => {
    volumeOverlay.style.display = 'none';
  }, 500);
});

// ========================================
// Draggable Stamps (stamps 0-4)
// ========================================

const draggableStamps = ['.stamp_0', '.stamp_1', '.stamp_2', '.stamp_3', '.stamp_4'];

draggableStamps.forEach(selector => {
  const stamp = document.querySelector(selector);
  if (!stamp) return;

  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  stamp.addEventListener('mousedown', dragStart);
  stamp.addEventListener('touchstart', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('touchmove', drag);
  document.addEventListener('mouseup', dragEnd);
  document.addEventListener('touchend', dragEnd);

  function dragStart(e) {
    // Get the initial position
    const rect = stamp.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();

    if (e.type === 'touchstart') {
      initialX = e.touches[0].clientX - xOffset;
      initialY = e.touches[0].clientY - yOffset;
    } else {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
    }

    if (e.target === stamp || stamp.contains(e.target)) {
      isDragging = true;
      stamp.style.zIndex = 1000;
    }
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();

      if (e.type === 'touchmove') {
        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;
      } else {
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
      }

      xOffset = currentX;
      yOffset = currentY;

      // Get the current rotation from the transform
      const computedStyle = window.getComputedStyle(stamp);
      const transform = computedStyle.transform;
      let rotation = '';

      // Extract rotation if it exists
      if (transform && transform !== 'none') {
        const matrix = transform.match(/matrix.*\((.+)\)/);
        if (matrix) {
          const values = matrix[1].split(', ');
          const a = parseFloat(values[0]);
          const b = parseFloat(values[1]);
          const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
          rotation = ` rotate(${angle}deg)`;
        }
      }

      stamp.style.transform = `translate(${currentX}px, ${currentY}px)${rotation}`;
    }
  }

  function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
    stamp.style.zIndex = 5;
  }
});
