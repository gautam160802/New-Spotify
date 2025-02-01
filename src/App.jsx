import React, { useContext, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import Display from "./components/Display";
import { PlayerContext } from "./context/playercontext";

const App = () => {
  const { audioRef, track, playStatus } = useContext(PlayerContext);

  // Sync the audio element with the current track
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = track.file;
      if (playStatus) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [track, playStatus]); // Re-run when track or playStatus changes

  return (
    <div className="h-screen bg-black">
      <div className="h-[90%] flex">
        <Sidebar />
        <Display />
      </div>
      <Player />
      {/* Ensure audioRef is used correctly */}
      <audio ref={audioRef} preload="auto"></audio>
    </div>
  );
};

export default App;
