import { useForm } from "@mantine/form";
import { TextInput, Button, Box } from "@mantine/core";
import { PasswordInput } from "@mantine/core";

const LoginForm = () => {
  const form = useForm({
    initialValues: { name: "", password: "" },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
    },
  });

  return (
    <Box maw={320} mx="auto">
      <form onSubmit={form.onSubmit(console.log)}>
        <TextInput
          label="Branch Name"
          placeholder="Branch Name"
          {...form.getInputProps("name")}
        />
        <PasswordInput
          label="Password"
          placeholder="Password"
          {...form.getInputProps("password")}
        />
        <Button type="submit" mt="sm">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default LoginForm;
