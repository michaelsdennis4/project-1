console.log('script.js linked');

//GLOBAL VARIABLES ===================================================================

var grid; 

var first = '';
var turn = 'X';
var winner = '';
var playerX = '';
var playerO = '';
var intervalID;
var timer;
var messageX = document.querySelector('#message-X');
var messageO = document.querySelector('#message-O');


//OBJECTS =============================================================================

//Square OBJECT =======================================================================

var Square = function Square(id) {
	this._id = id;
	this._value = '';
	this.setBackgroundColor('white');
};

//methods
Square.prototype.setValue = function(val) {
	if (this._value.length > 0) { return false } //square already set
	this._value = val;
	//set color depending on value
	switch (val) {
		case 'X': this.setColor('black'); break;
		case 'O': this.setColor('red'); break;
	};
	return true; 
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
}


//Row OBJECT ==========================================================================

var Row = function Row(sq1, sq2, sq3) {
	this._squares = [sq1, sq2, sq3]; //array of pointers to square objects
};

Row.prototype.getValues = function() {
	return this._squares.map = function(sq) {
		return sq.getValue();
	}
};

Row.prototype.getStatus = function() {
	var x = 0;
	var o = 0;
	for (var i=0; i < this._squares.length; i++) {
		switch (this._squares[i]._value) {
			case 'X': x++; break;
			case 'O': o++; break;
		}
	};
	if ((x > 0) && (o > 0)) { return 'mix' }; //mix, no winner possible on this row
	switch (x) {
		case 1: return 'x';
		case 2: return 'xx';
		case 3: return 'xxx'; //winner	
	};
	switch (o) {
		case 1: return 'o';
		case 2: return 'oo';
		case 3: return 'ooo'; //winner	
	};
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
	};
};

Grid.prototype.draw = function() {
	document.querySelector('#top-left').textContent = this._sqTopLeft.getValue();
	document.querySelector('#top-middle').textContent = this._sqTopMiddle.getValue();
	document.querySelector('#top-right').textContent = this._sqTopRight.getValue();
	document.querySelector('#middle-left').textContent = this._sqMiddleLeft.getValue();
	document.querySelector('#center').textContent = this._sqCenter.getValue();
	document.querySelector('#middle-right').textContent = this._sqMiddleRight.getValue();
	document.querySelector('#bottom-left').textContent = this._sqBottomLeft.getValue();
	document.querySelector('#bottom-middle').textContent = this._sqBottomMiddle.getValue();
	document.querySelector('#bottom-right').textContent = this._sqBottomRight.getValue();
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
		};
	};
	//if no winner and all squares are filled, then draw
	var blank = 0;
	for (var i=0; i < this._squares.length; i++) {
		if (this._squares[i].getValue() === '') { blank++ }
	};
	if (blank === 0) { 
		this._squares.map(function(sq) {
			sq.setColor('white');
			sq.setBackgroundColor('red');
		});
		return 'draw';
	};
	return false; //no winner yet
}



//FUNCTIONS ==========================================================================

var setHeights = function() {
	//set height of grid to equal width
	var grid = document.querySelector('.grid');
	var width = grid.width;
	grid.height = width;
};

var takeTurn = function() {
	timer = 10;
	intervalID = window.setInterval(decreaseTimer, 1000);
	//waiting for player to take turn

	//switch player
	if (turn === 'X') { turn = 'O' } else { turn = 'X' };
};

var newGame = function() {
	//get player names
	playerX = document.querySelector('input#name-X').value;
	console.log(playerX);
	playerO = document.querySelector('input#name-O').value;
	console.log(playerO);
	turn = first;
	if (first === 'X') { first = 'O' } else { first = 'X' }; //alternate first turn between X and O (X always starts first game)
	winner = '';
	messageX.textContent = '';
	messageO.textContent = '';
	grid = new Grid();
	grid.draw();
	takeTurn();
};

var decreaseTimer = function () {
	if (turn === 'X') {
		messageX.textContent = "X's Turn: "+timer+" seconds left...";
	} else if (turn === 'O') {
		messageO.textContent = "O's Turn: "+timer+" seconds left...";
	};
	timer--;
	if (timer < 0) { 
		//game over, stop timer
		window.clearInterval(intervalID);
		if (turn === 'X') {
			winner = 'O';
			messageX.textContent = "You are out of time!";
			if (playerO != '') {
			  messageO.textContent = playerO+ " has won the game!";
			} else {
				messageO.textContent = "Player "+winner+ " has won the game!";
			};
		} else if (turn === 'O') {
			if (playerO != '') {
				winner = 'X';
				messageO.textContent = "You are out of time!";
			  messageX.textContent = playerX+ " has won the game!";
			} else {
				messageX.textContent = "Player "+winner+ " has won the game!";
			};
		};	
	};
};

var processTurn = function(e) {
	if (!grid) { return false } //no active game
	if (winner.length > 0) { return false } //game already won
	var pos = e.target.id; //id for square clicked on
	if (grid.setValue(pos, turn)) {
		//stop timer
		window.clearInterval(intervalID);
		messageX.textContent = ' ';
		messageO.textContent = ' ';
		//update grid
		grid.draw();
		winner = grid.getWinner();
		if (winner === 'X') { 
			if (playerX != '') { 
				messageX.textContent = playerX+ " has won the game!";
			} else {
				messageX.textContent = "Player "+winner+ " has won the game!";
			};
			return;
		};
		if (winner ===  'O') {
			if (playerO != '') { 
				messageO.textContent = playerO+ " has won the game!";
			} else {
				messageO.textContent = "Player "+winner+ " has won the game!";
			};
			return;
		};
		if (winner ===  'draw') {
			messageX.textContent = "Draw!";
			messageO.textContent = "Draw!";
			return;
		};
		takeTurn();
	}
};


//EVENT LISTENERS===================================================================

window.addEventListener('load', setHeights);

document.querySelector('.grid').addEventListener('click', processTurn);

document.querySelector('.start-new').addEventListener('click', newGame);


//INITIALIZATION ===================================================================





































