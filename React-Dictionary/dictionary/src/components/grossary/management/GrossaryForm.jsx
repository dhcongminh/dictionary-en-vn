import { Box, Button, Chip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Authentication from "../../../others/Authentication";
import DataContainer from "../../../api/DictionaryApiCall";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const GrossaryForm = ({
  grossaryDetail,
  setCurrentPage,
  action,
  setAction,
  setIsLoading,
  fetchAllWord,
}) => {
  const [word, setWord] = useState(grossaryDetail);
  const [words, setWords] = useState([]);
  const [wordText, setWordText] = useState(
    grossaryDetail ? grossaryDetail.wordText : ""
  );
  const [shortDefinition, setShortDefinition] = useState(
    grossaryDetail ? grossaryDetail.shortDefinition : ""
  );
  const [phonetic, setPhonetic] = useState(
    grossaryDetail ? grossaryDetail.phonetic : ""
  );
  const [status, setStatus] = useState(
    grossaryDetail
      ? grossaryDetail.status
      : Authentication.isAdmin()
      ? ""
      : "pending"
  );
  const [duplicated, setDuplicated] = useState([]);

  useEffect(() => {
    FetchAllActiveAndPendingOfUserWord();
    if (grossaryDetail === null) {
      var userId = Authentication.userId();
      setWord({
        wordText: "",
        shortDefinition: "",
        phonetic: "",
        addByUser: userId,
        status: "",
        wordDefinitions: [
          {
            type: "",
            definitions: {
              detail: "",
              examples: [""],
            },
          },
        ],
        antonyms: [],
        synonyms: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  useEffect(() => {
    new window.MultiSelectTag("antonyms", {
      onChange: function (data) {
        handleAntonymsChange(data.map((x) => x.value));
      },
      placeholder: "Tìm kiếm",
    });
    new window.MultiSelectTag("synonyms", {
      onChange: function (data) {
        handleSynonymsChange(data.map((x) => x.value));
      },
      placeholder: "Tìm kiếm",
    });
    return () => {
      document.querySelectorAll(".mult-select-tag").forEach((e) => e.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words]);

  useEffect(() => {
    if (word === null) return;
    word.wordText = wordText;
    word.shortDefinition = shortDefinition;
    word.phonetic = phonetic;
    word.status = status;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordText, shortDefinition, phonetic, status]);

  function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    var errors = ValidateWordInfo();
    if (errors.length > 0) {
      var errorstr = "<ul class='list-group list-group-flush'>";
      errors.forEach(
        (e) =>
          (errorstr += `<li  class="list-group-item list-group-item-outline text-start text-secondary fs-6">${e}</li>`)
      );
      errorstr += "</ul>";
      Swal.fire({
        title: "Giá trị không hợp lệ",
        icon: "warning",
        confirmButtonText: "Đóng",
        html: errorstr,
      });
      setIsLoading(false);
      return;
    }
    if (Authentication.isAdmin()) {
      if (action === "Thêm") {
        DataContainer.AddWord(word)
          .then((res) => {
            toast.success("Thêm từ thành công.");
            setAction("Chỉnh sửa");
            setCurrentPage(0);
          })
          .catch((err) => {
            toast.error(err.message);
          })
          .finally(() => {
            setIsLoading(false);
            setWord({ ...word });
            fetchAllWord();
          });
      } else if (action === "Chỉnh sửa") {
        DataContainer.UpdateWord(word.id, word)
          .then((res) => {
            toast.success("Chỉnh sửa từ thành công.");
            setAction("Chỉnh sửa");
            setCurrentPage(0);
          })
          .catch((err) => {
            toast.error(err.message);
          })
          .finally(() => {
            setIsLoading(false);
            setWord({ ...word });
            fetchAllWord();
          });
      }
    } else {
      if (action === "Thêm") {
        DataContainer.RequestAddWord(word)
          .then((res) => {
            Swal.fire({
              title: "Thành công",
              icon: "success",
              text: "Từ thêm thành công nhưng sẽ không được hiển thị ở mục tra cứu cho đến khi được chấp nhận bởi Quản trị hệ thống.",
              showCloseButton: false,
            });
            setAction("Chỉnh sửa");
            setCurrentPage(0);
          })
          .catch((err) => {
            toast.error(err.message);
          })
          .finally(() => {
            setIsLoading(false);
            setWord({ ...word });
            fetchAllWord();
          });
      } else if (action === "Chỉnh sửa") {
        DataContainer.RequestEditWord(word.id, word)
          .then((res) => {
            Swal.fire({
              title: "Thành công",
              icon: "success",
              text: "Từ được sửa thành công nhưng sẽ không hiển thị ở mục tra cứu cho đến khi được chấp nhận bởi Quản trị hệ thống.",
              showCloseButton: false,
            });
            setAction("Chỉnh sửa");
            setCurrentPage(0);
          })
          .catch((err) => {
            toast.error(err.message);
          })
          .finally(() => {
            setIsLoading(false);
            setWord({ ...word });
            fetchAllWord();
          });
      }
    }
  }
  function ValidateWordInfo() {
    var errors = [];
    for (const d of word.wordDefinitions) {
      if (!d.type || d.type === "") {
        errors.push("Loại từ không được phép để trống.");
        break;
      }
    }
    if (word.wordText === "") {
      errors.push("Từ tiếng anh không được phép để trống.");
    }
    if (duplicated.length > 0) {
      errors.push(
        `(Các) từ [<span class="fw-bold">${duplicated}</span>] không thể cùng lúc là từ trái nghĩa và từ đồng nghĩa của từ <span class="fw-bold">${word.wordText}</span>`
      );
    }
    if (word.status === "") {
      errors.push("Vui lòng chọn trạng thái từ.");
    }

    if (word.shortDefinition === "") {
      errors.push("Vui lòng thêm nghĩa phổ biến cho từ: Dịch nhanh.");
    }

    if (word.phonetic === "") {
      errors.push("Phiên âm không được phép để trống.");
    }

    return errors;
  }
  function handleAddExample(defindex) {
    var existedExample = word.wordDefinitions[defindex].definitions.examples;
    var examplesLength = existedExample.length;
    if (examplesLength > 2) {
      toast.info("Mỗi giải nghĩa bao gồm tối đa 3 ví dụ.");
      return;
    }
    word.wordDefinitions[defindex].definitions.examples = [
      ...existedExample,
      "",
    ];
    setWord({ ...word });
  }
  function handleAddDefinition() {
    var existedWordDefinitions = word.wordDefinitions;
    var length = existedWordDefinitions.length;
    if (length > 2) {
      toast.info("Mỗi từ vựng bao gồm tối đa 3 giải nghĩa.");
      return;
    }
    word.wordDefinitions = [
      ...existedWordDefinitions,
      {
        type: "",
        definitions: {
          detail: "",
          examples: [""],
        },
      },
    ];
    setWord({ ...word });
  }
  function handleRemoveDef(defindex) {
    var existedWordDefinitions = word.wordDefinitions;
    const updatedWordDefinitions = existedWordDefinitions.filter(
      (_, index) => index !== defindex
    );
    word.wordDefinitions = [...updatedWordDefinitions];
    setWord({ ...word });
  }
  function handleRemoveExample(defindex, exindex) {
    word.wordDefinitions[defindex].definitions.examples = word.wordDefinitions[
      defindex
    ].definitions.examples.filter((_, index) => index !== exindex);
    setWord({ ...word });
  }
  function handleTypeChange(defindex, e) {
    word.wordDefinitions[defindex].type = e.target.value;
  }
  function handleDefinitionDetailChange(defindex, e) {
    word.wordDefinitions[defindex].definitions.detail = e.target.value;
  }
  function handleExampleChange(defindex, exindex, e) {
    word.wordDefinitions[defindex].definitions.examples[exindex] =
      e.target.value;
  }
  function handleAntonymsChange(words) {
    word.antonyms = words;
    setWord({ ...word });

    setDuplicated([...words.filter((item) => word.synonyms.includes(item))]);
  }
  function handleSynonymsChange(words) {
    word.synonyms = words;
    setWord({ ...word });
    setDuplicated([...words.filter((item) => word.antonyms.includes(item))]);
  }
  function FetchAllActiveAndPendingOfUserWord() {
    setIsLoading(true);
    DataContainer.getAllWord()
      .then((res) => {
        if (action === "Chỉnh sửa") {
          setWords(() => {
            var wordsAddByMember = res.data.filter((w) => w.userAdded.username === Authentication.username() && w.wordText !== grossaryDetail.wordText);
            var otherActiveWords = res.data.filter(w => w.status === "active");
            return [...new Set([...wordsAddByMember, ...otherActiveWords])];
          });
        } else {
          setWords(() => {
            var wordsAddByMember = res.data.filter((w) => w.userAdded.username === Authentication.username());
            var otherActiveWords = res.data.filter(w => w.status === "active");
            return [...new Set([...wordsAddByMember, ...otherActiveWords])];
          });
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Lỗi mạng...");
        setCurrentPage(0);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  function handleDefExampleChange(defindex, exindex, e) {
    var exs =
      word.wordDefinitions[defindex].definitions.examples[exindex].split(
        "@dhcongminh@"
      );
    if (exs.length > 0) {
      exs[1] = e.target.value.trim();
      word.wordDefinitions[defindex].definitions.examples[exindex] =
        exs[0] + "@dhcongminh@" + exs[1];
    } else {
      word.wordDefinitions[defindex].definitions.examples[exindex] +=
        "@dhcongminh@" + exs[1];
    }
  }
  return (
    <Box sx={{ mt: 3, position: "relative" }}>
      <button onClick={(e) => handleSubmit(e)} className="btn btn-primary position-absolute " style={{right: 0}}>
        Lưu
      </button>
      <Button
        onClick={() => setCurrentPage(0)}
        sx={{ position: "absolute", right: 60 }}
        variant="outlined"
      >
        Quay lại
      </Button>
      <div className="d-flex gap-3 align-content-center">
        <Typography variant="h5">
          {action} từ vựng{" "}
          {grossaryDetail && <Chip label={grossaryDetail.wordText} />}
        </Typography>
        {Authentication.isAdmin() && (
          <>
            <span className="text-secondary fw-bold">Add by</span>{" "}
            <Chip
              color="secondary"
              label={`@ ${
                grossaryDetail
                  ? grossaryDetail.userAdded.username
                  : Authentication.username()
              }`}
            />
          </>
        )}
      </div>

      <Box sx={{ mt: 3 }}>
        <form onSubmit={(event) => handleSubmit(event)} id="grossary-form">
          <div className="row">
            <div className="col-5">
              <div className="row">
                <div className="form-group col-6">
                  <div className="mb-3">
                    <label htmlFor="englishWord" className="form-label">
                      Từ tiếng anh <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="englishWord"
                      value={wordText}
                      onChange={(event) => {
                        setWordText(event.target.value);
                      }}
                    />
                    <span className="form-message text-danger"></span>
                  </div>
                </div>
                <div className="form-group col-6">
                  <div className="mb-3">
                    <label htmlFor="phoneticWord" className="form-label">
                      Phiên âm <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="phoneticWord"
                      value={phonetic}
                      onChange={(event) => setPhonetic(event.target.value)}
                    />
                    <span className="form-message text-danger"></span>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="mb-3">
                  <label htmlFor="shortDefinition" className="form-label">
                    Dịch nhanh <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="shortDefinition"
                    value={shortDefinition}
                    onChange={(event) => {
                      setShortDefinition(event.target.value);
                    }}
                  />
                  <span className="form-message text-danger"></span>
                </div>
              </div>
              <div className="form-group">
                <div className="mb-3">
                  <label htmlFor="wordStatus" className="form-label">
                    Trạng thái <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    aria-label="Trạng thái"
                    id="wordStatus"
                    name="status"
                    disabled={!Authentication.isAdmin()}
                    defaultValue={status}
                    onChange={(event) => setStatus(event.target.value)}
                  >
                    <option value=""></option>
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <span className="form-message text-danger"></span>
                </div>
              </div>

              <div className="form-group">
                <div className="mb-3">
                  <label htmlFor="antonyms" className="form-label">
                    Từ trái nghĩa
                  </label>
                  <select name="antonyms" id="antonyms" multiple>
                    {words &&
                      words.map((word, index) => (
                        <option
                          selected={
                            word.antonyms &&
                            word.antonyms.includes(word.wordText)
                          }
                          key={index}
                          value={word.wordText}
                        >
                          {word.wordText}
                        </option>
                      ))}
                  </select>
                  <span className="form-message text-danger"></span>
                </div>
              </div>
              <div className="form-group">
                <div className="mb-3">
                  <label htmlFor="synonyms" className="form-label">
                    Từ đồng nghĩa
                  </label>
                  <select name="synonyms" id="synonyms" multiple>
                    {words &&
                      words.map((word, index) => (
                        <option
                          selected={
                            word.synonyms &&
                            word.synonyms.includes(word.wordText)
                          }
                          key={index}
                          value={word.wordText}
                        >
                          {word.wordText}
                        </option>
                      ))}
                  </select>
                  <span className="form-message text-danger"></span>
                </div>
              </div>
            </div>
            <div className="col-7 border-start">
              <div className="d-flex gap-3">
                <h4 className="text-danger">
                  Nghĩa của từ <span className="text-danger">*</span>
                </h4>
                <button
                  id="add-detail-definition__btn"
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={handleAddDefinition}
                >
                  Tạo thêm nghĩa mới
                </button>
              </div>

              <div className="mt-3 detail-definition__container border-bottom">
                {word &&
                  word.wordDefinitions.map((def, defindex) => (
                    <div
                      key={"def" + Math.random()}
                      className="detail-definition__item"
                    >
                      <div className="d-flex gap-3">
                        <h6>
                          Chi tiết <span className="text-danger">*</span>
                        </h6>
                        {defindex !== 0 && (
                          <button
                            onClick={() => handleRemoveDef(defindex)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            Hủy
                          </button>
                        )}
                      </div>

                      <div className="form-group mt-3">
                        <div className="mb-3">
                          <select
                            type="text"
                            className="form-select"
                            aria-label="Loại từ"
                            defaultValue={def.type ? def.type : ""}
                            onChange={(event) =>
                              handleTypeChange(defindex, event)
                            }
                          >
                            <option value="">Loại từ</option>
                            <option value="Danh từ">Danh từ</option>
                            <option value="Tính từ">Tính từ</option>
                            <option value="Động từ">Động từ</option>
                            <option value="Trạng từ">Trạng từ</option>
                            <option value="Đại từ">Đại từ</option>
                            <option value="Từ hạn định">Từ hạn định</option>
                            <option value="Thán từ">Thán từ</option>
                            <option value="Liên từ">Liên từ</option>
                            <option value="Giới từ">Giới từ</option>
                          </select>
                          <span className="form-message text-danger"></span>
                        </div>
                      </div>

                      <div className="row">
                        <div className="form-group col-6 border-end">
                          <div className="mb-3">
                            <label
                              htmlFor="detailDefinition__0"
                              className="form-label"
                            >
                              Giải nghĩa <span className="text-danger">*</span>
                            </label>
                            <textarea
                              className="form-control"
                              id="detailDefinition__0"
                              rows="2"
                              defaultValue={
                                def.definitions ? def.definitions.detail : ""
                              }
                              onChange={(event) =>
                                handleDefinitionDetailChange(defindex, event)
                              }
                            ></textarea>
                            <span className="form-message text-danger"></span>
                          </div>
                        </div>
                        <div className="form-group col-6">
                          <div className="d-flex gap-3">
                            <div className="form-label">
                              Ví dụ cho giải nghĩa
                            </div>
                            <button
                              onClick={() => handleAddExample(defindex)}
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                            >
                              Tạo thêm ví dụ mới
                            </button>
                          </div>
                          <div className="example-container">
                            {def.definitions.examples.map(
                              (example, exindex) => (
                                <div
                                  key={"ex" + Math.random()}
                                  className="mb-3"
                                >
                                  {exindex !== 0 && (
                                    <button
                                      onClick={() =>
                                        handleRemoveExample(defindex, exindex)
                                      }
                                      className="btn btn-sm btn-outline-danger"
                                    >
                                      Xóa ví dụ
                                    </button>
                                  )}
                                  <textarea
                                    title="Ví dụ"
                                    className="form-control"
                                    rows="2"
                                    defaultValue={
                                      example.split("@dhcongminh@").length > 0
                                        ? example.split("@dhcongminh@")[0]
                                        : example
                                    }
                                    onChange={(event) =>
                                      handleExampleChange(
                                        defindex,
                                        exindex,
                                        event
                                      )
                                    }
                                  ></textarea>

                                  <textarea
                                    title="Dịch"
                                    className="form-control"
                                    rows="2"
                                    defaultValue={
                                      example.split("@dhcongminh@").length > 0
                                        ? example.split("@dhcongminh@")[1]
                                        : ""
                                    }
                                    onChange={(event) =>
                                      handleDefExampleChange(
                                        defindex,
                                        exindex,
                                        event
                                      )
                                    }
                                    placeholder="Nghĩa của ví dụ..."
                                  ></textarea>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </form>
      </Box>
    </Box>
  );
};

export default GrossaryForm;
