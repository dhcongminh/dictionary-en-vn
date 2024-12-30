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
import Sidebar from "./components/user/SideBar";
import Authentication from "./others/Authentication";
import WordManagement from "./components/administration/WordManagement";
import Profile from "./components/user/Profile";
import Footer from "./components/shared/Footer";
import BotAssistant from "./components/user/BotAssistant";
import FeedbackIcon from "@mui/icons-material/Feedback";
import WordSet from "./components/user/WordSet";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSideBarShow, setIsSideBarShow] = useState(false);
  const [isChatBoxClose, setIsChatBoxClose] = useState(true);

  return (
    <Box className="App" sx={{ paddingBottom: 20 }}>
      {Authentication.isAdmin() && (
        <Sidebar
          isSideBarShow={isSideBarShow}
          setIsSideBarShow={setIsSideBarShow}
        />
      )}
      <ToastContainer />
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Header setIsLoading={setIsLoading} setIsSideBarShow={setIsSideBarShow} />
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
          path="/profile"
          exact
          component={Profile}
          element={
            <Profile
              user={{
                avatarUrl: "",
                name: Authentication.username(),
                email: Authentication.userEmail(),
              }}
              setIsLoading={setIsLoading}
            />
          }
        />
        <Route
          path="/grossaries"
          exact
          component={GrossaryManagement}
          element={<GrossaryManagement setIsLoading={setIsLoading} />}
        />
        <Route
          path="/admin/grossaries"
          exact
          component={WordManagement}
          element={<WordManagement setIsLoading={setIsLoading} />}
        />
        <Route
          path="/admin/pending-words"
          exact
          component={Management}
          element={<Management setIsLoading={setIsLoading} />}
        />
        <Route
          path="/admin/users"
          exact
          component={Management}
          element={<Management setIsLoading={setIsLoading} />}
        />
        <Route
          path="/word-set"
          exact
          component={WordSet}
          element={<WordSet setIsLoading={setIsLoading} />}
        />
      </Routes>
      <Box sx={{ overflowX: "hidden" }}>
        
        <Box
          className={ isChatBoxClose ? "boxchat" : "boxchat show"}
          sx={{
            position: "absolute",
            right: 50,
            bottom: 170,
            height: 550,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            bgcolor: "#fff",
            transition: ".5s ease-in-out",
            transformOrigin: "right bottom",
            transform: "scale(0)",
          }}
        >
          <BotAssistant />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
