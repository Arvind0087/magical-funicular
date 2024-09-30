import React, { useRef, useMemo } from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import "./style.css";

function VideoPlayer({ src, videoProvider }) {
  const playerRef = useRef(null);
  const renderVideo = useMemo(() => (
    <div
      style={{
        width: "100%",
        // height: "70vh !important",
        // position: "relative !imporatnt",
        // top: "20% !important",
      }}
    >
      <Plyr
        options={{
          controls: [
            "play-large",
            "play",
            "rewind",
            "fast-forward",
            "progress",
            "current-time",
            "mute",
            "volume",
            "captions",
            "settings",
            "fullscreen",
          ],
          autoplay: false,
        }}
        ref={playerRef}
        source={{
          type: "video",
          sources: [
            {
              src: src,
              provider: videoProvider === "html5" ? "html5" : "youtube",
            },
          ],
        }}
      />
    </div>
  ));

  return <div>{renderVideo}</div>;
}

export default VideoPlayer;
