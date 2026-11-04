# Tic Tac Toe
**Game**: Play [here](https://mr-rhombus.github.io/odin-ttt/)

## Primary Objective 🥇
Build a tic tac toe game in the browser to practice JS concepts including including objects, constructors, and closures. The instructions for this project, per The Odin Project (⚡️), can be found [here](https://www.theodinproject.com/lessons/node-path-javascript-tic-tac-toe). The source code for the game lives in the files at root.

## Secondary Objective 🥈
In the interest of getting more comfortable integrating AI into my development workflow, I also did the following:
1. Have GitHub Copilot critique my code so I can identify mistakes, oversight, and/or simply benefit from another perspective
2. Have an agent create its own version of the game, the code for which can be found in the `agent-game/` folder

### AI Critique of my game 🤓
#### The good ✅
- Good separation between player, board, game flow, and display
- Reasonable gameplay UI/UX and endgame presentation

#### Areas for improvement 📈
- Players can't enter their own names
  - Rebuttal: I purposely left that out since I saw the closures, game logic, and separation of concerns as greater learning opportunities
- The (non-player) factories rely on global `this` when instead they should manage state with local vars
  - Reflection: If they're meant to be factories, they should be instantiated with the `new` keyword. But they're not (nor should they be) -- `Board`, `GameController`, and `DisplayController` are only meant to be instantiated once
- `GameController` doesn't enforce legal moves. This is instead offloaded to `DisplayController`, which muddies the separation of concerns

### Agentic Game Review
**Prompt**
```
build a tic tac toe game in the odin-ttt/agent-game directory according to the following instructions: https://www.theodinproject.com/lessons/node-path-javascript-tic-tac-toe
```
**Model**: Claude Opus 5.5

#### Reflection
- `index.html`
  - Very simple with a single form to collect player name inputs and a div representing the board
- `style.css`
  - Nice dark theming with purple accents
  - Spacing and fonts often use `rem` but occasionally use `px`
- `script.js`
  - `GameBoard`
    - Single array with 9 elements (instantiated using the `Array` object)
    - Handles mark placement validation
    - Exposes its state, allows for mark placement, and allows for resetting -- very simple and to the point
  - `createPlayer` is a very simple factory function that returns a player object. Nothing fancy
  - `GameController`
    - Checks for valid win conditions
    - Tracks active player and endgame (game over, winner, winning line, etc.)
    - `start` func encapsulates new game logic succinctly
    - Nifty logic to toggle active player (new active player = 1 - current active player index)
    - Returns a state object that tracks the board, active player, and endgame information
    - Is an IIFE, keeping internal state private, but making itself accessible to the rest of the code
  - `DisplayController`
    - Most work lies in the `render` func, which renders the latest state passed from the `GameController`
      - Cells on the board are dynamically generated on each call (seems a bit wasteful?)
      - Each cell contains a data attribute matching its index in the `Gameboard`'s `board`
    - The entire board listens for a click then identifies the closest cell to the click and runs the `render` func accordingly
    - The game starts once the "Start game" btn is clicked
- I like the `GameController` <- state -> `DisplayController.render` contract -- very easy to follow that all state is passed from one to the other in one place, then rendered accordingly
- I like how the board is treated as a single array (rather than my approach of a 3x3 array) -- this especially helps with highlighting the winning line, which is something I attempted but gave up on due to the complexity given my 3x3 array approach for the board state