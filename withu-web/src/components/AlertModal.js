import { useDisclosure } from "@mantine/hooks";
import { Modal, Group, Button, Text, Table } from "@mantine/core";

import React, { useState } from "react";

function AlertModal({ socket, owner_id }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [acceptedList, setAcceptedList] = useState([]);

  const data = [
    {
      name: "Name1",
      phone: "1234567890",
    },
    {
      name: "Name2",
      phone: "1234567890",
    },
    {
      name: "Name3",
      phone: "1234567890",
    },
  ];

  return (
    <div>
      <Modal opened={opened} onClose={close} centered radius={"lg"}>
        <Text align="center" fz="lg" fw={700} mb={20}>
          ACCEPTED USERS
        </Text>
        {data.map((item) => {
          const { name, phone } = item;
          <tr>
            <td>{data.name}</td>
            <td>{data.phone}</td>
          </tr>;

          return (
            <div>
              <Text fz={"sm"}>Name : {name}</Text>
              <Text fz={"sm"}>Phone : {phone}</Text>
              <hr></hr>
            </div>
          );
        })}
      </Modal>

      <Group position="center">
        <Button
          onClick={() => {
            socket.emit("Get_SOS_Accepted_List", owner_id, (data) => {
              console.log(data);
              setAcceptedList(data);
              open();
            });
          }}
          color={"pink"}
          size={"xs"}
        >
          Accepted Users
        </Button>
      </Group>
    </div>
  );
}

export default AlertModal;
