import {Color, PieceSymbol, Square } from "chess.js"
import { useState } from "react";

export const ChessBoard = ({ chess, board, socket, setBoard }: {
    setBoard: any
    chess: any
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    socket: WebSocket;
}) => {
    const [from, setFrom] = useState<null | Square>(null);


    return <div className="text-white">
        {
            board.map((row, i) => {
                return <div key={i} className="flex">
                    {
                        row.map((square, j) => {
                            const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;
                            return <div onClick={() => {
                                if (!from) {
                                    setFrom(squareRepresentation)
                                }
                                else {
                                    socket.send(JSON.stringify({
                                        type: "move",
                                        payload: {
                                            move:
                                            {
                                                from,
                                                to: squareRepresentation

                                            }
                                        }
                                    }))
                                    setFrom(null)
                                    chess.move({
                                        from,
                                        to: squareRepresentation
                                    });
                                    setBoard(chess.board())
                                }
                            }} key={j} className={`w-16 h-16 ${(i + j) % 2 === 0 ? 'bg-green-500' : 'bg-white'}`}>
                                <div className="w-full justify-center flex">
                                    <div className="h-full justify-center flex flex-col">
                                        {square ? <img className="w-8" src={`/${square?.color === "b" ?
                                            square?.type : `${square?.type?.toUpperCase()} copy`}.png`} /> : null
                                        }
                                    </div>
                                </div>
                            </div>
                        })
                    }
                </div>
            })
        }
    </div>
}