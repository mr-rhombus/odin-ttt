function Player(name) {
  this.name = name;
  this.marker;
  this.numWins = 0;

  const setMarker = (marker) => {
    this.marker = marker;
  };

  const getMarker = () => this.marker;

  const getWins = () => this.numWins;

  const addWin = () => (this.numWins += 1);

  const getName = () => this.name;

  return {
    setMarker,
    getMarker,
    getWins,
    addWin,
    getName,
  };
}

function Board() {
  this._state = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  this._getPossibleWinArrs = () => {
    const possibleWinArrs = [
      // Diagonals
      [this._state[0][0], this._state[1][1], this._state[2][2]],
      [this._state[0][2], this._state[1][1], this._state[2][0]],
    ];
    this._state.forEach((_, n) => {
      // Row
      possibleWinArrs.push(this._state[n]);

      // Column
      possibleWinArrs.push(this._state.map((row) => row[n]));
    });

    return possibleWinArrs;
  };

  const update = (row, col, marker) => {
    this._state[row][col] = marker;
  };

  const winnerExists = () => {
    const possibleWinArrs = this._getPossibleWinArrs();
    return possibleWinArrs.some((arr) => _allValsEqual(arr));
  };

  const _allValsEqual = (arr) => {
    return arr.every((val) => val == arr[0] && val);
  };

  const reset = () => {
    this._state = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
  };

  return { update, winnerExists, reset };
}

function GameController() {
  this.player1 = new Player("Player 1");
  this.player2 = new Player("Player 2");
  this.player1.setMarker("X");
  this.player2.setMarker("O");

  this.board = Board();
  this.numTurns = 0;
  this._whoseTurn;
  this._winnerExists = this.board.winnerExists();
  this.winner;

  const getPlayers = () => {
    return [this.player1, this.player2];
  };

  const whoseTurn = () => {
    if (!this._whoseTurn) {
      Math.random() < 0.5
        ? (this._whoseTurn = this.player1)
        : (this._whoseTurn = this.player2);
    }
    return this._whoseTurn;
  };

  const _toggleTurn = () => {
    this._whoseTurn =
      this._whoseTurn === this.player1 ? this.player2 : this.player1;
  };

  const playTurn = (player, row, column) => {
    this.board.update(row, column, player.getMarker());
    this.numTurns += 1;
    _toggleTurn();

    if (this.numTurns > 4) {
      this._winnerExists = this.board.winnerExists();
    }

    if (this._winnerExists) {
      this.winner = player;
      handleWin();
    }
  };

  const handleWin = () => {
    this.winner.addWin();
  };

  const reset = () => {
    this.board.reset();
    this.numTurns = 0;
    this.winner = undefined;
    this._winnerExists = false;
  };

  const winnerExists = () => {
    return this._winnerExists;
  };

  const getWinner = () => {
    return this.winner;
  };

  const _gameIsTied = () => {
    return !this._winnerExists & (this.numTurns === 9);
  };

  const gameIsOver = () => {
    return _gameIsTied() || winnerExists();
  };

  return {
    getPlayers,
    playTurn,
    whoseTurn,
    winnerExists,
    getWinner,
    gameIsOver,
    reset,
  };
}

function DisplayController() {
  this.gameController = GameController();
  const playerCards = document.querySelectorAll(".player-card");
  const actions = document.querySelector(".actions");
  const resetBtn = document.querySelector(".reset");

  const _toggleTurnStyling = () => {
    playerCards.forEach((card) => {
      card.querySelector(".player-marker").classList.toggle("can-move");
      card.querySelector(".player-name").classList.toggle("can-move");
    });
  };

  const _updateScoreboard = () => {
    const players = this.gameController.getPlayers();
    players.forEach((player, i) => {
      const card = playerCards[i];
      card.dataset.playerName = player.getName();
      const markerEl = card.querySelector(".player-marker");
      markerEl.textContent = player.getMarker();
      const nameEl = card.querySelector(".player-name");
      nameEl.textContent = player.getName();
      card.querySelector(".win-cnt").textContent = player.getWins();
      // Styling to indicate who moves first
      if (this.gameController.whoseTurn() === player) {
        markerEl.classList.add("can-move");
        nameEl.classList.add("can-move");
      } else {
        markerEl.classList.remove("can-move");
        nameEl.classList.remove("can-move");
      }
    });
  };

  const _handleClick = (event) => {
    if (event.target.textContent) {
      return;
    }
    const whoseTurn = this.gameController.whoseTurn();
    this.gameController.playTurn(
      whoseTurn,
      event.target.dataset.row,
      event.target.dataset.col,
    );
    event.target.textContent = whoseTurn.getMarker();

    this.gameController.gameIsOver() ? _handleEndGame() : _toggleTurnStyling();
  };

  const _handleEndGame = () => {
    actions.style.display = "flex";
    cells.forEach((cell) => cell.removeEventListener("click", _handleClick));
    if (this.gameController.winnerExists()) {
      actions.querySelector(".game-over").textContent =
        "🎉 " + this.gameController.getWinner().getName() + " wins! 🎉";
    } else {
      actions.querySelector(".game-over").textContent = "Tie game, try again!";
    }
  };

  const _reset = (e) => {
    this.gameController.reset();
    cells.forEach((cell) => {
      cell.textContent = "";
      cell.addEventListener("click", _handleClick);
    });
    actions.style.display = "none";
    _updateScoreboard();
  };

  // Initialize
  _updateScoreboard();

  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => cell.addEventListener("click", _handleClick));

  resetBtn.addEventListener("click", _reset);
}

DisplayController();
