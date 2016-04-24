import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import util from './util';

injectTapEventPlugin();

const Button = (props) =>
	<div className={props.wrapperClassName}>
		<button className={props.buttonClassName} onTouchTap={props.buttonAction} onClick={props.buttonAction}>
			{props.buttonText}
		</button>
	</div>;

const GameModeButtons = React.createClass({
	createGameModeButtons: function(button) {
		return (
			<Button 
				buttonText={button} 
				key={button} 
				buttonAction={this.props.selectGameMode} 
				buttonClassName="game-size-selection-button" 
				wrapperClassName="game-size-selection-wrapper" />
		)
	},
	render: function() {
		return (
			<div className="game-size-selection-container">
				{this.props.gameModeSelectionButtons.map(this.createGameModeButtons)}
			</div>
		)
	}
});

const GameCreationButtons = React.createClass({
	createGameButtons: function(button) {
		return (
			<Button 
				buttonText={button} 
				key={button[0]} 
				buttonAction={this.props.createGame} 
				buttonClassName="game-size-selection-button" 
				wrapperClassName="game-size-selection-wrapper" />
		)
	},
	render: function() {
		return (
			<div className="game-size-selection-container">
				{this.props.gameSizeSelectionButtons.map(this.createGameButtons)}
			</div>
		)
	}
});

const Cell = React.createClass({
	playerMoved: function() {
		this.props.playerMoved(this.props.gridStatus.row, this.props.gridStatus.column);
	},
	render: function() {
		let cellDisplayStyle = {};

		if(window.innerWidth < 415) {
			console.log('hi')
			let boardSizeStyle = {
				iphone5: {
					3: {
						'fontSize': '70px',
						'width': '90px',
						"border": "3px solid #fff"
					},
					4: {
						'fontSize': '48px',
						'width': '55px',
						"border": "3px solid #fff"
					},
					5: {
						'fontSize': '48px',
						'width': '55px',
						"border": "3px solid #fff"
					}
				},
				iphone6: {
					3: {
						'fontSize': '70px',
						'width': '90px',
						"border": "3px solid #fff"
					},
					4: {
						'fontSize': '65px',
						'width': '80px',
						"border": "3px solid #fff"
					},
					5: {
						'fontSize': '56px',
						'width': '65px',
						"border": "3px solid #fff"
					}
				},
				iphone6plus: {
					3: {
						'fontSize': '85px',
						'width': '110px',
						"border": "5px solid #fff"
					},
					4: {
						'fontSize': '75px',
						'width': '90px',
						"border": "4px solid #fff"
					},
					5: {
						'fontSize': '65px',
						'width': '75px',
						"border": "3px solid #fff"
					}
				}
			};

			let keyName;

			if (window.innerWidth < 321) {
				keyName = 'iphone5';
			} else if (window.innerWidth < 376) {
				keyName = 'iphone6';
			} else if (window.innerWidth < 415) {
				keyName = 'iphone6plus';
			} 
			cellDisplayStyle.fontSize = boardSizeStyle[keyName][this.props.gameSize].fontSize;
			cellDisplayStyle.width = boardSizeStyle[keyName][this.props.gameSize].width;
			cellDisplayStyle.height = boardSizeStyle[keyName][this.props.gameSize].width;
			cellDisplayStyle.border = boardSizeStyle[keyName][this.props.gameSize].border;
			console.log('cellDisplayStyle', cellDisplayStyle)
		}

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
				<div className="board-row-cell" onTouchTap={this.playerMoved} onClick={this.playerMoved} style={cellDisplayStyle}></div>
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
		let key = gridStatus.row + gridStatus.column;
		return (
			<Cell gridStatus={gridStatus} key={key} playerMoved={this.props.playerMoved} gameSize={this.props.gameSize}/>
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
		let key = gridRow[0].row;
		return (
			<GridRow row={gridRow} key={key} playerMoved={this.props.playerMoved} gameSize={this.props.gameSize}/>
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
		if (window.innerWidth < 1.111) {
			return {
				gameSize: 3,
				board: util.createBoard(3),
				gameStatus: util.createGameStatus(3),
				currentPlayer: 'X',
				gameStatusText: '',
				gameMode: null,
				difficulty: 1,
				disablePlayerInteraction: false
			}
		} else {
			return {
				gameSize: 0,
				board: [],
				gameStatus: [],
				currentPlayer: 'X',
				gameStatusText: '',
				gameMode: null,
				difficulty: 1,
				disablePlayerInteraction: false
			}
		}
	},
	difficultyToggle: function() {
		let difficulty = this.state.difficulty === 1 ? 0.5 : 1;
		this.setState({
			difficulty: difficulty
		})

		this.createNewGame();
	},
	createGame: function(e) {
		let gameSize = parseInt(e.target.innerHTML[0]);
		setTimeout(function() {
			this.setState({
				gameSize: gameSize,
				board: util.createBoard(gameSize),
				gameStatus: util.createGameStatus(gameSize)
			});
		}.bind(this), 200);
	},
	selectGameMode: function(e) {
		let gameMode = parseInt(e.target.innerHTML[0]);
		this.setState({
			gameMode: gameMode
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
		let that = this;
		keyNames.forEach(function(keyName) {
			let currStatusObj = that.state.gameStatus[keyName];

			// Invalidated already
			if (currStatusObj.value === false) {
				return;
			}

			if (currStatusObj.value === null || currStatusObj.value === currentPlayer) {
				newGameStatus[keyName].value = currentPlayer;
				newGameStatus[keyName].count++;
				if(currStatusObj.count === that.state.gameSize) {
					if(that.state.gameMode === 2) {
						newGameStatusText = 'Player ' + currentPlayer + ' wins!';
					} else {
						newGameStatusText = currentPlayer === 'X' ? 'You Won :)' : 'You Lost :('
					}
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
		console.log('this.stsate.gameStatus', this.state.gameStatus)
		console.log('this.state.board', this.state.board);
	},
	resetGame: function() {
		// refactor and combine with createNewGame
		if(window.innerWidth < 1.111) {
			this.setState({
				board: util.createBoard(3),
				gameStatus: util.createGameStatus(3),
				gameStatusText: '',
				gameMode: null,
				currentPlayer: 'X'
			});
		} else {
			this.setState({
				gameSize: 0,
				board: [],
				gameStatus: [],
				currentPlayer: 'X',
				gameStatusText: '',
				gameMode: null,
				difficulty: 1,
				disablePlayerInteraction: false
			})
		}
	},
	createNewGame: function() {
		if(window.innerWidth < 1.111) {
			this.setState({
				board: util.createBoard(3),
				gameStatus: util.createGameStatus(3),
				gameStatusText: '',
				currentPlayer: 'X'
			});
		} else {
			this.setState({
				board: util.createBoard(this.state.gameSize),
				gameStatus: util.createGameStatus(this.state.gameSize),
				gameStatusText: '',
				currentPlayer: 'X'
			});
		}
	},
	playerMoved: function(row, column) {
		console.log('player moved');
		console.log('this.gameMode', this.gameMode);
		// Player vs Player
		// if(this.state.gameMode === 2) {
		// 	if(this.state.gameStatusText.length > 1) {
		// 		return;
		// 	}
		// 	let rowNum = parseInt(row);
		// 	let columnNum = parseInt(column);
		// 	let newBoard = this.state.board;
		// 	newBoard[rowNum][columnNum] = {value: this.state.currentPlayer, row: row, column: column}

		// 	let currentPlayer = this.state.currentPlayer;
		// 	let nextPlayer = this.state.currentPlayer === 'X' ? 'O' : 'X';

		// 	this.setState({
		// 		board: newBoard,
		// 		currentPlayer: nextPlayer
		// 	});

		// 	this.checkWinner(currentPlayer, row, column);
		// } 

		// if(this.state.gameMode === 1) {
		// Player vs Computer

		// check if game still going
		if(this.state.gameStatusText.length > 1 || this.state.disablePlayerInteraction) {
			return;
		}

		// populate board with where the player has moved
		let rowNum = parseInt(row);
		let columnNum = parseInt(column);
		let newBoard = this.state.board;
		newBoard[rowNum][columnNum] = {value: this.state.currentPlayer, row: row, column: column}

		let currentPlayer = this.state.currentPlayer;
		let nextPlayer = this.state.currentPlayer === 'X' ? 'O' : 'X';
		console.log('nextPlayer', nextPlayer);
		// update the board and player
		this.setState({
			board: newBoard,
			currentPlayer: nextPlayer
		});

		// check who won
		this.checkWinner(currentPlayer, row, column);

			// Make computer's move
			// console.log('this.state.currentPlayer', this.state.currentPlayer);
			// this.computerMove();
		// }
	},
	computerMove: function() {
		// find the best move.
		console.log('computerMove Called');

		let bestMove = this.findBestMove(); // [x, y]
		console.log('bestMove inside computerMove()', bestMove);
		let newBoard = this.state.board;
		let rowNum = bestMove[0];
		let colNum = bestMove[1];
		let row = bestMove[0].toString();
		let column = bestMove[1].toString();
		newBoard[rowNum][colNum] = {value: this.state.currentPlayer, row: row, column: column};

		let currentPlayer = this.state.currentPlayer;
		let nextPlayer = this.state.currentPlayer === 'X' ? 'O' : 'X';

		// update the board and player
		this.setState({
			board: newBoard,
			currentPlayer: nextPlayer
		});

		// check who won
		this.checkWinner(currentPlayer, row, column);

		this.setState({
			disablePlayerInteraction: false
		});
	},
	componentDidUpdate: function() {
		console.log('componentDidUpdate Called')
		console.log('this.state.currentPlayer', this.state.currentPlayer)
		console.log('this.state.gameStatusText.length', this.state.gameStatusText.length)
		console.log('this.state.gameMode', this.state.gameMode);
		if (this.state.currentPlayer === 'O' && 
				this.state.gameStatusText.length === 0 && 
				this.state.gameMode === 1 ) {

			this.setState({
				disablePlayerInteraction: true
			});

			setTimeout(function() {
				this.computerMove();
			}.bind(this), 500)
		}
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return nextState.disablePlayerInteraction === this.state.disablePlayerInteraction;
	},
	findBestMove: function() {
		// if best move doesn't exist, make a random move of whatever is available.
		// if(this.state.currentPlayer === 'O') {
		// 	return;
		// }
		let computerPermCountStore = -1,
				playerPermCountStore = -1,
				bestMove = [0, 0],
				computerMove = 'O', // computer is always O for now
				moveToWinFound = false,
				moveToPreventLossFound = false,
				moveToPreventLoss = [0, 0],
				counterMoveFound = false,
				counterMove = [0, 0],
				blockMove = [0, 0],
				firstMoveTrickFound = false,
				possibleMoves = [];

		// Check for horizontal move. 
		let cellsToCheckFirstMove = [
			{
				move: [0,1],
				counterMove: [0,2]
			},
			{
				move: [1,0],
				counterMove: [0,0]
			},
			{
				move: [1,2],
				counterMove: [2,2]
			},
			{
				move: [2,1],
				counterMove: [2,0]
			}
		]
		if( this.state.gameSize === 3 && 
				this.state.gameStatus.moveCount === 1 
			) {
			console.log('hi')
			// var that = this;
			cellsToCheckFirstMove.forEach(function(coordinates) {
				let row = coordinates.move[0];
				let col = coordinates.move[1];
				if(this.state.board[row][col].value === 'X') {
					firstMoveTrickFound = true;
					bestMove = coordinates.counterMove;
				}
			}.bind(this));
		}
		if(firstMoveTrickFound) {
			return bestMove;
		}

		// always put something in the middle
		if(this.state.gameSize === 3 && this.state.board[1][1].value === null) {
			return [1,1];
		}

		for (let rowNum = 0 ; rowNum < this.state.gameSize; rowNum++) {
			for (let colNum = 0 ; colNum < this.state.gameSize; colNum++) {

				// if there is a move on the current grid, skip the grid
				if(this.state.board[rowNum][colNum].value !== null) {
					continue;
				}

				possibleMoves.push([rowNum, colNum]);

				let computerTempCountStore = 0,
						playerTempCountStore = 0,
						row = rowNum.toString(),
						column = colNum.toString();
				let rowKey = 'r' + row,
						colKey = 'c' + column;
				let keyNames = [rowKey, colKey];

				if(row === column) {
					keyNames.push('d1');
				}

				if(parseInt(row) + parseInt(column) === this.state.gameSize - 1) {
					keyNames.push('d2');
				}

				keyNames.forEach(function(keyName) {
					let currStatusObj = this.state.gameStatus[keyName];
					console.log('currStatusObj.value', currStatusObj.value);
					console.log('currStatusObj.value === null', currStatusObj.value === null)
					console.log('typeof currStatusObj.value', typeof currStatusObj.value);

					// I need to block the other player if they're about to win.

				  // 1. Need to check if I can win (if moveToWinFound = true)

				  // 2. Need to block other player if they're about to win (set a coordinate for blocking and a boolean value to block them)
				  // COUNTERMOVES!
				  	// if .value === opponetValue and .count === this.state.gameSize - 1 --> DEFINITELY place something here (priority = 1)
				  	// if opponentCountStore === this.state.gameSize --> place something here (priority = 2)

				  // 3. Need to do the optimized move. (taken care of)
					if(currStatusObj.value === computerMove) {
						// Optimizing my own move

						if(currStatusObj.count === this.state.gameSize-1) {
							// need to check if I can win
							console.log('bestMove to win', [rowNum, colNum]);
							bestMove[0] = rowNum;
							bestMove[1] = colNum;
							moveToWinFound = true;
							return;
						}
						computerTempCountStore += currStatusObj.count;
					} else if (currStatusObj.value === null ) {
						// computerTempCountStore += 1;
						console.log('increased computerTempCountStore', computerTempCountStore);

					} else {
						// analyzing opponent moves for counter move

						if(currStatusObj.count === this.state.gameSize-1) {
							// 2a 
							moveToPreventLossFound = true;
							moveToPreventLoss[0] = rowNum;
							moveToPreventLoss[1] = colNum;
						} else if (currStatusObj.count === this.state.gameSize) {
							// 2b
							counterMoveFound = true;
							counterMove[0] = rowNum;
							counterMove[1] = colNum;
						}
						
						playerTempCountStore += currStatusObj.count;

					}
				}.bind(this));

				if (moveToWinFound && Math.random() < this.state.difficulty) {
					return bestMove;
				} 

				if(computerTempCountStore > computerPermCountStore) {
					bestMove[0] = rowNum;
					bestMove[1] = colNum;
					computerPermCountStore = computerTempCountStore;
				}

				if(playerTempCountStore > playerPermCountStore) {
					blockMove[0] = rowNum;
					blockMove[1] = colNum;
					playerPermCountStore = playerTempCountStore;
				}
				console.log('coord', rowNum, colNum);
				console.log('computerTempCountStore', computerTempCountStore);
				console.log('computerPermCountStore', computerPermCountStore);
			}
		}
		console.log('moveToPreventLossFound', moveToPreventLossFound)
		console.log('counterMoveFound', counterMoveFound);
		console.log('computerPermCountStore', computerPermCountStore);

		let randomNum = Math.random();
		console.log('randomNum', randomNum)
		console.log('possibleMoves', possibleMoves);
		if(randomNum > this.state.difficulty) {
			let index = Math.floor(possibleMoves.length * randomNum);
			return possibleMoves[index];
		} 

		if (moveToPreventLossFound) {
			console.log('Place move to prevent loss')
			bestMove = moveToPreventLoss;
		} else if (counterMoveFound) {
			console.log('Place counter move')
			bestMove = counterMove;
		} else if (computerPermCountStore > 0) {
			// an optimized move has been found. return the optimised move
			console.log('Place optimized move');
			console.log('bestMove', bestMove);
			return bestMove;
		} else {
			// return a move that blocks the opponent.
			console.log('Place block move')
			bestMove = blockMove;
		}

		console.log('bestMove', bestMove);
		return bestMove;
	},
	render: function() {
		const gameSizeSelectionButtons = ['3 x 3', '4 x 4', '5 x 5'];
		const gameModeSelectionButtons = ['1 Player', '2 Player'];

		const titleContainerStyle = {
			display: 0
		}

		if(this.state.gameSize === 0 || this.state.gameMode === null) {
			titleContainerStyle.display = 1;
		}

		return (
			<div className="view-container">
				<div>
					<div className="title-container">
						{( this.state.gameStatusText.length > 0 ) ? (
							<div>{this.state.gameStatusText}</div>
						) : (
							<div>
								{(  this.state.gameStatus.moveCount === 0 || 
										this.state.gameMode === null || this.state.gameSize === 0) ? (
									<div>TIC TAC TOE</div>
								) : (
									<div>
										{(this.state.gameMode === 2) ? (
											<div>Player {this.state.currentPlayer} Turn!</div>
										) : (
											<div>
												{( this.state.currentPlayer === 'X') ? (
													<div>Your turn!</div>
												) : (
													<div>My turn!</div>
												)}
											</div>
										)}
									</div>
								)}
							</div>
						)}

					</div>

					{(this.state.gameMode) ? (
						<div>

							{(this.state.gameSize === 0) ? (
								<GameCreationButtons 
									gameSizeSelectionButtons={gameSizeSelectionButtons} 
									createGame={this.createGame}/>
							) : (
								<div>
									<div className="board-container">
										<GridView 
											board={this.state.board} 
											playerMoved={this.playerMoved} 
											gameSize={this.state.gameSize}/>
									</div>
									<div className="game-status-wrapper">
									</div>

									<div className="game-button-wrapper">
											<div className="game-reset-button" onTouchTap={this.resetGame}>
											 RESET
										</div>
										<div className="game-new-button" onTouchTap={this.createNewGame}>
											NEW
										</div>
									</div>
									<div className="game-difficulty-button-wrapper">
										{(this.state.gameMode === 1) ? (
												<div className="game-difficulty-button" onTouchTap={this.difficultyToggle}>
												Difficulty:
												{(this.state.difficulty === 1) ? (
												 <span> Hard</span>
												) : (
												 <span> Easy</span>
												)}
											</div>
										) : (
											<span></span>
										)}
									</div>
								</div>
							)}

						</div>
					) : (
						<GameModeButtons 
							selectGameMode={this.selectGameMode} 
							gameModeSelectionButtons={gameModeSelectionButtons}/>
					)}
				</div>
			</div>
		)
	}
});

export default Board;
