import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Modal,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
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
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    width: 700,
    borderRadius: 3
  };
  const [open, setOpen] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [words, setWords] = useState([]);
  const [currIndex, setCurrIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [nameOfCollection, setNameOfCollection] = useState("");
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
  function handleNext() {
    setIsFlipped(false);
    if (currIndex < words.length - 1) setCurrIndex(currIndex + 1);
  }
  function handlePrev() {
    setIsFlipped(false);
    if (currIndex > 0) setCurrIndex(currIndex - 1);
  }
  useEffect(() => {
    if (words.length) {
      setFront(words[currIndex].wordText);
      setBack(words[currIndex].shortDefinition);
    }
  }, [currIndex, words]);
  function handleLearnFlashcard(w) {
    setCurrIndex(0);
    DataContainer.getSet(w.id).then((data) => {
      setNameOfCollection(w.nameOfSet);
      setWords(data.words);
      setFront(data.words[0].wordText);
      setBack(data.words[0].shortDefinition);
    });
    setOpen(true);
  }
  return (
    <div className="mt-3">
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ ...style, height: 600 }}>
          <Typography align="center" variant="h4">{nameOfCollection}</Typography>
          <div className="d-flex justify-content-center align-items-center mt-3">
            <Button onClick={handlePrev} variant="contained" type="submit">
              Trước
            </Button>
            <Flashcard isFlipped={isFlipped} setIsFlipped={setIsFlipped} frontText={front} backText={back} />
            <Button onClick={handleNext} variant="contained" type="submit">
              Sau
            </Button>
          </div>
          <Typography align="center" variant="h4">{currIndex + 1}/{words.length}</Typography>
        </Box>
      </Modal>
      {wordCollection && wordCollection.length ? (
        wordCollection.map((w) => (
          <Card key={w.id} sx={{ maxWidth: 275, mb: 3 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {w.nameOfSet}
              </Typography>
            </CardContent>
            <CardActions
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button onClick={() => handleLearnFlashcard(w)} size="small">
                Học với Flashcard
              </Button>
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
    </div>
  );
};

export default Flashcards;
