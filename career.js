function createLeagueTable(){
  leagueTable = managerTeams.map(team => ({
    id: team.id,
    name: team.name,
    logo: team.logo,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0
  }));
}

function getTableTeam(teamId){
  return leagueTable.find(team => team.id === teamId);
}

function sortLeagueTable(){
  leagueTable.sort((a, b) => {
    if(b.points !== a.points) return b.points - a.points;

    const gdA = a.goalsFor - a.goalsAgainst;
    const gdB = b.goalsFor - b.goalsAgainst;

    if(gdB !== gdA) return gdB - gdA;

    return b.goalsFor - a.goalsFor;
  });
}

function updateTable(home, away, homeGoals, awayGoals){
  const homeRow = getTableTeam(home.id);
  const awayRow = getTableTeam(away.id);

  if(!homeRow || !awayRow){
    return;
  }

  homeRow.played++;
  awayRow.played++;

  homeRow.goalsFor += homeGoals;
  homeRow.goalsAgainst += awayGoals;

  awayRow.goalsFor += awayGoals;
  awayRow.goalsAgainst += homeGoals;

  if(homeGoals > awayGoals){
    homeRow.wins++;
    awayRow.losses++;
    homeRow.points += 3;
  }else if(homeGoals < awayGoals){
    awayRow.wins++;
    homeRow.losses++;
    awayRow.points += 3;
  }else{
    homeRow.draws++;
    awayRow.draws++;
    homeRow.points += 1;
    awayRow.points += 1;
  }

  sortLeagueTable();
}

function simulateTeamGoals(team, opponent){
  const teamPower = getManagerOverall(team);
  const opponentPower = getManagerOverall(opponent);

  let goals = Math.floor(Math.random() * 3);

  if(teamPower > opponentPower && Math.random() < 0.45){
    goals++;
  }

  if(teamPower - opponentPower > 8 && Math.random() < 0.30){
    goals++;
  }

  return goals;
}

function simulateOtherMatches(userHomeId, userAwayId){
  const clubs = managerTeams.filter(team =>
    team.id !== userHomeId && team.id !== userAwayId
  );

  for(let i = 0; i < clubs.length - 1; i += 2){
    const home = clubs[i];
    const away = clubs[i + 1];

    const homeGoals = simulateTeamGoals(home, away);
    const awayGoals = simulateTeamGoals(away, home);

    updateTable(home, away, homeGoals, awayGoals);

    if(Math.random() < 0.45){
      addNews(
        "📊 League Result",
        `${home.name} ${homeGoals} x ${awayGoals} ${away.name}.`
      );
    }
  }
}

function developPlayers(){
  managerClub.players.forEach(player => {
    const age = player[3];
    const potential = player[4];

    if(age <= 23 && player[2] < potential && Math.random() < 0.55){
      player[2]++;

      addNews(
        "⭐ Young Star Improving",
        `${player[0]} improved to OVR ${player[2]}.`
      );
    }

    if(age >= 32 && Math.random() < 0.25){
      player[2] = Math.max(50, player[2] - 1);
      player[4] = Math.min(player[4], player[2]);

      addNews(
        "📉 Veteran Decline",
        `${player[0]} declined to OVR ${player[2]}.`
      );
    }
  });
}

function getBestPlayer(team){
  let best = team.players[0];

  team.players.forEach(player => {
    if(player[2] > best[2]){
      best = player;
    }
  });

  return best;
}

function processAgingAndRetirements(){
  const retiredPlayers = [];

  managerClub.players.forEach(player => {
    player[3]++;

    if(player[5] && player[5] > 0){
      player[5]--;
    }
  });

  managerClub.players = managerClub.players.filter(player => {
    const age = player[3];

    if(age >= 36 && Math.random() < 0.45){
      retiredPlayers.push(player);
      return false;
    }

    if(age >= 39){
      retiredPlayers.push(player);
      return false;
    }

    return true;
  });

  retiredPlayers.forEach(player => {
    addNews(
      "👋 Retirement Confirmed",
      `${player[0]} retired at age ${player[3]}.`
    );

    addYouthPlayer(player[1]);
  });

  while(managerClub.players.length < 5){
    addYouthPlayer("Midfielder");
  }

  if(typeof refreshLineupAfterSquadChange === "function"){
    refreshLineupAfterSquadChange();
  }
}

function addYouthPlayer(position){
  if(managerClub.players.length >= MAX_SQUAD_SIZE){
    return;
  }

  const name = YOUTH_NAMES[Math.floor(Math.random() * YOUTH_NAMES.length)];
  const age = Math.floor(Math.random() * 3) + 17;
  const ovr = Math.floor(Math.random() * 15) + 65;

  const potential = Math.min(
    99,
    ovr + Math.floor(Math.random() * 15) + 10
  );

  const player = [
    name + " Jr",
    position,
    ovr,
    age,
    potential,
    0
  ];

  managerClub.players.push(player);

  addNews(
    "🌱 Youth Academy Promotion",
    `${player[0]} promoted from the academy. OVR ${ovr}, POT ${potential}.`
  );
}

function endSeason(){
  sortLeagueTable();

  const champion = leagueTable[0];
  const managerPosition =
    leagueTable.findIndex(team => team.id === managerClub.id) + 1;

  let bonus = 5000000;
  let titleText = "Season Complete";
  let subtitle =
    `${managerClub.name} finished the season in position ${managerPosition}.`;

  if(managerPosition === 1){
    bonus = 40000000;
    titleText = "🏆 CHAMPIONS!";
    subtitle = `${managerClub.name} are the WF26 League Champions!`;

    addNews(
      "🏆 Champions Crowned",
      `${managerClub.name} lifted the WF26 League trophy.`
    );
  }else if(managerPosition <= 4){
    bonus = 20000000;
    titleText = "⭐ Top 4 Finish";
    subtitle = `${managerClub.name} secured a strong top 4 finish.`;

    addNews(
      "⭐ Top 4 Secured",
      `${managerClub.name} ended the season among the best clubs.`
    );
  }else{
    addNews(
      "📅 Season Ends",
      `${managerClub.name} finished the season in position ${managerPosition}.`
    );
  }

  addNews(
    "🏆 League Winner",
    `${champion.name} became league champion.`
  );

  managerMoney += bonus;

  const bestPlayer = getBestPlayer(managerClub);

  addNews(
    "⭐ Player of the Season",
    `${bestPlayer[0]} was named player of the season with OVR ${bestPlayer[2]}.`
  );

  processAgingAndRetirements();

  const managerContent = document.getElementById("managerContent");

  managerContent.innerHTML = `
    <h1>${titleText}</h1>

    <img src="${champion.logo}" class="clubLogo">

    <h2>${champion.name}</h2>

    <p>${subtitle}</p>

    <hr>

    <p>🏆 Champion: <strong>${champion.name}</strong></p>
    <p>📊 Your Position: <strong>${managerPosition}</strong></p>
    <p>⭐ Player of the Season: <strong>${bestPlayer[0]}</strong></p>
    <p>💰 Season Bonus: €${bonus.toLocaleString()}</p>
    <p>💵 Budget: €${managerMoney.toLocaleString()}</p>

    <br>

    <button onclick="startNewSeason()">📅 Start New Season</button>
    <button onclick="viewStandings()">📊 Final Table</button>
    <button onclick="viewNews()">📰 News</button>
  `;
}

function startNewSeason(){
  managerSeason++;
  currentRound = 1;

  createLeagueTable();

  addNews(
    "📅 New Season Begins",
    `Season ${managerSeason} has started.`
  );

  renderManagerHome();
}

function viewStandings(){
  sortLeagueTable();

  const managerContent = document.getElementById("managerContent");

  managerContent.innerHTML = `
    <h2>📊 League Table</h2>

    <div class="tableBox">
      <table>
        <tr>
          <th>#</th>
          <th>Club</th>
          <th>Pts</th>
          <th>P</th>
          <th>GD</th>
        </tr>

        ${leagueTable.map((team, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>
              <img src="${team.logo}" class="miniLogo">
              ${team.name}
            </td>
            <td><strong>${team.points}</strong></td>
            <td>${team.played}</td>
            <td>${team.goalsFor - team.goalsAgainst}</td>
          </tr>
        `).join("")}
      </table>
    </div>

    <br>

    <button onclick="renderManagerHome()">⬅ Back</button>
  `;
}

function viewNews(){
  const managerContent = document.getElementById("managerContent");

  managerContent.innerHTML = `
    <h2>📰 News Center</h2>

    <div class="card">
      ${
        newsLog.length === 0
        ? "<p>No news yet.</p>"
        : newsLog.map(news => `
          <div class="news-card">
            <h3>${news.title}</h3>
            <p>
              <small>
                Season ${news.season}, Round ${news.round}
              </small>
            </p>
            <p>${news.text}</p>
          </div>
        `).join("")
      }
    </div>

    <button onclick="renderManagerHome()">⬅ Back</button>
  `;
}

console.log("career.js carregado");