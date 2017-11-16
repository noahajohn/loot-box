const data = [
  {
    id: 0,
    name: "Pity timer",
    text: "You're thrilled to see this pitiful object."
  },
  {
    id: 1,
    name: "Hearthstone Voice Pack",
    text: "Ooooo, legendary!"
  },
  {
    id: 2,
    name: "Scope-less sniper rifle",
    text: "I wonder what this could be used for..."
  },
  {
    id: 3,
    name: "Salt",
    text: "To make your tears delicious."
  },
  {
    id: 4,
    name: "Nerfbat",
    text: "Because pissing off Reddit is fun."
  },
  {
    id: 5,
    name: "Unreal Tournament Voice Pack",
    text: "M-M-M-M-Monster Kill!"
  },
  {
    id: 6,
    name: "FeelsBadMan",
    text: "He's a man and he's feeling bad."
  },
  {
    id: 7,
    name: "Crappy common",
    text: "I've lost count how many of these I have."
  },
  {
    id: 8,
    name: "Card in opposition to humanity",
    text: "The card text is too vulgar to repeat."
  },
  {
    id: 9,
    name: "RNGesus",
    text: "Try praying - see if I care. lul"
  },
  {
    id: 10,
    name: "B.F.G.",
    text: "The original is always the best."
  },
  {
    id: 11,
    name: "The Greener Hills of Stranglethorn - Chapter I",
    text: "Who knew there was a second volume?"
  },
];

function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

function home(req, res) {
  console.log("home");
  const resObj = {
    msg: "hello world, try '/api/v1/roll' or /api/v1/roll?pretty"
  };
  res.json(resObj);
}

function roll(req, res, next) {
  console.log("roll");
  try {
    const indexRoll = randomInt(0, data.length);
    res.json(data[indexRoll]);
  } catch(e) {
    next(e); 
  }
  
}

function setup(app) {
  app.get('/api/v1/roll', roll);
  app.get('/', home);

}

module.exports = setup;