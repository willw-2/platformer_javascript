const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player
const player = {
    x: 100,
    y: 100,
    width: 40,
    height: 50,
    color: "pink"
};

// Draw the player
ctx.fillStyle = player.color;

ctx.fillRect(
    player.x,
    player.y,
    player.width,
    player.height
);
