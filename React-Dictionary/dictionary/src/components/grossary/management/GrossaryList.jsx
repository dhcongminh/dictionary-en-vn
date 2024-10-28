import { useTheme } from "@emotion/react";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import React from "react";
import DataContainer from "../../../api/DictionaryApiCall";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Authentication from "../../../others/Authentication";

const GrossaryList = ({
  grossaryList,
  setCurrentPage,
  setGrossaryDetail,
  setIsLoading,
  setAction,
  fetchAllWord,
}) => {
  var rows = grossaryList ? [...grossaryList] : [];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleView = (word) => {
    setIsLoading(true);
    DataContainer.getGrossaryByEnglishWord(word)
      .then((data) => {
        setGrossaryDetail(data);
        setCurrentPage(1);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error(err.message);
        setIsLoading(false);
      });
  };

  const handleEdit = (wordid) => {
    setIsLoading(true);
    setAction("Chỉnh sửa");
    DataContainer.getGrossaryByWordId(wordid)
      .then((data) => {
        setGrossaryDetail(data);
        setCurrentPage(2);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error(err.message);
        setIsLoading(false);
      });
  };
  const handleDelete = (wordid) => {
    Swal.fire({
      title: "Xác nhận tắt trạng thái từ?",
      text: "Từ này sẽ không được hiển thị đối với tất cả người dùng!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonText: "Hủy",
      confirmButtonText: "Có",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        DataContainer.DeleteWord(wordid)
          .then((data) => {
            Swal.fire({
              title: "Hoàn thành!",
              text: "Từ này đã bị ẩn đối với tất cả người dùng.",
              icon: "success",
            });
            fetchAllWord();
          })
          .catch((err) => {
            console.log(err);
            Swal.fire({
              title: "Thất bại!",
              text: "Có lỗi xảy ra.",
              icon: "error",
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    });
  };
  const handleRestore = (wordid) => {
    Swal.fire({
      title: "Xác nhận bật trạng thái từ?",
      text: "Từ này sẽ được hiển thị đối với tất cả người dùng!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonText: "Hủy",
      confirmButtonText: "Có",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        DataContainer.RestoreWord(wordid)
          .then((data) => {
            Swal.fire({
              title: "Hoàn thành!",
              text: "Từ này đã hiển thị đối với tất cả người dùng.",
              icon: "success",
            });
            fetchAllWord();
          })
          .catch((err) => {
            console.log(err);
            Swal.fire({
              title: "Thất bại!",
              text: "Có lỗi xảy ra.",
              icon: "error",
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    });
  };
  return (
    <TableContainer sx={{ mt: 3 }} component={Paper}>
      {rows.length === 0 && (
        <Box
          sx={{ width: "100%", textAlign: "center", py: 3, color: "tomato" }}
        >
          No data
        </Box>
      )}
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell>STT</TableCell>
            <TableCell>Từ tiếng anh</TableCell>
            <TableCell>Dịch nhanh</TableCell>
            <TableCell align="center">Trạng thái</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.wordText}
              </TableCell>
              <TableCell style={{ width: 160 }}>
                {row.shortDefinition}
              </TableCell>
              <TableCell style={{ width: 160 }} align="center">
                <Chip
                  label={row.status}
                  color={
                    row.status.toLowerCase() === "active"
                      ? "success"
                      : row.status.toLowerCase() === "inactive"
                      ? "error"
                      : row.status.toLowerCase() === "pending"
                      ? "warning"
                      : "default"
                  }
                />
              </TableCell>
              <TableCell style={{ width: 260 }} align="right">
                <Button
                  onClick={() => handleEdit(row.id)}
                  sx={{ mr: 1 }}
                  variant="outlined"
                  color="primary"
                >
                  Sửa
                </Button>

                {Authentication.isAdmin() && (
                  <>
                    {row.status === "active" ? (
                      <Button
                        onClick={() => handleDelete(row.id)}
                        sx={{ mr: 1 }}
                        variant="outlined"
                        color="error"
                      >
                        Tắt
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleRestore(row.id)}
                        sx={{ mr: 1 }}
                        variant="outlined"
                        color="success"
                      >
                        Bật
                      </Button>
                    )}
                  </>
                )}

                <Button
                  onClick={() => handleView(row.wordText)}
                  sx={{ mr: 1 }}
                  variant="outlined"
                  color="information"
                >
                  <RemoveRedEyeIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default GrossaryList;
