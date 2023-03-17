import React from "react";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { NavLink } from "react-router-dom";

const Register = () => {
  const form = useForm({
    initialValues: { branch: "", password: "" },
    validate: {
      branch: (value) => (value.length < 3 ? "Enter valid branch" : null),
      password: (value) =>
        value.length < 8 ? "Enter valid password (min length : 8)" : null,
    },
  });
  return (
    <div
      className="conatiner"
      style={{
        backgroundColor: "#e5e5e5",
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
      }}
    >
      <Container size={520} my={40}>
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 800,
          })}
        >
          Register A Police Station
        </Title>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(console.log)}>
            <TextInput
              label="Branch Name"
              placeholder="Branch Name"
              {...form.getInputProps("branch")}
              radius="md"
            />
            <PasswordInput
              label="Password"
              placeholder="Password"
              {...form.getInputProps("password")}
              radius="md"
              mt={15}
            />
            <Button type="submit" fullWidth mt="xl" radius="md" color={"pink"}>
              Register
            </Button>
          </form>
          <Text color="dimmed" size="sm" align="center" mt={15}>
            Back to {``}
            <NavLink to="/">
              <Anchor size="sm" component="button">
                Login
              </Anchor>
            </NavLink>
          </Text>
        </Paper>
      </Container>
    </div>
  );
};

export default Register;
