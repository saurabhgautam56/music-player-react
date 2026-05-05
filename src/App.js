import React, { useRef, useState, useEffect } from "react";
import Player from "./components/Player";
import Playlist from "./components/Playlist";
import { songs } from "./data/songs";
import "./styles/style.css";

function App() {
  const audioRef = useRef(null);

  const [currentId, setCurrentId] = useState(songs[0]?.src);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState("off");
  const [isExpanded, setIsExpanded] = useState(false);

  // TIME DURATION
  const [time, setTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [search, setSearch] = useState("");
  
  // 
  const filteredSongs = songs.filter((s) =>
    (s.title + s.artist).toLowerCase().includes(search.toLowerCase())
  );

  const song = songs.find((s) => s.src === currentId);

  // CURRENT INDEX
  const currentIndex = filteredSongs.findIndex(
    (s) => s.src === currentId
  );

  // FORMAT TIME
  const format = (t) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // ▶ PLAY / PAUSE
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  // ⏭ NEXT
  const next = () => {
    if (filteredSongs.length === 0) return;

    const nextIndex = shuffle
      ? Math.floor(Math.random() * filteredSongs.length)
      : (currentIndex + 1) % filteredSongs.length;

    setCurrentId(filteredSongs[nextIndex].src);
  };

  // ⏮ PREV
  const prev = () => {
    if (filteredSongs.length === 0) return;

    const prevIndex =
      (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;

    setCurrentId(filteredSongs[prevIndex].src);
  };

  // 🎵 LOAD SONG
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song) return;

    audio.load();

    if (isPlaying) {
      audio.play();
    }
  }, [song]);

  // ⏱ TIME UPDATE
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => {
      if (!audio.duration) return;

      const currentTime = audio.currentTime;
      const total = audio.duration;

      setProgress((currentTime / total) * 100);
      setTime(format(currentTime));
      setDuration(format(total));
    };

    audio.addEventListener("timeupdate", update);
    return () => audio.removeEventListener("timeupdate", update);
  }, []);

  // SONG END
  const handleEnded = () => {
    if (repeat === "one") {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      next();
    }
  };

  // ROTATE COVER
  useEffect(() => {
    const player = document.querySelector(".music-player");
    if (!player) return;

    if (isPlaying) {
      player.classList.add("playing");
    } else {
      player.classList.remove("playing");
    }
  }, [isPlaying]);

  // KEYWORD
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName.toLowerCase();

      // ❌ Ignore typing inside input/textarea
      if (tag === "input" || tag === "textarea") return;

      const audio = audioRef.current;
      if (!audio) return;

      switch (e.code) {

        // ▶ PLAY / PAUSE
        case "Space":
          e.preventDefault();
          togglePlay();
          break;

        // ⏭ NEXT
        case "ArrowRight":
          next();
          break;

        // ⏮ PREV
        case "ArrowLeft":
          prev();
          break;

        // 🔊 VOLUME UP
        case "ArrowUp":
          e.preventDefault();
          setVolume((prev) => {
            const v = Math.min(prev + 0.1, 1);
            audio.volume = v;
            return v;
          });
          break;

        // 🔉 VOLUME DOWN
        case "ArrowDown":
          e.preventDefault();
          setVolume((prev) => {
            const v = Math.max(prev - 0.1, 0);
            audio.volume = v;
            return v;
          });
          break;

        // 🔇 MUTE / UNMUTE
        case "KeyM":
          setVolume((prev) => {
            const v = prev > 0 ? 0 : 1;
            audio.volume = v;
            return v;
          });
          break;

        // 🔀 SHUFFLE
        case "KeyS":
          setShuffle((prev) => !prev);
          break;

        // 🔁 REPEAT MODE
        case "KeyR":
          setRepeat((prev) => {
            if (prev === "off") return "one";
            if (prev === "one") return "all";
            return "off";
          });
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [togglePlay, next, prev]);

  // NO SONG CASE
  if (!song) {
    return <h2 style={{ padding: 20 }}>No songs found 🎵</h2>;
  }

  return (
    <div className="app">
      {/* AUDIO */}
      <audio
        ref={audioRef}
        src={song.src}
        onEnded={handleEnded}
      />

      {/* LAYOUT */}
      <div className="app-container">

        <Player
          song={song}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          next={next}
          prev={prev}
          progress={progress}
          setProgress={(val) => {
            const audio = audioRef.current;
            if (!audio || !audio.duration) return;

            const value = Number(val);
            audio.currentTime = (value / 100) * audio.duration;
          }}
          currentTime={time}
          duration={duration}
          volume={volume}
          setVolume={(v) => {
            const value = Number(v);
            setVolume(value);
            if (audioRef.current) {
              audioRef.current.volume = value;
            }
          }}
          shuffle={shuffle}
          setShuffle={setShuffle}
          repeat={repeat}
          setRepeat={setRepeat}

          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />

        <Playlist
          songs={filteredSongs}
          currentId={currentId}
          setCurrentId={setCurrentId}
          search={search}
          setSearch={setSearch}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
        />

      </div>
    </div>
  );
}

export default App;