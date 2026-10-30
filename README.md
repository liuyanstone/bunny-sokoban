# 萌兔推箱子 · Bunny Box Garden

Public, bilingual Sokoban game for Mind Garden. Three freely selectable difficulties, each with 200 distinct puzzles; all 600 have a complete verified solution. Static HTML/ESM/CSS, no installation, sign-in, build or external runtime library required.

## Play

Move with arrow keys, WASD or touch controls. Push every crate onto a flower. Crates cannot be pulled or pushed two at once. Unlimited undo and restart. Winning awards 100 / 200 / 350 points for Easy / Medium / Hard, including separately restarted replays. One award per completed attempt. There is no timer or failure penalty.

The full-solution hint opens a separate automatic replay with pause, replay, speed and close controls. If the current board is on the verified solution, its suffix is used; otherwise a Web Worker runs a push-state A* search. If the bounded search cannot find a solution, it clearly switches to the verified original solution. Watching neither changes the player's board nor earns score. Closing the replay terminates pending search/timers.

Progress, individual level attempts, selected level/difficulty and total scores are local to the browser/device. English/Chinese preference uses `bunny-sokoban-language` and integrates with the garden's language selector. No score or personal data is uploaded.

## Levels and license

Boxoban (Google DeepMind), Apache 2.0. Original source and attribution are linked inside the game and preserved in NOTICE and licenses/. Source file and puzzle ID are visible for each level. Puzzles were curated into distinct difficulty bands using verified push counts: Easy 4–9; Medium 14–17; Hard 22–44. These are game-specific difficulty bands, not a claim of equivalent human difficulty for every puzzle. No rotation/reflection duplicates across the 600 puzzles.

`tools/solve.cpp` finds full solutions using push-state A*, reverse goal distances, matching and deadlock pruning. `tools/prepare-levels.py` curates and crops source data without changing playable topology. Provenance is in `tools/source.json`.

## Verification

Serve this directory with a static HTTP server. Run `node check.mjs`: independently replays every solution, checks all 600 boards and unique shapes, tests the runtime solver, collision/pushing behavior, immutable undo snapshots, scoring and bilingual parity.
