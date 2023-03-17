import { useToggle, upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  Container,
} from "@mantine/core";
import { NavLink } from "react-router-dom";

export function Login() {
  const form = useForm({
    initialValues: {
      userName: "",
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
      <Container size={500} my={200}>
        <Paper radius="md" p="xl" withBorder style={{ widt: "30vw" }}>
          <Text size="xl" weight={600} align="center" my={15} px={80}>
            Welcome to withU Admin
          </Text>

          <form onSubmit={form.onSubmit((val) => console.log(val))}>
            <Stack>
              <TextInput
                my={10}
                required
                label="Username"
                placeholder="Username here"
                value={form.values.userName}
                onChange={(event) =>
                  form.setFieldValue("userName", event.currentTarget.value)
                }
                error={form.errors.userName && "Invalid userName"}
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
              <Button type="submit" radius="xl" fullWidth color={"pink"}>
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
