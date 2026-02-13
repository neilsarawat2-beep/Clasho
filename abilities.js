/* ============================================
   CLASS WAR – ABILITIES ENGINE
   ============================================ */

import { CONFIG } from "./config.js";

/* =====================================================
   HELPER FUNCTIONS
===================================================== */

function getEnemies(unit, gameState) {
    return gameState.units.filter(u => u.owner !== unit.owner);
}

function getAllies(unit, gameState) {
    return gameState.units.filter(u => u.owner === unit.owner && u.id !== unit.id);
}

function getUnitsInLane(lane, gameState) {
    return gameState.units.filter(u => u.lane === lane);
}

function getUnitsInRadius(position, radius, gameState) {
    return gameState.units.filter(u =>
        Math.abs(u.position - position) <= radius
    );
}

/* =====================================================
   CHARACTER ABILITIES
===================================================== */

export const ABILITIES = {

    /* ===============================
       NEIL – Death Sword
    =============================== */
    neil_death_sword(unit, gameState) {
        const enemies = getEnemies(unit, gameState)
            .filter(e => e.type === CONFIG.TROOP_TYPES.GROUND);

        if (enemies.length === 0) return;

        const highestHP = enemies.reduce((a, b) =>
            (a.hp > b.hp ? a : b)
        );

        highestHP.hp -= unit.deathDamage;
    },

    /* ===============================
       UDAY – Death Lane Arrow
    =============================== */
    uday_lane_arrow(unit, gameState) {
        const laneUnits = getUnitsInLane(unit.lane, gameState);

        laneUnits.forEach(u => {
            if (u.owner !== unit.owner) {
                u.hp -= unit.deathLaneDamage;
            }
        });

        const enemyTower = gameState.towers[unit.owner === "player" ? "ai" : "player"];
        enemyTower.hp -= unit.deathTowerDamage;
    },

    /* ===============================
       CHAHAK – Explosion
    =============================== */
    chahak_explosion(unit, gameState) {
        const unitsInRange = getUnitsInRadius(unit.position, unit.range, gameState);

        unitsInRange.forEach(u => {
            if (u.owner !== unit.owner) {
                u.hp = 0; // kills all enemy troops
            } else {
                u.hp -= u.hp * unit.allySelfDamagePercent;
            }
        });
    },

    /* ===============================
       NAYSHA – Poison Path
    =============================== */
    naysha_poison_path(unit, gameState) {

        // Apply poison while alive handled in main update loop

        // Death poison zone
        gameState.effects.push({
            type: CONFIG.STATUS.POISON,
            lane: unit.lane,
            position: unit.position,
            radius: unit.deathZoneRadius,
            damagePerSecond: unit.deathZoneDamage,
            owner: unit.owner,
            duration: 8000
        });
    },

    /* ===============================
       SHUBHAN – Rolling Damage
    =============================== */
    shubhan_roll(unit, gameState) {
        const enemies = getEnemies(unit, gameState);

        enemies.forEach(e => {
            if (Math.abs(e.position - unit.position) < 1) {
                e.hp -= unit.attack;
            }
        });
    },

    /* ===============================
       AAYANSH – Death Buff
    =============================== */
    aayansh_death_buff(unit, gameState) {
        const allies = getAllies(unit, gameState);

        allies.forEach(a => {
            a.attack *= (1 + unit.deathBuffAttackPercent);
            a.hp *= (1 + unit.deathBuffHpPercent);

            setTimeout(() => {
                a.attack /= (1 + unit.deathBuffAttackPercent);
                a.hp /= (1 + unit.deathBuffHpPercent);
            }, unit.deathBuffDuration);
        });
    },

    /* ===============================
       ADYA – Coal Barrier
    =============================== */
    adya_coal_barrier(unit, gameState) {
        gameState.effects.push({
            type: "coal_barrier",
            lane: unit.lane,
            position: unit.position,
            radius: 1,
            owner: unit.owner,
            duration: 15000
        });
    },

    /* ===============================
       NOEL – Summon & Death Nerf
    =============================== */
    noel_summon(unit, gameState) {
        for (let i = 0; i < unit.summonCount; i++) {
            gameState.units.push({
                id: "pathak_" + Math.random(),
                name: "Pathak",
                hp: unit.summonHp,
                attack: unit.summonDamage,
                owner: unit.owner,
                lane: unit.lane,
                position: unit.position,
                type: CONFIG.TROOP_TYPES.AIR
            });
        }
    },

    noel_summon_nerf(unit, gameState) {
        const enemies = getEnemies(unit, gameState);

        enemies.forEach(e => {
            e.speed *= (1 - unit.deathNerfPercent);
            e.attack *= (1 - unit.deathNerfPercent);
        });
    },

    /* ===============================
       RISHET – Dudu Steal
    =============================== */
    rishet_steal(unit, gameState) {
        const enemy = unit.owner === "player" ? gameState.ai : gameState.player;

        const stealAmount = Math.floor(
            Math.random() * (unit.stealMax - unit.stealMin + 1)
        ) + unit.stealMin;

        const actualSteal = Math.min(stealAmount, enemy.dudu);

        enemy.dudu -= actualSteal;
        gameState[unit.owner].dudu += actualSteal;
    },

    /* ===============================
       ADVIK – Bridge Shield
    =============================== */
    advik_bridge_block(unit, gameState) {
        gameState.effects.push({
            type: "bridge_block",
            lane: unit.lane,
            position: gameState.bridgePosition,
            radius: 1,
            owner: unit.owner,
            duration: 20000
        });
    }

};


/* =====================================================
   POTION EFFECTS
===================================================== */

export const POTION_EFFECTS = {

    frost(targetUnits) {
        targetUnits.forEach(u => {
            u.speed *= 0.5;
        });
    },

    burn(targetUnits) {
        targetUnits.forEach(u => {
            u.hp -= 20;
        });
    },

    heal(targetUnits) {
        targetUnits.forEach(u => {
            u.hp += 30;
        });
    },

    buff(targetUnits) {
        targetUnits.forEach(u => {
            u.attack *= 1.3;
            u.hp *= 1.3;
        });
    },

    nerf(targetUnits) {
        targetUnits.forEach(u => {
            u.attack *= 0.7;
            u.speed *= 0.7;
        });
    }
};
