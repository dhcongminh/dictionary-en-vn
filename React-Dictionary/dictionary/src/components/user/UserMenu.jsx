import { Logout } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
//import FavoriteIcon from "@mui/icons-material/Favorite";
import AddBoxIcon from "@mui/icons-material/AddBox";
import React from "react";
import Authentication from "../../others/Authentication";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
//import Swal from "sweetalert2";

const UserMenu = () => {
  const nav = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  function navToProfile() {
    nav("/profile");
    setAnchorEl(null);
    window.location.reload();
  }
  function navToGrossaries() {
    nav("/grossaries");
    setAnchorEl(null);
    window.location.reload();
  }
  // function navToFavourite() {
  //   //nav("/favourite"); window.location.reload();
  //   setAnchorEl(null);
  //   Swal.fire({
  //     icon: "info",
  //     title: "Coming soon",
  //   });
    
  // }
  function navToGrossaryAdd() {
    nav("/grossaries?act=add");
    setAnchorEl(null);
    window.location.reload();
  }
  function handleLogout() {
    Authentication.clearLocalStorage();
    nav("/");
    toast.success("Đăng xuất thành công.");
    setAnchorEl(null);
  }
  function navToWordSet(){
    nav("/word-set");
    setAnchorEl(null);
    window.location.reload();
  }
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {Authentication.username() &&
                Authentication.username()[0].toUpperCase()}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={navToProfile}>
          <Avatar /> Hồ sơ
        </MenuItem>
        <MenuItem
          sx={{ display: "flex", alignItems: "center" }}
          onClick={navToGrossaries}
        >
          <Box
            sx={{
              color: "white",
              padding: 0.3,
              bgcolor: "gray",
              mr: 0.7,
              borderRadius: "50%",
              width: 0.14,
              height: 0.14,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transform: "translateX(-10%)",
            }}
          >
            <CollectionsBookmarkIcon />
          </Box>
          Từ điển của tôi
        </MenuItem>
        <Divider />
        {/* <MenuItem onClick={navToFavourite}>
          <ListItemIcon>
            <FavoriteIcon fontSize="small" />
          </ListItemIcon>
          Từ yêu thích của tôi
        </MenuItem> */}
        <MenuItem onClick={navToGrossaryAdd}>
          <ListItemIcon>
            <AddBoxIcon fontSize="small" />
          </ListItemIcon>
          Thêm từ vựng mới
        </MenuItem>
        <MenuItem onClick={navToWordSet}>
          <ListItemIcon>
            <LibraryBooksIcon fontSize="small" />
          </ListItemIcon>
          Bộ từ vựng
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
