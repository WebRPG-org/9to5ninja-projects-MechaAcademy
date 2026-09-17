/*:
 * @target MZ
 * @plugindesc [v1.0.0] Training Battle System - Deck-based Combat
 * @author YourName
 *
 * Implements training battles with deck mechanics and resource management.
 */

(() => {
    'use strict';

    // Training Battle Scene
    class Scene_TrainingBattle extends Scene_Battle {
        processVictory() {
            // DEBUG: Log processVictory call
            console.log('[DEBUG] processVictory called:', {
                opponentHp: this.opponent?.hp
            });
            $gameMessage.add("Training battle completed successfully!");
            $gameMessage.add("Gained experience and academy credits!");
            // Award experience to pilot and copilot
            const playerMecha = window.MechaCompositeManager?.getActiveMecha();
            if (playerMecha) {
                this.awardExperience(playerMecha);
            }
            setTimeout(() => {
                SceneManager.pop();
            }, 2000);
        }

        awardExperience(playerMecha) {
            console.log('[TRAINING_BATTLE] Awarding experience to mecha:', playerMecha.name);
            
            // Award experience to pilot
            if (playerMecha.pilot) {
                const expGain = 50; // Base training experience
                console.log('[TRAINING_BATTLE] Awarding', expGain, 'exp to pilot:', playerMecha.pilot.name);
                // TODO: Implement actual experience system
            }
            
            // Award experience to copilot
            if (playerMecha.copilot) {
                const expGain = 30; // Base training experience for copilot
                console.log('[TRAINING_BATTLE] Awarding', expGain, 'exp to copilot:', playerMecha.copilot.name);
                // TODO: Implement actual experience system
            }
            
            console.log('[TRAINING_BATTLE] Experience awarded successfully');
        }

        createTrainingOpponent() {
            return {
                name: "Training Dummy Mk.I",
                hp: 80,
                maxHp: 80,
                resources: {
                    machine: 150,
                    heat: 0
                },
                maxResources: {
                    machine: 150,
                    heat: 50
                },
                deck: [
                    {
                        id: 'DUMMY_ATTACK',
                        name: 'Basic Shot',
                        costs: { machine: 20, heat: 5 },
                        damage: 15
                    },
                    {
                        id: 'DUMMY_MOVE',
                        name: 'Reposition',
                        costs: { machine: 10 },
                        effect: 'movement'
                    }
                ],
                hand: [],
                actionsRemaining: 2,
                drawHand: function() {
                    this.hand = [];
                    for (let i = 0; i < 3 && this.deck.length > 0; i++) {
                        const randomIndex = Math.floor(Math.random() * this.deck.length);
                        this.hand.push({ ...this.deck[randomIndex] });
                    }
                },
                selectAction: function() {
                    // Simple AI - prefer attack if in range, otherwise move
                    const attackCard = this.hand.find(card => card.damage);
                    if (attackCard && this.canUseCard(attackCard)) {
                        return attackCard;
                    }
                    const moveCard = this.hand.find(card => card.effect === 'movement');
                    if (moveCard && this.canUseCard(moveCard)) {
                        return moveCard;
                    }
                    return null;
                },
                canUseCard: function(card) {
                    if (this.actionsRemaining <= 0) return false;
                    for (const [resource, cost] of Object.entries(card.costs || {})) {
                        if (this.resources[resource] !== undefined && this.resources[resource] < cost) {
                            return false;
                        }
                    }
                    return true;
                },
                regenerateResources: function() {
                    this.resources.machine = Math.min(this.resources.machine + 20, this.maxResources.machine);
                    this.resources.heat = Math.max(0, this.resources.heat - 8);
                    this.actionsRemaining = this.resources.heat < 40 ? 2 : 1;
                }
            };
        }

        create() {
            console.log('[TRAINING_BATTLE] Scene_TrainingBattle.create() called');
            try {
                super.create();
                console.log('[TRAINING_BATTLE] super.create() completed');
                this.initializeTrainingBattle();
                console.log('[TRAINING_BATTLE] initializeTrainingBattle() completed');
            } catch (error) {
                console.error('[TRAINING_BATTLE] Error in create():', error);
            }
        }

        initializeTrainingBattle() {
            console.log('[TRAINING_BATTLE] initializeTrainingBattle() starting...');
            
            // Initialize player mecha deck
            const playerMecha = window.MechaCompositeManager?.getActiveMecha();
            console.log('[TRAINING_BATTLE] playerMecha:', playerMecha);
            if (playerMecha) {
                console.log('[DEBUG] playerMecha constructor:', playerMecha.constructor?.name);
                console.log('[DEBUG] playerMecha prototype:', Object.getPrototypeOf(playerMecha));
                console.log('[DEBUG] playerMecha.initializeDeck:', typeof playerMecha.initializeDeck);
                console.log('[DEBUG] playerMecha own property names:', Object.getOwnPropertyNames(playerMecha));
                let proto = Object.getPrototypeOf(playerMecha);
                let chain = [];
                while (proto) {
                    chain.push(proto.constructor?.name);
                    proto = Object.getPrototypeOf(proto);
                }
                console.log('[DEBUG] playerMecha prototype chain:', chain);
            }
            if (playerMecha && !playerMecha.combatDeck) {
                if (typeof playerMecha.initializeDeck === 'function') {
                    playerMecha.initializeDeck();
                } else {
                    console.error('[ERROR] playerMecha.initializeDeck is not a function!');
                }
            }
            this.opponent = this.createTrainingOpponent();
            console.log('[TRAINING_BATTLE] Opponent created:', JSON.parse(JSON.stringify(this.opponent)));
            
            // Setup the deck battle flow
            console.log('[TRAINING_BATTLE] Calling setupDeckBattleFlow()...');
            this.setupDeckBattleFlow();
            console.log('[TRAINING_BATTLE] setupDeckBattleFlow() completed');
            
            // Initialize battle phase
            BattleManager._phase = 'start';
            console.log('[TRAINING_BATTLE] Battle phase set to start');
            
            console.log('[TRAINING_BATTLE] initializeTrainingBattle() completed successfully');
        }

        setupDeckBattleFlow() {
            console.log('[TRAINING_BATTLE] Setting up deck battle flow...');
            
            // Override turn processing to prevent instant victory
            this.originalStartTurn = BattleManager.startTurn;
            BattleManager.startTurn = this.startDeckTurn.bind(this);
            
            this.originalProcessTurn = BattleManager.processTurn;
            BattleManager.processTurn = this.processDeckTurn.bind(this);
            
            // Override victory processing
            this.originalProcessVictory = BattleManager.processVictory;
            BattleManager.processVictory = this.processTrainingVictory.bind(this);
            
            // Override battle end check to prevent automatic victory
            this.originalCheckBattleEnd = BattleManager.checkBattleEnd;
            BattleManager.checkBattleEnd = this.checkTrainingBattleEnd.bind(this);
            
            // Override update methods to prevent default battle flow
            this.originalUpdate = BattleManager.update;
            BattleManager.update = this.updateTrainingBattle.bind(this);
            
            console.log('[TRAINING_BATTLE] Battle flow overrides set up');
        }

        startDeckTurn() {
            console.log('[TRAINING_BATTLE] startDeckTurn called, phase:', BattleManager._phase);
            const playerMecha = window.MechaCompositeManager?.getActiveMecha();
            
            if (BattleManager._phase === 'start') {
                console.log('[TRAINING_BATTLE] Starting player turn');
                // Player turn start
                if (playerMecha) {
                    if (typeof playerMecha.regenerateResources === 'function') {
                        playerMecha.regenerateResources();
                    }
                    if (playerMecha.combatDeck && typeof playerMecha.combatDeck.drawHand === 'function') {
                        playerMecha.combatDeck.drawHand();
                    }
                }
                
                this.showPlayerHand();
                BattleManager._phase = 'input';
                
            } else if (BattleManager._phase === 'turn') {
                console.log('[TRAINING_BATTLE] Starting enemy turn');
                // Enemy turn
                this.opponent.regenerateResources();
                this.opponent.drawHand();
                this.processEnemyTurn();
            }
        }

        processDeckTurn() {
            console.log('[TRAINING_BATTLE] processDeckTurn called, phase:', BattleManager._phase);
            
            // Check for victory conditions
            if (this.opponent.hp <= 0) {
                console.log('[TRAINING_BATTLE] Opponent defeated, processing victory');
                this.processVictory();
                return;
            }
            
            const playerMecha = window.MechaCompositeManager?.getActiveMecha();
            if (playerMecha && playerMecha.hp <= 0) {
                console.log('[TRAINING_BATTLE] Player defeated, processing defeat');
                this.processDefeat();
                return;
            }
            
            // Continue with normal turn processing if no victory conditions met
            if (BattleManager._phase === 'input') {
                // Wait for player input
                return;
            }
            
            // Call original process turn for other phases
            if (this.originalProcessTurn) {
                this.originalProcessTurn.call(BattleManager);
            }
        }

        showPlayerHand() {
            console.log('[TRAINING_BATTLE] showPlayerHand called');
            const playerMecha = window.MechaCompositeManager?.getActiveMecha();
            
            if (!playerMecha) {
                console.warn('[TRAINING_BATTLE] No player mecha found');
                return;
            }
            
            console.log('[TRAINING_BATTLE] Player mecha found:', playerMecha.name);
            console.log('[TRAINING_BATTLE] Combat deck exists:', !!playerMecha.combatDeck);
            
            if (!playerMecha.combatDeck) {
                console.warn('[TRAINING_BATTLE] No combat deck found, trying to initialize...');
                if (typeof playerMecha.initializeDeck === 'function') {
                    playerMecha.initializeDeck();
                    console.log('[TRAINING_BATTLE] Deck initialized, checking again...');
                }
            }
            
            if (!playerMecha.combatDeck) {
                console.error('[TRAINING_BATTLE] Still no combat deck after initialization');
                return;
            }
            
            console.log('[TRAINING_BATTLE] Combat deck details:', {
                cards: playerMecha.combatDeck.cards?.length || 0,
                hand: playerMecha.combatDeck.hand?.length || 0,
                handType: typeof playerMecha.combatDeck.hand,
                handIsArray: Array.isArray(playerMecha.combatDeck.hand)
            });
            
            // Ensure hand is drawn
            if (!playerMecha.combatDeck.hand || playerMecha.combatDeck.hand.length === 0) {
                console.log('[TRAINING_BATTLE] Drawing initial hand...');
                console.log('[TRAINING_BATTLE] Deck size before draw:', playerMecha.combatDeck.deck?.length || 0);
                
                if (typeof playerMecha.combatDeck.drawHand === 'function') {
                    playerMecha.combatDeck.drawHand();
                    console.log('[TRAINING_BATTLE] Hand drawn, new hand size:', playerMecha.combatDeck.hand?.length || 0);
                    console.log('[TRAINING_BATTLE] Deck size after draw:', playerMecha.combatDeck.deck?.length || 0);
                    console.log('[TRAINING_BATTLE] Hand contents:', playerMecha.combatDeck.hand);
                } else {
                    console.error('[TRAINING_BATTLE] drawHand method not found on combat deck');
                    console.log('[TRAINING_BATTLE] Combat deck methods:', Object.getOwnPropertyNames(playerMecha.combatDeck));
                }
            } else {
                console.log('[TRAINING_BATTLE] Hand already has cards:', playerMecha.combatDeck.hand.length);
            }
            
            const hand = playerMecha.combatDeck.hand || [];
            console.log('[TRAINING_BATTLE] Creating hand window with hand:', hand);
            
            // Don't create window if no cards available
            if (hand.length === 0) {
                console.log('[TRAINING_BATTLE] No cards in hand after drawing');
                console.log('[TRAINING_BATTLE] Deck size:', playerMecha.combatDeck.deck?.length || 0);
                console.log('[TRAINING_BATTLE] Discard pile size:', playerMecha.combatDeck.discardPile?.length || 0);
                
                // If no cards anywhere, this might be a deck initialization issue
                if ((playerMecha.combatDeck.deck?.length || 0) === 0 && 
                    (playerMecha.combatDeck.discardPile?.length || 0) === 0) {
                    console.warn('[TRAINING_BATTLE] No cards in deck or discard pile - reinitializing deck');
                    if (typeof playerMecha.initializeDeck === 'function') {
                        playerMecha.initializeDeck();
                        // Try drawing again after reinitialization
                        if (typeof playerMecha.combatDeck.drawHand === 'function') {
                            playerMecha.combatDeck.drawHand();
                            if (playerMecha.combatDeck.hand.length > 0) {
                                // Recursively call showPlayerHand to create the window
                                this.showPlayerHand();
                                return;
                            }
                        }
                    }
                }
                
                console.log('[TRAINING_BATTLE] Still no cards available, ending player turn immediately');
                BattleManager._phase = 'turn';
                return;
            }
            
            // Create hand display window
            if (this._handWindow) {
                this._handWindow.close();
                this.removeChild(this._handWindow);
            }
            
            const rect = new Rectangle(50, 400, 740, 120);
            this._handWindow = new Window_Hand(rect, hand);
            this._handWindow.setHandler('select', this.onCardSelect.bind(this));
            this._handWindow.setHandler('cancel', this.onCardCancel.bind(this));
            this.addChild(this._handWindow);
            this._handWindow.activate();
            
            console.log('[TRAINING_BATTLE] Player hand window created and activated');
        }

        onCardSelect() {
            const cardIndex = this._handWindow.index();
            console.log('[TRAINING_BATTLE] Card selected, index:', cardIndex);
            
            const playerMecha = window.MechaCompositeManager?.getActiveMecha();
            if (playerMecha && playerMecha.combatDeck && cardIndex >= 0) {
                const selectedCard = playerMecha.combatDeck.hand[cardIndex];
                console.log('[TRAINING_BATTLE] Selected card:', selectedCard);
                
                // Play the card using the proper method
                if (selectedCard) {
                    console.log('[TRAINING_BATTLE] Playing card:', selectedCard.name);
                    // TODO: Implement card effects
                    
                    // Use the combat deck's playCard method instead of splice
                    const playedCard = playerMecha.combatDeck.playCard(cardIndex);
                    console.log('[TRAINING_BATTLE] Card played and moved to discard:', playedCard?.name);
                    
                    // Check if player has more cards to play
                    if (playerMecha.combatDeck.hand.length > 0) {
                        // Refresh hand display
                        this.showPlayerHand();
                        return; // Stay in input phase
                    } else {
                        // No more cards, end player turn immediately
                        console.log('[TRAINING_BATTLE] No more cards in hand, ending player turn');
                        BattleManager._phase = 'turn';
                        this._handWindow.deactivate();
                        if (this._handWindow) {
                            this._handWindow.close();
                            this.removeChild(this._handWindow);
                            this._handWindow = null;
                        }
                        return;
                    }
                }
            }
            
            // End player turn
            console.log('[TRAINING_BATTLE] Player turn ended, switching to enemy turn');
            BattleManager._phase = 'turn';
            this._handWindow.deactivate();
            if (this._handWindow) {
                this._handWindow.close();
                this.removeChild(this._handWindow);
                this._handWindow = null;
            }
        }

        onCardCancel() {
            console.log('[TRAINING_BATTLE] Card selection cancelled - ending player turn');
            
            // End player turn when cancelled
            BattleManager._phase = 'turn';
            this._handWindow.deactivate();
            if (this._handWindow) {
                this._handWindow.close();
                this.removeChild(this._handWindow);
                this._handWindow = null;
            }
        }

        processEnemyTurn() {
            console.log('[TRAINING_BATTLE] Processing enemy turn');
            const action = this.opponent.selectAction();
            if (action) {
                console.log('[TRAINING_BATTLE] Enemy selected action:', action.name);
                // TODO: Process enemy action
                
                // Simulate enemy action delay
                setTimeout(() => {
                    console.log('[TRAINING_BATTLE] Enemy turn completed, starting new player turn');
                    BattleManager._phase = 'start';
                }, 1000);
            } else {
                console.log('[TRAINING_BATTLE] Enemy has no valid actions, ending turn');
                setTimeout(() => {
                    BattleManager._phase = 'start';
                }, 500);
            }
        }

        processTrainingVictory() {
            console.log('[TRAINING_BATTLE] processTrainingVictory called');
            this.processVictory();
        }

        checkTrainingBattleEnd() {
            console.log('[TRAINING_BATTLE] checkTrainingBattleEnd called');
            
            // Only check for victory when we explicitly want to
            if (this._forceVictoryCheck) {
                console.log('[TRAINING_BATTLE] Force victory check enabled, checking conditions');
                if (this.opponent && this.opponent.hp <= 0) {
                    console.log('[TRAINING_BATTLE] Opponent defeated, triggering victory');
                    this.processVictory();
                    return true;
                }
                
                const playerMecha = window.MechaCompositeManager?.getActiveMecha();
                if (playerMecha && playerMecha.hp <= 0) {
                    console.log('[TRAINING_BATTLE] Player defeated, triggering defeat');
                    this.processDefeat();
                    return true;
                }
            }
            
            // Don't end battle automatically - let our custom flow handle it
            console.log('[TRAINING_BATTLE] No automatic battle end, continuing training battle');
            return false;
        }

        updateTrainingBattle() {
            // Only log occasionally to prevent spam
            if (!this._lastLoggedPhase || this._lastLoggedPhase !== BattleManager._phase) {
                console.log('[TRAINING_BATTLE] updateTrainingBattle called, phase:', BattleManager._phase);
                this._lastLoggedPhase = BattleManager._phase;
            }
            
            // Don't call the original update - we control the flow entirely
            // Just handle our custom phases
            if (BattleManager._phase === 'start' && !this._processingPhase) {
                this._processingPhase = true;
                this.startDeckTurn();
                this._processingPhase = false;
            } else if (BattleManager._phase === 'input') {
                // Wait for player input - do nothing
            } else if (BattleManager._phase === 'turn' && !this._processingPhase) {
                this._processingPhase = true;
                this.startDeckTurn(); // This will handle enemy turn
                this._processingPhase = false;
            }
        }

        terminate() {
            console.log('[TRAINING_BATTLE] Scene terminating, restoring original BattleManager methods');
            
            // Restore original BattleManager methods
            if (this.originalStartTurn) {
                BattleManager.startTurn = this.originalStartTurn;
            }
            if (this.originalProcessTurn) {
                BattleManager.processTurn = this.originalProcessTurn;
            }
            if (this.originalProcessVictory) {
                BattleManager.processVictory = this.originalProcessVictory;
            }
            if (this.originalCheckBattleEnd) {
                BattleManager.checkBattleEnd = this.originalCheckBattleEnd;
            }
            if (this.originalUpdate) {
                BattleManager.update = this.originalUpdate;
            }
            
            // Clean up windows
            if (this._handWindow) {
                this._handWindow.close();
                this.removeChild(this._handWindow);
                this._handWindow = null;
            }
            
            super.terminate();
            console.log('[TRAINING_BATTLE] Scene terminated and cleaned up');
        }
    }

    // Hand display window
    class Window_Hand extends Window_Command {
        constructor(rect, hand) {
            console.log('[WINDOW_HAND] Constructor called with hand:', hand);
            console.log('[WINDOW_HAND] Hand type:', typeof hand);
            console.log('[WINDOW_HAND] Hand is array:', Array.isArray(hand));
            
            // Call super constructor first
            super(rect);
            
            // Then set properties
            if (!hand) {
                this._hand = [];
                console.log('[WINDOW_HAND] No hand provided, using empty array');
            } else if (Array.isArray(hand)) {
                this._hand = hand;
                console.log('[WINDOW_HAND] Hand is array with', hand.length, 'cards');
            } else {
                console.warn('[WINDOW_HAND] Hand is not an array, converting:', hand);
                this._hand = [];
            }
            
            this.refresh();
        }

        makeCommandList() {
            console.log('[WINDOW_HAND] makeCommandList called, hand:', this._hand);
            console.log('[WINDOW_HAND] Hand length:', this._hand?.length);
            
            try {
                // Ensure _hand is iterable
                if (!this._hand || !Array.isArray(this._hand)) {
                    console.warn('[WINDOW_HAND] Hand is not an array, using empty array');
                    this._hand = [];
                }
                
                for (let i = 0; i < this._hand.length; i++) {
                    const card = this._hand[i];
                    console.log('[WINDOW_HAND] Processing card', i, ':', card);
                    
                    if (card && card.name) {
                        const costText = this.getCostText(card);
                        const name = `${card.name} (${costText})`;
                        this.addCommand(name, 'select', true);
                    } else {
                        console.warn('[WINDOW_HAND] Invalid card at index', i, ':', card);
                        this.addCommand('Invalid Card', 'select', false);
                    }
                }
                
                if (this._hand.length === 0) {
                    this.addCommand('No cards available', 'none', false);
                }
                
                console.log('[WINDOW_HAND] Command list created with', this._list.length, 'commands');
            } catch (error) {
                console.error('[WINDOW_HAND] Error in makeCommandList:', error);
                this.addCommand('Error loading cards', 'none', false);
            }
        }

        getCostText(card) {
            const costs = card.costs || {};
            const costParts = [];
            
            if (costs.machine) costParts.push(`${costs.machine}M`);
            if (costs.mental) costParts.push(`${costs.mental}Me`);
            if (costs.signal) costParts.push(`${costs.signal}S`);
            if (costs.heat) costParts.push(`${costs.heat}H`);
            if (costs.actions) costParts.push(`${costs.actions}A`);
            
            return costParts.join(', ') || 'Free';
        }
    }

    // Expose for external access
    window.Scene_TrainingBattle = Scene_TrainingBattle;
    window.Window_Hand = Window_Hand;
    
    console.log('[TRAINING_BATTLE] Training Battle System loaded successfully');
    console.log('[TRAINING_BATTLE] Scene_TrainingBattle available:', !!window.Scene_TrainingBattle);
    console.log('[TRAINING_BATTLE] Window_Hand available:', !!window.Window_Hand);
})();
