import {
  Box,
  Container,
  FormControl,
  Input,
  InputLabel,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DataContainer from "../../api/DictionaryApiCall";
import GrossaryDetail from "./GrossaryDetail";
import { toast } from "react-toastify";

const GrossaryInput = ({ setIsLoading }) => {
  const [grossaryText, setGrossaryText] = useState("");
  const [grossaryData, setGrossaryData] = useState(null);

  const onGrossaryInputSubmit = async (e) => {
    e.preventDefault();
    fetchWordDefinition();
  };

  useEffect(() => {
    // Hàm xử lý sự kiện keydown
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setGrossaryText("");
        setGrossaryData(null);
      }
    };

    // Gắn sự kiện keydown vào document
    document.addEventListener("keydown", handleEsc);
    setIsLoading(false);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fetchWordDefinition() {
    if (grossaryText) {
      setIsLoading(true);
      DataContainer.lookup(grossaryText)
        .then((data) => {
          if (data === undefined) {
            toast.error("Lỗi mạng!");
            setGrossaryData(null);
          } else if (data === "" || data.status !== "active") {
            toast.error("Không tìm thấy từ trong hệ thống!");
            setGrossaryData(null);
          } else {
            setGrossaryData(data);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          if (err.name === "AxiosError") {
            toast.error("Lỗi mạng!");
          }
        });
    } else {
      setGrossaryData(null);
    }
  }
  return (
    <Container sx={{ mt: 5 }}>
      <Typography
        variant="h1"
        className={grossaryText ? "homeTitle isLookingUp" : "homeTitle"}
        sx={{
          fontFamily: "Montserrat",
          textAlign: "center",
          textTransform: "uppercase",
          fontWeight: "100",
        }}
      >
        {grossaryText ? grossaryText : "DICTIONARY"}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Box
          onSubmit={(event) => onGrossaryInputSubmit(event)}
          component={"form"}
        >
          <FormControl variant="standard" sx={{ width: "20rem" }}>
            <InputLabel htmlFor="grossary">Tra từ</InputLabel>
            <Input
              value={grossaryText}
              onChange={(event) => setGrossaryText(event.target.value.trim())}
              id="grossary"
            />
          </FormControl>
        </Box>
      </Box>
      {!grossaryData ? "" : <GrossaryDetail grossaryData={grossaryData} setIsLoading={setIsLoading} />}
    </Container>
  );
};

export default GrossaryInput;
