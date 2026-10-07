const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
    x: 100,
    y: 100,
    size: 40,
    color: "pink",
    speed: 5,
    velocityY: 0
};

const gravity = 0.5;
const jumpPower = -12;

const keys = {};

document.addEventListener("keydown", function(event) {
    keys[event.key] = true;
});

document.addEventListener("keyup", function(event) {
    keys[event.key] = false;
});

function update() {

    // Left and right movement
    if (keys["ArrowLeft"]) {
        player.x -= player.speed;
    }

    if (keys["ArrowRight"]) {
        player.x += player.speed;
    }

    // Gravity
    player.velocityY += gravity;
    player.y += player.velocityY;

    // Jump
    if (keys[" "] && player.y >= 460) {
        player.velocityY = jumpPower;
    }

    // Ground collision
    if (player.y >= 460) {
        player.y = 460;
        player.velocityY = 0;
    }
}

function draw() {

    // Clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = "skyblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ground
    ctx.fillStyle = "green";
    ctx.fillRect(0, 500, canvas.width, 100);

    // Pink blob
    ctx.fillStyle = player.color;

    ctx.beginPath();

    ctx.arc(
        player.x + player.size / 2,
        player.y + player.size / 2,
        player.size / 2,
        0,
        Math.PI * 2
    );

    ctx.fill();
}

function gameLoop() {
    update();
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();
