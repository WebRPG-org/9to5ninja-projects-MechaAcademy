/*:
 * @target MZ
 * @plugindesc [v1.0.0] Academy Menu System - Pilot, Copilot, Frame, and Loadout Management
 * @author YourName
 *
 * Main menu for managing pilots, copilots, frames, and loadouts in the academy.
 * Replaces default menu items with mecha academy specific options.
 */

(() => {
    'use strict';

    // Card naming helper - uses CardTypeSystem for consistent naming
    class CardNamingHelper {
        // Convert card ID to display name using CardTypeSystem
        static getDisplayName(cardId) {
            if (!cardId) return 'Unknown';
            
            // Only support new format: CRD_PLT_VET_ALEX001
            if (!cardId.startsWith('CRD_')) {
                console.warn(`Invalid card ID format: ${cardId}. Expected CRD_ format.`);
                return cardId;
            }
            
            // Use CardTypeSystem if available
            if (window.CardTypeSystem) {
                const typeInfo = window.CardTypeSystem.getTypeInfo(cardId);
                if (typeInfo) {
                    return typeInfo.displayName;
                }
            }
            
            // Fallback parsing if CardTypeSystem not available
            return this.parseCardId(cardId);
        }
        
        static parseCardId(cardId) {
            const parts = cardId.split('_');
            if (parts.length < 4) return cardId;
            
            const category = parts[1];
            const subcategory = parts[2];
            const identifier = parts[3];
            
            // Use CardTypeSystem mappings if available
            if (window.CardTypeSystem) {
                const categoryInfo = window.CardTypeSystem.cardTypes.get(category);
                const subcategoryInfo = window.CardTypeSystem.subcategories.get(subcategory);
                
                if (categoryInfo && subcategoryInfo) {
                    // Fix the regex to properly add spaces between lowercase and uppercase
                    const itemName = identifier.replace(/\d+$/, '').replace(/([a-z])([A-Z])/g, '$1 $2');
                    return `${subcategoryInfo.name} ${itemName}`;
                }
            }
            
            // Basic fallback - fix the regex pattern
            let itemName = identifier.replace(/\d+$/, ''); // Remove trailing numbers
            itemName = itemName.replace(/([a-z])([A-Z])/g, '$1 $2'); // Add spaces between lowercase and uppercase
            
            // For frames, just return the item name + "Frame"
            if (category === 'FRM') {
                return `${itemName} Frame`;
            }
            
            // For other items, include subcategory if needed
            return itemName;
        }
        
        // Get card category
        static getCategory(cardId) {
            if (!cardId || !cardId.startsWith('CRD_')) {
                console.warn(`Invalid card ID format: ${cardId}`);
                return 'UNKNOWN';
            }
            
            const parts = cardId.split('_');
            return parts[1] || 'UNKNOWN';
        }
        
        // Check if card ID is valid format (only new format)
        static isValidCardId(cardId) {
            if (!cardId || typeof cardId !== 'string') return false;
            
            // Only accept new format
            if (!cardId.startsWith('CRD_')) return false;
            
            // Use CardTypeSystem validation if available
            if (window.CardTypeSystem) {
                const validation = window.CardTypeSystem.validateCardId(cardId);
                return validation.valid;
            }
            
            // Basic format check
            const parts = cardId.split('_');
            return parts.length >= 4;
        }
        
        // Get card file path using CardTypeSystem
        static getCardPath(cardId) {
            if (window.CardTypeSystem) {
                return window.CardTypeSystem.getCardPath(cardId);
            }
            
            console.warn('CardTypeSystem not available for path resolution');
            return null;
        }
    }

    // Expose CardNamingHelper globally for use by other systems
    window.CardNamingHelper = CardNamingHelper;

    // Override the main menu commands to replace default items with mecha academy options
    Window_MenuCommand.prototype.makeCommandList = function() {
        this.addCommand('Mecha Hangar', 'mechaHangar', true);
        this.addCommand('Pilot Status', 'pilotStatus', true);
        this.addCommand('Academy Training', 'training', true);
        this.addCommand('Save Game', 'save', this.isSaveEnabled());
        this.addCommand('Game End', 'gameEnd', true);
    };

    // Add handlers for custom menu commands
    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('mechaHangar', this.commandMechaHangar.bind(this));
        this._commandWindow.setHandler('pilotStatus', this.commandPilotStatus.bind(this));
        this._commandWindow.setHandler('training', this.commandTraining.bind(this));
    };

    // Command handlers for the main menu
    Scene_Menu.prototype.commandMechaHangar = function() {
        SceneManager.push(Scene_AcademyMenu);
    };

    Scene_Menu.prototype.commandPilotStatus = function() {
        SceneManager.push(Scene_PilotStatus);
    };

    Scene_Menu.prototype.commandTraining = function() {
        SceneManager.push(Scene_Training);
    };

    // Entry point: call window.showAcademyMenu() to open the menu directly
    window.showAcademyMenu = function() {
        SceneManager.push(Scene_AcademyMenu);
    };

    // Main Academy Menu Scene (Mecha Hangar)
    class Scene_AcademyMenu extends Scene_MenuBase {
        create() {
            super.create();
            this.createPilotWindow();
            this.createCopilotWindow();
            this.createFrameWindow();
            this.createLoadoutWindow();
            this.createCommandWindow();
        }

        createPilotWindow() {
            const rect = new Rectangle(0, 0, 300, 180);
            this._pilotWindow = new Window_CardInfo(rect, 'pilot');
            this._pilotWindow.deactivate(); // Info windows should not be selectable
            this.addWindow(this._pilotWindow);
        }

        createCopilotWindow() {
            const rect = new Rectangle(0, 180, 300, 180);
            this._copilotWindow = new Window_CardInfo(rect, 'copilot');
            this._copilotWindow.deactivate(); // Info windows should not be selectable
            this.addWindow(this._copilotWindow);
        }

        createFrameWindow() {
            const rect = new Rectangle(0, 360, 300, 180);
            this._frameWindow = new Window_CardInfo(rect, 'frame');
            this._frameWindow.deactivate(); // Info windows should not be selectable
            this.addWindow(this._frameWindow);
        }

        createLoadoutWindow() {
            const rect = new Rectangle(300, 0, 540, 360);
            this._loadoutWindow = new Window_Loadout(rect);
            this._loadoutWindow.deactivate(); // Loadout window should not be selectable
            this.addWindow(this._loadoutWindow);
        }

        createCommandWindow() {
            const rect = new Rectangle(300, 360, 540, 120);
            this._commandWindow = new Window_AcademyCommands(rect);
            this._commandWindow.setHandler('equip', this.commandEquip.bind(this));
            this._commandWindow.setHandler('equipment', this.commandEquipment.bind(this));
            this._commandWindow.setHandler('switch', this.commandSwitch.bind(this));
            this._commandWindow.setHandler('stats', this.commandStats.bind(this));
            this._commandWindow.setHandler('train', this.commandTrain.bind(this));
            this._commandWindow.setHandler('cancel', this.popScene.bind(this));
            this.addWindow(this._commandWindow);
        }

        // Equip command: open character selection window
        commandEquip() {
            this.openEquipCharacterSelect();
        }

        // Equipment command: direct access to equipment customization
        commandEquipment() {
            this.openEquipmentSelect();
        }

        openEquipCharacterSelect() {
            if (this._equipCharacterWindow) {
                this._equipCharacterWindow.close();
                this.removeChild(this._equipCharacterWindow);
            }
            const rect = new Rectangle(340, 120, 260, 180);
            this._equipCharacterWindow = new Window_EquipCharacterSelect(rect);
            this._equipCharacterWindow.setHandler('ok', this.onEquipCharacterOk.bind(this));
            this._equipCharacterWindow.setHandler('cancel', this.onEquipCharacterCancel.bind(this));
            this.addChild(this._equipCharacterWindow);
            this.deactivateAllInfoWindows(); // Deactivate all windows to prevent navigation bleeding
            this._equipCharacterWindow.activate();
        }

        onEquipCharacterOk() {
            const symbol = this._equipCharacterWindow.currentSymbol();
            this.onEquipCharacterCancel(); // Close the character select window
            
            // Open appropriate equipment selection based on choice
            if (symbol === 'pilot') {
                this.openPilotSelect();
            } else if (symbol === 'copilot') {
                this.openCopilotSelect();
            } else if (symbol === 'frame') {
                this.openFrameClassSelect(); // Weight class selection first
            }
        }

        openPilotSelect() {
            const rect = new Rectangle(300, 120, 300, 250);
            this._equipSelectWindow = new Window_PilotSelect(rect);
            this._equipSelectWindow.setHandler('ok', this.onPilotSelectOk.bind(this));
            this._equipSelectWindow.setHandler('cancel', this.onEquipSelectCancel.bind(this));
            this.addChild(this._equipSelectWindow);
            this.deactivateAllInfoWindows(); // Deactivate all windows to prevent navigation bleeding
            this._equipSelectWindow.activate();
        }

        openCopilotSelect() {
            const rect = new Rectangle(300, 120, 300, 250);
            this._equipSelectWindow = new Window_CopilotSelect(rect);
            this._equipSelectWindow.setHandler('ok', this.onCopilotSelectOk.bind(this));
            this._equipSelectWindow.setHandler('cancel', this.onEquipSelectCancel.bind(this));
            this.addChild(this._equipSelectWindow);
            this.deactivateAllInfoWindows(); // Deactivate all windows to prevent navigation bleeding
            this._equipSelectWindow.activate();
        }

        openFrameClassSelect() {
            const rect = new Rectangle(300, 120, 300, 200);
            this._equipSelectWindow = new Window_FrameClassSelect(rect);
            this._equipSelectWindow.setHandler('ok', this.onFrameClassSelectOk.bind(this));
            this._equipSelectWindow.setHandler('cancel', this.onEquipSelectCancel.bind(this));
            this.addChild(this._equipSelectWindow);
            this.deactivateAllInfoWindows(); // Deactivate all windows to prevent navigation bleeding
            this._equipSelectWindow.activate();
        }

        onFrameClassSelectOk() {
            const frameClass = this._equipSelectWindow.getCurrentFrameClass();
            this.onEquipSelectCancel(); // Close the frame class window
            
            if (frameClass) {
                this.openFrameSelect(frameClass);
            }
        }

        openFrameSelect(frameClass) {
            const rect = new Rectangle(300, 120, 300, 250);
            this._equipSelectWindow = new Window_FrameSelect(rect, frameClass);
            this._equipSelectWindow.setHandler('ok', this.onFrameSelectOk.bind(this));
            this._equipSelectWindow.setHandler('cancel', this.onFrameSelectCancel.bind(this));
            this.addChild(this._equipSelectWindow);
            this.deactivateAllInfoWindows(); // Deactivate all windows to prevent navigation bleeding
            this._equipSelectWindow.activate();
        }

        onFrameSelectCancel() {
            this.onEquipSelectCancel(); // Close frame select
            this.openFrameClassSelect(); // Return to weight class selection
        }

        openWeaponSelect() {
            const rect = new Rectangle(300, 120, 300, 250);
            this._equipSelectWindow = new Window_WeaponSelect(rect);
            this._equipSelectWindow.setHandler('ok', this.onWeaponSelectOk.bind(this));
            this._equipSelectWindow.setHandler('cancel', this.onEquipSelectCancel.bind(this));
            this.addChild(this._equipSelectWindow);
            this.deactivateAllInfoWindows(); // Deactivate all windows to prevent navigation bleeding
            this._equipSelectWindow.activate();
        }

        openArmorSelect() {
            const rect = new Rectangle(300, 120, 300, 250);
            this._equipSelectWindow = new Window_ArmorSelect(rect);
            this._equipSelectWindow.setHandler('ok', this.onArmorSelectOk.bind(this));
            this._equipSelectWindow.setHandler('cancel', this.onEquipSelectCancel.bind(this));
            this.addChild(this._equipSelectWindow);
            this.deactivateAllInfoWindows(); // Deactivate all windows to prevent navigation bleeding
            this._equipSelectWindow.activate();
        }

        openSystemSelect() {
            const rect = new Rectangle(300, 120, 300, 250);
            this._equipSelectWindow = new Window_SystemSelect(rect);
            this._equipSelectWindow.setHandler('ok', this.onSystemSelectOk.bind(this));
            this._equipSelectWindow.setHandler('cancel', this.onEquipSelectCancel.bind(this));
            this.addChild(this._equipSelectWindow);
            this.deactivateAllInfoWindows(); // Deactivate all windows to prevent navigation bleeding
            this._equipSelectWindow.activate();
        }

        async onPilotSelectOk() {
            const pilotId = this._equipSelectWindow.getCurrentItemId();
            const activeMecha = window.MechaCompositeManager?.getActiveMecha();
            
            // Check if trying to equip the same pilot that's already equipped
            if (activeMecha && activeMecha.pilot && activeMecha.pilot.id === pilotId) {
                this.showPlaceholder('This pilot is already equipped!');
                return;
            }
            
            const activeMechaIndex = window.MechaCompositeManager?.getMechaRoster().indexOf(activeMecha) || 0;
            
            try {
                console.log('About to call swapPilot...');
                const swapResult = await Promise.race([
                    window.MechaCompositeManager?.swapPilot(activeMechaIndex, pilotId),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
                ]);
                
                console.log('SwapPilot returned result:', swapResult);
                console.log('About to process result...');
                
                if (swapResult) {
                    console.log('SwapPilot successful, refreshing UI...');
                    
                    // Re-enable UI refresh now that freeze is fixed
                    setTimeout(() => {
                        console.log('Refreshing UI after successful pilot swap...');
                        this.refreshAllWindows();
                        console.log('UI refresh completed');
                    }, 100);
                    
                    console.log('SUCCESS: Maya Torres equipped successfully!');
                    
                    // Show success message using simple method
                    this.showSimplePlaceholder('Pilot changed successfully!');
                } else {
                    console.log('SwapPilot failed');
                    console.log('FAILED: Could not equip Maya Torres');
                }
                
                console.log('=== PILOT SELECTION PROCESS COMPLETE ===');
                
                // CRITICAL: Close the selection window to prevent freeze
                console.log('Closing pilot selection window...');
                this.onEquipSelectCancel();
                console.log('Window closed, should be safe now');
            } catch (error) {
                console.error('Error in pilot selection:', error);
                if (error.message === 'Timeout') {
                    this.showPlaceholder('Pilot change timed out!');
                } else {
                    this.showPlaceholder('Error changing pilot!');
                }
            }
            // Keep window open for more selections - don't call onEquipSelectCancel()
        }

        async onCopilotSelectOk() {
            const copilotId = this._equipSelectWindow.getCurrentItemId();
            const activeMecha = window.MechaCompositeManager?.getActiveMecha();
            
            // Check if trying to equip the same copilot that's already equipped
            if (activeMecha && activeMecha.copilot && activeMecha.copilot.id === copilotId) {
                this.showSimplePlaceholder('This copilot is already equipped!');
                return;
            }
            
            const activeMechaIndex = window.MechaCompositeManager?.getMechaRoster().indexOf(activeMecha) || 0;
            
            try {
                console.log('About to call swapCopilot...');
                const swapResult = await Promise.race([
                    window.MechaCompositeManager?.swapCopilot(activeMechaIndex, copilotId),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
                ]);
                
                console.log('SwapCopilot returned result:', swapResult);
                console.log('About to process copilot result...');
                
                if (swapResult) {
                    console.log('SwapCopilot successful, refreshing UI...');
                    
                    // Re-enable UI refresh now that freeze is fixed
                    setTimeout(() => {
                        console.log('Refreshing UI after successful copilot swap...');
                        this.refreshAllWindows();
                        console.log('Copilot UI refresh completed');
                    }, 100);
                    
                    console.log('SUCCESS: Copilot equipped successfully!');
                    
                    // Show success message using simple method
                    this.showSimplePlaceholder('Copilot changed successfully!');
                } else {
                    console.log('SwapCopilot failed');
                    console.log('FAILED: Could not equip copilot');
                }
                
                console.log('=== COPILOT SELECTION PROCESS COMPLETE ===');
                
                // CRITICAL: Close the selection window to prevent freeze
                console.log('Closing copilot selection window...');
                this.onEquipSelectCancel();
                console.log('Copilot window closed, should be safe now');
            } catch (error) {
                console.error('Error in copilot selection:', error);
                if (error.message === 'Timeout') {
                    this.showSimplePlaceholder('Copilot change timed out!');
                } else {
                    this.showSimplePlaceholder('Error changing copilot!');
                }
                // Still close the window even on error
                this.onEquipSelectCancel();
            }
        }

        async onFrameSelectOk() {
            const frameId = this._equipSelectWindow.getCurrentItemId();
            const activeMecha = window.MechaCompositeManager?.getActiveMecha();
            
            if (frameId) {
                // Check if trying to equip the same frame that's already equipped
                if (activeMecha && activeMecha.frame && activeMecha.frame.id === frameId) {
                    this.showSimplePlaceholder('This frame is already equipped!');
                    return;
                }
                
                try {
                    console.log('About to swap frame:', frameId);
                    const activeMechaIndex = window.MechaCompositeManager?.getMechaRoster().indexOf(activeMecha) || 0;
                    
                    const swapResult = await Promise.race([
                        window.MechaCompositeManager?.swapFrame(activeMechaIndex, frameId),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
                    ]);
                    
                    console.log('Frame swap result:', swapResult);
                    
                    if (swapResult) {
                        console.log('Frame swapped successfully, refreshing UI immediately...');
                        this.refreshAllWindows();
                        console.log('Frame UI refresh completed');
                        this.showSimplePlaceholder('Frame changed successfully!');
                        
                        // Then offer customization options
                        this.onEquipSelectCancel(); // Close frame select
                        this.openFrameCustomizationMenu();
                    } else {
                        console.log('Frame swap failed');
                        this.showSimplePlaceholder('Failed to change frame!');
                        this.onEquipSelectCancel();
                    }
                } catch (error) {
                    console.error('Frame swap error:', error);
                    if (error.message === 'Timeout') {
                        this.showSimplePlaceholder('Frame change timed out!');
                    } else {
                        this.showSimplePlaceholder('Error changing frame!');
                    }
                    this.onEquipSelectCancel();
                }
            } else {
                this.onEquipSelectCancel();
            }
        }

        openFrameCustomizationMenu() {
            const rect = new Rectangle(300, 120, 300, 200);
            this._equipSelectWindow = new Window_FrameCustomizationSelect(rect);
            this._equipSelectWindow.setHandler('ok', this.onFrameCustomizationSelectOk.bind(this));
            this._equipSelectWindow.setHandler('cancel', this.onEquipSelectCancel.bind(this));
            this.addChild(this._equipSelectWindow);
            this.deactivateAllInfoWindows();
            this._equipSelectWindow.activate();
        }

        onFrameCustomizationSelectOk() {
            const customizationType = this._equipSelectWindow.currentSymbol();
            this.onEquipSelectCancel(); // Close customization menu
            
            if (customizationType === 'weapons') {
                this.openWeaponSelect();
            } else if (customizationType === 'armor') {
                this.openArmorSelect();
            } else if (customizationType === 'systems') {
                this.openSystemSelect();
            } else if (customizationType === 'save') {
                this.saveCurrentMechaAsPreset();
            } else if (customizationType === 'done') {
                // Just close and return to main menu
                return;
            }
        }

        // Direct equipment selection menu (same as frame customization but accessible from main menu)
        openEquipmentSelect() {
            const rect = new Rectangle(300, 120, 300, 200);
            this._equipSelectWindow = new Window_FrameEquipmentSelect(rect);
            this._equipSelectWindow.setHandler('ok', this.onEquipmentSelectOk.bind(this));
            this._equipSelectWindow.setHandler('cancel', this.onEquipSelectCancel.bind(this));
            this.addChild(this._equipSelectWindow);
            this.deactivateAllInfoWindows();
            this._equipSelectWindow.activate();
        }

        onEquipmentSelectOk() {
            const equipmentType = this._equipSelectWindow.currentSymbol();
            this.onEquipSelectCancel(); // Close equipment menu
            
            if (equipmentType === 'weapons') {
                this.openWeaponSelect();
            } else if (equipmentType === 'armor') {
                this.openArmorSelect();
            } else if (equipmentType === 'systems') {
                this.openSystemSelect();
            }
        }

        saveCurrentMechaAsPreset() {
            const activeMecha = window.MechaCompositeManager?.getActiveMecha();
            if (activeMecha) {
                try {
                    console.log('About to save mecha preset...');
                    // Add current mecha configuration to roster as a new preset
                    const success = window.MechaCompositeManager?.addMechaPreset(activeMecha);
                    console.log('Preset save result:', success);
                    
                    if (success) {
                        this.showSimplePlaceholder('Mecha preset saved! Available in Switch Mecha.');
                    } else {
                        this.showSimplePlaceholder('Failed to save preset.');
                    }
                } catch (error) {
                    console.error('Preset save error:', error);
                    this.showSimplePlaceholder('Error saving preset!');
                }
            }
        }

        openFrameEquipmentMenu() {
            const rect = new Rectangle(300, 120, 300, 200);
            this._equipSelectWindow = new Window_FrameEquipmentSelect(rect);
            this._equipSelectWindow.setHandler('ok', this.onFrameEquipmentSelectOk.bind(this));
            this._equipSelectWindow.setHandler('cancel', this.onEquipSelectCancel.bind(this));
            this.addChild(this._equipSelectWindow);
            this.deactivateAllInfoWindows();
            this._equipSelectWindow.activate();
        }

        onFrameEquipmentSelectOk() {
            const equipmentType = this._equipSelectWindow.currentSymbol();
            this.onEquipSelectCancel(); // Close equipment menu
            
            if (equipmentType === 'weapons') {
                this.openWeaponSelect();
            } else if (equipmentType === 'armor') {
                this.openArmorSelect();
            } else if (equipmentType === 'systems') {
                this.openSystemSelect();
            }
        }

        async onWeaponSelectOk() {
            const weaponId = this._equipSelectWindow.getCurrentItemId();
            const activeMecha = window.MechaCompositeManager?.getActiveMecha();
            
            if (!weaponId) {
                this.showSimplePlaceholder('No weapon selected!');
                return;
            }
            
            if (activeMecha) {
                try {
                    console.log('About to equip weapon:', weaponId);
                    const result = await Promise.race([
                        activeMecha.equipWeapon(weaponId),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
                    ]);
                    
                    console.log('Weapon equip result:', result);
                    
                    if (result && result.success) {
                        console.log('Weapon equipped successfully, refreshing UI immediately...');
                        this.refreshAllWindows();
                        console.log('Weapon UI refresh completed');
                        this.showSimplePlaceholder(`Weapon equipped to ${result.assignedSlot}!`);
                        
                        // CRITICAL: Close window after successful equipping to prevent freeze
                        console.log('Closing weapon selection window to prevent freeze...');
                        this.onEquipSelectCancel();
                        console.log('Weapon selection window closed');
                    } else {
                        console.log('Weapon equip failed:', result?.error);
                        this.showSimplePlaceholder(`Failed: ${result?.error || 'Unknown error'}`);
                        
                        // CRITICAL: Close window after failed equipping to prevent freeze
                        console.log('Closing weapon selection window after failure to prevent freeze...');
                        this.onEquipSelectCancel();
                        console.log('Weapon selection window closed after failure');
                    }
                } catch (error) {
                    console.error('Weapon equip error:', error);
                    if (error.message === 'Timeout') {
                        this.showSimplePlaceholder('Weapon equip timed out!');
                    } else {
                        this.showSimplePlaceholder('Error equipping weapon!');
                    }
                    // Close window on error too
                    this.onEquipSelectCancel();
                }
            }
        }

        async onArmorSelectOk() {
            const armorId = this._equipSelectWindow.getCurrentItemId();
            const slot = this._equipSelectWindow.getSelectedSlot();
            const activeMecha = window.MechaCompositeManager?.getActiveMecha();
            
            if (!armorId) {
                this.showSimplePlaceholder('No armor selected!');
                return;
            }
            
            if (!slot) {
                this.showSimplePlaceholder('No armor slot selected!');
                return;
            }
            
            if (activeMecha) {
                try {
                    console.log('About to equip armor:', armorId, 'to slot:', slot);
                    const result = await Promise.race([
                        activeMecha.equipArmor(slot, armorId),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
                    ]);
                    
                    console.log('Armor equip result:', result);
                    
                    if (result) {
                        console.log('Armor equipped successfully, refreshing UI immediately...');
                        this.refreshAllWindows();
                        console.log('Armor UI refresh completed');
                        this.showSimplePlaceholder(`${slot} armor equipped!`);
                        
                        // CRITICAL: Close window after successful equipping to prevent freeze
                        console.log('Closing armor selection window to prevent freeze...');
                        this.onEquipSelectCancel();
                        console.log('Armor selection window closed');
                    } else {
                        console.log('Armor equip failed');
                        this.showSimplePlaceholder('Failed to equip armor!');
                        
                        // CRITICAL: Close window after failed equipping to prevent freeze
                        console.log('Closing armor selection window after failure to prevent freeze...');
                        this.onEquipSelectCancel();
                        console.log('Armor selection window closed after failure');
                    }
                } catch (error) {
                    console.error('Armor equip error:', error);
                    if (error.message === 'Timeout') {
                        this.showSimplePlaceholder('Armor equip timed out!');
                    } else {
                        this.showSimplePlaceholder('Error equipping armor!');
                    }
                    // Close window on error too
                    this.onEquipSelectCancel();
                }
            }
        }

        async onSystemSelectOk() {
            const systemId = this._equipSelectWindow.getCurrentItemId();
            const slot = this._equipSelectWindow.getSelectedSlot();
            const activeMecha = window.MechaCompositeManager?.getActiveMecha();
            
            if (!systemId) {
                this.showSimplePlaceholder('No system selected!');
                return;
            }
            
            if (!slot) {
                this.showSimplePlaceholder('No system slot selected!');
                return;
            }
            
            if (activeMecha) {
                try {
                    console.log('About to equip system:', systemId, 'to slot:', slot);
                    const result = await Promise.race([
                        activeMecha.equipSystem(slot, systemId),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
                    ]);
                    
                    console.log('System equip result:', result);
                    
                    if (result) {
                        console.log('System equipped successfully, refreshing UI immediately...');
                        this.refreshAllWindows();
                        console.log('System UI refresh completed');
                        this.showSimplePlaceholder(`${slot} system equipped!`);
                        
                        // CRITICAL: Close window after successful equipping to prevent freeze
                        console.log('Closing system selection window to prevent freeze...');
                        this.onEquipSelectCancel();
                        console.log('System selection window closed');
                    } else {
                        console.log('System equip failed');
                        this.showSimplePlaceholder('Failed to equip system!');
                        
                        // CRITICAL: Close window after failed equipping to prevent freeze
                        console.log('Closing system selection window after failure to prevent freeze...');
                        this.onEquipSelectCancel();
                        console.log('System selection window closed after failure');
                    }
                } catch (error) {
                    console.error('System equip error:', error);
                    if (error.message === 'Timeout') {
                        this.showSimplePlaceholder('System equip timed out!');
                    } else {
                        this.showSimplePlaceholder('Error equipping system!');
                    }
                    // Close window on error too
                    this.onEquipSelectCancel();
                }
            }
        }

        onEquipSelectCancel() {
            if (this._equipSelectWindow) {
                this._equipSelectWindow.close();
                this.removeChild(this._equipSelectWindow);
                this._equipSelectWindow = null;
            }
            this._commandWindow.activate();
        }

        onEquipCharacterCancel() {
            this._equipCharacterWindow.close();
            this.removeChild(this._equipCharacterWindow);
            this._commandWindow.activate();
        }

        commandStats() {
            // Show detailed composite stats
            const activeMecha = window.MechaCompositeManager?.getActiveMecha();
            if (!activeMecha) {
                this.showPlaceholder('No active mecha to analyze!');
                return;
            }

            try {
                const displayInfo = activeMecha.getDisplayInfo();
                const stats = displayInfo.stats || {};
                
                // Build comprehensive stats message
                const lines = [];
                lines.push(`=== ${displayInfo.name} ===`);
                lines.push(`Combat Rating: ${stats.combatRating || 0}`);
                lines.push(`Pilot Efficiency: ${Math.floor((stats.pilotEfficiency || 0) * 100)}%`);
                lines.push(`Copilot Bonus: +${Math.floor((stats.copilotBonus || 0) * 100)}%`);
                lines.push('');
                lines.push('=== Core Stats ===');
                lines.push(`ATK: ${stats.atk || 0} | DEF: ${stats.def || 0}`);
                lines.push(`MAT: ${stats.mat || 0} | MDF: ${stats.mdf || 0}`);
                lines.push(`AGI: ${stats.agi || 0} | LUK: ${stats.luk || 0}`);
                lines.push('');
                lines.push('=== Mecha Stats ===');
                lines.push(`Armor: ${stats.armor || 0}`);
                lines.push(`Speed: ${stats.speed || 0}`);
                lines.push(`Energy: ${stats.energyCapacity || 0}`);
                lines.push(`Heat Dissipation: ${stats.heatDissipation || 0}`);
                
                // Add resource usage if available
                if (activeMecha.getCurrentWeight && activeMecha.getCurrentEnergyDrain) {
                    const currentWeight = activeMecha.getCurrentWeight();
                    const currentEnergy = activeMecha.getCurrentEnergyDrain();
                    const maxWeight = stats.weightLimit || 100;
                    const maxEnergy = stats.energyCapacity || 200;
                    
                    lines.push('');
                    lines.push('=== Resource Usage ===');
                    lines.push(`Weight: ${currentWeight}/${maxWeight}`);
                    lines.push(`Energy Drain: ${currentEnergy}/${maxEnergy}`);
                }
                
                this.showDetailedStats(lines.join('\n'));
            } catch (error) {
                console.error('Stats display error:', error);
                this.showPlaceholder('Error displaying stats - check console');
            }
        }

        showDetailedStats(message) {
            if (this._statsWindow) {
                this._statsWindow.close();
                this.removeChild(this._statsWindow);
            }
            const rect = new Rectangle(200, 50, 600, 500);
            this._statsWindow = new Window_Base(rect);
            
            // Draw multi-line text
            const lines = message.split('\n');
            let y = 0;
            this._statsWindow.contents.fontSize = 16;
            
            for (const line of lines) {
                if (line.startsWith('===')) {
                    this._statsWindow.contents.fontBold = true;
                    this._statsWindow.drawText(line, 0, y, 580, 'center');
                    this._statsWindow.contents.fontBold = false;
                } else if (line.trim() === '') {
                    // Empty line for spacing
                } else {
                    this._statsWindow.drawText(line, 10, y, 570, 'left');
                }
                y += 20;
            }
            
            this.addChild(this._statsWindow);
            
            // Auto-close after 5 seconds
            setTimeout(() => {
                if (this._statsWindow) {
                    this._statsWindow.close();
                    this.removeChild(this._statsWindow);
                    this._statsWindow = null;
                }
            }, 5000);
        }

        commandTrain() {
            try {
                console.log('[TRAINING] commandTrain called - attempting to start training battle');
                
                // Check if training battle system is available
                if (!window.Scene_TrainingBattle) {
                    console.error('[TRAINING] Scene_TrainingBattle not found! Training Battle System may not be loaded.');
                    this.showPlaceholder('Training Battle System not loaded!');
                    return;
                }
                
                // Check if player has an active mecha
                const playerMecha = window.MechaCompositeManager?.getActiveMecha();
                console.log('[TRAINING] Player mecha check:', playerMecha);
                
                if (!playerMecha) {
                    console.error('[TRAINING] No active mecha found!');
                    this.showPlaceholder('No active mecha! Equip a mecha first.');
                    return;
                }
                
                console.log('[TRAINING] All checks passed, launching training battle...');
                console.log('[TRAINING] Player mecha details:', {
                    name: playerMecha.name,
                    pilot: playerMecha.pilot?.name,
                    copilot: playerMecha.copilot?.name,
                    hasDeck: !!playerMecha.combatDeck,
                    deckSize: playerMecha.combatDeck?.cards?.length || 0
                });
                
                // Launch the training battle scene
                SceneManager.push(Scene_TrainingBattle);
                console.log('[TRAINING] Training battle scene pushed to SceneManager');
                
            } catch (error) {
                console.error('[TRAINING] Error in commandTrain:', error);
                this.showPlaceholder('Error starting training battle!');
            }
        }

        commandSwitch() {
            this.openMechaSelect();
        }

        openMechaSelect() {
            try {
                const roster = window.MechaCompositeManager?.getMechaRoster() || [];
                console.log(`🔍 Mecha roster:`, roster);
                
                if (roster.length <= 1) {
                    this.showPlaceholder('Only one mecha available! Create presets to switch between.');
                    return;
                }

                if (this._mechaSelectWindow) {
                    this._mechaSelectWindow.close();
                    this.removeChild(this._mechaSelectWindow);
                }
                
                const rect = new Rectangle(340, 120, 260, 200);
                this._mechaSelectWindow = new Window_MechaSelect(rect);
                this._mechaSelectWindow.setHandler('ok', this.onMechaSelectOk.bind(this));
                this._mechaSelectWindow.setHandler('cancel', this.onMechaSelectCancel.bind(this));
                this.addChild(this._mechaSelectWindow);
                this._mechaSelectWindow.activate();
                this._commandWindow.deactivate();
            } catch (error) {
                console.error('❌ Error opening mecha select:', error);
                this.showPlaceholder('Error opening mecha selection.');
            }
        }

        onMechaSelectOk() {
            const index = this._mechaSelectWindow.index();
            if (window.MechaCompositeManager?.setActiveMecha(index)) {
                this.refreshAllWindows();
                this.showPlaceholder('Mecha switched successfully!');
            }
            this.onMechaSelectCancel();
        }

        onMechaSelectCancel() {
            if (this._mechaSelectWindow) {
                this._mechaSelectWindow.close();
                this.removeChild(this._mechaSelectWindow);
                this._mechaSelectWindow = null;
            }
            this._commandWindow.activate();
        }

        // Deactivate all info windows to prevent navigation bleeding
        deactivateAllInfoWindows() {
            if (this._pilotWindow) this._pilotWindow.deactivate();
            if (this._copilotWindow) this._copilotWindow.deactivate();
            if (this._frameWindow) this._frameWindow.deactivate();
            if (this._loadoutWindow) this._loadoutWindow.deactivate();
            if (this._commandWindow) this._commandWindow.deactivate();
        }

        // Refresh all windows to show updated mecha data
        refreshAllWindows() {
            try {
                console.log('RefreshAllWindows called');
                
                if (this._pilotWindow) {
                    console.log('Refreshing pilot window...');
                    this._pilotWindow.refresh();
                }
                
                if (this._copilotWindow) {
                    console.log('Refreshing copilot window...');
                    this._copilotWindow.refresh();
                }
                
                if (this._frameWindow) {
                    console.log('Refreshing frame window...');
                    this._frameWindow.refresh();
                }
                
                if (this._loadoutWindow) {
                    console.log('Refreshing loadout window...');
                    this._loadoutWindow.refresh();
                }
                
                console.log('RefreshAllWindows completed');
            } catch (error) {
                console.error('Error in refreshAllWindows:', error);
            }
        }

        showPlaceholder(message) {
            try {
                console.log('ShowPlaceholder called with message:', message);
                
                if (this._placeholderWindow) {
                    console.log('Closing existing placeholder window...');
                    this._placeholderWindow.close();
                    this.removeChild(this._placeholderWindow);
                    this._placeholderWindow = null;
                }
                
                console.log('Creating new placeholder window...');
                const rect = new Rectangle(320, 200, 400, 100);
                this._placeholderWindow = new Window_Base(rect);
                
                console.log('Drawing text...');
                this._placeholderWindow.drawText(message, 0, 0, 400, 'center');
                
                console.log('Adding window to scene...');
                this.addChild(this._placeholderWindow);
                
                console.log('Setting timeout for auto-close...');
                setTimeout(() => {
                    try {
                        console.log('Timeout callback executing...');
                        if (this._placeholderWindow) {
                            console.log('Closing placeholder window...');
                            this._placeholderWindow.close();
                            this.removeChild(this._placeholderWindow);
                            this._placeholderWindow = null;
                            console.log('Placeholder window closed successfully');
                        }
                    } catch (timeoutError) {
                        console.error('Error in placeholder timeout:', timeoutError);
                    }
                }, 1200);
                
                console.log('ShowPlaceholder completed');
            } catch (error) {
                console.error('Error in showPlaceholder:', error);
            }
        }

        showSimplePlaceholder(message) {
            try {
                console.log('ShowSimplePlaceholder called with message:', message);
                
                // Just log the message - no UI display to avoid freezes
                console.log('SUCCESS MESSAGE:', message);
                
                // TODO: Implement safe message display later
                // For now, just console logging to prevent any freeze issues
                
                console.log('ShowSimplePlaceholder completed');
            } catch (error) {
                console.error('Error in showSimplePlaceholder:', error);
            }
        }
    }

    // Placeholder scene for Pilot Status
    class Scene_PilotStatus extends Scene_MenuBase {
        create() {
            super.create();
            this.createMessageWindow();
        }

        createMessageWindow() {
            const rect = new Rectangle(200, 200, 400, 100);
            this._messageWindow = new Window_Base(rect);
            this._messageWindow.drawText('Pilot Status - Coming Soon!', 0, 0, 400, 'center');
            this.addWindow(this._messageWindow);
            
            // Auto-return to menu after 2 seconds
            setTimeout(() => {
                this.popScene();
            }, 2000);
        }
    }

    // Placeholder scene for Training
    class Scene_Training extends Scene_MenuBase {
        create() {
            super.create();
            this.createMessageWindow();
        }

        createMessageWindow() {
            const rect = new Rectangle(200, 200, 400, 100);
            this._messageWindow = new Window_Base(rect);
            this._messageWindow.drawText('Academy Training - Coming Soon!', 0, 0, 400, 'center');
            this.addWindow(this._messageWindow);
            
            // Auto-return to menu after 2 seconds
            setTimeout(() => {
                this.popScene();
            }, 2000);
        }
    }

    // Character selection window for Equip
    class Window_EquipCharacterSelect extends Window_Command {
        constructor(rect) {
            super(rect);
            this.select(0);
        }
        
        makeCommandList() {
            this.addCommand('Pilot', 'pilot');
            this.addCommand('Copilot', 'copilot');
            this.addCommand('Frame & Equipment', 'frame');
        }
    }
    
    // Window to display card info (pilot, copilot, frame) - now integrated with composite system
    class Window_CardInfo extends Window_Base {
        constructor(rect, cardType) {
            super(rect);
            this._cardType = cardType; // 'pilot', 'copilot', or 'frame'
            this.refresh();
        }
        
        async refresh() {
            this.contents.clear();
            
            // Get active mecha from composite manager
            const activeMecha = window.MechaCompositeManager?.getActiveMecha();
            if (!activeMecha) {
                this.drawText('No Active Mecha', 0, 0, this.width, 'center');
                return;
            }
            
            // Get the appropriate card from active mecha
            let card = null;
            if (this._cardType === 'pilot') card = activeMecha.pilotCard;
            if (this._cardType === 'copilot') card = activeMecha.copilotCard;
            if (this._cardType === 'frame') card = activeMecha.frameCard;
            
            if (!card) {
                this.drawText(`No ${this._cardType}`, 0, 0, this.width, 'center');
                return;
            }
            
            let y = 0;
            // Draw name larger and bold
            this.contents.fontSize = 26;
            this.contents.fontBold = true;
            this.drawText(card.name, 0, y, this.width, 'center');
            y += 36;
            this.contents.fontSize = 20;
            this.contents.fontBold = false;
            this.drawText(`Type: ${card.type}`, 0, y, this.width, 'left');
            y += 28;
            
            // Show composite effectiveness for this component
            if (this._cardType === 'pilot' && activeMecha.compositeStats) {
                this.contents.fontBold = true;
                this.drawText('Pilot Efficiency:', 0, y, this.width, 'left');
                y += 24;
                this.contents.fontBold = false;
                const efficiency = Math.floor(activeMecha.compositeStats.pilotEfficiency * 100);
                this.drawText(`${efficiency}%`, 16, y, this.width - 16, 'left');
                y += 22;
            }
            
            if (this._cardType === 'copilot' && activeMecha.compositeStats) {
                this.contents.fontBold = true;
                this.drawText('Copilot Bonus:', 0, y, this.width, 'left');
                y += 24;
                this.contents.fontBold = false;
                const bonus = Math.floor(activeMecha.compositeStats.copilotBonus * 100);
                this.drawText(`+${bonus}%`, 16, y, this.width - 16, 'left');
                y += 22;
            }
            
            if (card.effects) {
                for (const effect of card.effects) {
                    if (effect.type === 'stat_bonus' && effect.stats) {
                        this.contents.fontBold = true;
                        this.drawText('Stat Bonus:', 0, y, this.width, 'left');
                        y += 24;
                        this.contents.fontBold = false;
                        for (const [stat, value] of Object.entries(effect.stats)) {
                            this.drawText(`${stat}: ${value}`, 16, y, this.width - 16, 'left');
                            y += 22;
                        }
                    }
                    if (effect.type === 'base_stats' && effect.stats) {
                        this.contents.fontBold = true;
                        this.drawText('Base Stats:', 0, y, this.width, 'left');
                        y += 24;
                        this.contents.fontBold = false;
                        for (const [stat, value] of Object.entries(effect.stats)) {
                            this.drawText(`${stat}: ${value}`, 16, y, this.width - 16, 'left');
                            y += 22;
                        }
                    }
                    if (effect.type === 'trait' && effect.traits) {
                        this.contents.fontBold = true;
                        this.drawText('Traits:', 0, y, this.width, 'left');
                        this.contents.fontBold = false;
                        y += 22;
                        this.drawText(`${effect.traits.join(', ')}`, 16, y, this.width - 16, 'left');
                        y += 22;
                    }
                    if (effect.type === 'special' && effect.special) {
                        this.contents.fontBold = true;
                        this.drawText('Special:', 0, y, this.width, 'left');
                        this.contents.fontBold = false;
                        y += 22;
                        this.drawText(`${effect.special.join(', ')}`, 16, y, this.width - 16, 'left');
                        y += 22;
                    }
                }
            }
        }
    }

    // Window to display current loadout and composite stats
    class Window_Loadout extends Window_Base {
        constructor(rect) {
            super(rect);
            this.refresh();
        }
        
        refresh() {
            this.contents.clear();
            
            // Get active mecha from composite manager
            const activeMecha = window.MechaCompositeManager?.getActiveMecha();
            if (!activeMecha) {
                this.drawText('No Active Mecha', 0, 0, this.width, 'center');
                return;
            }
            
            const displayInfo = activeMecha.getDisplayInfo();
            let y = 0;
            
            // Mecha name and status
            this.contents.fontSize = 24;
            this.contents.fontBold = true;
            this.drawText(displayInfo.name, 0, y, this.width, 'center');
            y += 32;
            
            this.contents.fontSize = 18;
            this.contents.fontBold = false;
            const status = displayInfo.isReady ? 'READY' : 'INCOMPLETE';
            const statusColor = displayInfo.isReady ? 3 : 2; // Green or red
            this.changeTextColor(ColorManager.textColor(statusColor));
            this.drawText(`Status: ${status}`, 0, y, this.width, 'center');
            this.resetTextColor();
            y += 28;
            
            // Composite stats
            if (displayInfo.stats) {
                this.contents.fontBold = true;
                this.drawText('Composite Stats:', 0, y, this.width, 'left');
                y += 24;
                this.contents.fontBold = false;
                
                const stats = displayInfo.stats;
                this.drawText(`Combat Rating: ${stats.combatRating}`, 0, y, this.width / 2, 'left');
                this.drawText(`Effective Armor: ${stats.effectiveArmor}`, this.width / 2, y, this.width / 2, 'left');
                y += 22;
                
                this.drawText(`Effective Speed: ${stats.effectiveSpeed}`, 0, y, this.width / 2, 'left');
                this.drawText(`Mental Resource: ${stats.mentalResource}`, this.width / 2, y, this.width / 2, 'left');
                y += 22;
                
                this.drawText(`Energy Capacity: ${stats.energyCapacity}`, 0, y, this.width / 2, 'left');
                this.drawText(`Heat Dissipation: ${stats.heatDissipation}`, this.width / 2, y, this.width / 2, 'left');
                y += 28;
            }
            
            // Equipment summary with hardpoints and resource usage
            this.contents.fontBold = true;
            this.drawText('Equipment & Resources:', 0, y, this.width, 'left');
            y += 24;
            this.contents.fontBold = false;
            
            const equipment = displayInfo.equipment;
            
            // Resource usage
            if (activeMecha.getCurrentWeight && activeMecha.getCurrentEnergyDrain) {
                const currentWeight = activeMecha.getCurrentWeight();
                const currentEnergy = activeMecha.getCurrentEnergyDrain();
                const stats = displayInfo.stats || {};
                const maxWeight = stats.weightLimit || 100;
                const maxEnergy = stats.energyCapacity || 200;
                
                this.drawText(`Weight: ${currentWeight}/${maxWeight}`, 0, y, this.width / 2, 'left');
                this.drawText(`Energy: ${currentEnergy}/${maxEnergy}`, this.width / 2, y, this.width / 2, 'left');
                y += 22;
            }
            
            // Hardpoints info
            const hardpoints = activeMecha.getFrameHardpoints ? activeMecha.getFrameHardpoints() : null;
            if (hardpoints) {
                this.contents.fontBold = true;
                this.drawText('Hardpoints:', 0, y, this.width, 'left');
                y += 20;
                this.contents.fontBold = false;
                
                const weaponCount = equipment.weapons.length;
                const maxWeapons = (hardpoints.head || 0) + (hardpoints.torso || 0) + (hardpoints.arms || 0) + (hardpoints.legs || 0);
                this.drawText(`Weapons: ${weaponCount}/${maxWeapons}`, 0, y, this.width, 'left');
                y += 18;
                
                // Show hardpoint breakdown
                this.contents.fontSize = 16;
                this.drawText(`Head: ${hardpoints.head || 0} | Torso: ${hardpoints.torso || 0}`, 16, y, this.width - 16, 'left');
                y += 16;
                this.drawText(`Arms: ${hardpoints.arms || 0} | Legs: ${hardpoints.legs || 0}`, 16, y, this.width - 16, 'left');
                y += 18;
                this.contents.fontSize = 18;
            } else {
                // Fallback for frames without hardpoint data
                const weaponCount = equipment.weapons.length;
                this.drawText(`Weapons: ${weaponCount}/4`, 0, y, this.width, 'left');
                y += 20;
            }
            
            // Armor
            const armorSlots = ['head', 'torso', 'arms', 'legs'];
            let armorCount = 0;
            armorSlots.forEach(slot => {
                if (equipment.armor[slot]) armorCount++;
            });
            this.drawText(`Armor: ${armorCount}/4`, 0, y, this.width, 'left');
            y += 20;
            
            // Systems
            const systemSlots = ['generator', 'cooler', 'os'];
            let systemCount = 0;
            systemSlots.forEach(slot => {
                if (equipment.systems[slot]) systemCount++;
            });
            this.drawText(`Systems: ${systemCount}/3`, 0, y, this.width, 'left');
            y += 20;
            
            // Roster info
            const roster = window.MechaCompositeManager?.getMechaRoster() || [];
            if (roster.length > 1) {
                y += 10;
                this.contents.fontBold = true;
                this.drawText(`Mecha Roster: ${roster.length}/6`, 0, y, this.width, 'left');
                this.contents.fontBold = false;
            }
        }
    }

    // Command window for academy actions
    class Window_AcademyCommands extends Window_Command {
        makeCommandList() {
            this.addCommand('Equip', 'equip');
            this.addCommand('Equipment', 'equipment');
            this.addCommand('Switch Mecha', 'switch');
            this.addCommand('Stats', 'stats');
            this.addCommand('Train', 'train');
            this.addCommand('Cancel', 'cancel');
        }
    }

    // Mecha selection window for switching between roster mechas
    class Window_MechaSelect extends Window_Command {
        constructor(rect) {
            super(rect);
            this.select(0);
        }
        
        makeCommandList() {
            const roster = window.MechaCompositeManager?.getMechaRoster() || [];
            const activeMecha = window.MechaCompositeManager?.getActiveMecha();
            
            roster.forEach((mecha, index) => {
                const displayInfo = mecha.getDisplayInfo();
                const isActive = mecha === activeMecha;
                const name = isActive ? `> ${displayInfo.name}` : displayInfo.name;
                const enabled = displayInfo.isReady;
                this.addCommand(name, 'select', enabled);
            });
            
            if (roster.length === 0) {
                this.addCommand('No Mecha Available', 'none', false);
            }
        }
    }

    // Pilot selection window
    class Window_PilotSelect extends Window_Command {
        constructor(rect) {
            super(rect);
            this._pilotIds = [];
            this._availablePilots = window.MechaCompositeManager?.getAvailablePilots() || [];
            this.select(0);
        }
        
        makeCommandList() {
            // Store pilots in constructor to avoid clearing issues
            this._availablePilots = window.MechaCompositeManager?.getAvailablePilots() || [];
            
            this._availablePilots.forEach((pilotId, index) => {
                const name = CardNamingHelper.getDisplayName(pilotId);
                this.addCommand(name, 'select', true, pilotId); // Store pilotId as ext data
            });
            
            if (this._availablePilots.length === 0) {
                this.addCommand('No Pilots Available', 'none', false);
            }
        }
        
        getCurrentItemId() {
            const currentIndex = this.index();
            // Get pilot ID from command ext data instead of separate array
            const command = this._list[currentIndex];
            return command ? command.ext : null;
        }
    }

    // Copilot selection window
    class Window_CopilotSelect extends Window_Command {
        constructor(rect) {
            super(rect);
            this._availableCopilots = window.MechaCompositeManager?.getAvailableCopilots() || [];
            this.select(0);
        }
        
        makeCommandList() {
            this._availableCopilots = window.MechaCompositeManager?.getAvailableCopilots() || [];
            
            this._availableCopilots.forEach((copilotId) => {
                const name = CardNamingHelper.getDisplayName(copilotId);
                this.addCommand(name, 'select', true, copilotId); // Store copilotId as ext data
            });
            
            if (this._availableCopilots.length === 0) {
                this.addCommand('No Copilots Available', 'none', false);
            }
        }
        
        getCurrentItemId() {
            const currentIndex = this.index();
            const command = this._list[currentIndex];
            return command ? command.ext : null;
        }
    }

    // Frame selection window (by weight class)
    class Window_FrameSelect extends Window_Command {
        constructor(rect, frameClass) {
            super(rect);
            this._frameClass = frameClass || 'light';
            this._availableFrames = [];
            
            // Rebuild the command list now that we have the frame class
            this.clearCommandList();
            this.makeCommandList();
            this.refresh();
            this.select(0);
        }
        
        makeCommandList() {
            // Show frames from specific weight class
            const framesByClass = window.MechaCompositeManager?.getFramesByClass() || {};
            this._availableFrames = framesByClass[this._frameClass] || [];
            
            this._availableFrames.forEach((frameId) => {
                const name = CardNamingHelper.getDisplayName(frameId);
                this.addCommand(name, 'select', true, frameId); // Store frameId as ext data
            });
            
            if (this._availableFrames.length === 0) {
                this.addCommand(`No ${this._frameClass} frames available`, 'none', false);
            }
        }
        
        getCurrentItemId() {
            const currentIndex = this.index();
            const command = this._list[currentIndex];
            return command ? command.ext : null;
        }
    }

    // Weapon selection window
    class Window_WeaponSelect extends Window_Command {
        constructor(rect) {
            super(rect);
            this._availableWeapons = window.MechaCompositeManager?.getAvailableWeapons() || [];
            this.select(0);
        }
        
        makeCommandList() {
            this._availableWeapons = window.MechaCompositeManager?.getAvailableWeapons() || [];
            
            this._availableWeapons.forEach((weaponId) => {
                const name = CardNamingHelper.getDisplayName(weaponId);
                this.addCommand(name, 'select', true, weaponId); // Store weaponId as ext data
            });
            
            if (this._availableWeapons.length === 0) {
                this.addCommand('No Weapons Available', 'none', false);
            }
        }
        
        getCurrentItemId() {
            const currentIndex = this.index();
            const command = this._list[currentIndex];
            return command ? command.ext : null;
        }
    }

    // Armor selection window
    class Window_ArmorSelect extends Window_Command {
        constructor(rect) {
            super(rect);
            this._armorSlots = ['head', 'torso', 'arms', 'legs'];
            this._selectedSlot = null;
            
            // Rebuild the command list now that we have the armor slots
            this.clearCommandList();
            this.makeCommandList();
            this.refresh();
            this.select(0);
        }
        
        makeCommandList() {
            if (this._armorSlots) {
                this._armorSlots.forEach(slot => {
                    this.addCommand(`Equip ${slot} armor`, slot, true);
                });
            }
        }
        
        getCurrentItemId() {
            // Map armor slots to new card ID format
            const slot = this._armorSlots[this.index()];
            this._selectedSlot = slot;
            
            // Map slot names to new card IDs
            const armorMapping = {
                'head': 'CRD_ARM_HD_BASIC001',
                'torso': 'CRD_ARM_TR_BASIC001', 
                'arms': 'CRD_ARM_AR_BASIC001',
                'legs': 'CRD_ARM_LG_BASIC001'
            };
            
            return armorMapping[slot] || `CRD_ARM_HD_BASIC001`; // Default to head armor if slot not found
        }
        
        getSelectedSlot() {
            return this._selectedSlot;
        }
    }

    // System selection window
    class Window_SystemSelect extends Window_Command {
        constructor(rect) {
            super(rect);
            this._systemSlots = ['generator', 'cooler', 'os'];
            this._selectedSlot = null;
            
            // Rebuild the command list now that we have the system slots
            this.clearCommandList();
            this.makeCommandList();
            this.refresh();
            this.select(0);
        }
        
        makeCommandList() {
            if (this._systemSlots) {
                this._systemSlots.forEach(slot => {
                    this.addCommand(`Equip ${slot}`, slot, true);
                });
            }
        }
        
        getCurrentItemId() {
            // Map system slots to new card ID format
            const slot = this._systemSlots[this.index()];
            this._selectedSlot = slot;
            
            // Map slot names to new card IDs
            const systemMapping = {
                'generator': 'CRD_SYS_GN_STANDARD001',
                'cooler': 'CRD_SYS_CL_PASSIVE001',
                'os': 'CRD_SYS_OS_STANDARD001'
            };
            
            return systemMapping[slot] || null;
        }
        
        getSelectedSlot() {
            return this._selectedSlot;
        }
    }

    // Frame class selection window (Light, Medium, Heavy)
    class Window_FrameClassSelect extends Window_Command {
        constructor(rect) {
            super(rect);
            this.select(0);
        }
        
        makeCommandList() {
            this.addCommand('Light Frames', 'light', true, 'light');
            this.addCommand('Medium Frames', 'medium', true, 'medium');
            this.addCommand('Heavy Frames', 'heavy', true, 'heavy');
        }
        
        getCurrentFrameClass() {
            const currentIndex = this.index();
            const command = this._list[currentIndex];
            return command ? command.ext : null;
        }
    }

    // Frame customization selection window (after frame is equipped)
    class Window_FrameCustomizationSelect extends Window_Command {
        constructor(rect) {
            super(rect);
            this.select(0);
        }
        
        makeCommandList() {
            this.addCommand('Customize Weapons', 'weapons');
            this.addCommand('Customize Armor', 'armor');
            this.addCommand('Customize Systems', 'systems');
            this.addCommand('Save as Preset', 'save');
            this.addCommand('Done', 'done');
        }
    }

    // Frame equipment selection window (Weapons, Armor, Systems)
    class Window_FrameEquipmentSelect extends Window_Command {
        constructor(rect) {
            super(rect);
            this.select(0);
        }
        
        makeCommandList() {
            this.addCommand('Weapons', 'weapons');
            this.addCommand('Armor', 'armor');
            this.addCommand('Systems', 'systems');
        }
    }

    // Expose scenes for external access
    window.Scene_AcademyMenu = Scene_AcademyMenu;
    window.Scene_PilotStatus = Scene_PilotStatus;
    window.Scene_Training = Scene_Training;

    // Test function for naming convention (new format only)
    window.testCardNaming = function() {
        console.log('=== Card Naming Convention Test (New Format Only) ===');
        
        const testCards = [
            // New format examples - these should work
            'CRD_PLT_VET_ALEX001',
            'CRD_PLT_ACE_MAYA001',
            'CRD_CPT_AI_ARIA001',
            'CRD_CPT_AI_NEXUS001',
            'CRD_FRM_LT_SCOUT001',
            'CRD_FRM_MD_ASSAULT001',
            'CRD_FRM_HV_TANK001',
            'CRD_WPN_BM_RIFLE001',
            'CRD_WPN_BM_CANNON001',
            'CRD_WPN_MS_POD001',
            'CRD_ARM_TR_BASIC001',
            'CRD_ARM_LG_STANDARD001',
            'CRD_SYS_GN_STANDARD001',
            'CRD_SYS_CL_PASSIVE001',
            'CRD_SYS_OS_STANDARD001',
            
            // Invalid formats - these should show warnings
            'card_pilot_alex_carter',
            'invalid_format',
            'CRD_INVALID'
        ];
        
        testCards.forEach(cardId => {
            const displayName = CardNamingHelper.getDisplayName(cardId);
            const category = CardNamingHelper.getCategory(cardId);
            const isValid = CardNamingHelper.isValidCardId(cardId);
            const cardPath = CardNamingHelper.getCardPath(cardId);
            
            console.log(`${cardId}:`);
            console.log(`  Display: "${displayName}"`);
            console.log(`  Category: ${category}`);
            console.log(`  Valid: ${isValid}`);
            if (cardPath) console.log(`  Path: ${cardPath}`);
            console.log('');
        });
        
        console.log('=== New Format Naming Test Complete ===');
        console.log('Note: Legacy format cards will show warnings and should be migrated.');
    };

    console.log('AcademyMenu loaded with CardNamingHelper. Run window.testCardNaming() to test naming convention.');
})();
