import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

import { ERR_REQUIRE_MESSAGE } from "@/const/const";
import { useAuth } from "@/lib/auth";

const schema = z
  .object({
    confirmCode: z
      .string()
      .min(1, ERR_REQUIRE_MESSAGE)
      .length(4, "4桁の数値を入力してください。"),
  })
  .required();
type Schema = z.infer<typeof schema>;

type AuthCodeModalProps = {
  open: boolean;
  email: string;
  temporaryUserId: string;
  closeModal: () => void;
};

/**
 * 確認コード入力ダイアログ
 */
export const AuthCodeModal = React.memo(
  ({ temporaryUserId, open, email, closeModal }: AuthCodeModalProps) => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<Schema>({
      resolver: zodResolver(schema),
    });
    const auth = useAuth();
    const navigate = useNavigate();

    return (
      <Dialog open={open}>
        <form
          onSubmit={handleSubmit(async ({ confirmCode }) => {
            await auth.register({
              confirmCode,
              temporaryUserId,
            });
            navigate("/users");
          })}
        >
          <DialogTitle>認証コード</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`${email}に送信された認証コードを入力してください。`}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="4桁の認証コード"
              fullWidth
              type="text"
              variant="standard"
              inputProps={{ maxLength: 4 }}
              {...register("confirmCode")}
            />
            <Box sx={{ color: "error.main" }}>
              {errors.confirmCode?.message}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={closeModal}>
              キャンセル
            </Button>
            <LoadingButton type="submit" loading={auth.isRegistering}>
              認証
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
);
