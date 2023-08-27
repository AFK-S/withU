import { useDisclosure } from "@mantine/hooks";
import { Modal, Group, Button, Text } from "@mantine/core";
import axios from "axios";
import React, { useState } from "react";
import { SERVER_URL } from "../config";

function AlertModal({ sos_id }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [acceptedList, setAcceptedList] = useState([]);

  return (
    <div>
      <Modal opened={opened} onClose={close} centered radius={"lg"}>
        <Text align="center" fz="lg" fw={700} mb={20}>
          ACCEPTED USERS
        </Text>
        {acceptedList.map((item, index) => {
          const { name, phone_number } = item;
          <tr>
            <td>{acceptedList.name}</td>
            <td>{acceptedList.phone}</td>
          </tr>;

          return (
            <div key={index}>
              <Text fz={"sm"}>Name : {name}</Text>
              <Text fz={"sm"}>Phone Number: {phone_number}</Text>
              <hr></hr>
            </div>
          );
        })}
      </Modal>
      <Group position="center">
        <Button
          onClick={async () => {
            const { data } = await axios.get(
              `${SERVER_URL}/api/sos/accepted/${sos_id}`
            );
            setAcceptedList(data);
            open();
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
