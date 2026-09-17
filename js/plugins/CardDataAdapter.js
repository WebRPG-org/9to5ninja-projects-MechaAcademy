/*:
 * @target MZ
 * @plugindesc [v1.0.0] Card Data Adapter - JSON to RPG Maker Translator
 * @author YourName
 *
 * Translates JSON card data to RPG Maker format on-demand.
 * Acts as a bridge between the flexible card system and RPG Maker's engine.
 */

(() => {
    'use strict';

    class CardDataAdapter {
        constructor() {
            this.translationCache = new Map();
            this.batchCache = new Map();
            this.isInitialized = false;
        }

        // Initialize the adapter and hook into RPG Maker's systems
        initialize() {
            if (this.isInitialized) return;
            
            console.log('CardDataAdapter: Initializing translator system...');
            this.hookIntoEngine();
            this.isInitialized = true;
            console.log('CardDataAdapter: Translation system ready');
        }

        // Hook into RPG Maker's data access methods
        hookIntoEngine() {
            // Store original methods
            this.originalGameActionItem = Game_Action.prototype.item;
            
            // Override Game_Action.prototype.item for card translation
            const adapter = this;
            Game_Action.prototype.item = function() {
                if (adapter.isCardId(this._item?.itemId)) {
                    // Return promise-wrapped translation for cards
                    return adapter.translateCardSync(this._item.itemId);
                }
                return adapter.originalGameActionItem.call(this);
            };

            console.log('CardDataAdapter: Engine hooks installed');
        }

        // Check if an ID follows card patterns (B0015, W001, card_pilot_alex, etc.)
        isCardId(id) {
            if (!id || typeof id !== 'string') return false;
            
            // Pattern 1: Single letter + numbers (B0015, W001)
            if (/^[A-Z]\d+$/.test(id)) return true;
            
            // Pattern 2: card_ prefix (card_pilot_alex_carter, card_equipment_light_beam_rifle)
            if (id.startsWith('card_')) return true;
            
            return false;
        }

        // Synchronous translation (returns cached or placeholder)
        translateCardSync(cardId) {
            // Return cached translation if available
            if (this.translationCache.has(cardId)) {
                return this.translationCache.get(cardId);
            }

            // Return placeholder while async loading happens
            const placeholder = this.createPlaceholder(cardId);
            
            // Start async translation in background
            this.translateCard(cardId).then(translated => {
                // Update cache when translation completes
                this.translationCache.set(cardId, translated);
            }).catch(error => {
                console.error(`CardDataAdapter: Failed to translate ${cardId}:`, error);
            });

            return placeholder;
        }

        // Main translation method (async)
        async translateCard(cardId) {
            try {
                // Check cache first
                if (this.translationCache.has(cardId)) {
                    return this.translationCache.get(cardId);
                }

                console.log(`CardDataAdapter: Translating card ${cardId}...`);

                // Load JSON card data
                const cardData = await window.DataLoader?.loadItem(cardId);
                if (!cardData) {
                    throw new Error(`Card data not found: ${cardId}`);
                }

                // Translate based on card type
                let translated;
                if (cardData.type === 'equipment' && cardData.subtype === 'weapon') {
                    translated = this.translateWeaponCard(cardData);
                } else if (cardData.type === 'pilot') {
                    translated = this.translatePilotCard(cardData);
                } else if (cardData.type === 'copilot') {
                    translated = this.translateCopilotCard(cardData);
                } else {
                    translated = this.translateGenericCard(cardData);
                }

                // Cache the translation
                this.translationCache.set(cardId, translated);
                console.log(`CardDataAdapter: Successfully translated ${cardId}`);
                
                return translated;

            } catch (error) {
                console.error(`CardDataAdapter: Translation failed for ${cardId}:`, error);
                return this.createErrorCard(cardId, error.message);
            }
        }

        // Translate weapon cards to RPG Maker skill format
        translateWeaponCard(cardData) {
            const effects = [];
            
            // Convert damage effects
            if (cardData.effects) {
                for (const effect of cardData.effects) {
                    if (effect.type === 'damage') {
                        effects.push({
                            code: 11, // Damage effect
                            dataId: 0,
                            value1: effect.value || 0,
                            value2: 0
                        });
                    }
                }
            }

            return {
                id: cardData.id,
                name: cardData.name,
                description: cardData.description || '',
                iconIndex: this.mapCardTypeToIcon(cardData.subtype),
                mpCost: cardData.costs?.mental || 0,
                tpCost: cardData.costs?.digital || 0,
                scope: 1, // Single enemy
                occasion: 1, // Battle only
                speed: 0,
                successRate: 95,
                repeats: 1,
                tpGain: 0,
                hitType: 0, // Physical
                animationId: this.mapWeaponToAnimation(cardData.subtype),
                damage: {
                    type: cardData.effects?.some(e => e.type === 'damage') ? 1 : 0,
                    elementId: 0,
                    formula: this.buildDamageFormula(cardData),
                    variance: 20,
                    critical: true
                },
                effects: effects,
                note: JSON.stringify({
                    cardType: 'weapon',
                    energyCost: cardData.costs?.energy || 0,
                    heatGeneration: cardData.heatGeneration || 0,
                    weight: cardData.weight || 0,
                    requirements: cardData.requirements || {}
                })
            };
        }

        // Translate pilot cards (for skill/ability representation)
        translatePilotCard(cardData) {
            return {
                id: cardData.id,
                name: cardData.name,
                description: cardData.description || '',
                iconIndex: 1, // Pilot icon
                mpCost: 0,
                tpCost: 0,
                scope: 0, // None
                occasion: 3, // Never (passive)
                effects: [],
                note: JSON.stringify({
                    cardType: 'pilot',
                    skills: cardData.skills || {},
                    efficiency: cardData.efficiency || 1.0
                })
            };
        }

        // Translate copilot cards
        translateCopilotCard(cardData) {
            return {
                id: cardData.id,
                name: cardData.name,
                description: cardData.description || '',
                iconIndex: 2, // Copilot icon
                mpCost: 0,
                tpCost: 0,
                scope: 0, // None
                occasion: 3, // Never (passive)
                effects: [],
                note: JSON.stringify({
                    cardType: 'copilot',
                    skills: cardData.skills || {},
                    bonus: cardData.bonus || 0.1
                })
            };
        }

        // Generic card translation
        translateGenericCard(cardData) {
            return {
                id: cardData.id,
                name: cardData.name,
                description: cardData.description || '',
                iconIndex: 0,
                mpCost: cardData.costs?.mental || 0,
                tpCost: cardData.costs?.digital || 0,
                scope: 0,
                occasion: 3,
                effects: [],
                note: JSON.stringify({
                    cardType: cardData.type,
                    originalData: cardData
                })
            };
        }

        // Create placeholder while loading
        createPlaceholder(cardId) {
            return {
                id: cardId,
                name: `Loading ${cardId}...`,
                description: 'Card data loading...',
                iconIndex: 0,
                mpCost: 0,
                tpCost: 0,
                scope: 0,
                occasion: 3,
                effects: [],
                note: JSON.stringify({ cardType: 'loading', originalId: cardId })
            };
        }

        // Create error card for failed translations
        createErrorCard(cardId, errorMessage) {
            return {
                id: cardId,
                name: `Error: ${cardId}`,
                description: `Failed to load: ${errorMessage}`,
                iconIndex: 0,
                mpCost: 0,
                tpCost: 0,
                scope: 0,
                occasion: 3,
                effects: [],
                note: JSON.stringify({ cardType: 'error', error: errorMessage })
            };
        }

        // Map card types to icon indices
        mapCardTypeToIcon(subtype) {
            const iconMap = {
                'weapon': 96,
                'beam': 97,
                'physical': 98,
                'armor': 99,
                'system': 100
            };
            return iconMap[subtype] || 0;
        }

        // Map weapons to animation IDs
        mapWeaponToAnimation(subtype) {
            const animationMap = {
                'beam': 67, // Laser animation
                'physical': 1, // Physical attack
                'missile': 66 // Explosion
            };
            return animationMap[subtype] || 1;
        }

        // Build damage formula from card data
        buildDamageFormula(cardData) {
            if (cardData.effects) {
                for (const effect of cardData.effects) {
                    if (effect.type === 'damage' && effect.formula) {
                        return effect.formula;
                    }
                    if (effect.type === 'damage' && effect.value) {
                        return `${effect.value} + a.atk * 2 - b.def`;
                    }
                }
            }
            return "a.atk * 2 - b.def"; // Default formula
        }

        // Clear cache (for development/testing)
        clearCache() {
            this.translationCache.clear();
            this.batchCache.clear();
            console.log('CardDataAdapter: Cache cleared');
        }

        // Get cache statistics
        getCacheStats() {
            return {
                translationCacheSize: this.translationCache.size,
                batchCacheSize: this.batchCache.size,
                cachedCards: Array.from(this.translationCache.keys())
            };
        }
    }

    // Create global instance
    window.CardDataAdapter = new CardDataAdapter();

    // Auto-initialize when DataLoader is ready
    const checkInitialization = () => {
        if (window.DataLoader && !window.CardDataAdapter.isInitialized) {
            window.CardDataAdapter.initialize();
        } else if (!window.DataLoader) {
            // Retry in 100ms if DataLoader not ready
            setTimeout(checkInitialization, 100);
        }
    };

    // Start initialization check
    checkInitialization();

    // Expose for debugging
    window.debugCardAdapter = () => {
        console.log('CardDataAdapter Stats:', window.CardDataAdapter.getCacheStats());
    };

})();