/* ============================================
   CLASS WAR – CONFIGURATION FILE
   ============================================ */

export const CONFIG = {

    /* ===============================
       GAME SETTINGS
    =============================== */

    GAME_DURATION: 300000, // 5 minutes in ms
    FPS: 60,

    /* ===============================
       ARENA SETTINGS
    =============================== */

    LANES: 2,
    BLOCK_SIZE: 40, // logical grid block
    BRIDGE_POSITION_RATIO: 0.5, // middle of map

    /* ===============================
       TOWER SETTINGS
    =============================== */

    BASE_TOWER_HP: 1500,

    EXTRA_CLASSES: [
        "9C",
        "9D",
        "9E"
    ],

    HP_PER_EXTRA_CLASS: 100,

    getTowerHP() {
        return this.BASE_TOWER_HP +
               (this.EXTRA_CLASSES.length * this.HP_PER_EXTRA_CLASS);
    },

    /* ===============================
       DUDU SYSTEM
    =============================== */

    STARTING_DUDU: 15,
    MAX_DUDU: 20,
    DUDU_INTERVAL: 3000, // 3 seconds
    DUDU_FAST_INTERVAL: 1500, // for Duus building

    /* ===============================
       MOVEMENT SPEED SCALE
    =============================== */

    SPEED_SCALE: 1, // used to scale 40/50 speeds

    normalizeSpeed(rawSpeed) {
        // rawSpeed is like 40/50 from doc
        return (rawSpeed / 50) * this.SPEED_SCALE;
    },

    /* ===============================
       DAMAGE TYPES
    =============================== */

    DAMAGE_TYPES: {
        MELEE: "melee",
        RANGED: "ranged",
        MAGIC: "magic",
        SPLASH: "splash",
        POISON: "poison",
        TRUE: "true"
    },

    /* ===============================
       TROOP TYPES
    =============================== */

    TROOP_TYPES: {
        GROUND: "ground",
        AIR: "air",
        UNDERGROUND: "underground",
        BUILDING: "building"
    },

    /* ===============================
       TARGET PRIORITY
    =============================== */

    TARGET_PRIORITY: {
        AIR_FIRST: "air_first",
        GROUND_FIRST: "ground_first",
        TOWER_ONLY: "tower_only",
        ALL: "all"
    },

    /* ===============================
       STATUS EFFECTS
    =============================== */

    STATUS: {
        POISON: "poison",
        BUFF: "buff",
        NERF: "nerf",
        FROST: "frost",
        BURN: "burn"
    },

    /* ===============================
       AI SETTINGS
    =============================== */

    AI_DECISION_INTERVAL: 2000,
    AI_DEFENSE_THRESHOLD: 0.7,
    AI_ATTACK_THRESHOLD: 0.4,

    /* ===============================
       RESPONSIVE SETTINGS
    =============================== */

    MOBILE_BREAKPOINT: 768,

    isMobile() {
        return window.innerWidth <= this.MOBILE_BREAKPOINT;
    }

};
