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
  this._winnerExists = false;
  this.winner;

  const whoseTurn = () => {
    // First turn
    if (this.numTurns === 0) {
      Math.random() < 0.5
        ? (this._whoseTurn = this.player1)
        : (this._whoseTurn = this.player2);
    }
    console.log(this._whoseTurn.getName() + "'s turn");
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

    if (!this._winnerExists & (this.numTurns === 9)) {
      console.log("Tie!");
      this.board.reset();
    }
  };

  const handleWin = () => {
    this.winner.addWin();
    this.board.reset();
  };

  const winnerExists = () => {
    return this.board.winnerExists();
  };

  const getWinner = () => {
    return this.winner;
  };

  return { playTurn, whoseTurn, winnerExists, getWinner };
}

function DisplayController() {
  this.gameController = GameController();

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

    if (this.gameController.winnerExists()) {
      cells.forEach((cell) => (cell.textContent = ""));
      console.log(this.gameController.getWinner().getName() + " wins!");
    }
  };

  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => cell.addEventListener("click", _handleClick));
}

DisplayController();
