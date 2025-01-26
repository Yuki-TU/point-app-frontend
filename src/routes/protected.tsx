import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { AxiosError } from "axios";
import { Suspense } from "react";
import { Outlet, RouteObject } from "react-router";
import { useRouteError } from "react-router";

import { Error } from "@/components/Error";
import { MainLayout } from "@/components/Layout";
import { useAuth } from "@/lib/auth";
import { AccountPage } from "@/pages/Account";
import { AccountUpdatePage } from "@/pages/AccountUpdate";
import { LoginPage } from "@/pages/Login";
import { NotificationPage } from "@/pages/Notification";
import { NotificationsPage } from "@/pages/Notifications";
import { PasswordUpdatePage } from "@/pages/PasswordUpdate";
import { UsersPage } from "@/pages/Users";
import storage from "@/utils/storage";

const App = () => {
  return (
    <MainLayout>
      <Suspense
        fallback={
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100vh"
          >
            <CircularProgress />
          </Box>
        }
      >
        <Outlet />
      </Suspense>
    </MainLayout>
  );
};

// エラー時の画面表示
export const ErrorBoundary = () => {
  const error = useRouteError();
  // apiで認証エラーが起きた時
  if ((error as AxiosError).response?.status === 401) {
    // useAuthのuser stateが残るためリロードし消す
    location.reload();
    // リロードはすぐにされないので、ローディングを表示する
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  // useAuthのuser stateがない時
  // ログインしていない状態で保護されたページにアクセスした時
  if ((error as Error).message === "401") {
    storage.clearToken();
    return <LoginPage />;
  }
  // それ以外はエラー
  return <Error />;
};

/**
 * ログインしないと見れないページ
 */
export const getProtectedRoutes = (): RouteObject[] => {
  const { user } = useAuth();
  return [
    {
      path: "/",
      element: <App />,
      children: [
        {
          errorElement: <ErrorBoundary />,
          loader: async () => {
            if (!user) {
              throw window.Error("401", {
                cause: "アクセストークンが無効です。再ログインしてください。",
              });
            }
            return null;
          },
          children: [
            { path: "users", element: <UsersPage /> },
            { path: "account", element: <AccountPage /> },
            { path: "profile", element: <AccountUpdatePage /> },
            { path: "password-update", element: <PasswordUpdatePage /> },
            { path: "notifications", element: <NotificationsPage /> },
            {
              path: "notifications/:notificationId",
              element: <NotificationPage />,
            },
          ],
        },
      ],
    },
  ];
};
