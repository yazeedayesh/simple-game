var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    parent: 'game-container'
};

var player;
var cursors;
var obstacles;
var score = 0;
var scoreText;
var background;
var gameOverText;
var restartButton;
var gameOver = false;
var game = new Phaser.Game(config);

function preload() {
    this.load.image('road', 'https://github.com/yazeedayesh/simple-game/blob/main/images/road-trip-3469810_1280.jpg'); 
    this.load.image('car', 'path/to/car.png'); 
    this.load.image('obstacle', 'path/to/obstacle.png'); 
    this.load.image('background', 'path/to/background.png'); 
    this.load.audio('bgMusic', 'path/to/background-music.mp3'); 
}

function create() {
    background = this.add.tileSprite(400, 300, 800, 600, 'background');
    
    player = this.physics.add.sprite(400, 500, 'car');
    player.setCollideWorldBounds(true);

    obstacles = this.physics.add.group();
    this.time.addEvent({
        delay: 1000,
        callback: addObstacle,
        callbackScope: this,
        loop: true
    });

    cursors = this.input.keyboard.createCursorKeys();

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    gameOverText = this.add.text(400, 300, '', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);
    restartButton = this.add.text(400, 400, '', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

    // Add background music
    this.bgMusic = this.sound.add('bgMusic', { volume: 0.5, loop: true });
    this.bgMusic.play();
}

function update() {
    if (gameOver) return;

    background.tilePositionY -= 5;

    if (cursors.left.isDown) {
        player.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-200);
    } else if (cursors.down.isDown) {
        player.setVelocityY(200);
    } else {
        player.setVelocityY(0);
    }

    Phaser.Actions.IncY(obstacles.getChildren(), 5);
    obstacles.children.iterate(function (obstacle) {
        if (obstacle.y > 600) {
            obstacle.destroy();
            score += 10;
            scoreText.setText('Score: ' + score);
        }
    });

    this.physics.add.overlap(player, obstacles, endGame, null, this);
}

function addObstacle() {
    var x = Phaser.Math.Between(100, 700);
    var obstacle = obstacles.create(x, 0, 'obstacle');
    obstacle.setVelocityY(200);
    obstacle.setCollideWorldBounds(true);
    obstacle.setBounce(1);
}

function endGame(player, obstacle) {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOverText.setText('Game Over');
    restartButton.setText('Click to Restart');
    gameOver = true;

    // Stop background music
    this.bgMusic.stop();

    restartButton.setInteractive({ useHandCursor: true }).on('pointerdown', () => restartGame());
}

function restartGame() {
    score = 0;
    scoreText.setText('Score: 0');
    gameOverText.setText('');
    restartButton.setText('');
    gameOver = false;
    this.physics.resume();

    // Reset player position and color
    player.clearTint();
    player.setPosition(400, 500);

    // Restart background music
    this.bgMusic.play();
}
