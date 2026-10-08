const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let x = 100;
let y = 460;

let speed = 5;
let velocityY = 0;

let gravity = 0.5;
let jump = -10;

let left = false;
let right = false;
let jumping = false;
// Keyboard
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft" || event.key === "a") {
        left = true;
    }
    if (event.key === "ArrowRight" || event.key === "d") {
        right = true;
    }
    if (event.key === " " && !jumping) {
        velocityY = jump;
        jumping = true;
    }
});
document.addEventListener("keyup", function(event) {
    if (event.key === "ArrowLeft" || event.key === "a") {
        left = false;
    }
    if (event.key === "ArrowRight" || event.key === "d") {
        right = false;
    }
});
// Game loop
function game() {
    // Move left/right
    if (left) {
        x -= speed;
    }
    if (right) {
        x += speed;
    }
    // Gravity
    velocityY += gravity;
    y += velocityY;
    // Ground
    if (y >= 460) {
        y = 460;
        velocityY = 0;
        jumping = false;
    }
    // Keep inside screen
    if (x < 0) {
        x = 0;
    }
    if (x > canvas.width - 40) {
        x = canvas.width - 40;
    }
    // Clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // BLACK SKY
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, 800, 600);
    // WHITE GROUND
    ctx.fillStyle = "black";
    ctx.fillRect(0, 500, 800, 100);
    // PINK BLOB
    ctx.fillStyle = "smoke";
    ctx.beginPath();
    ctx.arc(
        x + 20,
        y + 20,
        20,
        0,
        Math.PI * 2
    );
    ctx.fill();
    requestAnimationFrame(game);
}
game();
