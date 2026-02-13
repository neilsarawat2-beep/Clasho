/* ============================================
   CLASS WAR – DECK BUILDER SYSTEM
   ============================================ */

import { CHARACTER_CARDS, BUILDING_CARDS, POTION_CARDS } from "./cards.js";

/* =====================================================
   DECK CLASS
===================================================== */

export class DeckBuilder {

    constructor() {

        this.selectedCharacters = [];
        this.selectedPotions = [];
        this.selectedBuildings = [];

        this.MAX_CHARACTERS = 5;
        this.MAX_POTIONS = 3;
        this.MAX_BUILDINGS = 2;
    }

    /* =====================================================
       ADD CARD
    ===================================================== */

    addCard(cardId, type) {

        if (type === "character") {

            if (this.selectedCharacters.length >= this.MAX_CHARACTERS)
                return false;

            const card = Object.values(CHARACTER_CARDS)
                .find(c => c.id === cardId);

            if (!card) return false;

            if (!this.selectedCharacters.includes(card))
                this.selectedCharacters.push(card);

            return true;
        }

        if (type === "potion") {

            if (this.selectedPotions.length >= this.MAX_POTIONS)
                return false;

            const card = Object.values(POTION_CARDS)
                .find(c => c.id === cardId);

            if (!card) return false;

            if (!this.selectedPotions.includes(card))
                this.selectedPotions.push(card);

            return true;
        }

        if (type === "building") {

            if (this.selectedBuildings.length >= this.MAX_BUILDINGS)
                return false;

            const card = Object.values(BUILDING_CARDS)
                .find(c => c.id === cardId);

            if (!card) return false;

            if (!this.selectedBuildings.includes(card))
                this.selectedBuildings.push(card);

            return true;
        }

        return false;
    }

    /* =====================================================
       REMOVE CARD
    ===================================================== */

    removeCard(cardId, type) {

        if (type === "character") {
            this.selectedCharacters =
                this.selectedCharacters.filter(c => c.id !== cardId);
        }

        if (type === "potion") {
            this.selectedPotions =
                this.selectedPotions.filter(c => c.id !== cardId);
        }

        if (type === "building") {
            this.selectedBuildings =
                this.selectedBuildings.filter(c => c.id !== cardId);
        }
    }

    /* =====================================================
       VALIDATION
    ===================================================== */

    isValidDeck() {

        return (
            this.selectedCharacters.length === this.MAX_CHARACTERS &&
            this.selectedPotions.length === this.MAX_POTIONS &&
            this.selectedBuildings.length === this.MAX_BUILDINGS
        );
    }

    /* =====================================================
       EXPORT DECK
    ===================================================== */

    exportDeck() {

        if (!this.isValidDeck())
            return null;

        return {
            characters: this.selectedCharacters,
            potions: this.selectedPotions,
            buildings: this.selectedBuildings
        };
    }

    /* =====================================================
       RESET
    ===================================================== */

    reset() {
        this.selectedCharacters = [];
        this.selectedPotions = [];
        this.selectedBuildings = [];
    }
}
