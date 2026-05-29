// FitHer - Shared JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Hamburger menu
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() { navMenu.classList.toggle('active'); });
    navMenu.querySelectorAll('a').forEach(l => l.addEventListener('click', () => navMenu.classList.remove('active')));
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      const t = document.querySelector(this.getAttribute('href'));
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Init tools on tools page
  if (document.querySelector('.tool-section')) initCalculators();
});

// Tool Calculators — v2 (Mifflin-St Jeor, US Navy formula, MET Compendium)
function initCalculators() {
  const setup = (id, fn) => {
    const f = document.getElementById(id);
    if (f) f.addEventListener('submit', function(e) { e.preventDefault(); fn(); });
  };

  setup('bmi-form', function() {
    const h = parseFloat(document.getElementById('bmi-h').value) / 100;
    const w = parseFloat(document.getElementById('bmi-w').value);
    if (!h || !w) return;
    const b = (w / (h * h)).toFixed(1);
    const c = b < 18.5 ? 'Underweight' : b < 25 ? 'Normal' : b < 30 ? 'Overweight' : 'Obese';
    showT('bmi-r', 'Your BMI', b, c);
  });

  setup('bf-form', function() {
    const g = document.getElementById('bf-g').value;
    const h = parseFloat(document.getElementById('bf-h').value) || 0;
    const n = parseFloat(document.getElementById('bf-n').value) || 0;
    const wa = parseFloat(document.getElementById('bf-wa').value) || 0;
    const hi = parseFloat(document.getElementById('bf-hi').value) || 0;
    if (!h || !n || !wa) return;
    let bf = g === 'male'
      ? 86.010 * Math.log10(wa - n) - 70.041 * Math.log10(h) + 36.76
      : 163.205 * Math.log10(wa + hi - n) - 97.684 * Math.log10(h) - 78.387;
    bf = Math.max(5, Math.min(50, bf)).toFixed(1);
    const cat = g === 'male'
      ? (bf < 6 ? 'Essential Fat' : bf < 14 ? 'Athletes' : bf < 18 ? 'Fitness' : bf < 25 ? 'Average' : 'Obese')
      : (bf < 14 ? 'Essential Fat' : bf < 21 ? 'Athletes' : bf < 25 ? 'Fitness' : bf < 32 ? 'Average' : 'Obese');
    showT('bf-r', 'Body Fat', bf + '%', cat);
  });

  setup('cal-form', function() {
    const g = document.getElementById('cal-g').value;
    const a = parseInt(document.getElementById('cal-a').value) || 0;
    const h = parseFloat(document.getElementById('cal-h').value) || 0;
    const w = parseFloat(document.getElementById('cal-w').value) || 0;
    const act = parseFloat(document.getElementById('cal-act').value) || 1.2;
    if (!a || !h || !w) return;
    const bmr = g === 'male' ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
    const main = Math.round(bmr * act);
    const r = document.getElementById('cal-r');
    r.innerHTML = '<h3>Daily Calorie Needs</h3><div class="rv">' + main + ' cal</div><div class="rc">Maintenance</div><p style="text-align:center;margin-top:1rem">Mild loss: ' + (main - 300) + ' | Loss: ' + (main - 500) + ' | Extreme: ' + (main - 1000) + '</p>';
    r.classList.add('show');
  });

  setup('macro-form', function() {
    const cal = parseFloat(document.getElementById('macro-cal').value) || 0;
    const g = document.getElementById('macro-goal').value;
    if (!cal) return;
    const ratios = { wl: [.30, .40, .30], maintain: [.25, .50, .25], mg: [.30, .50, .20] };
    const r = ratios[g] || ratios.maintain;
    const pg = Math.round(cal * r[0] / 4);
    const cg = Math.round(cal * r[1] / 4);
    const fg = Math.round(cal * r[2] / 9);
    document.getElementById('macro-r').innerHTML = '<h3>Daily Macros</h3><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-top:1rem">' +
      '<div style="text-align:center;padding:1rem;background:var(--bg);border-radius:8px"><strong style="color:var(--primary)">Protein</strong><div class="rv" style="font-size:1.5rem">' + pg + 'g</div></div>' +
      '<div style="text-align:center;padding:1rem;background:var(--bg);border-radius:8px"><strong style="color:var(--primary)">Carbs</strong><div class="rv" style="font-size:1.5rem">' + cg + 'g</div></div>' +
      '<div style="text-align:center;padding:1rem;background:var(--bg);border-radius:8px"><strong style="color:var(--primary)">Fat</strong><div class="rv" style="font-size:1.5rem">' + fg + 'g</div></div></div>';
    document.getElementById('macro-r').classList.add('show');
  });

  setup('burn-form', function() {
    const w = parseFloat(document.getElementById('burn-w').value) || 0;
    const d = parseFloat(document.getElementById('burn-d').value) || 0;
    const act = document.getElementById('burn-act').value;
    if (!w || !d) return;
    const mets = { walking: 3.5, running: 8, cycling: 6.8, swimming: 6, yoga: 2.5, hiit: 8, strength: 5, 'jump-rope': 10 };
    const cal = Math.round((mets[act] || 5) * w * (d / 60));
    showT('burn-r', 'Calories Burned', cal + ' cal', '');
  });
}

function showT(id, tit, val, cat) {
  const r = document.getElementById(id);
  if (!r) return;
  r.innerHTML = '<h3>' + tit + '</h3><div class="rv">' + val + '</div>' + (cat ? '<div class="rc">' + cat + '</div>' : '');
  r.classList.add('show');
}
