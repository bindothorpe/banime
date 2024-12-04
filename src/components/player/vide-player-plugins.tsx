import artplayerPluginHlsControl from "artplayer-plugin-hls-control";

interface Level {
    height: number;
  }
  
  interface Track {
    name: string;
  }

  
export function HlsPlayerPlugin() {

    return (
        artplayerPluginHlsControl({
            quality: {
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
    )
}
