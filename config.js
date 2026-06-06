const MAX_ROUNDS = 34;
const MAX_SQUAD_SIZE = 10;

const FORMATIONS = {
  "2-1-2": { attack: 0, defense: 0 },
  "1-2-2": { attack: 8, defense: -5 },
  "2-2-1": { attack: -3, defense: 6 },
  "1-3-1": { attack: 3, defense: 3 },
  "3-1-1": { attack: -7, defense: 10 }
};

const FREE_AGENTS = [
  ["Cristiano Ronaldo", "Attacker", 86, 25000000, 40, 86],
  ["Lionel Messi", "Attacker", 88, 30000000, 38, 88],
  ["Victor Osimhen", "Attacker", 87, 65000000, 27, 89],
  ["Florian Wirtz", "Midfielder", 89, 85000000, 23, 94],
  ["Kevin De Bruyne", "Midfielder", 88, 40000000, 35, 88],
  ["Virgil van Dijk", "Defender", 89, 45000000, 34, 89],
  ["Achraf Hakimi", "Defender", 86, 59000000, 27, 88],
  ["Alisson", "Goalkeeper", 89, 55000000, 33, 89],
  ["Endrick", "Attacker", 80, 55000000, 20, 90],
  ["Estevão", "Attacker", 78, 40000000, 19, 91],
  ["Rayan", "Attacker", 75, 22000000, 20, 86],
  ["João Neves", "Midfielder", 83, 55000000, 21, 90],
  ["Kobbie Mainoo", "Midfielder", 80, 48000000, 20, 88],
  ["Leny Yoro", "Defender", 80, 40000000, 20, 88],
  ["Güler", "Midfielder", 79, 45000000, 21, 89],
  ["Neymar Jr", "Midfielder", 84, 30000000, 34, 84],
  ["Raphael Veiga", "Midfielder", 83, 45000000, 30, 83],
  ["Wesley", "Defender", 84, 65000000, 22, 89]
];

const YOUTH_NAMES = [
  "Gabriel Silva",
  "Lucas Ferreira",
  "Matheus Rocha",
  "João Mendes",
  "Rafael Costa",
  "Pedro Henrique",
  "Thiago Lima",
  "Bruno Carvalho",
  "André Gomes",
  "Miguel Santos"
];

const TEAMS = [
  {
    id: 1,
    name: "Manchester City",
    logo: "https://media.api-sports.io/football/teams/50.png",
    players: [
      ["Erling Haaland", "Attacker", 95],
      ["Phil Foden", "Attacker", 89],
      ["Rodri", "Midfielder", 91],
      ["Jeremy Doku", "Attacker", 84],
      ["Rúben Dias", "Defender", 88],
      ["Bernardo Silva", "Midfielder", 88],
      ["Josko Gvardiol", "Defender", 85],
      ["Savinho", "Attacker", 82]
    ]
  },
  {
    id: 2,
    name: "Real Madrid",
    logo: "https://media.api-sports.io/football/teams/541.png",
    players: [
      ["Kylian Mbappé", "Attacker", 95],
      ["Vinícius Junior", "Attacker", 92],
      ["Jude Bellingham", "Midfielder", 91],
      ["Rodrygo", "Attacker", 86],
      ["Federico Valverde", "Midfielder", 88],
      ["Aurélien Tchouaméni", "Midfielder", 86],
      ["Eduardo Camavinga", "Midfielder", 85],
      ["Antonio Rüdiger", "Defender", 86]
    ]
  },
  {
    id: 3,
    name: "Barcelona",
    logo: "https://media.api-sports.io/football/teams/529.png",
    players: [
      ["Robert Lewandowski", "Attacker", 89],
      ["Lamine Yamal", "Attacker", 87],
      ["Raphinha", "Attacker", 86],
      ["Pedri", "Midfielder", 88],
      ["Gavi", "Midfielder", 84],
      ["Frenkie de Jong", "Midfielder", 87],
      ["Pau Cubarsí", "Defender", 82],
      ["Jules Koundé", "Defender", 85]
    ]
  },
  {
    id: 4,
    name: "Manchester United",
    logo: "https://media.api-sports.io/football/teams/33.png",
    players: [
      ["Bruno Fernandes", "Midfielder", 87],
      ["Rasmus Hojlund", "Attacker", 80],
      ["Joshua Zirkzee", "Attacker", 79],
      ["Mainoo", "Midfielder", 80],
      ["Lisandro Martínez", "Defender", 84],
      ["Garnacho", "Attacker", 81],
      ["Leny Yoro", "Defender", 80],
      ["Diogo Dalot", "Defender", 82]
    ]
  },
  {
    id: 5,
    name: "Liverpool",
    logo: "https://media.api-sports.io/football/teams/40.png",
    players: [
      ["Mohamed Salah", "Attacker", 90],
      ["Cody Gakpo", "Attacker", 84],
      ["Mac Allister", "Midfielder", 86],
      ["Szoboszlai", "Midfielder", 84],
      ["Van Dijk", "Defender", 89],
      ["Alexander Isak", "Attacker", 87],
      ["Florian Wirtz", "Midfielder", 87],
      ["Ibrahima Konaté", "Defender", 84]
    ]
  },
  {
    id: 6,
    name: "Arsenal",
    logo: "https://media.api-sports.io/football/teams/42.png",
    players: [
      ["Bukayo Saka", "Attacker", 88],
      ["Martin Ødegaard", "Midfielder", 89],
      ["Declan Rice", "Midfielder", 87],
      ["Kai Havertz", "Attacker", 83],
      ["William Saliba", "Defender", 87],
      ["Gabriel Martinelli", "Attacker", 84],
      ["Gabriel Magalhães", "Defender", 86],
      ["Jurrien Timber", "Defender", 82]
    ]
  },
  {
    id: 7,
    name: "Chelsea",
    logo: "https://media.api-sports.io/football/teams/49.png",
    players: [
      ["Cole Palmer", "Attacker", 87],
      ["Nicolas Jackson", "Attacker", 80],
      ["Enzo Fernández", "Midfielder", 83],
      ["Caicedo", "Midfielder", 84],
      ["Reece James", "Defender", 84],
      ["Nkunku", "Attacker", 84],
      ["Neto", "Attacker", 82],
      ["Levi Colwill", "Defender", 81]
    ]
  },
  {
    id: 8,
    name: "PSG",
    logo: "https://media.api-sports.io/football/teams/85.png",
    players: [
      ["Dembélé", "Attacker", 86],
      ["Barcola", "Attacker", 82],
      ["Vitinha", "Midfielder", 86],
      ["João Neves", "Midfielder", 83],
      ["Marquinhos", "Defender", 87],
      ["Nuno Mendes", "Defender", 84],
      ["Gonçalo Ramos", "Attacker", 82],
      ["Donnarumma", "Goalkeeper", 87]
    ]
  },
  {
    id: 9,
    name: "Bayern Munich",
    logo: "https://media.api-sports.io/football/teams/157.png",
    players: [
      ["Harry Kane", "Attacker", 92],
      ["Musiala", "Midfielder", 90],
      ["Sané", "Attacker", 85],
      ["Kimmich", "Midfielder", 88],
      ["Upamecano", "Defender", 82],
      ["Olise", "Attacker", 84],
      ["Pavlović", "Midfielder", 80],
      ["Davies", "Defender", 84]
    ]
  },
  {
    id: 10,
    name: "Flamengo",
    logo: "https://media.api-sports.io/football/teams/127.png",
    players: [
      ["Pedro", "Attacker", 84],
      ["Arrascaeta", "Midfielder", 85],
      ["Bruno Henrique", "Attacker", 82],
      ["Samuel Lino", "Midfielder", 82],
      ["Léo Pereira", "Defender", 82],
      ["Lucas Paquetá", "Midfielder", 83],
      ["Varela", "Defender", 81],
      ["Rossi", "Goalkeeper", 80],
      ["Gonzalo Plata", "Midfielder", 82]
   ]
  },
  {
    id: 11,
    name: "Benfica",
    logo: "https://media.api-sports.io/football/teams/211.png",
    players: [
      ["Vangelis Pavlidis", "Attacker", 84],
      ["Kerem Aktürkoğlu", "Attacker", 82],
      ["Andreas Schjelderup", "Attacker", 80],
      ["Orkun Kökçü", "Midfielder", 84],
      ["Florentino Luís", "Midfielder", 82],
      ["Fredrik Aursnes", "Midfielder", 82],
      ["António Silva", "Defender", 83],
      ["Tomás Araújo", "Defender", 82],
      ["Samuel Dahl", "Defender", 79],
      ["Anatoliy Trubin", "Goalkeeper", 82]
    ]
  },
  {
    id: 12,
    name: "Sporting CP",
    logo: "https://media.api-sports.io/football/teams/228.png",
    players: [
      ["Francisco Trincão", "Attacker", 83],
      ["Pedro Gonçalves", "Midfielder", 84],
      ["Geny Catamo", "Attacker", 80],
      ["Geovany Quenda", "Attacker", 80],
      ["Morten Hjulmand", "Midfielder", 83],
      ["Hidemasa Morita", "Midfielder", 81],
      ["Gonçalo Inácio", "Defender", 84],
      ["Ousmane Diomande", "Defender", 83],
      ["Zeno Debast", "Defender", 81],
      ["Rui Silva", "Goalkeeper", 80]
    ]
  },
  {
    id: 13,
    name: "River Plate",
    logo: "https://media.api-sports.io/football/teams/435.png",
    players: [
      ["Miguel Borja", "Attacker", 83],
      ["Facundo Colidio", "Attacker", 80],
      ["Franco Mastantuono", "Midfielder", 82],
      ["Nacho Fernández", "Midfielder", 79],
      ["Rodrigo Aliendro", "Midfielder", 79],
      ["Santiago Simón", "Midfielder", 78],
      ["Paulo Díaz", "Defender", 81],
      ["Germán Pezzella", "Defender", 80],
      ["Marcos Acuña", "Defender", 81],
      ["Franco Armani", "Goalkeeper", 81]
    ]
  },
  {
    id: 14,
    name: "Boca Juniors",
    logo: "https://media.api-sports.io/football/teams/451.png",
    players: [
      ["Edinson Cavani", "Attacker", 82],
      ["Miguel Merentiel", "Attacker", 81],
      ["Kevin Zenón", "Midfielder", 80],
      ["Alan Velasco", "Midfielder", 79],
      ["Cristian Medina", "Midfielder", 81],
      ["Tomás Belmonte", "Midfielder", 78],
      ["Marcos Rojo", "Defender", 79],
      ["Nicolás Figal", "Defender", 79],
      ["Lautaro Blanco", "Defender", 78],
      ["Sergio Romero", "Goalkeeper", 80]
    ]
  },
  {
    id: 15,
    name: "Palmeiras",
    logo: "https://media.api-sports.io/football/teams/121.png",
    players: [
      ["Vitor Roque", "Attacker", 84],
      ["Flaco López", "Attacker", 83],
      ["Maurício", "Midfielder", 81],
      ["Andreas Pereira", "Midfielder", 83],
      ["Jhon Arias", "Midfielder", 83],
      ["Paulinho", "Attacker", 82],
      ["Murilo", "Defender", 83],
      ["Gustavo Gómez", "Defender", 84],
      ["Piquerez", "Defender", 83],
      ["Carlos Miguel", "Goalkeeper", 79]
    ]
  },
  {
    id: 16,
    name: "Fluminense",
    logo: "https://media.api-sports.io/football/teams/124.png",
    players: [
      ["Germán Cano", "Attacker", 80],
      ["Canobbio", "Attacker", 82],
      ["Hulk", "Attacker", 84],
      ["Ganso", "Midfielder", 81],
      ["Martinelli", "Midfielder", 79],
      ["Soteldo", "Midfielder", 79],
      ["Arana", "Defender", 83],
      ["Ignácio", "Defender", 80],
      ["Samuel Xavier", "Defender", 79],
      ["Fábio", "Goalkeeper", 84]
    ]
  },
  {
    id: 17,
    name: "Botafogo",
    logo: "https://media.api-sports.io/football/teams/120.png",
    players: [
      ["Artur Cabral", "Attacker", 83],
      ["Chris Ramos", "Attacker", 82],
      ["Matheus Martins", "Attacker", 81],
      ["Danilo", "Midfielder", 84],
      ["Allan", "Midfielder", 82],
      ["Montoro", "Midfielder", 83],
      ["Alex Telles", "Defender", 84],
      ["Marçal", "Defender", 82],
      ["Vitinho", "Defender", 80],
      ["Neto", "Goalkeeper", 78]
    ]
  },
  {
    id: 18,
    name: "Corinthians",
    logo: "https://media.api-sports.io/football/teams/131.png",
    players: [
      ["Yuri Alberto", "Attacker", 83],
      ["Memphis Depay", "Attacker", 84],
      ["Rodrigo Garro", "Midfielder", 84],
      ["Breno Bidon", "Midfielder", 81],
      ["Raniele", "Midfielder", 81],
      ["Kayo Cesar", "Midfielder", 81],
      ["Gustavo Henrique", "Defender", 82],
      ["Gabriel Paulista", "Defender", 82],
      ["Matheus Bidu", "Defender", 82],
      ["Hugo Souza", "Goalkeeper", 81]
    ]
  }
];
