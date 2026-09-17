'use strict';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const W = 800;
const H = 600;

// ── Input ─────────────────────────────────────────────────────────────────────
const keys = {};
const justPressed = {};

window.addEventListener('keydown', e => {
  justPressed[e.code] = !keys[e.code];
  keys[e.code] = true;
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code))
    e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

function pressed(code) {
  const val = justPressed[code];
  justPressed[code] = false;
  return val;
}

// ── Utils ─────────────────────────────────────────────────────────────────────
const wrap  = (v, max) => ((v % max) + max) % max;
const dist  = (a, b)   => Math.hypot(a.x - b.x, a.y - b.y);
const rand  = (min, max) => min + Math.random() * (max - min);
const randInt = (min, max) => Math.floor(rand(min, max + 1));

// ── Skins ──────────────────────────────────────────────────────────────────────
const SKINS = {
  classic: {
    name: 'Clásica',
    draw(ctx, ship) {
      ctx.strokeStyle = ship.powerUpTime > 0 ? '#39f' : '#fff';
      ctx.lineWidth   = 1.5;
      ctx.lineJoin    = 'round';
      ctx.beginPath();
      ctx.moveTo( 20,  0);
      ctx.lineTo(-12, -9);
      ctx.lineTo( -7,  0);
      ctx.lineTo(-12,  9);
      ctx.closePath();
      ctx.stroke();

      if (ship.thrusting && Math.random() > 0.35) {
        const flame = ship.powerUpTime > 0 ? 1.6 : 1;
        ctx.beginPath();
        ctx.moveTo(-8, -4);
        ctx.lineTo(-8 - rand(6, 14) * flame, 0);
        ctx.lineTo(-8,  4);
        ctx.strokeStyle = ship.powerUpTime > 0 ? 'rgba(0, 220, 255, 0.9)' : 'rgba(255, 130, 0, 0.85)';
        ctx.stroke();
      }
    }
  },
  arrow: {
    name: 'Flecha',
    draw(ctx, ship) {
      ctx.strokeStyle = ship.powerUpTime > 0 ? '#39f' : '#fff';
      ctx.lineWidth   = 1.5;
      ctx.lineJoin    = 'round';
      ctx.beginPath();
      ctx.moveTo( 22,  0);
      ctx.lineTo(-10, -7);
      ctx.lineTo(-5,  0);
      ctx.lineTo(-10,  7);
      ctx.closePath();
      ctx.stroke();

      if (ship.thrusting && Math.random() > 0.35) {
        const flame = ship.powerUpTime > 0 ? 1.6 : 1;
        ctx.beginPath();
        ctx.moveTo(-6, -3);
        ctx.lineTo(-6 - rand(8, 16) * flame, 0);
        ctx.lineTo(-6,  3);
        ctx.strokeStyle = ship.powerUpTime > 0 ? 'rgba(0, 220, 255, 0.9)' : 'rgba(255, 130, 0, 0.85)';
        ctx.stroke();
      }
    }
  },
  triangle: {
    name: 'Triángulo',
    draw(ctx, ship) {
      ctx.strokeStyle = ship.powerUpTime > 0 ? '#39f' : '#fff';
      ctx.lineWidth   = 1.5;
      ctx.lineJoin    = 'round';
      ctx.beginPath();
      ctx.moveTo( 18,  0);
      ctx.lineTo(-12, -10);
      ctx.lineTo(-12,  10);
      ctx.closePath();
      ctx.stroke();

      if (ship.thrusting && Math.random() > 0.35) {
        const flame = ship.powerUpTime > 0 ? 1.6 : 1;
        ctx.beginPath();
        ctx.moveTo(-10, -4);
        ctx.lineTo(-10 - rand(6, 14) * flame, 0);
        ctx.lineTo(-10,  4);
        ctx.strokeStyle = ship.powerUpTime > 0 ? 'rgba(0, 220, 255, 0.9)' : 'rgba(255, 130, 0, 0.85)';
        ctx.stroke();
      }
    }
  },
  modern: {
    name: 'Moderna',
    draw(ctx, ship) {
      ctx.strokeStyle = ship.powerUpTime > 0 ? '#39f' : '#fff';
      ctx.lineWidth   = 1.5;
      ctx.lineJoin    = 'round';
      ctx.beginPath();
      ctx.moveTo( 20,  0);
      ctx.lineTo(-5, -12);
      ctx.lineTo(-10, -4);
      ctx.lineTo(-10,  4);
      ctx.lineTo(-5,  12);
      ctx.closePath();
      ctx.stroke();

      // Cabina
      ctx.beginPath();
      ctx.arc(5, 0, 3, 0, Math.PI * 2);
      ctx.stroke();

      if (ship.thrusting && Math.random() > 0.35) {
        const flame = ship.powerUpTime > 0 ? 1.6 : 1;
        ctx.beginPath();
        ctx.moveTo(-8, -3);
        ctx.lineTo(-8 - rand(8, 16) * flame, 0);
        ctx.lineTo(-8,  3);
        ctx.strokeStyle = ship.powerUpTime > 0 ? 'rgba(0, 220, 255, 0.9)' : 'rgba(255, 130, 0, 0.85)';
        ctx.stroke();
      }
    }
  },
  retro: {
    name: 'Retro',
    draw(ctx, ship) {
      ctx.strokeStyle = ship.powerUpTime > 0 ? '#39f' : '#fff';
      ctx.lineWidth   = 2;
      ctx.lineJoin    = 'miter';

      // Cuerpo principal (pixelado)
      ctx.beginPath();
      ctx.moveTo( 16,  0);
      ctx.lineTo(  8, -6);
      ctx.lineTo(-10, -6);
      ctx.lineTo(-14, -2);
      ctx.lineTo(-14,  2);
      ctx.lineTo(-10,  6);
      ctx.lineTo(  8,  6);
      ctx.closePath();
      ctx.stroke();

      // Cabina pixelada
      ctx.beginPath();
      ctx.rect(4, -3, 6, 6);
      ctx.stroke();

      if (ship.thrusting && Math.random() > 0.35) {
        const flame = ship.powerUpTime > 0 ? 1.6 : 1;
        ctx.beginPath();
        ctx.moveTo(-12, -2);
        ctx.lineTo(-12 - rand(6, 14) * flame, 0);
        ctx.lineTo(-12,  2);
        ctx.strokeStyle = ship.powerUpTime > 0 ? 'rgba(0, 220, 255, 0.9)' : 'rgba(255, 130, 0, 0.85)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }
};

const SKIN_KEYS = Object.keys(SKINS);

// ── Bullet ────────────────────────────────────────────────────────────────────
class Bullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    const SPEED = 520;
    this.vx = Math.cos(angle) * SPEED;
    this.vy = Math.sin(angle) * SPEED;
    this.ttl  = 1.1;
    this.radius = 2;
    this.dead = false;
  }

  update(dt) {
    this.x = wrap(this.x + this.vx * dt, W);
    this.y = wrap(this.y + this.vy * dt, H);
    this.ttl -= dt;
    if (this.ttl <= 0) this.dead = true;
  }

  draw() {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ── Asteroid ──────────────────────────────────────────────────────────────────
const RADII  = [0, 16, 30, 50];   // por tamaño 1, 2, 3
const SPEEDS = [0, 85, 55, 32];   // velocidad base por tamaño
const POINTS = [0, 100, 50, 20];  // puntos por tamaño
const POWERUP_CHANCE = [0, 0.08, 0.15, 0.30];  // probabilidad de soltar power up por tamaño
const SHIELD_CHANCE = [0, 0.04, 0.08, 0.15];    // probabilidad de soltar escudo por tamaño
const TRIPLE_CHANCE  = [0, 0.05, 0.10, 0.20];   // probabilidad de soltar triple shot por tamaño
const SHIELD_DURATION = 5;                       // segundos de protección
const SHIELD_COOLDOWN = 8;                       // segundos de recarga
const SHIELD_BOUNCE_ELASTICITY = 0.8;            // factor de rebote del asteroide
const SHIELD_HIT_PAUSE = 0.15;                   // pausa del timer tras golpe (s)
const SHIELD_BREAK_DURATION = 0.4;               // duración animación rotura (s)
const SHIELD_SHIP_KNOCKBACK = 60;                // empujón a la nave (px/s)

class Asteroid {
  constructor(x, y, size = 3) {
    this.x    = x;
    this.y    = y;
    this.size = size;
    this.radius = RADII[size];
    this.dead = false;

    const angle = rand(0, Math.PI * 2);
    const speed = SPEEDS[size] + rand(-15, 15);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.rotSpeed = rand(-1.2, 1.2);
    this.rot = rand(0, Math.PI * 2);

    // Polígono irregular
    const n = randInt(8, 13);
    this.verts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const r = this.radius * rand(0.6, 1.0);
      this.verts.push([Math.cos(a) * r, Math.sin(a) * r]);
    }
  }

  update(dt) {
    this.x   = wrap(this.x + this.vx * dt, W);
    this.y   = wrap(this.y + this.vy * dt, H);
    this.rot += this.rotSpeed * dt;
  }

  split() {
    if (this.size <= 1) return [];
    return [
      new Asteroid(this.x, this.y, this.size - 1),
      new Asteroid(this.x, this.y, this.size - 1),
    ];
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth   = 1.5;
    ctx.lineJoin    = 'round';
    ctx.beginPath();
    ctx.moveTo(this.verts[0][0], this.verts[0][1]);
    for (let i = 1; i < this.verts.length; i++)
      ctx.lineTo(this.verts[i][0], this.verts[i][1]);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}

// ── ShootingStar (estrella fugaz) ─────────────────────────────────────────────
class ShootingStar {
  constructor() {
    const edge = randInt(0, 3);
    const margin = 50;
    switch (edge) {
      case 0: this.x = rand(0, W); this.y = -margin; break;
      case 1: this.x = W + margin; this.y = rand(0, H); break;
      case 2: this.x = rand(0, W); this.y = H + margin; break;
      case 3: this.x = -margin; this.y = rand(0, H); break;
    }
    const targetX = W / 2 + rand(-100, 100);
    const targetY = H / 2 + rand(-100, 100);
    const angle = Math.atan2(targetY - this.y, targetX - this.x) + rand(-0.5, 0.5);
    const speed = 220 + rand(-20, 20);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.ttl = 4 + rand(0, 1.5);
    this.radius = 12;
    this.dead = false;

    this.trail = [];
    this.maxTrailLength = 18;

    this.rot = 0;
    this.rotSpeed = rand(2, 5) * (Math.random() > 0.5 ? 1 : -1);
    this.points = 5;
    this.outerR = 12;
    this.innerR = 5;
  }

  update(dt) {
    this.trail.unshift({ x: this.x, y: this.y, alpha: 1 });
    if (this.trail.length > this.maxTrailLength) this.trail.pop();
    this.trail.forEach(s => s.alpha *= 0.85);

    this.x = wrap(this.x + this.vx * dt, W);
    this.y = wrap(this.y + this.vy * dt, H);
    this.rot += this.rotSpeed * dt;
    this.ttl -= dt;
    if (this.ttl <= 0) this.dead = true;
  }

  draw() {
    if (this.trail.length > 1) {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (let i = 0; i < this.trail.length - 1; i++) {
        const s = this.trail[i];
        const s2 = this.trail[i + 1];
        const w = (1 - i / this.trail.length) * 4;
        ctx.strokeStyle = `rgba(255, 255, 0, ${s.alpha * 0.6})`;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s2.x, s2.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff0';
    ctx.strokeStyle = '#ff0';
    ctx.fillStyle = 'rgba(255, 255, 0, 0.9)';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let i = 0; i < this.points * 2; i++) {
      const r = i % 2 === 0 ? this.outerR : this.innerR;
      const a = (i / (this.points * 2)) * Math.PI * 2;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

// ── Ship ──────────────────────────────────────────────────────────────────────
class Ship {
  constructor() { this.reset(); }

  reset() {
    this.x      = W / 2;
    this.y      = H / 2;
    this.angle  = -Math.PI / 2;
    this.vx     = 0;
    this.vy     = 0;
    this.radius = 12;
    this.thrusting        = false;
    this.invincible       = 3;
    this.shootCooldown    = 0;
    this.powerUpTime      = 0;   // tiempo restante de velocidad doble
    this.shieldTime       = 0;   // tiempo restante de escudo
    this.shieldCooldown   = 0;   // tiempo de recarga del escudo
    this.shieldHitPause   = 0;   // pausa temporal del timer tras golpe
    this.shieldBreakAnim  = 0;   // animación de rotura del escudo
    this.tripleShotTime   = 0;   // tiempo restante de triple disparo
    this.dead             = false;

    // Cargar skin guardado o usar 'classic' por defecto
    this.skinKey = localStorage.getItem('asteroids_skin') || 'classic';
    if (!SKINS[this.skinKey]) this.skinKey = 'classic';
  }

  // Activa el power up: reinicia el cronómetro, no acumula tiempo
  activatePowerUp(seconds = 5) {
    this.powerUpTime = seconds;
  }

  activateShield(seconds = SHIELD_DURATION) {
    if (this.shieldCooldown <= 0) {
      this.shieldTime = seconds;
      this.shieldCooldown = SHIELD_COOLDOWN;
    }
  }

  // Activa triple disparo: reinicia el cronómetro, no acumula tiempo
  activateTripleShot(seconds = 5) {
    this.tripleShotTime = seconds;
  }

  update(dt) {
    if (this.dead) return;
    if (this.invincible    > 0) this.invincible    -= dt;
    if (this.shootCooldown > 0) this.shootCooldown -= dt;
    if (this.powerUpTime   > 0) this.powerUpTime   -= dt;
    if (this.shieldHitPause > 0) this.shieldHitPause -= dt;
    else if (this.shieldTime > 0) this.shieldTime    -= dt;
    if (this.shieldCooldown > 0) this.shieldCooldown -= dt;
    if (this.shieldBreakAnim > 0) this.shieldBreakAnim -= dt;
    if (this.tripleShotTime > 0) this.tripleShotTime -= dt;

    const ROT    = 3.5;
    const THRUST = 260;
    const DRAG   = 0.987;
    const boost  = this.powerUpTime > 0 ? 2 : 1;

    if (keys['ArrowLeft'])  this.angle -= ROT * dt;
    if (keys['ArrowRight']) this.angle += ROT * dt;

    this.thrusting = !!keys['ArrowUp'];
    if (this.thrusting) {
      this.vx += Math.cos(this.angle) * THRUST * boost * dt;
      this.vy += Math.sin(this.angle) * THRUST * boost * dt;
    }

    this.vx *= DRAG;
    this.vy *= DRAG;
    this.x = wrap(this.x + this.vx * dt, W);
    this.y = wrap(this.y + this.vy * dt, H);
  }

  tryShoot() {
    if (this.shootCooldown > 0 || this.dead) return [];
    this.shootCooldown = 0.2;
    const NOSE = 21;
    const ox = this.x + Math.cos(this.angle) * NOSE;
    const oy = this.y + Math.sin(this.angle) * NOSE;

    if (this.tripleShotTime > 0) {
      const SPREAD = 0.15; // ~8.6 grados
      return [
        new Bullet(ox, oy, this.angle - SPREAD),
        new Bullet(ox, oy, this.angle),
        new Bullet(ox, oy, this.angle + SPREAD),
      ];
    }
    return [new Bullet(ox, oy, this.angle)];
  }

  setSkin(key) {
    if (SKINS[key]) {
      this.skinKey = key;
      localStorage.setItem('asteroids_skin', key);
      skinChangeMsg = `SKIN: ${SKINS[key].name}`;
      skinChangeTimer = 2;
      return true;
    }
    return false;
  }

  nextSkin() {
    const idx = SKIN_KEYS.indexOf(this.skinKey);
    const nextIdx = (idx + 1) % SKIN_KEYS.length;
    this.setSkin(SKIN_KEYS[nextIdx]);
  }

  prevSkin() {
    const idx = SKIN_KEYS.indexOf(this.skinKey);
    const prevIdx = (idx - 1 + SKIN_KEYS.length) % SKIN_KEYS.length;
    this.setSkin(SKIN_KEYS[prevIdx]);
  }

  draw() {
    if (this.dead) return;
    // Parpadeo durante invencibilidad de reaparición
    if (this.invincible > 0 && Math.floor(this.invincible * 8) % 2 === 0) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    const skin = SKINS[this.skinKey];
    if (skin && skin.draw) {
      skin.draw(ctx, this);
    }

    ctx.restore();
  }

  drawShield() {
    // Escudo activo o animación de rotura
    if (this.shieldTime <= 0 && this.shieldBreakAnim <= 0) return;
    
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Animación de rotura del escudo
    if (this.shieldBreakAnim > 0) {
      const progress = 1 - this.shieldBreakAnim / SHIELD_BREAK_DURATION;
      const pieces = 6;
      const baseR = this.radius + 8;
      
      for (let i = 0; i < pieces; i++) {
        const a = (i / pieces) * Math.PI * 2 - Math.PI / 6 + progress * Math.PI * 2;
        const r = baseR * (1 + progress * 0.6);
        const alpha = 0.5 * (1 - progress);
        
        ctx.strokeStyle = `rgba(0, 200, 255, ${alpha.toFixed(2)})`;
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        // Fragmento de hexágono (2 lados por pieza)
        const a1 = a;
        const a2 = a + Math.PI / 3 * (1 - progress * 0.5);
        ctx.moveTo(Math.cos(a1) * baseR * 0.8, Math.sin(a1) * baseR * 0.8);
        ctx.lineTo(Math.cos(a2) * r, Math.sin(a2) * r);
        ctx.stroke();
        
        // Partículas pequeñas saliendo
        if (Math.random() < 0.3) {
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r;
          ctx.fillStyle = `rgba(0, 220, 255, ${alpha.toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(px, py, 1.5 * (1 - progress), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
      return;
    }
    
    // Escudo normal (activo)
    const pulse = 1 + Math.sin(Date.now() / 100) * 0.08;
    const r = (this.radius + 8) * pulse;
    const alpha = 0.3 + 0.2 * Math.sin(Date.now() / 80);
    
    ctx.strokeStyle = `rgba(0, 200, 255, ${alpha.toFixed(2)})`;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    // Hexágono
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    
    // Brillo interno
    ctx.strokeStyle = `rgba(0, 240, 255, ${(alpha * 0.5).toFixed(2)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
      const x = Math.cos(a) * (r * 0.7);
      const y = Math.sin(a) * (r * 0.7);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}

// ── Partículas (explosión) ────────────────────────────────────────────────────
class Particle {
  constructor(x, y) {
    this.x  = x;
    this.y  = y;
    const angle = rand(0, Math.PI * 2);
    const speed = rand(30, 130);
    this.vx   = Math.cos(angle) * speed;
    this.vy   = Math.sin(angle) * speed;
    this.life = rand(0.4, 1.1);
    this.ttl  = this.life;
    this.dead = false;
  }

  update(dt) {
    this.x  += this.vx * dt;
    this.y  += this.vy * dt;
    this.ttl -= dt;
    if (this.ttl <= 0) this.dead = true;
  }

  draw() {
    const alpha = this.ttl / this.life;
    ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.vx * 0.05, this.y - this.vy * 0.05);
    ctx.stroke();
  }
}

// ── Power Up ──────────────────────────────────────────────────────────────────
class PowerUp {
  constructor(x, y, type = 'speed') {
    this.x = x;
    this.y = y;
    this.type = type;        // 'speed' o 'triple'
    this.baseY = y;          // posición base para flotar
    this.radius = 14;
    this.ttl = 9;            // expira si no se recoge a tiempo
    this.t = rand(0, Math.PI * 2);
    this.dead = false;
  }

  update(dt) {
    this.t += dt * 4;
    this.y  = this.baseY + Math.sin(this.t) * 5;   // flotación
    this.ttl -= dt;
    if (this.ttl <= 0) this.dead = true;
  }

  draw() {
    // Parpadeo al estar por expirar
    if (this.ttl < 2 && Math.floor(this.ttl * 6) % 2 === 0) return;

    const pulse = 1 + Math.sin(this.t * 2) * 0.12;
    const isTriple = this.type === 'triple';
    ctx.strokeStyle = isTriple ? '#f3f' : '#39f';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * pulse, 0, Math.PI * 2);
    ctx.stroke();

    if (isTriple) {
      // Icono de triple disparo: tres líneas/puntos
      ctx.fillStyle = '#f3f';
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const offset = (i - 1) * 6;
        ctx.moveTo(this.x + offset - 2, this.y - 6);
        ctx.lineTo(this.x + offset - 2, this.y + 6);
      }
      ctx.stroke();
    } else {
      // Rayo (relámpago) de velocidad
      ctx.fillStyle = '#39f';
      ctx.beginPath();
      ctx.moveTo(this.x + 3, this.y - 8);
      ctx.lineTo(this.x - 5, this.y - 1);
      ctx.lineTo(this.x - 1, this.y - 1);
      ctx.lineTo(this.x - 3, this.y + 8);
      ctx.lineTo(this.x + 6, this.y + 1);
      ctx.lineTo(this.x + 1, this.y + 1);
      ctx.closePath();
      ctx.fill();
    }
  }
}

// ── Shield Power Up (escudo) ────────────────────────────────────────────────────
class ShieldPowerUp {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.radius = 14;
    this.ttl = 9;
    this.t = rand(0, Math.PI * 2);
    this.dead = false;
  }

  update(dt) {
    this.t += dt * 4;
    this.y  = this.baseY + Math.sin(this.t) * 5;
    this.ttl -= dt;
    if (this.ttl <= 0) this.dead = true;
  }

  draw() {
    if (this.ttl < 2 && Math.floor(this.ttl * 6) % 2 === 0) return;

    const pulse = 1 + Math.sin(this.t * 2) * 0.12;
    ctx.strokeStyle = '#0cf';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * pulse, 0, Math.PI * 2);
    ctx.stroke();

    // Hexágono interno (icono de escudo)
    ctx.fillStyle = '#0cf';
    ctx.beginPath();
    const r = this.radius * 0.5 * pulse;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
      const x = this.x + Math.cos(a) * r;
      const y = this.y + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }
}

// ── Estado del juego ──────────────────────────────────────────────────────────
let ship, bullets, asteroids, particles, powerUps, shootingStars;
let score, lives, level;
let state;      // 'playing' | 'dead' | 'gameover'
let deadTimer;
let skinChangeMsg = null;  // mensaje temporal al cambiar skin
let skinChangeTimer = 0;

function spawnAsteroids(count) {
  const SAFE_DIST = 130;
  for (let i = 0; i < count; i++) {
    let x, y;
    do {
      x = rand(0, W);
      y = rand(0, H);
    } while (Math.hypot(x - W / 2, y - H / 2) < SAFE_DIST);
    asteroids.push(new Asteroid(x, y, 3));
    if (Math.random() < 0.08) shootingStars.push(new ShootingStar());
  }
}

function initGame() {
  ship          = new Ship();
  bullets   = [];
  asteroids = [];
  particles = [];
  powerUps  = [];
  shootingStars = [];
  score  = 0;
  lives  = 3;
  level  = 1;
  state  = 'playing';
  spawnAsteroids(4);
}

function nextLevel() {
  level++;
  bullets   = [];
  particles = [];
  powerUps  = [];
  shootingStars = [];
  ship.reset();
  spawnAsteroids(3 + level);
}

function explode(x, y, count = 8) {
  for (let i = 0; i < count; i++) particles.push(new Particle(x, y));
}

function absorbShieldParticles(x, y) {
  // Partículas que se contraen hacia el centro (absorción)
  const count = 12;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const speed = rand(80, 150);
    const p = new Particle(x, y);
    p.vx = -Math.cos(angle) * speed;  // hacia adentro
    p.vy = -Math.sin(angle) * speed;
    p.life = rand(0.3, 0.6);
    p.ttl = p.life;
    // Color cian del escudo
    p.draw = function() {
      const alpha = this.ttl / this.life;
      ctx.strokeStyle = `rgba(0, 220, 255, ${alpha.toFixed(2)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - this.vx * 0.03, this.y - this.vy * 0.03);
      ctx.stroke();
    };
    particles.push(p);
  }
}

function killShip() {
  explode(ship.x, ship.y, 14);
  ship.dead = true;
  lives--;
  if (lives <= 0) {
    state = 'gameover';
  } else {
    state     = 'dead';
    deadTimer = 2;
  }
}

// ── Update ────────────────────────────────────────────────────────────────────
function update(dt) {
  if (state === 'gameover') {
    if (pressed('Space')) initGame();
    particles.forEach(p => p.update(dt));
    particles = particles.filter(p => !p.dead);
    return;
  }

  if (state === 'dead') {
    deadTimer -= dt;
    particles.forEach(p => p.update(dt));
    particles = particles.filter(p => !p.dead);
    asteroids.forEach(a => a.update(dt));
    shootingStars.forEach(s => s.update(dt));
    shootingStars = shootingStars.filter(s => !s.dead);
    powerUps.forEach(p => p.update(dt));
    powerUps = powerUps.filter(p => !p.dead);
    if (deadTimer <= 0) { state = 'playing'; ship.reset(); }
    return;
  }

  // Disparar
  if (pressed('Space')) {
    bullets.push(...ship.tryShoot());
  }

  // Cambio de skin (solo en playing)
  if (pressed('Digit1')) ship.setSkin(SKIN_KEYS[0]);
  else if (pressed('Digit2')) ship.setSkin(SKIN_KEYS[1]);
  else if (pressed('Digit3')) ship.setSkin(SKIN_KEYS[2]);
  else if (pressed('Digit4')) ship.setSkin(SKIN_KEYS[3]);
  else if (pressed('Digit5')) ship.setSkin(SKIN_KEYS[4]);
  else if (pressed('Digit6')) ship.setSkin(SKIN_KEYS[5]);
  else if (pressed('Digit7')) ship.setSkin(SKIN_KEYS[6]);
  else if (pressed('Digit8')) ship.setSkin(SKIN_KEYS[7]);
  else if (pressed('Digit9')) ship.setSkin(SKIN_KEYS[8]);
  else if (pressed('KeyK')) ship.nextSkin();
  else if (pressed('KeyS')) ship.prevSkin();

  if (skinChangeMsg) {
    skinChangeTimer -= dt;
    if (skinChangeTimer <= 0) skinChangeMsg = null;
  }

  ship.update(dt);
  bullets.forEach(b => b.update(dt));
  asteroids.forEach(a => a.update(dt));
  shootingStars.forEach(s => s.update(dt));
  particles.forEach(p => p.update(dt));

  bullets   = bullets.filter(b => !b.dead);
  particles = particles.filter(p => !p.dead);
  shootingStars = shootingStars.filter(s => !s.dead);

  // Bala vs asteroide
  const newAsteroids = [];
  for (const b of bullets) {
    for (const a of asteroids) {
      if (!a.dead && !b.dead && dist(b, a) < a.radius) {
        b.dead = true;
        a.dead = true;
        score += POINTS[a.size];
        explode(a.x, a.y, a.size * 5);
        newAsteroids.push(...a.split());
        // El asteroide puede soltar un power up flotante (probabilidad por tamaño)
        if (Math.random() < POWERUP_CHANCE[a.size]) {
          const type = Math.random() < TRIPLE_CHANCE[a.size] ? 'triple' : 'speed';
          powerUps.push(new PowerUp(a.x, a.y, type));
        }
        // El asteroide puede soltar un escudo (probabilidad por tamaño)
        if (Math.random() < SHIELD_CHANCE[a.size])
          powerUps.push(new ShieldPowerUp(a.x, a.y));
      }
    }
  }
  asteroids = asteroids.filter(a => !a.dead).concat(newAsteroids);
  bullets   = bullets.filter(b => !b.dead);

  // Bala vs estrella fugaz
  for (const b of bullets) {
    for (const s of shootingStars) {
      if (!s.dead && !b.dead && dist(b, s) < s.radius) {
        b.dead = true;
        s.dead = true;
        score += 500 * level;
        explode(s.x, s.y, 12);
      }
    }
  }
  shootingStars = shootingStars.filter(s => !s.dead);
  bullets = bullets.filter(b => !b.dead);

  // Nave CON ESCUDO vs asteroides: rebote
  if (ship.shieldTime > 0 && !ship.dead) {
    for (const a of asteroids) {
      if (!a.dead && dist(ship, a) < ship.radius + a.radius * 0.82) {
        // Normal de colisión (desde nave hacia asteroide)
        const nx = a.x - ship.x;
        const ny = a.y - ship.y;
        const d = Math.hypot(nx, ny) || 1;
        const n = { x: nx / d, y: ny / d };
        
        // Rebote asteroide: invierte componente normal + factor elasticidad
        const vDotN = a.vx * n.x + a.vy * n.y;
        if (vDotN < 0) {
          a.vx -= 2 * vDotN * n.x * SHIELD_BOUNCE_ELASTICITY;
          a.vy -= 2 * vDotN * n.y * SHIELD_BOUNCE_ELASTICITY;
        }
        
        // Empujón nave (opuesto)
        ship.vx -= n.x * SHIELD_SHIP_KNOCKBACK;
        ship.vy -= n.y * SHIELD_SHIP_KNOCKBACK;
        
        // Partículas de impacto en el punto de contacto
        explode(ship.x + n.x * ship.radius, ship.y + n.y * ship.radius, 8);
        
        // Pausar timer del escudo brevemente para feedback visual
        ship.shieldHitPause = SHIELD_HIT_PAUSE;
        break;
      }
    }
    
    // Nave CON ESCUDO vs estrella fugaz: consume escudo y destruye estrella
    for (const s of shootingStars) {
      if (!s.dead && dist(ship, s) < ship.radius + s.radius * 0.8) {
        score += 500 * level;
        absorbShieldParticles(ship.x, ship.y);
        
        // Consumir escudo completamente
        ship.shieldTime = 0;
        ship.shieldCooldown = SHIELD_COOLDOWN;
        ship.shieldBreakAnim = SHIELD_BREAK_DURATION;
        
        s.dead = true;
        break;
      }
    }
  }

  // Nave vs asteroide (SIN escudo)
  if (ship.invincible <= 0 && ship.shieldTime <= 0) {
    for (const a of asteroids) {
      if (dist(ship, a) < ship.radius + a.radius * 0.82) {
        killShip();
        break;
      }
    }
    // Nave vs estrella fugaz
    for (const s of shootingStars) {
      if (dist(ship, s) < ship.radius + s.radius * 0.8) {
        killShip();
        break;
      }
    }
  }

  // Power Ups flotantes: actualizar, filtrar y recoger con la nave
  powerUps.forEach(p => p.update(dt));
  powerUps = powerUps.filter(p => !p.dead);
  if (!ship.dead) {
    for (const p of powerUps) {
      if (dist(ship, p) < ship.radius + p.radius) {
        p.dead = true;
        if (p.constructor.name === 'ShieldPowerUp') {
          ship.activateShield();
        } else if (p.type === 'triple') {
          ship.activateTripleShot(5);
        } else {
          ship.activatePowerUp(5);   // reinicia el tiempo, no se acumula
        }
        explode(p.x, p.y, 6);
      }
    }
    powerUps = powerUps.filter(p => !p.dead);
  }

  // Nivel completado
  if (asteroids.length === 0) nextLevel();
}

// ── Draw ──────────────────────────────────────────────────────────────────────
function drawLifeIcon(x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-Math.PI / 2);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth   = 1.2;
  ctx.lineJoin    = 'round';
  ctx.beginPath();
  ctx.moveTo( 9,  0);
  ctx.lineTo(-6, -5);
  ctx.lineTo(-3,  0);
  ctx.lineTo(-6,  5);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function drawHUD() {
  ctx.fillStyle = '#fff';
  ctx.font = '15px monospace';

  ctx.textAlign = 'left';
  ctx.fillText(`SCORE  ${score}`, 14, 26);

  ctx.textAlign = 'center';
  ctx.fillText(`NIVEL ${level}`, W / 2, 26);

  // Indicador de velocidad doble: tiempo restante y barra de duración
  if (ship.powerUpTime > 0) {
    const t = ship.powerUpTime;
    ctx.fillStyle = '#39f';
    ctx.font = '13px monospace';
    ctx.fillText(`VEL. DOBLE ${t.toFixed(1)}s`, W / 2, 44);
    ctx.fillStyle = 'rgba(0, 200, 255, 0.25)';
    ctx.fillRect(W / 2 - 60, 50, 120, 4);
    ctx.fillStyle = '#39f';
    ctx.fillRect(W / 2 - 60, 50, 120 * (t / 5), 4);
  }

  // Indicador de triple disparo
  if (ship.tripleShotTime > 0) {
    const yBase = ship.powerUpTime > 0 ? 64 : 44;
    const t = ship.tripleShotTime;
    ctx.fillStyle = '#f3f';
    ctx.font = '13px monospace';
    ctx.fillText(`TRIPLE SHOT ${t.toFixed(1)}s`, W / 2, yBase);
    ctx.fillStyle = 'rgba(255, 50, 255, 0.25)';
    ctx.fillRect(W / 2 - 60, yBase + 6, 120, 4);
    ctx.fillStyle = '#f3f';
    ctx.fillRect(W / 2 - 60, yBase + 6, 120 * (t / 5), 4);
  }

  // Indicador de escudo: tiempo restante y barra de duración / recarga
  if (ship.shieldTime > 0) {
    const t = ship.shieldTime;
    ctx.fillStyle = '#0cf';
    ctx.font = '13px monospace';
    ctx.fillText(`ESCUDO ${t.toFixed(1)}s`, W / 2, 62);
    ctx.fillStyle = 'rgba(0, 200, 255, 0.25)';
    ctx.fillRect(W / 2 - 60, 68, 120, 4);
    ctx.fillStyle = '#0cf';
    ctx.fillRect(W / 2 - 60, 68, 120 * (t / SHIELD_DURATION), 4);
  } else if (ship.shieldCooldown > 0) {
    const t = ship.shieldCooldown;
    ctx.fillStyle = 'rgba(0, 200, 255, 0.5)';
    ctx.font = '13px monospace';
    ctx.fillText(`ESCUDO RECARGANDO ${t.toFixed(1)}s`, W / 2, 62);
    ctx.fillStyle = 'rgba(0, 200, 255, 0.15)';
    ctx.fillRect(W / 2 - 60, 68, 120, 4);
    ctx.fillStyle = 'rgba(0, 200, 255, 0.5)';
    ctx.fillRect(W / 2 - 60, 68, 120 * (1 - t / SHIELD_COOLDOWN), 4);
  }

  // Mensaje de cambio de skin
  if (skinChangeMsg) {
    ctx.fillStyle = '#39f';
    ctx.font = '14px monospace';
    ctx.fillText(skinChangeMsg, W / 2, H - 30);
  }

  for (let i = 0; i < lives; i++)
    drawLifeIcon(W - 16 - i * 22, 18);

}

function drawOverlay(title, sub) {
  ctx.textAlign   = 'center';
  ctx.fillStyle   = '#fff';
  ctx.font        = 'bold 46px monospace';
  ctx.fillText(title, W / 2, H / 2 - 18);
  ctx.font        = '18px monospace';
  ctx.fillStyle   = 'rgba(255,255,255,0.65)';
  ctx.fillText(sub, W / 2, H / 2 + 22);
}

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  particles.forEach(p => p.draw());
  powerUps.forEach(p => p.draw());
  asteroids.forEach(a => a.draw());
  shootingStars.forEach(s => s.draw());
  bullets.forEach(b => b.draw());
  ship.draw();
  ship.drawShield();

  drawHUD();

  if (state === 'gameover')
    drawOverlay('GAME OVER', `PUNTAJE: ${score}   —   ESPACIO PARA REINICIAR`);
}

// ── Loop principal ────────────────────────────────────────────────────────────
let lastTime = null;

function loop(ts) {
  const dt = lastTime === null ? 0 : Math.min((ts - lastTime) / 1000, 0.05);
  lastTime = ts;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

initGame();
requestAnimationFrame(loop);
