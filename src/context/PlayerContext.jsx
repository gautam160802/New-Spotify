import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

// Create Context
export const PlayerContext = createContext();

// Context Provider Component
const PlayerContextProvider = ({ children }) => {
  const audioRef = useRef(new Audio(songsData[2].src)); // Initialize audio element
  const seekBg = useRef();
  const seekBar = useRef();

  const [track, setTrack] = useState(songsData[2]);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
  });

  // Play and Pause Functions
  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  const playWithId = (id) => {
    setTrack(songsData[id]);
  };

  const previous = () => {
    if (track && track.id > 0) {
      setTrack(songsData[track.id - 1]);
    }
  };

  const next = () => {
    if (track && track.id < songsData.length - 1) {
      setTrack(songsData[track.id + 1]);
    }
  };

  useEffect(() => {
    if (playStatus) {
      audioRef.current.play();
    }
  }, [track]); // Auto-play when track changes

  const seekSong = (e) => {
    audioRef.current.currentTime =
      (e.nativeEvent.offsetX / seekBg.current.offsetWidth) *
      audioRef.current.duration;
  };

  // Listen for song time updates
  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => {
      if (!audio.duration) return;
      setTime({
        currentTime: {
          second: Math.floor(audio.currentTime % 60),
          minute: Math.floor(audio.currentTime / 60),
        },
        totalTime: {
          second: Math.floor(audio.duration % 60),
          minute: Math.floor(audio.duration / 60),
        },
      });

      // Update Seek Bar Width
      if (seekBar.current) {
        seekBar.current.style.width = `${
          (audio.currentTime / audio.duration) * 100
        }%`;
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
    };
  }, []);

  const contextValue = {
    audioRef,
    seekBg,
    seekBar,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
