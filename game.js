const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ====================
// PLAYER
// ====================

const player = {
    x: 100,
    y: 460,
    size: 40,

    color: "pink",

    speed: 5,

    velocityY: 0,

    onGround: true
};


// ====================
// PHYSICS
// ====================

const gravity = 0.5;
const jumpPower = -12;


// ====================
// KEYBOARD
// ====================

const keys = {};

document.addEventListener("keydown", function(event) {

    keys[event.code] = true;

    // Jump
    if (event.code === "Space" && player.onGround) {
        player.velocityY = jumpPower;
        player.onGround = false;

        event.preventDefault();
    }
});


document.addEventListener("keyup", function(event) {

    keys[event.code] = false;

});


// ====================
// UPDATE
// ====================
function update() {
    // Move LEFT
    if (keys["ArrowLeft"]) {
        player.x -= player.speed;
    }
    // Move RIGHT
    if (keys["ArrowRight"]) {
        player.x += player.speed;
    }
    // Keep player inside the screen
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.size > canvas.width) {
        player.x = canvas.width - player.size;
    }
    // Gravity
    player.velocityY += gravity;
    player.y += player.velocityY;
    // Ground collision
    const groundY = 500;
    if (player.y + player.size >= groundY) {

        player.y = groundY - player.size;

        player.velocityY = 0;

        player.onGround = true;
    }
}
// ====================
// DRAW
// ====================
function draw() {
    // Clear screen
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
    // Background
    ctx.fillStyle = "skyblue";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
    // Ground
    ctx.fillStyle = "green";

    ctx.fillRect(
        0,
        500,
        canvas.width,
        100
    );

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
// ====================
// GAME LOOP
// ===================
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
gameLoop();
