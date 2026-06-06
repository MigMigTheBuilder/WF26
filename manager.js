let managerTeams = [];
let managerClub = null;
let managerMoney = 50000000;
let managerSeason = 1;
let currentRound = 1;
let leagueTable = [];
let newsLog = [];

let managerFormation = "2-1-2";
let managerLineup = [];
let managerBench = [];

let managerLiveInterval = null;
let managerMatch = null;

function cloneTeamsForManager(){
  managerTeams = JSON.parse(JSON.stringify(TEAMS));
}

function managerGetTeamById(id){
  return managerTeams.find(team => String(team.id) === String(id));
}

function addNews(title, text){
  newsLog.unshift({
    title,
    text,
    season: managerSeason,
    round: currentRound
  });

  if(newsLog.length > 60){
    newsLog.pop();
  }
}

function getAgeFromPlayerName(name){
  const ages = {
    "Erling Haaland":25,
    "Phil Foden":25,
    "Rodri":29,
    "Jeremy Doku":23,
    "Rúben Dias":28,
    "Bernardo Silva":31,
    "Josko Gvardiol":23,
    "Savinho":21,

    "Kylian Mbappé":27,
    "Vinícius Junior":25,
    "Jude Bellingham":22,
    "Rodrygo":25,
    "Federico Valverde":27,
    "Aurélien Tchouaméni":25,
    "Eduardo Camavinga":23,
    "Antonio Rüdiger":32,

    "Robert Lewandowski":37,
    "Lamine Yamal":18,
    "Raphinha":29,
    "Pedri":23,
    "Gavi":21,
    "Frenkie de Jong":28,
    "Pau Cubarsí":18,
    "Jules Koundé":26,

    "Bruno Fernandes":31,
    "Rasmus Hojlund":22,
    "Joshua Zirkzee":24,
    "Mainoo":20,
    "Lisandro Martínez":27,
    "Garnacho":21,
    "Leny Yoro":20,
    "Diogo Dalot":26,

    "Lucas Paquetá":28,
    "Pedro":28,
    "Arrascaeta":31,
    "Bruno Henrique":35,
    "De La Cruz":28,
    "Léo Pereira":29,
    "Ayrton Lucas":28,
    "Rossi":30
  };

  return ages[name] || Math.floor(Math.random() * 12) + 22;
}

function calculatePotential(ovr, age){
  if(age <= 18) return Math.min(99, ovr + 12 + Math.floor(Math.random() * 8));
  if(age <= 21) return Math.min(97, ovr + 8 + Math.floor(Math.random() * 7));
  if(age <= 24) return Math.min(95, ovr + 4 + Math.floor(Math.random() * 6));
  if(age <= 27) return Math.min(93, ovr + Math.floor(Math.random() * 4));
  if(age <= 30) return Math.max(ovr, ovr + Math.floor(Math.random() * 2));

  return ovr;
}

function prepareManagerPlayers(){
  managerTeams.forEach(team => {
    team.players.forEach(player => {
      if(player.length < 4){
        player[3] = getAgeFromPlayerName(player[0]);
      }

      if(player.length < 5){
        player[4] = calculatePotential(player[2], player[3]);
      }

      if(player[3] >= 31 && player[4] > player[2]){
        player[4] = player[2];
      }

      if(player.length < 6){
        player[5] = 0;
      }
    });
  });
}

function startManagerMode(){
  cloneTeamsForManager();
  prepareManagerPlayers();

  const managerContent = document.getElementById("managerContent");

  managerContent.innerHTML = `
    <h3>🏆 Choose Your Club</h3>

    <select id="managerClubSelect"></select>

    <br><br>

    <button onclick="createCareer()">Start Career</button>
  `;

  const select = document.getElementById("managerClubSelect");

  managerTeams.forEach(team => {
    select.add(new Option(team.name, team.id));
  });
}

function createCareer(){
  const select = document.getElementById("managerClubSelect");

  managerClub = managerGetTeamById(select.value);
  managerMoney = 50000000;
  managerSeason = 1;
  currentRound = 1;
  newsLog = [];
  managerFormation = "2-1-2";

  managerLineup = managerClub.players.slice(0, 5);
  managerBench = managerClub.players.slice(5);

  createLeagueTable();

  addNews(
    "🏆 New Era Begins",
    `${managerClub.name} have announced you as their new manager.`
  );

  renderManagerHome();
}

function getManagerOverall(team){
  let total = 0;

  team.players.forEach(player => {
    total += player[2];
  });

  return Math.round(total / team.players.length);
}

function renderManagerHome(){
  const managerContent = document.getElementById("managerContent");
  const overall = getManagerOverall(managerClub);

  managerContent.innerHTML = `
    <img src="${managerClub.logo}" class="clubLogo">

    <h2>${managerClub.name}</h2>

    <p>📅 Season: ${managerSeason}</p>
    <p>📍 Round: ${currentRound}/${MAX_ROUNDS}</p>
    <p>💰 Budget: €${managerMoney.toLocaleString()}</p>
    <p>📊 Overall: ${overall}</p>
    <p>⚙️ Formation: ${managerFormation}</p>
    <p>👥 Squad: ${managerClub.players.length}/${MAX_SQUAD_SIZE}</p>

    <br>

    <button onclick="playLeagueMatch()">⚽ Next Match</button>
    <button onclick="viewStandings()">📊 Standings</button>
    <button onclick="viewSquad()">👥 Squad</button>
    <button onclick="viewLineup()">🔁 Lineup</button>
    <button onclick="changeFormation()">⚙️ Formation</button>
    <button onclick="viewTransfers()">💰 Transfers</button>
    <button onclick="viewNews()">📰 News</button>
  `;
}

function getRandomOpponent(){
  const opponents = managerTeams.filter(team => team.id !== managerClub.id);
  return opponents[Math.floor(Math.random() * opponents.length)];
}

function getAvailablePlayers(team){
  return team.players.filter(player => !player[5] || player[5] <= 0);
}

function refreshLineupAfterSquadChange(){
  const available = getAvailablePlayers(managerClub);

  managerLineup = managerLineup.filter(player =>
    available.some(p => p[0] === player[0])
  );

  available.forEach(player => {
    const alreadyStarter = managerLineup.some(p => p[0] === player[0]);

    if(managerLineup.length < 5 && !alreadyStarter){
      managerLineup.push(player);
    }
  });

  managerBench = available.filter(player =>
    !managerLineup.some(p => p[0] === player[0])
  );
}

function viewLineup(){
  refreshLineupAfterSquadChange();

  const managerContent = document.getElementById("managerContent");

  managerContent.innerHTML = `
    <h2>🔁 Lineup</h2>

    <p>Formation: ${managerFormation}</p>
    <p>Choose 1 starter and 1 bench player. Then press Swap.</p>

    <hr>

    <p>⭐ Starter:</p>

    <select id="starterSwap">
      ${managerLineup.map((player, index) => `
        <option value="${index}">
          ${player[0]} - ${player[1]} OVR ${player[2]}
        </option>
      `).join("")}
    </select>

    <p>🪑 Bench:</p>

    <select id="benchSwap">
      ${
        managerBench.length === 0
        ? `<option value="-1">No bench players</option>`
        : managerBench.map((player, index) => `
          <option value="${index}">
            ${player[0]} - ${player[1]} OVR ${player[2]}
          </option>
        `).join("")
      }
    </select>

    <br><br>

    <button onclick="swapLineupPlayer()">🔄 Swap Players</button>

    <hr>

    <h3>⭐ Starters</h3>

    ${managerLineup.map(player => `
      <div class="player">
        <strong>${player[0]}</strong><br>
        ${player[1]} • OVR ${player[2]}
      </div>
    `).join("")}

    <hr>

    <h3>🪑 Bench</h3>

    ${
      managerBench.length === 0
      ? "<p>No bench players.</p>"
      : managerBench.map(player => `
        <div class="player">
          <strong>${player[0]}</strong><br>
          ${player[1]} • OVR ${player[2]}
        </div>
      `).join("")
    }

    <br>

    <button onclick="renderManagerHome()">⬅ Back</button>
  `;
}

function swapLineupPlayer(){
  const starterSelect = document.getElementById("starterSwap");
  const benchSelect = document.getElementById("benchSwap");

  if(!starterSelect || !benchSelect){
    alert("Lineup screen error.");
    return;
  }

  const starterIndex = Number(starterSelect.value);
  const benchIndex = Number(benchSelect.value);

  if(benchIndex < 0){
    alert("No bench players available.");
    return;
  }

  const starter = managerLineup[starterIndex];
  const bench = managerBench[benchIndex];

  if(!starter || !bench){
    alert("Invalid swap.");
    return;
  }

  managerLineup[starterIndex] = bench;
  managerBench[benchIndex] = starter;

  addNews(
    "🔄 Lineup Changed",
    `${bench[0]} replaced ${starter[0]} in the starting lineup.`
  );

  viewLineup();
}

function changeFormation(){
  const managerContent = document.getElementById("managerContent");

  managerContent.innerHTML = `
    <h2>⚙️ Formation</h2>

    <p>Current: ${managerFormation}</p>

    <button onclick="setFormation('2-1-2')">2-1-2 Balanced</button>
    <button onclick="setFormation('1-2-2')">1-2-2 Attacking</button>
    <button onclick="setFormation('2-2-1')">2-2-1 Defensive</button>
    <button onclick="setFormation('1-3-1')">1-3-1 Control</button>
    <button onclick="setFormation('3-1-1')">3-1-1 Ultra Defensive</button>

    <br><br>

    <button onclick="renderManagerHome()">⬅ Back</button>
  `;
}

function setFormation(name){
  managerFormation = name;

  addNews(
    "⚙️ Formation Changed",
    `${managerClub.name} changed formation to ${name}.`
  );

  renderManagerHome();
}

function getLineupPower(lineup){
  if(!lineup || lineup.length === 0){
    return 1;
  }

  let total = 0;

  lineup.forEach(player => {
    total += player[2];
  });

  return total / lineup.length;
}

function applyFormationBonus(power, isUserTeam){
  if(!isUserTeam){
    return power;
  }

  const formation = FORMATIONS[managerFormation];

  if(!formation){
    return power;
  }

  return power + formation.attack + formation.defense / 2;
}

function getActiveLineup(lineup){
  const active = lineup.filter(player => {
    return !managerMatch.sentOff[player[0]];
  });

  if(active.length === 0){
    return lineup;
  }

  return active;
}

function chooseManagerScorer(lineup){
  const activeLineup = getActiveLineup(lineup);

  const attackers = activeLineup.filter(player => player[1] === "Attacker");
  const midfielders = activeLineup.filter(player => player[1] === "Midfielder");

  const options = [
    ...attackers,
    ...attackers,
    ...midfielders,
    ...activeLineup
  ];

  return options[Math.floor(Math.random() * options.length)];
}

function chooseManagerRandomPlayer(lineup){
  const activeLineup = getActiveLineup(lineup);

  return activeLineup[Math.floor(Math.random() * activeLineup.length)];
}

function createManagerEvent(minute){
  let homePower = getLineupPower(getActiveLineup(managerMatch.homeLineup)) + 5;
  let awayPower = getLineupPower(getActiveLineup(managerMatch.awayLineup));

  homePower = applyFormationBonus(homePower, managerMatch.userIsHome);
  awayPower = applyFormationBonus(awayPower, !managerMatch.userIsHome);

  const homeChance = homePower / (homePower + awayPower);

  const attackingHome = Math.random() < homeChance;
  const attackingTeam = attackingHome ? managerMatch.home : managerMatch.away;
  const attackingLineup = attackingHome ? managerMatch.homeLineup : managerMatch.awayLineup;

  const roll = Math.random();

  if(roll < 0.30){
    const scorer = chooseManagerScorer(attackingLineup);

    return {
      team: attackingHome ? "home" : "away",
      text: `${minute}' ⚽ GOAL ${attackingTeam.name} - ${scorer[0]}`
    };
  }

  if(roll < 0.55){
    const player = chooseManagerRandomPlayer(attackingLineup);

    return {
      team: null,
      text: `${minute}' 🎯 Big Chance - ${attackingTeam.name} (${player[0]})`
    };
  }

  if(roll < 0.75){
    const player = chooseManagerRandomPlayer(attackingLineup);

    return {
      team: null,
      text: `${minute}' 🧤 Great Save against ${player[0]}`
    };
  }

  if(roll < 0.88){
    const player = chooseManagerRandomPlayer(attackingLineup);
    const playerName = player[0];

    managerMatch.yellowCards[playerName] =
      (managerMatch.yellowCards[playerName] || 0) + 1;

    if(managerMatch.yellowCards[playerName] >= 2){
      managerMatch.sentOff[playerName] = true;

      return {
        team: null,
        text: `${minute}' 🟨🟥 Second Yellow - ${playerName} (${attackingTeam.name})`
      };
    }

    return {
      team: null,
      text: `${minute}' 🟨 Yellow Card - ${playerName} (${attackingTeam.name})`
    };
  }

  if(roll < 0.94){
    const player = chooseManagerRandomPlayer(attackingLineup);

    return {
      team: null,
      text: `${minute}' ❌ Goal Disallowed by VAR - ${attackingTeam.name} (${player[0]})`
    };
  }

  if(roll < 0.975){
    const scorer = chooseManagerScorer(attackingLineup);

    if(Math.random() < 0.75){
      return {
        team: attackingHome ? "home" : "away",
        text: `${minute}' ⚽ Penalty Goal - ${attackingTeam.name} - ${scorer[0]}`
      };
    }

    return {
      team: null,
      text: `${minute}' 🧤 Penalty Missed - ${attackingTeam.name} - ${scorer[0]}`
    };
  }

  if(roll < 0.995){
    const player = chooseManagerRandomPlayer(attackingLineup);

    return {
      team: null,
      injury: player,
      injuryTeamId: attackingTeam.id,
      text: `${minute}' 🏥 Injury - ${player[0]} (${attackingTeam.name})`
    };
  }

  const player = chooseManagerRandomPlayer(attackingLineup);

  managerMatch.sentOff[player[0]] = true;

  return {
    team: null,
    text: `${minute}' 🟥 Red Card - ${player[0]} (${attackingTeam.name})`
  };
}

function playLeagueMatch(){
  if(currentRound > MAX_ROUNDS){
    endSeason();
    return;
  }

  refreshLineupAfterSquadChange();

  if(managerLineup.length < 5){
    alert("You need 5 available starters.");
    return;
  }

  if(managerLiveInterval){
    clearInterval(managerLiveInterval);
  }

  const opponent = getRandomOpponent();
  const isHome = Math.random() < 0.5;

  const home = isHome ? managerClub : opponent;
  const away = isHome ? opponent : managerClub;

  managerMatch = {
    home,
    away,
    homeGoals: 0,
    awayGoals: 0,
    minute: 0,
    events: [],
    yellowCards: {},
    sentOff: {},
    injuries: [],
    substitutions: 0,
    maxSubs: 3,
    userIsHome: home.id === managerClub.id,
    homeLineup: isHome ? [...managerLineup] : home.players.slice(0, 5),
    awayLineup: isHome ? away.players.slice(0, 5) : [...managerLineup],
    userLineup: [...managerLineup],
    userBench: [...managerBench]
  };

  renderLiveManagerMatch();
  startLiveManagerTimer();
}

function renderLiveManagerMatch(){
  const managerContent = document.getElementById("managerContent");

  managerContent.innerHTML = `
    <h2>⏱️ LIVE LEAGUE MATCH</h2>

    <div class="scoreBox">
      <div>
        <img src="${managerMatch.home.logo}" class="clubLogo">
        <p><strong>${managerMatch.home.name}</strong></p>
      </div>

      <div>
        <div id="managerLiveScore" class="score">
          ${managerMatch.homeGoals} x ${managerMatch.awayGoals}
        </div>

        <p id="managerLiveMinute">${Math.floor(managerMatch.minute)}'</p>
      </div>

      <div>
        <img src="${managerMatch.away.logo}" class="clubLogo">
        <p><strong>${managerMatch.away.name}</strong></p>
      </div>
    </div>

    <p>⚙️ Formation: ${managerFormation}</p>
    <p>🔄 Subs: ${managerMatch.substitutions}/${managerMatch.maxSubs}</p>

    <button onclick="openSubstitutionMenu()">🔄 Make Sub</button>

    <hr>

    <div id="managerLiveEvents">
      <p>Kick-off!</p>
    </div>
  `;
}

function startLiveManagerTimer(){
  const scoreDiv = document.getElementById("managerLiveScore");
  const minuteDiv = document.getElementById("managerLiveMinute");
  const eventsDiv = document.getElementById("managerLiveEvents");

  managerLiveInterval = setInterval(() => {
    managerMatch.minute += 1.5;

    const minute = Math.min(90, Math.floor(managerMatch.minute));

    minuteDiv.innerHTML = `${minute}'`;

    if(Math.random() < 0.12){
      const event = createManagerEvent(minute);

      if(event.team === "home"){
        managerMatch.homeGoals++;
      }

      if(event.team === "away"){
        managerMatch.awayGoals++;
      }

      if(event.injury){
        managerMatch.injuries.push(event);
      }

      managerMatch.events.unshift(event.text);

      scoreDiv.innerHTML =
        `${managerMatch.homeGoals} x ${managerMatch.awayGoals}`;

      eventsDiv.innerHTML =
        managerMatch.events.map(e => `<p>${e}</p>`).join("");
    }

    if(minute >= 90){
      clearInterval(managerLiveInterval);
      managerLiveInterval = null;
      finishManagerLiveMatch();
    }
  }, 1000);
}

function openSubstitutionMenu(){
  if(!managerMatch){
    return;
  }

  if(managerMatch.substitutions >= managerMatch.maxSubs){
    alert("You have already used all substitutions!");
    return;
  }

  clearInterval(managerLiveInterval);

  const managerContent = document.getElementById("managerContent");

  managerContent.innerHTML = `
    <h2>🔄 Substitution</h2>

    <p>Starter:</p>

    <select id="starterSub">
      ${managerMatch.userLineup.map((player, index) => `
        <option value="${index}">
          ${player[0]} - ${player[1]} OVR ${player[2]}
        </option>
      `).join("")}
    </select>

    <p>Bench:</p>

    <select id="benchSub">
      ${
        managerMatch.userBench.length === 0
        ? `<option value="-1">No bench players</option>`
        : managerMatch.userBench.map((player, index) => `
          <option value="${index}">
            ${player[0]} - ${player[1]} OVR ${player[2]}
          </option>
        `).join("")
      }
    </select>

    <br><br>

    <button onclick="confirmSubstitution()">Confirm Sub</button>
    <button onclick="resumeManagerMatch()">Cancel</button>
  `;
}

function confirmSubstitution(){
  const starterIndex = Number(document.getElementById("starterSub").value);
  const benchIndex = Number(document.getElementById("benchSub").value);

  if(benchIndex < 0){
    alert("No bench players available!");
    return;
  }

  const starter = managerMatch.userLineup[starterIndex];
  const bench = managerMatch.userBench[benchIndex];

  managerMatch.userLineup[starterIndex] = bench;
  managerMatch.userBench[benchIndex] = starter;
  managerMatch.substitutions++;

  if(managerMatch.userIsHome){
    managerMatch.homeLineup = managerMatch.userLineup;
  }else{
    managerMatch.awayLineup = managerMatch.userLineup;
  }

  managerMatch.events.unshift(
    `${Math.floor(managerMatch.minute)}' 🔄 Substitution - ${bench[0]} replaces ${starter[0]}`
  );

  resumeManagerMatch();
}

function resumeManagerMatch(){
  renderLiveManagerMatch();

  const eventsDiv = document.getElementById("managerLiveEvents");

  eventsDiv.innerHTML = managerMatch.events.length
    ? managerMatch.events.map(e => `<p>${e}</p>`).join("")
    : "<p>Kick-off!</p>";

  startLiveManagerTimer();
}

function applyManagerInjuries(){
  managerMatch.injuries.forEach(event => {
    if(event.injuryTeamId !== managerClub.id){
      return;
    }

    const playerName = event.injury[0];
    const player = managerClub.players.find(p => p[0] === playerName);

    if(!player){
      return;
    }

    const gamesOut = Math.floor(Math.random() * 4) + 1;

    player[5] = gamesOut;

    addNews(
      "🏥 Injury Update",
      `${playerName} will miss ${gamesOut} match(es).`
    );
  });
}

function finishManagerLiveMatch(){
  const home = managerMatch.home;
  const away = managerMatch.away;
  const homeGoals = managerMatch.homeGoals;
  const awayGoals = managerMatch.awayGoals;

  updateTable(home, away, homeGoals, awayGoals);
  applyManagerInjuries();
  developPlayers();

  if(typeof simulateOtherMatches === "function"){
    simulateOtherMatches(home.id, away.id);
  }

  let prize = 500000;

  if(
    (managerClub.id === home.id && homeGoals > awayGoals) ||
    (managerClub.id === away.id && awayGoals > homeGoals)
  ){
    prize = 3000000;
    addNews("✅ Important Win", `${managerClub.name} won the match.`);
  }else if(homeGoals === awayGoals){
    prize = 1000000;
    addNews("🤝 Points Shared", `${managerClub.name} drew in the league.`);
  }else{
    addNews("❌ Painful Defeat", `${managerClub.name} lost the match.`);
  }

  managerMoney += prize;
  currentRound++;

  if(managerMatch.events.length === 0){
    managerMatch.events.push("90' Match ended with few chances.");
  }

  const managerContent = document.getElementById("managerContent");

  managerContent.innerHTML = `
    <h2>FULL TIME</h2>

    <div class="scoreBox">
      <div>
        <img src="${home.logo}" class="clubLogo">
        <p><strong>${home.name}</strong></p>
      </div>

      <div class="score">${homeGoals} x ${awayGoals}</div>

      <div>
        <img src="${away.logo}" class="clubLogo">
        <p><strong>${away.name}</strong></p>
      </div>
    </div>

    <hr>

    <p>💰 Prize: €${prize.toLocaleString()}</p>
    <p>💵 Budget: €${managerMoney.toLocaleString()}</p>

    <hr>

    ${managerMatch.events.map(e => `<p>${e}</p>`).join("")}

    <br>

    <button onclick="renderManagerHome()">Continue</button>
    <button onclick="viewStandings()">📊 Standings</button>
  `;
}

function viewSquad(){
  refreshLineupAfterSquadChange();

  const managerContent = document.getElementById("managerContent");

  managerContent.innerHTML = `
    <h2>👥 ${managerClub.name}</h2>

    <img src="${managerClub.logo}" class="clubLogo">

    <p>📊 Overall: ${getManagerOverall(managerClub)}</p>
    <p>👥 Squad: ${managerClub.players.length}/${MAX_SQUAD_SIZE}</p>

    <hr>

    ${managerClub.players.map((player, index) => `
      <div class="player">
        <strong>${player[0]}</strong><br>
        ${player[1]} • OVR ${player[2]}<br>
        Age ${player[3]} • POT ${player[4]}<br>
        ${
          player[5] && player[5] > 0
          ? `<span class="injury">🏥 Injured: ${player[5]} match(es)</span><br>`
          : ""
        }
        Value: €${getPlayerValue(player).toLocaleString()}
        <br>
        <button onclick="sellPlayer(${index})">Sell</button>
      </div>
    `).join("")}

    <br>

    <button onclick="renderManagerHome()">⬅ Back</button>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const oldShowScreen = window.showScreen;

  window.showScreen = function(screenId){
    oldShowScreen(screenId);

    if(screenId === "manager" && managerClub === null){
      startManagerMode();
    }
  };

  console.log("manager.js carregado");
});