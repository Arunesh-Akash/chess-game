"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: "init_game",
            payload: {
                color: 'black'
            }
        }));
        this.player2.send(JSON.stringify({
            type: "init_game",
            payload: {
                color: 'white'
            }
        }));
    }
    makeMove(socket, move) {
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            return;
        }
        try {
            this.board.move(move);
        }
        catch (error) {
            return;
        }
        if (this.board.isGameOver()) {
            this.player1.emit(JSON.stringify({
                type: "Game Over",
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            this.player2.emit(JSON.stringify({
                type: "Game Over",
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
        }
        if (this.board.moves.length % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: "move",
                payload: move
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                type: move,
                payload: move
            }));
        }
        this.moveCount++;
    }
}
exports.Game = Game;
