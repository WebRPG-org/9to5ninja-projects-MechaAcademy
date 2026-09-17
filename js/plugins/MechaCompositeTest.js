/*:
 * @target MZ
 * @plugindesc [v1.0.0] Mecha Composite System Test
 * @author YourName
 *
 * Test plugin for the Mecha Composite Actor System.
 * Creates multiple test mecha configurations for demonstration.
 */

(() => {
    'use strict';

    // Test data creation
    async function createTestMecha() {
        if (!window.MechaCompositeManager) {
            console.error('MechaCompositeManager not available');
            return;
        }

        try {
            console.log('Creating test mecha configurations...');

            // Create additional test mecha (the first one is created by MechaComposite.js)
            
            // Test Mecha 2: Heavy combat configuration
            await window.MechaCompositeManager.createMecha(
                'card_pilot_maya_torres',  // Veteran pilot
                'card_copilot_nexus',      // Advanced copilot
                'card_frame_assault'       // Assault frame
            );

            // Test Mecha 3: Tank configuration
            await window.MechaCompositeManager.createMecha(
                'card_pilot_maya_torres',  // Veteran pilot
                'card_copilot_nexus',      // Advanced copilot
                'card_frame_heavy_tank'    // Heavy tank frame
            );

            console.log('Test mecha created successfully');
            
            // Log roster status
            const roster = window.MechaCompositeManager.getMechaRoster();
            console.log(`Total mecha in roster: ${roster.length}`);
            
            roster.forEach((mecha, index) => {
                const info = mecha.getDisplayInfo();
                console.log(`Mecha ${index + 1}: ${info.name} - Ready: ${info.isReady}`);
            });

        } catch (error) {
            console.error('Failed to create test mecha:', error);
        }
    }

    // Test composite stat calculations
    function testCompositeStats() {
        const activeMecha = window.MechaCompositeManager?.getActiveMecha();
        if (!activeMecha) {
            console.log('No active mecha to test');
            return;
        }

        const displayInfo = activeMecha.getDisplayInfo();
        console.log('=== Composite Stats Test ===');
        console.log('Mecha Name:', displayInfo.name);
        console.log('Pilot:', displayInfo.pilot);
        console.log('Copilot:', displayInfo.copilot);
        console.log('Frame:', displayInfo.frame);
        console.log('Is Ready:', displayInfo.isReady);
        
        if (displayInfo.stats) {
            console.log('Combat Rating:', displayInfo.stats.combatRating);
            console.log('Effective Armor:', displayInfo.stats.effectiveArmor);
            console.log('Effective Speed:', displayInfo.stats.effectiveSpeed);
            console.log('Pilot Efficiency:', Math.floor(displayInfo.stats.pilotEfficiency * 100) + '%');
            console.log('Copilot Bonus:', Math.floor(displayInfo.stats.copilotBonus * 100) + '%');
        }
        console.log('=== End Stats Test ===');
    }

    // Test equipment system
    async function testEquipment() {
        const activeMecha = window.MechaCompositeManager?.getActiveMecha();
        if (!activeMecha) {
            console.log('No active mecha to test equipment');
            return;
        }

        console.log('=== Equipment Test ===');
        
        try {
            // Test weapon equipping with new system
            console.log('Testing light weapon...');
            const lightWeapon = await activeMecha.equipWeapon('CRD_WPN_BM_LIGHT001');
            console.log('Light weapon result:', lightWeapon);
            
            // Test heavy weapon (should work on assault/tank frames, fail on scout)
            console.log('Testing heavy weapon...');
            const heavyWeapon = await activeMecha.equipWeapon('CRD_WPN_BM_HEAVY001');
            console.log('Heavy weapon result:', heavyWeapon);
            
            // Test armor equipping
            const armorResult = await activeMecha.equipArmor('head', 'CRD_ARM_HD_BASIC001');
            console.log('Head armor equipped:', armorResult);
            
            // Test system equipping
            const systemResult = await activeMecha.equipSystem('generator', 'CRD_SYS_GN_STANDARD001');
            console.log('Generator equipped:', systemResult);
            
            // Show updated stats
            const displayInfo = activeMecha.getDisplayInfo();
            console.log('Updated equipment counts:');
            console.log('Weapons:', displayInfo.equipment.weapons.length);
            console.log('Armor pieces:', Object.values(displayInfo.equipment.armor).filter(item => item !== null).length);
            console.log('Systems:', Object.values(displayInfo.equipment.systems).filter(item => item !== null).length);
            
        } catch (error) {
            console.error('Equipment test failed:', error);
        }
        
        console.log('=== End Equipment Test ===');
    }

    // Test RPG Maker actor conversion
    function testActorConversion() {
        const activeMecha = window.MechaCompositeManager?.getActiveMecha();
        if (!activeMecha) {
            console.log('No active mecha to test actor conversion');
            return;
        }

        console.log('=== Actor Conversion Test ===');
        
        const actorData = activeMecha.toActorData(1);
        console.log('Converted Actor Data:');
        console.log('Name:', actorData.name);
        console.log('Profile:', actorData.profile);
        console.log('HP:', actorData.params[0]);
        console.log('MP:', actorData.params[1]);
        console.log('ATK:', actorData.params[2]);
        console.log('DEF:', actorData.params[3]);
        console.log('MAT:', actorData.params[4]);
        console.log('MDF:', actorData.params[5]);
        console.log('AGI:', actorData.params[6]);
        console.log('LUK:', actorData.params[7]);
        
        console.log('=== End Actor Conversion Test ===');
    }

    // Add test commands to global scope for console testing
    window.testMechaComposite = {
        createTestMecha,
        testCompositeStats,
        testEquipment,
        testActorConversion,
        
        // Quick test all
        runAllTests: async function() {
            await createTestMecha();
            testCompositeStats();
            await testEquipment();
            testActorConversion();
        }
    };

    // Auto-run tests after a delay to ensure other systems are loaded
    const originalStart = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        originalStart.call(this);
        setTimeout(async () => {
            console.log('=== Starting Mecha Composite Tests ===');
            await createTestMecha();
            setTimeout(() => {
                testCompositeStats();
                setTimeout(async () => {
                    await testEquipment();
                    setTimeout(() => {
                        testActorConversion();
                        console.log('=== All Mecha Composite Tests Complete ===');
                        console.log('Use window.testMechaComposite.runAllTests() to run tests again');
                    }, 500);
                }, 500);
            }, 500);
        }, 3000); // Wait 3 seconds for other systems to initialize
    };
})();