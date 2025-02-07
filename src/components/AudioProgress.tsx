import React, { useEffect, useState } from "react";
import PlayIcon from "../icons/Play";
import PauseIcon from "../icons/Pause";

interface AudioProgressProps {
  audioUrl: string;
  small?: boolean;
}

const AudioProgress: React.FC<AudioProgressProps> = ({
  audioUrl,
  small = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const handleLoadedMetadata = () => {
        if (!isNaN(audio.duration)) {
          setDuration(audio.duration);
        }
      };

      const handleTimeUpdate = () => {
        if (
          !isNaN(audio.currentTime) &&
          !isNaN(audio.duration) &&
          audio.duration > 0
        ) {
          setCurrentTime(audio.currentTime);
          const progressValue = (audio.currentTime / audio.duration) * 100;
          setProgress(progressValue);
        }
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
      };

      // Try to set duration immediately if already loaded
      if (!isNaN(audio.duration)) {
        setDuration(audio.duration);
      }

      // Add event listeners
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("durationchange", handleLoadedMetadata);

      // Cleanup
      return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("durationchange", handleLoadedMetadata);
      };
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Ensure audio is loaded before playing
        audioRef.current.load();
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Playback failed:", error);
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (timeInSeconds: number | null) => {
    if (timeInSeconds === null || isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`flex items-center space-x-2 ${small ? "w-32" : "w-48"}`}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <button
        onClick={togglePlay}
        className={`p-2 rounded-full hover:bg-accent-100 
                    ${small ? "text-gray-600" : "text-accent-900"}`}
      >
        {isPlaying ? (
          <PauseIcon width={small ? 16 : 24} height={small ? 16 : 24} />
        ) : (
          <PlayIcon width={small ? 16 : 24} height={small ? 16 : 24} />
        )}
      </button>
      <div className="flex-1">
        <div className="relative w-full h-1 bg-gray-200 rounded">
          <div
            className="absolute top-0 left-0 h-full bg-accent-900 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {duration === null
            ? "Loading..."
            : `${formatTime(currentTime)} / ${formatTime(duration)}`}
        </div>
      </div>
    </div>
  );
};

export default AudioProgress;
