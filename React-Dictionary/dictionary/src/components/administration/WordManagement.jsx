import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Authentication from "../../others/Authentication";
import DataContainer from "../../api/DictionaryApiCall";
import GrossaryView from "../grossary/management/GrossaryView";
import GrossaryForm from "../grossary/management/GrossaryForm";
import GrossaryList from "../grossary/management/GrossaryList";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

const GrossaryManagement = ({ setIsLoading }) => {
  const nav = useNavigate();

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
    fetchAllWord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchAllWord = () => {
    if (!Authentication.isValid()) {
      nav("/");
      window.location.reload();
    }
    DataContainer.getAllWord()
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
      DataContainer.getAllWord()
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
        })
        .finally(() => setIsLoading(false));
    }, 2000);
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
      DataContainer.getAllWord()
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
      DataContainer.getAllWord()
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

  const exportExcelTemplate = () => {
    const headers = [
      { header: "english", key: "english" },
      { header: "type", key: "type" },
      { header: "phonetic", key: "phonetic" },
      { header: "definition", key: "definition" },
      { header: "example", key: "example" },
    ];
    const ws = XLSX.utils.json_to_sheet([{}], {
      header: headers.map((h) => h.key),
    });

    // Vô hiệu hóa các ô thừa
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
        if (cell) {
          cell.s = { ...cell.s, bgColor: { rgb: "CCCCCC" }, lock: true };
        }
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "data.xlsx");
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log(jsonData);
      if (!jsonData) {
        Swal.fire({
          icon: "error",
          title: "That bai",
          text: "Vui long nhap du lieu",
        });
      }
      var wordExcel;
      var successRows = [];
      var failRows = [];
      setIsLoading(true);

      var types = [
        "Động từ",
        "Danh từ",
        "Tính từ",
        "Trạng từ",
        "Đại từ",
        "Từ hạn định",
        "Thán từ",
        "Liên từ",
        "Giới từ",
      ];
      Promise.all(
        jsonData.map((w, i) => {
          var isValid = true;
          wordExcel = {
            wordText: w.english,
            shortDefinition: w.definition,
            phonetic: w.phonetic,
            addByUser: 1,
            status: "active",
            wordDefinitions: [
              {
                type: types.includes(w.type) ? w.type : "",
                definitions: {
                  detail: w.definition,
                  examples: [w.example ? w.example : ""],
                },
              },
            ],
            antonyms: [],
            synonyms: [],
            lastTimeUpdate: new Date().toLocaleString(),
          };
          if (
            !wordExcel.wordDefinitions.type ||
            !wordExcel.wordText ||
            !wordExcel.shortDefinition ||
            !wordExcel.phonetic ||
            !wordExcel.wordDefinitions.definitions.detail
          ) {
            isValid = false;
          }
          console.log(wordExcel);
          console.log(isValid)
          if (!isValid) {
              failRows.push(i + 2);
              return () => {
                
              }
          } else {
            return DataContainer.AddWord(wordExcel)
              .then((data) => {
                if (data) {
                  if (data === "word exist") {
                    failRows.push(i + 2);
                  } else {
                    successRows.push(i + 2);
                  }
                } else {
                  failRows.push(i + 2);
                }
              })
              .catch((err) => {
                console.error(err);
                failRows.push(i + 2);
              });
          }
        })
      )
        .then(() => {
          Swal.fire({
            icon: "info",
            title: "Tải file thành công!",
            html: failRows.length
              ? `Các dòng lỗi: ${failRows.join(", ")}`
              : "Tất cả dữ liệu được thêm thành công!",
          });
        })
        .finally(() => {
          setIsLoading(false);
          fetchAllWord();
        });
    };

    if (file) {
      reader.readAsBinaryString(file);
    }
  };
  const handleInsertBtnClick = () => {
    document.querySelector("#excel-input").value = "";
    document.querySelector("#excel-input").click();
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h3">Tất cả từ vựng</Typography>
        {
          <Box>
            <Button
              sx={{ mr: 1 }}
              onClick={exportExcelTemplate}
              variant="outlined"
              color="success"
            >
              Lấy mẫu Excel
            </Button>
            <Button
              onClick={handleInsertBtnClick}
              variant="contained"
              color="success"
            >
              Nhập Excel
            </Button>
            <input
              hidden
              type="file"
              id="excel-input"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
            />
          </Box>
        }
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
