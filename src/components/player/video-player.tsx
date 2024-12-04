"use client";

import React, { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";
import artplayerPluginHlsControl from "artplayer-plugin-hls-control";
import type { Option as ArtPlayerOption } from "artplayer/types/option";

interface VideoPlayerProps {
  option: Partial<ArtPlayerOption>;
  getInstance?: (art: Artplayer) => void;
  className?: string;
}

interface Level {
  height: number;
}

interface Track {
  name: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  option,
  getInstance,
  className,
}) => {
  const artRef = useRef<Artplayer>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const art = new Artplayer({
      container: containerRef.current,
      url: "",
      setting: true,
      loop: false,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      subtitleOffset: true,
      miniProgressBar: true,
      mutex: true,
      backdrop: true,
      playsInline: true,
      autoPlayback: true,
      airplay: true,
      theme: "#FAFAFA",
      plugins: [
        artplayerPluginHlsControl({
          quality: {
            control: true,
            setting: true,
            getName: (level: Level) => level.height + "P",
            title: "Quality",
            auto: "Auto",
          },
          audio: {
            control: true,
            setting: true,
            getName: (track: Track) => track.name,
            title: "Audio",
            auto: "Auto",
          },
        }),
      ],
      customType: {
        m3u8: function playM3u8(
          video: HTMLVideoElement,
          url: string,
          art: Artplayer
        ) {
          if (Hls.isSupported()) {
            if (art.hls) art.hls.destroy();
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            // @ts-ignore - Adding hls property to art instance
            art.hls = hls;
            art.on("destroy", () => hls.destroy());
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
          } else {
            art.notice.show = "Unsupported playback format: m3u8";
          }
        },
      },
      ...option,
    });

    artRef.current = art;
    getInstance?.(art);

    return () => {
      if (artRef.current) {
        artRef.current.destroy();
        artRef.current = undefined;
      }
    };
  }, [option, getInstance]);

  return <div ref={containerRef} className={className} />;
};

export default VideoPlayer;
