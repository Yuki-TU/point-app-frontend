import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import React from "react";
import { Link } from "react-router";

type Props = {
  children: React.ReactNode;
} & React.ComponentProps<typeof Link>;

/**
 * リンクコンポーネント
 * react-router-domのLinkコンポーネントをラップ
 */
export const ArrowLink = React.memo(({ children, ...props }: Props) => (
  <Link style={{ color: "#1976d2", textDecoration: "underline" }} {...props}>
    <span>{children}</span>
    <KeyboardArrowRightIcon style={{ height: "40px", marginBottom: "-15px" }} />
  </Link>
));
