# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a fitness tracking application (运动记录 - Sports Records) currently in the prototype stage. The project contains a single HTML prototype file that demonstrates the UI/UX for a mobile fitness tracking app.

## Current State

The codebase consists of:
- `fitness-prototype.html` - A standalone HTML/CSS prototype demonstrating the app's visual design and user interface

## Architecture

### Prototype Design

The prototype uses pure HTML/CSS with:
- **Layout**: Mobile-first design with a max-width container (430px) simulating a phone screen
- **Styling**: Custom CSS with linear gradients, custom fonts (Bebas Neue, Oswald), and a dark theme
- **Design System**:
  - Primary colors: `#00ff88` (neon green) and `#00d4ff` (cyan)
  - Background: Dark gradients (#0a0a0a to #1a1a1a)
  - Border radius: 25px for cards, 40px for main container
  - Glassmorphism: backdrop-filter blur effects on bottom navigation

### UI Components

The prototype showcases these components:
- **Header**: App title ("FITLOG") with profile button
- **Stats Bar**: Grid of 3 statistics (streak, weekly progress, total calories)
- **Task Cards**: Daily workout tasks with completion status, icons, and details
- **Calendar Row**: Weekly calendar showing workout days
- **Bottom Navigation**: 4-tab navigation with icons
- **Floating Action Button (FAB)**: "+" button for adding new entries

### Visual Design Patterns

- Gradient text effects for branding elements
- Hover states with scale transforms and shadow enhancements
- Card-based layout with subtle borders and backgrounds
- Grid-based layouts for stats and navigation
- Emoji-based icons throughout

## Development Notes

This is a visual prototype only - there is no backend, JavaScript functionality, or build system currently implemented. The file can be opened directly in a browser to view the design.
