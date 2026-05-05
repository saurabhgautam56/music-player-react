import React, { useRef, useLayoutEffect, useState, useEffect } from "react";

function Playlist({
  songs,
  currentId,
  setCurrentId,
  search,
  setSearch,
  isPlaying,
  togglePlay
}) {
  const itemRefs = useRef([]);

  // DETECT MOBILE
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const userClickedRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isInView = (el, container) => {
    if (!el || !container) return false;

    const elRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    return (
      elRect.top >= containerRect.top &&
      elRect.bottom <= containerRect.bottom
    );
  };

const containerRef = useRef(null);

  useLayoutEffect(() => {
    const index = songs.findIndex((s) => s.src === currentId);
    const el = itemRefs.current[index];
    const container = containerRef.current;

    if (!el || !container) return;

    const visible = isInView(el, container);

    // 💻 DESKTOP
    if (!isMobile) {
      if (!visible) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
      return;
    }

    // 📱 MOBILE → only user click + not visible
    if (userClickedRef.current && !visible) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      el.classList.add("flash");

      setTimeout(() => {
        el.classList.remove("flash");
      }, 800);

      userClickedRef.current = false;
    }

  }, [currentId, songs, isMobile]);

  // 🔍 HIGHLIGHT SEARCH TEXT
  const highlightText = (text, query) => {
    if (!query) return text;

    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");

    return text.split(regex).map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="highlight">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="playlist">

      <div className="playlist-header">

        <h3>Playlist</h3>

        <div className="search-box">
          <i className="fas fa-search search-icon"></i>

          <input
            type="text"
            placeholder="Search songs..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>

      </div>

      {/* 🔹 SONG LIST */}
      <div className="song-container" ref={containerRef}>

        {songs.length > 0 ? (
          <ul>

            {songs.map((s, i) => (
              <li
                key={s.src}
                ref={(el) => (itemRefs.current[i] = el)}
                className={`song-item ${s.src === currentId ? "active" : ""}`}
                onClick={() => {
                  userClickedRef.current = true; // 👈 mark user action
                  setCurrentId(s.src);
                }}
              >

                {/* 🎵 COVER */}
                <div className="cover-wrapper">
                  <img src={s.cover} alt={s.title} />

                  {/* ▶ OVERLAY */}
                  <div
                    className="play-overlay"
                    onClick={(e) => {
                      e.stopPropagation();

                      userClickedRef.current = true; 

                      if (s.src === currentId) {
                        togglePlay(); 
                      } else {
                        setCurrentId(s.src); 
                      }
                    }}
                  >
                    <i
                      className={`fas ${
                        s.src === currentId && isPlaying
                          ? "fa-pause"
                          : "fa-play"
                      }`}
                    ></i>
                  </div>
                </div>

                <div className="song-text">
                  <div className="song-title">
                    {highlightText(s.title, search)}
                  </div>
                  <div className="song-artist">
                    {highlightText(s.artist, search)}
                  </div>
                </div>

                {/* 🎧 WAVE ANIMATION */}
                {s.src === currentId && isPlaying && (
                  <div className="wave">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}

              </li>
            ))}

          </ul>
        ) : (
          <div id="empty-state">No songs found 🎵</div>
        )}

      </div>
    </div>
  );
}

export default Playlist;