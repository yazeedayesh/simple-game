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
var game = new Phaser.Game(config);

function preload() {
    this.load.image('road', 'https://github.com/yazeedayesh/simple-game/tree/main/images/1.png'); // استبدل بمسار الصورة
    this.load.image('car', 'https://github.com/yazeedayesh/simple-game/tree/main/images/2.png'); // استبدل بمسار الصورة
    this.load.image('obstacle', 'https://github.com/yazeedayesh/simple-game/tree/main/images/3.png'); // استبدل بمسار الصورة
}

function create() {
    this.add.tileSprite(400, 300, 800, 600, 'road').setScale(2);

    player = this.physics.add.sprite(400, 500, 'car');
    player.setCollideWorldBounds(true);

    obstacles = this.physics.add.group();
    this.time.addEvent({
        delay: 1500,
        callback: addObstacle,
        callbackScope: this,
        loop: true
    });

    cursors = this.input.keyboard.createCursorKeys();

    scoreText = this.add.text(16, 16, 'النتيجة: 0', { fontSize: '32px', fill: '#fff' });
}

function update() {
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
            scoreText.setText('النتيجة: ' + score);
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
    scoreText.setText('لقد خسرت! النتيجة: ' + score);
}
