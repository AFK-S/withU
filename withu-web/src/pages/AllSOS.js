import React from "react";
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
import AlertModal from "../components/AlertModal";
const AllSOS = () => {
  const data = [
    {
      name: "Name1",
      phone: "1234567890",
      location: "Location1",
      time: "11:00:23 AM",
    },
    {
      name: "Name2",
      phone: "1234567890",
      location: "Location1",
      time: "11:00:23 AM",
    },
    {
      name: "Name3",
      phone: "1234567890",
      location: "Location1",
      time: "11:00:23 AM",
    },
  ];
  return (
    <div>
      <Grid gutterXl={30}>
        {data.map((item) => {
          const { name, phone, location, time } = item;

          return (
            <Grid.Col span={4}>
              <Card withBorder padding="lg" radius="md">
                <Group position="apart">
                  <div className="avatar">
                    <IconShield />
                  </div>
                  <Badge color="pink" p={5}>
                    {time}
                  </Badge>
                </Group>

                <Text fz="lg" fw={500} mt="lg">
                  {name}
                </Text>
                <Text fz="sm" c="dimmed" mt={5}>
                  {phone}
                </Text>

                <Text c="dimmed" fz="sm" mt="md">
                  Location: {location}
                </Text>
                <Group mt={15} spacing="xl" grow>
                  <Button size={"xs"} variant="outline">
                    Get Location
                  </Button>
                  <AlertModal />
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
