# Mecha Composite Actor System

## Overview
This system solves RPG Maker MZ's actor composition challenge by creating composite mecha entities that combine pilots, copilots, and frames into single combat units while maintaining compatibility with the existing RPG Maker battle system.

## Architecture

### Core Components

1. **MechaComposite.js** - Main composite system
2. **AcademyMenu.js** - Updated UI integration
3. **MechaCompositeTest.js** - Testing and demonstration

### Key Classes

#### MechaComposite
- Combines pilot, copilot, and frame cards into a single entity
- Calculates composite stats based on component synergies
- Manages equipment (weapons, armor, systems)
- Converts to RPG Maker Actor format for combat

#### MechaCompositeManager
- Manages roster of up to 6 mecha
- Handles active mecha switching
- Updates party actor data for combat integration

## Features

### Composite Stat System
- **Base Stats**: Derived from frame card
- **Pilot Modifiers**: Efficiency ratings affect performance
- **Copilot Bonuses**: Additional enhancements to pilot capabilities
- **Equipment Effects**: Weapons, armor, and systems modify stats

### Calculated Stats
- **Combat Rating**: Overall combat effectiveness
- **Effective Armor**: Armor × Pilot Efficiency
- **Effective Speed**: Speed × (Pilot Efficiency + Copilot Bonus)
- **Mental Resource**: Mental stats enhanced by copilot
- **Energy Management**: Capacity and heat dissipation

### Equipment System
- **Weapons**: Up to 4 weapon slots
- **Armor**: Head, Torso, Arms, Legs
- **Systems**: Generator, Cooler, Operating System

## Integration Points

### Academy Menu Integration
- Shows active mecha composition
- Displays composite stats and effectiveness
- Allows switching between roster mecha
- Equipment status overview

### RPG Maker Combat Integration
- Converts composite stats to RPG Maker actor parameters
- Updates party member data automatically
- Maintains save/load compatibility

## Usage

### Creating Mecha
```javascript
// Create a new mecha
const mecha = await window.MechaCompositeManager.createMecha(
    'card_pilot_alex_carter',
    'card_copilot_aria', 
    'card_frame_scout'
);
```

### Switching Active Mecha
```javascript
// Switch to mecha at roster index 1
window.MechaCompositeManager.setActiveMecha(1);
```

### Equipment Management
```javascript
const activeMecha = window.MechaCompositeManager.getActiveMecha();
await activeMecha.equipWeapon('card_equipment_light_beam_rifle');
await activeMecha.equipArmor('head', 'card_equipment_basic_head_armor');
```

## Menu System Changes

### Main Menu
- **Mecha Hangar**: Opens detailed Academy Menu
- **Pilot Status**: Placeholder for pilot management
- **Academy Training**: Placeholder for training missions
- **Save Game**: Standard RPG Maker save
- **Game End**: Standard RPG Maker exit

### Academy Menu Commands
- **Equip**: Character/component selection (placeholder)
- **Switch Mecha**: Change active mecha from roster
- **Stats**: Show detailed composite statistics
- **Train**: Training missions (placeholder)
- **Cancel**: Return to main menu

## Technical Implementation

### Stat Calculation Formula
```javascript
compositeStat = baseStat + pilotModifier + copilotModifier
effectiveStat = compositeStat × efficiencyMultiplier
```

### RPG Maker Actor Conversion
- HP: Based on armor × 2
- MP: Based on energy capacity ÷ 4
- ATK/DEF/MAT/MDF/AGI/LUK: Direct composite stat mapping

### Data Flow
1. Load card data from JSON files
2. Calculate composite stats
3. Apply equipment modifiers
4. Convert to RPG Maker actor format
5. Update party data for combat

## Testing

### Available Test Functions
```javascript
// Run all tests
window.testMechaComposite.runAllTests();

// Individual tests
window.testMechaComposite.createTestMecha();
window.testMechaComposite.testCompositeStats();
window.testMechaComposite.testEquipment();
window.testMechaComposite.testActorConversion();
```

## Benefits

1. **Solves Composition Challenge**: Multiple entities work as one actor
2. **Maintains Compatibility**: Works with existing RPG Maker systems
3. **Flexible Design**: Easy to add new components or modify calculations
4. **User-Friendly**: Integrated with existing Academy Menu
5. **Extensible**: Ready for additional features like training, missions

## Future Enhancements

- Dynamic pilot/copilot/frame selection
- Advanced equipment crafting
- Mission-based training system
- Detailed pilot progression
- Combat formation tactics
- Mecha customization workshop

## File Structure
```
js/plugins/
├── MechaComposite.js      # Core composite system
├── AcademyMenu.js         # Updated UI integration  
├── MechaCompositeTest.js  # Testing framework
└── DataLoader.js          # Existing data system
```

This system provides a robust foundation for mecha-based gameplay while solving the fundamental actor composition challenge in RPG Maker MZ.