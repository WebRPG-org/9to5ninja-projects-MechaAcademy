# Mecha System API Reference for Copilot

## Frame Classes and Weight Categories
```javascript
// Frame data structure that Copilot should follow
const frameData = {
    id: "frame_light_scout",
    name: "Lynx Scout Frame",
    weightClass: "light", // light, medium, heavy
    role: "scout", // scout, assault, support, tank
    baseStats: {
        armor: 100,
        speed: 150,
        energyCapacity: 200,
        heatDissipation: 25,
        weightLimit: 50,
        hardpoints: {
            head: 1,
            torso: 2,
            arms: 2,
            legs: 2,
            generator: 1
        }
    },
    academyUnlock: "basic_piloting_101"
};

// Parts modify frame stats within weight/energy constraints
const partData = {
    id: "part_plasma_rifle",
    name: "PL-7 Plasma Rifle",
    type: "weapon",
    slot: "arm",
    weight: 12, // Must fit within frame weight limit
    energyDraw: 35, // Must not exceed generator output
    heatGeneration: 15, // Affects action economy
    statModifiers: {
        attack: 45,
        accuracy: 85,
        range: "medium"
    },
    effects: ["plasma_burn_chance"],
    rarity: "uncommon",
    cost: 8500
};

// Copilot should use this pattern for loadout validation
function validateLoadout(frame, parts, generator) {
    const totalWeight = parts.reduce((sum, part) => sum + part.weight, 0);
    const totalEnergyDraw = parts.reduce((sum, part) => sum + part.energyDraw, 0);
    
    return {
        weightValid: totalWeight <= frame.baseStats.weightLimit,
        energyValid: totalEnergyDraw <= generator.energyOutput,
        overweight: Math.max(0, totalWeight - frame.baseStats.weightLimit),
        energyDeficit: Math.max(0, totalEnergyDraw - generator.energyOutput)
    };
}