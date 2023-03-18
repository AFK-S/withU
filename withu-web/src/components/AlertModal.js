import { useDisclosure } from "@mantine/hooks";
import { Modal, Group, Button, Text, Table } from "@mantine/core";

import React, { useState } from "react";

function AlertModal({ socket, owner_id }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [acceptedList, setAcceptedList] = useState([]);
  const [policeList, setPoliceList] = useState([]);

  return (
    <div>
      <Modal opened={opened} onClose={close} centered radius={"lg"}>
        <Text align="center" fz="lg" fw={700} mb={20}>
          ACCEPTED USERS
        </Text>
        {acceptedList.map((item) => {
          const { name, phone_number } = item;
          <tr>
            <td>{acceptedList.name}</td>
            <td>{acceptedList.phone}</td>
          </tr>;

          return (
            <div>
              <Text fz={"sm"}>Name : {name}</Text>
              <Text fz={"sm"}>Phone Number: {phone_number}</Text>
              <hr></hr>
            </div>
          );
        })}
        {/* {policeList.map((item) => {
          const { branch_name } = item;
          <tr>
            <td>{policeList.branch_name}</td>
          </tr>;
          return (
            <div>
              <Text fz={"sm"}>Branch Name : {branch_name}</Text>
              <hr></hr>
            </div>
          );
        })} */}
      </Modal>
      <Group position="center">
        <Button
          onClick={() => {
            socket.emit("Get_SOS_Accepted_List", owner_id, (data, data1) => {
              setAcceptedList(data);
              // console.log(data1);
              // setPoliceList(data1);
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
