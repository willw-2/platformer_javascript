const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player
const player = {
    x: 100,
    y: 100,
    width: 40,
    height: 40,
    color: "hotpink",
    speed: 5,
    velocityY: 0,
    jumping: false
};

// Physics
const gravity = 0.5;
const jumpPower = -12;

// Keyboard controls
const keys = {};

document.addEventListener("keydown", function(event) {
    keys[event.key] = true;
});

document.addEventListener("keyup", function(event) {
    keys[event.key] = false;
});

// Update the game
function update() {

    // Move left
    if (keys["ArrowLeft"]) {
        player.x -= player.speed;
    }

    // Move right
    if (keys["ArrowRight"]) {
        player.x += player.speed;
    }

    // Gravity
    player.velocityY += gravity;
    player.y += player.velocityY;

    // Jump
    if (keys[" "] && !player.jumping) {
        player.velocityY = jumpPower;
        player.jumping = true;
    }

    // Ground
    const groundY = 500;

    if (player.y + player.height >= groundY) {
        player.y = groundY - player.height;
        player.velocityY = 0;
        player.jumping = false;
    }
}

// Draw the game
function draw() {

    // Clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = "green";
    ctx.fillRect(0, 500, canvas.width, 100);

    // Draw pink blob
    ctx.fillStyle = player.color;

    ctx.beginPath();

    ctx.arc(
        player.x + player.width / 2,
        player.y + player.height / 2,
        player.width / 2,
        0,
        Math.PI * 2
    );

    ctx.fill();
}

// Game loop
function gameLoop() {
    update();
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();
