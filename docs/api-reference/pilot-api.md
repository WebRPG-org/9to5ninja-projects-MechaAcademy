# Pilot System API Reference for Copilot

## Core Aptitudes (affect mecha operational efficiency)
```javascript
// Standard pilot aptitude structure
const pilotAptitudes = {
    targeting: 75,      // Accuracy, critical hit chance
    evasion: 60,        // Dodge chance, speed bonus
    heatManagement: 85, // Heat dissipation efficiency
    energyEfficiency: 70, // Reduces energy consumption
    systemsControl: 55,  // Complex maneuver capability
    tacticalAwareness: 80 // Action point generation bonus
};

// Copilot should follow this pattern for specializations
const academyTracks = {
    "combat_specialist": {
        bonuses: { targeting: 1.2, evasion: 1.1 },
        unlockedCards: ["precision_shot", "combat_reflexes"],
        courseRequirements: ["weapons_theory", "tactical_combat"]
    },
    "systems_engineer": {
        bonuses: { heatManagement: 1.3, energyEfficiency: 1.2 },
        unlockedCards: ["overclock_system", "emergency_cooling"],
        courseRequirements: ["mecha_engineering", "power_systems"]
    }
};

// Copilot: pilot aptitudes modify mecha performance
function calculateEfficiency(pilotAptitude, baseValue) {
    const efficiencyMultiplier = 0.5 + (pilotAptitude / 100) * 0.5;
    return Math.floor(baseValue * efficiencyMultiplier);
}

// Example: Heat dissipation with pilot skill
const effectiveHeatDissipation = calculateEfficiency(
    pilot.aptitudes.heatManagement, 
    mecha.baseStats.heatDissipation
);