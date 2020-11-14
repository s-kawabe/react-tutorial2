import classNames from 'classnames'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  
  let square;
  if(props.winLine && props.winLine.includes(props.num)) {
    square = <button 
    className={classNames("square", "square" + props.value, "win-line")}
    onClick={props.onClick}
  >
    {props.value}
  </button>
  } else {
    square = <button 
    className={classNames("square", "square" + props.value)}
    onClick={props.onClick}
  >
    {props.value}
  </button>
  }

  return square;
}

class Board extends React.Component {
  renderSquare(i) {
    let result;
    if(this.props.winLine) {
      result = (<Square 
        value={this.props.squares[i]}
        num={i}
        onClick={() => this.props.onClick(i)}
        winLine={this.props.winLine}
      />);
    } else {
      result = (<Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />);
    }
    return result;
  }

  render() {
    // :TODO3 fix hard cording    
    let cnt = 0;
    let result = [];

    for(let row = 0; row < 3; row++) {
      let elem = [];
      for(let col = 0; col < 3; col++) {
        elem.push(this.renderSquare(cnt));
        cnt++;
      }
      result.push(<div className="board-row">{elem}</div>)
    }

    return (
      <div>{result}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        selected: null
      }],
      stepNumber: 0,
      xIsNext: true,
      isListAsc: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // ローカルのsquaresに値渡しする
    const squares = current.squares.slice();

    // 既に勝者が決まっている or クリックした領域が選択済みの場合は何もアクションしない
    if(calculateWinner(squares) || squares[i]) {
      return;
    }

    if(this.state.xIsNext) {
      squares[i] = 'X';
    } else {
      squares[i] = 'O';
    }

    this.setState({
      history: history.concat([{
        squares: squares,
        selected: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  switchList() {
    this.setState({
      isListAsc: !this.state.isListAsc 
    })
  }

  render() {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // map([callback(value,index)]) step: value, move: index
    const moves = history.map((step,move) => {
      
      // :TODO1 log disp row and col
      let row = Math.floor(step.selected/3) + 1;
      let col = step.selected % 3 + 1; 
      
      // ★firstMessage disp when move == 0 
      let desc = move ?
        `Go to move ${move}(${row},${col})` :
        'Go to game start'; //★
      
      // :TODO2 current log to bold
      if (step === current) { 
        desc = <strong>{desc}</strong>;
      }

      return (<li key={move}>
        <button onClick={() => this.jumpTo(move)}>{desc}</button>
      </li>);
    })

    let status;
    if(winner) {
      if(winner === 'draw') {
        status = 'DRAW...';
      } else {
        status = 'Winner:' + winner[0]
      }
      
    } else {
      status = 'Next player:' + (this.state.xIsNext ? 'X' : 'O');
    } 

    let board = null;
    if(winner) {
      board = <Board 
      squares={current.squares}
      onClick={(i) => this.handleClick(i)}
      winLine={winner[1]}
      />
    } else {
      board = <Board 
      squares={current.squares}
      onClick={(i) => this.handleClick(i)}
      />
    }

    return (
      <div className="game">
        <div className="game-board">
          {board}
        </div>
        <div className="game-info">
          <div>{status}</div>
          {/* TODO4 list togge button */}
          <button onClick={() => this.switchList()}>toggle</button>
          {this.state.isListAsc ? <ol>{moves}</ol> : <ol>{moves.reverse()}</ol>}
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
      return [squares[a], lines[i]];
    }
  }

  if(squares.every((elem) => { return elem !== null; })) {
    return 'draw';
  }

  return null;
}
