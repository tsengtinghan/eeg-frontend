"use client";

import { useEffect, useRef } from "react";

interface YtPlayerProps {
  isPlaying: boolean;
}

const YtPlayer = ({ isPlaying }: YtPlayerProps) => {
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Initialize YouTube player
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("player", {
        videoId: "J7DzL2_Na80",
        events: {
          onReady: onPlayerReady,
        },
      });
    };

    function onPlayerReady(event) {
      if (isPlaying) {
        event.target.playVideo();
      } else {
        event.target.pauseVideo();
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);

  return (
    <div>
      <div id="player" />
    </div>
  );
};

export default YtPlayer;
