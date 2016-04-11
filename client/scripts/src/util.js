const util = {};

util.createBoard = function(n) {
	let board = [];
	for (let i = 0 ;i < n; i++) {
		let row = [];
		for (let j = 0; j < n; j++) {
			let grid = {value: null, row:i.toString(), column:j.toString()}
			row.push(grid);
		}	
		board.push(row);
	}
	return board;
}

util.createGameStatus = function(n) {
	let gameStatus = {};
	let initialStatus = {value: null, count: 0};
	for (var i = 0 ; i < n; i++) {
		gameStatus['r'+i.toString()] = {value: null, count: 0};
		gameStatus['c'+i.toString()] = {value: null, count: 0};	
		gameStatus['d1'] = {value: null, count: 0}; // top left to bottom right
		gameStatus['d2'] = {value: null, count: 0}; // top right to bottom left
	}
	gameStatus['moveCount'] = 0;
	return gameStatus;
}

export default util;
