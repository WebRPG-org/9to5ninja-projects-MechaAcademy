/*:
 * @target MZ
 * @plugindesc [v1.0.0] Simple Data Loader
 * @author YourName
 * @help DataLoader.js
 * 
 * Basic data loading system for mecha academy.
 */

(() => {
    'use strict';
    
    class SimpleDataLoader {
        constructor() {
            this.items = {};
            this.isLoaded = false;
        }
        
        async loadItem(itemId) {
            if (this.items[itemId]) {
                return this.items[itemId];
            }
            
            try {
                const path = this.getItemPath(itemId);
                if (!path) {
                    throw new Error(`No path found for item: ${itemId}`);
                }
                
                let response = await fetch(path);
                
                // For frames, if subdirectory fails, try root directory
                if (!response.ok && itemId.startsWith('CRD_FRM_')) {
                    const fallbackPath = `data/cards/equipment/systems/frames/${itemId}.json`;
                    if (path !== fallbackPath) {
                        console.log(`Trying fallback path for ${itemId}: ${fallbackPath}`);
                        response = await fetch(fallbackPath);
                    }
                }
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const item = await response.json();
                this.items[itemId] = item;
                console.log(`Loaded: ${itemId}`, item);
                return item;
            } catch (error) {
                console.error(`Failed to load ${itemId}:`, error);
                return null;
            }
        }
        

        getItemPath(itemId) {
            // Handle new card format using CardTypeSystem
            if (itemId.startsWith('CRD_')) {
                if (window.CardTypeSystem) {
                    const path = window.CardTypeSystem.getCardPath(itemId);
                    if (path) return path;
                }
                
                console.warn(`CardTypeSystem not available for path resolution: ${itemId}`);
                return null;
            }
            
            // Handle legacy card format (for existing cards before migration)
            if (itemId.startsWith('card_pilot_')) {
                return `data/cards/pilots/${itemId}.json`;
            }
            if (itemId.startsWith('card_copilot_')) {
                return `data/cards/copilots/${itemId}.json`;
            }
            if (itemId.startsWith('card_frame_')) {
                return `data/cards/equipment/systems/frames/${itemId}.json`;
            }
            if (itemId.startsWith('card_equipment_')) {
                // Try to determine equipment type from name
                if (itemId.includes('beam') || itemId.includes('laser') || itemId.includes('rifle') || itemId.includes('cannon')) {
                    return `data/cards/equipment/weapons/beam/${itemId}.json`;
                }
                if (itemId.includes('missile') || itemId.includes('rocket')) {
                    return `data/cards/equipment/weapons/projectile/${itemId}.json`;
                }
                if (itemId.includes('armor') || itemId.includes('plating')) {
                    if (itemId.includes('head')) return `data/cards/equipment/armor/head/${itemId}.json`;
                    if (itemId.includes('torso') || itemId.includes('chest')) return `data/cards/equipment/armor/torso/${itemId}.json`;
                    if (itemId.includes('arm')) return `data/cards/equipment/armor/arms/${itemId}.json`;
                    if (itemId.includes('leg')) return `data/cards/equipment/armor/legs/${itemId}.json`;
                    return `data/cards/equipment/armor/${itemId}.json`;
                }
                if (itemId.includes('generator') || itemId.includes('reactor')) {
                    return `data/cards/equipment/systems/generators/${itemId}.json`;
                }
                if (itemId.includes('heatsink') || itemId.includes('cooler') || itemId.includes('cooling')) {
                    return `data/cards/equipment/systems/coolers/${itemId}.json`;
                }
                if (itemId.includes('_os') || itemId.includes('operating')) {
                    return `data/cards/equipment/systems/os/${itemId}.json`;
                }
                return `data/cards/equipment/${itemId}.json`;
            }
            
            console.warn(`Unknown item type or format: ${itemId}`);
            return null;
        }

        async loadPilot(pilotId) {
            return this.loadItem(pilotId);
        }

        async loadCopilot(copilotId) {
            return this.loadItem(copilotId);
        }

        async createBasicLoadout() {
            // Use new card format - these should exist after migration
            const pilot = await this.loadItem('CRD_PLT_VET_ALEX001');
            const copilot = await this.loadItem('CRD_CPT_AI_ARIA001');
            const frame = await this.loadItem('CRD_FRM_LT_SCOUT001');
            return { pilot, copilot, frame };
        }
        
        async testLoad() {
            console.log('=== Testing Data Loader (New Format) ===');
            
            // Test loading with new card format
            const testItems = [
                'CRD_FRM_LT_SCOUT001',      // Light Scout Frame
                'CRD_WPN_BM_RIFLE001',      // Beam Rifle
                'CRD_PLT_VET_ALEX001',      // Veteran Pilot Alex
                'CRD_CPT_AI_ARIA001'        // AI Copilot Aria
            ];
            
            const loadedItems = [];
            for (const itemId of testItems) {
                try {
                    const item = await this.loadItem(itemId);
                    if (item) {
                        loadedItems.push(itemId);
                        console.log(`✅ Loaded: ${itemId}`);
                    }
                } catch (error) {
                    console.log(`❌ Failed to load: ${itemId} - ${error.message}`);
                }
            }
            
            console.log('=== Test Complete ===');
            console.log(`Successfully loaded: ${loadedItems.length}/${testItems.length} items`);
            console.log('Loaded items:', loadedItems);
        }
    }
    
    // Make globally available
    window.DataLoader = new SimpleDataLoader();
    
    // Auto-test when plugin loads
    const originalStart = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        originalStart.call(this);
        setTimeout(() => {
            window.DataLoader.testLoad();
        }, 1000);
    };
})();