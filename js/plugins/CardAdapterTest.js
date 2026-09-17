/*:
 * @target MZ
 * @plugindesc [v1.0.0] Card Data Adapter Test
 * @author YourName
 *
 * Test the card data translation system.
 */

(() => {
    'use strict';

    class CardAdapterTest {
        static async runTests() {
            console.log('=== Card Data Adapter Tests ===');
            
            if (!window.CardDataAdapter) {
                console.error('CardDataAdapter not found!');
                return;
            }

            try {
                // Test 1: Card ID detection
                console.log('Test 1: Card ID Detection');
                const testIds = [
                    'card_equipment_light_beam_rifle',
                    'card_pilot_alex_carter',
                    'B0015',
                    'W001',
                    'normal_skill_1',
                    null,
                    123
                ];

                testIds.forEach(id => {
                    const isCard = window.CardDataAdapter.isCardId(id);
                    console.log(`  ${id}: ${isCard ? 'CARD' : 'NOT CARD'}`);
                });

                // Test 2: Translation
                console.log('\nTest 2: Card Translation');
                const cardIds = [
                    'card_equipment_light_beam_rifle',
                    'card_pilot_alex_carter',
                    'card_copilot_aria'
                ];

                for (const cardId of cardIds) {
                    try {
                        console.log(`  Translating ${cardId}...`);
                        const translated = await window.CardDataAdapter.translateCard(cardId);
                        console.log(`  ✅ ${translated.name} (${translated.id})`);
                        console.log(`     Description: ${translated.description}`);
                        console.log(`     Type: ${JSON.parse(translated.note || '{}').cardType}`);
                    } catch (error) {
                        console.error(`  ❌ Failed to translate ${cardId}:`, error);
                    }
                }

                // Test 3: Cache performance
                console.log('\nTest 3: Cache Performance');
                const startTime = performance.now();
                
                // First translation (should load from JSON)
                await window.CardDataAdapter.translateCard('card_equipment_light_beam_rifle');
                const firstTime = performance.now() - startTime;
                
                const cacheStartTime = performance.now();
                // Second translation (should use cache)
                await window.CardDataAdapter.translateCard('card_equipment_light_beam_rifle');
                const cacheTime = performance.now() - cacheStartTime;
                
                console.log(`  First load: ${firstTime.toFixed(2)}ms`);
                console.log(`  Cache hit: ${cacheTime.toFixed(2)}ms`);
                console.log(`  Speed improvement: ${(firstTime / cacheTime).toFixed(1)}x`);

                // Test 4: Cache stats
                console.log('\nTest 4: Cache Statistics');
                const stats = window.CardDataAdapter.getCacheStats();
                console.log(`  Translation cache size: ${stats.translationCacheSize}`);
                console.log(`  Cached cards: ${stats.cachedCards.join(', ')}`);

                console.log('\n=== Card Adapter Tests Complete ===');

            } catch (error) {
                console.error('Test suite failed:', error);
            }
        }

        static async testBattleIntegration() {
            console.log('=== Battle Integration Test ===');
            
            try {
                // Create a mock action with a card
                const mockAction = {
                    _item: { itemId: 'card_equipment_light_beam_rifle' }
                };

                // Test if the adapter intercepts the call
                const originalItem = Game_Action.prototype.item;
                const result = originalItem.call(mockAction);
                
                console.log('Battle integration result:', result);
                console.log('Card name:', result?.name);
                console.log('Card type:', JSON.parse(result?.note || '{}').cardType);

            } catch (error) {
                console.error('Battle integration test failed:', error);
            }
        }
    }

    // Expose test functions
    window.testCardAdapter = CardAdapterTest;

    // Auto-run basic tests when everything is loaded
    const runAutoTests = () => {
        if (window.CardDataAdapter?.isInitialized && window.DataLoader) {
            console.log('Running automatic Card Adapter tests...');
            setTimeout(() => {
                CardAdapterTest.runTests();
            }, 1000); // Give systems time to fully initialize
        } else {
            setTimeout(runAutoTests, 500);
        }
    };

    runAutoTests();

})();