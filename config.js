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
  ["Cristiano Ronaldo", "Attacker", 86, 55000000, 40, 86],
  ["Lionel Messi", "Attacker", 86, 55000000, 38, 86],
  ["Victor Osimhen", "Attacker", 87, 65000000, 27, 89],
  ["Kevin De Bruyne", "Midfielder", 83, 40000000, 35, 83],
  ["Endrick", "Attacker", 81, 45000000, 20, 90],
  ["Estevão", "Attacker", 80, 30000000, 19, 91],
  ["Rayan", "Attacker", 79, 32000000, 20, 86],
  ["Güler", "Midfielder", 80, 45000000, 21, 89],
  ["Neymar Jr", "Midfielder", 85, 55000000, 34, 85],
  ["Raphael Veiga", "Midfielder", 83, 32000000, 30, 83],
  ["Wesley", "Defender", 84, 63000000, 22, 89]
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
      ["Erling Haaland", "Attacker", 93],
      ["Phil Foden", "Attacker", 87],
      ["Rodri", "Midfielder", 90],
      ["Jeremy Doku", "Attacker", 87],
      ["Rúben Dias", "Defender", 87],
      ["Cherki", "Midfielder", 88],
      ["Josko Gvardiol", "Defender", 85],
      ["Savinho", "Attacker", 83]
    ]
  },
  {
    id: 2,
    name: "Real Madrid",
    logo: "https://media.api-sports.io/football/teams/541.png",
    players: [
      ["Kylian Mbappé", "Attacker", 93],
      ["Vinícius Junior", "Attacker", 90],
      ["Jude Bellingham", "Midfielder", 90],
      ["Rodrygo", "Attacker", 86],
      ["Federico Valverde", "Midfielder", 85],
      ["Aurélien Tchouaméni", "Midfielder", 85],
      ["Eduardo Camavinga", "Midfielder", 85],
      ["Antonio Rüdiger", "Defender", 85]
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
      ["Mbeumo", "Attacker", 84],
      ["Joshua Zirkzee", "Attacker", 80],
      ["Mainoo", "Midfielder", 82],
      ["Lisandro Martínez", "Defender", 84],
      ["Matheus Cunha", "Attacker", 84],
      ["Leny Yoro", "Defender", 82],
      ["Maguire", "Defender", 80]
    ]
  },
  {
    id: 5,
    name: "Liverpool",
    logo: "https://media.api-sports.io/football/teams/40.png",
    players: [
      ["Mohamed Salah", "Attacker", 88],
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
      ["Kai Havertz", "Attacker", 85],
      ["William Saliba", "Defender", 87],
      ["Gabriel Martinelli", "Attacker", 83],
      ["Gabriel Magalhães", "Defender", 88],
      ["Jurrien Timber", "Defender", 83]
    ]
  },
  {
    id: 7,
    name: "Chelsea",
    logo: "https://media.api-sports.io/football/teams/49.png",
    players: [
      ["Cole Palmer", "Attacker", 87],
      ["Garnacho", "Attacker", 82],
      ["Enzo Fernández", "Midfielder", 86],
      ["Caicedo", "Midfielder", 87],
      ["Reece James", "Defender", 84],
      ["Nkunku", "Attacker", 83],
      ["Pedro Neto", "Attacker", 83],
      ["Levi Colwill", "Defender", 80]
    ]
  },
  {
    id: 8,
    name: "PSG",
    logo: "https://media.api-sports.io/football/teams/85.png",
    players: [
      ["Dembélé", "Attacker", 90],
      ["Barcola", "Attacker", 85],
      ["Vitinha", "Midfielder", 88],
      ["João Neves", "Midfielder", 84],
      ["Marquinhos", "Defender", 89],
      ["Nuno Mendes", "Defender", 86],
      ["Gonçalo Ramos", "Attacker", 82],
      ["Safonov", "Goalkeeper", 82]
    ]
  },
  {
    id: 9,
    name: "Bayern Munich",
    logo: "https://media.api-sports.io/football/teams/157.png",
    players: [
      ["Harry Kane", "Attacker", 93],
      ["Musiala", "Midfielder", 90],
      ["Luiz Díaz", "Attacker", 87],
      ["Kimmich", "Midfielder", 88],
      ["Upamecano", "Defender", 84],
      ["Olise", "Attacker", 89],
      ["Pavlović", "Midfielder", 83],
      ["Davies", "Defender", 83]
    ]
  },
  {
    id: 10,
    name: "Flamengo",
    logo: "https://media.api-sports.io/football/teams/127.png",
    players: [
      ["Pedro", "Attacker", 84],
      ["Arrascaeta", "Midfielder", 85],
      ["Bruno Henrique", "Attacker", 81],
      ["Samuel Lino", "Midfielder", 83],
      ["Léo Pereira", "Defender", 80],
      ["Lucas Paquetá", "Midfielder", 83],
      ["Varela", "Defender", 80],
      ["Rossi", "Goalkeeper", 81],
      ["Gonzalo Plata", "Midfielder", 81]
   ]
  },
  {
    id: 11,
    name: "Benfica",
    logo: "https://media.api-sports.io/football/teams/211.png",
    players: [
      ["Vangelis Pavlidis", "Attacker", 84],
      ["Prestianni", "Attacker", 81],
      ["Andreas Schjelderup", "Attacker", 83],
      ["Richard Rios", "Midfielder", 82],
      ["Florentino Luís", "Midfielder", 82],
      ["Fredrik Aursnes", "Midfielder", 82],
      ["António Silva", "Defender", 83],
      ["Tomás Araújo", "Defender", 83],
      ["Samuel Dahl", "Defender", 80],
      ["Anatoliy Trubin", "Goalkeeper", 83]
    ]
  },
  {
    id: 12,
    name: "Sporting CP",
    logo: "https://media.api-sports.io/football/teams/228.png",
    players: [
      ["Francisco Trincão", "Attacker", 84],
      ["Pedro Gonçalves", "Midfielder", 84],
      ["Geny Catamo", "Attacker", 82],
      ["Geovany Quenda", "Attacker", 83],
      ["Morten Hjulmand", "Midfielder", 83],
      ["Hidemasa Morita", "Midfielder", 81],
      ["Gonçalo Inácio", "Defender", 84],
      ["Ousmane Diomande", "Defender", 83],
      ["Zeno Debast", "Defender", 81],
      ["Rui Silva", "Goalkeeper", 82]
    ]
  },
  {
    id: 13,
    name: "River Plate",
    logo: "https://media.api-sports.io/football/teams/435.png",
    players: [
      ["Miguel Borja", "Attacker", 82],
      ["Facundo Colidio", "Attacker", 80],
      ["Matías Viña", "Defender", 81],
      ["Nacho Fernández", "Midfielder", 80],
      ["Rodrigo Aliendro", "Midfielder", 80],
      ["Santiago Simón", "Midfielder", 80],
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
      ["Edinson Cavani", "Attacker", 79],
      ["Miguel Merentiel", "Attacker", 81],
      ["Kevin Zenón", "Midfielder", 80],
      ["Alan Velasco", "Midfielder", 80],
      ["Cristian Medina", "Midfielder", 81],
      ["Tomás Belmonte", "Midfielder", 80],
      ["Marcos Rojo", "Defender", 80],
      ["Nicolás Figal", "Defender", 80],
      ["Lautaro Blanco", "Defender", 80],
      ["Sergio Romero", "Goalkeeper", 80]
    ]
  },
  {
    id: 15,
    name: "Palmeiras",
    logo: "https://media.api-sports.io/football/teams/121.png",
    players: [
      ["Vitor Roque", "Attacker", 82],
      ["Flaco López", "Attacker", 81],
      ["Maurício", "Midfielder", 81],
      ["Andreas Pereira", "Midfielder", 83],
      ["Jhon Arias", "Midfielder", 83],
      ["Paulinho", "Attacker", 82],
      ["Murilo", "Defender", 81],
      ["Gustavo Gómez", "Defender", 83],
      ["Piquerez", "Defender", 82],
      ["Carlos Miguel", "Goalkeeper", 80]
    ]
  },
  {
    id: 16,
    name: "Fluminense",
    logo: "https://media.api-sports.io/football/teams/124.png",
    players: [
      ["Germán Cano", "Attacker", 80],
      ["Canobbio", "Attacker", 81],
      ["Hulk", "Attacker", 82],
      ["Ganso", "Midfielder", 81],
      ["Martinelli", "Midfielder", 80],
      ["Soteldo", "Midfielder", 80],
      ["Arana", "Defender", 82],
      ["Ignácio", "Defender", 80],
      ["Samuel Xavier", "Defender", 80],
      ["Fábio", "Goalkeeper", 83]
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
      ["Vitinho", "Defender", 81],
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
