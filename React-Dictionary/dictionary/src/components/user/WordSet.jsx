import { Box, Button, Container, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Flashcards from "./Flashcards";
import WordSetForm from "./WordSetForm";
import DataContainer from "../../api/DictionaryApiCall";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Authentication from "../../others/Authentication";
import { useNavigate } from "react-router-dom";

const WordSet = ({ setIsLoading }) => {
  const nav = useNavigate();
  const [collectionName, setCollectionName] = useState("");
  const [wordCollection, setWordCollection] = useState(null);
  const [wordsInCollection, setWordsInCollection] = useState([]);
  const [action, setAction] = useState("");
  const [open, setOpen] = useState(false);
  const [editingSetId, setEditingSetId] = useState(0);
  const handleOpen = () => {
    setAction("add");
    setCollectionName("");
    setWordsInCollection([]);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (collectionName.trim() && wordsInCollection.length) {
      setIsLoading(true);
      if (action === "add") {
        DataContainer.createNewSet(collectionName)
          .then((data) => {
            console.log(data);
            DataContainer.addListWordToSet(
              data.id,
              wordsInCollection
            )
              .then((data) => {
                Swal.fire({
                  icon: "success",
                  title: "Thành công",
                  text: "Thêm bộ từ mới thành công!",
                });
              })
              .catch((err) => {
                toast.error(err.message);
                console.log(err);
              });
          })
          .catch((err) => {
            toast.error(err.message);
            console.log(err);
          })
          .finally(() => {
            setIsLoading(false);
            handleClose();
            fetchWordCollection();
          });
      } else if (action === "edit") {
        DataContainer.updateSet(
          editingSetId,
          wordsInCollection,
          collectionName
        )
          .then((data) => {
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "Chỉnh sửa thành công!",
            });
          })
          .catch((err) => {
            toast.error(err.message);
            console.log(err);
          })
          .finally(() => {
            setIsLoading(false);
            handleClose();
            fetchWordCollection();
          });
      }
    } else {
      toast.warning("Vui lòng điền đầy đủ thông tin.");
    }
  };
  function handleOpenEditForm(setId) {
    setEditingSetId(setId);
    setAction("edit");
    setIsLoading(true);
    DataContainer.getSet(setId)
      .then((data) => {
        setCollectionName(data.nameOfSet);
        setWordsInCollection(data.words.map((x) => x.wordText));
        console.log(data);
      })
      .catch((err) => {
        toast.error(err.message);
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
        setOpen(true);
      });
  }
  function fetchWordCollection() {
    DataContainer.getAllSet()
      .then((data) => {
        console.log(data);
        setWordCollection(data);
      })
      .catch((err) => {
        toast.error(err.message);
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }
  useEffect(() => {
    if (!Authentication.isValid()) {
      nav("/");
      window.location.reload();
    }
    fetchWordCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  };
  return (
    <Container sx={{ mt: 5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4">Flashcards</Typography>
        <Button onClick={handleOpen} variant="outlined" color="primary">
          Tạo bộ từ mới
        </Button>
      </Box>
      <Box>
        <Flashcards
          wordCollection={wordCollection}
          setIsLoading={setIsLoading}
          fetchWordCollection={fetchWordCollection}
          handleOpenEditForm={handleOpenEditForm}
        />
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box onSubmit={handleSubmit} component={"form"} sx={{ ...style }}>
          <div>
            <WordSetForm
              collectionName={collectionName}
              setCollectionName={setCollectionName}
              setWordsInCollection={setWordsInCollection}
              wordsInCollection={wordsInCollection}
            />
          </div>
          <Button variant="contained" type="submit">
            Lưu
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default WordSet;
