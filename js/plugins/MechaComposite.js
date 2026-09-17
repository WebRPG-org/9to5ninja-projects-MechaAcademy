/*:
 * @target MZ
 * @plugindesc [v1.0.0] Mecha Composite Actor System
 * @author YourName
 *
 * Handles composite mecha actors combining pilot, copilot, and frame into single combat units.
 * Integrates with Academy Menu for seamless mecha management.
 */

(() => {
    'use strict';

    // Core composite mecha class
    class MechaComposite {
        constructor(pilotCardId = null, copilotCardId = null, frameCardId = null) {
            this.pilotCardId = pilotCardId;
            this.copilotCardId = copilotCardId;
            this.frameCardId = frameCardId;
            
            // Cached card data
            this.pilotCard = null;
            this.copilotCard = null;
            this.frameCard = null;
            
            // Composite stats
            this.compositeStats = null;
            this.isLoaded = false;
            
            // Equipment slots
            this.equipment = {
                weapons: [],
                armor: {
                    head: null,
                    torso: null,
                    arms: null,
                    legs: null
                },
                systems: {
                    generator: null,
                    cooler: null,
                    os: null
                }
            };
        }

        async initialize() {
            if (this.isLoaded) return;
            
            try {
                // Load card data
                if (this.pilotCardId) {
                    this.pilotCard = await window.DataLoader.loadItem(this.pilotCardId);
                }
                if (this.copilotCardId) {
                    this.copilotCard = await window.DataLoader.loadItem(this.copilotCardId);
                }
                if (this.frameCardId) {
                    this.frameCard = await window.DataLoader.loadItem(this.frameCardId);
                }
                
                this.calculateCompositeStats();
                this.isLoaded = true;
                
                console.log('MechaComposite initialized:', {
                    pilot: this.pilotCard?.name,
                    copilot: this.copilotCard?.name,
                    frame: this.frameCard?.name
                });
                
            } catch (error) {
                console.error('Failed to initialize MechaComposite:', error);
            }
        }

        calculateCompositeStats() {
            if (!this.frameCard) {
                this.compositeStats = this.getDefaultStats();
                return;
            }

            // Base stats from frame
            const baseStats = this.extractStatsFromCard(this.frameCard);
            
            // Pilot modifiers
            const pilotModifiers = this.pilotCard ? this.extractStatsFromCard(this.pilotCard) : {};
            
            // Copilot modifiers
            const copilotModifiers = this.copilotCard ? this.extractStatsFromCard(this.copilotCard) : {};
            
            // Calculate composite stats
            this.compositeStats = {
                // Core RPG Maker stats (params array indices)
                atk: this.calculateStat(baseStats.atk || 50, pilotModifiers.atk || 0, copilotModifiers.atk || 0),
                def: this.calculateStat(baseStats.def || 50, pilotModifiers.def || 0, copilotModifiers.def || 0),
                mat: this.calculateStat(baseStats.mat || 50, pilotModifiers.mat || 0, copilotModifiers.mat || 0),
                mdf: this.calculateStat(baseStats.mdf || 50, pilotModifiers.mdf || 0, copilotModifiers.mdf || 0),
                agi: this.calculateStat(baseStats.agi || 50, pilotModifiers.agi || 0, copilotModifiers.agi || 0),
                luk: this.calculateStat(baseStats.luk || 50, pilotModifiers.luk || 0, copilotModifiers.luk || 0),
                
                // Mecha-specific stats
                armor: this.calculateStat(baseStats.armor || 100, pilotModifiers.armor || 0, copilotModifiers.armor || 0),
                speed: this.calculateStat(baseStats.speed || 100, pilotModifiers.speed || 0, copilotModifiers.speed || 0),
                energyCapacity: this.calculateStat(baseStats.energyCapacity || 200, pilotModifiers.energyCapacity || 0, copilotModifiers.energyCapacity || 0),
                heatDissipation: this.calculateStat(baseStats.heatDissipation || 10, pilotModifiers.heatDissipation || 0, copilotModifiers.heatDissipation || 0),
                
                // Efficiency ratings (pilot affects these heavily)
                pilotEfficiency: this.pilotCard ? (pilotModifiers.efficiency || 1.0) : 0.8,
                copilotBonus: this.copilotCard ? (copilotModifiers.bonus || 0.1) : 0.0,
                
                // Composite effectiveness
                effectiveArmor: 0,
                effectiveSpeed: 0,
                mentalResource: 0,
                combatRating: 0
            };
            
            // Calculate derived stats
            this.compositeStats.effectiveArmor = Math.floor(
                this.compositeStats.armor * this.compositeStats.pilotEfficiency
            );
            
            this.compositeStats.effectiveSpeed = Math.floor(
                this.compositeStats.speed * (this.compositeStats.pilotEfficiency + this.compositeStats.copilotBonus)
            );
            
            this.compositeStats.mentalResource = Math.floor(
                (this.compositeStats.mat + this.compositeStats.mdf) * (1 + this.compositeStats.copilotBonus)
            );
            
            this.compositeStats.combatRating = Math.floor(
                (this.compositeStats.atk + this.compositeStats.def + this.compositeStats.agi) / 3 * 
                (this.compositeStats.pilotEfficiency + this.compositeStats.copilotBonus)
            );
        }

        extractStatsFromCard(card) {
            const stats = {};
            
            if (card && card.effects) {
                for (const effect of card.effects) {
                    if (effect.type === 'base_stats' && effect.stats) {
                        Object.assign(stats, effect.stats);
                    }
                    if (effect.type === 'stat_bonus' && effect.stats) {
                        for (const [stat, value] of Object.entries(effect.stats)) {
                            stats[stat] = (stats[stat] || 0) + value;
                        }
                    }
                }
            }
            
            // Convert pilot/copilot stats to mecha stats
            if (card && card.type === 'pilot') {
                // Map pilot skills to mecha effectiveness
                stats.efficiency = Math.min(1.0, (stats.piloting || 5) / 10); // 0.5 to 1.0 efficiency
                stats.atk = (stats.gunnery || 5) * 2;
                stats.agi = (stats.piloting || 5) * 2;
                stats.mat = (stats.systems || 5) * 2;
            }
            
            if (card && card.type === 'copilot') {
                // Map copilot skills to bonuses
                stats.bonus = Math.min(0.3, (stats.targeting || 5) / 20); // 0.25 to 0.3 bonus
                stats.def = (stats.evasion || 5) * 2;
                stats.mdf = (stats.systemSupport || 5) * 2;
            }
            
            return stats;
        }

        calculateStat(base, pilotMod, copilotMod) {
            return Math.max(1, Math.floor(base + pilotMod + copilotMod));
        }

        getDefaultStats() {
            return {
                atk: 30, def: 30, mat: 30, mdf: 30, agi: 30, luk: 30,
                armor: 50, speed: 50, energyCapacity: 100, heatDissipation: 5,
                pilotEfficiency: 0.5, copilotBonus: 0.0,
                effectiveArmor: 25, effectiveSpeed: 25, mentalResource: 30, combatRating: 15
            };
        }

        // Equipment management with hardpoint and requirement checking
        async equipWeapon(weaponCardId, hardpointSlot = null) {
            const weapon = await window.DataLoader.loadItem(weaponCardId);
            if (!weapon) return { success: false, error: 'Weapon not found' };
            
            // Check if we can equip this weapon
            const canEquip = this.canEquipWeapon(weapon, hardpointSlot);
            if (!canEquip.success) {
                return canEquip;
            }
            
            // Add weapon to equipment
            this.equipment.weapons.push({
                ...weapon,
                hardpointSlot: canEquip.assignedSlot
            });
            
            this.calculateCompositeStats(); // Recalculate with equipment
            return { success: true, assignedSlot: canEquip.assignedSlot };
        }

        canEquipWeapon(weapon, preferredSlot = null) {
            if (!this.frameCard) {
                return { success: false, error: 'No frame equipped' };
            }

            // Get frame hardpoints
            const hardpoints = this.getFrameHardpoints();
            if (!hardpoints) {
                return { success: false, error: 'Frame has no hardpoint data' };
            }

            // Check weight and energy requirements
            const requirements = weapon.requirements || {};
            const currentStats = this.compositeStats || this.getDefaultStats();
            
            if (requirements.weightRequirement && (weapon.weight || 0) > currentStats.weightLimit - this.getCurrentWeight()) {
                return { success: false, error: 'Insufficient weight capacity' };
            }
            
            if (requirements.energyRequirement && (weapon.energyDrain || 0) > currentStats.energyCapacity - this.getCurrentEnergyDrain()) {
                return { success: false, error: 'Insufficient energy capacity' };
            }

            // Check frame class compatibility
            if (requirements.frameClass) {
                const frameClass = this.frameCard.subtype;
                const allowedClasses = Array.isArray(requirements.frameClass) ? requirements.frameClass : [requirements.frameClass];
                if (!allowedClasses.includes(frameClass)) {
                    return { success: false, error: `Weapon requires ${allowedClasses.join(' or ')} frame` };
                }
            }

            // Find available hardpoint slot
            const requiredSlotType = requirements.hardpointType || 'torso';
            const availableSlots = this.getAvailableHardpoints(requiredSlotType);
            
            if (availableSlots.length === 0) {
                return { success: false, error: `No available ${requiredSlotType} hardpoints` };
            }

            // Use preferred slot if available, otherwise use first available
            const assignedSlot = preferredSlot && availableSlots.includes(preferredSlot) ? preferredSlot : availableSlots[0];
            
            return { success: true, assignedSlot };
        }

        getFrameHardpoints() {
            if (!this.frameCard || !this.frameCard.effects) return null;
            
            for (const effect of this.frameCard.effects) {
                if (effect.type === 'hardpoints') {
                    return effect.hardpoints;
                }
            }
            return null;
        }

        getAvailableHardpoints(slotType) {
            const hardpoints = this.getFrameHardpoints();
            if (!hardpoints || !hardpoints[slotType]) return [];

            const maxSlots = hardpoints[slotType];
            const usedSlots = this.equipment.weapons.filter(w => w.hardpointSlot && w.hardpointSlot.startsWith(slotType)).length;
            
            const available = [];
            for (let i = usedSlots; i < maxSlots; i++) {
                available.push(`${slotType}_${i + 1}`);
            }
            
            return available;
        }

        getCurrentWeight() {
            let totalWeight = 0;
            
            // Weapons
            this.equipment.weapons.forEach(weapon => {
                totalWeight += weapon.weight || 0;
            });
            
            // Armor
            Object.values(this.equipment.armor).forEach(armor => {
                if (armor) totalWeight += armor.weight || 0;
            });
            
            // Systems
            Object.values(this.equipment.systems).forEach(system => {
                if (system) totalWeight += system.weight || 0;
            });
            
            return totalWeight;
        }

        getCurrentEnergyDrain() {
            let totalDrain = 0;
            
            // Weapons
            this.equipment.weapons.forEach(weapon => {
                totalDrain += weapon.energyDrain || 0;
            });
            
            // Systems
            Object.values(this.equipment.systems).forEach(system => {
                if (system) totalDrain += system.energyDrain || 0;
            });
            
            return totalDrain;
        }

        async equipArmor(slot, armorCardId) {
            if (!['head', 'torso', 'arms', 'legs'].includes(slot)) return false;
            
            const armor = await window.DataLoader.loadItem(armorCardId);
            if (armor) {
                this.equipment.armor[slot] = armor;
                this.calculateCompositeStats(); // Recalculate with equipment
                return true;
            }
            return false;
        }

        async equipSystem(slot, systemCardId) {
            if (!['generator', 'cooler', 'os'].includes(slot)) return false;
            
            const system = await window.DataLoader.loadItem(systemCardId);
            if (system) {
                this.equipment.systems[slot] = system;
                this.calculateCompositeStats(); // Recalculate with equipment
                return true;
            }
            return false;
        }

        // Get display information
        getDisplayInfo() {
            return {
                name: this.getCompositeName(),
                pilot: this.pilotCard?.name || 'No Pilot',
                copilot: this.copilotCard?.name || 'No Copilot',
                frame: this.frameCard?.name || 'No Frame',
                stats: this.compositeStats || this.getDefaultStats(),
                equipment: this.equipment,
                isReady: this.isLoaded && this.pilotCard && this.frameCard
            };
        }

        getCompositeName() {
            if (this.frameCard && this.pilotCard) {
                return `${this.frameCard.name} (${this.pilotCard.name})`;
            }
            if (this.frameCard) {
                return this.frameCard.name;
            }
            return 'Unnamed Mecha';
        }

        // Convert to RPG Maker Actor format for combat
        toActorData(actorId = 1) {
            const stats = this.compositeStats || this.getDefaultStats();
            
            return {
                id: actorId,
                name: this.getCompositeName(),
                nickname: '',
                profile: `Pilot: ${this.pilotCard?.name || 'None'}, Copilot: ${this.copilotCard?.name || 'None'}`,
                classId: 1, // Mecha class
                characterName: 'Actor1', // Default sprite
                characterIndex: 0,
                faceName: 'Actor1', // Default face
                faceIndex: 0,
                initialLevel: 1,
                exp: 0,
                params: [
                    [100, 100], // HP - based on armor and frame
                    [50, 50],   // MP - based on energy capacity
                    [stats.atk, stats.atk], // ATK
                    [stats.def, stats.def], // DEF
                    [stats.mat, stats.mat], // MAT
                    [stats.mdf, stats.mdf], // MDF
                    [stats.agi, stats.agi], // AGI
                    [stats.luk, stats.luk]  // LUK
                ]
            };
        }
    }

    // Mecha Composite Manager
    class MechaCompositeManager {
        constructor() {
            this.activeMecha = null;
            this.mechaRoster = [];
            this.maxRosterSize = 6;
        }

        async createMecha(pilotCardId, copilotCardId, frameCardId) {
            const mecha = new MechaComposite(pilotCardId, copilotCardId, frameCardId);
            await mecha.initialize();
            
            if (this.mechaRoster.length < this.maxRosterSize) {
                this.mechaRoster.push(mecha);
                
                // Set as active if it's the first mecha
                if (!this.activeMecha) {
                    this.setActiveMecha(0);
                }
                
                return mecha;
            }
            
            throw new Error('Mecha roster is full');
        }

        setActiveMecha(index) {
            if (index >= 0 && index < this.mechaRoster.length) {
                this.activeMecha = this.mechaRoster[index];
                this.updatePartyActor();
                return true;
            }
            return false;
        }

        updatePartyActor() {
            try {
                console.log('UpdatePartyActor called');
                
                // Prevent infinite recursion
                if (this._updatingPartyActor) {
                    console.warn('UpdatePartyActor already in progress, skipping to prevent recursion');
                    return;
                }
                this._updatingPartyActor = true;
                
                if (!this.activeMecha) {
                    console.warn('No active mecha for party actor update');
                    this._updatingPartyActor = false;
                    return;
                }
                
                console.log('Updating party actor directly...');
                
                // Override Game_Actor methods for the composite
                if ($gameParty._actors.length > 0) {
                    console.log('Updating party actor...');
                    const actor = $gameActors.actor(1);
                    if (actor) {
                        // Update actor parameters with composite stats
                        const stats = this.activeMecha.compositeStats;
                        if (stats) {
                            console.log('Updating actor stats...');
                            actor._params = [
                                Math.max(100, stats.armor * 2), // HP from armor
                                Math.max(50, stats.energyCapacity / 4), // MP from energy
                                stats.atk,
                                stats.def,
                                stats.mat,
                                stats.mdf,
                                stats.agi,
                                stats.luk
                            ];
                            
                            // Update name and profile
                            console.log('Updating actor name and profile...');
                            actor._name = this.activeMecha.getCompositeName();
                            actor._profile = `Pilot: ${this.activeMecha.pilotCard?.name || 'None'}, Copilot: ${this.activeMecha.copilotCard?.name || 'None'}`;
                            console.log('Actor update completed');
                        } else {
                            console.warn('No composite stats available');
                        }
                    } else {
                        console.warn('No actor found at index 1');
                    }
                } else {
                    console.warn('No actors in party');
                }
            } catch (error) {
                console.error('Error in updatePartyActor:', error);
            } finally {
                this._updatingPartyActor = false;
                console.log('UpdatePartyActor guard released');
            }
        }

        getActiveMecha() {
            return this.activeMecha;
        }

        getMechaRoster() {
            return this.mechaRoster;
        }

        // Add current mecha configuration as a new preset
        addMechaPreset(sourceMecha) {
            try {
                // Create a deep copy of the current mecha configuration
                const presetMecha = new MechaComposite();
                
                // Copy all components
                if (sourceMecha.pilotCard) {
                    presetMecha.pilotCard = { ...sourceMecha.pilotCard };
                    presetMecha.pilotCardId = sourceMecha.pilotCardId;
                }
                if (sourceMecha.copilotCard) {
                    presetMecha.copilotCard = { ...sourceMecha.copilotCard };
                    presetMecha.copilotCardId = sourceMecha.copilotCardId;
                }
                if (sourceMecha.frameCard) {
                    presetMecha.frameCard = { ...sourceMecha.frameCard };
                    presetMecha.frameCardId = sourceMecha.frameCardId;
                }
                
                // Copy equipment
                presetMecha.weapons = [...sourceMecha.weapons];
                presetMecha.armor = [...sourceMecha.armor];
                presetMecha.systems = [...sourceMecha.systems];
                
                // Copy stats
                presetMecha.calculateCompositeStats();
                
                // Generate a unique name for the preset
                const frameType = sourceMecha.frameCard?.name || 'Custom';
                const presetName = `${frameType} Config ${this.mechaRoster.length + 1}`;
                presetMecha.presetName = presetName;
                
                // Add to roster
                this.mechaRoster.push(presetMecha);
                
                console.log(`✅ Mecha preset saved: ${presetName}`);
                return true;
            } catch (error) {
                console.error('❌ Failed to save mecha preset:', error);
                return false;
            }
        }

        async createDefaultMecha() {
            // Create a basic mecha for testing
            return await this.createMecha(
                'CRD_PLT_VET_ALEX001',
                'CRD_CPT_AI_ARIA001',
                'CRD_FRM_LT_SCOUT001'
            );
        }

        // Component swapping methods
        async swapPilot(mechaIndex, newPilotCardId) {
            try {
                console.log(`SwapPilot called: mechaIndex=${mechaIndex}, newPilotCardId=${newPilotCardId}`);
                
                if (mechaIndex < 0 || mechaIndex >= this.mechaRoster.length) {
                    console.warn('Invalid mecha index:', mechaIndex);
                    return false;
                }
                
                const mecha = this.mechaRoster[mechaIndex];
                if (!mecha) {
                    console.warn('No mecha found at index:', mechaIndex);
                    return false;
                }
                
                // Check if trying to equip the same pilot
                if (mecha.pilotCardId === newPilotCardId) {
                    console.log('Pilot already equipped, skipping swap');
                    return true; // Return true since it's already equipped
                }
                
                console.log('Loading pilot card...');
                mecha.pilotCardId = newPilotCardId;
                mecha.pilotCard = newPilotCardId ? await window.DataLoader.loadItem(newPilotCardId) : null;
                
                console.log('Calculating composite stats...');
                mecha.calculateCompositeStats();
                
                if (mecha === this.activeMecha) {
                    console.log('Updating party actor...');
                    this.updatePartyActor();
                }
                
                console.log('SwapPilot completed successfully');
                return true;
            } catch (error) {
                console.error('Error in swapPilot:', error);
                return false;
            }
        }

        async swapCopilot(mechaIndex, newCopilotCardId) {
            if (mechaIndex < 0 || mechaIndex >= this.mechaRoster.length) return false;
            
            const mecha = this.mechaRoster[mechaIndex];
            mecha.copilotCardId = newCopilotCardId;
            mecha.copilotCard = newCopilotCardId ? await window.DataLoader.loadItem(newCopilotCardId) : null;
            mecha.calculateCompositeStats();
            
            if (mecha === this.activeMecha) {
                this.updatePartyActor();
            }
            
            return true;
        }

        async swapFrame(mechaIndex, newFrameCardId) {
            if (mechaIndex < 0 || mechaIndex >= this.mechaRoster.length) return false;
            
            const mecha = this.mechaRoster[mechaIndex];
            mecha.frameCardId = newFrameCardId;
            mecha.frameCard = newFrameCardId ? await window.DataLoader.loadItem(newFrameCardId) : null;
            
            // Clear equipment that may no longer be compatible
            mecha.equipment.weapons = [];
            
            mecha.calculateCompositeStats();
            
            if (mecha === this.activeMecha) {
                this.updatePartyActor();
            }
            
            return true;
        }

        // Get available components for selection
        getAvailablePilots() {
            return [
                'CRD_PLT_VET_ALEX001',
                'CRD_PLT_ACE_MAYA001'
            ];
        }

        getAvailableCopilots() {
            return [
                'CRD_CPT_AI_ARIA001',
                'CRD_CPT_AI_NEXUS001'
            ];
        }

        getAvailableFrames() {
            return [
                // Light frames
                'CRD_FRM_LT_SCOUT001',
                'CRD_FRM_LT_INTERCEPT001',
                'CRD_FRM_LT_STEALTH001',
                // Medium frames
                'CRD_FRM_MD_ASSAULT001',
                'CRD_FRM_MD_ASSAULT002',
                'CRD_FRM_MD_SUPPORT001',
                'CRD_FRM_MD_ENGINEER001',
                'CRD_FRM_MD_SPECIAL001',
                // Heavy frames
                'CRD_FRM_HV_TANK001',
                'CRD_FRM_HV_TANK002',
                'CRD_FRM_HV_SIEGE001',
                'CRD_FRM_HV_FORTRESS001'
            ];
        }

        getFramesByClass() {
            return {
                light: [
                    'CRD_FRM_LT_SCOUT001',
                    'CRD_FRM_LT_INTERCEPT001',
                    'CRD_FRM_LT_STEALTH001'
                ],
                medium: [
                    'CRD_FRM_MD_ASSAULT001',
                    'CRD_FRM_MD_ASSAULT002',
                    'CRD_FRM_MD_SUPPORT001',
                    'CRD_FRM_MD_ENGINEER001',
                    'CRD_FRM_MD_SPECIAL001'
                ],
                heavy: [
                    'CRD_FRM_HV_TANK001',
                    'CRD_FRM_HV_TANK002',
                    'CRD_FRM_HV_SIEGE001',
                    'CRD_FRM_HV_FORTRESS001'
                ]
            };
        }

        getAvailableWeapons() {
            return [
                'CRD_WPN_BM_RIFLE001',
                'CRD_WPN_PH_AUTOCANNON001',
                'CRD_WPN_MS_POD001',
                'CRD_WPN_BM_HEAVYPLASMA001',
                'CRD_WPN_PH_HEAVYAUTO001'
            ];
        }
    }

    // Deck Management System
    class CombatDeck {
        constructor(mechaComposite) {
            this.mecha = mechaComposite;
            this.deck = [];
            this.hand = [];
            this.discardPile = [];
            this.maxHandSize = 5;
            this.buildDeck();
        }

        async buildDeck() {
            this.deck = [];
            // Add weapon skills
            for (const weapon of this.mecha.equipment.weapons) {
                if (weapon.effects) {
                    for (const effect of weapon.effects) {
                        if (effect.type === 'provides_skills') {
                            for (const skillId of effect.skills) {
                                const skill = await window.DataLoader.loadItem(skillId);
                                if (skill) {
                                    this.deck.push(skill);
                                }
                            }
                        }
                    }
                }
            }
            // Add pilot skills
            if (this.mecha.pilotCard && this.mecha.pilotCard.learned_skills) {
                for (const skillId of this.mecha.pilotCard.learned_skills) {
                    const skill = await window.DataLoader.loadItem(skillId);
                    if (skill) {
                        this.deck.push(skill);
                    }
                }
            }
            // Add copilot skills
            if (this.mecha.copilotCard && this.mecha.copilotCard.learned_skills) {
                for (const skillId of this.mecha.copilotCard.learned_skills) {
                    const skill = await window.DataLoader.loadItem(skillId);
                    if (skill) {
                        this.deck.push(skill);
                    }
                }
            }
            // Add basic actions if deck too small
            while (this.deck.length < 10) {
                this.deck.push(this.createBasicAction());
            }
            this.shuffleDeck();
            console.log(`Combat deck built: ${this.deck.length} cards`);
        }

        createBasicAction() {
            return {
                id: 'BASIC_MOVE',
                name: 'Move',
                type: 'basic_action',
                costs: { machine: 10, actions: 1 },
                effects: [{ type: 'movement', value: 'pilot.piloting * 2' }]
            };
        }

        shuffleDeck() {
            for (let i = this.deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
            }
        }

        drawHand() {
            this.hand = [];
            
            // Reshuffle discard pile into deck if deck is empty
            if (this.deck.length === 0 && this.discardPile.length > 0) {
                console.log('[COMBAT_DECK] Deck empty, reshuffling discard pile:', this.discardPile.length, 'cards');
                this.deck = [...this.discardPile];
                this.discardPile = [];
                this.shuffleDeck();
            }
            
            // Draw cards from deck
            for (let i = 0; i < this.maxHandSize && this.deck.length > 0; i++) {
                this.hand.push(this.deck.pop());
            }
            
            console.log('[COMBAT_DECK] Hand drawn:', this.hand.length, 'cards, deck remaining:', this.deck.length);
        }

        playCard(cardIndex) {
            if (cardIndex >= 0 && cardIndex < this.hand.length) {
                const card = this.hand.splice(cardIndex, 1)[0];
                this.discardPile.push(card);
                return card;
            }
            return null;
        }

        canPlayCard(card) {
            const costs = card.costs || {};
            const currentResources = this.mecha.currentResources || this.getDefaultResources();
            // Check all resource requirements
            for (const [resource, cost] of Object.entries(costs)) {
                if (resource === 'actions') {
                    if (cost > this.mecha.actionsRemaining) return false;
                } else if (currentResources[resource] !== undefined) {
                    if (currentResources[resource] < cost) return false;
                }
            }
            return true;
        }

        getDefaultResources() {
            return {
                mental: 60,
                signal: 48,
                machine: 220,
                heat: 0
            };
        }
    }

    // Add to MechaComposite class
    MechaComposite.prototype.initializeDeck = function() {
        this.combatDeck = new CombatDeck(this);
    };

    MechaComposite.prototype.getCurrentResources = function() {
        if (!this.currentResources) {
            const stats = this.compositeStats || this.getDefaultStats();
            this.currentResources = {
                mental: this.pilotCard ? this.pilotCard.effects.find(e => e.type === 'stat_bonus')?.stats?.piloting * 15 || 60 : 60,
                signal: this.copilotCard ? this.copilotCard.effects.find(e => e.type === 'stat_bonus')?.stats?.systemSupport * 12 || 48 : 48,
                machine: stats.energyCapacity || 220,
                heat: 0
            };
            this.actionsRemaining = this.getMaxActions();
        }
        return this.currentResources;
    };

    MechaComposite.prototype.getMaxActions = function() {
        const heatPercent = this.currentResources ? (this.currentResources.heat / (this.compositeStats?.heatCapacity || 60)) : 0;
        if (heatPercent < 0.25) return 3;      // Cold
        if (heatPercent < 0.75) return 2;      // Warm
        if (heatPercent < 0.95) return 1;      // Hot
        return 0;                              // Critical overheat
    };

    MechaComposite.prototype.regenerateResources = function() {
        if (!this.currentResources) this.getCurrentResources();
        const stats = this.compositeStats || this.getDefaultStats();
        const overheatPenalty = this.currentResources.heat >= (stats.heatCapacity * 0.95) ? 0.5 : 1.0;
        // Regenerate energies
        this.currentResources.mental = Math.min(
            this.currentResources.mental + Math.floor(30 * overheatPenalty),
            this.pilotCard ? this.pilotCard.effects.find(e => e.type === 'stat_bonus')?.stats?.piloting * 15 || 60 : 60
        );
        this.currentResources.signal = Math.min(
            this.currentResources.signal + Math.floor(25 * overheatPenalty),
            this.copilotCard ? this.copilotCard.effects.find(e => e.type === 'stat_bonus')?.stats?.systemSupport * 12 || 48 : 48
        );
        this.currentResources.machine = Math.min(
            this.currentResources.machine + Math.floor((stats.energyRegen || 25) * overheatPenalty),
            stats.energyCapacity || 220
        );
        // Cool down
        this.currentResources.heat = Math.max(0, this.currentResources.heat - (stats.heatDissipation || 12));
        // Reset actions
        this.actionsRemaining = this.getMaxActions();
    };

    // Global manager instance
    window.MechaCompositeManager = new MechaCompositeManager();
    window.MechaComposite = MechaComposite;
    window.CombatDeck = CombatDeck;

    // Initialize default mecha when game starts
    const originalStart = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        originalStart.call(this);
        setTimeout(async () => {
            try {
                await window.MechaCompositeManager.createDefaultMecha();
                console.log('Default mecha created and activated');
            } catch (error) {
                console.error('Failed to create default mecha:', error);
            }
        }, 2000);
    };
})();