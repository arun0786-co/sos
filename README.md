# sos

the pencil and paper game sos, in the browser with p5.js. play it here:
https://arun0786-co.github.io/sos/

two players take turns writing an S or an O in an empty square. writing S-O-S in a line
(across, down or diagonal) scores.

- **simple game**: the first sos wins. a full board with no sos is a draw.
- **general game**: play until the board is full, most sos wins. making an sos gives you
  another turn.

## what's in it

- board from 3 x 3 to 9 x 9
- each side can be a human or the computer
- the computer takes the move that makes the most sos. if it can't score, it takes the
  move that leaves the other player the fewest sos to make next turn
- record a game and replay it move by move (saved in the browser)
- the sos lines are drawn in the colour of the player who made them

## run it locally

open `index.html` through any local web server, for example:

```
python3 -m http.server
# then http://localhost:8000
```

## code

- `rules.js`: the rules with no drawing: finding sos lines, full board, counting
  openings for the computer. works in the browser and in node.
- `game.js`: drawing, mouse and keys, turns, scores, computer player, record and replay.
- `tests/rules.test.js`: tests for the rules, `node --test tests/*.test.js`.

started in may 2026 as a small p5.js exercise; the rules split, computer player and
replay came later.
