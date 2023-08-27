import React from "react";
import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Select,
  NumberInput,
} from "@mantine/core";
import { useEffect } from "react";
import { useForm } from "@mantine/form";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { SERVER_URL } from "../../config.js";

const Register = ({ setIsLogin }) => {
  const [cookies, setCookie] = useCookies(["user_id"]);
  const form = useForm({
    initialValues: {
      name: "",
      branch_name: "",
      password: "",
      latitude: "",
      longitude: "",
      type_of_user: "",
    },
    validate: {
      userName: (value) => (value ? "Enter valid Username" : null),
      branch: (value) => (value ? "Enter valid branch" : null),
      password: (value) =>
        value.length < 8 ? "Enter valid password (min length : 8)" : null,
      latitude: (value) => (!value ? "Enter valid latitude" : null),
      longitude: (value) => (!value ? "Enter valid latitude" : null),
    },
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      form.setFieldValue("latitude", position.coords.latitude);
      form.setFieldValue("longitude", position.coords.longitude);
    });
  }, []);

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
          Register A Administration
        </Title>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form
            onSubmit={form.onSubmit(async (values) => {
              try {
                const { data } = await axios.post(
                  `${SERVER_URL}/api/police/register`,
                  {
                    name: values.name,
                    branch_name: values.branch_name,
                    password: values.password,
                    coordinates: {
                      latitude: values.latitude,
                      longitude: values.longitude,
                    },
                    type_of_user: values.type_of_user,
                  }
                );
                setCookie("user_id", data.user_id, { path: "/" });
                setCookie("type_of_user", data.type_of_user, { path: "/" });
                form.reset();
                setIsLogin(true);
              } catch (error) {
                console.log(error.response.data);
              }
            })}
          >
            <Select
              label="Register As:"
              placeholder="Pick one"
              required
              {...form.getInputProps("type_of_user")}
              onChange={(value) => {
                form.setFieldValue("type_of_user", value);
              }}
              data={[
                { value: "police", label: "Police" },
                { value: "hospital", label: "Hospital" },
              ]}
            />
            <TextInput
              mt={15}
              label="Username"
              placeholder="Username"
              {...form.getInputProps("name")}
              radius="md"
              withAsterisk
            />
            <TextInput
              mt={15}
              label="Branch Name"
              placeholder="Branch Name"
              {...form.getInputProps("branch_name")}
              radius="md"
              withAsterisk
            />
            <PasswordInput
              label="Password"
              placeholder="Password"
              {...form.getInputProps("password")}
              radius="md"
              mt={15}
              withAsterisk
            />
            <Group mt={15}>
              <NumberInput
                disabled
                precision={8}
                placeholder="Latitude"
                label="Latitude"
                {...form.getInputProps("latitude")}
                withAsterisk
                required
              />
              <NumberInput
                disabled
                precision={8}
                placeholder="Longitude"
                label="Longitude"
                {...form.getInputProps("longitude")}
                withAsterisk
                required
              />
            </Group>
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
