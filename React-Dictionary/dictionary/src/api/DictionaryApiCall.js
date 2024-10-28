import axios from "axios";

const DataContainer = {};

const BaseAddress = "https://localhost:7268/api/v1";

DataContainer.getGrossaryByEnglishWord = async (text) => {
  try {
    const res = await axios.get(BaseAddress + "/word/en/" + text);
    return res.data;
  } catch (err) {
    console.log(err);
  }
}
DataContainer.getGrossaryByWordId = async (wid) => {
  try {
    const res = await axios.get(BaseAddress + "/word/" + wid);
    return res.data;
  } catch (err) {
    console.log(err);
  }
}
DataContainer.getAllWord = async () => {
  try {
    const res = axios.get(BaseAddress + "/word");
    return res;
  } catch (err) {
    console.log(err);
  }
}

DataContainer.getGrossariesByUserAdded = async (uid) => {
  try {
    let config = {
      headers: {
        "Authorization": `${localStorage.getItem("AUTH__TOKEN")}`,
      }
    }
    const res = axios.get(BaseAddress + "/word/u/" + uid, config);
    return res;
  } catch (err) {
    console.log(err);
  }
}
DataContainer.AddWord = async (word) => {
  try {
    let config = {
      headers: {
        "Authorization": `${localStorage.getItem("AUTH__TOKEN")}`,
      }
    }
    const res = axios.post(BaseAddress + "/word", word, config);
    return res;
  } catch (err) {
    console.log(err);
  }
}

DataContainer.UpdateWord = async (wid, word) => {
  try {
    let config = {
      headers: {
        "Authorization": `${localStorage.getItem("AUTH__TOKEN")}`,
      }
    }
    const res = axios.put(BaseAddress + "/word/" + wid, word, config);
    return res;
  } catch (err) {
    console.log(err);
  }
}

DataContainer.DeleteWord = async (wid) => {
  try {
    let config = {
      headers: {
        "Authorization": `${localStorage.getItem("AUTH__TOKEN")}`,
      }
    }
    const res = axios.delete(BaseAddress + "/word/" + wid, config);
    return res;
  } catch (err) {
    console.log(err);
  }
}
DataContainer.RestoreWord = async (wid) => {
  try {
    let config = {
      headers: {
        "Authorization": `${localStorage.getItem("AUTH__TOKEN").trim()}`,
      }
    }
    const res = axios.put(BaseAddress + "/word/restore/" + wid, {}, config);
    return res;
  } catch (err) {
    console.log(err);
  }
}
DataContainer.RequestAddWord = async (data) => {
  try {
    let config = {
      headers: {
        "Authorization": `${localStorage.getItem("AUTH__TOKEN")}`,
      }
    }
    const res = axios.post(BaseAddress + "/word/request-add-word", data, config);
    return res;
  } catch (err) {
    console.log(err);
  }
}
DataContainer.RequestEditWord = async (wid, data) => {
  try {
    let config = {
      headers: {
        "Authorization": `${localStorage.getItem("AUTH__TOKEN")}`,
      }
    }
    const res = axios.put(BaseAddress + "/word/request-update-added-word/" + wid, data, config);
    return res;
  } catch (err) {
    console.log(err);
  }
}

DataContainer.Login = async (data) => {
  try {
    const res = await axios.post(BaseAddress + "/auth/login", data);
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

DataContainer.Register = async (data) => {
  try {
    const res = await axios.post(BaseAddress + "/auth/register", data);
    return res;
  } catch (err) {
    console.log(err);
  }
}

DataContainer.SendActivateLink = async (data) => {
  try {
    const res = await axios.post(BaseAddress + "/auth/send-confirmation/" + data);
    return res.data;
  } catch (err) {
    console.log(err);
  }
}


export default DataContainer;