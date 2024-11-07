import {
  Box,
  Button,
  //Checkbox,
  Container,
  FormControl,
  //FormControlLabel,
  Typography,
  Card,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DataContainer from "../../api/DictionaryApiCall";
import Authentication from "../../others/Authentication";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const LoginForm = ({ setIsLoading }) => {
  const nav = useNavigate();
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  useEffect(() => {
    if (Authentication.isValid()) {
      nav("/");
      window.location.reload();
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (event) => {
    setIsLoading(true);
    event.preventDefault();
    if (validateInputs()) {
      const data = new FormData(event.currentTarget);
      // if (data.get("isRemember")) {
      //   //remember here
      // }
      const dataLogin = {
        usernameOrEmail: data.get("emailOrUsername"),
        password: data.get("password"),
      };
      DataContainer.Login(dataLogin)
        .then((data) => {
          if (!data.user) {
            toast.error("Username hoặc mật khẩu không đúng!");
            Authentication.clearLocalStorage();
            setIsLoading(false);
            return;
          }
          if (data.user.isActive === null) {
            Swal.fire({
              title: "Tài khoản của bạn chưa được kích hoạt.",
              text: "Tài khoản của bạn chưa được kích hoạt.",
              html: `<button id="activateButton" class="btn btn-outline-primary">Kích hoạt ngay!</button>`,
              icon: "info",
              showConfirmButton: false,
            });
            setTimeout(() => {
              const activateButton = document.getElementById("activateButton");
              if (activateButton) {
                activateButton.onclick = () => {
                  handleActivateSent(dataLogin);
                  Swal.close();
                };
              }
            }, 0);
            setIsLoading(false);
            return;
          }
          if (data.user.isActive === false) {
            toast.info("Tài khoản của bạn đã bị khóa.");
            setIsLoading(false);
            return;
          }
          const dateObject = new Date(data.expireTime);
          const timeInMillis = dateObject.getTime();
          localStorage.setItem("AUTH__TOKEN", "Bearer " + data.token);
          localStorage.setItem("expireDate", timeInMillis);
          localStorage.setItem("username", data.user.username);
          localStorage.setItem("role", data.user.role);
          localStorage.setItem("userId", data.user.id);
          localStorage.setItem("userEmail", data.user.userDetail.email);
          nav("/");

          toast.success("Đăng nhập thành công.");
          setIsLoading(false);
        })
        .catch((err) => {
          if (err.status === 401) {
            nav("/");
            toast.warning("Vui lòng đăng nhập trước khi thực hiện.");
          } else {
            toast.error("Có vẻ như kết nối mạng đang trục trặc.");
            console.log(err);
          }
          setIsLoading(false);
        });
    } else {
      toast.warning("Vui lòng kiểm tra lại thông tin.");
      setIsLoading(false);
    }
  };

  function handleActivateSent(dataLogin) {
    DataContainer.SendActivateLink(dataLogin.usernameOrEmail)
      .then((data) => {
        Swal.fire({
          icon: "success",
          title: "Link Activate đã được gửi đến email đăng ký.",
          confirmButtonText: "Ok",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const validateInputs = () => {
    const email = document.getElementById("emailOrUsername");
    const password = document.getElementById("password");
    let isValid = true;
    if (!email.value) {
      setEmailError(true);
      setEmailErrorMessage("Trường này không được phép để trống!");
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
          Đăng nhập
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
              error={emailError}
              id="emailOrUsername"
              name="emailOrUsername"
              label="Username hoặc email"
              helperText={emailErrorMessage}
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
            />
          </FormControl>
          {/* <FormControlLabel
            control={<Checkbox value={true} color="primary" />}
            label="Remember me"
            name="isRemember"
            sx={{ mt: 3 }}
          /> */}
          <Button type="submit" fullWidth variant="contained">
            Đăng nhập
          </Button>
        </Box>
      </Card>
    </Container>
  );
};
export default LoginForm;
