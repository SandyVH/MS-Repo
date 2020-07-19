import { board, move } from './board';
import computer from './computer';
import './Style.css';

//Helper functions (from http://jaketrent.com/post/addremove-classes-raw-javascript/)
function hasClass(el, className) {
  if (el.classList)
    return el.classList.contains(className);
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}
function addClass(el, className) {
  if (el.classList)
    el.classList.add(className);
  else if (!hasClass(el, className)) el.className += " " + className;
}
function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className);
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
    el.className=el.className.replace(reg, ' ');
  }
}

//function to draw a line across the winning row by adding a class to the board
function drawWinningLine(direction, row) {
	let Board = document.getElementById("board");
	Board.className = `${direction}${row}`;
	setTimeout(() => { Board.className += ' full'; }, 50);
}

function newGame(depth = 9, starting_player = 1) {
	//instantiating a new computer player and an empty board
	let C = new computer(parseInt(depth));
	let B = new board([ ['','',''],['','',''],['','',''] ]);

	//clearing all board classes and creating empty cells in html
	let Board = document.getElementById("board");
	Board.className = '';
	Board.innerHTML = '<div class="cell-0"></div><div class="cell-1"></div><div class="cell-2"></div><div class="cell-3"></div><div class="cell-4"></div><div class="cell-5"></div><div class="cell-6"></div><div class="cell-7"></div><div class="cell-8"></div>';
	
	//removing all celebration classes
	removeClass(document.getElementById("charachters"), 'celebrate_human');
	removeClass(document.getElementById("charachters"), 'celebrate_robot');

	//storing the html cells in an array
	let html_cells = [...Board.children];

	let starting = parseInt(starting_player),
		player_turn = starting;

	//if computer has to make the starting move, choose a random move as long as it is a corner or the center
	if(!starting) {
		let computer_choices = [new move(0,0), new move(0,2), new move(1,1), new move(2,0), new move(2,2)];
		let index = Math.floor(Math.random()*computer_choices.length);
		let first_move = computer_choices[index];
		let symbol = 'x';
		//update the board and the UI
		b.insert(symbol, first_move.row, first_move.col);
		addClass(html_cells[index*2], symbol);
		player_turn = 1; //Switch turns
	}

	for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
			let = index = (3 * i) + j;
			//Adding Click event listener for each cell
            html_cells[index].addEventListener('click', () => {
				index = (3 * i) + j;
				//If the cell is already occupied or one of the player has already won or it's not human's turn, return false
                if(hasClass(html_cells[index], 'x') || hasClass(html_cells[index], 'o') || B.evaluate() || !player_turn) return false;
				let symbol = 'o';
				//update the board and the UI
                B.insert(symbol, i, j);
				addClass(html_cells[index], symbol);
				// if the player wins with this move update the UI and draw the winning line
                if(B.evaluate() < 0) {
                    addClass(document.getElementById("charachters"), 'celebrate_human');
                    drawWinningLine(B.win_direction, B.win_row);
				}

				//if the board is not full and no one has won yet, get the computer's best move and update the UI
                if(!B.isFull() && B.evaluate() == 0) {
                    player_turn = 0; //Switch turns
                    bestMove = new move();
                    bestMove = C.findBestMove(B);
                    symbol = 'x';
                    index = (3 * bestMove.row) + bestMove.col ;
                    B.insert(symbol, bestMove.row, bestMove.col);
                    addClass(html_cells[index], symbol);
                    if(B.evaluate() > 0) {
                        addClass(document.getElementById("charachters"), 'celebrate_robot');
                        drawWinningLine(B.win_direction, B.win_row);
                    }
                    player_turn = 1; //Switch turns
                }
            }, false);
        }
    }
}

document.addEventListener("DOMContentLoaded", event => { 
	//Starts a new game when page loads with default values
	let depth = 9;
	let starting_player = 1;
	newGame(depth, starting_player);

	//Events handlers for depth, starting player options
	document.getElementById("depth").addEventListener("click", (event) => {
		if(event.target.tagName !== "LI" || hasClass(event.target, 'active')) return
		let depth_choices = [...document.getElementById("depth").children[0].children];
		depth_choices.forEach((choice) => {
			removeClass(choice, 'active');
		});
		addClass(event.target, 'active');
		depth = event.target.dataset.value;
	}, false);

	document.getElementById("starting_player").addEventListener("click", (event) => {
		if(event.target.tagName !== "LI" || hasClass(event.target, 'active')) return
		let starting_player_choices = [...document.getElementById("starting_player").children[0].children];
		starting_player_choices.forEach((choice) => {
			removeClass(choice, 'active');
		});
		addClass(event.target, 'active');
		starting_player = event.target.dataset.value;
	}, false);

	document.getElementById("newgame").addEventListener('click', () => {
		newGame(depth, starting_player);
	});

});