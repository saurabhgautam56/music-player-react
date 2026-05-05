import React from "react";

function Player({
  song,
  isPlaying,
  togglePlay,
  next,
  prev,
  progress,
  setProgress,
  currentTime,
  duration,
  volume,
  setVolume,
  shuffle,
  setShuffle,
  repeat,
  setRepeat,
  isExpanded,
  setIsExpanded
}) {

  const handleRepeat = () => {
    if (repeat === "off") setRepeat("one");
    else if (repeat === "one") setRepeat("all");
    else setRepeat("off");
  };

  if (!song) return null;

  return (
    <div
        className={`music-player ${isExpanded ? "expanded" : "collapsed"}`}
        onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="top-section">
        <img src={song.cover} alt={song.title} className="album-cover" />

        <h2 className="song-title">{song.title}</h2>
        <p className="song-artist">{song.artist}</p>
      </div>
      
      <div className="controls">
        <button
          className={repeat !== "off" ? "active" : ""}
          onClick={(e) => {
            e.stopPropagation();  
            handleRepeat();
          }}
        >
          <i className="fas fa-redo"></i>
        </button>

        <button onClick={(e) => { e.stopPropagation(); prev(); }}>
          <i className="fas fa-backward"></i>
        </button>

        <button onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
          <i className={isPlaying ? "fas fa-pause" : "fas fa-play"}></i>
        </button>

        <button onClick={(e) => { e.stopPropagation(); next(); }}>
          <i className="fas fa-forward"></i>
        </button>

        <button
          className={shuffle ? "active" : ""}
          onClick={(e) => {
            e.stopPropagation();
            setShuffle(!shuffle);
          }}
        >
          <i className="fas fa-random"></i>
        </button>

      </div>

      <div className="bottom-section">
        {/* PROGRESS */}
        <input
          type="range"
          className="progress-bar"
          value={progress}
          min="0"
          max="100"
          onChange={(e) => {
            e.stopPropagation();
            setProgress(e.target.value);
          }}
        />

        {/* TIME */}
        <div className="time-info">
          <span>{currentTime}</span>
          <span>{duration}</span>
        </div>

        {/* VOLUME */}
        <div className="volume-control">

          <i
            className={`fas ${
              volume === 0
                ? "fa-volume-mute"
                : volume < 0.5
                ? "fa-volume-down"
                : "fa-volume-up"
            }`}
          ></i>

          <input
            type="range"
            value={volume}
            min="0"
            max="1"
            step="0.01"
            onChange={(e) => {
              e.stopPropagation();
              setVolume(e.target.value);
            }}
          />
        </div>

      </div>

    </div>
  );
}

export default Player;