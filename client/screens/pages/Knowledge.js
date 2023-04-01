import React, { useState, useCallback, useRef } from "react";
import { Button, View, Alert, ScrollView, Text } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { Colors } from "react-native/Libraries/NewAppScreen";

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
  const data = [
    {
      title: "Women Rights",
      videoId: "mql39VqUV5g",
    },
    {
      title: "Emma Watson UN Speech",
      videoId: "gkjW9PZBRfk",
    },
    {
      title: "Like a Girl",
      videoId: "dxrPeFKtUwQ",
    },
    {
      title: "Self-Defense Moves for Women  ",
      videoId: "KVpxP3ZZtAc",
    },
    {
      title: "Muslim Girls Fence - This Girl Can",
      videoId: "XJ5Kez290og",
    },
    {
      title: "Commando Girls Defence Training",
      videoId: "SfAoGd8R-CM",
    },
    {
      title: "Female Martial Arts",
      videoId: "DSa7wufvzjw",
    },
  ];

  return (
    <View style={{ flex: 1, alignItems: "center", marginTop: 20 }}>
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 100 }}
      >
        {data.map((item, index) => {
          return (
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                marginBottom: 20,
                borderRadius: 15,
                elevation: 5,
                shadowColor: "#c6c6c678",
                marginVertical: 5,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
              }}
            >
              <View>
                <Text
                  style={{
                    color: "black",
                    alignItems: "center",
                    fontFamily: "Poppins-Bold",
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 20,
                  }}
                >
                  {item.title}
                </Text>
                <YoutubePlayer
                  height={180}
                  width={300}
                  play={playing}
                  videoId={item.videoId}
                  style={{ borderRadius: 40 }}
                  onChangeState={(state) => onStateChange(state, 0)}
                  ref={(player) => (playerRefs.current[0] = player)}
                />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
