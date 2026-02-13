/* ============================================
   CLASS WAR – MAIN GAME ENGINE
   ============================================ */

import { CONFIG } from "./config.js";
import { CHARACTER_CARDS } from "./cards.js";
import { ABILITIES } from "./abilities.js";
import { SmartAI } from "./ai.js";
import { Renderer } from "./renderer.js";

/* =====================================================
   INITIAL SETUP
===================================================== */

const canvas = document.getElementById("gameCanvas");

const gameState = {
    units: [],
    effects: [],
    elapsedTime: 0,
    bridgePosition: 10,
    mapLength: 20,
    mode: "1P", // change to "2P" for local multiplayer

    player: {
        dudu: CONFIG.STARTING_DUDU,
        tower: { hp: CONFIG.getTowerHP() }
    },

    ai: {
        dudu: CONFIG.STARTING_DUDU,
        tower: { hp: CONFIG.getTowerHP() }
    },

    spawnUnit(unitData) {
        this.units.push({
            ...unitData,
            maxHp: unitData.hp || 100,
            hp: unitData.hp || 100
        });
    }
};

const renderer = new Renderer(canvas, gameState);
const aiController = new SmartAI(gameState);

/* =====================================================
   DUDU GENERATION
===================================================== */

let lastDuduTime = 0;

function handleDuduGeneration(currentTime) {

    if (currentTime - lastDuduTime < CONFIG.DUDU_INTERVAL)
        return;

    lastDuduTime = currentTime;

    if (gameState.player.dudu < CONFIG.MAX_DUDU)
        gameState.player.dudu++;

    if (gameState.ai.dudu < CONFIG.MAX_DUDU)
        gameState.ai.dudu++;
}

/* =====================================================
   UNIT MOVEMENT
===================================================== */

function updateMovement() {

    gameState.units.forEach(unit => {

        if (unit.owner === "player")
            unit.position += unit.speed * 0.02;
        else
            unit.position -= unit.speed * 0.02;
    });
}

/* =====================================================
   COMBAT SYSTEM
===================================================== */

function updateCombat() {

    gameState.units.forEach(unit => {

        const enemies = gameState.units.filter(
            u => u.owner !== unit.owner &&
                 u.lane === unit.lane
        );

        enemies.forEach(enemy => {

            if (Math.abs(enemy.position - unit.position) < 1) {
                enemy.hp -= unit.attack || 0;
            }
        });
    });
}

/* =====================================================
   EFFECT PROCESSING
===================================================== */

function updateEffects(deltaTime) {

    gameState.effects.forEach(effect => {

        effect.duration -= deltaTime;

        if (effect.type === "poison") {

            gameState.units.forEach(unit => {
                if (unit.owner !== effect.owner &&
                    unit.lane === effect.lane &&
                    Math.abs(unit.position - effect.position) <= effect.radius
                ) {
                    unit.hp -= effect.damagePerSecond * (deltaTime / 1000);
                }
            });
        }
    });

    gameState.effects = gameState.effects.filter(e => e.duration > 0);
}

/* =====================================================
   DEATH HANDLER
===================================================== */

function handleDeaths() {

    gameState.units.forEach(unit => {

        if (unit.hp <= 0) {

            if (unit.ability && ABILITIES[unit.ability]) {
                ABILITIES[unit.ability](unit, gameState);
            }
        }
    });

    gameState.units = gameState.units.filter(u => u.hp > 0);
}

/* =====================================================
   TOWER DAMAGE
===================================================== */

function checkTowerDamage() {

    gameState.units.forEach(unit => {

        if (unit.owner === "player" && unit.position >= gameState.mapLength) {
            gameState.ai.tower.hp -= unit.attack || 20;
            unit.hp = 0;
        }

        if (unit.owner === "ai" && unit.position <= 0) {
            gameState.player.tower.hp -= unit.attack || 20;
            unit.hp = 0;
        }
    });
}

/* =====================================================
   WIN CONDITION
===================================================== */

function checkWin() {

    if (gameState.player.tower.hp <= 0) {
        alert("AI Wins");
        location.reload();
    }

    if (gameState.ai.tower.hp <= 0) {
        alert("Player Wins");
        location.reload();
    }

    if (gameState.elapsedTime >= CONFIG.GAME_DURATION) {

        if (gameState.player.tower.hp >
            gameState.ai.tower.hp)
            alert("Player Wins");
        else
            alert("AI Wins");

        location.reload();
    }
}

/* =====================================================
   INPUT HANDLING (TEMPORARY TEST DEPLOY)
===================================================== */

window.addEventListener("keydown", (e) => {

    if (e.key === "1")
        deployPlayer(CHARACTER_CARDS.NEIL, 0);

    if (e.key === "2")
        deployPlayer(CHARACTER_CARDS.UDAY, 1);
});

function deployPlayer(card, lane) {

    if (gameState.player.dudu < card.cost) return;

    gameState.player.dudu -= card.cost;

    gameState.spawnUnit({
        ...card,
        owner: "player",
        lane: lane,
        position: 0
    });
}

/* =====================================================
   MAIN GAME LOOP
===================================================== */

let lastTime = 0;

function gameLoop(timestamp) {

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    gameState.elapsedTime += deltaTime;

    handleDuduGeneration(timestamp);
    updateMovement();
    updateCombat();
    updateEffects(deltaTime);
    checkTowerDamage();
    handleDeaths();

    if (gameState.mode === "1P") {
        aiController.update(timestamp);
    }

    checkWin();
    renderer.render();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
