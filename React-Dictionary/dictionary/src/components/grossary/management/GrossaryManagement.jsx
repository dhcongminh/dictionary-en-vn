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
import { useLocation, useNavigate } from "react-router-dom";
import GrossaryView from "./GrossaryView";
import GrossaryForm from "./GrossaryForm";
import { toast } from "react-toastify";

const GrossaryManagement = ({ setIsLoading }) => {
  const nav = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const act = queryParams.get('act');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
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
    if (act && act === "add") {
      setAction("Thêm");
      setCurrentPage(2);
    }
    fetchAllWord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchAllWord = () => {
    if (!Authentication.isValid()) {
      nav("/");
      window.location.reload();
    }
    DataContainer.getGrossariesByUserAdded(Authentication.userId())
      .then((data) => {
        setDatas([...data]);
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
    var timer = setTimeout(() => {
      setIsLoading(true);
      if (!Authentication.isValid()) {
        nav("/");
        window.location.reload();
      }
      DataContainer.getGrossariesByUserAdded(Authentication.userId())
        .then((data) => {
          setDatas(
            data.filter(
              (data) =>
                data.status.toLowerCase().startsWith(status.toLowerCase()) &&
                data.wordText.toLowerCase().startsWith(word.toLowerCase()) &&
                data.shortDefinition
                  .toLowerCase()
                  .includes(shortDef.toLowerCase())
            )
          );
        })
        .catch((err) => {
          if (err.status === 401) {
            nav("/");
            toast.info("Vui lòng đăng nhập để thực hiện.");
          } else if (err.name === "AxiosError") {
            nav("/");
            toast.error("Lỗi mạng.");
          }
        }).finally(() => 
          setIsLoading(false));
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word, shortDef, status]);

  function handleChange(e) {
    if (!Authentication.isValid()) {
      nav("/");
      window.location.reload();
    }
    const { name, checked } = e.target;
    if (checked) {
      setOrderBy([...orderBy, name]);
    } else {
      setOrderBy([...orderBy.filter((o) => o !== name)]);
    }
  }
  function handleOrder() {
    if (!Authentication.isValid()) {
      nav("/");
      window.location.reload();
    }
    if (orderBy && orderBy.length > 0) {
      DataContainer.getGrossariesByUserAdded(Authentication.userId())
        .then((data) => {
          if (order === "giảm dần") {
            setDatas(
              data
                .filter(
                  (data) =>
                    data.status
                      .toLowerCase()
                      .startsWith(status.toLowerCase()) &&
                    data.wordText
                      .toLowerCase()
                      .startsWith(word.toLowerCase()) &&
                    data.shortDefinition
                      .toLowerCase()
                      .includes(shortDef.toLowerCase())
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
              data
                .filter(
                  (data) =>
                    data.status
                      .toLowerCase()
                      .startsWith(status.toLowerCase()) &&
                    data.wordText
                      .toLowerCase()
                      .startsWith(word.toLowerCase()) &&
                    data.shortDefinition
                      .toLowerCase()
                      .includes(shortDef.toLowerCase())
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
        .then((data) => {
          setDatas(
            data.filter(
              (data) =>
                data.status.toLowerCase().startsWith(status.toLowerCase()) &&
                data.wordText.toLowerCase().startsWith(word.toLowerCase()) &&
                data.shortDefinition
                  .toLowerCase()
                  .includes(shortDef.toLowerCase())
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
    if (!Authentication.isValid()) {
      nav("/");
      window.location.reload();
    }
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
                sx={{ borderRight: 1, pr: 1, display: "none" }}
                control={
                  <Checkbox
                    onChange={(event) => handleChange(event)}
                    name="word"
                  />
                }
                label="Từ tiếng anh"
              />
              <FormControlLabel
                sx={{ borderRight: 1, pr: 1, display: "none" }}
                control={
                  <Checkbox
                    onChange={(event) => handleChange(event)}
                    name="def"
                  />
                }
                label="Dịch nhanh"
              />
              <FormControlLabel
                sx={{ borderRight: 1, pr: 1, display: "none" }}
                control={
                  <Checkbox
                    onChange={(event) => handleChange(event)}
                    name="stat"
                  />
                }
                label="Trạng thái"
              />
              {/* <Button onClick={handleOrder}>Sắp xếp {order}</Button> */}
            </Box>
            <Button onClick={handleAddWord} variant="contained">
              Thêm từ mới
            </Button>
          </Box>

          {datas === null ? (
            <>Loading...</>
          ) : (
            <GrossaryList
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
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
