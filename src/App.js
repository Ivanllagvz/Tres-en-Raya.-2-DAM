import { useState } from 'react';

function Square({ value, onSquareClick, isWinnerSquare }) {
  return (
    <button className={`square ${isWinnerSquare ? 'ganador' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningSquares: [a, b, c] };
    }
  }
  return null;
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const renderSquare = (i, isWinnerSquare) => (
    <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} isWinnerSquare={isWinnerSquare} />
  );

  const renderRow = (start) => {
    const row = [];
    for (let i = 0; i < 3; i++) {
      const squareIndex = start + i;
      const isWinnerSquare =
        calculateWinner(squares) && calculateWinner(squares).winningSquares.includes(squareIndex);
      row.push(renderSquare(squareIndex, isWinnerSquare));
    }
    return (
      <div key={start} className="board-row">
        {row}
      </div>
    );
  };

  const renderBoard = () => {
    const winnerInfo = calculateWinner(squares);
    const isDraw = squares.every((square) => square !== null) && !winnerInfo;

    if (winnerInfo) {
      const [a, b, c] = winnerInfo.winningSquares;
      return (
        <>
          <div className="status">Ganador: {winnerInfo.winner}</div>
          {renderRow(0)}
          {renderRow(3)}
          {renderRow(6)}
        </>
      );
    } else if (isDraw) {
      return <div className="status">¡Empate!</div>;
    } else {
      return (
        <>
          <div className="status">Siguiente jugador: {xIsNext ? 'X' : 'O'}</div>
          {renderRow(0)}
          {renderRow(3)}
          {renderRow(6)}
        </>
      );
    }
  };

  return <>{renderBoard()}</>;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [ascendingOrder, setAscendingOrder] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const toggleOrder = () => {
    setAscendingOrder((prevOrder) => !prevOrder);
  };

  const moves = history.map((squares, move) => {
    const description = move ? `(${move % 3 + 1}, ${Math.floor(move / 3) + 1})` : 'Inicio del juego';
    const adjustedMove = ascendingOrder ? move : history.length - 1 - move;
    return (
      <li key={move}>
        {adjustedMove === currentMove ? (
          <span>Estás en el movimiento {description}</span>
        ) : (
          <button onClick={() => jumpTo(adjustedMove)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>
          <button onClick={toggleOrder}>
            Orden: {ascendingOrder ? 'Ascendente' : 'Descendente'}
          </button>
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}