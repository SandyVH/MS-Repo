class move{
    constructor(row = -1, col = -1){
        this.row = row;
        this.col = col;
    }
}

class board {
    constructor(grid = [ ['','',''],['','',''],['','',''] ], win_row = -1, win_direction = '') {
        this.win_row = win_row;
        this.win_direction = win_direction;
        this.grid = grid;
    }

    //Prints the current state of the board in the console
    printBoard() {
        let Str = '';
        for (var i = 0; i < 3; i++){
                for (var j = 0; j < 3; j++)
                    Str += this.grid[i][j] ? ` ${this.grid[i][j]} |` : '   |';
                Str = Str.slice(0,-1);
                if (i < 2) {Str += '\n\u2015\u2015\u2015 \u2015\u2015\u2015 \u2015\u2015\u2015\n';}
        }
        console.log('%c' + Str, 'color: #6d4e42;font-size:16px');
    }
    
    //Checks if the board has no symbols yet
    isEmpty() {
        for (var i = 0; i < 3; i++)
            for (var j = 0; j < 3; j++)
                if (this.grid[i][j])
                    return false;
                return true;
    }
    
    //Checks if the board has no grids available
    isFull() {
        for (var i = 0; i < 3; i++)
            for (var j = 0; j < 3; j++)
                if (!(this.grid[i][j]))
                    return false;
                return true;
    }
    
    //inserts a symbol(x/o) into the particular grid of board
    insert(symbol, i , j) {
        if(i > 2 || j > 2 || this.grid[i][j]) return false; 
        this.grid[i][j] = symbol;
        return true;
    }

    //removes symbol from the particular grid of board 
    remove(i, j){
        if(i < 3 && j < 3 && this.grid[i][j]){
            this.grid[i][j] = '';
            return true;
        }
        return false;
    }

    // returns available moves(an array of move objects) on the board
    getPossibleMoves() {
        const moves = [];
        for (var i = 0; i < 3; i++)
            for (var j = 0; j < 3; j++)
                if (!(this.grid[i][j]))
                    moves.push(new move(i,j));
        return moves;
    }
    
    //evaluates and returns the current state of the board: (10) - if computer wins, (-10) - if human player wins, (0) - otherwise
    //Also sets the winning row number and direction
    evaluate() {
        if(this.isEmpty()) return 0;

        //checking for horizontal wins
        if(this.grid[0][0] == this.grid[0][1] && this.grid[0][0] == this.grid[0][2] && this.grid[0][0]) {
            this.win_row = 1;
            this.win_direction = 'H';
            if(this.grid[0][0] == 'x')
                return 10;
            else
                return -10;
        }
        if(this.grid[1][0] == this.grid[1][1] && this.grid[1][0] == this.grid[1][2] && this.grid[1][0]) {
            this.win_row = 2;
            this.win_direction = 'H';
            if(this.grid[1][0] == 'x')
                return 10;
            else
                return -10;
        }
        if(this.grid[2][0] == this.grid[2][1] && this.grid[2][0] == this.grid[2][2] && this.grid[2][0]) {
            this.win_row = 3;
            this.win_direction = 'H';
            if(this.grid[2][0] == 'x')
                return 10;
            else
                return -10;
        }

        //checking for vertical wins
        if(this.grid[0][0] == this.grid[1][0] && this.grid[0][0] == this.grid[2][0] && this.grid[0][0]) {
            this.win_row = 1;
            this.win_direction = 'V';
            if(this.grid[0][0] == 'x')
                return 10;
            else
                return -10;
        }
        if(this.grid[0][1] == this.grid[1][1] && this.grid[0][1] == this.grid[2][1] && this.grid[0][1]) {
            this.win_row = 2;
            this.win_direction = 'V';
            if(this.grid[0][1] == 'x')
                return 10;
            else
                return -10;
        }
        if(this.grid[0][2] == this.grid[1][2] && this.grid[0][2] == this.grid[2][2] && this.grid[0][2]) {
            this.win_row = 3;
            this.win_direction = 'V';
            if(this.grid[0][2] == 'x')
                return 10;
            else
                return -10;
        }

        //checking for diagonal wins
        if(this.grid[0][0] == this.grid[1][1] && this.grid[0][0] == this.grid[2][2] && this.grid[0][0]) {
            this.win_row = 1;
            this.win_direction = 'D';
            if(this.grid[0][0] == 'x')
                return 10;
            else
                return -10; 
        }
        if(this.grid[0][2] == this.grid[1][1] && this.grid[0][2] == this.grid[2][0] && this.grid[0][2]) {
            this.win_row = 2;
            this.win_direction = 'D';
            if(this.grid[0][2] == 'x')
                return 10;
            else
                return -10; 
        }

        return 0;
    }
}

export default board; 
export default move;