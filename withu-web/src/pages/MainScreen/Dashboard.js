import React from "react";
import { Grid } from "@mantine/core";
import Sidebar from "../../components/Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import AllSOS from "../AllSOS";
import Statistics from "../Statistics";

const Dashboard = () => {
  return (
    <div>
      <Grid>
        <Grid.Col span={3}>
          <Sidebar />
        </Grid.Col>
        <Grid.Col span={9} p={40}>
          <Routes>
            <Route path="/" element={<Navigate to="/sos" />} />
            <Route path="/sos" element={<AllSOS />} />
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default Dashboard;
