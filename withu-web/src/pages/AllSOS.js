import React, { useState, useEffect } from "react";
import {
  Card,
  Avatar,
  Text,
  Progress,
  Badge,
  Group,
  ActionIcon,
  Grid,
  Button,
} from "@mantine/core";
import { IconShield } from "@tabler/icons-react";
import io from "socket.io-client";
import { useCookies } from "react-cookie";

import AlertModal from "../components/AlertModal";
const AllSOS = () => {
  const [cookies] = useCookies(["user_id"]);
  const socket = io("https://withU.adityarai16.repl.co", {
    transports: ["websocket"],
  });

  const [sosList, setSosList] = useState([]);
  const [acceptedList, setAcceptedList] = useState([]);
  const [location, setLocation] = useState([]);

  useEffect(() => {
    socket.on("connect", async () => {
      console.log("connected");
      socket.emit("Get_SOS_Officials", cookies.user_id);
    });
  }, []);
  socket.on("Refetch_SOS_Details", () => {
    socket.emit("Get_SOS_details", cookies.user_id);
  });

  socket.on("Pass_Officials_SOS_Details", (data) => {
    setSosList(data);
  });

  socket.on("connect_error", (err) => {
    console.log(err);
  });

  const GetDirection = (user_id, sos_user_id) => {
    if (!socket.connected) {
      alert("Please Connect to Internet");
      return;
    }
    socket.emit("SOS_Accepted_Officials", cookies.user_id, sos_user_id);
    socket.emit("Get_SOS_Location", user_id, async (location) => {
      setLocation(location);
      console.log(location);
      const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}&travelmode=walking`;
      window.open(url, "_blank");
    });
  };
  return (
    <div>
      <Grid gutterXl={30}>
        {sosList.map((item) => {
          const { name, phone_number } = item.user;

          return (
            <Grid.Col span={4}>
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
                <Text c="dimmed" fz="sm" mt="md">
                  Location: {item.coordinates.latitude},
                  {item.coordinates.longitude}
                </Text>
                <Group mt={15} spacing="xl" grow>
                  <Button
                    size={"xs"}
                    variant="outline"
                    onClick={() => GetDirection(item.user._id, item.owner_id)}
                  >
                    Get Location
                  </Button>
                  <AlertModal socket={socket} owner_id={item.owner_id} />
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
