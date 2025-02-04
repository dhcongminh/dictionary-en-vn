import axios from "axios";
import Authentication from "../others/Authentication";

const DataContainer = {};

const BaseAddress = "https://dictionaryapi.fly.dev/api/v1";

DataContainer.getGrossaryByEnglishWord = async (text) => {
  try {
    const res = await axios.get(BaseAddress + "/word/en/" + text);
    return res.data;
  } catch (err) {
    console.log(err);
  }
}
DataContainer.lookup = async (text, username) => {
  try {
    const res = await axios.get(BaseAddress + "/word/en-vi/" + text + "?username=" + username);
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
    const res = await axios.get(BaseAddress + "/word");
    return res.data;
  } catch (err) {
    console.log(err);
  }
}
DataContainer.changeUserPassword = async (username, newPassword) => {
  try {
    let config = {
      headers: {
        "Authorization": `${localStorage.getItem("AUTH__TOKEN")}`,
      }
    }
    const res = await axios.post(BaseAddress + `/Auth/password-change?username=${username}&newPassword=${newPassword}`, null, config);
    return res;
  } catch (error) {
    console.log(error);
  }
}
DataContainer.getAllSet = async () => {
  try {
    let config = {
      headers: {
        "Authorization": `${localStorage.getItem("AUTH__TOKEN")}`,
      }
    }
    const res = await axios.get(BaseAddress + `/user/wordset?username=${Authentication.username()}`, config);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}
DataContainer.getSet = async (setId) => {
  try {
    let config = {
      headers: {
        "Authorization": `${localStorage.getItem("AUTH__TOKEN")}`,
      }
    }
    const res = await axios.get(BaseAddress + `/user/get-set?username=${Authentication.username()}&setId=${setId}`, config);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}
DataContainer.deleteSet = async (setId) => {
  try {
    let config = {
      headers: {
        "Authorization": `${localStorage.getItem("AUTH__TOKEN")}`,
      }
    }
    const res = await axios.delete(BaseAddress + `/user/delete-set?username=${Authentication.username()}&setId=${setId}`, config);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}
DataContainer.createNewSet =  async (nameOfSet) => {
  try {
    let config = {
      headers: {
        "Authorization": `${localStorage.getItem("AUTH__TOKEN")}`,
      }
    }
    const res = await axios.post(BaseAddress + `/user/create-new-set?username=${Authentication.username()}&setsName=${encodeURIComponent(nameOfSet)}`, null, config);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}
DataContainer.addListWordToSet =  async (setId, wordList) => {
  try {
    let config = {
      headers: {
        "Authorization": `${localStorage.getItem("AUTH__TOKEN")}`,
      }
    }
    const res = await axios.post(BaseAddress + `/user/set-word-list-to-set/${setId}`, wordList, config);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}
DataContainer.updateSet =  async (setId, wordList, setName) => {
  try {
    let config = {
      headers: {
        "Authorization": `${localStorage.getItem("AUTH__TOKEN")}`,
      }
    }
    const res = await axios.put(BaseAddress + `/user/update-set/${setId}?setName=${setName}&username=${Authentication.username()}`, wordList, config);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

DataContainer.getGrossariesByUserAdded = async (uid) => {
  try {
    let config = {
      headers: {
        "Authorization": `${localStorage.getItem("AUTH__TOKEN")}`,
      }
    }
    const res = await axios.get(BaseAddress + "/word/u/" + uid, config);
    return res.data;
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
    const res = await axios.post(BaseAddress + "/word", word, config);
    return res.data;
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
    const res = await axios.put(BaseAddress + "/word/" + wid, word, config);
    return res.data;
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
    const res = await axios.delete(BaseAddress + "/word/" + wid, config);
    return res.data;
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
    const res = await axios.put(BaseAddress + "/word/restore/" + wid, {}, config);
    return res.data;
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
    const res = await axios.post(BaseAddress + "/word/request-add-word", data, config);
    return res.data;
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
    const res = await axios.put(BaseAddress + "/word/request-update-added-word/" + wid, data, config);
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
    return res.data;
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