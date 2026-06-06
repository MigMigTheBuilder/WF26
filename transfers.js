function getPlayerValue(player){
  const ovr = player[2];
  const age = player[3];
  const pot = player[4];

  let value = ovr * 700000;

  if(pot >= 90){
    value += 20000000;
  }else if(pot >= 85){
    value += 10000000;
  }

  if(age <= 21){
    value += 12000000;
  }else if(age <= 24){
    value += 7000000;
  }else if(age >= 34){
    value *= 0.45;
  }else if(age >= 31){
    value *= 0.7;
  }

  return Math.round(value);
}

function getFullTransferMarket(){
  const market = [];

  FREE_AGENTS.forEach(player => {
    market.push({
      name: player[0],
      position: player[1],
      ovr: player[2],
      price: player[3],
      age: player[4],
      pot: player[5],
      type: "free",
      clubId: null,
      playerIndex: null,
      clubName: "Free Agent"
    });
  });

  managerTeams.forEach(team => {

    if(team.id === managerClub.id){
      return;
    }

    team.players.forEach((player, index) => {

      const price = Math.round(
        getPlayerValue(player) * 1.35
      );

      market.push({
        name: player[0],
        position: player[1],
        ovr: player[2],
        age: player[3],
        pot: player[4],
        price: price,
        type: "club",
        clubId: team.id,
        playerIndex: index,
        clubName: team.name
      });

    });

  });

  return market.sort((a, b) => b.ovr - a.ovr);
}

function viewTransfers(){

  const market = getFullTransferMarket();

  const managerContent =
    document.getElementById("managerContent");

  managerContent.innerHTML = `
    <h2>🔄 Transfer Market</h2>

    <p>
      💰 Budget:
      €${managerMoney.toLocaleString()}
    </p>

    <p>
      👥 Squad:
      ${managerClub.players.length}/${MAX_SQUAD_SIZE}
    </p>

    <hr>

    ${
      market.map((player, index) => `
        <div class="player">

          <strong>${player.name}</strong><br>

          ${player.position}
          • OVR ${player.ovr}
          • Age ${player.age}
          <br>

          POT ${player.pot}
          <br>

          Club:
          ${player.clubName}
          <br>

          💰
          €${player.price.toLocaleString()}
          <br><br>

          <button onclick="buyMarketPlayer(${index})">
            Sign Player
          </button>

        </div>
      `).join("")
    }

    <br>

    <button onclick="renderManagerHome()">
      ⬅ Back
    </button>
  `;
}

function buyMarketPlayer(index){

  const market = getFullTransferMarket();
  const player = market[index];

  if(!player){
    return;
  }

  if(managerClub.players.length >= MAX_SQUAD_SIZE){
    alert(
      `Maximum squad size is ${MAX_SQUAD_SIZE} players.`
    );
    return;
  }

  if(managerMoney < player.price){
    alert("Not enough money!");
    return;
  }

  const alreadyExists =
    managerClub.players.some(
      p => p[0] === player.name
    );

  if(alreadyExists){
    alert(
      "This player is already in your squad!"
    );
    return;
  }

  managerMoney -= player.price;

  managerClub.players.push([
    player.name,
    player.position,
    player.ovr,
    player.age,
    player.pot,
    0
  ]);

  if(player.type === "club"){

    const sellingClub =
      managerGetTeamById(player.clubId);

    if(
      sellingClub &&
      sellingClub.players[player.playerIndex]
    ){
      sellingClub.players.splice(
        player.playerIndex,
        1
      );
    }

    addNews(
      "💰 Transfer Completed",
      `${managerClub.name} signed ${player.name} from ${player.clubName} for €${player.price.toLocaleString()}.`
    );

  }else{

    addNews(
      "🆓 Free Agent Signed",
      `${managerClub.name} signed ${player.name} for €${player.price.toLocaleString()}.`
    );

  }

  if(typeof refreshLineupAfterSquadChange === "function"){
    refreshLineupAfterSquadChange();
  }

  alert(
    `${player.name} signed for ${managerClub.name}!`
  );

  viewTransfers();
}

function sellPlayer(index){

  if(managerClub.players.length <= 5){
    alert(
      "You must keep at least 5 players."
    );
    return;
  }

  const player =
    managerClub.players[index];

  if(!player){
    return;
  }

  const value = Math.round(
    getPlayerValue(player) * 0.75
  );

  managerMoney += value;

  managerClub.players.splice(index, 1);

  addNews(
    "💸 Player Sold",
    `${managerClub.name} sold ${player[0]} for €${value.toLocaleString()}.`
  );

  if(typeof refreshLineupAfterSquadChange === "function"){
    refreshLineupAfterSquadChange();
  }

  alert(
    `${player[0]} sold for €${value.toLocaleString()}`
  );

  if(typeof viewSquad === "function"){
    viewSquad();
  }
}

console.log("transfers.js carregado");