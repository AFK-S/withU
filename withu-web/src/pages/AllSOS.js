import React, { useState, useEffect } from "react";
import { Card, Text, Badge, Group, Grid, Button } from "@mantine/core";
import { IconShield } from "@tabler/icons-react";
import io from "socket.io-client";
import { useCookies } from "react-cookie";
import AlertModal from "../components/AlertModal";

const AllSOS = () => {
  const [cookies] = useCookies(["user_id"]);
  const [socket] = useState(
    io("http://172.20.10.3:8000", {
      transports: ["websocket"],
    })
  );
  const [sosList, setSosList] = useState([]);

  useEffect(() => {
    socket.on("connect", async () => {
      console.log("connected");
      socket.emit("Get_SOS_Officials", cookies.user_id);
    });
    socket.on("Pass_Officials_SOS_Details", (data) => {
      setSosList(data);
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

  const GetDirection = (user_id, sos_id) => {
    if (!socket.connected) {
      return alert("Please Connect to Internet");
    }
    socket.emit("SOS_Accepted_Officials", cookies.user_id, sos_id);
    socket.emit("Get_SOS_Location", user_id, async (data) => {
      if (data.err) {
        return alert(data.msg);
      }
      const url = `https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}&travelmode=walking`;
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
                    onClick={() => GetDirection(item.user._id, item._id)}
                  >
                    Get Location
                  </Button>
                  <AlertModal socket={socket} sos_id={item._id} />
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
