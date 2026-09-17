/*:
 * @target MZ
 * @plugindesc [v1.0.0] Card Type System - Standardized Card Definitions
 * @author YourName
 *
 * Defines the complete card type system with validation and categorization.
 * Provides type-safe card creation and validation.
 */

(() => {
    'use strict';

    class CardTypeSystem {
        constructor() {
            this.cardTypes = new Map();
            this.subcategories = new Map();
            this.validationRules = new Map();
            this.setupCardTypes();
        }

        setupCardTypes() {
            // Define main card categories
            this.cardTypes.set('PLT', {
                name: 'Pilot',
                description: 'Human pilots with skills and experience',
                subcategories: ['VET', 'ACE', 'RKE', 'ELT'],
                directory: 'pilots',
                requiredFields: ['name', 'skills', 'efficiency', 'experience'],
                optionalFields: ['background', 'specialties', 'traits']
            });

            this.cardTypes.set('CPT', {
                name: 'Copilot', 
                description: 'AI or human copilots providing support',
                subcategories: ['AI', 'HU'],
                directory: 'copilots',
                requiredFields: ['name', 'skills', 'bonus', 'type'],
                optionalFields: ['personality', 'specializations']
            });

            this.cardTypes.set('FRM', {
                name: 'Frame',
                description: 'Mecha chassis and structural systems',
                subcategories: ['LT', 'MD', 'HV', 'SP'],
                directory: 'frames',
                requiredFields: ['name', 'stats', 'hardpoints', 'weight_limit'],
                optionalFields: ['special_abilities', 'restrictions']
            });

            this.cardTypes.set('WPN', {
                name: 'Weapon',
                description: 'Combat weapons and weapon systems',
                subcategories: ['BM', 'PH', 'MS', 'EN', 'EX'],
                directory: 'weapons',
                requiredFields: ['name', 'damage', 'energy_cost', 'weight'],
                optionalFields: ['heat_generation', 'special_effects', 'ammo']
            });

            this.cardTypes.set('ARM', {
                name: 'Armor',
                description: 'Protective equipment and shielding',
                subcategories: ['HD', 'TR', 'AR', 'LG', 'SH'],
                directory: 'armor',
                requiredFields: ['name', 'armor_value', 'weight', 'slot'],
                optionalFields: ['special_properties', 'resistances']
            });

            this.cardTypes.set('SYS', {
                name: 'System',
                description: 'Internal mecha systems and components',
                subcategories: ['GN', 'CL', 'OS', 'SN', 'CM'],
                directory: 'systems',
                requiredFields: ['name', 'function', 'energy_cost', 'weight'],
                optionalFields: ['heat_generation', 'prerequisites']
            });

            this.cardTypes.set('SKL', {
                name: 'Skill',
                description: 'Pilot and copilot skills and abilities',
                subcategories: ['PLT', 'CPT'],
                directory: 'skills',
                requiredFields: ['name', 'effect', 'type'],
                optionalFields: ['prerequisites', 'cooldown', 'cost']
            });

            // Add weapon skill card type
            this.cardTypes.set('SKL_WPN', {
                name: 'Weapon Skill',
                description: 'Weapon skill cards for equipment',
                subcategories: ['BEAM', 'BALLISTIC', 'MISSILE', 'MELEE'],
                directory: 'equipment-skills/weapons',
                requiredFields: ['name', 'costs', 'effects', 'type'],
                optionalFields: ['requirements', 'tags', 'rarity']
            });
            // Define subcategories
            this.setupSubcategories();
            // Weapon skill subcategories
            this.subcategories.set('BEAM', {
                name: 'Beam Weapon Skill',
                description: 'Skills for beam weapons',
                parent: 'SKL_WPN',
                subdirectory: 'beam'
            });
            this.subcategories.set('BALLISTIC', {
                name: 'Ballistic Weapon Skill',
                description: 'Skills for ballistic weapons',
                parent: 'SKL_WPN',
                subdirectory: 'ballistic'
            });
            this.subcategories.set('MISSILE', {
                name: 'Missile Weapon Skill',
                description: 'Skills for missile weapons',
                parent: 'SKL_WPN',
                subdirectory: 'missile'
            });
            this.subcategories.set('MELEE', {
                name: 'Melee Weapon Skill',
                description: 'Skills for melee weapons',
                parent: 'SKL_WPN',
                subdirectory: 'melee'
            });
        }

        setupSubcategories() {
            // Pilot subcategories
            this.subcategories.set('VET', {
                name: 'Veteran',
                description: 'Experienced combat pilots',
                parent: 'PLT',
                subdirectory: 'veterans',
                skillRange: [5, 8],
                experienceMin: 100
            });

            this.subcategories.set('ACE', {
                name: 'Ace',
                description: 'Elite pilots with exceptional records',
                parent: 'PLT', 
                subdirectory: 'aces',
                skillRange: [8, 10],
                experienceMin: 500
            });

            this.subcategories.set('RKE', {
                name: 'Rookie',
                description: 'New pilots with basic training',
                parent: 'PLT',
                subdirectory: 'rookies', 
                skillRange: [3, 6],
                experienceMin: 0
            });

            // Copilot subcategories
            this.subcategories.set('AI', {
                name: 'Artificial Intelligence',
                description: 'AI-based copilot systems',
                parent: 'CPT',
                subdirectory: 'ai',
                bonusRange: [0.1, 0.3]
            });

            this.subcategories.set('HU', {
                name: 'Human',
                description: 'Human copilots and navigators',
                parent: 'CPT',
                subdirectory: 'human',
                bonusRange: [0.05, 0.2]
            });

            // Frame subcategories
            this.subcategories.set('LT', {
                name: 'Light',
                description: 'Fast, agile frames with limited armor',
                parent: 'FRM',
                subdirectory: 'light',
                weightRange: [20, 50],
                hardpointRange: [4, 8]
            });

            this.subcategories.set('MD', {
                name: 'Medium', 
                description: 'Balanced frames for general combat',
                parent: 'FRM',
                subdirectory: 'medium',
                weightRange: [50, 80],
                hardpointRange: [8, 12]
            });

            this.subcategories.set('HV', {
                name: 'Heavy',
                description: 'Heavily armored assault frames',
                parent: 'FRM',
                subdirectory: 'heavy',
                weightRange: [80, 120],
                hardpointRange: [12, 18]
            });

            this.subcategories.set('SP', {
                name: 'Special',
                description: 'Specialized frames for unique roles',
                parent: 'FRM',
                subdirectory: 'special',
                weightRange: [30, 90],
                hardpointRange: [6, 14]
            });

            // Weapon subcategories
            this.subcategories.set('BM', {
                name: 'Beam',
                description: 'Energy-based directed weapons',
                parent: 'WPN',
                subdirectory: 'beam',
                damageType: 'energy',
                heatGeneration: 'high'
            });

            this.subcategories.set('PH', {
                name: 'Physical',
                description: 'Kinetic and ballistic weapons',
                parent: 'WPN',
                subdirectory: 'physical',
                damageType: 'physical',
                heatGeneration: 'low'
            });

            this.subcategories.set('MS', {
                name: 'Missile',
                description: 'Guided projectile weapons',
                parent: 'WPN',
                subdirectory: 'missile',
                damageType: 'explosive',
                heatGeneration: 'medium'
            });

            this.subcategories.set('EN', {
                name: 'Energy',
                description: 'Energy-based weapons',
                parent: 'WPN',
                subdirectory: 'energy',
                damageType: 'energy',
                heatGeneration: 'high'
            });

            this.subcategories.set('EX', {
                name: 'Explosive',
                description: 'Explosive weapons and ordnance',
                parent: 'WPN',
                subdirectory: 'explosive',
                damageType: 'explosive',
                heatGeneration: 'medium'
            });

            // Armor subcategories
            this.subcategories.set('HD', {
                name: 'Head',
                description: 'Head armor and protection',
                parent: 'ARM',
                subdirectory: 'head',
                slot: 'head'
            });

            this.subcategories.set('TR', {
                name: 'Torso',
                description: 'Torso armor and chest protection',
                parent: 'ARM',
                subdirectory: 'torso',
                slot: 'torso'
            });

            this.subcategories.set('AR', {
                name: 'Arms',
                description: 'Arm armor and protection',
                parent: 'ARM',
                subdirectory: 'arms',
                slot: 'arms'
            });

            this.subcategories.set('LG', {
                name: 'Legs',
                description: 'Leg armor and protection',
                parent: 'ARM',
                subdirectory: 'legs',
                slot: 'legs'
            });

            this.subcategories.set('SH', {
                name: 'Shield',
                description: 'Shield systems and barriers',
                parent: 'ARM',
                subdirectory: 'shield',
                slot: 'shield'
            });

            // System subcategories
            this.subcategories.set('GN', {
                name: 'Generator',
                description: 'Power generation systems',
                parent: 'SYS',
                subdirectory: 'generators',
                function: 'power_generation'
            });

            this.subcategories.set('CL', {
                name: 'Cooler',
                description: 'Heat management systems',
                parent: 'SYS',
                subdirectory: 'coolers',
                function: 'heat_dissipation'
            });

            this.subcategories.set('OS', {
                name: 'Operating System',
                description: 'Control and AI systems',
                parent: 'SYS',
                subdirectory: 'os',
                function: 'control_system'
            });

            this.subcategories.set('SN', {
                name: 'Sensor',
                description: 'Detection and scanning systems',
                parent: 'SYS',
                subdirectory: 'sensors',
                function: 'detection'
            });

            this.subcategories.set('CM', {
                name: 'Communication',
                description: 'Communication and networking systems',
                parent: 'SYS',
                subdirectory: 'communication',
                function: 'communication'
            });

            // Skill subcategories (reusing PLT and CPT codes for skills)
            // Note: These are different from the main PLT/CPT categories
            // SKL_PLT = Pilot Skills, SKL_CPT = Copilot Skills
            
            // Add PLT and CPT as skill subcategories (different context from main categories)
            this.subcategories.set('PLT', {
                name: 'Pilot Skill',
                description: 'Skills available to pilots',
                parent: 'SKL',
                subdirectory: 'pilot-skills',
                skillType: 'pilot'
            });

            this.subcategories.set('CPT', {
                name: 'Copilot Skill',
                description: 'Skills available to copilots',
                parent: 'SKL',
                subdirectory: 'copilot-skills',
                skillType: 'copilot'
            });
        }

        // Parse a card ID into its components
        parseCardId(cardId) {
            if (!cardId || typeof cardId !== 'string') {
                return null;
            }

            // Handle new format: CRD_WPN_BM_RIFLE001
            if (cardId.startsWith('CRD_')) {
                const parts = cardId.split('_');
                if (parts.length < 4) return null;

                return {
                    prefix: parts[0],           // CRD
                    category: parts[1],         // WPN
                    subcategory: parts[2],      // BM
                    identifier: parts[3],       // RIFLE001
                    fullId: cardId,
                    isNewFormat: true
                };
            }

            // Handle legacy format: card_equipment_light_beam_rifle
            if (cardId.startsWith('card_')) {
                return {
                    fullId: cardId,
                    isNewFormat: false,
                    legacy: true
                };
            }

            return null;
        }

        // Validate a card ID format
        validateCardId(cardId) {
            const parsed = this.parseCardId(cardId);
            if (!parsed) {
                return { valid: false, error: 'Invalid card ID format' };
            }

            if (parsed.legacy) {
                return { valid: true, warning: 'Legacy format - consider migrating' };
            }

            // Validate category
            if (!this.cardTypes.has(parsed.category)) {
                return { valid: false, error: `Unknown category: ${parsed.category}` };
            }

            // Validate subcategory
            if (!this.subcategories.has(parsed.subcategory)) {
                return { valid: false, error: `Unknown subcategory: ${parsed.subcategory}` };
            }

            // Check if subcategory belongs to category
            const subcategoryInfo = this.subcategories.get(parsed.subcategory);
            if (subcategoryInfo.parent !== parsed.category) {
                return { 
                    valid: false, 
                    error: `Subcategory ${parsed.subcategory} does not belong to category ${parsed.category}` 
                };
            }

            return { valid: true };
        }

        // Get file path for a card ID (keeping existing directory structure)
        getCardPath(cardId) {
            const parsed = this.parseCardId(cardId);
            if (!parsed || !parsed.isNewFormat) {
                return null;
            }

            // Map new card IDs to existing directory structure

            // Frame card subfolder logic
            if (cardId.startsWith('CRD_FRM_')) {
                // Parse subtype (e.g., LT, MD, HV)
                const match = cardId.match(/^CRD_FRM_([A-Z]{2})_/);
                if (match) {
                    const subtype = match[1];
                    let subfolder = '';
                    if (subtype === 'LT') subfolder = 'light';
                    else if (subtype === 'MD') subfolder = 'medium';
                    else if (subtype === 'HV') subfolder = 'heavy';
                    if (subfolder) {
                        return `data/cards/equipment/systems/frames/${subfolder}/${cardId}.json`;
                    }
                }
            }

            const pathMappings = {
                // Pilots - keep in existing pilots directory
                'CRD_PLT_VET_ALEX001': 'data/cards/pilots/CRD_PLT_VET_ALEX001.json',
                'CRD_PLT_ACE_MAYA001': 'data/cards/pilots/CRD_PLT_ACE_MAYA001.json',
                // Copilots - keep in existing copilots directory
                'CRD_CPT_AI_ARIA001': 'data/cards/copilots/CRD_CPT_AI_ARIA001.json',
                'CRD_CPT_AI_NEXUS001': 'data/cards/copilots/CRD_CPT_AI_NEXUS001.json',
                // Weapons - keep in existing weapon directories
                'CRD_WPN_BM_RIFLE001': 'data/cards/equipment/weapons/beam/CRD_WPN_BM_RIFLE001.json',
                'CRD_WPN_BM_CANNON001': 'data/cards/equipment/weapons/beam/CRD_WPN_BM_CANNON001.json',
                'CRD_WPN_MS_POD001': 'data/cards/equipment/weapons/projectile/CRD_WPN_MS_POD001.json',
                // Armor - keep in existing armor directories
                'CRD_ARM_TR_BASIC001': 'data/cards/equipment/armor/torso/CRD_ARM_TR_BASIC001.json',
                'CRD_ARM_TR_STANDARD001': 'data/cards/equipment/armor/torso/CRD_ARM_TR_STANDARD001.json',
                'CRD_ARM_LG_BASIC001': 'data/cards/equipment/armor/legs/CRD_ARM_LG_BASIC001.json',
                'CRD_ARM_LG_STANDARD001': 'data/cards/equipment/armor/legs/CRD_ARM_LG_STANDARD001.json',
                // Systems - keep in existing system directories
                'CRD_SYS_GN_STANDARD001': 'data/cards/equipment/systems/generators/CRD_SYS_GN_STANDARD001.json',
                'CRD_SYS_CL_PASSIVE001': 'data/cards/equipment/systems/coolers/CRD_SYS_CL_PASSIVE001.json',
                'CRD_SYS_OS_STANDARD001': 'data/cards/equipment/systems/os/CRD_SYS_OS_STANDARD001.json'
            };

            // Return specific mapping if available
            if (pathMappings[cardId]) {
                return pathMappings[cardId];
            }

            // Fallback: try to determine path from card structure
            const categoryInfo = this.cardTypes.get(parsed.category);
            if (!categoryInfo) return null;

            // Support weapon skill cards
            if (parsed.category === 'SKL_WPN') {
                // e.g. CRD_SKL_WPN_BEAM_SHOT001
                if (parsed.subcategory === 'BEAM') return `data/cards/equipment/equipment-skills/weapons/${cardId}.json`;
                if (parsed.subcategory === 'BALLISTIC') return `data/cards/equipment/equipment-skills/weapons/${cardId}.json`;
                if (parsed.subcategory === 'MISSILE') return `data/cards/equipment/equipment-skills/weapons/${cardId}.json`;
                if (parsed.subcategory === 'MELEE') return `data/cards/equipment/equipment-skills/weapons/${cardId}.json`;
                return `data/cards/equipment/equipment-skills/weapons/${cardId}.json`;
            }
            // Use existing directory structure based on category
            switch (parsed.category) {
                case 'PLT':
                    return `data/cards/pilots/${cardId}.json`;
                case 'CPT':
                    return `data/cards/copilots/${cardId}.json`;
                case 'FRM':
                    // For frames, try subdirectory first, then root directory
                    const weightClass = parsed.subcategory.toLowerCase();
                    if (parsed.subcategory === 'LT') return `data/cards/equipment/systems/frames/light/${cardId}.json`;
                    if (parsed.subcategory === 'MD') return `data/cards/equipment/systems/frames/medium/${cardId}.json`;
                    if (parsed.subcategory === 'HV') return `data/cards/equipment/systems/frames/heavy/${cardId}.json`;
                    return `data/cards/equipment/systems/frames/${cardId}.json`;
                case 'WPN':
                    // Determine weapon subdirectory
                    if (parsed.subcategory === 'BM') return `data/cards/equipment/weapons/beam/${cardId}.json`;
                    if (parsed.subcategory === 'MS') return `data/cards/equipment/weapons/projectile/${cardId}.json`;
                    if (parsed.subcategory === 'PH') return `data/cards/equipment/weapons/physical/${cardId}.json`;
                    return `data/cards/equipment/weapons/${cardId}.json`;
                case 'ARM':
                    // Determine armor subdirectory
                    if (parsed.subcategory === 'HD') return `data/cards/equipment/armor/head/${cardId}.json`;
                    if (parsed.subcategory === 'TR') return `data/cards/equipment/armor/torso/${cardId}.json`;
                    if (parsed.subcategory === 'AR') return `data/cards/equipment/armor/arms/${cardId}.json`;
                    if (parsed.subcategory === 'LG') return `data/cards/equipment/armor/legs/${cardId}.json`;
                    return `data/cards/equipment/armor/${cardId}.json`;
                case 'SYS':
                    // Determine system subdirectory
                    if (parsed.subcategory === 'GN') return `data/cards/equipment/systems/generators/${cardId}.json`;
                    if (parsed.subcategory === 'CL') return `data/cards/equipment/systems/coolers/${cardId}.json`;
                    if (parsed.subcategory === 'OS') return `data/cards/equipment/systems/os/${cardId}.json`;
                    return `data/cards/equipment/systems/${cardId}.json`;
                case 'SKL':
                    // Skills stay in existing pilot/copilot skill directories
                    if (parsed.subcategory === 'PLT') return `data/cards/pilots/pilot-skills/${cardId}.json`;
                    if (parsed.subcategory === 'CPT') return `data/cards/copilots/copilot-skills/${cardId}.json`;
                    return `data/cards/skills/${cardId}.json`;
                default:
                    return null;
            }
        }

        // Generate a new card ID
        generateCardId(category, subcategory, identifier) {
            const validation = this.validateCardId(`CRD_${category}_${subcategory}_${identifier}`);
            if (!validation.valid) {
                throw new Error(`Invalid card ID components: ${validation.error}`);
            }

            return `CRD_${category}_${subcategory}_${identifier}`;
        }

        // Get all valid categories
        getCategories() {
            return Array.from(this.cardTypes.keys());
        }

        // Get subcategories for a category
        getSubcategories(category) {
            const categoryInfo = this.cardTypes.get(category);
            if (!categoryInfo) return [];

            return categoryInfo.subcategories.map(sub => ({
                code: sub,
                info: this.subcategories.get(sub)
            }));
        }

        // Validate card data against type requirements
        validateCardData(cardId, cardData) {
            const parsed = this.parseCardId(cardId);
            if (!parsed || !parsed.isNewFormat) {
                return { valid: true, warning: 'Cannot validate legacy format' };
            }

            const categoryInfo = this.cardTypes.get(parsed.category);
            if (!categoryInfo) {
                return { valid: false, error: 'Unknown category' };
            }

            const errors = [];
            const warnings = [];

            // Check required fields
            for (const field of categoryInfo.requiredFields) {
                if (!cardData.hasOwnProperty(field)) {
                    errors.push(`Missing required field: ${field}`);
                }
            }

            // Validate subcategory-specific rules
            const subcategoryInfo = this.subcategories.get(parsed.subcategory);
            if (subcategoryInfo) {
                // Example: Validate pilot skill ranges
                if (parsed.category === 'PLT' && cardData.skills) {
                    const skillValues = Object.values(cardData.skills);
                    const [minSkill, maxSkill] = subcategoryInfo.skillRange;
                    
                    for (const skill of skillValues) {
                        if (skill < minSkill || skill > maxSkill) {
                            warnings.push(`Skill value ${skill} outside expected range [${minSkill}-${maxSkill}] for ${subcategoryInfo.name}`);
                        }
                    }
                }
            }

            return {
                valid: errors.length === 0,
                errors,
                warnings
            };
        }

        // Get type information for a card
        getTypeInfo(cardId) {
            const parsed = this.parseCardId(cardId);
            if (!parsed) return null;

            if (!parsed.isNewFormat) {
                return { legacy: true, cardId };
            }

            const categoryInfo = this.cardTypes.get(parsed.category);
            const subcategoryInfo = this.subcategories.get(parsed.subcategory);

            // Generate display name
            let displayName = cardId;
            if (categoryInfo && subcategoryInfo) {
                const itemName = parsed.identifier.replace(/\d+$/, '').replace(/([A-Z])/g, ' $1').trim();
                displayName = `${subcategoryInfo.name} ${itemName}`;
            }

            return {
                parsed,
                category: categoryInfo,
                subcategory: subcategoryInfo,
                displayName,
                path: this.getCardPath(cardId)
            };
        }

        // Create a card template
        createCardTemplate(category, subcategory) {
            const categoryInfo = this.cardTypes.get(category);
            const subcategoryInfo = this.subcategories.get(subcategory);

            if (!categoryInfo || !subcategoryInfo) {
                throw new Error('Invalid category or subcategory');
            }

            const template = {
                id: `CRD_${category}_${subcategory}_TEMPLATE001`,
                name: `New ${subcategoryInfo.name} ${categoryInfo.name}`,
                type: categoryInfo.name.toLowerCase(),
                subtype: subcategoryInfo.name.toLowerCase(),
                description: `A ${subcategoryInfo.description.toLowerCase()}`,
                rarity: 'common',
                tags: [categoryInfo.name.toLowerCase(), subcategoryInfo.name.toLowerCase()]
            };

            // Add category-specific fields
            for (const field of categoryInfo.requiredFields) {
                if (!template.hasOwnProperty(field)) {
                    template[field] = this.getDefaultValue(field, subcategoryInfo);
                }
            }

            return template;
        }

        // Get default value for a field
        getDefaultValue(field, subcategoryInfo) {
            const defaults = {
                'skills': {},
                'stats': {},
                'hardpoints': {},
                'efficiency': 1.0,
                'bonus': 0.1,
                'damage': 0,
                'energy_cost': 0,
                'weight': 1,
                'armor_value': 0,
                'function': subcategoryInfo?.function || 'unknown'
            };

            return defaults[field] || null;
        }
    }

    // Create global instance
    window.CardTypeSystem = new CardTypeSystem();

    // Convenience functions
    window.validateCard = (cardId, cardData = null) => {
        const idValidation = window.CardTypeSystem.validateCardId(cardId);
        if (!idValidation.valid) return idValidation;

        if (cardData) {
            return window.CardTypeSystem.validateCardData(cardId, cardData);
        }

        return idValidation;
    };

    window.getCardInfo = (cardId) => {
        return window.CardTypeSystem.getTypeInfo(cardId);
    };

    window.createCardTemplate = (category, subcategory) => {
        return window.CardTypeSystem.createCardTemplate(category, subcategory);
    };

    console.log('CardTypeSystem loaded. Use window.validateCard(), window.getCardInfo(), window.createCardTemplate()');

})();