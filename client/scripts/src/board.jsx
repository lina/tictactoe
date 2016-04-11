import React from 'react';

import util from './util';

const Cell = React.createClass({
	playerMoved: function() {
		this.props.playerMoved(this.props.gridStatus.row, this.props.gridStatus.column);
	},
	render: function() {
		let cellDisplayStyle = {};

		if(parseInt(this.props.gridStatus.row) === 0) {
			cellDisplayStyle.borderTop = "none";
		} 

		if(parseInt(this.props.gridStatus.column) === 0) {
			cellDisplayStyle.borderLeft = "none";
		} 

		if(parseInt(this.props.gridStatus.column) === this.props.gameSize-1) {
			cellDisplayStyle.borderRight = "none";
		} 

		if(parseInt(this.props.gridStatus.row) === this.props.gameSize-1) {
			cellDisplayStyle.borderBottom = "none";
		} 

		if(this.props.gridStatus.value === null) {
			return (
				<div className="board-row-cell" onClick={this.playerMoved} style={cellDisplayStyle}></div>
			)
		} else {
			return (
				<div className="board-row-cell-filled" style={cellDisplayStyle}>{this.props.gridStatus.value}</div>
			)
		}
	}
});

const GridRow = React.createClass({
	createRow: function(gridStatus) {
		return (
			<Cell gridStatus={gridStatus} playerMoved={this.props.playerMoved} gameSize={this.props.gameSize}/>
		)
	},
	render: function() {
		return (
			<div className="board-row">
				{this.props.row.map(this.createRow)}
			</div>
		)
	}
});

const GridView = React.createClass({
	createGrid: function(gridRow) {
		return (
    	<GridRow row={gridRow} playerMoved={this.props.playerMoved} gameSize={this.props.gameSize}/>
		)
	},
	render: function() {
		return (
			<div>
				{this.props.board.map(this.createGrid)}
			</div>
		)
	}
})

const Board = React.createClass({
	getInitialState: function() {
		if(window.innerWidth < 767) {
			return {
				gameSize: 3,
				board: util.createBoard(3),
				gameStatus: util.createGameStatus(3),
				currentPlayer: 'X',
				gameStatusText: ''
			}	
		} else {
			return {
				gameSize: 0,
				board: [],
				gameStatus: [],
				currentPlayer: 'X',
				gameStatusText: ''
			}			
		}
	},
	createGame: function(e) {
		let gameSize = parseInt(e.target.innerHTML[0]);

		this.setState({
			gameSize: gameSize,
			board: util.createBoard(gameSize),
			gameStatus: util.createGameStatus(gameSize)
		});

	},
	checkWinner: function(currentPlayer, row, column) {
		let rowKey = 'r' + row;
		let colKey = 'c' + column;

		let keyNames = [rowKey, colKey];

		let newGameStatusText = '';

		if(row === column) {
			keyNames.push('d1');
		}

		if(parseInt(row) + parseInt(column) === this.state.gameSize - 1) {
			keyNames.push('d2');
		}

		let newGameStatus = this.state.gameStatus;
		var that = this;
		keyNames.forEach(function(keyName) {
			var currStatusObj = that.state.gameStatus[keyName];

			// Invalidated already
			if (currStatusObj.value === false) {
				return;
			}

			if (currStatusObj.value === null || currStatusObj.value === currentPlayer) {
				newGameStatus[keyName].value = currentPlayer;
				newGameStatus[keyName].count++;

				if(currStatusObj.count === that.state.gameSize) {
					newGameStatusText = 'Player ' + currentPlayer + ' Won!';
				}
				return;
			}

			if(currStatusObj.value !== currentPlayer) {
				newGameStatus[keyName].value = false;
				return;
			}
		})
		newGameStatus.moveCount++;
		if(newGameStatus.moveCount === this.state.gameSize * this.state.gameSize && newGameStatusText.length === 0) {
			newGameStatusText = 'Draw!';
		}

		this.setState({
			gameStatus: newGameStatus,
			gameStatusText: newGameStatusText
		});
	},
	resetGame: function() {
		if(window.innerWidth < 767) {
			this.setState({
				board: util.createBoard(3),
				gameStatus: util.createGameStatus(3),
				gameStatusText: ''
			});
		} else {
			this.setState({
				gameSize: 0,
				gameStatusText: ''
			})
		}
	},
	playerMoved: function(row, column) {
		if(this.state.gameStatusText.length > 1) {
			return;
		}
		let rowNum = parseInt(row);
		let columnNum = parseInt(column);
		let newBoard = this.state.board;
		newBoard[rowNum][columnNum] = {value: this.state.currentPlayer, row: row, column: column}

		let currentPlayer = this.state.currentPlayer;
		let nextPlayer = this.state.currentPlayer==='X' ? 'O' : 'X';

		this.setState({
			board: newBoard,
			currentPlayer: nextPlayer
		})

		this.checkWinner(currentPlayer, row, column);
	},
  render: function() {
    return (
      <div className="view-container">
      	<div>
      		<div className="title-container">
      			<div>TIC TAC TOE</div>
      		</div>

      		{(this.state.gameSize === 0) ? (
	      		<div className="game-size-selection-container">
			    		<div className="game-size-selection-wrapper">
			      		<button className="game-size-selection-button" onClick={this.createGame}>
			      			3 x 3
		      			</button>
			    		</div>
			    		<div className="game-size-selection-wrapper">
			      		<button className="game-size-selection-button" onClick={this.createGame}>
			      			4 x 4
		      			</button>
			    		</div>		    		
			    		<div className="game-size-selection-wrapper">
			      		<button className="game-size-selection-button" onClick={this.createGame}>
			      			5 x 5
		      			</button>
			    		</div>
	      		</div>
    			) : (
	      		<div>
			      	<div className="board-container">
			      		<GridView board={this.state.board} playerMoved={this.playerMoved} gameSize={this.state.gameSize}/>
			    		</div>
			    		<div className="game-status-wrapper">
				      	{( this.state.gameStatusText.length > 0 ) ? (
				        	<h1>{this.state.gameStatusText}</h1>
				    		) : (
				    			<div className="game-status">
					      		{( this.state.gameStatus.moveCount === 0 ) ? (
					      			<h1></h1>
				      			) : (
					      			<h1>Current player: {this.state.currentPlayer}</h1>
				      			)}
			      			</div>
				    		)}
			    		</div>
			    		<div className="game-button-wrapper">
			      		<button className="game-reset-button" onClick={this.resetGame}>
			      			NEW GAME
		      			</button>
			    		</div>
		    		</div>
    			)}

      	</div>
      </div>
    )
  }
});

export default Board;
