import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Modal,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import React, { useEffect, useState } from "react";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SERVER_URL } from "../../config";

import CommonStyles from "../../CommonStyles";

const MyStories = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [story, setStory] = useState({
    title: "",
    description: "",
    user_id: "",
  });

  const handleSubmit = async () => {
    const User = await JSON.parse(await AsyncStorage.getItem("user"));
    const newStory = {
      title: story.title,
      description: story.description,
      user_id: User.user_id,
    };
    try {
      axios.post(`${SERVER_URL}/api/register/story`, newStory);
      setData([...data, newStory]);
      Alert.alert("Story Added Successfully");
      setModalVisible(false);
    } catch (error) {
      Alert.alert(error);
    }
  };

  const GetMyStories = async () => {
    const User = await JSON.parse(await AsyncStorage.getItem("user"));
    try {
      const { data } = await axios.get(
        `${SERVER_URL}/api/story/${User.user_id}`
      );
      setData(data);
    } catch (error) {
      Alert.alert(error);
    }
  };

  const DeleteCommunity = async (id) => {
    try {
      await axios.delete(`${SERVER_URL}/api/story/${id}`);
      Alert.alert("Story Deleted Successfully");
      GetMyStories();
    } catch (error) {
      Alert.alert(error);
    }
  };

  useEffect(() => {
    GetMyStories();
  }, [story]);

  const keyboardVerticalOffset = Platform.OS === "ios" ? 40 : 0;

  return (
    <>
      <TouchableOpacity
        style={{ ...CommonStyles.actionButton, zIndex: 1 }}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesomeIcon name="plus" size={30} color="#fff" />
      </TouchableOpacity>
      <View>
        {data.length === 0 && (
          <View style={{ marginTop: 100 }}>
            <Text
              style={{
                ...CommonStyles.medium,
                textAlign: "center",
                fontSize: 20,
                color: "gray",
              }}
            >
              No Stories Found
            </Text>
          </View>
        )}
        <FlatList
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={GetMyStories} />
          }
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          style={{ padding: 30 }}
          data={data}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  ...CommonStyles.card,
                  minHeight: 300,
                }}
              >
                <View style={CommonStyles.cardRow}>
                  <View>
                    <Text style={CommonStyles.title}>{item.title}</Text>
                    <Text style={CommonStyles.silentText}>
                      {item.description}
                    </Text>
                  </View>
                </View>
                <View style={CommonStyles.divider}></View>
                <Text
                  style={{
                    ...CommonStyles.silentText,
                    marginTop: 20,
                    fontWeight: "bold",
                  }}
                >
                  Posted By : You
                </Text>
                {
                  (User = "SSSSSS" && (
                    <View>
                      <TouchableOpacity
                        style={{
                          ...CommonStyles.outlineRedBtn,
                          width: "100%",
                          marginTop: 15,
                        }}
                        onPress={() => DeleteCommunity(item._id)}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            color: "red",
                          }}
                        >
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))
                }
              </View>
            );
          }}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              backgroundColor: "#00000080",
              alignItems: "center",
            }}
          >
            <KeyboardAvoidingView
              behavior="position"
              keyboardVerticalOffset={keyboardVerticalOffset}
              style={{ width: "85%" }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 20,
                  width: "100%",
                  borderRadius: 20,
                  elevation: 5,
                  shadowColor: "#c6c6c678",
                  marginVertical: 5,
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: "#fff",
                    width: "100%",
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    Share your Story
                  </Text>
                  <TouchableOpacity
                    style={{ padding: 15, paddingTop: 0 }}
                    onPress={() => setModalVisible(false)}
                  >
                    <FontAwesomeIcon name="close" size={30} color="#000" />
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={{ ...CommonStyles.inputTitle }}>Title</Text>
                  <TextInput
                    style={{ ...CommonStyles.input, marginTop: 10 }}
                    placeholder="Enter Title"
                    onChangeText={(value) =>
                      setStory({ ...story, title: value })
                    }
                  />

                  <Text style={{ ...CommonStyles.inputTitle, marginTop: 30 }}>
                    Description
                  </Text>
                  <TextInput
                    multiline={true}
                    style={{
                      ...CommonStyles.input,
                      marginTop: 10,
                      minHeight: 100,
                      maxHeight: 200,
                    }}
                    placeholder="Enter Description"
                    onChangeText={(value) =>
                      setStory({ ...story, description: value })
                    }
                  />
                </View>
                <TouchableOpacity
                  style={{
                    ...CommonStyles.blueBtn,
                    alignItems: "center",
                    marginTop: 30,
                  }}
                  onPress={handleSubmit}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "#fff",
                      padding: 2,
                      fontSize: 18,
                    }}
                  >
                    Share
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default MyStories;

const styles = StyleSheet.create({});
