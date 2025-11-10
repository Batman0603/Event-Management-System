import React, { useState, Suspense, lazy } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const AdminEventView = lazy(() => import("../../components/Admin/AdminEventView.jsx"));
const PendingEventsView = lazy(() => import("../../components/Admin/PendingEventsView.jsx"));
 
export default function AdminDashboard() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={tabIndex} onChange={handleTabChange} aria-label="admin dashboard tabs">
             <Tab label="All Events" />
            <Tab label="Pending Events" />
          </Tabs>
        </Box>

        {/* Tab Panel for Viewing All Events */}
        <Box hidden={tabIndex !== 0}>
          {tabIndex === 0 && (
            <Suspense fallback={<div>Loading...</div>}>
              <AdminEventView />
            </Suspense>
          )}
        </Box>

        {/* Tab Panel for Pending Events */}
        <Box hidden={tabIndex !== 1}>
          {tabIndex === 1 && (
            <Suspense fallback={<div>Loading...</div>}>
              <PendingEventsView />
            </Suspense>
          )}
        </Box>
      </Box>
    </>
  );
}