const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player
const player = {
    x: 100,
    y: 100,
    width: 40,
    height: 40,
    color: "pink",
    speed: 5
};

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
    if (keys["ArrowLeft"]) {
        player.x -= player.speed;
    }

    if (keys["ArrowRight"]) {
        player.x += player.speed;
    }
}

// Draw the game
function draw() {
    // Clear the screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
