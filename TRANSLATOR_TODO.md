# Card Data Translator Architecture - TODO List

## 🎯 **CRITICAL ARCHITECTURAL REFACTOR**

### **Current Problem**
- JSON cards exist in isolation from RPG Maker's engine
- No integration with $dataSkills, $dataItems, $dataActors
- Hundreds of individual fetch() calls don't scale
- Combat/effects systems can't process card data

### **Solution: ROM-Style Translator Pattern**
Create an adapter that translates JSON cards to RPG Maker format on-demand.

---

## 📋 **IMPLEMENTATION ROADMAP**

### **Phase 1: Core Translator Infrastructure** ⚡ PRIORITY
- [x] **Create CardDataAdapter class** ✅ DONE
  - [x] Translation cache system
  - [x] Card ID pattern detection (`B0015`, `W001`, etc.)
  - [x] JSON → RPG Maker skill format conversion
  - [x] Effect mapping system

- [x] **NEW: Card Naming Convention System** ✅ DONE
  - [x] Standardized naming: `CRD_WPN_BM_RIFLE001`
  - [x] Category codes: PLT, CPT, FRM, WPN, ARM, SYS
  - [x] Subcategory codes: BM, PH, MS (weapons), LT, MD, HV (frames)
  - [x] Migration tool for existing cards
  - [x] Type validation system

- [x] **Engine Integration Points** ✅ DONE
  - [x] Hook into `Game_Action.prototype.item()`
  - [x] Override skill data access methods
  - [x] Intercept battle processing for cards
  - [x] Custom card processing logic

- [x] **Translation Methods** ✅ DONE
  - [x] `translateCard(cardId)` - Main conversion function
  - [x] `translateEffects(cardEffects)` - Effect system mapping
  - [x] `mapCardTypeToIcon(type)` - Visual integration
  - [x] `cacheTranslation(id, data)` - Performance optimization

### **Phase 2: Batch Loading System** 🚀 PERFORMANCE
- [ ] **Batch File Structure**
  ```
  data/cards/batches/
  ├── pilot_batch.json (all pilots)
  ├── weapon_beam_batch.json (beam weapons)
  ├── weapon_physical_batch.json (physical weapons)
  ├── frame_light_batch.json (light frames)
  └── equipment_systems_batch.json (generators, coolers, etc.)
  ```

- [ ] **Batch Loader Implementation**
  - [ ] `loadBatch(batchType)` - Load entire weapon/pilot/frame categories
  - [ ] Smart preloading based on game state
  - [ ] Background loading during gameplay
  - [ ] Memory management for large batches

### **Phase 3: RPG Maker Integration** 🔧 COMPATIBILITY
- [ ] **Database Population Strategy**
  - [ ] Override `DataManager.loadDatabase()`
  - [ ] Populate $dataSkills with translated cards
  - [ ] Maintain separation between cards and standard skills
  - [ ] ID range management (cards use 10000+, skills use 1-9999)

- [ ] **Combat System Integration**
  - [ ] `BattleManager.processCardAction()` - Custom card processing
  - [ ] Damage calculation for card effects
  - [ ] Energy/heat resource management in battle
  - [ ] Mecha-specific battle mechanics

### **Phase 4: Advanced Features** ✨ ENHANCEMENT
- [ ] **Smart Caching System**
  - [ ] LRU cache for frequently used cards
  - [ ] Preload cards based on current mecha loadout
  - [ ] Background translation of related cards
  - [ ] Memory usage monitoring

- [ ] **Development Tools**
  - [ ] Card validation system
  - [ ] Translation debugging tools
  - [ ] Performance monitoring
  - [ ] Hot-reload for card development

---

## 🏗️ **TECHNICAL IMPLEMENTATION**

### **Translator Pattern Example**
```javascript
class CardDataAdapter {
    static async translateCard(cardId) {
        // 1. Check cache
        if (this.cache.has(cardId)) return this.cache.get(cardId);
        
        // 2. Load JSON
        const cardData = await DataLoader.loadItem(cardId);
        
        // 3. Translate to RPG Maker format
        const skill = {
            id: cardId,
            name: cardData.name,
            mpCost: cardData.costs.mental || 0,
            effects: this.translateEffects(cardData.effects),
            // Custom properties
            energyCost: cardData.costs.energy,
            cardType: cardData.type
        };
        
        // 4. Cache and return
        this.cache.set(cardId, skill);
        return skill;
    }
}
```

### **Engine Hook Example**
```javascript
// Intercept skill data requests
const originalItem = Game_Action.prototype.item;
Game_Action.prototype.item = function() {
    if (CardDataAdapter.isCardId(this._item.itemId)) {
        return CardDataAdapter.translateCard(this._item.itemId);
    }
    return originalItem.call(this);
};
```

---

## 🎯 **IMMEDIATE NEXT STEPS**

### **Step 1: Fix Current Crash** ✅ DONE
- [x] Fixed `stats is not defined` error in Window_Loadout

### **Step 2: Create Basic Translator** ✅ DONE
- [x] Create `CardDataAdapter.js` plugin
- [x] Implement basic card ID detection
- [x] Add simple JSON → RPG Maker translation
- [x] Test with existing weapon cards

### **Step 2.5: Card Organization System** ✅ DONE
- [x] Create standardized naming convention
- [x] Build migration tool for existing cards
- [x] Implement type validation system
- [x] Generate migration plan

### **Step 3: Engine Integration** ✅ DONE
- [x] Hook into Game_Action.prototype.item()
- [x] Test card usage in battle
- [x] Verify translation works correctly

### **Step 4: Performance Optimization** 📋 FUTURE
- [ ] Implement caching system
- [ ] Add batch loading
- [ ] Monitor performance with large card sets

---

## 🔍 **TESTING STRATEGY**

### **Unit Tests**
- [ ] Card ID pattern detection
- [ ] JSON → RPG Maker translation accuracy
- [ ] Cache hit/miss ratios
- [ ] Memory usage under load

### **Integration Tests**
- [ ] Card usage in battle
- [ ] Mecha equipment system compatibility
- [ ] UI display of translated cards
- [ ] Save/load with cached translations

### **Performance Tests**
- [ ] Translation speed benchmarks
- [ ] Memory usage with 100+ cards
- [ ] Batch loading vs individual loading
- [ ] Cache effectiveness metrics

---

## 💡 **ARCHITECTURAL BENEFITS**

### **Immediate Gains**
- ✅ JSON cards work with RPG Maker's engine
- ✅ On-demand loading (only translate what's used)
- ✅ Maintains flexible JSON structure
- ✅ No massive startup database population

### **Long-term Advantages**
- 🚀 Scales to hundreds of cards efficiently
- 🔧 Easy to add new card types
- 🎯 Clean separation of concerns
- 📈 Performance optimizations possible
- 🛠️ Development-friendly (hot-reload, validation)

This translator pattern is the cleanest solution - it bridges your flexible JSON system with RPG Maker's engine requirements without forcing you to abandon either approach.