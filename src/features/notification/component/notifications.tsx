import NotificationsIcon from "@mui/icons-material/Notifications";
import { LoadingButton } from "@mui/lab";
import {
  Badge,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router";

import { getNotifications, queryKey } from "../api/getNotifications";

type Props = React.ComponentProps<typeof Box>;

/**
 * お知らせ一覧表示コンポーネント
 */
export const Notifications: React.FC<Props> = React.memo(({ ...props }) => {
  const MAX_NOTIFICATION_SIZE = 5;
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery(
      queryKey,
      ({ pageParam }) =>
        getNotifications({ size: MAX_NOTIFICATION_SIZE, nextToken: pageParam }),
      {
        getNextPageParam: ({ data }) => {
          if (data.data.nextToken === 0) return;
          if (data.data.notifications.length < MAX_NOTIFICATION_SIZE) return;
          return data.data.nextToken;
        },
      }
    );
  const navigate = useNavigate();

  return (
    <Box {...props}>
      <Box component="h1" color="primary.main">
        お知らせ一覧
      </Box>
      <List>
        {data?.pages.map((page) =>
          page.data.data.notifications.map((notification) => (
            <ListItem
              disablePadding
              key={notification.id}
              onClick={() => navigate(`/notifications/${notification.id}`)}
            >
              <ListItemButton>
                <ListItemIcon>
                  <Badge
                    color="secondary"
                    variant="dot"
                    invisible={notification.isChecked}
                  >
                    <NotificationsIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText
                  primary={notification.title}
                  secondary={notification.description}
                />
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
      {hasNextPage && (
        <Box textAlign="center">
          <LoadingButton
            style={{ width: "300px" }}
            loading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            size="large"
            sx={{ marginTop: "50px" }}
            variant="contained"
            type="submit"
            color="primary"
          >
            もっと見る
          </LoadingButton>
        </Box>
      )}
    </Box>
  );
});
