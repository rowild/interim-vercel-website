# Changelog

All notable changes to this project will be documented in this file.

## [2025-11-04]

### Added
- Greyscale filter to hero gallery thumbnail images with smooth color transition on hover
- Autoplay button now has cursor pointer and border color animation on hover (transitions to accent color)
- Autoplay immediately transitions to next slide when enabled (no delay)
- Active thumbnail scaling animation (4% scale increase) with smooth border color and image transitions
- Language selector fade-in and slide-down animation in intro timeline (appears shortly after logo)
- Pause/resume functionality for autoplay timer to prevent unnecessary resets
- Reusable GSAP timeline factories for hero gallery text and CTA transitions (`app/utils/animations/*`)
- Troubleshooting guide on SplitText + Vue reactivity conflicts (`docs/SPLITTEXT-VUE-REACTIVITY.md`)

### Changed
- Optimized thumbnail hover animations setup - now runs once after intro completes instead of on every Vue re-render
- Removed Vue ref callback pattern that was causing 56+ unnecessary function calls
- Replaced `v-if` with `v-show` for autoplay UI elements to prevent DOM manipulation and re-renders
- Improved autoplay timer flow - timer now continues counting during transitions instead of pausing
- Centered countdown numbers in autoplay button circle using `inset-0` positioning
- Active/inactive thumbnail transitions now have overlapping timing for smoother handoff (activation: 0.4s, deactivation: 0.25s)
- Autoplay timer triggers slide transition at countdown=2 (instead of 1) to sync perfectly with circle animation completing

### Fixed
- Eliminated excessive re-renders when toggling autoplay
- Fixed CTA buttons disappearing when autoplay enabled (removed inline `style="opacity:0"` from template)
- Fixed autoplay timer resetting after fadeIn completes (now uses pause/resume instead of stop/start)
- Fixed autoplay timer circle stopping at 2 seconds - now completes full rotation to 0 before resetting
- Fixed timing synchronization between countdown circle and slide transitions

### Technical Improvements
- Thumbnail hover animations now use `querySelectorAll` in `setupAllThumbnailHoverAnimations()` function
- Removed unused `thumbnailItems` Set that was only being populated and cleared
- Better separation of concerns between GSAP animations and Vue reactivity
- Performance improvements through reduced function calls and DOM manipulation
- Added `resume()` and `pause()` methods to `useAutoplayTimer` composable for better timer control
- Calculated fadeOut duration (~1.5s) to trigger transition early and maintain smooth timer circle animation
- Added `resetSplitTextChars` helper to safely reuse SplitText instances during slide transitions
- Allowed Claude CLI to execute `pnpm add` commands for future dependency updates
