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
    <Container size={500} my={200}>
      <Paper radius="md" p="xl" withBorder>
        <Text size="lg" weight={600} align="center">
          Welcome to withU
        </Text>

        <form onSubmit={form.onSubmit((val) => console.log(val))}>
          <Stack>
            <TextInput
              required
              label="User Name"
              placeholder="Usernmame here"
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

          <Group position="apart" mt="xl">
            <NavLink to="/register">
              <Anchor component="button" type="button" color="dimmed" size="xs">
                Don't have an account? Register
              </Anchor>
            </NavLink>
            <Button type="submit" radius="xl" color={"pink"}>
              Login
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}

export default Login;
