import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const TicTacToeGame = () => {
    const { gameId } = useParams();
    const [game, setGame] = useState(null);
    const [board, setBoard] = useState(Array(9).fill(null));
    const [winner, setWinner] = useState(null);
    const [currentSymbol, setCurrentSymbol] = useState('X');
    const [error, setError] = useState('');


    // Скидання стану до початкових значень
    const resetState = () => {
        setBoard(Array(9).fill(null));
        setWinner(null);
        setCurrentSymbol('X');
        setError('');
    };

    // Завантаження ходів для поточної гри
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

    // Завантаження гри та її ходів
    const fetchGameData = useCallback(async () => {
        // Скидаємо стан перед завантаженням нової гри
        resetState();
        try {
            const gameResponse = await axios.get(`http://localhost:8000/game/games/${gameId}/`);
            setGame(gameResponse.data);

            // Фільтруємо ходи для поточної гри
            const moves = await fetchMovesForGame(gameId);

            // Заповнюємо дошку новими ходами
            const newBoard = Array(9).fill(null);
            moves.forEach((move) => {
                newBoard[move.position] = move.player_info.first_name === gameResponse.data.player_x_info.first_name ? 'X' : 'O';
            });
            setBoard(newBoard);

            setCurrentSymbol(moves.length % 2 === 0 ? 'X' : 'O');

        } catch (err) {
            setError('Unable to fetch game data.');
            console.error(err);
        }
    }, [gameId]);

    // Завантажуємо дані гри при першому рендері та зміні `gameId`
    useEffect(() => {
    const intervalId = setInterval(() => {
        fetchGameData();
    }, 2000); // Оновлення кожні 2 секунди

    return () => clearInterval(intervalId);
}, [fetchGameData, gameId]);

    // Перевірка переможця
    const checkWinner = (board) => {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const [a, b, c] of winningCombinations) {
            if (board[a] && board[a] === board[b] && board[a] === board[c] ) {
                return board[a];

            }

        }
        return null;
    };

    // Створення нового ходу
    const makeMove = async (position) => {
        if (board[position] || winner) return;

        try {
            const userId = parseInt(localStorage.getItem('userId'), 10);
            const symbolToPlay = currentSymbol;

            await axios.post('http://localhost:8000/game/moves/', {
                game: gameId,
                player: userId,
                position
            });

            // Оновлюємо дошку після успішного ходу
            const newBoard = [...board];
            newBoard[position] = symbolToPlay;
            setBoard(newBoard);

            // Перевірка переможця
            const newWinner = checkWinner(newBoard);
            if (newWinner) {
                const winnerName = newWinner === 'X' ? game.player_x_info.first_name : game.player_o_info.first_name;
                setWinner(winnerName);

                // Оновлення переможця на сервері
                await axios.patch(`http://localhost:8000/game/games/${gameId}/`, {
                    winner: userId
                });
            } else {
                setCurrentSymbol(currentSymbol === 'X' ? 'O' : 'X');
            }

        } catch (err) {
            setError('Error making a move.');
            console.error(err);
        }
    };

    // Рендер однієї клітинки
    const renderCell = (index) => (
        <button
            onClick={() => makeMove(index)}
            disabled={board[index] !== null || winner !== null}
            style={{ width: '100px', height: '100px', fontSize: '24px', cursor: 'pointer', backgroundColor: '#f0f0f0', border: '1px solid #000' }}
        >
            {board[index] || ' '}
        </button>
    );

    return (
        <div>
            <h1>Game {gameId}</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {game && (
                <div>
                    <p>Player X: {game.player_x_info.first_name}</p>
                    <p>Player O: {game.player_o_info ? game.player_o_info.first_name : 'Waiting for Player O'}</p>
                    <p>Winner: {winner ? winner : 'Not decided yet'}</p>
                </div>
            )}

            <h2>Game Board</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: '5px' }}>
                {[...Array(9).keys()].map(index => (
                    <div key={index}>{renderCell(index)}</div>
                ))}
            </div>
        </div>
    );
};

export default TicTacToeGame;
