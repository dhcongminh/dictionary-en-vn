import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Container,
} from "@mui/material";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserMenu from "../user/UserMenu";
import Authentication from "../../others/Authentication";

const Header = () => {
  const [currentPage, setCurrentPage] = React.useState("");
  const nav = useNavigate();
  const location = useLocation();
  React.useEffect(() => {
    const path = location.pathname;
    if (path === "/") setCurrentPage("Tra cứu");
    else if (path === "/auth/login") setCurrentPage("Đăng nhập");
    else if (path === "/auth/register") setCurrentPage("Đăng ký");
  }, [location.pathname]);
  return (
    <Box>
      <Container sx={{ display: "flex", justifyContent: "space-between" }}>
        <BottomNavigation
          showLabels
          value={currentPage}
          onChange={(event, newValue) => {
            setCurrentPage(newValue);
          }}
        >
          <BottomNavigationAction
            onClick={() => nav("/")}
            value={"Tra cứu"}
            label="Tra cứu"
          />
          {Authentication.isAdmin() && (
            <BottomNavigationAction
              onClick={() => nav("/administration")}
              value={"Administration"}
              label="Administration"
            />
          )}
        </BottomNavigation>
        {!Authentication.isValid() && (
          <BottomNavigation
            showLabels
            value={currentPage}
            onChange={(event, newValue) => {
              setCurrentPage(newValue);
            }}
          >
            <BottomNavigationAction
              sx={{ width: 130 }}
              onClick={() => nav("/auth/login")}
              value={"Đăng nhập"}
              label="Đăng nhập"
            />
            <BottomNavigationAction
              onClick={() => nav("/auth/register")}
              value={"Đăng ký"}
              label="Đăng ký"
            />
          </BottomNavigation>
        )}
        {Authentication.isValid() && <UserMenu />}
      </Container>
    </Box>
  );
};

export default Header;
