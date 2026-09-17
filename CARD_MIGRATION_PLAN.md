# 🔄 **CARD MIGRATION TO NEW NAMING CONVENTION**

## 🎯 **MIGRATION MAPPING**

### **PILOTS** (card_pilot_* → CRD_PLT_*_*)
```
card_pilot_alex_carter.json     → CRD_PLT_VET_ALEX001.json
card_pilot_maya_torres.json     → CRD_PLT_ACE_MAYA001.json
```

### **COPILOTS** (card_copilot_* → CRD_CPT_*_*)
```
card_copilot_aria.json          → CRD_CPT_AI_ARIA001.json
card_copilot_nexus.json         → CRD_CPT_AI_NEXUS001.json
```

### **FRAMES** (card_frame_* → CRD_FRM_*_*)
```
card_frame_scout.json           → CRD_FRM_LT_SCOUT001.json
card_frame_assault.json         → CRD_FRM_MD_ASSAULT001.json
card_frame_heavy_tank.json      → CRD_FRM_HV_TANK001.json
```

### **WEAPONS** (card_equipment_* → CRD_WPN_*_*)
```
card_equipment_light_beam_rifle.json       → CRD_WPN_BM_RIFLE001.json
card_equipment_medium_laser_cannon.json    → CRD_WPN_BM_CANNON001.json
card_equipment_missile_pod.json            → CRD_WPN_MS_POD001.json
```

### **ARMOR** (card_equipment_*_armor → CRD_ARM_*_*)
```
card_equipment_basic_torso_armor.json      → CRD_ARM_TR_BASIC001.json
card_equipment_standard_torso_armor.json   → CRD_ARM_TR_STANDARD001.json
card_equipment_basic_legs_armor.json       → CRD_ARM_LG_BASIC001.json
card_equipment_standard_leg_armor.json     → CRD_ARM_LG_STANDARD001.json
```

### **SYSTEMS** (card_equipment_* → CRD_SYS_*_*)
```
card_equipment_standard_generator.json     → CRD_SYS_GN_STANDARD001.json
card_equipment_passive_heatsink.json       → CRD_SYS_CL_PASSIVE001.json
card_equipment_standard_os.json            → CRD_SYS_OS_STANDARD001.json
```

---

## 🏗️ **NEW DIRECTORY STRUCTURE**
```
data/cards/
├── pilots/
│   ├── veterans/     → CRD_PLT_VET_*.json
│   ├── aces/         → CRD_PLT_ACE_*.json
│   └── rookies/      → CRD_PLT_RKE_*.json
├── copilots/
│   ├── ai/           → CRD_CPT_AI_*.json
│   └── human/        → CRD_CPT_HU_*.json
├── frames/
│   ├── light/        → CRD_FRM_LT_*.json
│   ├── medium/       → CRD_FRM_MD_*.json
│   ├── heavy/        → CRD_FRM_HV_*.json
│   └── special/      → CRD_FRM_SP_*.json
├── weapons/
│   ├── beam/         → CRD_WPN_BM_*.json
│   ├── physical/     → CRD_WPN_PH_*.json
│   ├── missile/      → CRD_WPN_MS_*.json
│   └── explosive/    → CRD_WPN_EX_*.json
├── armor/
│   ├── head/         → CRD_ARM_HD_*.json
│   ├── torso/        → CRD_ARM_TR_*.json
│   ├── arms/         → CRD_ARM_AR_*.json
│   ├── legs/         → CRD_ARM_LG_*.json
│   └── shield/       → CRD_ARM_SH_*.json
└── systems/
    ├── generators/   → CRD_SYS_GN_*.json
    ├── coolers/      → CRD_SYS_CL_*.json
    ├── os/           → CRD_SYS_OS_*.json
    ├── sensors/      → CRD_SYS_SN_*.json
    └── communication/→ CRD_SYS_CM_*.json
```

---

## ⚡ **MIGRATION STEPS**

### **Phase 1: Backup & Prepare**
1. Backup existing `data/cards/` directory
2. Create new directory structure
3. Update CardTypeSystem.js to be primary naming system

### **Phase 2: Rename & Reorganize Files**
1. Rename all card files to new convention
2. Move files to appropriate subdirectories
3. Update internal card IDs in JSON files

### **Phase 3: Update Code**
1. Remove legacy format support from AcademyMenu.js
2. Update DataLoader.js to use new paths
3. Update MechaComposite.js references
4. Update all hardcoded card IDs in code

### **Phase 4: Test & Verify**
1. Test card loading with new names
2. Verify menu displays work correctly
3. Test mecha composite system
4. Run all test suites

---

## 🛠️ **REQUIRED CODE CHANGES**

### **Files to Update:**
- ✅ **CardTypeSystem.js** - Make primary naming system
- ✅ **AcademyMenu.js** - Remove legacy support, use CardTypeSystem
- ✅ **DataLoader.js** - Update paths to use CardTypeSystem
- ✅ **MechaComposite.js** - Update card ID references
- ✅ **All test files** - Update test card IDs

### **Files to Remove:**
- ❌ **CardMigrationTool.js** - No longer needed after migration
- ❌ **Legacy format support** - Clean up all dual-format code

---

## 🎯 **BENEFITS AFTER MIGRATION**

### **Consistency**
- ✅ Single naming convention across all cards
- ✅ Predictable file paths and organization
- ✅ Type-safe card creation and validation

### **Maintainability**
- ✅ Clear categorization system
- ✅ Easy to find and organize cards
- ✅ Scalable to hundreds of cards

### **Developer Experience**
- ✅ No confusion about naming formats
- ✅ Automatic validation and type checking
- ✅ Clear development guidelines

---

## 🚨 **MIGRATION PRIORITY**

This migration should be done **immediately** before adding more cards or features to avoid:
- ❌ Technical debt from dual-format support
- ❌ Confusion about which format to use
- ❌ Maintenance overhead of supporting both systems
- ❌ Potential bugs from format mismatches

**Recommendation: Complete migration in next development session** 🎯