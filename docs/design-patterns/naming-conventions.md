# Naming Conventions for Copilot Consistency

## File Naming
- **Plugin files**: PascalCase ending in .js (e.g., `MechaFrame.js`)
- **Data files**: lowercase with dashes (e.g., `mecha-frames.json`)
- **Documentation**: lowercase with dashes (e.g., `api-reference.md`)

## JavaScript Naming
- **Classes**: PascalCase (e.g., `MechaFrame`, `PilotSystem`)
- **Functions**: camelCase (e.g., `calculateEfficiency`, `validateLoadout`)
- **Variables**: camelCase (e.g., `pilotAptitudes`, `frameData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_WEIGHT_LIMIT`, `BASE_ACTIONS_PER_TURN`)

## Data Structure IDs
- **Frames**: `frame_[weightclass]_[role]` (e.g., `frame_light_scout`)
- **Parts**: `part_[type]_[name]` (e.g., `part_weapon_plasma_rifle`)
- **Pilots**: `pilot_[name]_[surname]` (e.g., `pilot_alex_chen`)
- **Copilots**: `copilot_[designation]` (e.g., `copilot_aria_7`)
- **Cards**: `card_[source]_[name]` (e.g., `card_pilot_precision_strike`)

## Plugin Architecture
- All plugins use IIFE wrapper: `(() => { 'use strict'; })()`
- Plugin parameters accessed via: `PluginManager.parameters(pluginName)`
- Global data stored in: `$gameSystem._customData[systemName]`