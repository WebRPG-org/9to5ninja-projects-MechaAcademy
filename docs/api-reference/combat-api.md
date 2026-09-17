# Enhanced Combat System API Reference for Copilot

## Three-Resource System
```javascript
// Copilot should follow this resource structure
const resourceTypes = {
    mental: {
        generatedBy: "pilot", // + copilot augmentation
        usedFor: ["tactics", "complex_maneuvers", "pilot_skills"],
        maxCapacity: "pilot.aptitudes.tacticalAwareness + copilot.mentalAugmentation",
        regenRate: "pilot.aptitudes.tacticalAwareness / 10"
    },
    digital: {
        generatedBy: "copilot",
        usedFor: ["targeting", "analysis", "system_coordination"],
        maxCapacity: "copilot.stats.digitalProcessing",
        regenRate: "copilot.stats.digitalProcessing / 5"
    },
    energy: {
        generatedBy: "mecha", // generator parts
        usedFor: ["weapons", "movement", "defensive_systems"],
        maxCapacity: "generator.energyOutput",
        regenRate: "generator.regenRate"
    }
};

// Heat affects action points per turn
const actionSystem = {
    baseActionsPerTurn: 3,
    heatThresholds: {
        normal: { actionRegen: 3, movementPenalty: 0 },
        warm: { actionRegen: 2, movementPenalty: 0.1 },
        hot: { actionRegen: 1, movementPenalty: 0.25 },
        overheated: { actionRegen: 0, movementPenalty: 0.5, forcedCooldown: true }
    }
};

// Equipment cards generated from mecha parts
const equipmentCard = {
    id: "plasma_rifle_shot",
    name: "Plasma Rifle Attack",
    source: "part_plasma_rifle",
    costs: { energy: 35, actions: 1 },
    effects: [{
        type: "damage",
        target: "enemy",
        formula: "weapon.attack * pilot.targeting_efficiency",
        heatGeneration: 15
    }]
};

// Pilot skill cards from progression
const pilotCard = {
    id: "precision_strike",
    name: "Precision Strike",
    source: "pilot_skill",
    costs: { mental: 3, actions: 2 },
    effects: [{
        type: "enhanced_attack",
        criticalChance: 0.8,
        damageBonus: 1.5
    }]
};