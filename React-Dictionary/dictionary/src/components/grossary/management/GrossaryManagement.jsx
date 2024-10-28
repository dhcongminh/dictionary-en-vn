import React, { useEffect, useState } from "react";
import GrossaryList from "./GrossaryList";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import DataContainer from "../../../api/DictionaryApiCall";
import Authentication from "../../../others/Authentication";
import { useNavigate } from "react-router-dom";
import GrossaryView from "./GrossaryView";
import GrossaryForm from "./GrossaryForm";
import { toast } from "react-toastify";

const GrossaryManagement = ({ setIsLoading }) => {
  const nav = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const [grossaryDetail, setGrossaryDetail] = useState(null);
  const [action, setAction] = useState("");
  const [datas, setDatas] = useState(null);
  const [word, setWord] = useState("");
  const [shortDef, setShortDef] = useState("");
  const [status, setStatus] = useState("");
  const [order, setOrder] = useState("tăng dần");
  const [orderBy, setOrderBy] = useState([]);

  useEffect(() => {
    if (!Authentication.isValid()) {
      nav("/");
      window.location.reload();
    }
    setIsLoading(false);
    fetchAllWord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchAllWord = () => {
    DataContainer.getGrossariesByUserAdded(Authentication.userId())
      .then((res) => {
        setDatas([...res.data]);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.status === 401) {
          nav("/");
          toast.info("Vui lòng đăng nhập để thực hiện.");
        } else {
          console.log(err);
        }
      });
  };
  useEffect(() => {
    setIsLoading(true);
    DataContainer.getGrossariesByUserAdded(Authentication.userId())
      .then((res) => {
        setDatas(
          res.data.filter(
            (data) =>
              data.status.startsWith(status) &&
              data.wordText.startsWith(word) &&
              data.shortDefinition.startsWith(shortDef)
          )
        );
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.status === 401) {
          nav("/");
          toast.info("Vui lòng đăng nhập để thực hiện.");
        } else if (err.name === "AxiosError") {
          nav("/");
          toast.error("Lỗi mạng.");
        }
        setIsLoading(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word, shortDef, status]);

  function handleChange(e) {
    const { name, checked } = e.target;
    if (checked) {
      setOrderBy([...orderBy, name]);
    } else {
      setOrderBy([...orderBy.filter((o) => o !== name)]);
    }
  }
  function handleOrder() {
    if (orderBy && orderBy.length > 0) {
      DataContainer.getGrossariesByUserAdded(Authentication.userId())
        .then((res) => {
          if (order === "giảm dần") {
            setDatas(
              res.data
                .filter(
                  (data) =>
                    data.status.startsWith(status) &&
                    data.wordText.startsWith(word) &&
                    data.shortDefinition.startsWith(shortDef)
                )
                .sort((a, b) => {
                  // Sắp xếp theo status
                  const statusComparison = b.status.localeCompare(a.status);
                  if (statusComparison !== 0) return statusComparison;
                  // Sắp xếp theo wordText
                  const wordComparison = b.wordText.localeCompare(a.wordText);
                  if (wordComparison !== 0) return wordComparison;
                  // Sắp xếp theo shortDefinition
                  return b.shortDefinition.localeCompare(a.shortDefinition);
                })
            );
          } else {
            setDatas(
              res.data
                .filter(
                  (data) =>
                    data.status.startsWith(status) &&
                    data.wordText.startsWith(word) &&
                    data.shortDefinition.startsWith(shortDef)
                )
                .sort((a, b) => {
                  // Sắp xếp theo status
                  const statusComparison = a.status.localeCompare(b.status);
                  if (statusComparison !== 0) return statusComparison;
                  // Sắp xếp theo wordText
                  const wordComparison = a.wordText.localeCompare(b.wordText);
                  if (wordComparison !== 0) return wordComparison;
                  // Sắp xếp theo shortDefinition
                  return a.shortDefinition.localeCompare(b.shortDefinition);
                })
            );
          }
        })
        .catch((err) => {
          console.log(err);
          nav("/");
          toast.info("Vui lòng đăng nhập để thực hiện.");
        });
    } else {
      DataContainer.getGrossariesByUserAdded(Authentication.userId())
        .then((res) => {
          setDatas(
            res.data.filter(
              (data) =>
                data.status.startsWith(status) &&
                data.wordText.startsWith(word) &&
                data.shortDefinition.startsWith(shortDef)
            )
          );
        })
        .catch((err) => {
          console.log(err);
          nav("/");
          toast.info("Vui lòng đăng nhập để thực hiện.");
        });
    }
    if (order === "giảm dần") {
      setOrder("tăng dần");
    } else {
      setOrder("giảm dần");
    }
  }

  function handleAddWord() {
    setCurrentPage(2);
    setAction("Thêm");
    setGrossaryDetail(null);
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h3">Từ điển của tôi</Typography>
      </Box>
      {(currentPage === 0 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Box>
              <TextField
                sx={{ mt: 1 }}
                label="Từ tiếng anh"
                variant="filled"
                size="small"
                onInput={(event) => setWord(event.target.value)}
              />
            </Box>
            <Box>
              <TextField
                sx={{ mt: 1 }}
                label="Dịch nhanh"
                variant="filled"
                size="small"
                onInput={(event) => setShortDef(event.target.value)}
              />
            </Box>
            <Box>
              <TextField
                sx={{ mt: 1, width: 200 }}
                select
                label="Trạng thái"
                variant="filled"
                size="small"
                defaultValue=""
                onChange={(event) => setStatus(event.target.value)}
              >
                <MenuItem selected value="">
                  Tất cả
                </MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </TextField>
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ mt: 1 }}>
              <FormControlLabel
                sx={{ borderRight: 1, pr: 1 }}
                control={<Checkbox onChange={handleChange} name="word" />}
                label="Từ tiếng anh"
              />
              <FormControlLabel
                sx={{ borderRight: 1, pr: 1 }}
                control={<Checkbox onChange={handleChange} name="def" />}
                label="Dịch nhanh"
              />
              <FormControlLabel
                sx={{ borderRight: 1, pr: 1 }}
                control={<Checkbox onChange={handleChange} name="stat" />}
                label="Trạng thái"
              />
              <Button onClick={handleOrder}>Sắp xếp {order}</Button>
            </Box>
            <Button onClick={handleAddWord} variant="contained">
              Thêm từ mới
            </Button>
          </Box>

          {datas === null ? (
            <>Loading...</>
          ) : (
            <GrossaryList
              grossaryList={datas}
              setCurrentPage={setCurrentPage}
              setGrossaryDetail={setGrossaryDetail}
              setIsLoading={setIsLoading}
              setAction={setAction}
              fetchAllWord={fetchAllWord}
            />
          )}
        </Box>
      )) ||
        (currentPage === 1 && (
          <GrossaryView
            grossaryDetail={grossaryDetail}
            setCurrentPage={setCurrentPage}
          />
        )) ||
        (currentPage === 2 && (
          <GrossaryForm
            fetchAllWord={fetchAllWord}
            grossaryDetail={grossaryDetail}
            setCurrentPage={setCurrentPage}
            action={action}
            setAction={setAction}
            setIsLoading={setIsLoading}
          />
        ))}
    </Container>
  );
};

export default GrossaryManagement;
