const API = "https://thereafter-matthew-closure-grass.trycloudflare.com";

/* ─── NAVIGATION ─────────────────────────────────────── */
function showView(id) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ─── TOP PRESTIGE ───────────────────────────────────── */
async function fetchPrestige() {
  const container = document.getElementById("prestigeList");
  container.innerHTML = `<div class="loading">Cargando ranking…</div>`;

  try {
    const res  = await fetch(`${API}/top/prestige`);
    const data = await res.json();

    let rows = data.map(p => `
      <tr>
        <td>${p.rank}</td>
        <td>${p.name}</td>
        <td>${p.prestige.toLocaleString()}</td>
      </tr>
    `).join("");

    container.innerHTML = `
      <table>
        <thead><tr><th>#</th><th>Jugador</th><th>Prestige</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  } catch {
    container.innerHTML = `<div class="loading">Error al cargar datos.</div>`;
  }
}

document.getElementById("prestige").addEventListener("click", fetchPrestige);

/* ─── PLAYER SEARCH ──────────────────────────────────── */
let chart;

async function fetchPlayer() {
  let tag = document.getElementById("playerTag").value.trim();
  if (!tag) return;
  if (!tag.startsWith("#")) tag = "#" + tag;

  const dataEl    = document.getElementById("playerData");
  const chartWrap = document.getElementById("chartWrapper");

  dataEl.innerHTML = `<div class="loading">Buscando jugador…</div>`;
  chartWrap.style.display = "none";

  try {
    const res  = await fetch(`${API}/player/${encodeURIComponent(tag)}`);
    const data = await res.json();

    if (data.error) {
      dataEl.innerHTML = `<div class="loading">Jugador no encontrado.</div>`;
      return;
    }

    dataEl.innerHTML = `
      <div class="player-card">
        <div class="player-card-name">${data.name}</div>
        <div class="stat-item">
          <span class="stat-label">Trofeos máximos</span>
          <span class="stat-value">${data.highest_trophies.toLocaleString()}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Prestige total</span>
          <span class="stat-value">${data.total_prestige.toLocaleString()}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Victorias 3v3</span>
          <span class="stat-value">${data.wins3v3.toLocaleString()}</span>
        </div>
      </div>
    `;

    // Chart
    const labels   = data.history.map(h => h[0]);
    const trophies = data.history.map(h => h[1]);
    const wins3v3  = data.history.map(h => h[2]);
    const solo     = data.history.map(h => h[3]);

    if (chart) chart.destroy();

    const ctx = document.getElementById("chart");

    Chart.defaults.color = "#5a7a9e";
    Chart.defaults.font.family = "'DM Sans', sans-serif";

    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Trophies",
            data: trophies,
            borderColor: "#00d4ff",
            backgroundColor: "rgba(0,212,255,0.08)",
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: "#00d4ff",
            tension: 0.4,
            fill: true,
          },
          {
            label: "3v3 Wins",
            data: wins3v3,
            borderColor: "#0057ff",
            backgroundColor: "rgba(0,87,255,0.08)",
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: "#0057ff",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Solo Wins",
            data: solo,
            borderColor: "#00b4ff",
            backgroundColor: "rgba(0,180,255,0.06)",
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: "#00b4ff",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: "#5a7a9e",
              boxWidth: 12,
              padding: 20,
            },
          },
          tooltip: {
            backgroundColor: "#071222",
            borderColor: "rgba(255,255,255,0.07)",
            borderWidth: 1,
            titleColor: "#e8f0fe",
            bodyColor: "#5a7a9e",
            padding: 12,
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(255,255,255,0.04)" },
            ticks: { color: "#5a7a9e" },
          },
          y: {
            grid: { color: "rgba(255,255,255,0.04)" },
            ticks: { color: "#5a7a9e" },
          },
        },
      },
    });

    chartWrap.style.display = "block";

  } catch {
    dataEl.innerHTML = `<div class="loading">Error al cargar jugador.</div>`;
  }
}

// Allow Enter key on input
document.getElementById("playerTag").addEventListener("keydown", e => {
  if (e.key === "Enter") fetchPlayer();
});

/* ─── BRAWLER TOP ────────────────────────────────────── */
async function fetchBrawler() {
  const name      = document.getElementById("brawlerName").value.trim();
  const container = document.getElementById("brawlerList");

  if (!name) return;

  container.innerHTML = `<div class="loading">Buscando brawler…</div>`;

  try {
    const res  = await fetch(`${API}/top/brawler/${encodeURIComponent(name)}`);
    const data = await res.json();

    if (data.error) {
      container.innerHTML = `<div class="loading">No hay datos para este brawler.</div>`;
      return;
    }

    let rows = data.map(p => `
      <tr>
        <td>${p.rank}</td>
        <td>${p.name}</td>
        <td>${p.trophies.toLocaleString()}</td>
      </tr>
    `).join("");

    container.innerHTML = `
      <table>
        <thead><tr><th>#</th><th>Jugador</th><th>Trofeos</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  } catch {
    container.innerHTML = `<div class="loading">Error al cargar datos.</div>`;
  }
}

document.getElementById("brawlerName").addEventListener("keydown", e => {
  if (e.key === "Enter") fetchBrawler();
});
