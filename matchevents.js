let activeLiveMatchInterval = null;

function chooseMatchScorer(team){
  const attackers = team.players.filter(player => player[1] === "Attacker");
  const midfielders = team.players.filter(player => player[1] === "Midfielder");
  const defenders = team.players.filter(player => player[1] === "Defender");

  let options = [
    ...attackers,
    ...attackers,
    ...attackers,
    ...midfielders,
    ...midfielders,
    ...defenders
  ];

  if(options.length === 0){
    options = team.players.filter(player => player[1] !== "Goalkeeper");
  }

  if(options.length === 0){
    options = team.players;
  }

  return options[Math.floor(Math.random() * options.length)];
}

function chooseMatchPlayer(team){
  return team.players[Math.floor(Math.random() * team.players.length)];
}

function getMatchPower(team){
  let total = 0;

  team.players.forEach(player => {
    total += player[2];
  });

  return total / team.players.length;
}

function createMatchEvent(minute, home, away, homeChance, matchData){
  const attackingHome = Math.random() < homeChance;
  const attackingTeam = attackingHome ? home : away;

  const roll = Math.random();

  if(roll < 0.30){
    const player = chooseMatchScorer(attackingTeam);

    matchData.stats.goals++;

    return {
      type: "goal",
      team: attackingHome ? "home" : "away",
      text: `${minute}' ⚽ GOAL ${attackingTeam.name} - ${player[0]}`
    };
  }

  if(roll < 0.55){
    const player = chooseMatchPlayer(attackingTeam);

    matchData.stats.chances++;

    return {
      type: "chance",
      team: null,
      text: `${minute}' 🎯 Big Chance - ${attackingTeam.name} (${player[0]})`
    };
  }

  if(roll < 0.75){
    const player = chooseMatchPlayer(attackingTeam);

    matchData.stats.saves++;

    return {
      type: "save",
      team: null,
      text: `${minute}' 🧤 Great Save against ${player[0]}`
    };
  }

  if(roll < 0.88){
    const player = chooseMatchPlayer(attackingTeam);
    const playerName = player[0];

    matchData.yellowCards[playerName] =
      (matchData.yellowCards[playerName] || 0) + 1;

    matchData.stats.yellowCards++;

    if(matchData.yellowCards[playerName] >= 2){
      matchData.stats.redCards++;

      return {
        type: "secondYellow",
        team: null,
        text: `${minute}' 🟨🟥 Second Yellow - ${playerName} (${attackingTeam.name})`
      };
    }

    return {
      type: "yellow",
      team: null,
      text: `${minute}' 🟨 Yellow Card - ${playerName} (${attackingTeam.name})`
    };
  }

  if(roll < 0.94){
    const player = chooseMatchScorer(attackingTeam);

    matchData.stats.var++;

    return {
      type: "var",
      team: null,
      text: `${minute}' ❌ Goal Disallowed by VAR - ${attackingTeam.name} (${player[0]})`
    };
  }

  if(roll < 0.975){
    const player = chooseMatchScorer(attackingTeam);

    matchData.stats.penalties++;

    if(Math.random() < 0.75){
      matchData.stats.goals++;

      return {
        type: "penaltyGoal",
        team: attackingHome ? "home" : "away",
        text: `${minute}' ⚽ Penalty Goal - ${attackingTeam.name} - ${player[0]}`
      };
    }

    return {
      type: "penaltyMiss",
      team: null,
      text: `${minute}' 🧤 Penalty Missed - ${attackingTeam.name} - ${player[0]}`
    };
  }

  if(roll < 0.995){
    const player = chooseMatchPlayer(attackingTeam);

    matchData.stats.injuries++;

    return {
      type: "injury",
      team: attackingHome ? "home" : "away",
      player: player,
      text: `${minute}' 🏥 Injury - ${player[0]} (${attackingTeam.name})`
    };
  }

  const player = chooseMatchPlayer(attackingTeam);

  matchData.stats.redCards++;

  return {
    type: "red",
    team: null,
    text: `${minute}' 🟥 Red Card - ${player[0]} (${attackingTeam.name})`
  };
}

function startLiveMatch(options){
  const home = options.home;
  const away = options.away;
  const container = options.container;
  const durationMs = options.durationMs || 60000;
  const mode = options.mode || "friendly";
  const onFinish = options.onFinish;

  if(activeLiveMatchInterval){
    clearInterval(activeLiveMatchInterval);
  }

  let homeGoals = 0;
  let awayGoals = 0;
  let gameMinute = 0;

  const events = [];
  const injuries = [];

  const matchData = {
    yellowCards: {},
    stats: {
      goals: 0,
      chances: 0,
      saves: 0,
      yellowCards: 0,
      redCards: 0,
      var: 0,
      penalties: 0,
      injuries: 0
    }
  };

  const homePower = getMatchPower(home) + 5;
  const awayPower = getMatchPower(away);
  const homeChance = homePower / (homePower + awayPower);

  const tickMs = Math.round(durationMs / 60);

  container.innerHTML = `
    <h2>⏱️ LIVE MATCH</h2>

    <div class="scoreBox">
      <div>
        <img src="${home.logo}" class="clubLogo">
        <p><strong>${home.name}</strong></p>
      </div>

      <div>
        <div id="liveScore" class="score">0 x 0</div>
        <p id="liveMinute">0'</p>
      </div>

      <div>
        <img src="${away.logo}" class="clubLogo">
        <p><strong>${away.name}</strong></p>
      </div>
    </div>

    <hr>

    <div id="liveEvents">
      <p>Kick-off!</p>
    </div>
  `;

  const scoreDiv = document.getElementById("liveScore");
  const minuteDiv = document.getElementById("liveMinute");
  const eventsDiv = document.getElementById("liveEvents");

  activeLiveMatchInterval = setInterval(() => {
    gameMinute += 1.5;

    const minute = Math.min(90, Math.floor(gameMinute));

    minuteDiv.innerHTML = `${minute}'`;

    if(Math.random() < 0.12){
      const event = createMatchEvent(
        minute,
        home,
        away,
        homeChance,
        matchData
      );

      if(event.team === "home" && (event.type === "goal" || event.type === "penaltyGoal")){
        homeGoals++;
      }

      if(event.team === "away" && (event.type === "goal" || event.type === "penaltyGoal")){
        awayGoals++;
      }

      if(event.type === "injury"){
        injuries.push(event);
      }

      events.unshift(event.text);

      scoreDiv.innerHTML = `${homeGoals} x ${awayGoals}`;

      eventsDiv.innerHTML =
        events.map(eventText => `<p>${eventText}</p>`).join("");
    }

    if(minute >= 90){
      clearInterval(activeLiveMatchInterval);
      activeLiveMatchInterval = null;

      if(events.length === 0){
        events.push("90' Match ended with few chances.");
      }

      container.innerHTML = `
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

        <h3>📊 Match Stats</h3>

        <p>⚽ Goals: ${matchData.stats.goals}</p>
        <p>🎯 Big Chances: ${matchData.stats.chances}</p>
        <p>🧤 Saves: ${matchData.stats.saves}</p>
        <p>🟨 Yellow Cards: ${matchData.stats.yellowCards}</p>
        <p>🟥 Red Cards: ${matchData.stats.redCards}</p>
        <p>❌ VAR Decisions: ${matchData.stats.var}</p>
        <p>⚽ Penalties: ${matchData.stats.penalties}</p>
        <p>🏥 Injuries: ${matchData.stats.injuries}</p>

        <hr>

        ${events.map(eventText => `<p>${eventText}</p>`).join("")}
      `;

      if(typeof onFinish === "function"){
        onFinish({
          home,
          away,
          homeGoals,
          awayGoals,
          events,
          injuries,
          mode,
          stats: matchData.stats
        });
      }
    }
  }, tickMs);
}

console.log("matchevents.js carregado");
