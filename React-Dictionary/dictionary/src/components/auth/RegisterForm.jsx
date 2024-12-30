import {
  Box,
  Button,
  // Checkbox,
  Container,
  FormControl,
  // FormControlLabel,
  Typography,
  Card,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Authentication from "../../others/Authentication";
import DataContainer from "../../api/DictionaryApiCall";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const RegisterForm = ({ setIsLoading }) => {
  const nav = useNavigate();

  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [repasswordError, setrePasswordError] = useState(false);
  const [repasswordErrorMessage, setrePasswordErrorMessage] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");

  useEffect(() => {
    if (Authentication.isValid()) {
      nav("/");
      window.location.reload();
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (!validateInputs()) {
      toast.warning("Vui lòng kiểm tra lại thông tin.");
    }
    const data = new FormData(event.currentTarget);
    // if (data.get("isRemember")) {
    //   //remember here
    // }
    var registerUser = {
      username: data.get("username"),
      email: data.get("email"),
      password: data.get("password"),
    };
    DataContainer.Register(registerUser)
      .then((data) => {
        if (data) {
          if (data.errors.length) {
            Swal.fire({
              icon: "error",
              title: "Có lỗi xảy ra",
              html: data.errors.join("<br>"),
            });
          } else {
            toast.info(
              "Đăng ký thành công. Kiểm tra Email để kích hoạt tài khoản."
            );
          }
        }
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const validateInputs = () => {
    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const repassword = document.getElementById("repassword");
    let isValid = true;
    if (!username.value) {
      setUsernameError(true);
      setUsernameErrorMessage("Trường này không được phép để trống!");
    } else {
      setUsernameError(false);
      setUsernameErrorMessage("");
    }
    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Vui lòng nhập đúng định dạng email!");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }
    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Mật khẩu phải dài ít nhất 6 kí tự!");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }
    if (
      !repassword.value ||
      (password && repassword.value !== password.value)
    ) {
      setrePasswordError(true);
      setrePasswordErrorMessage("Mật khẩu không khớp!");
      isValid = false;
    } else {
      setrePasswordError(false);
      setrePasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <Container>
      <Card
        sx={{
          py: 5,
          px: 5,
          width: { lg: "25rem", xs: "100%" },
          mt: 5,
          position: "absolute",
          right: "50%",
          transform: "translateX(50%)",
        }}
        variant="outlined"
      >
        <Typography
          paddingBottom={3}
          textAlign={"center"}
          component="h1"
          variant="h4"
        >
          Đăng ký
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl variant="standard" sx={{ width: "100%", mt: 3 }}>
            <TextField
              variant="standard"
              type="text"
              error={usernameError}
              id="username"
              name="username"
              label="Username"
              helperText={usernameErrorMessage}
              onChange={validateInputs}
            />
          </FormControl>
          <FormControl variant="standard" sx={{ width: "100%", mt: 3 }}>
            <TextField
              variant="standard"
              type="email"
              error={emailError}
              id="email"
              name="email"
              label="Email"
              helperText={emailErrorMessage}
              onChange={validateInputs}
            />
          </FormControl>
          <FormControl variant="standard" sx={{ width: "100%", mt: 3 }}>
            <TextField
              variant="standard"
              type="password"
              error={passwordError}
              id="password"
              name="password"
              label="Mật khẩu"
              helperText={passwordErrorMessage}
              onChange={validateInputs}
            />
          </FormControl>
          <FormControl variant="standard" sx={{ width: "100%", mt: 3 }}>
            <TextField
              variant="standard"
              type="password"
              error={repasswordError}
              id="repassword"
              name="repassword"
              label="Nhập lại mật khẩu"
              helperText={repasswordErrorMessage}
              onChange={validateInputs}
            />
          </FormControl>
          {/* <FormControlLabel
            control={<Checkbox value={true} color="primary" />}
            label="Remember me"
            name="isRemember"
            sx={{ mt: 3 }}
          /> */}
          <Button type="submit" fullWidth variant="contained">
            Đăng ký
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default RegisterForm;
