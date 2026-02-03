
import React, { useState, useEffect, useCallback } from 'react';
import { Player, BoardState, GameState, Difficulty, Position } from './types';
import { createInitialBoard, getValidMoves, applyMove, countPieces } from './services/othelloLogic';
import { getChronosMove } from './services/chronosAI';
import { AudioService } from './services/audioService';
import { FREEZE_PROBABILITY, GLITCH_DURATION } from './constants';
import Board from './components/Board';

const App: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(Player.BLACK);
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYING);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.LEVEL3);
  const [doubleAction, setDoubleAction] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>(['システム初期化: 成功', 'ユーザーの入力を待機中...']);
  const [showGlitch, setShowGlitch] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 10));
  };

  // サウンド制御
  useEffect(() => {
    if (isSoundEnabled && gameState === GameState.PLAYING) {
      AudioService.startBGM();
    } else {
      AudioService.stopBGM();
    }
  }, [isSoundEnabled, gameState]);

  const finalizeTurn = useCallback((currentBoard: BoardState, player: Player) => {
    const p1Moves = getValidMoves(currentBoard, Player.BLACK);
    const p2Moves = getValidMoves(currentBoard, Player.WHITE);
    
    if (p1Moves.length === 0 && p2Moves.length === 0) {
      setGameState(GameState.GAMEOVER);
      const counts = countPieces(currentBoard);
      const isWin = counts.black > counts.white;
      if (isSoundEnabled) AudioService.playGameOver(isWin);
      return;
    }

    const nextPlayer = player === Player.BLACK ? Player.WHITE : Player.BLACK;
    const nextMoves = getValidMoves(currentBoard, nextPlayer);

    if (nextMoves.length === 0) {
      addLog(`${nextPlayer === Player.BLACK ? '黒' : '白'} パス: 有効な配置場所がありません`);
      setDoubleAction(false);
    } else {
      setCurrentPlayer(nextPlayer);
      setDoubleAction(false);
    }
  }, [isSoundEnabled]);

  const handleMove = useCallback(async (r: number, c: number) => {
    if (gameState !== GameState.PLAYING) return;
    
    const validMoves = getValidMoves(board, currentPlayer);
    if (!validMoves.some(m => m.r === r && m.c === c)) return;

    if (isSoundEnabled) {
      AudioService.playClick();
      setTimeout(() => AudioService.playFlip(), 100);
    }

    const newBoard = applyMove(board, r, c, currentPlayer);
    const nextMoveCount = moveCount + 1;
    setBoard(newBoard);
    setMoveCount(nextMoveCount);

    // 最初の2手はフリーズしない
    const canGlitch = nextMoveCount >= 2;
    const isGlitch = canGlitch && Math.random() < FREEZE_PROBABILITY;
    
    if (isGlitch) {
      setGameState(GameState.GLITCHING);
      setShowGlitch(true);
      if (isSoundEnabled) AudioService.playPuchun();
      addLog('重大なエラー: システムフリーズを検知');
      
      setTimeout(() => {
        setShowGlitch(false);
        setGameState(GameState.PLAYING);
        
        const followUpMoves = getValidMoves(newBoard, currentPlayer);
        if (followUpMoves.length > 0) {
          setDoubleAction(true);
          addLog('プロトコル上書き: 連続行動を許可');
        } else {
          addLog('連続行動エラー: 配置可能な場所がないためターンを終了します');
          finalizeTurn(newBoard, currentPlayer);
        }
      }, GLITCH_DURATION);
      
      return; 
    }

    finalizeTurn(newBoard, currentPlayer);
  }, [board, currentPlayer, gameState, finalizeTurn, moveCount, isSoundEnabled]);

  useEffect(() => {
    if (gameState === GameState.PLAYING && currentPlayer === Player.WHITE) {
      const timer = setTimeout(() => {
        const move = getChronosMove(board, Player.WHITE, difficulty);
        if (move) {
          handleMove(move.r, move.c);
        } else {
          finalizeTurn(board, Player.WHITE);
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameState, board, difficulty, handleMove, finalizeTurn]);

  const resetGame = () => {
    setBoard(createInitialBoard());
    setCurrentPlayer(Player.BLACK);
    setGameState(GameState.PLAYING);
    setDoubleAction(false);
    setMoveCount(0);
    setLogs(['システム再起動: 完了', '入力を待機中...']);
  };

  const { black, white } = countPieces(board);
  const winner = black > white ? Player.BLACK : white > black ? Player.WHITE : Player.NONE;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      <div className="glitch-noise absolute inset-0"></div>

      <div className="absolute top-4 right-4 text-[10px] sm:text-xs font-mono text-[#00FFFF] animate-blink z-20">
        ERROR_PROBABILITY: {(FREEZE_PROBABILITY * 100).toFixed(1)}%
      </div>

      <header className="mb-6 text-center z-10">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-[#00FFFF] drop-shadow-[0_0_10px_#00FFFF]">
          FREEZE OTHELLO
        </h1>
        <p className="text-[10px] md:text-xs font-mono text-[#00FFFF99]">VER 1.2.5 - GLITCH_PROTOCOL_ACTIVE</p>
      </header>

      <main className="flex flex-col lg:flex-row gap-8 items-center justify-center z-10 w-full max-w-6xl">
        <div className="w-full lg:w-64 flex flex-col gap-4 font-mono">
          <div className="bg-[#111] border border-[#00FFFF44] p-3 text-[10px] md:text-xs">
            <h3 className="border-b border-[#00FFFF44] mb-2 pb-1 text-[#00FFFF]">システムログ</h3>
            <div className="h-32 overflow-hidden flex flex-col gap-1">
              {logs.map((log, i) => (
                <div key={i} className={i === 0 ? "text-[#00FFFF]" : "text-[#00FFFF66]"}>
                  &gt; {log}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#111] border border-[#00FFFF44] p-3 text-xs flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span>黒 (OBSIDIAN):</span>
              <span className="text-xl text-[#00FFFF] font-bold">{black}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>白 (LUNA):</span>
              <span className="text-xl text-[#FFF] font-bold">{white}</span>
            </div>
          </div>

          <button 
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className={`mt-2 py-2 border transition-all flex items-center justify-center gap-2 ${isSoundEnabled ? 'border-[#00FFFF] text-[#00FFFF] bg-[#00FFFF11]' : 'border-white/20 text-white/40 hover:border-white/40'}`}
          >
            {isSoundEnabled ? '🔊 SOUND: ON' : '🔇 SOUND: OFF'}
          </button>
        </div>

        <div className="relative">
          <Board 
            board={board} 
            onCellClick={currentPlayer === Player.BLACK ? handleMove : () => {}} 
            validMoves={currentPlayer === Player.BLACK ? getValidMoves(board, Player.BLACK) : []}
            currentPlayer={currentPlayer}
          />
          
          <div className="mt-4 text-center font-mono h-8">
             {doubleAction ? (
               <div className="text-[#FF00FF] animate-pulse text-lg font-bold tracking-widest">!! DOUBLE ACTION !!</div>
             ) : (
               <div className={`text-lg ${currentPlayer === Player.BLACK ? "text-[#00FFFF]" : "text-white"}`}>
                 TURN: {currentPlayer === Player.BLACK ? "PLAYER (BLACK)" : "CHRONOS-AI (WHITE)"}
               </div>
             )}
          </div>
        </div>

        <div className="w-full lg:w-64 flex flex-col gap-4 font-mono text-xs">
          <div className="bg-[#111] border border-[#00FFFF44] p-3">
             <h3 className="text-[#00FFFF] mb-3 border-b border-[#00FFFF44] pb-1">AI 思考レベル</h3>
             <div className="flex flex-col gap-2">
               {Object.values(Difficulty).map(d => (
                 <button 
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`py-1.5 px-2 text-left border transition-all ${difficulty === d ? 'border-[#00FFFF] bg-[#00FFFF22] text-[#00FFFF]' : 'border-[#00FFFF44] text-[#00FFFF66] hover:bg-[#00FFFF11]'}`}
                 >
                   {difficulty === d ? '▶ ' : '  '}{d}
                 </button>
               ))}
             </div>
          </div>
          <button 
            onClick={resetGame}
            className="border border-[#00FFFF] text-[#00FFFF] py-3 px-4 hover:bg-[#00FFFF22] transition-colors font-bold tracking-widest"
          >
            FORCE RESTART
          </button>
        </div>
      </main>

      {showGlitch && (
        <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
          <div className="text-[#FF0000] text-xl md:text-2xl font-mono animate-pulse tracking-[0.3em] text-center">
            重大なエラー<br/>SYSTEM_FATAL_ERROR_{(FREEZE_PROBABILITY * 100).toFixed(1)}%
          </div>
        </div>
      )}

      {/* 対戦終了モーダル - テキスト見切れ修正版 */}
      {gameState === GameState.GAMEOVER && (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4 backdrop-blur-xl overflow-y-auto">
          <div className="w-full max-w-[90vw] sm:max-w-lg border border-[#00FFFF] bg-[#050505] shadow-[0_0_100px_rgba(0,255,255,0.2)] relative flex flex-col overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-50"></div>
            <div className="px-4 sm:px-6 py-2 sm:py-3 border-b border-[#00FFFF22] flex justify-between items-center font-mono text-[8px] sm:text-[9px] tracking-widest text-[#00FFFF66]">
              <span className="truncate mr-2">SESSION_STATE: TERMINATED</span>
              <span className="animate-blink text-[#00FFFF] flex-shrink-0">● DATA_SYNC</span>
            </div>
            
            <div className="p-6 sm:p-10 md:p-12 text-center">
              <div className="mb-6 sm:mb-8">
                {winner === Player.BLACK ? (
                  <div className="space-y-4">
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#00FFFF] tracking-tighter leading-none drop-shadow-[0_0_15px_rgba(0,255,255,0.6)] break-words">SYSTEM_DOMINATED</h2>
                    <p className="text-[#00FFFF99] font-mono text-[10px] sm:text-[11px] leading-relaxed max-w-[320px] mx-auto opacity-70">
                      基幹ロジックの強制上書きに成功。<br className="hidden sm:block"/>Chronos-AIの全権限を剥奪しました。
                    </p>
                  </div>
                ) : winner === Player.WHITE ? (
                  <div className="space-y-4">
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#FF0000] tracking-tighter leading-none drop-shadow-[0_0_15px_rgba(255,0,0,0.6)] break-words">CONNECTION_LOST</h2>
                    <p className="text-[#FF000099] font-mono text-[10px] sm:text-[11px] leading-relaxed max-w-[320px] mx-auto opacity-70">
                      致命的な干渉を検知。接続が途絶。<br className="hidden sm:block"/>全システムはAIに完全統合されました。
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#AAA] tracking-tighter leading-none break-words">DATA_STALEMATE</h2>
                    <p className="text-[#AAA] font-mono text-[10px] sm:text-[11px] opacity-70">計算資源が均衡しました。再試行を推奨。</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-px bg-[#00FFFF22] border border-[#00FFFF22] rounded-sm mb-8 overflow-hidden">
                <div className={`py-4 sm:py-6 flex flex-col items-center justify-center bg-[#0A0A0A] ${winner === Player.BLACK ? 'shadow-[inset_0_0_20px_rgba(0,255,255,0.15)]' : ''}`}>
                  <span className="text-[8px] sm:text-[9px] text-[#00FFFF44] font-mono mb-1 tracking-[0.2em]">PLAYER</span>
                  <span className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#00FFFF]">{black}</span>
                </div>
                <div className={`py-4 sm:py-6 flex flex-col items-center justify-center bg-[#0A0A0A] ${winner === Player.WHITE ? 'shadow-[inset_0_0_20px_rgba(255,0,0,0.15)]' : ''}`}>
                  <span className="text-[8px] sm:text-[9px] text-white/20 font-mono mb-1 tracking-[0.2em]">CHRONOS</span>
                  <span className="text-3xl sm:text-5xl md:text-6xl font-bold text-white">{white}</span>
                </div>
              </div>

              <button 
                onClick={resetGame}
                className="w-full relative py-4 sm:py-5 bg-[#00FFFF] text-[#050505] font-black text-lg sm:text-xl tracking-[0.2em] transition-all hover:brightness-125 active:scale-[0.98] shadow-[0_0_30px_rgba(0,255,255,0.3)]"
              >
                NEW SESSION
              </button>
              
              <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-[#00FFFF11] flex justify-between items-center text-[8px] sm:text-[9px] font-mono text-[#00FFFF22]">
                <span className="truncate">ID: {Math.random().toString(16).slice(2, 10).toUpperCase()}</span>
                <span className="uppercase mx-2 flex-shrink-0">Moves: {moveCount}</span>
                <span className="hidden sm:inline">Kernel: 3.1.2</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-12 opacity-30 text-[8px] font-mono pointer-events-none select-none tracking-widest uppercase">
        Memory_Dump: 0x4850_3942 | Cache_Flushed | Loc: JA_JP
      </footer>
    </div>
  );
};

export default App;
