/* ============================================
   CLASS WAR – RENDER ENGINE
   ============================================ */

import { CONFIG } from "./config.js";

/* =====================================================
   RENDERER CLASS
===================================================== */

export class Renderer {

    constructor(canvas, gameState) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.gameState = gameState;

        this.resize();
        window.addEventListener("resize", () => this.resize());
    }

    /* =====================================================
       RESPONSIVE RESIZE
    ===================================================== */

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.blockSize = Math.min(
            this.canvas.width / 20,
            this.canvas.height / 12
        );

        this.bridgeX = this.canvas.width * CONFIG.BRIDGE_POSITION_RATIO;
        this.laneHeight = this.canvas.height / 3;
    }

    /* =====================================================
       MAIN RENDER
    ===================================================== */

    render() {
        this.clear();
        this.drawArena();
        this.drawRiver();
        this.drawTowers();
        this.drawUnits();
        this.drawEffects();
        this.drawUI();
    }

    clear() {
        this.ctx.fillStyle = "#111";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /* =====================================================
       ARENA – SCHOOL CORRIDOR
    ===================================================== */

    drawArena() {

        for (let x = 0; x < this.canvas.width; x += this.blockSize) {
            for (let y = 0; y < this.canvas.height; y += this.blockSize) {

                const randomRed = Math.random() < 0.05;

                this.ctx.fillStyle = randomRed
                    ? "#b33"
                    : "#f5f5f5";

                this.ctx.fillRect(
                    x,
                    y,
                    this.blockSize,
                    this.blockSize
                );

                this.ctx.strokeStyle = "#ddd";
                this.ctx.strokeRect(
                    x,
                    y,
                    this.blockSize,
                    this.blockSize
                );
            }
        }
    }

    /* =====================================================
       CRIMSON ENERGY RIVER
    ===================================================== */

    drawRiver() {

        this.ctx.fillStyle = "#7a0019";
        this.ctx.fillRect(
            this.bridgeX - this.blockSize,
            0,
            this.blockSize * 2,
            this.canvas.height
        );

        // glowing energy effect
        this.ctx.globalAlpha = 0.4;
        this.ctx.fillStyle = "#ff0033";
        this.ctx.fillRect(
            this.bridgeX - this.blockSize,
            0,
            this.blockSize * 2,
            this.canvas.height
        );
        this.ctx.globalAlpha = 1;
    }

    /* =====================================================
       TOWERS – CLASS 9B & 9A
    ===================================================== */

    drawTowers() {

        const towerWidth = this.blockSize * 2;
        const towerHeight = this.blockSize * 3;

        // Player Tower (9B)
        this.drawTower(
            0,
            this.canvas.height / 2 - towerHeight / 2,
            towerWidth,
            towerHeight,
            "#0066cc",
            "9B",
            this.gameState.player.tower.hp
        );

        // AI Tower (9A)
        this.drawTower(
            this.canvas.width - towerWidth,
            this.canvas.height / 2 - towerHeight / 2,
            towerWidth,
            towerHeight,
            "#990000",
            "9A",
            this.gameState.ai.tower.hp
        );
    }

    drawTower(x, y, w, h, color, label, hp) {

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w, h);

        this.ctx.fillStyle = "#000";
        this.ctx.font = `${this.blockSize}px Arial`;
        this.ctx.fillText(label, x + 10, y + 30);

        // HP Bar
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(x, y - 10, w, 6);

        this.ctx.fillStyle = "#0f0";
        this.ctx.fillRect(x, y - 10, w * (hp / 2000), 6);
    }

    /* =====================================================
       DRAW UNITS
    ===================================================== */

    drawUnits() {

        this.gameState.units.forEach(unit => {

            const x = this.getUnitX(unit);
            const y = this.getUnitY(unit);

            this.ctx.fillStyle =
                unit.owner === "player" ? "#00cc66" : "#cc0000";

            if (unit.type === "air") {
                this.ctx.fillStyle = "#ffaa00";
            }

            this.ctx.fillRect(
                x,
                y,
                this.blockSize,
                this.blockSize
            );

            // HP bar
            this.ctx.fillStyle = "#000";
            this.ctx.fillRect(x, y - 5, this.blockSize, 4);

            this.ctx.fillStyle = "#0f0";
            this.ctx.fillRect(
                x,
                y - 5,
                this.blockSize * (unit.hp / unit.maxHp || 1),
                4
            );
        });
    }

    getUnitX(unit) {
        return unit.position * this.blockSize;
    }

    getUnitY(unit) {
        return (unit.lane + 1) * this.laneHeight;
    }

    /* =====================================================
       EFFECTS
    ===================================================== */

    drawEffects() {

        this.gameState.effects.forEach(effect => {

            if (effect.type === "coal_barrier") {
                this.ctx.fillStyle = "#333";
            }

            if (effect.type === "bridge_block") {
                this.ctx.fillStyle = "#555";
            }

            if (effect.type === "poison") {
                this.ctx.fillStyle = "#6600cc";
            }

            const x = effect.position * this.blockSize;
            const y = (effect.lane + 1) * this.laneHeight;

            this.ctx.globalAlpha = 0.6;
            this.ctx.fillRect(
                x,
                y,
                this.blockSize * 2,
                this.blockSize
            );
            this.ctx.globalAlpha = 1;
        });
    }

    /* =====================================================
       UI – DUDU & TIMER
    ===================================================== */

    drawUI() {

        this.ctx.fillStyle = "#000";
        this.ctx.font = "20px Arial";

        this.ctx.fillText(
            `Player Dudu: ${this.gameState.player.dudu}`,
            20,
            30
        );

        this.ctx.fillText(
            `AI Dudu: ${this.gameState.ai.dudu}`,
            this.canvas.width - 150,
            30
        );

        const timeLeft = Math.floor(
            (CONFIG.GAME_DURATION - this.gameState.elapsedTime) / 1000
        );

        this.ctx.fillText(
            `Time: ${timeLeft}`,
            this.canvas.width / 2 - 40,
            30
        );
    }
}
