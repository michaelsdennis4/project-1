console.log('script.js linked');

//GLOBAL VARIABLES ===================================================================

var grid; 

var first = 'X';
var turn;
var winner = '';
var playerX = '';
var playerO = '';
var intervalID;
var timer;
var computerPlay = false;
var computerMove = false;
var computerDelay = 2000;
var leaderBoard = [];

//query selectors

var messageX = document.querySelector('#message-X');
var messageO = document.querySelector('#message-O');
var inputX = document.querySelector('input#name-X');
var inputO = document.querySelector('input#name-O');
var computerChecked = document.querySelector('.computer');
var leaderList = document.querySelector('.leader-board');
var startButton = document.querySelector('.start-new');
var inProgress = document.querySelector('.progress');
var vGrid = document.querySelector('.grid');
var vsqTopLeft = document.querySelector('#top-left');
var vsqTopMiddle = document.querySelector('#top-middle');
var vsqTopRight = document.querySelector('#top-right');
var vsqMiddleLeft = document.querySelector('#middle-left');
var vsqCenter = document.querySelector('#center');
var vsqMiddleRight = document.querySelector('#middle-right');
var vsqBottomLeft = document.querySelector('#bottom-left');
var vsqBottomMiddle = document.querySelector('#bottom-middle');
var vsqBottomRight = document.querySelector('#bottom-right');


//OBJECTS =============================================================================

//Square OBJECT =======================================================================

var Square = function Square(id) {
	this._id = id;
	this._value = '';
	this.setBackgroundColor('white');
};

//methods

Square.prototype.setValue = function(val) {
	if (this._value.length > 0) { return false; } //square already set
	this._value = val;
	//set color depending on value
	switch (val) {
		case 'X': this.setColor('black'); break;
		case 'O': this.setColor('red'); break;
	}
	return true; //value set
};

Square.prototype.getValue = function() {
	return this._value;
};

Square.prototype.setBackgroundColor = function(color) {
	//set color of corresponding screen square
	document.querySelector('#'+this._id).style.background = color;
};

Square.prototype.setColor = function(color) {
	//set color of text
	document.querySelector('#'+this._id).style.color = color;
};


//Row OBJECT ==========================================================================

var Row = function Row(sq1, sq2, sq3) {
	this._squares = [sq1, sq2, sq3]; //array of pointers to square objects
};

//methods

Row.prototype.getValues = function() {
	return this._squares.map(function(sq) {
		return sq.getValue();
	});
};

Row.prototype.getStatus = function() {
	var x = 0;
	var o = 0;
	for (var i=0; i < this._squares.length; i++) {
		switch (this._squares[i]._value) {
			case 'X': x++; break;
			case 'O': o++; break;
		}
	}
	if ((x > 0) && (o > 0)) { return 'mix' ;} //mix, no winner possible on this row
	switch (x) {
		case 1: return 'x';
		case 2: return 'xx';
		case 3: return 'xxx'; //winner	
	}
	switch (o) {
		case 1: return 'o';
		case 2: return 'oo';
		case 3: return 'ooo'; //winner	
	}
	return 'empty'; //row empty
};

Row.prototype.setBackgroundColor = function(color) {
	this._squares.map( function(sq) {
		sq.setBackgroundColor(color);
	});
};

Row.prototype.setColor = function(color) {
	this._squares.map( function(sq) {
		sq.setColor(color);
	});
};

//Grid OBJECT =========================================================================

//each grid contains 9 square objects and 8 row objects

var Grid = function Grid() {
	this._rows = [];
	this._squares = [];

	//create squares
	//first row
	this._sqTopLeft = new Square('top-left');
	this._sqTopMiddle = new Square('top-middle');
	this._sqTopRight = new Square('top-right');
	//second row
	this._sqMiddleLeft = new Square('middle-left');
	this._sqCenter = new Square('center');
	this._sqMiddleRight = new Square('middle-right');
	//third row
	this._sqBottomLeft = new Square('bottom-left');
	this._sqBottomMiddle = new Square('bottom-middle');
	this._sqBottomRight = new Square('bottom-right');

	//push squares to array
	this._squares.push(this._sqTopLeft);
	this._squares.push(this._sqTopMiddle);
	this._squares.push(this._sqTopRight);
	this._squares.push(this._sqMiddleLeft);
	this._squares.push(this._sqCenter);
	this._squares.push(this._sqMiddleRight);
	this._squares.push(this._sqBottomLeft);
	this._squares.push(this._sqBottomMiddle);
	this._squares.push(this._sqBottomRight);

	//create rows and add square objects
	this._topAcross = new Row(this._sqTopLeft, this._sqTopMiddle, this._sqTopRight);
	this._middleAcross = new Row(this._sqMiddleLeft, this._sqCenter, this._sqMiddleRight);
	this._bottomAcross = new Row(this._sqBottomLeft, this._sqBottomMiddle, this._sqBottomRight);
	this._leftDown = new Row(this._sqTopLeft, this._sqMiddleLeft, this._sqBottomLeft);
	this._middleDown = new Row(this._sqTopMiddle, this._sqCenter, this._sqBottomMiddle);
	this._rightDown = new Row(this._sqTopRight, this._sqMiddleRight, this._sqBottomRight);
	this._diagonal1 = new Row(this._sqTopLeft, this._sqCenter, this._sqBottomRight);
	this._diagonal2 = new Row(this._sqBottomLeft, this._sqCenter, this._sqTopRight);

	//push rows to array
	this._rows.push(this._topAcross);
	this._rows.push(this._middleAcross);
	this._rows.push(this._bottomAcross);
	this._rows.push(this._leftDown);
	this._rows.push(this._middleDown);
	this._rows.push(this._rightDown);
	this._rows.push(this._diagonal1);
	this._rows.push(this._diagonal2);
};

Grid.prototype.setValue = function(pos, value) {
	switch (pos) {
		case 'top-left': return this._sqTopLeft.setValue(value);
		case 'top-middle': return this._sqTopMiddle.setValue(value);
		case 'top-right': return this._sqTopRight.setValue(value);
		case 'middle-left': return this._sqMiddleLeft.setValue(value);
		case 'center': return this._sqCenter.setValue(value);
		case 'middle-right': return this._sqMiddleRight.setValue(value);
		case 'bottom-left': return this._sqBottomLeft.setValue(value);
		case 'bottom-middle': return this._sqBottomMiddle.setValue(value);
		case 'bottom-right': return this._sqBottomRight.setValue(value);
	}
};

//methods

Grid.prototype.draw = function() {
	vsqTopLeft.textContent = this._sqTopLeft.getValue();
	vsqTopMiddle.textContent = this._sqTopMiddle.getValue();
	vsqTopRight.textContent = this._sqTopRight.getValue();
	vsqMiddleLeft.textContent = this._sqMiddleLeft.getValue();
	vsqCenter.textContent = this._sqCenter.getValue();
	vsqMiddleRight.textContent = this._sqMiddleRight.getValue();
	vsqBottomLeft.textContent = this._sqBottomLeft.getValue();
	vsqBottomMiddle.textContent = this._sqBottomMiddle.getValue();
	vsqBottomRight.textContent = this._sqBottomRight.getValue();
};

Grid.prototype.getWinner = function() {
	//check for winner by row
	for (var i=0; i < this._rows.length; i++) {
		switch (this._rows[i].getStatus()) {
			case 'xxx': //x is winner
				this._rows[i].setColor('white');
				this._rows[i].setBackgroundColor('green');
				return 'X'; 

			case 'ooo': 
				this._rows[i].setColor('white');
				this._rows[i].setBackgroundColor('green');
				return 'O'; //o is winner
		}
	}
	//if no winner and all squares are filled, then draw
	var blank = 0;
	for (i=0; i < this._squares.length; i++) {
		if (this._squares[i].getValue() === '') { blank++; }
	}
	if (blank === 0) { 
		this._squares.map(function(sq) {
			sq.setColor('white');
			sq.setBackgroundColor('red');
		});
		return 'draw';
	}
	return false; //no winner yet
};

Grid.prototype.setBackgroundColor = function(color) {
	this._squares.map( function(sq) {
		sq.setBackgroundColor(color);
	});
};

Grid.prototype.setColor = function(color) {
	this._squares.map( function(sq) {
		sq.setColor(color);
	});
};


//FUNCTIONS ==========================================================================

var setHeights = function() {
	//set height of grid to equal width
	var width = vGrid.width;
	vGrid.height = width;
};

var disableControls = function() {
	inputX.readOnly = true;
	inputO.readOnly = true;
	computerChecked.disabled = true;
	startButton.disabled = true;
	startButton.style.background = "gray" ;
	inProgress.style.color = "green";
};

var enableControls = function() {
	inputX.readOnly = false;
	inputO.readOnly = false;
	computerChecked.disabled = false;
	startButton.disabled = false;
	startButton.style.background = "green";
	inProgress.style.color = "white";
};

var newGame = function() {
	//get player names
	playerX = inputX.value.trim();
	playerO = inputO.value.trim();
	disableControls();
	turn = first;
	if (first === 'X') { first = 'O'; } else { first = 'X'; } //alternate first turn between X and O (X always starts first game)
	winner = '';
	messageX.textContent = '';
	messageO.textContent = '';
	grid = new Grid();
	grid.draw();
	takeTurn();
};

var takeTurn = function() {
	messageO.textContent = '';
	messageX.textContent = '';
	computerMove = false;
	// //if computer opponent is active
	if ((computerPlay) && (turn === 'O')) {
		computerMove = true;
		messageO.textContent = 'HAL is playing';
		getComputerMove();
		window.setTimeout(updateGrid, computerDelay); //set small delay
	} else {
		timer = 10;
		intervalID = window.setInterval(decreaseTimer, 1000);
	}
};

var decreaseTimer = function () {
	if (turn === 'X') {
		if (playerX !== '') {
			messageX.textContent = playerX+"'s Turn: "+timer+" seconds left...";
		} else {
			messageX.textContent = "Player X's Turn: "+timer+" seconds left...";
		}		
	} else if (turn === 'O') {
		if (playerO !== '') {
			messageO.textContent = playerO+"'s Turn: "+timer+" seconds left...";
		} else {
			messageO.textContent = "Player O's Turn: "+timer+" seconds left...";
		}
	}
	timer--;
	if (timer < 0) { 
		//game over, stop timer
		window.clearInterval(intervalID);
		if (turn === 'X') {
			winner = 'O';
			messageX.textContent = "You are out of time!";
			if (playerO !== '') {
			  messageO.textContent = playerO+ " wins!";
			  updateLeaderBoard(playerO);
			} else {
				messageO.textContent = "Player "+winner+ " wins!";
			}
		} else if (turn === 'O') {
			winner = 'X';
			messageO.textContent = "You are out of time!";
			if (playerX !== '') {
			  messageX.textContent = playerX+ " wins!";
			  updateLeaderBoard(playerX);
			} else {
				messageX.textContent = "Player "+winner+ " wins!";
			}
		}
		enableControls();
	}
};

var processTurn = function(e) {
	if (!grid) { return false; } //no active game
	if (computerMove) { return false; } //computer's turn in progress
	if (winner.length > 0) { return false; } //game already won
	var pos = e.target.id; //id for square clicked on
	if (grid.setValue(pos, turn)) {
		//stop timer
		window.clearInterval(intervalID);
		messageX.textContent = '';
		messageO.textContent = '';
		updateGrid();
	}	
};

var updateGrid = function() {
	grid.draw();
	winner = grid.getWinner();
	if (winner === 'X') { 
		if (playerX !== '') { 
			messageX.textContent = playerX+ " wins!";
			updateLeaderBoard(playerX);
		} else {
			messageX.textContent = "Player "+winner+ " wins!";
		}
		enableControls();
		return;
	}
	if (winner ===  'O') {
		if (playerO !== '') { 
			messageO.textContent = playerO+ " wins!";
			updateLeaderBoard(playerO);
		} else {
			messageO.textContent = "Player "+winner+ " wins!";
		}
		enableControls();
		return;
	}
	if (winner ===  'draw') {
		messageX.textContent = "Draw!";
		messageO.textContent = "Draw!";
		enableControls();
		return;
	}
	//switch player
	if (turn === 'X') { turn = 'O'; } else { turn = 'X'; }
	takeTurn();
};

var getComputerMove = function() {
	//get row statuses (assume computer is player 'O')
	//if 'oo' then fill and win 
	for (var i=0; i < grid._rows.length; i++) {
		if (grid._rows[i].getStatus() === 'oo') {
			for (var j=0; j < grid._rows[i]._squares.length; j++) {
				if (grid._rows[i]._squares[j].getValue() === '') {
					grid._rows[i]._squares[j].setValue('O');
					return true;
				}
			}
		}
	}
	//if 'xx' then fill and block
	for (var i=0; i < grid._rows.length; i++) {
		if (grid._rows[i].getStatus() === 'xx') {
			for (var j=0; j < grid._rows[i]._squares.length; j++) {
				if (grid._rows[i]._squares[j].getValue() === '') {
					grid._rows[i]._squares[j].setValue('O');		
					return true;
				}
			}
		}
	}
	//corners
	var tl = grid._sqTopLeft.getValue();
	var tr = grid._sqTopRight.getValue();
	var br = grid._sqBottomRight.getValue();
	var bl = grid._sqBottomLeft.getValue();
	//if all corners open, then pick random
	if ((tl === '') && (tr === '') && (br === '') && (bl === '')) {
		var ran = (Math.random() * 4);
		ran = Math.floor(ran);
		switch (ran) {
			case 1: grid._sqTopLeft.setValue('O'); return true;
			case 2: grid._sqTopRight.setValue('O'); return true;
			case 3: grid._sqBottomRight.setValue('O'); return true;
			case 4: grid._sqBottomLeft.setValue('O'); return true;
		}
	}
	//if three corners filled then fill center
	var filled = 0;
	if (tl !== '') { filled++; }
	if (tr !== '') { filled++; }
	if (bl !== '') { filled++; }
	if (br !== '') { filled++; }
	if (filled === 3) {
		if (grid._sqCenter.setValue('O')) { return true; }
	}
	//search for 'X' in corners, if found then fill next adjacent inside edge
	//if none, then fill center
	if (tl === 'X') { 
		if (grid._sqCenter.setValue('O')) { return true; }
		if (grid._sqTopMiddle.setValue('O')) { return true; }
		if (grid._sqMiddleRight.setValue('O')) { return true; }
		if (grid._sqBottomMiddle.setValue('O')) { return true; }
		if (grid._sqMiddleRight.setValue('O')) { return true; }
	}
	if (tr === 'X') {
		if (grid._sqCenter.setValue('O')) { return true; }
		if (grid._sqMiddleRight.setValue('O')) { return true; }
		if (grid._sqBottomMiddle.setValue('O')) { return true; }
		if (grid._sqMiddleRight.setValue('O')) { return true; }
		if (grid._sqTopMiddle.setValue('O')) { return true; }
	}
	if (br === 'X') { 
		if (grid._sqCenter.setValue('O')) { return true; }
		if (grid._sqBottomMiddle.setValue('O')) { return true; }
		if (grid._sqMiddleRight.setValue('O')) { return true; }
		if (grid._sqTopMiddle.setValue('O')) { return true; }
		if (grid._sqMiddleRight.setValue('O')) { return true; }
	}
	if (bl === 'X') { 
		if (grid._sqCenter.setValue('O')) { return true; }
		if (grid._sqMiddleRight.setValue('O')) { return true; }
		if (grid._sqTopMiddle.setValue('O')) { return true; }
		if (grid._sqMiddleRight.setValue('O')) { return true; }
		if (grid._sqBottomMiddle.setValue('O')) { return true; }
	}
	//search for 'O', if found then try for diagonal
	if (tl === 'O') { 
		if (grid._sqBottomRight.setValue('O')) { return true; }
	}
	if (tr === 'O') { 
		if (grid._sqBottomLeft.setValue('O')) { return true; }
	}
	if (br === 'O') { 
		if (grid._sqTopLeft.setValue('O')) { return true; }
	}
	if (bl === 'O') { 
		if (grid._sqTopRight.setValue('O')) { return true; }
	}
	//then try for next available open clockwise
	if (tl === 'O') { 
		if (grid._sqTopRight.setValue('O')) { return true; }
	}
	if (tr === 'O') { 
		if (grid._sqBottomRight.setValue('O')) { return true; }
	}
	if (br === 'O') { 
		if (grid._sqBottomLeft.setValue('O')) { return true; }
	}
	if (bl === 'O') { 
		if (grid._sqTopLeft.setValue('O')) { return true; }
	}
	//fill any open corner
	if (tl === '') { 
		if (grid._sqTopLeft.setValue('O')) { return true; }
	}
	if (tr === '') { 
		if (grid._sqTopRight.setValue('O')) { return true; }
	}
	if (br === '') { 
		if (grid._sqBottomRight.setValue('O')) { return true; }
	}
	if (bl === '') { 
		if (grid._sqBottomLeft.setValue('O')) { return true; }
	}
	//if no corners open then fill center
	if (grid._sqCenter.setValue('O')) { return true; }
	//if no center then fill edge squares
	if (grid._sqMiddleLeft.setValue('O')) { return true; }
	if (grid._sqBottomMiddle.setValue('O')) { return true; }
	if (grid._sqTopMiddle.setValue('O')) { return true; }
	if (grid._sqMiddleRight.setValue('O')) { return true; }
};

var updateLeaderBoard = function(winner) {
	var winnerName = winner.toLowerCase();
	winnerName = winnerName.trim();
	var newWinner;
	//get winner's name (if no name, then quit)
	if (winner.length === 0) { return false; }
	//iterate through leader board array
	//if name found, then increase wins
	for (i=0; i < leaderBoard.length; i++) {
		if (leaderBoard[i].name === winnerName) {
			newWinner = leaderBoard[i];
			newWinner.wins++;
			//adjust ranks if necessary
			//find next rank up
			for (j=0; j < leaderBoard.length; j++) {
				if (leaderBoard[j].rank === (newWinner.rank-1)) {
					if (newWinner.wins > leaderBoard[j].wins) {
						newWinner.rank = leaderBoard[j].rank;
						leaderBoard[j].rank = (newWinner.rank+1);
					}
				}
			}
			break;
		}	
	}
	//if not, then create leader object (winner name, wins)
	//add as last place rank
	if (newWinner === undefined) {
		var rank = leaderBoard.length + 1;
		var newLeader = {name: winnerName, wins: 1, rank: rank};
		leaderBoard.push(newLeader);
		//add new list object
		var newListItem = document.createElement('li');
		newListItem.setAttribute('id', 'leader');
		leaderList.appendChild(newListItem);
	}
	//update html list objects
	var leaders = document.querySelectorAll('#leader');
	for (i=0; i < leaders.length; i++) {
		for (j=0; j < leaderBoard.length; j++) {
			if (leaderBoard[j].rank === (i+1)) {
				leaders[i].textContent = "Player: "+leaderBoard[j].name.toUpperCase()+" --- Games Won: "+leaderBoard[j].wins;
			}
		}
	}
};

var setComputerPlay = function() {
	if (computerChecked.checked === true) {
		computerPlay = true;
		inputO.value = 'HAL';
		inputO.readOnly = true;
	} else {
		computerPlay = false;
		inputO.value = '';
		inputO.readOnly = false;
	}
};


//EVENT LISTENERS===================================================================

window.addEventListener('load', setHeights);

vGrid.addEventListener('click', processTurn);

startButton.addEventListener('click', newGame);

computerChecked.addEventListener('click', setComputerPlay);


//INITIALIZATION ===================================================================

computerChecked.checked = false;
messageX.textContent = '';
messageO.textContent = '';
inputX.value = '';
inputO.value = '';









































