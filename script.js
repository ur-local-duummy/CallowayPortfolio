var game = new Phaser.Game(800, 600, Phaser.AUTO, 'my-game', {
  preload: preload,
  create: create,
  update: update
});

var hello1, hello2, hello3;
var spacebar;
var spinSound, match2Sound, match3Sound;
var matchTXT, scoreText, highText;
var funds = 100;
var highFunds = 100;
var gameOver = false;

function preload() {
  game.load.spritesheet('hello', 'assets/hello-sprite.png', 64, 64);
  game.load.audio('spin', 'assets/spinner.mp3');
  game.load.audio('2sound', 'assets/match2.mp3');
  game.load.audio('3sound', 'assets/match3.mp3');
}

function create() {
  game.stage.backgroundColor = '#F0F0F0';
  
  hello1 = game.add.sprite(game.world.centerX, game.world.centerY, 'hello');
  hello2 = game.add.sprite(game.world.centerX - 100, game.world.centerY, 'hello');
  hello3 = game.add.sprite(game.world.centerX + 100, game.world.centerY, 'hello');
  [hello1, hello2, hello3].forEach(h => h.anchor.setTo(0.5, 0.5));

  spacebar = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
  
  spinSound = game.add.audio('spin', 0.3); spinSound.loop = true;
  match2Sound = game.add.audio('2sound', 0.5);
  match3Sound = game.add.audio('3sound', 0.7);

  matchTXT = game.add.text(game.world.centerX, game.world.centerY + 80, '', {
    font: 'Arial', fontSize: "20px", fontStyle: "bold", fill: "#0F0F0F"
  });
  matchTXT.setShadow(1, 1, "#000", 2);

  scoreText = game.add.text(game.world.centerX, game.world.centerY + 120,
    'Funds: $100',
    { font: 'Arial', fontSize: "20px", fontStyle: "bold", fill: "#0F0F0F" });
  scoreText.setShadow(1, 1, "#000", 2);

  highText = game.add.text(game.world.centerX, game.world.centerY + 150,
    'High Funds: $100',
    { font: 'Arial', fontSize: "18px", fontStyle: "bold", fill: "#0F0F0F" });
  highText.setShadow(1, 1, "#000", 2);
}

function update() {
  if (gameOver) return;

  if (spacebar.justDown) {
    spinSound.play();
  }
  else if (spacebar.isDown) {
    hello1.frame = Math.floor(Math.random() * 6);
    hello2.frame = Math.floor(Math.random() * 6);
    hello3.frame = Math.floor(Math.random() * 6);
  }
  else if (spacebar.justUp) {
    spinSound.stop();
    checkForMatch();
  }
}

function checkForMatch() {
  if (gameOver) return;

  let matchType = 0;
  if (hello1.frame === hello2.frame && hello2.frame === hello3.frame) {
    match3Sound.play();
    matchTXT.text = "Match Three! +$70";
    game.stage.backgroundColor = '#00FF00';
    funds += 70;
    matchType = 3;
  }
  else if (hello1.frame === hello2.frame || hello2.frame === hello3.frame || hello1.frame === hello3.frame) {
    match2Sound.play();
    matchTXT.text = "Match Two! +$5";
    game.stage.backgroundColor = '#0000FF';
    funds += 5;
    matchType = 2;
  }
  else {
    matchTXT.text = "No match -$10";
    game.stage.backgroundColor = '#FF0000';
    funds -= 10;
  }

  if (funds > highFunds) {
    highFunds = funds;
    game.stage.backgroundColor = '#FFD700'; // gold
  }

  scoreText.text = "Funds: $" + funds;
  highText.text = "High Funds: $" + highFunds;

  if (funds <= 0) {
    gameOver = true;
    game.stage.backgroundColor = '#77807b';
    matchTXT.text = "Better luck next time, you are out of money. Go home, gambling is bad for your bank account.";
    scoreText.text = "Funds: $0";
  }
}