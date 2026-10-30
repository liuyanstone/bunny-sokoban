# 萌兔推箱子 · Bunny Box Garden

Public, bilingual Sokoban game for Mind Garden. Five freely selectable difficulties, each with 200 distinct puzzles; all 1,000 have a complete verified solution. Static HTML/ESM/CSS, no installation, sign-in, build or external runtime library required.

## Play

Move with arrow keys, WASD or touch controls. Push every crate onto a flower. Crates cannot be pulled or pushed two at once. Unlimited undo and restart. Winning awards 100 / 200 / 350 / 600 / 1,000 points for Easy / Medium / Hard / Expert / Master, including separately restarted replays. One award per completed attempt. There is no timer or failure penalty.

The full-solution hint opens a separate automatic replay with pause, replay, speed and close controls. If the current board is on the verified solution, its suffix is used; otherwise a Web Worker runs a push-state A* search. If the bounded search cannot find a solution, it clearly switches to the verified original solution. Watching neither changes the player's board nor earns score. Closing the replay terminates pending search/timers.

Progress, individual level attempts, selected level/difficulty and total scores are local to the browser/device. English/Chinese preference uses `bunny-sokoban-language` and integrates with the garden's language selector. No score or personal data is uploaded.

## Levels and license

Boxoban (Google DeepMind), Apache 2.0. Original source and attribution are linked inside the game and preserved in NOTICE and licenses/. Source file and puzzle ID are visible for each level. Puzzles were curated into distinct difficulty bands using verified push counts: Easy 4–9; Medium 14–17; Hard 22–44. These are game-specific difficulty bands, not a claim of equivalent human difficulty for every puzzle. No rotation/reflection duplicates across all 1,000 puzzles. The original 600 IDs, boards and solutions are unchanged.

`tools/solve.cpp` finds full solutions using push-state A*, reverse goal distances, matching and deadlock pruning. `tools/prepare-levels.py` curates and crops source data without changing playable topology. Provenance is in `tools/source.json`.

## Verification

Serve this directory with a static HTTP server. Run `node check.mjs`: independently replays every solution, checks all 1,000 boards and unique shapes, tests the runtime solver, collision/pushing behavior, immutable undo snapshots, scoring and bilingual parity.

## Expert and Master update

Each adds 200 puzzles from David W. Skinner’s Sasquatch I–XII collections,
redistributed under the author’s name/email credit permission. Full original
source, notes and solutions are preserved unchanged in collections/Skinner.sok;
see NOTICE and licenses/skinner-permission.txt. Selection: at least five and
at most sixty crates, at least thirty pushes in the verified source solution.
The upper 400 selected puzzles are split and ordered by verified solution push
counts: Expert 30–85, Master 86–1,556. These are not proven minimum push counts
or a guarantee of a human difficulty boundary.

Reference: the App Store listing for 推箱子大全-解谜5000个有趣的关卡 (ID 1057916274)
describes crowded warehouses and careful pushing order, but does not publicly
disclose its top two difficulty inventories. The new tiers interpret that
classic multi-crate challenge with credited, independently verified levels.

Large maps have fit/zoom/scroll controls and follow the bunny when moving.
Full solution replays have independent zoom, faster playback and a seek slider.
Replay seeking simulates legal moves on a separate state and never awards score.
A bounded worker searches from deviating player positions with up to 10 crates;
larger boards fall back to their verified complete original replay. Known
solution suffixes work for any crate count. Live-search fallback does not imply
that a position is mathematically unsolvable.

Existing version-1 saves are extended with Expert/Master selections without
resetting scores, completed levels or in-progress attempts. A polynomial-time
matching heuristic replaces the four-crate-only assumption for live searches.
