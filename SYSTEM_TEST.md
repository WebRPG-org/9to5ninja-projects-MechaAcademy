# Mecha Equipment System - Complete Test Guide

## 🎮 **How to Test the System**

### **Step 1: Activate Plugins**
1. Open RPG Maker MZ
2. Go to **Tools → Plugin Manager** (F10)
3. Activate in this order:
   - ✅ `DataLoader.js` (Core JSON loading)
   - ✅ `CardDataAdapter.js` (NEW: JSON → RPG Maker translator)
   - ✅ `MechaComposite.js` (Mecha system)
   - ✅ `AcademyMenu.js` (UI system)
   - ✅ `CardAdapterTest.js` (NEW: Translation tests)
   - ✅ `MechaCompositeTest.js` (Optional: Mecha tests)

### **Step 2: Start Game and Test**
1. **Start New Game**
2. **Open Main Menu** (ESC or X)
3. **Select "Mecha Hangar"**

## 🔧 **Equipment System Tests**

### **Test 1: Component Swapping**
1. In Mecha Hangar, select **"Equip"**
2. Choose **"Pilot"** → Select different pilot
3. Choose **"Copilot"** → Select different copilot  
4. Choose **"Frame"** → Select different frame
5. **Verify**: Windows update with new component info

### **Test 2: Weapon Equipping**
1. Select **"Equip"** → **"Weapons"**
2. Try equipping different weapons:
   - **Light Beam Rifle** (should work on all frames)
   - **Heavy Plasma Cannon** (should fail on Scout frame)
   - **Heavy Autocannon** (should fail on Scout frame)
3. **Verify**: Success/failure messages show correctly

### **Test 3: Armor System**
1. Select **"Equip"** → **"Armor"**
2. Equip armor for each slot:
   - Head Armor
   - Torso Armor
   - Arms Armor
   - Legs Armor
3. **Verify**: Armor stats appear in loadout window

### **Test 4: System Components**
1. Select **"Equip"** → **"Systems"**
2. Equip systems:
   - Generator
   - Cooler
   - OS
3. **Verify**: System effects apply to mecha

### **Test 5: Stats Display**
1. Select **"Stats"** from main menu
2. **Verify**: Detailed stats window shows:
   - Combat Rating
   - Pilot Efficiency
   - Core Stats (ATK, DEF, etc.)
   - Mecha Stats (Armor, Speed, Energy)
   - Resource Usage (Weight/Energy)

### **Test 6: Frame Compatibility**
1. **Scout Frame**: Try equipping heavy weapons (should fail)
2. **Assault Frame**: Should accept most weapons
3. **Heavy Tank**: Should accept all weapons
4. **Verify**: Error messages explain why equipment fails

## 🎯 **Expected Results**

### **Frame Capabilities**
| Frame Type | Hardpoints | Weight Limit | Energy | Special |
|------------|------------|--------------|---------|---------|
| Scout | H:1, T:2, A:2, L:2 | 50 | 220 | +20% speed, -10% accuracy |
| Assault | H:1, T:4, A:3, L:2 | 80 | 300 | +15% weapon damage |
| Heavy Tank | H:2, T:6, A:4, L:3 | 120 | 400 | +30% armor, -20% speed |

### **Weapon Requirements**
| Weapon | Frame Req | Weight | Energy | Hardpoint |
|--------|-----------|--------|---------|-----------|
| Light Beam Rifle | Any | 0 | 25 | Any |
| Heavy Plasma Cannon | Med/Heavy | 15 | 60 | Torso |
| Heavy Autocannon | Med/Heavy | 12 | 15 | Arms |

### **Resource Management**
- **Weight**: Total equipment weight vs frame limit
- **Energy**: Active drain vs generation capacity
- **Hardpoints**: Used slots vs available slots

## 🐛 **Troubleshooting**

### **Stats Crash Fixed**
- Enhanced error handling in `commandStats()`
- Comprehensive stats display with fallbacks
- Console error logging for debugging

### **Equipment Validation**
- Frame compatibility checking
- Weight and energy requirement validation
- Hardpoint availability verification

### **UI Improvements**
- Multi-line stats display
- Resource usage indicators
- Equipment success/failure feedback

## 🚀 **Advanced Testing**

### **Console Commands**
```javascript
// Run all mecha tests
window.testMechaComposite.runAllTests();

// Test specific mecha systems
window.testMechaComposite.testEquipment();
window.testMechaComposite.testCompositeStats();

// NEW: Test card translation system
window.testCardAdapter.runTests();
window.testCardAdapter.testBattleIntegration();

// NEW: Test card naming convention
window.testCardNaming();

// Debug card adapter
window.debugCardAdapter();

// Manual equipment testing
const mecha = window.MechaCompositeManager.getActiveMecha();
await mecha.equipWeapon('card_equipment_heavy_plasma_cannon');

// Manual card translation testing
await window.CardDataAdapter.translateCard('card_equipment_light_beam_rifle');

// Test naming helper
window.CardNamingHelper.getDisplayName('CRD_WPN_BM_RIFLE001');
window.CardNamingHelper.getCategory('card_pilot_alex_carter');
```

### **Expected Console Output**
```
AcademyMenu loaded with CardNamingHelper. Run window.testCardNaming() to test naming convention.
CardDataAdapter: Initializing translator system...
CardDataAdapter: Engine hooks installed
CardDataAdapter: Translation system ready

=== Card Naming Convention Test ===
card_pilot_alex_carter:
  Display: "Pilot Alex Carter"
  Category: PLT
  Valid: true

CRD_WPN_BM_RIFLE001:
  Display: "Beam RIFLE"
  Category: WPN
  Valid: true

CRD_PLT_VET_ALEX001:
  Display: "Veteran ALEX"
  Category: PLT
  Valid: true

=== Card Data Adapter Tests ===
Test 1: Card ID Detection
  card_equipment_light_beam_rifle: CARD
  CRD_WPN_BM_RIFLE001: CARD
  normal_skill_1: NOT CARD

Test 2: Card Translation
  Translating card_equipment_light_beam_rifle...
  ✅ Light Beam Rifle (card_equipment_light_beam_rifle)
     Description: Standard energy weapon for light mecha frames
     Type: weapon

MechaComposite initialized: {pilot: "Alex Carter", copilot: "ARIA", frame: "Scout Frame"}
Testing light weapon...
Light weapon result: {success: true, assignedSlot: "torso_1"}
Testing heavy weapon...
Heavy weapon result: {success: false, error: "Weapon requires medium or heavy frame"}
```

## 📊 **System Architecture**

### **Component Hierarchy**
```
MechaComposite
├── Pilot Card (skills → efficiency)
├── Copilot Card (support → bonuses)
├── Frame Card (base stats + hardpoints)
└── Equipment
    ├── Weapons (hardpoint + resource requirements)
    ├── Armor (stat bonuses + weight)
    └── Systems (functionality + energy)
```

### **Stat Calculation Flow**
1. **Base Stats** from Frame Card
2. **Pilot Modifiers** (skills → mecha effectiveness)
3. **Copilot Bonuses** (support → combat bonuses)
4. **Equipment Effects** (armor, systems, weapons)
5. **Final Composite Stats** for combat/display

This system provides a complete mecha customization experience with proper validation, resource management, and user feedback!