import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

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

    return (
        <div>
            <h1>Games</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <ul>
                {games.map(game => (
                    <li key={game.id}>
                        <span>Game {game.id}: {game.player_x_info.first_name }</span>
                        {game.player_o === null ? (
                            <button onClick={() => joinGame(game.id)}>Join Game</button>
                        ) : (
                            <button onClick={() => history.push(`/game/${game.id}`)}>View Game</button>
                        )}
                    </li>
                ))}
            </ul>
            <button onClick={createNewGame}>Create New Game</button>
        </div>
    );
}

export default GameList;
