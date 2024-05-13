import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function GameList() {
    const [games, setGames] = useState([]);
    const [error, setError] = useState('');
    const history = useHistory();

    useEffect(() => {
        async function fetchGames() {
            try {
                const response = await axios.get('http://localhost:8000/game/games/');
                setGames(response.data);
            } catch (err) {
                setError('Unable to fetch game list.');
                console.error(err);
            }
        }
        fetchGames();
    }, []);

    async function createNewGame() {
        try {
            const playerXId = parseInt(localStorage.getItem('userId'), 10);

            const response = await axios.post('http://localhost:8000/game/games/', {
                player_x: playerXId,
                player_o: null,
                board_state: ' '.repeat(9),
                current_turn: 'X',
                winner: ''
            });

            // Перенаправити до нової гри
            history.push(`/game/${response.data.id}`);
        } catch (err) {
            setError('Error creating a new game.');
            console.error(err);
        }
    }

    async function joinGame(gameId) {
        try {
            const playerOId = parseInt(localStorage.getItem('userId'), 10);

            await axios.patch(`http://localhost:8000/game/games/${gameId}/`, {
                player_o: playerOId
            });

            // Перенаправити до гри
            history.push(`/game/${gameId}`);
            localStorage.setItem('gameId', gameId);
        } catch (err) {
            setError('Error joining the game.');
            console.error(err);
        }
    }

    async function deleteGame(gameId) {
        try {
            await axios.delete(`http://localhost:8000/game/games/${gameId}/`);
            setGames(games.filter(game => game.id !== gameId));
        } catch (err) {
            setError('Error deleting the game.');
            console.error(err);
        }
    }

    return (
        <div className="container mt-5">
            <h1>Games</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <ul className="list-group">
                {games.map(game => (
                    <li key={game.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>
                            Game {game.id}: {game.player_x_info.first_name}
                        </span>
                        <div>
                            {game.player_o === null ? (
                                <button onClick={() => joinGame(game.id)} className="btn btn-primary btn-sm me-2">Join Game</button>
                            ) : (
                                <button onClick={() => history.push(`/game/${game.id}`)} className="btn btn-secondary btn-sm me-2">View Game</button>
                            )}
                            <button onClick={() => deleteGame(game.id)} className="btn btn-danger btn-sm">✖</button>
                        </div>
                    </li>
                ))}
            </ul>
            <button onClick={createNewGame} className="btn btn-success mt-3">Create New Game</button>
        </div>
    );
}

export default GameList;
