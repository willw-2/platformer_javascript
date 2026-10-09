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
let playerAttackCooldown = 0;

// Enemy object
let enemy = {
    x: 600,
    y: 300,
    width: 40,
    height: 40,
    health: 100,
    maxHealth: 100,
    speed: 3,
    attackCooldown: 0,
    attackPattern: 0,
    moveDirection: 1 // 1 for right, -1 for left
};

let projectiles = [];
let playerHealth = 100;
let gameOver = false;

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
    if ((event.key === "f" || event.key === "F" || event.key === "j" || event.key === "J") && playerAttackCooldown <= 0) {
        performPlayerAttack();
        playerAttackCooldown = 25;
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

canvas.addEventListener("click", function() {
    if (playerAttackCooldown <= 0) {
        performPlayerAttack();
        playerAttackCooldown = 25;
    }
});

function performPlayerAttack() {
    if (gameOver || enemy.health <= 0) {
        return;
    }

    const attackRange = 90;
    const attackHeight = 60;
    const enemyCenterX = enemy.x + enemy.width / 2;
    const enemyCenterY = enemy.y + enemy.height / 2;
    const playerCenterX = x + 20;
    const playerCenterY = y + 20;

    const dx = enemyCenterX - playerCenterX;
    const dy = enemyCenterY - playerCenterY;

    if (Math.abs(dx) <= attackRange && Math.abs(dy) <= attackHeight) {
        enemy.health = Math.max(0, enemy.health - 25);
    }
}

// Enemy AI
function updateEnemy() {
    if (enemy.health <= 0) {
        return;
    }

    // Move toward the player when they're nearby
    if (Math.abs(x - enemy.x) > 60) {
        enemy.moveDirection = x > enemy.x ? 1 : -1;
        enemy.x += enemy.speed * enemy.moveDirection;
    }

    // Keep enemy in bounds
    if (enemy.x < 50) {
        enemy.x = 50;
        enemy.moveDirection = 1;
    }
    if (enemy.x > canvas.width - 90) {
        enemy.x = canvas.width - 90;
        enemy.moveDirection = -1;
    }

    // Attack pattern
    enemy.attackCooldown--;
    if (enemy.attackCooldown <= 0) {
        const nearPlayer = Math.abs(x - enemy.x) < 90 && Math.abs(y - enemy.y) < 60;

        if (nearPlayer) {
            playerHealth = Math.max(0, playerHealth - 10);
            enemy.attackCooldown = 90;
        } else {
            attackPattern();
            enemy.attackCooldown = 80;
        }
    }
}

// Different attack patterns like Sans
function attackPattern() {
    enemy.attackPattern = Math.floor(Math.random() * 3);

    if (enemy.attackPattern === 0) {
        // Straight bones toward player
        for (let i = 0; i < 5; i++) {
            projectiles.push({
                x: enemy.x + 20,
                y: enemy.y + 20,
                velocityX: (Math.random() - 0.5) * 8,
                velocityY: 6 + Math.random() * 3,
                size: 8,
                damage: 10
            });
        }
    } else if (enemy.attackPattern === 1) {
        // Homing bones toward player
        let angle = Math.atan2(y - enemy.y, x - enemy.x);
        for (let i = 0; i < 3; i++) {
            projectiles.push({
                x: enemy.x + 20,
                y: enemy.y + 20,
                velocityX: Math.cos(angle + (i - 1) * 0.3) * 5,
                velocityY: Math.sin(angle + (i - 1) * 0.3) * 5,
                size: 10,
                damage: 15,
                homing: true,
                homingStrength: 0.15
            });
        }
    } else {
        // Circular pattern
        for (let i = 0; i < 8; i++) {
            let angle = (i / 8) * Math.PI * 2;
            projectiles.push({
                x: enemy.x + 20,
                y: enemy.y + 20,
                velocityX: Math.cos(angle) * 5,
                velocityY: Math.sin(angle) * 5,
                size: 6,
                damage: 8
            });
        }
    }
}

// Update projectiles
function updateProjectiles() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        let proj = projectiles[i];

        // Homing behavior
        if (proj.homing) {
            let angle = Math.atan2(y - proj.y, x - proj.x);
            proj.velocityX += Math.cos(angle) * proj.homingStrength;
            proj.velocityY += Math.sin(angle) * proj.homingStrength;
        }

        proj.x += proj.velocityX;
        proj.y += proj.velocityY;

        // Check collision with player
        if (proj.x > x && proj.x < x + 40 && proj.y > y && proj.y < y + 40) {
            playerHealth -= proj.damage;
            projectiles.splice(i, 1);
            continue;
        }

        // Remove if off screen
        if (proj.y > canvas.height || proj.x < 0 || proj.x > canvas.width) {
            projectiles.splice(i, 1);
        }
    }
}

// Game loop
function game() {
    if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        if (playerHealth <= 0) {
            ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
        } else {
            ctx.fillText("YOU WIN", canvas.width / 2, canvas.height / 2);
        }
        return;
    }

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

    if (playerAttackCooldown > 0) {
        playerAttackCooldown--;
    }

    // Update game entities
    updateEnemy();
    updateProjectiles();

    // Check if enemy is defeated
    if (enemy.health <= 0) {
        gameOver = true;
    }

    // Check if player is defeated
    if (playerHealth <= 0) {
        gameOver = true;
    }

    // Clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sky
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, 800, 600);

    // Ground
    ctx.fillStyle = "black";
    ctx.fillRect(0, 500, 800, 100);

    // Draw player (pink blob)
    ctx.fillStyle = "pink";
    ctx.beginPath();
    ctx.arc(x + 20, y + 20, 20, 0, Math.PI * 2);
    ctx.fill();

    // Draw enemy (red skull)
    ctx.fillStyle = "red";
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    ctx.fillStyle = "white";
    ctx.fillRect(enemy.x + 8, enemy.y + 8, 8, 8);
    ctx.fillRect(enemy.x + 24, enemy.y + 8, 8, 8);

    // Draw projectiles (bones)
    projectiles.forEach(proj => {
        ctx.fillStyle = "yellow";
        ctx.fillRect(proj.x - proj.size / 2, proj.y - proj.size / 2, proj.size, proj.size);
    });

    // Draw health bars
    // Enemy health
    ctx.fillStyle = "darkred";
    ctx.fillRect(50, 20, 200, 20);
    ctx.fillStyle = "lime";
    ctx.fillRect(50, 20, 200 * (enemy.health / enemy.maxHealth), 20);
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText("Enemy HP: " + Math.ceil(enemy.health), 160, 35);

    // Player health
    ctx.fillStyle = "darkred";
    ctx.fillRect(canvas.width - 250, 20, 200, 20);
    ctx.fillStyle = "lime";
    ctx.fillRect(canvas.width - 250, 20, 200 * (playerHealth / 100), 20);
    ctx.fillStyle = "white";
    ctx.fillText("Player HP: " + Math.ceil(playerHealth), canvas.width - 150, 35);

    requestAnimationFrame(game);
}

game();
