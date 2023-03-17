import { useDisclosure } from "@mantine/hooks";
import { Modal, Group, Button, Text, Table } from "@mantine/core";

import React from "react";

function AlertModal() {
  const [opened, { open, close }] = useDisclosure(false);
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
          <tr key={data.name}>
            <td>{data.phone}</td>
          </tr>;
          return (
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                </tr>
              </thead>
            </Table>
            // <div>
            //   <Text fz={"sm"}>Name : {name}</Text>
            //   <Text fz={"sm"}>Phone : {phone}</Text>
            //   <hr></hr>
            // </div>
          );
        })}
      </Modal>

      <Group position="center">
        <Button onClick={open} color={"pink"} size={"xs"}>
          Accepted Users
        </Button>
      </Group>
    </div>
  );
}

export default AlertModal;
