import { Box, Button } from "@mui/material";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouteError } from "react-router";

type Props = {
  status?: string;
  message?: string;
};

/**
 * エラー画面
 * @param param0
 * @returns
 */
export const Error = ({ status, message }: Props) => {
  const error = useRouteError();
  const { reset } = useQueryErrorResetBoundary();

  type HttpResponse = AxiosError<{
    statusCode: number;
    status: string;
    message: string;
  }>;

  return (
    <Box
      role="alert"
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      flexDirection="column"
    >
      <h1>
        {status ||
          (error as HttpResponse).response?.status ||
          (error as Response).status ||
          (error as Error).message}
      </h1>
      <p>
        {message ||
          (error as HttpResponse).response?.data.message ||
          (error as Response).statusText ||
          ((error as Error).cause as string)}
      </p>
      <Button
        variant="outlined"
        onClick={() => {
          reset();
          window.location.assign(window.location.origin);
        }}
      >
        ホームへ
      </Button>
    </Box>
  );
};
