import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge, IconButton } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";

import { useFetchUncheckedNotificationCount } from "../api/getUncheckedNotificationCount";

type Props = React.ComponentProps<typeof IconButton>;

/**
 * お知らせ通知バッジコンポーネント
 */
export const NotificationBadge: React.FC<Props> = React.memo(({ ...props }) => {
  const data = useFetchUncheckedNotificationCount();
  const navigate = useNavigate();

  return (
    <IconButton
      size="large"
      aria-label="お知らせ"
      onClick={() => navigate("notifications")}
      color="inherit"
      {...props}
    >
      <Badge badgeContent={data?.count || 0} color="primary">
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
});
