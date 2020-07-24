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

//function to draw the winning line in the 2-player game
function drawWinningLine2(direction, row) {
    let Board = document.getElementById("board2");
    Board.className = `${direction}${row}`;
    setTimeout(() => { Board.className += ' full'; }, 50);
}

// To start a new 1 player Game
function newGame(depth = 9, starting_player = 1) {
	//instantiating a new computer player and an empty board
	let C = new computer(parseInt(depth));
	let B = new board([ ['','',''],['','',''],['','',''] ]);

	//Hiding the game result element
	var gameover = document.getElementById("gameover");
    gameover.setAttribute("style", "visibility: hidden;");

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

	// if computer has to make the starting move, choose a random move as long as it is a corner or the center
	if(!starting) {
		let computer_choices = [new move(0,0), new move(0,2), new move(1,1), new move(2,0), new move(2,2)];
		let index = Math.floor(Math.random()*computer_choices.length);
		let first_move = computer_choices[index];
		let symbol = 'x';
		// update the board and the UI
		B.insert(symbol, first_move.row, first_move.col);
		addClass(html_cells[index*2], symbol);
		player_turn = 1; //Switch turns
	}

	for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
			let = index = (3 * i) + j;
			// Adding Click event listener for each cell
            html_cells[index].addEventListener('click', () => {
				index = (3 * i) + j;
				//If the cell is already occupied or one of the player has already won or it's not human's turn, return false
                if(hasClass(html_cells[index], 'x') || hasClass(html_cells[index], 'o') || B.evaluate() || !player_turn) return false;
				let symbol = 'o';
				// update the board and the UI
                B.insert(symbol, i, j);
				addClass(html_cells[index], symbol);

				// if the player wins with this move update the UI and draw the winning line
                if(B.evaluate() < 0) {
                    addClass(document.getElementById("charachters"), 'celebrate_human');
					drawWinningLine(B.win_direction, B.win_row);

					// Making the game result visible
					var gameover = document.getElementById("gameover");
                    gameover.innerHTML = "YOU WIN";
                    gameover.setAttribute("style", "visibility: visible;");
				}

				// if the board is not full and no one has won yet, get the computer's best move and update the UI
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
						
						var gameover = document.getElementById("gameover");
                        gameover.innerHTML = "YOU LOSE";
                        gameover.setAttribute("style", "visibility: visible;");
                    }
                    player_turn = 1; //Switch turns
				}
				
				// Updating the game result if it is a draw
				if(B.isFull() && B.evaluate() == 0) {
                    var gameover = document.getElementById("gameover");
                    gameover.innerHTML = "It's a Draw";
                    gameover.setAttribute("style", "visibility: visible;");
                }
            }, false);
        }
    }
}

// To start a new 2 player Game
function newGame2(starting_player = 1) {
	//Instantiating an empty board
	let B = new board([ ['','',''],['','',''],['','',''] ]);

	//Hiding the game result element
	var gameover = document.getElementById("gameover2");
    gameover.setAttribute("style", "visibility: hidden;");

	//clearing all board classes and creating empty cells in html
    let Board = document.getElementById("board2");
    Board.className = '';
    Board.innerHTML = '<div class="cell-0"></div><div class="cell-1"></div><div class="cell-2"></div><div class="cell-3"></div><div class="cell-4"></div><div class="cell-5"></div><div class="cell-6"></div><div class="cell-7"></div><div class="cell-8"></div>';

	//removing all celebration classes
    removeClass(document.getElementById("charachters2"), 'celebrate_human2');
    removeClass(document.getElementById("charachters2"), 'celebrate_human3');
	
	//storing the html cells in an array
	let html_cells = [...Board.children];

    let starting = parseInt(starting_player),
        player_turn = starting;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
			let = index = (3 * i) + j;
			//Adding Click event listener for each cell
            html_cells[index].addEventListener('click', () => {
				index = (3 * i) + j;
				//If the cell is already occupied or one of the player has already won, return false
                if(hasClass(html_cells[index], 'x') || hasClass(html_cells[index], 'o') || B.evaluate() ) return false;

				//If it's the player-1's turn
                if(player_turn) {
					let symbol = 'x';
					//update the board and the UI
                    B.insert(symbol, i ,j);
					addClass(html_cells[index], symbol);
					// if the player-1 wins with this move update the UI and draw the winning line
                    if(B.evaluate() > 0) {
                        addClass(document.getElementById("charachters2"), 'celebrate_human2');
						drawWinningLine2(B.win_direction, B.win_row);
						
						var x = document.getElementById("demo2").innerHTML;
                        var gameover = document.getElementById("gameover2");
                        if(x != "") gameover.innerHTML = x.toUpperCase()+" WINS";
                        else gameover.innerHTML = "PLAYER 1 WINS";
                        gameover.setAttribute("style", "visibility: visible;");
                    }
                    player_turn = 0;//Switch turns
                }

				//If it's the player-2's turn
                else {
					let symbol = 'o';
					//update the board and the UI
                    B.insert(symbol, i, j);
					addClass(html_cells[index], symbol);
					// if the player-2 wins with this move update the UI and draw the winning line
                    if(B.evaluate() < 0) {
                        addClass(document.getElementById("charachters2"), 'celebrate_human3');
						drawWinningLine2(B.win_direction, B.win_row);
						
						var x = document.getElementById("demo3").innerHTML;
                        var gameover = document.getElementById("gameover2");
                        if(x != "") gameover.innerHTML = x.toUpperCase()+" WINS";
                        else gameover.innerHTML = "PLAYER 2 WINS";
                        gameover.setAttribute("style", "visibility: visible;");
                    }
                    player_turn = 1;//Switch turns
				}
				
				if(B.isFull() && B.evaluate() == 0) {
                    var gameover = document.getElementById("gameover2");
                    gameover.innerHTML = "It's a Draw";
                    gameover.setAttribute("style", "visibility: visible;");
                }
            }, false);
        } 
    }
}

document.addEventListener("DOMContentLoaded", event => { 
	let starting_player;

	//Scroll to the Top of the page each time the page is loaded
	$(window).on('beforeunload', function() {
        $(window).scrollTop(0);
	});
	
	let player_choice = 1;
	//Event handler for no. of players selection
    document.getElementById("options").addEventListener("click", (event) => {
		if(event.target.tagName !== "BUTTON") return;
		player_choice = event.target.dataset.value;

		//If 1 player is chosen, Scroll the page to the 1-player UI and start a new 1-player game with default values
        if(player_choice == 1) {
			$("html, body").scrollTop($("#container").offset().top);
			document.getElementById("temp").setAttribute("style", "visibility: visible;");
            let depth = 9;
            starting_player = 1;
			newGame(depth, starting_player);
		}

		//If 2 players is selected, scroll to the 2 player UI
        else
            $("html, body").scrollTop($(".2player").offset().top); 
		
        let player_choices = [...document.getElementById("options").children];
		player_choices.forEach((choice) => {
			removeClass(choice, 'active');
        });
        addClass(event.target, 'active');
    
        if(player_choice == 2) {

			document.getElementById("temp2").setAttribute("style", "visibility: visible;");
			document.getElementById("temp3").setAttribute("style", "visibility: visible;");

			//Starts a new 2 player game when page loads with default value(To reset the screen)
			newGame2();
	
			//Event handler for starting player option
            document.getElementById("starting_player2").addEventListener("click", (event) => {
                if(event.target.tagName !== "LI" || hasClass(event.target, 'active')) return;
                let starting_player_choices = [...document.getElementById("starting_player2").children[0].children];
                starting_player_choices.forEach((choice) => {
                    removeClass(choice, 'active');
                });
				addClass(event.target, 'active');
                starting_player = event.target.dataset.value;
            }, false);
	
            document.getElementById("newgame2").addEventListener('click', () => {
				console.log(starting_player);//debug
                newGame2(starting_player);
            });
			
			//Event handler to scroll to the top option
            document.getElementById("top2").addEventListener("click", (e) => {
                $("html, body").scrollTop($("#screen").offset().top);
            }, false);
        }
	});
	
	if(player_choice == 1) {
		//Starts a new 1 player game when page loads with default values
		let depth = 9;
		starting_player = 1;
		newGame(depth, starting_player);

		//Events handlers for depth, starting player options
		document.getElementById("depth").addEventListener("click", (event) => {
			if(event.target.tagName !== "LI" || hasClass(event.target, 'active')) return;
			let depth_choices = [...document.getElementById("depth").children[0].children];
			depth_choices.forEach((choice) => {
				removeClass(choice, 'active');
			});
			addClass(event.target, 'active');
			depth = event.target.dataset.value;
		}, false);

		document.getElementById("starting_player").addEventListener("click", (event) => {
			if(event.target.tagName !== "LI" || hasClass(event.target, 'active')) return;
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

		//Event handler to scroll to the top option
		document.getElementById("top").addEventListener("click", (event) => {
			$("html, body").scrollTop($("#screen").offset().top);
		}, false);
	}

});