let homeTeam;
let awayTeam;
let dbTeam;
let homeLogo;
let awayLogo;
let dbLogo;
let matchResult;
let clubInfo;

let currentLanguage = "en";

const TEXTS = {
  pt: {
    subtitle: "Simulador de Futebol",
    play: "▶ TOQUE PARA JOGAR",
    menu: "Menu Principal"
  },
  en: {
    subtitle: "Football Simulator",
    play: "▶ TAP TO PLAY",
    menu: "Main Menu"
  },
  es: {
    subtitle: "Simulador de Fútbol",
    play: "▶ TOCAR PARA JUGAR",
    menu: "Menú Principal"
  },
  fr: {
    subtitle: "Simulateur de Football",
    play: "▶ APPUYER POUR JOUER",
    menu: "Menu Principal"
  }
};

function setLanguage(lang){
  currentLanguage = lang;
  localStorage.setItem("wf26_lang", lang);

  const t = TEXTS[lang];

  document.getElementById("homeSubtitle").innerText = t.subtitle;
  document.querySelector(".playButton").innerText = t.play;
  document.getElementById("menuTitle").innerText = t.menu;
}

function showScreen(screenId){
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const screen = document.getElementById(screenId);

  if(screen){
    screen.classList.add("active");
  }
}

function getTeamById(id){
  return TEAMS.find(team => String(team.id) === String(id));
}

function getOverall(team){
  let total = 0;

  team.players.forEach(player => {
    total += player[2];
  });

  return Math.round(total / team.players.length);
}

function fillTeamSelects(){
  homeTeam.innerHTML = "";
  awayTeam.innerHTML = "";
  dbTeam.innerHTML = "";

  TEAMS.forEach(team => {
    homeTeam.add(new Option(team.name, team.id));
    awayTeam.add(new Option(team.name, team.id));
    dbTeam.add(new Option(team.name, team.id));
  });

  awayTeam.selectedIndex = 1;

  updateLogos();
}

function updateLogos(){
  const home = getTeamById(homeTeam.value);
  const away = getTeamById(awayTeam.value);
  const db = getTeamById(dbTeam.value);

  if(home) homeLogo.src = home.logo;
  if(away) awayLogo.src = away.logo;
  if(db) dbLogo.src = db.logo;
}

function simulateMatch(){
  const home = getTeamById(homeTeam.value);
  const away = getTeamById(awayTeam.value);

  startLiveMatch({
    home,
    away,
    container: matchResult,
    mode: "friendly",
    durationMs: 60000
  });
}

function loadClubDatabase(){
  const team = getTeamById(dbTeam.value);

  clubInfo.innerHTML = `
    <h2>${team.name}</h2>
    <img src="${team.logo}" class="clubLogo">

    <p>📊 Overall: ${getOverall(team)}</p>
    <p>👥 Squad Size: ${team.players.length}</p>

    <hr>

    ${team.players.map(player => `
      <div class="player">
        <strong>${player[0]}</strong><br>
        ${player[1]} • OVR ${player[2]}
      </div>
    `).join("")}
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  homeTeam = document.getElementById("homeTeam");
  awayTeam = document.getElementById("awayTeam");
  dbTeam = document.getElementById("dbTeam");

  homeLogo = document.getElementById("homeLogo");
  awayLogo = document.getElementById("awayLogo");
  dbLogo = document.getElementById("dbLogo");

  matchResult = document.getElementById("matchResult");
  clubInfo = document.getElementById("clubInfo");

  fillTeamSelects();

  const savedLang = localStorage.getItem("wf26_lang") || "en";
  setLanguage(savedLang);

  homeTeam.addEventListener("change", updateLogos);
  awayTeam.addEventListener("change", updateLogos);
  dbTeam.addEventListener("change", updateLogos);

  loadClubDatabase();

  console.log("game.js carregado");
});