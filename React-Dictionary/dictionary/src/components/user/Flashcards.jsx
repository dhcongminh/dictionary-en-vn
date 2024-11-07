import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import React from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DataContainer from "../../api/DictionaryApiCall";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import Flashcard from "./Flashcard";
const Flashcards = ({
  wordCollection,
  setIsLoading,
  fetchWordCollection,
  handleOpenEditForm,
}) => {
  const handleDeleteSet = (setId) => {
    Swal.fire({
      icon: "warning",
      title: "Xác nhận xóa",
      text: "Bộ từ này sẽ bị xóa vĩnh viễn",
      showCancelButton: true,
      confirmButtonText: "Ok",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        DataContainer.deleteSet(setId)
          .then((data) => {
            var resultText = "";
            var resultTitle = "";
            var status = "";
            if (data === "Successfull") {
              status = "success";
              resultTitle = "Thành công";
              resultText = "Bộ từ được xóa thành công";
            } else {
              status = "error";
              resultTitle = "Thất bại";
              resultText = "Có lỗi xảy ra, vui lòng thử lại sau";
            }
            Swal.fire({
              icon: status,
              title: resultTitle,
              text: resultText,
            });
          })
          .catch((err) => {
            toast.error(err.message);
            console.log(err);
          })
          .finally(() => {
            setIsLoading(false);
            fetchWordCollection();
          });
      }
    });
  };
  return (
    <div className="mt-3">
      {wordCollection && wordCollection.length ? (
        wordCollection.map((w) => (
          <Card sx={{ maxWidth: 275, mb: 3 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {w.nameOfSet}
              </Typography>
            </CardContent>
            <CardActions
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button size="small">Học với Flashcard</Button>
              <Box>
                <DeleteForeverIcon
                  onClick={() => handleDeleteSet(w.id)}
                  sx={{ cursor: "pointer", color: "grey" }}
                />
                <EditIcon
                  onClick={() => handleOpenEditForm(w.id)}
                  sx={{ cursor: "pointer", color: "grey" }}
                />
              </Box>
            </CardActions>
          </Card>
        ))
      ) : (
        <>Chưa có bộ từ nào!</>
      )}
      <Flashcard frontText="Front Side Text" backText="Back Side Text" />
    </div>
  );
};

export default Flashcards;
