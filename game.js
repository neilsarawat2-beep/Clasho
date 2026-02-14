import { CONFIG } from "./config.js";
import { SmartAI } from "./ai.js";
import { Renderer } from "./renderer.js";
import { ABILITIES } from "./abilities.js";

let canvas;
let renderer;
let aiController;
let gameState;
let lastTime = 0;

export function startGame(mode = "1P") {

    canvas = document.getElementById("gameCanvas");

    gameState = {
        mode,
        units: [],
        effects: [],
        elapsedTime: 0,
        mapLength: 20,
        bridgePosition: 10,

        player: {
            dudu: CONFIG.STARTING_DUDU,
            tower: { hp: CONFIG.getTowerHP() }
        },

        ai: {
            dudu: CONFIG.STARTING_DUDU,
            tower: { hp: CONFIG.getTowerHP() }
        }
    };

    renderer = new Renderer(canvas, gameState);
    aiController = new SmartAI(gameState);

    requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {

    const delta = timestamp - lastTime;
    lastTime = timestamp;

    gameState.elapsedTime += delta;

    updateUnits(delta);
    updateEffects(delta);
    handleDudu(delta);
    handleDeaths();
    handleTowerDamage();

    if (gameState.mode === "1P") {
        aiController.update(timestamp);
    }

    renderer.render();

    requestAnimationFrame(gameLoop);
}

/* ===============================
   STRESS-SAFE SYSTEMS
================================ */

function handleDudu(delta) {
    if (!gameState.lastDuduTime)
        gameState.lastDuduTime = 0;

    gameState.lastDuduTime += delta;

    if (gameState.lastDuduTime >= CONFIG.DUDU_INTERVAL) {
        gameState.lastDuduTime = 0;

        if (gameState.player.dudu < CONFIG.MAX_DUDU)
            gameState.player.dudu++;

        if (gameState.ai.dudu < CONFIG.MAX_DUDU)
            gameState.ai.dudu++;
    }
}

function updateUnits(delta) {

    gameState.units.forEach(unit => {

        if (!unit.speed) return;

        if (unit.owner === "player")
            unit.position += unit.speed * 0.01;
        else
            unit.position -= unit.speed * 0.01;

        if (unit.position < 0) unit.position = 0;
        if (unit.position > gameState.mapLength)
            unit.position = gameState.mapLength;
    });
}

function updateEffects(delta) {

    gameState.effects.forEach(effect => {
        effect.duration -= delta;

        if (effect.duration < 0)
            effect.duration = 0;
    });

    gameState.effects =
        gameState.effects.filter(e => e.duration > 0);
}

function handleDeaths() {

    gameState.units.forEach(unit => {

        if (unit.hp <= 0 && !unit.dead) {

            unit.dead = true;

            if (unit.ability &&
                ABILITIES[unit.ability]) {

                try {
                    ABILITIES[unit.ability](unit, gameState);
                } catch (e) {
                    console.error("Ability crash:", e);
                }
            }
        }
    });

    gameState.units =
        gameState.units.filter(u => u.hp > 0);
}

function handleTowerDamage() {

    gameState.units.forEach(unit => {

        if (unit.owner === "player" &&
            unit.position >= gameState.mapLength) {

            gameState.ai.tower.hp -=
                unit.attack || 20;
            unit.hp = 0;
        }

        if (unit.owner === "ai" &&
            unit.position <= 0) {

            gameState.player.tower.hp -=
                unit.attack || 20;
            unit.hp = 0;
        }
    });
}
