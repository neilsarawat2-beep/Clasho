/* ============================================
   CLASS WAR – SMART AI ENGINE
   ============================================ */

import { CONFIG } from "./config.js";
import { CHARACTER_CARDS, BUILDING_CARDS } from "./cards.js";

/* =====================================================
   AI CONTROLLER CLASS
===================================================== */

export class SmartAI {

    constructor(gameState) {
        this.gameState = gameState;
        this.lastDecisionTime = 0;
        this.rishetUses = 0;
    }

    update(currentTime) {

        if (currentTime - this.lastDecisionTime < CONFIG.AI_DECISION_INTERVAL)
            return;

        this.lastDecisionTime = currentTime;

        this.makeDecision();
    }

    /* =====================================================
       MAIN DECISION LOGIC
    ===================================================== */

    makeDecision() {

        const ai = this.gameState.ai;
        const player = this.gameState.player;

        if (ai.dudu < 2) return;

        const lanePressure = this.evaluateLanePressure();

        const losing = ai.tower.hp < player.tower.hp;

        // 1️⃣ Emergency defense
        if (lanePressure.highThreatLane !== null) {
            this.defendLane(lanePressure.highThreatLane);
            return;
        }

        // 2️⃣ If losing → aggressive push
        if (losing && ai.dudu >= 4) {
            this.offensivePush();
            return;
        }

        // 3️⃣ If high Dudu → strategic combo
        if (ai.dudu >= 7) {
            this.comboAttack();
            return;
        }

        // 4️⃣ Opportunistic play
        this.basicPlay();
    }

    /* =====================================================
       LANE PRESSURE ANALYSIS
    ===================================================== */

    evaluateLanePressure() {

        let threatScores = [0, 0];

        this.gameState.units.forEach(unit => {
            if (unit.owner === "player") {
                threatScores[unit.lane] += unit.hp;
            }
        });

        let highThreatLane = null;

        if (threatScores[0] > 200) highThreatLane = 0;
        if (threatScores[1] > 200) highThreatLane = 1;

        return {
            scores: threatScores,
            highThreatLane
        };
    }

    /* =====================================================
       DEFENSIVE PLAY
    ===================================================== */

    defendLane(lane) {

        const ai = this.gameState.ai;

        // Air defense priority
        const airThreat = this.gameState.units.some(u =>
            u.owner === "player" &&
            u.type === CONFIG.TROOP_TYPES.AIR &&
            u.lane === lane
        );

        if (airThreat && ai.dudu >= 3) {
            this.deploy(CHARACTER_CARDS.ADYA, lane);
            return;
        }

        if (ai.dudu >= 3) {
            this.deploy(CHARACTER_CARDS.NOEL, lane);
            return;
        }

        if (ai.dudu >= 4) {
            this.deploy(BUILDING_CARDS.IRON_WALL, lane);
        }
    }

    /* =====================================================
       OFFENSIVE PUSH
    ===================================================== */

    offensivePush() {

        const ai = this.gameState.ai;

        const lane = Math.floor(Math.random() * 2);

        if (ai.dudu >= 4) {
            this.deploy(CHARACTER_CARDS.AAYANSH, lane);
        }

        if (ai.dudu >= 2) {
            this.deploy(CHARACTER_CARDS.UDAY, lane);
        }
    }

    /* =====================================================
       COMBO ATTACK
    ===================================================== */

    comboAttack() {

        const ai = this.gameState.ai;
        const lane = Math.floor(Math.random() * 2);

        if (ai.dudu >= 4) {
            this.deploy(CHARACTER_CARDS.NEIL, lane);
        }

        if (ai.dudu >= 3) {
            this.deploy(CHARACTER_CARDS.NOEL, lane);
        }

        // Strategic Dudu steal
        if (ai.dudu >= 5 && this.rishetUses < 2) {
            this.deploy(CHARACTER_CARDS.RISHET, lane);
            this.rishetUses++;
        }
    }

    /* =====================================================
       BASIC PLAY
    ===================================================== */

    basicPlay() {

        const ai = this.gameState.ai;
        const lane = Math.floor(Math.random() * 2);

        const choices = [
            CHARACTER_CARDS.UDAY,
            CHARACTER_CARDS.CHAHAK,
            CHARACTER_CARDS.NAYSHA
        ];

        const choice = choices[Math.floor(Math.random() * choices.length)];

        if (ai.dudu >= choice.cost) {
            this.deploy(choice, lane);
        }
    }

    /* =====================================================
       DEPLOY METHOD
    ===================================================== */

    deploy(card, lane) {

        const ai = this.gameState.ai;

        if (ai.dudu < card.cost) return;

        ai.dudu -= card.cost;

        this.gameState.spawnUnit({
            ...card,
            owner: "ai",
            lane: lane,
            position: this.gameState.mapLength - 1
        });
    }
}
