const API = "https://thereafter-matthew-closure-grass.trycloudflare.com";

function showView(id) {
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    document.getElementById(id).classList.add("active");
  }



  async function fetchPrestige() {
    const res = await fetch(`${API}/top/prestige`);
    const data = await res.json();
  
    let html = "<table><tr><th>#</th><th>Name</th><th>Prestige</th></tr>";
  
    for (let p of data) {
      html += `<tr><td>${p.rank}</td><td>${p.name}</td><td>${p.prestige}</td></tr>`;
    }
  
    html += "</table>";
    document.getElementById("prestigeList").innerHTML = html;
  }
  
  // cargar automáticamente al entrar
  document.getElementById("prestige").addEventListener("click", fetchPrestige);



  let chart;

async function fetchPlayer() {
  let tag = document.getElementById("playerTag").value;
  if (!tag.startsWith("#")) tag = "#" + tag;

  const res = await fetch(`${API}/player/${encodeURIComponent(tag)}`);
  const data = await res.json();

  if (data.error) {
    alert("Jugador no encontrado");
    return;
  }

  // INFO
  document.getElementById("playerData").innerHTML = `
    <div class="card">
      <h3>${data.name}</h3>
      <p>🏆 ${data.highest_trophies}</p>
      <p>✨ ${data.total_prestige}</p>
      <p>🎮 ${data.wins3v3}</p>
    </div>
  `;

  // HISTORIAL
  const labels = data.history.map(h => h[0]);
  const trophies = data.history.map(h => h[1]);
  const wins3v3 = data.history.map(h => h[2]);
  const solo = data.history.map(h => h[3]);

  if (chart) chart.destroy();

  const ctx = document.getElementById("chart");

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: "Trophies", data: trophies },
        { label: "3v3 Wins", data: wins3v3 },
        { label: "Solo Wins", data: solo }
      ]
    }
  });
}



async function fetchBrawler() {
    let name = document.getElementById("brawlerName").value;
  
    const res = await fetch(`${API}/top/brawler/${name}`);
    const data = await res.json();
  
    if (data.error) {
      alert("No hay datos");
      return;
    }
  
    let html = "<table><tr><th>#</th><th>Name</th><th>Trophies</th></tr>";
  
    for (let p of data) {
      html += `<tr><td>${p.rank}</td><td>${p.name}</td><td>${p.trophies}</td></tr>`;
    }
  
    html += "</table>";
  
    document.getElementById("brawlerList").innerHTML = html;
  }