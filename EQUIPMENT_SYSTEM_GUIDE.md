# Mecha Equipment System Guide

## Overview
The enhanced Mecha Composite system now includes a comprehensive equipment management system with hardpoints, weight/energy requirements, and component swapping capabilities.

## New Features

### 🔧 **Component Swapping**
- **Pilots**: Switch between Alex Carter (recon specialist) and Maya Torres (heavy weapons veteran)
- **Copilots**: Choose between ARIA (basic support) and NEXUS (advanced tactical AI)
- **Frames**: Select from Scout (light), Assault (medium), or Heavy Tank (heavy) configurations

### ⚡ **Hardpoint System**
Each frame has specific hardpoint configurations:

#### Scout Frame (Light)
- **Hardpoints**: Head(1), Torso(2), Arms(2), Legs(2), Generator(1)
- **Stats**: Armor(70), Speed(200), Energy(220), Heat(12), Weight Limit(50)
- **Special**: +20% movement speed, -10% weapon accuracy

#### Assault Frame (Medium)
- **Hardpoints**: Head(1), Torso(4), Arms(3), Legs(2), Generator(1)
- **Stats**: Armor(120), Speed(150), Energy(300), Heat(15), Weight Limit(80)
- **Special**: +15% weapon damage, balanced mobility

#### Heavy Tank Frame (Heavy)
- **Hardpoints**: Head(2), Torso(6), Arms(4), Legs(3), Generator(2)
- **Stats**: Armor(200), Speed(100), Energy(400), Heat(20), Weight Limit(120)
- **Special**: +30% armor effectiveness, -20% movement speed, +50% weapon capacity

### 🎯 **Weapon Requirements System**
Weapons now have specific requirements:

#### Light Beam Rifle
- **Requirements**: Light frames only
- **Resources**: 25 energy, no weight restrictions
- **Hardpoint**: Any available slot

#### Heavy Plasma Cannon
- **Requirements**: Medium/Heavy frames only
- **Resources**: 60 energy, 15 weight units
- **Hardpoint**: Torso slots only
- **Special**: Armor-piercing capabilities

#### Heavy Autocannon
- **Requirements**: Medium/Heavy frames only
- **Resources**: 15 energy, 12 weight units, 200 ammo capacity
- **Hardpoint**: Arms slots only
- **Special**: Burst fire (3 rounds)

### 📊 **Resource Management**
The system now tracks:
- **Weight Capacity**: Total weight vs frame limit
- **Energy Consumption**: Active drain vs generation capacity
- **Heat Generation**: Weapon heat vs dissipation capacity
- **Hardpoint Usage**: Occupied vs available slots

## How to Use

### 🎮 **In-Game Interface**

1. **Main Menu** → **Mecha Hangar**
2. **Equip** → Choose component type (Pilot/Copilot/Frame)
3. **Switch Mecha** → Change between different mecha configurations
4. **Stats** → View detailed composite statistics

### 🔄 **Component Swapping Process**

1. Select **Equip** from Academy Menu
2. Choose component type:
   - **Pilot**: Changes pilot skills and efficiency
   - **Copilot**: Modifies support bonuses
   - **Frame**: Completely changes mecha capabilities (clears weapons)
3. Select new component from available options
4. System automatically recalculates all stats

### ⚠️ **Equipment Validation**

The system automatically checks:
- **Frame Compatibility**: Light weapons can't mount on heavy hardpoints
- **Weight Limits**: Heavy weapons require sufficient weight capacity
- **Energy Requirements**: High-drain weapons need adequate power
- **Hardpoint Availability**: Weapons need appropriate mounting points

## Technical Implementation

### 🏗️ **Architecture Changes**

#### Enhanced MechaComposite Class
- `canEquipWeapon()`: Validates equipment requirements
- `getFrameHardpoints()`: Extracts hardpoint data from frame cards
- `getCurrentWeight()`: Calculates total equipment weight
- `getCurrentEnergyDrain()`: Tracks active energy consumption

#### New Manager Methods
- `swapPilot()`: Changes pilot while maintaining other components
- `swapCopilot()`: Updates copilot configuration
- `swapFrame()`: Replaces frame and clears incompatible equipment

#### Updated UI Windows
- **Window_Loadout**: Shows hardpoints, weight/energy usage
- **Window_PilotSelect**: Lists available pilots
- **Window_CopilotSelect**: Lists available copilots
- **Window_FrameSelect**: Lists available frames

### 📁 **New Card Data**

#### Additional Pilots
- `card_pilot_maya_torres.json`: Veteran heavy weapons specialist

#### Additional Copilots
- `card_copilot_nexus.json`: Advanced tactical AI system

#### Additional Frames
- `card_frame_assault.json`: Balanced medium combat frame
- `card_frame_heavy_tank.json`: Maximum firepower heavy frame

#### Enhanced Weapons
- `card_equipment_heavy_plasma_cannon.json`: High-damage energy weapon
- `card_equipment_heavy_autocannon.json`: Rapid-fire ballistic weapon

#### Skill Cards (Framework)
- `card_pilot_skill_marksman.json`: Accuracy enhancement
- `card_copilot_skill_tactical_analysis.json`: Combat analysis module

## Testing

### 🧪 **Console Commands**
```javascript
// Run all tests
window.testMechaComposite.runAllTests();

// Test specific systems
window.testMechaComposite.testCompositeStats();
window.testMechaComposite.testEquipment();
```

### 🔍 **Expected Behaviors**

1. **Scout Frame**: Can equip light weapons, fails with heavy weapons
2. **Assault Frame**: Can equip most weapons, balanced capabilities
3. **Heavy Tank**: Can equip all weapons, maximum hardpoints
4. **Weight Limits**: Heavy weapons rejected if frame can't support them
5. **Energy Limits**: High-drain weapons rejected if insufficient power

## Future Enhancements

### 🚀 **Planned Features**
- **Skill System**: Pilot/copilot skill cards that modify abilities
- **Armor Customization**: Frame-specific armor sets
- **Weapon Modifications**: Upgrade and customize weapons
- **Mission Requirements**: Specific loadouts for different mission types
- **Workshop System**: Craft and modify equipment

### 🎯 **Balance Considerations**
- **Frame Specialization**: Each frame type has distinct advantages
- **Resource Trade-offs**: Power vs weight vs hardpoints
- **Pilot Synergy**: Different pilots excel with different frame types
- **Progressive Unlocks**: Advanced equipment requires training/experience

## File Structure
```
data/cards/
├── pilots/
│   ├── card_pilot_alex_carter.json
│   ├── card_pilot_maya_torres.json
│   └── pilot-skills/
│       └── card_pilot_skill_marksman.json
├── copilots/
│   ├── card_copilot_aria.json
│   ├── card_copilot_nexus.json
│   └── copilot-skills/
│       └── card_copilot_skill_tactical_analysis.json
└── equipment/
    ├── systems/frames/
    │   ├── card_frame_scout.json
    │   ├── card_frame_assault.json
    │   └── card_frame_heavy_tank.json
    └── weapons/
        ├── beam/card_equipment_heavy_plasma_cannon.json
        └── physical/card_equipment_heavy_autocannon.json
```

This system provides a robust foundation for complex mecha customization while maintaining clear gameplay mechanics and technical implementation.