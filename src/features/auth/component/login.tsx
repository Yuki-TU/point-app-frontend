import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { Box, TextField } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { z } from "zod";

import { ArrowLink } from "@/components/ArrowLink";
import {
  ERR_MAIL_FORMAT_MESSAGE,
  ERR_REQUIRE_MESSAGE,
  MAX_MAIL_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from "@/const/const";
import { useAuth } from "@/lib/auth";

// バリデーション設定
const schema = z
  .object({
    email: z
      .string()
      .min(1, ERR_REQUIRE_MESSAGE)
      .max(MAX_MAIL_LENGTH.VALUE, MAX_MAIL_LENGTH.MESSAGE)
      .email(ERR_MAIL_FORMAT_MESSAGE),
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH.VALUE, MIN_PASSWORD_LENGTH.MESSAGE)
      .max(MAX_PASSWORD_LENGTH.VALUE, MAX_PASSWORD_LENGTH.MESSAGE),
  })
  .required();
type Schema = z.infer<typeof schema>;

/**
 * ログイン機能
 */
export const Login: React.FC = React.memo(() => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { login, isLoggingIn } = useAuth();
  return (
    <Box className="App" mx="auto" maxWidth="400px" mt="100px">
      <Box textAlign="center" component="h2" mb="60px" color="#333">
        ログイン
      </Box>
      <form
        onSubmit={handleSubmit(async (data) => {
          await login(data);
          if (pathname === "/login") {
            navigate("/users");
          }
        })}
      >
        <Box marginBottom="24px">
          <Box mb="4px">メールアドレス</Box>
          <TextField
            fullWidth
            placeholder="yamada.taro@example.com"
            variant="outlined"
            {...register("email")}
          />
          <Box sx={{ color: "error.main" }}>{errors.email?.message}</Box>
        </Box>
        <Box marginBottom="24px">
          <Box mb="4px">パスワード</Box>
          <TextField
            fullWidth
            type="password"
            variant="outlined"
            placeholder="********"
            {...register("password")}
          />
          <Box sx={{ color: "error.main" }}>{errors.password?.message}</Box>
        </Box>
        <LoadingButton
          size="large"
          fullWidth
          sx={{ marginTop: "50px" }}
          variant="contained"
          type="submit"
          color="primary"
          loading={isLoggingIn}
        >
          ログイン
        </LoadingButton>
        <Box my="80px" />
        <Box textAlign="center" mb="20px">
          <ArrowLink to="/signup" aria-label="アカウント作成はこちら">
            アカウント新規作成はこちら
          </ArrowLink>
        </Box>
        <Box textAlign="center">
          <ArrowLink to="/password-reset" aria-label="アカウント作成はこちら">
            パスワードを忘れた方はこちら
          </ArrowLink>
        </Box>
      </form>
    </Box>
  );
});
