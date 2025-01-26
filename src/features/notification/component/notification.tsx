import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router";

import { getNotification, getNotificationQuery } from "../api/getNotification";

type Props = React.ComponentProps<typeof Box>;

/**
 * お知らせ詳細表示コンポーネント
 */
export const Notification: React.FC<Props> = React.memo(({ ...props }) => {
  const { notificationId } = useParams();

  const { data } = useQuery(
    [...getNotificationQuery, notificationId],
    () => getNotification(notificationId || ""),
    {
      // notificationIdが存在しない場合の400エラーを、エラー画面にする
      useErrorBoundary: true,
    }
  );

  return (
    <Box {...props}>
      <Box component="h1" color="primary.main">
        {data?.data.data.title}
      </Box>
      <Box component="p" color="primary.light">
        {data?.data.data.createdAt}
      </Box>
      <Box my="60px" />
      <Box component="p">{data?.data.data.description}</Box>
    </Box>
  );
});
