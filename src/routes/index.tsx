import "react-toastify/dist/ReactToastify.css";

import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { createBrowserRouter, redirect, RouteObject } from "react-router";

import { Error } from "@/components/Error";
import { useAuth } from "@/lib/auth";

import { getProtectedRoutes } from "./protected";
import { publicRoutes } from "./public";

/**
 * 全体のルーティングの設定
 */
export const getAppRoutes = () => {
  const { user } = useAuth();
  const commonRoutes: RouteObject[] = [
    {
      path: "/",
      errorElement: (
        <Error
          status="404"
          message="このページはすでに削除されているか、URLが間違っている可能性があります。"
        />
      ),
      element: null,
      HydrateFallback: () => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      ),
      loader: async () => {
        if (!user) {
          // TODO: もしかしたらこっちでリダイレクトしないといけないかも
          // window.location.pathname = "/login";
          return redirect("/login");
        }
        return redirect("/users");
      },
    },
  ];

  const root = createBrowserRouter([
    ...commonRoutes,
    ...publicRoutes,
    ...getProtectedRoutes(),
  ]);

  return root;
};
