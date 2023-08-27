import React, { useState, useEffect } from "react";
import { Card, Text, Badge, Group, Grid, Button } from "@mantine/core";
import { IconShield } from "@tabler/icons-react";
import io from "socket.io-client";
import { useCookies } from "react-cookie";
import AlertModal from "../components/AlertModal";
import axios from "axios";
import { SERVER_URL } from "../config";

const AllSOS = () => {
  const [cookies] = useCookies(["user_id"]);
  const [socket] = useState(
    io(SERVER_URL, {
      transports: ["websocket"],
    })
  );
  const [sosList, setSosList] = useState([]);
  const Fetch_SOS = async () => {
    try {
      const { data } = await axios.get(
        `${SERVER_URL}/api/${cookies.type_of_user}/sos/${cookies.user_id}`
      );
      setSosList(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on("connect", async () => {
      console.log("connected");
      Fetch_SOS();
    });
    socket.on("connect_error", (err) => {
      console.log(err);
    });
    return () => {
      socket.off("connect");
      socket.off("Pass_Officials_SOS_Details");
      socket.off("connect_error");
    };
  }, []);

  useEffect(() => {
    socket.on("Refetch_SOS_Details", () => Fetch_SOS());
    return () => {
      socket.off("Refetch_SOS_Details");
    };
  }, [socket.connected]);

  const GetDirection = async (user_id) => {
    if (!socket.connected) return alert("Please Connect to Socket");
    try {
      const { data } = await axios.get(
        `${SERVER_URL}/api/active/location/${user_id}`
      );
      const url = `https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}&travelmode=walking`;
      window.open(url, "_blank");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div>
      <Grid gutterXl={30}>
        {sosList.map((item, index) => {
          const { name, phone_number } = item.user;

          return (
            <Grid.Col span={4} key={index}>
              <Card withBorder padding="lg" radius="md">
                <Group position="apart">
                  <div className="avatar">
                    <IconShield />
                  </div>
                  <Badge color="pink" p={5}>
                    {item.createdAt}
                  </Badge>
                </Group>
                <Text fz="lg" fw={500} mt="lg">
                  {name}
                </Text>
                <Text fz="sm" c="dimmed" mt={5}>
                  {phone_number}
                </Text>
                <Text
                  c="dimmed"
                  fz="sm"
                  mt="md"
                  style={{ textTransform: "capitalize", fontWeight: "bold" }}
                >
                  Description: {item.description}
                </Text>
                <Group mt={15} spacing="xl" grow>
                  <Button
                    size={"xs"}
                    variant="outline"
                    onClick={() => GetDirection(item.user._id)}
                  >
                    Get Location
                  </Button>
                  <AlertModal sos_id={item._id} />
                </Group>
              </Card>
            </Grid.Col>
          );
        })}
      </Grid>
    </div>
  );
};

export default AllSOS;
