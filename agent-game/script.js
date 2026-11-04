const Gameboard = (() => {
  const size = 9;
  let board = Array(size).fill("");

  const getBoard = () => [...board];
  const placeMark = (index, mark) => {
    if (index < 0 || index >= size || board[index] !== "") return false;
    board[index] = mark;
    return true;
  };
  const reset = () => {
    board = Array(size).fill("");
  };

  return { getBoard, placeMark, reset };
})();

const createPlayer = (name, mark) => ({ name, mark });

const GameController = (() => {
  const winLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let players = [createPlayer("Player 1", "X"), createPlayer("Player 2", "O")];
  let activeIndex = 0;
  let winner = null;
  let winningLine = null;
  let tie = false;

  const getActivePlayer = () => players[activeIndex];
  const isOver = () => winner !== null || tie;

  const checkResult = () => {
    const b = Gameboard.getBoard();
    for (const line of winLines) {
      const [a, c, d] = line;
      if (b[a] && b[a] === b[c] && b[a] === b[d]) {
        winner = getActivePlayer();
        winningLine = line;
        return;
      }
    }
    if (b.every((cell) => cell !== "")) tie = true;
  };

  const start = (nameX, nameO) => {
    players = [
      createPlayer(nameX || "Player 1", "X"),
      createPlayer(nameO || "Player 2", "O"),
    ];
    Gameboard.reset();
    activeIndex = 0;
    winner = null;
    winningLine = null;
    tie = false;
  };

  const playRound = (index) => {
    if (isOver()) return false;
    if (!Gameboard.placeMark(index, getActivePlayer().mark)) return false;
    checkResult();
    if (!isOver()) activeIndex = 1 - activeIndex;
    return true;
  };

  const getState = () => ({
    board: Gameboard.getBoard(),
    activePlayer: getActivePlayer(),
    winner,
    winningLine,
    tie,
    over: isOver(),
  });

  return { start, playRound, getState };
})();

const DisplayController = (() => {
  const boardEl = document.querySelector("#board");
  const statusEl = document.querySelector("#status");
  const form = document.querySelector("#setup");
  const startBtn = document.querySelector("#start");
  const nameX = document.querySelector("#name-x");
  const nameO = document.querySelector("#name-o");
  let started = false;

  const render = () => {
    const { board, activePlayer, winner, winningLine, tie, over } =
      GameController.getState();
    boardEl.textContent = "";
    board.forEach((mark, i) => {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cell";
      cell.dataset.index = i;
      cell.textContent = mark;
      cell.setAttribute(
        "aria-label",
        `Cell ${i + 1}${mark ? `: ${mark}` : ""}`,
      );
      if (mark) cell.classList.add(mark.toLowerCase());
      if (winningLine?.includes(i)) cell.classList.add("win");
      cell.disabled = !started || over || mark !== "";
      boardEl.appendChild(cell);
    });

    if (!started) statusEl.textContent = "Enter names and press Start.";
    else if (winner)
      statusEl.textContent = `${winner.name} (${winner.mark}) wins!`;
    else if (tie) statusEl.textContent = "It's a tie!";
    else
      statusEl.textContent = `${activePlayer.name}'s turn (${activePlayer.mark})`;
  };

  boardEl.addEventListener("click", (e) => {
    const cell = e.target.closest(".cell");
    if (!cell) return;
    if (GameController.playRound(Number(cell.dataset.index))) render();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    GameController.start(nameX.value.trim(), nameO.value.trim());
    started = true;
    startBtn.textContent = "Restart game";
    render();
  });

  render();
})();
