import AccountCircle from "@mui/icons-material/AccountCircle";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Link, useNavigate } from "react-router";

import { NotificationBadge } from "@/features/notification";
import { useAuth } from "@/lib/auth";

import { useHandleMenu } from "./hooks";

export const Header = React.memo(() => {
  const { user, logout } = useAuth();
  const { anchorEl, closeMenu, openMenu } = useHandleMenu();
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          size="large"
          aria-label="戻る"
          onClick={() => navigate(-1)}
          color="inherit"
        >
          <ArrowBackIosIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1 }}
          align="center"
        >
          <Link to={{ pathname: "/" }}>ポイントアプリ</Link>
        </Typography>
        {user && (
          <>
            <NotificationBadge />
            <IconButton
              size="large"
              aria-label="ユーザメニュー"
              onClick={openMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={closeMenu}
            >
              <MenuItem
                onClick={() => {
                  closeMenu();
                  navigate("/account");
                }}
              >
                アカウント情報
              </MenuItem>
              <MenuItem
                onClick={() => {
                  closeMenu();
                  navigate("/settings/notification");
                }}
              >
                設定
              </MenuItem>
              <MenuItem
                onClick={async () => {
                  closeMenu();
                  logout();
                }}
              >
                サインアウト
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
});
