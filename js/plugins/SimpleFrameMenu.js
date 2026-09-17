/*:
 * @target MZ
 * @plugindesc [v1.0.0] Frame Test
 * @author YourName
 */

(() => {
    'use strict';
    
    console.log('SimpleFrameMenu plugin loaded');
    
    // Simple test function
    window.showFrameData = async function() {
        console.log('=== FRAME DATA TEST ===');
        if (window.DataLoader) {
            const frame = await window.DataLoader.loadItem('frame_light_001_scout');
            console.log('Frame loaded:', frame);
            console.log(`Name: ${frame.name}`);
            console.log(`Armor: ${frame.baseStats.armor}`);
            console.log(`Speed: ${frame.baseStats.speed}`);
            console.log(`Energy: ${frame.baseStats.energyCapacity}`);
            console.log('=== TEST COMPLETE ===');
            return frame;
        }
    };

    // Move this INSIDE the plugin scope (before the })(); )
    window.showFrameWindow = function() {
        // Create a simple message window with frame data
        $gameMessage.clear();
        $gameMessage.add("\\C[3]FRAME INFORMATION\\C[0]");
        $gameMessage.add("");
        
        // Load and display frame data
        window.DataLoader.loadItem('frame_light_001_scout').then(frame => {
            $gameMessage.add(`Name: ${frame.name}`);
            $gameMessage.add(`Class: ${frame.weightClass.toUpperCase()}`);
            $gameMessage.add(`Role: ${frame.role}`);
            $gameMessage.add("");
            $gameMessage.add("\\C[2]STATISTICS\\C[0]");
            $gameMessage.add(`Armor: ${frame.baseStats.armor}`);
            $gameMessage.add(`Speed: ${frame.baseStats.speed}`);
            $gameMessage.add(`Energy: ${frame.baseStats.energyCapacity}`);
            $gameMessage.add(`Heat Dissipation: ${frame.baseStats.heatDissipation}`);
            $gameMessage.add(`Weight Limit: ${frame.baseStats.weightLimit}`);
        });
    };



    // Simpler version using Scene_MenuBase
    window.showFrameStatsWindow = function() {
        SceneManager.push(Scene_FrameStats);
    };

    class Scene_FrameStats extends Scene_MenuBase {
        create() {
            super.create();
            this.createFrameStatsWindow();
        }
        createFrameStatsWindow() {
            const rect = new Rectangle(50, 50, 600, 400);
            this.statsWindow = new Window_FrameStats(rect);
            this.addWindow(this.statsWindow);
        }
        update() {
            super.update();
            if (Input.isTriggered('cancel') || Input.isTriggered('ok')) {
                SceneManager.pop();
            }
        }
    }

    class Window_FrameStats extends Window_Base {
        constructor(rect) {
            super(rect);
            this.loadFrameData();
        }
        async loadFrameData() {
            const frame = await window.DataLoader.loadItem('frame_light_001_scout');
            this.drawFrameInfo(frame);
        }
        drawFrameInfo(frame) {
            let y = 0;
            this.drawText("MECHA FRAME INFORMATION", 0, y, this.width);
            y += 40;
            this.drawText(`Name: ${frame.name}`, 20, y, this.width);
            y += 32;
            this.drawText(`Class: ${frame.weightClass.toUpperCase()}`, 20, y, this.width);
            y += 32;
            this.drawText(`Role: ${frame.role}`, 20, y, this.width);
            y += 50;
            this.drawText("STATISTICS", 0, y, this.width);
            y += 40;
            this.drawText(`Armor: ${frame.baseStats.armor}`, 20, y, this.width);
            y += 32;
            this.drawText(`Speed: ${frame.baseStats.speed}`, 20, y, this.width);
            y += 32;
            this.drawText(`Energy: ${frame.baseStats.energyCapacity}`, 20, y, this.width);
        }
    }

    window.Scene_FrameStats = Scene_FrameStats;

})(); // This closes the plugin scope - nothing should be after this