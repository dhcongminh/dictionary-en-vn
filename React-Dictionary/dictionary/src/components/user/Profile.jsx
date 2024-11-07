import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Authentication from "../../others/Authentication";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DataContainer from "../../api/DictionaryApiCall";
import Swal from "sweetalert2";

const Profile = ({ user, setIsLoading }) => {
  const nav = useNavigate();
  useEffect(() => {
    if (!Authentication.isValid()) {
      nav("/");
      window.location.reload();
    }
    setIsLoading(false);
  }, [nav, setIsLoading]);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  // const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCfm, setNewPasswordCfm] = useState("");

  const handleOpenChangePassword = () => setOpenChangePassword(true);
  const handleCloseChangePassword = () => setOpenChangePassword(false);

  const handlePasswordChange = () => {
    // Thực hiện logic đổi mật khẩu ở đây (gửi request đến API)
    // console.log("Old Password:", oldPassword);
    console.log("New Password:", newPassword);
    console.log("New Password Cfm:", newPasswordCfm);
    if (newPasswordCfm !== newPassword) {
      toast.info("Mật khẩu không khớp!");
      return;
    }
    setIsLoading(true);
    DataContainer.changeUserPassword(Authentication.username(), newPassword).then(res => {
      if (res.data !== null) {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Mật khẩu của bạn đã thay đổi thành công!"
        });
        setIsLoading(false);
      }
    });


    // Đóng dialog sau khi đổi mật khẩu thành công
    handleCloseChangePassword();
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, margin: "auto", mt: 5 }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Avatar
          sx={{ width: 100, height: 100, marginBottom: 2, fontSize: 70 }}
        >
          {Authentication.username() &&
            Authentication.username()[0].toUpperCase()}
        </Avatar>
        <Typography variant="h5" gutterBottom>
          {user.name}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {user.email}
        </Typography>
      </Box>

      <Box mt={4} textAlign="center">
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleOpenChangePassword}
          sx={{ marginTop: 2 }}
        >
          Đổi Mật Khẩu
        </Button>
      </Box>

      {/* Dialog Đổi Mật Khẩu */}
      <Dialog open={openChangePassword} onClose={handleCloseChangePassword}>
        <DialogTitle>Đổi Mật Khẩu</DialogTitle>
        <DialogContent>
          {/* <TextField
            label="Mật khẩu cũ"
            type="password"
            fullWidth
            margin="normal"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          /> */}
          <TextField
            label="Mật khẩu mới"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Nhập lại mật khẩu mới"
            type="password"
            fullWidth
            margin="normal"
            value={newPasswordCfm}
            onChange={(e) => setNewPasswordCfm(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseChangePassword}>Hủy</Button>
          <Button
            onClick={handlePasswordChange}
            color="primary"
            variant="contained"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Profile;
