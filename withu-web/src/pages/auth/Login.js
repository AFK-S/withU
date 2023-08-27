import { useToggle, upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Paper,
  Group,
  Button,
  Title,
  Anchor,
  Stack,
  Container,
} from "@mantine/core";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { SERVER_URL } from "../../config.js";

export function Login({ setIsLogin }) {
  const [cookies, setCookie] = useCookies(["user_id"]);
  const form = useForm({
    initialValues: {
      name: "",
      password: "",
    },
    validate: {
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  return (
    <div
      style={{
        backgroundColor: "#e5e5e5",
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
      }}
    >
      <Container size={500} my={200} radius="xl">
        <Title
          align="center"
          mb={30}
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 800,
          })}
        >
          Login into withU Admin
        </Title>
        <Paper radius="md" p="xl" withBorder>
          <form
            onSubmit={form.onSubmit(async (val) => {
              try {
                const { data } = await axios.put(
                  `${SERVER_URL}/api/police/login`,
                  val
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
            <Stack>
              <TextInput
                my={10}
                required
                label="Username"
                placeholder="Username here"
                value={form.values.name}
                onChange={(event) =>
                  form.setFieldValue("name", event.currentTarget.value)
                }
                error={form.errors.name && "Invalid userName"}
                radius="md"
              />

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={form.values.password}
                onChange={(event) =>
                  form.setFieldValue("password", event.currentTarget.value)
                }
                error={
                  form.errors.password &&
                  "Password should include at least 8 characters"
                }
                radius="md"
              />
            </Stack>

            <Group position="apart" mt={30}>
              <Button type="submit" radius="md" fullWidth color={"pink"}>
                Login
              </Button>
              <NavLink to="/register">
                <Anchor
                  component="button"
                  type="button"
                  color="dimmed"
                  size="xs"
                  align="center"
                  fullWidth
                >
                  Don't have an account? Register
                </Anchor>
              </NavLink>
            </Group>
          </form>
        </Paper>
      </Container>
    </div>
  );
}

export default Login;
