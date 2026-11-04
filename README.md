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

```
**Model**: 