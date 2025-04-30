import { Box, Button } from "@mui/material";
import React from "react";

import { askNotificationPermission } from "../function/notification";
import { SideBarLayout } from "./sideBarLayout";

/**
 * 通知設定
 */
export const Notification: React.FC = React.memo(() => {
  return (
    <SideBarLayout>
      <Box component="h1" color="primary.main">
        通知
      </Box>
      <Box component="p" color="primary.light">
        通知に関する設定ができます
      </Box>
      <Box my="60px" />
      <Button variant="contained" onClick={askNotificationPermission}>
        通知を受け取る
      </Button>
    </SideBarLayout>
  );
});
