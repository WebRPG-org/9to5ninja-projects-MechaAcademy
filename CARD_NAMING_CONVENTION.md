# Card Naming & Typing Convention System

## 🎯 **CRITICAL: Standardized Card Architecture**

### **Current Problem**
- Inconsistent naming: `card_pilot_alex_carter` vs `B0015` vs `card_equipment_light_beam_rifle`
- No clear type hierarchy
- Translator can't efficiently categorize cards
- Database lookups are ambiguous
- Scaling issues with hundreds of cards

---

## 📋 **PROPOSED NAMING CONVENTION**

### **Format: `{PREFIX}_{CATEGORY}_{SUBCATEGORY}_{IDENTIFIER}`**

### **PREFIX SYSTEM**
| Prefix | Type | Purpose |
|--------|------|---------|
| `CRD` | Card | All card-based items |
| `ITM` | Item | Standard RPG Maker items |
| `SKL` | Skill | Standard RPG Maker skills |

### **CATEGORY CODES**
| Code | Category | Description |
|------|----------|-------------|
| `PLT` | Pilot | Human pilots |
| `CPT` | Copilot | AI copilots |
| `FRM` | Frame | Mecha chassis |
| `WPN` | Weapon | All weapons |
| `ARM` | Armor | Protective equipment |
| `SYS` | System | Internal components |
| `MOD` | Module | Upgrades/modifications |
| `CON` | Consumable | Single-use items |

### **SUBCATEGORY CODES**

#### **Weapons (WPN)**
| Code | Type | Examples |
|------|------|----------|
| `BM` | Beam | Lasers, plasma |
| `PH` | Physical | Autocannons, railguns |
| `MS` | Missile | Rockets, torpedoes |
| `EN` | Energy | Pure energy weapons |
| `EX` | Explosive | Grenades, mines |

#### **Armor (ARM)**
| Code | Type | Examples |
|------|------|----------|
| `HD` | Head | Sensor protection |
| `TR` | Torso | Core armor |
| `AR` | Arms | Weapon system protection |
| `LG` | Legs | Mobility protection |
| `SH` | Shield | Active defense |

#### **Systems (SYS)**
| Code | Type | Examples |
|------|------|----------|
| `GN` | Generator | Power systems |
| `CL` | Cooler | Heat management |
| `OS` | Operating System | AI/control |
| `SN` | Sensor | Detection systems |
| `CM` | Communication | Data links |

#### **Frames (FRM)**
| Code | Type | Examples |
|------|------|----------|
| `LT` | Light | Scout, interceptor |
| `MD` | Medium | Assault, general |
| `HV` | Heavy | Tank, siege |
| `SP` | Special | Stealth, support |

---

## 🏗️ **COMPLETE NAMING EXAMPLES**

### **Current Cards → New Convention**
| Current Name | New Name | Type |
|--------------|----------|------|
| `card_pilot_alex_carter` | `CRD_PLT_VET_ALEX001` | Veteran pilot Alex |
| `card_copilot_aria` | `CRD_CPT_AI_ARIA001` | AI copilot ARIA |
| `card_frame_scout` | `CRD_FRM_LT_SCOUT001` | Light scout frame |
| `card_equipment_light_beam_rifle` | `CRD_WPN_BM_RIFLE001` | Beam rifle |
| `card_equipment_heavy_plasma_cannon` | `CRD_WPN_BM_CANNON001` | Heavy beam cannon |
| `card_equipment_heavy_autocannon` | `CRD_WPN_PH_AUTOCANNON001` | Physical autocannon |
| `card_equipment_basic_head_armor` | `CRD_ARM_HD_BASIC001` | Basic head armor |

### **Extended Examples**
```
CRD_PLT_ACE_MAYA001     - Ace pilot Maya Torres
CRD_PLT_RKE_JACK001     - Rookie pilot Jack
CRD_CPT_AI_NEXUS001     - Advanced AI NEXUS
CRD_CPT_HU_SARAH001     - Human copilot Sarah

CRD_FRM_LT_INTERCEPTOR001  - Light interceptor frame
CRD_FRM_MD_ASSAULT001      - Medium assault frame  
CRD_FRM_HV_TANK001         - Heavy tank frame
CRD_FRM_SP_STEALTH001      - Special stealth frame

CRD_WPN_BM_LASER001     - Light laser
CRD_WPN_BM_PLASMA002    - Heavy plasma cannon
CRD_WPN_PH_RAIL001      - Railgun
CRD_WPN_MS_SWARM001     - Swarm missiles

CRD_ARM_TR_REACTIVE001  - Reactive torso armor
CRD_ARM_SH_ENERGY001    - Energy shield

CRD_SYS_GN_FUSION001    - Fusion generator
CRD_SYS_CL_LIQUID001    - Liquid cooling
CRD_SYS_OS_TACTICAL001  - Tactical OS
```

---

## 🔧 **IMPLEMENTATION STRATEGY**

### **Phase 1: Audit Current Cards**
```
Current Cards Inventory:
├── Pilots: card_pilot_alex_carter, card_pilot_maya_torres
├── Copilots: card_copilot_aria, card_copilot_nexus  
├── Frames: card_frame_scout, card_frame_assault, card_frame_heavy_tank
├── Weapons: card_equipment_light_beam_rifle, card_equipment_heavy_plasma_cannon, card_equipment_heavy_autocannon
├── Armor: card_equipment_basic_*_armor (head, torso, arms, legs)
└── Systems: card_equipment_standard_generator, card_equipment_passive_heatsink, card_equipment_standard_os
```

### **Phase 2: Migration Mapping**
| Old ID | New ID | File Path |
|--------|--------|-----------|
| `card_pilot_alex_carter` | `CRD_PLT_VET_ALEX001` | `data/cards/pilots/veterans/CRD_PLT_VET_ALEX001.json` |
| `card_copilot_aria` | `CRD_CPT_AI_ARIA001` | `data/cards/copilots/ai/CRD_CPT_AI_ARIA001.json` |
| `card_frame_scout` | `CRD_FRM_LT_SCOUT001` | `data/cards/frames/light/CRD_FRM_LT_SCOUT001.json` |
| `card_equipment_light_beam_rifle` | `CRD_WPN_BM_RIFLE001` | `data/cards/weapons/beam/CRD_WPN_BM_RIFLE001.json` |

### **Phase 3: Directory Restructure**
```
data/cards/
├── pilots/
│   ├── veterans/     (experienced pilots)
│   ├── rookies/      (new pilots)  
│   └── aces/         (elite pilots)
├── copilots/
│   ├── ai/           (AI copilots)
│   └── human/        (human copilots)
├── frames/
│   ├── light/        (scout, interceptor)
│   ├── medium/       (assault, general)
│   ├── heavy/        (tank, siege)
│   └── special/      (stealth, support)
├── weapons/
│   ├── beam/         (energy weapons)
│   ├── physical/     (kinetic weapons)
│   ├── missile/      (guided weapons)
│   └── explosive/    (area weapons)
├── armor/
│   ├── head/
│   ├── torso/
│   ├── arms/
│   ├── legs/
│   └── shields/
└── systems/
    ├── generators/
    ├── coolers/
    ├── os/
    ├── sensors/
    └── communication/
```

---

## 🤖 **TRANSLATOR INTEGRATION**

### **Enhanced Card ID Detection**
```javascript
class CardDataAdapter {
    static parseCardId(cardId) {
        // Parse: CRD_WPN_BM_RIFLE001
        const parts = cardId.split('_');
        
        if (parts[0] !== 'CRD' || parts.length < 4) {
            return null; // Not a valid card ID
        }
        
        return {
            prefix: parts[0],        // CRD
            category: parts[1],      // WPN
            subcategory: parts[2],   // BM  
            identifier: parts[3],    // RIFLE001
            fullId: cardId
        };
    }
    
    static getCardPath(cardId) {
        const parsed = this.parseCardId(cardId);
        if (!parsed) return null;
        
        const pathMap = {
            'PLT': `pilots/${this.getPilotSubdir(parsed.subcategory)}`,
            'CPT': `copilots/${this.getCopilotSubdir(parsed.subcategory)}`,
            'FRM': `frames/${this.getFrameSubdir(parsed.subcategory)}`,
            'WPN': `weapons/${this.getWeaponSubdir(parsed.subcategory)}`,
            'ARM': `armor/${this.getArmorSubdir(parsed.subcategory)}`,
            'SYS': `systems/${this.getSystemSubdir(parsed.subcategory)}`
        };
        
        const subPath = pathMap[parsed.category];
        return `data/cards/${subPath}/${cardId}.json`;
    }
}
```

### **Batch Loading by Category**
```javascript
// Load all beam weapons at once
await CardDataAdapter.loadBatch('CRD_WPN_BM');

// Load all light frames
await CardDataAdapter.loadBatch('CRD_FRM_LT');

// Load all AI copilots  
await CardDataAdapter.loadBatch('CRD_CPT_AI');
```

---

## 📊 **BENEFITS OF THIS SYSTEM**

### **Immediate Gains**
- ✅ **Consistent naming** across all cards
- ✅ **Efficient categorization** for translator
- ✅ **Clear file organization** 
- ✅ **Batch loading capability**
- ✅ **Scalable to 1000+ cards**

### **Long-term Advantages**
- 🚀 **Database optimization** (category-based indexing)
- 🔧 **Easy content management** (find cards by type)
- 🎯 **Automated validation** (naming pattern enforcement)
- 📈 **Performance improvements** (predictable file paths)
- 🛠️ **Development efficiency** (clear conventions)

### **Migration Strategy**
1. **Create migration script** to rename existing files
2. **Update DataLoader** with new path resolution
3. **Enhance CardDataAdapter** with category parsing
4. **Test all existing functionality** 
5. **Document new conventions** for future cards

This naming convention will solve the current ambiguity issues and provide a solid foundation for scaling to hundreds of cards efficiently!