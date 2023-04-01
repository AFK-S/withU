import { useState } from "react";
import {
  createStyles,
  Navbar,
  Group,
  Text,
  Code,
  getStylesRef,
  rem,
  Title,
} from "@mantine/core";
import {
  IconChartInfographic,
  IconSos,
  IconSettings,
  IconUserCircle,
  IconLogout,
} from "@tabler/icons-react";
import { NavLink } from "react-router-dom";
import LightDark from "../pages/MainScreen/LightDark";
import { useCookies } from "react-cookie";

const useStyles = createStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,

      [`& .${getStylesRef("icon")}`]: {
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },
  },

  linkIcon: {
    ref: getStylesRef("icon"),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
      [`& .${getStylesRef("icon")}`]: {
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
      },
    },
  },
}));

const data = [
  { link: "/sos", label: "SOS", icon: IconSos },
  // { link: "/statistics", label: "Statistics", icon: IconChartInfographic },
  // { link: "/profile", label: "Profile", icon: IconUserCircle },
  // { link: "/we", label: "Other Settings", icon: IconSettings },
];

const Sidebar = ({ setIsLogin }) => {
  const { classes, cx } = useStyles();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const links = data.map((item, index) => (
    <NavLink
      key={index}
      style={{ marginTop: "1rem" }}
      to={item.link}
      className={cx(classes.link, ({ isActive }) => (isActive ? "active" : ""))}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </NavLink>
  ));

  return (
    <Navbar p="md" styles={{ minHeight: "100vh" }} className="sidebar">
      <Navbar.Section grow>
        <Group className={classes.header} position="apart">
          <Title order={2}>withU</Title>
          <LightDark />
        </Group>
        {links}
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        {" "}
        <a
          href="#"
          className={classes.link}
          onClick={(event) => {
            event.preventDefault();
            removeCookie("user_id");
            setIsLogin(false);
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </Navbar.Section>
    </Navbar>
  );
};

export default Sidebar;
