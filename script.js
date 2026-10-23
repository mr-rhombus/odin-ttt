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
    [, , ,],
    [, , ,],
    [, , ,],
  ];

  this._possibleWinArrs = [
    // Diagonals
    [this._state[0][0], this._state[1][1], this._state[2][2]],
    [this._state[0][2], this._state[1][1], this._state[2][0]],
  ];
  this._state.forEach((n) => {
    // Row
    this._possibleWinArrs.push(this._state[n]);

    // Column
    this._possibleWinArrs.push(this._state.map((row) => row[n]));
  });

  const update = (row, col, marker) => {
    this._state[row][col] = marker;
  };

  const winnerExists = () => {
    return this._possibleWinArrs.some((arr) => _allValsEqual(arr));
  };

  const _allValsEqual = (arr) => {
    return arr.every((val) => val == arr[0]);
  };

  const reset = () => {
    this._state = [
      [, , ,],
      [, , ,],
      [, , ,],
    ];
  };

  return { update, winnerExists, reset };
}

function GameController(player1, player2) {
  this.player1 = player1;
  this.player2 = player2;
  this.board = Board();
  this.totalMoves = 0;
  this.winnerExists = false;
  this.winner;

  const whoseTurn = () => {
    const p1CanMakeMove = this.player1.getCanMakeMove();
    const p2CanMakeMove = this.player2.getCanMakeMove();

    // First turn
    if (!p1CanMakeMove & !p2CanMakeMove) {
      Math.random < 0.5
        ? this.player1.toggleCanMakeMove()
        : this.player2.toggleCanMakeMove();
    }

    if (p1CanMakeMove) {
      return this.player1;
    }

    if (p2CanMakeMove) {
      return this.player2;
    }
  };

  const playTurn = (player, row, column) => {
    this.board.update(row, column, player.getMarker());
    this.numTurns += 1;

    if (this.numTurns > 4) {
      this.winnerExists = this.board.winnerExists();
    }

    if (this.winnerExists) {
      this.winner = player;
      handleWin();
    }

    if (!this.winnerExists & (this.numTurns === 9)) {
      console.log("Tie!");
      this.board.reset();
    }
  };

  const handleWin = () => {
    this.winner.addWin();
    console.log(this.winner.getName() + " wins!");
    this.board.reset();
  };

  const checkBoard = () => {
    return this._state;
  };

  return { playTurn, whoseTurn, checkBoard };
}
