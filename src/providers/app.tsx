import {
  Box,
  CircularProgress,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";
import { RecoilRoot } from "recoil";

import { AuthProvider } from "@/lib/auth";
import { queryClient } from "@/lib/react-query";
import { getAppRoutes } from "@/routes";

/**
 * プロパイダー
 */
export const AppProvider = () => {
  const theme = createTheme({});
  return (
    <RecoilRoot>
      <React.Suspense
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
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider theme={theme}>
              <WrapRouterProvider />
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </React.Suspense>
      <ToastContainer />
    </RecoilRoot>
  );
};

/**
 * propsに指定したgetAppRouters()内でuseAuthを利用しているが、
 * このフックはAuthProviderコンポーネント内でしか利用できないため、Wrapする必要がある
 * そうしないとエラーになる
 */
const WrapRouterProvider = () => {
  return <RouterProvider router={getAppRoutes()} />;
};
