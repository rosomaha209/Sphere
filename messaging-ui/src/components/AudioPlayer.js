import React, { useState, useRef } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

function AudioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio('https://online.kissfm.ua/KissFM'));

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="audio-player" style={{ textAlign: 'center' }}>
            <button onClick={togglePlayPause} style={{ fontSize: '24px', border: 'none', background: 'none' ,color: 'white' ,position: 'absolute', top: '2px', left: '450px'}}>
                {isPlaying ? <FaPause /> : <FaPlay />}
            </button>

        </div>
    );
}

export default AudioPlayer;
