console.log('script.js linked');

//SQUARE OBJECT =======================================================================

var Square = function Square() {
	this._value = '';
};

//methods
Square.prototype.setValue = function(val) {
	if (this._value.length > 0) { return false } //square already set
	this._value = val;
	return true; 
};

Square.prototype.getValue = function() {
	return this._value;
};

//ROW OBJECT ==========================================================================

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
			case 'x': x++; break;
			case 'o': o++; break;
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

//GRID OBJECT =========================================================================

//each grid contains 9 square objects and 8 row objects

var Grid = function Grid() {
	this._rows = [];
	//initialize game

	//create squares
	//first row
	this._sqTopLeft = new Square();
	this._sqTopMiddle = new Square();
	this._sqTopRight = new Square();
	//second row
	this._sqMiddleLeft = new Square();
	this._sqCenter = new Square();
	this._sqMiddleRight = new Square();
	//third row
	this._sqBottomLeft = new Square();
	this._sqBottomMiddle = new Square();
	this._sqBottomRight = new Square();

	//create rows
	this._topAcross = new Row(this._sqTopLeft, this._sqTopMiddle, this._sqTopRight);
	this._middleAcross = new Row(this._sqMiddleLeft, this._sqCenter, this._sqMiddleRight);
	this._bottomAcross = new Row(this._sqBottomLeft, this._sqBottomMiddle, this._sqBottomRight);
	this._leftDown = new Row(this._sqTopLeft, this._sqMiddleLeft, this._sqBottomLeft);
	this._middleDown = new Row(this._sqTopMiddle, this._sqCenter, this._sqBottomMiddle);
	this._rightDown = new Row(this._sqTopRight, this._sqMiddleRight, this._sqBottomRight);
	this._diagonal1 = new Row(this._sqTopLeft, this._sqCenter, this._sqBottomRight);
	this._diagonal2 = new Row(this._sqBottomLeft, this._sqCenter, this._sqTopRight);

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

var grid = new Grid();
































