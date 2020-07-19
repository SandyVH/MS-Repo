class computer{
    constructor(max_depth = 9) {
        this.max_depth = max_depth;
    }

    //uses minimax algorithm to find and return the best possible move
    findBestMove(Board){
        let best = -1000;
        const bestMoves = [];
        let moves = Board.getPossibleMoves();
        // for each possible move, call the minimax function and return the move/moves with optimum value
        moves.forEach(P_move => {
            //make the move
            Board.insert('x', P_move.row, P_move.col);
            //call the minimx function
            let value = this.minimax(Board,0,false);
            //undo the move
            Board.remove(P_move.row, P_move.col);
            if(value >= best){ 
                //if the present value is greater than the best, reset the array of best moves
                if(value > best) bestMoves.splice(0, bestMoves.length);
                //add the present move into the array of best moves
                bestMoves.push(P_move);
                //update the best value
                best = value;
            }
        });
        //choose a random move out of all the best moves and return it
        var index = Math.floor(Math.random() * bestMoves.length);
        return bestMoves[index];
    }

    //The minimax function - considers all possible ways the game can go and returns the value of the board
    minimax(Board, depth, isMax){
        let score = Board.evaluate();
        let moves = Board.getPossibleMoves();
        //if either the player or the computer wins it returns -10 or +10 respectively
        //if no one wins and if the board is full or the maximum depth is reached,  it returns 0
        if( score || !(moves.length) || depth == this.max_depth ) {
            if(score > 0){ return (score - depth); }
            if(score < 0){ return (score + depth); }
            return 0;
        }
        //if it is the maximizer's (computer) move
        if(isMax) {
            let best = -1000;
            //for all the available moves
            moves.forEach(P_move => {
                //make the move
                Board.insert('x', P_move.row, P_move.col);
                // call the minimax function recursively and choose the maximum value
                best = Math.max(best, this.minimax(Board, depth + 1, !isMax));
                //undo the move
                Board.remove(P_move.row, P_move.col);
			});
			return best;
        }
        //if it is the minimizer's (player) move
        else {
            let best = 1000;
            //for all the available moves
            moves.forEach(P_move => {
                //make the move
                Board.insert('o', P_move.row, P_move.col);
                // call the minimax function recursively and choose the minimum value
                best = Math.min(best, this.minimax(Board, depth + 1, !isMax));
                //undo the move
                Board.remove(P_move.row, P_move.col);
			});
			return best;
        }
    }
}

export default computer;