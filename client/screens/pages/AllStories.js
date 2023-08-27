import { View, Text, FlatList, RefreshControl, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { SERVER_URL } from "../../config";
import CommonStyles from "../../CommonStyles";
import Loading from "./Loading";

const AllStories = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const GetAllStories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${SERVER_URL}/api/story`);
      setData(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    GetAllStories();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
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
          <RefreshControl refreshing={loading} onRefresh={GetAllStories} />
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
                minHeight: 200,
              }}
            >
              <View style={CommonStyles.cardRow}>
                <View>
                  <Text style={CommonStyles.title}>{item.title}</Text>
                  <View>
                    <Text style={CommonStyles.silentText}>
                      {item.description}
                    </Text>
                  </View>
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
                Posted By : {item.user.email_address}
              </Text>
            </View>
          );
        }}
      />
    </>
  );
};

export default AllStories;
