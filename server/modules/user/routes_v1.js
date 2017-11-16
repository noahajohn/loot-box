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
    text: "I've lost count of how many I have."
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
  {
    id: 12,
    name: "Railgun",
    text: "Who needs aimbots when you have mad skillz?"
  },
  {
    id: 13,
    name: "Angry Turds",
    text: "Throw them against the wall and see if they stick!"
  },
  {
    id: 14,
    name: "IRL streamer",
    text: "Being weird and nerdy for cheers!"
  },
  {
    id: 15,
    name: "Taco Baalz",
    text: "I kill, U loot."
  },
  {
    id: 16,
    name: "That gem in chat",
    text: "I swear clicking on it does something!"
  },
  {
    id: 17,
    name: "One of Wirt's many legs",
    text: "We still haven't figured out how many he has."
  },
  {
    id: 18,
    name: "The Secret Cow Level",
    text: "There is no cow level."
  },
  {
    id: 19,
    name: "The cake",
    text: "It's a lie."
  },
  {
    id: 20,
    name: "1 DKP",
    text: "Just don't wipe on Onyxia."
  },
  {
    id: 21,
    name: "Many whelps",
    text: "Handle it!"
  },
  {
    id: 22,
    name: "Onyxia's tail",
    text: "Watch the <bleep> tail!"
  },
  {
    id: 23,
    name: "Stream sniper",
    text: "HeyGuys Sniperino."
  },
  {
    id: 24,
    name: "Kappa",
    text: "I always thought this was a young Forsen."
  },
  {
    id: 25,
    name: "Epic Sax Guy",
    text: "This never gets old."
  },
  {
    id: 26,
    name: "Rage quitter",
    text: "Pain. Agony. My hatred burns."
  },
  {
    id: 27,
    name: "Pat PvP",
    text: "Stronger then (sic) ever before."
  },
  {
    id: 28,
    name: "PUGs",
    text: "LF2M: tank, healer."
  },
  {
    id: 29,
    name: "Pike Barb",
    text: "Looking to high roll with Charsi."
  },
  {
    id: 30,
    name: "Power creep",
    text: "This is objectively better."
  },
  {
    id: 31,
    name: "Javazon",
    text: "AKA The Cow Killer."
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