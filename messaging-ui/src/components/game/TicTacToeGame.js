import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const TicTacToeGame = () => {
    const { gameId } = useParams();
    const [game, setGame] = useState(null);
    const [board, setBoard] = useState(Array(9).fill(null));
    const [winner, setWinner] = useState(null);
    const [winningCombination, setWinningCombination] = useState([]);
    const [currentSymbol, setCurrentSymbol] = useState('X');
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const id = parseInt(localStorage.getItem('userId'), 10);
        setUserId(id);
    }, []);

    const resetState = () => {
        setBoard(Array(9).fill(null));
        setWinner(null);
        setWinningCombination([]);
        setCurrentSymbol('X');
        setError('');
    };

    const fetchMovesForGame = async (gameId) => {
        try {
            const response = await axios.get(`http://localhost:8000/game/moves/?game=${gameId}`);
            return response.data;
        } catch (err) {
            console.error('Error fetching moves:', err);
            setError('Unable to fetch moves.');
            return [];
        }
    };

    const fetchGameData = useCallback(async () => {
        resetState();
        try {
            const gameResponse = await axios.get(`http://localhost:8000/game/games/${gameId}/`);
            setGame(gameResponse.data);

            const moves = await fetchMovesForGame(gameId);
            const newBoard = Array(9).fill(null);
            moves.forEach((move) => {
                newBoard[move.position] = move.player_info.first_name === gameResponse.data.player_x_info.first_name ? 'X' : 'O';
            });
            setBoard(newBoard);

            if (gameResponse.data.winner) {
                const winnerName = gameResponse.data.winner_info.first_name;
                setWinner(winnerName);
                const winningCombo = checkWinner(newBoard);
                if (winningCombo) setWinningCombination(winningCombo);
            } else {
                setCurrentSymbol(moves.length % 2 === 0 ? 'X' : 'O');
            }
        } catch (err) {
            setError('Unable to fetch game data.');
            console.error(err);
        }
    }, [gameId]);

    useEffect(() => {
        if (winner) {
            return;
        }
        const intervalId = setInterval(() => {
            fetchGameData();
        }, 2000);
        return () => clearInterval(intervalId);
    }, [fetchGameData, gameId, winner]);

    const checkWinner = (board) => {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return combination;
            }
        }
        return null;
    };

    const makeMove = async (position) => {
        if (board[position] || winner || !game) return;
        const isPlayerX = game.player_x_info.id === userId;
        const isPlayerO = game.player_o_info && game.player_o_info.id === userId;
        if ((currentSymbol === 'X' && !isPlayerX) || (currentSymbol === 'O' && !isPlayerO)) {
            setError('It is not your turn.');
            return;
        }
        try {
            await axios.post('http://localhost:8000/game/moves/', {
                game: gameId,
                player: userId,
                position
            });
            const newBoard = [...board];
            newBoard[position] = currentSymbol;
            setBoard(newBoard);
            const winningCombo = checkWinner(newBoard);
            if (winningCombo) {
                const winnerName = currentSymbol === 'X' ? game.player_x_info.first_name : game.player_o_info.first_name;
                setWinner(winnerName);
                setWinningCombination(winningCombo);
                await axios.patch(`http://localhost:8000/game/games/${gameId}/`, {
                    winner: userId
                });

                // Оновити кількість перемог переможця
                await axios.patch(`http://localhost:8000/game/players/${userId}/update_wins/`);
            } else {
                setCurrentSymbol(currentSymbol === 'X' ? 'O' : 'X');
            }
        } catch (err) {
            setError('Error making a move.');
            console.error(err);
        }
    };

    const renderCell = (index) => {
        const isWinningCell = winningCombination.includes(index);
        const cellSymbol = board[index];
        const symbolColor = cellSymbol === 'X' ? 'green' : cellSymbol === 'O' ? 'blue' : 'black';
        return (
            <button
                onClick={() => makeMove(index)}
                disabled={board[index] !== null || winner !== null}
                className={`btn ${isWinningCell ? 'btn-danger' : 'btn-light'} border`}
                style={{
                    width: '100px', height: '100px', fontSize: '24px', cursor: 'pointer',
                    color: symbolColor,
                    backgroundColor: isWinningCell ? 'lightcoral' : '#d3d3d3' // Темніший фон
                }}
            >
                {board[index] || ' '}
            </button>
        );
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div>
                <h1 className="text-center">Game {gameId}</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                {game && (
                    <div>
                        <p>Player X: {game.player_x_info.first_name} (Wins: {game.player_x_info.game_wins})</p>
                        <p>Player O: {game.player_o_info ? game.player_o_info.first_name : 'Waiting for Player O'} (Wins: {game.player_o_info ? game.player_o_info.game_wins : 0})</p>
                        <p>Winner: {winner ? winner : 'Not decided yet'}</p>
                    </div>
                )}
                <h2 className="text-center">Game Board</h2>
                <div className="d-grid gap-3" style={{ gridTemplateColumns: 'repeat(3, 100px)' }}>
                    {[...Array(9).keys()].map(index => (
                        <div key={index}>{renderCell(index)}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TicTacToeGame;
