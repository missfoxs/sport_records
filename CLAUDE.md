# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a fitness tracking application (运动记录 - Sports Records) currently in the prototype stage. The project contains HTML prototype files that demonstrate the UI/UX for a mobile fitness tracking app.

## Current State

The codebase consists of:
- `index.html` - Main page with exercise tasks, stats, and add exercise modal
- `statistics.html` - Statistics page with charts and workout records

## Installed Plugins/Skills

- **Marketplace**: `anthropic-agent-skills` (configured)
- To list available skills: Run `/plugin list` in Claude Code interface
- To install a skill: Run `/plugin install <skill-name>`

## Architecture

### Prototype Design

The prototype uses pure HTML/CSS with:
- **Layout**: Mobile-first design with a max-width container (430px) simulating a phone screen
- **Styling**: Custom CSS with linear gradients, custom fonts, and a light theme
- **Design System**:
  - Primary colors: `#667eea` (purple) to `#764ba2` gradient
  - Background: White/light gray (#f2f4f8)
  - Border radius: 16-20px for cards
  - Modal: Bottom sheet design with slide-up animation

### UI Components

The prototype showcases these components:
- **Header**: App title ("FITLOG") with navigation buttons
- **Stats Bar**: Grid of 2 statistics (workout days, streak)
- **Task Cards**: Daily workout tasks with completion status, tags, and details
- **Add Exercise Modal**: Bottom sheet with exercise type selection, name input, tag, and plan
- **Bottom Navigation**: 2-tab navigation (Home, Statistics)
- **Statistics Page**: Trend charts, workout distribution, personal records, calendar heatmap

### Visual Design Patterns

- Gradient backgrounds for headers and buttons
- Hover/active states with scale transforms
- Card-based layout with subtle borders and backgrounds
- Grid-based layouts for stats and navigation
- Emoji-based icons throughout
- Chart.js for data visualization

## Development Notes

This is a visual prototype only - there is no backend, React Native implementation, or build system currently implemented. The files can be opened directly in a browser to view the design.

Future implementation will use React Native with:
- State management: Zustand
- Date/time: dayjs
- Navigation: React Navigation
- Charts: react-native-chart-kit or similar
