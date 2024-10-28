import { Backdrop, Box, CircularProgress } from "@mui/material";
import "./App.css";
import GrossaryInput from "./components/grossary/GrossaryInput";
import Header from "./components/shared/Header";
import { Route, Routes } from "react-router-dom";
import GrossaryManagement from "./components/grossary/management/GrossaryManagement";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import Management from "./components/administration/Management";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Box className="App">
      <ToastContainer />
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Header setIsLoading={setIsLoading} />
      <Routes>
        <Route
          path="/"
          exact
          component={GrossaryInput}
          element={<GrossaryInput setIsLoading={setIsLoading} />}
        />
        <Route
          path="/auth/login"
          exact
          component={LoginForm}
          element={<LoginForm setIsLoading={setIsLoading} />}
        />
        <Route
          path="/auth/register"
          exact
          component={RegisterForm}
          element={<RegisterForm setIsLoading={setIsLoading} />}
        />
        <Route
          path="/grossaries"
          exact
          component={GrossaryManagement}
          element={<GrossaryManagement setIsLoading={setIsLoading} />}
        />
        <Route
          path="/administration"
          exact
          component={Management}
          element={<Management setIsLoading={setIsLoading} />}
        />
      </Routes>
    </Box>
  );
}

export default App;
