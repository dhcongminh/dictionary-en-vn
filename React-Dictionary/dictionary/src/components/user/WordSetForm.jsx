import React, { useEffect, useState } from "react";
import DataContainer from "../../api/DictionaryApiCall";

const WordSetForm = ({
  setCollectionName,
  collectionName,
  setWordsInCollection,
  wordsInCollection,
}) => {
  const [wordList, setWordList] = useState([]);

  useEffect(() => {
    DataContainer.getAllWord().then((res) => {
      setWordList(res.data);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (wordList) {
      new window.MultiSelectTag("words", {
        onChange: function (data) {
          console.log(data);
          setWordsInCollection(data.map(x => x.value));
        },
        placeholder: "Tìm kiếm",
      });
    }
    return () => {
      document.querySelectorAll(".mult-select-tag").forEach((e) => e.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordList]);
  return (
    <div>
      <div style={{ margin: "1rem 0" }} className="form-group">
        <label htmlFor="name">Tên bộ từ</label>
        <input
          className="form-control"
          id="name"
          placeholder="hoa quả, thời tiết, ..."
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
        />
      </div>
      <div style={{ margin: "1rem 0" }} className="form-group">
        <div className="mb-3">
          <label htmlFor="words" className="form-label">
            Chọn từ
          </label>
          <select name="wordsSelect" id="words" multiple>
            {wordList.map((w, index) => (
              <option
                selected={wordsInCollection.includes(w.wordText)}
                key={index}
                value={w.wordText}
              >
                {w.wordText}
              </option>
            ))}
          </select>
          <span className="form-message text-danger"></span>
        </div>
      </div>
    </div>
  );
};

export default WordSetForm;
