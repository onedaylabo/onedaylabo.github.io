
import React from 'react';
import { Player, BoardState, Position } from '../types';
import { BOARD_SIZE } from '../constants';

interface BoardProps {
  board: BoardState;
  onCellClick: (r: number, c: number) => void;
  validMoves: Position[];
  currentPlayer: Player;
}

const Board: React.FC<BoardProps> = ({ board, onCellClick, validMoves, currentPlayer }) => {
  return (
    <div className="relative p-2 bg-[#0A0A0A] border-4 border-[#00FFFF] shadow-[0_0_30px_rgba(0,255,255,0.3)]">
      <div className="grid grid-cols-8 gap-1">
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isValid = validMoves.some(m => m.r === r && m.c === c);
            return (
              <div
                key={`${r}-${c}`}
                onClick={() => onCellClick(r, c)}
                className={`
                  w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center 
                  cursor-pointer transition-all duration-300 relative
                  bg-[#111] border border-[#00FFFF33] cell-shadow
                  hover:bg-[#00FFFF11]
                `}
              >
                {/* Valid Move Indicator */}
                {isValid && (
                  <div className="absolute w-2 h-2 bg-[#00FFFF] rounded-full opacity-40 animate-pulse"></div>
                )}

                {/* Piece */}
                {cell !== Player.NONE && (
                  <div
                    className={`
                      w-[80%] h-[80%] rounded-full transition-transform duration-500 transform
                      ${cell === Player.BLACK 
                        ? 'bg-gradient-to-br from-[#222] to-[#000] shadow-[0_0_10px_rgba(0,0,0,1)]' 
                        : 'bg-gradient-to-br from-[#FFF] to-[#AAA] shadow-[0_0_10px_rgba(255,255,255,0.5)]'}
                      ${cell === Player.BLACK ? 'rotate-0' : 'rotate-180'}
                    `}
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                  >
                     <div className="absolute inset-0 rounded-full border border-white/10"></div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Board;
