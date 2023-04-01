// import React, { useState, useCallback, useRef } from "react";
// import { Button, View, Alert } from "react-native";
// import YoutubePlayer from "react-native-youtube-iframe";

// export default function App() {
//   const [playing, setPlaying] = useState(false);

//   const onStateChange = useCallback((state) => {
//     if (state === "ended") {
//       setPlaying(false);
//       Alert.alert("video has finished playing!");
//     }
//   }, []);

//   const togglePlaying = useCallback(() => {
//     setPlaying((prev) => !prev);
//   }, []);

//   return (
//     <View style={{ flex: 1 }}>
//       <YoutubePlayer
//         height={300}
//         play={playing}
//         videoId={"oyi79f9axRw"}
//         onChangeState={onStateChange}
//       />
//       <YoutubePlayer
//         height={300}
//         play={playing}
//         videoId={"oyi79f9axRw"}
//         onChangeState={onStateChange}
//       />
//     </View>
//   );
// }
import React, { useState, useCallback, useRef } from "react";
import { Button, View, Alert, ScrollView } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

export default function App() {
  const [playing, setPlaying] = useState(false);
  const playerRefs = useRef([]);

  const onStateChange = useCallback((state, index) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert(`Video ${index + 1} has finished playing!`);
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  const onScroll = useCallback(() => {
    playerRefs.current.forEach((player, index) => {
      if (player && player.root) {
        player.getDuration().then(() => {
          const viewRef = player.root;
          viewRef.measure((x, y, width, height, pageX, pageY) => {
            if (pageY < window.innerHeight && pageY + height > 0) {
              player.playVideo();
            } else {
              player.pauseVideo();
            }
          });
        });
      }
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView onScroll={onScroll} scrollEventThrottle={16}>
        <YoutubePlayer
          height={300}
          play={playing}
          videoId={"oyi79f9axRw"}
          onChangeState={(state) => onStateChange(state, 0)}
          ref={(player) => (playerRefs.current[0] = player)}
        />
        <YoutubePlayer
          height={300}
          play={playing}
          videoId={"oyi79f9axRw"}
          onChangeState={(state) => onStateChange(state, 1)}
          ref={(player) => (playerRefs.current[1] = player)}
        />
        <YoutubePlayer
          height={300}
          play={playing}
          videoId={"oyi79f9axRw"}
          onChangeState={(state) => onStateChange(state, 1)}
          ref={(player) => (playerRefs.current[1] = player)}
        />
        <YoutubePlayer
          height={300}
          play={playing}
          videoId={"oyi79f9axRw"}
          onChangeState={(state) => onStateChange(state, 1)}
          ref={(player) => (playerRefs.current[1] = player)}
        />
        <YoutubePlayer
          height={300}
          play={playing}
          videoId={"oyi79f9axRw"}
          onChangeState={(state) => onStateChange(state, 1)}
          ref={(player) => (playerRefs.current[1] = player)}
        />
      </ScrollView>
    </View>
  );
}
