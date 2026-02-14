/* ============================================
   CLASS WAR – CARD DEFINITIONS
   ============================================ */

import { CONFIG } from "./config.js";

/* =====================================================
   CHARACTER CARDS
===================================================== */

export const CHARACTER_CARDS = {

    NEIL: {
        id: "neil",
        name: "Neil – The Brute",
        cost: 4,
        type: CONFIG.TROOP_TYPES.GROUND,
        role: "melee",
        hp: 150,
        speed: CONFIG.normalizeSpeed(40),
        attack: 30,
        deathDamage: 50,
        ability: "neil_death_sword"
    },

    UDAY: {
        id: "uday",
        name: "Uday – The Snipe",
        cost: 2,
        type: CONFIG.TROOP_TYPES.GROUND,
        role: "ranged",
        range: 5,
        hp: 120,
        speed: CONFIG.normalizeSpeed(20),
        attack: 20,
        deathLaneDamage: 15,
        deathTowerDamage: 20,
        ability: "uday_lane_arrow"
    },

    CHAHAK: {
        id: "chahak",
        name: "Chahak – The Bomb",
        cost: 2,
        type: CONFIG.TROOP_TYPES.GROUND,
        role: "explosive",
        range: 3,
        hp: 80,
        speed: CONFIG.normalizeSpeed(15),
        attack: 15,
        allySelfDamagePercent: 0.4,
        ability: "chahak_explosion"
    },

    NAYSHA: {
        id: "naysha",
        name: "Naysha – The Shadow",
        cost: 2,
        type: CONFIG.TROOP_TYPES.GROUND,
        role: "assassin",
        hp: 50,
        speed: CONFIG.normalizeSpeed(45),
        attack: 10,
        poisonPerSecond: 5,
        deathZoneDamage: 3,
        deathZoneRadius: 2,
        ability: "naysha_poison_path"
    },

    SHUBHAN: {
        id: "shubhan",
        name: "Shubhan – The Boulder",
        cost: 4,
        type: CONFIG.TROOP_TYPES.GROUND,
        role: "rolling",
        hp: null, // Not specified
        speed: CONFIG.normalizeSpeed(30),
        attack: 40,
        towerDamage: 50,
        ability: "shubhan_roll"
    },

    AAYANSH: {
        id: "aayansh",
        name: "Aayansh – The Giant",
        cost: 4,
        type: CONFIG.TROOP_TYPES.GROUND,
        role: "magic_melee",
        hp: 80,
        speed: CONFIG.normalizeSpeed(30),
        magicRange: 4,
        magicDamage: 30,
        meleeDamage: 35,
        deathBuffAttackPercent: 0.3,
        deathBuffHpPercent: 0.5,
        deathBuffDuration: 10000,
        ability: "aayansh_death_buff"
    },

    ADYA: {
        id: "adya",
        name: "Adya – The Furnace",
        cost: 3,
        type: CONFIG.TROOP_TYPES.AIR,
        role: "priority_air",
        hp: 60,
        speed: CONFIG.normalizeSpeed(25),
        range: 3,
        attack: 30,
        targetPriority: CONFIG.TARGET_PRIORITY.AIR_FIRST,
        ability: "adya_coal_barrier"
    },

    NOEL: {
        id: "noel",
        name: "Noel – The Summoner",
        cost: 3,
        type: CONFIG.TROOP_TYPES.AIR,
        role: "summoner",
        hp: 60,
        speed: CONFIG.normalizeSpeed(25),
        magicDamage: 25,
        range: 3,
        summonInterval: 45000,
        summonCount: 3,
        summonHp: 1,
        summonDamage: 15,
        deathNerfPercent: 0.3,
        ability: "noel_summon_nerf"
    },

    RISHET: {
        id: "rishet",
        name: "Rishet – The Heist",
        cost: 5,
        type: CONFIG.TROOP_TYPES.UNDERGROUND,
        role: "dudu_steal",
        usesLimit: 2,
        stealMin: 2,
        stealMax: 3,
        speed: CONFIG.normalizeSpeed(25),
        ability: "rishet_steal"
    },

    ADVIK: {
        id: "advik",
        name: "Advik – The Flash",
        cost: 3,
        type: CONFIG.TROOP_TYPES.UNDERGROUND,
        role: "bridge_shield",
        hp: 110,
        speed: CONFIG.normalizeSpeed(30),
        ability: "advik_bridge_block"
    }
};


/* =====================================================
   BUILDING CARDS
===================================================== */

export const BUILDING_CARDS = {

    CATAPULT: {
        id: "catapult",
        name: "Catapult",
        cost: 4,
        hp: 100,
        attack: 50,
        interval: 20000,
        role: "offense",
        ability: "catapult_fire"
    },

    IRON_WALL: {
        id: "iron_wall",
        name: "Iron Wall",
        cost: 4,
        hp: 150,
        duration: 30000,
        role: "defense",
        ability: "iron_wall_block"
    },

    PEEKABOO_SHUBHAN: {
        id: "peekaboo_shubhan",
        name: "Peekaboo – Shubhan",
        cost: 5,
        hp: 40,
        releaseDamageMultiplier: 0.5,
        role: "hybrid",
        ability: "peekaboo_release"
    },

    DUUS: {
        id: "duus",
        name: "Duus",
        cost: 3,
        hp: 70,
        productionInterval: CONFIG.DUDU_FAST_INTERVAL,
        role: "production",
        ability: "duus_boost"
    },

    MAGE_TOWER: {
        id: "mage_tower",
        name: "Mage Tower",
        cost: 4,
        hp: 70,
        buffPercent: 0.3,
        role: "buff",
        ability: "mage_tower_buff"
    }
};


/* =====================================================
   POTION CARDS
===================================================== */

export const POTION_CARDS = {

    FROST: {
        id: "frost",
        name: "Frost",
        cooldown: 30000,
        effect: CONFIG.STATUS.FROST
    },

    BURN: {
        id: "burn",
        name: "Burn",
        cooldown: 45000,
        effect: CONFIG.STATUS.BURN
    },

    HEAL: {
        id: "heal",
        name: "Heal",
        cooldown: 30000,
        effect: CONFIG.STATUS.BUFF
    },

    BUFF: {
        id: "buff",
        name: "Buff",
        cooldown: 45000,
        effect: CONFIG.STATUS.BUFF
    },

    NERF: {
        id: "nerf",
        name: "Nerf",
        cooldown: 45000,
        effect: CONFIG.STATUS.NERF
    }
};
