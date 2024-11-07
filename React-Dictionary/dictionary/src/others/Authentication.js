const Authentication = {};

Authentication.clearLocalStorage = () => {
  localStorage.removeItem("AUTH__TOKEN");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("expireDate");
  localStorage.removeItem("userId");
  localStorage.removeItem("userEmail");
}

Authentication.isValid = () => {
  var isValid = true;
  if (
    !localStorage.getItem("AUTH__TOKEN") ||
    !localStorage.getItem("username") ||
    !localStorage.getItem("role") ||
    !localStorage.getItem("expireDate") ||
    !localStorage.getItem("userId") ||
    !localStorage.getItem("userEmail")    
  ) {
    Authentication.clearLocalStorage();
    isValid = false;
  }
  if (Date.now() > localStorage.getItem("expireDate")) {
    Authentication.clearLocalStorage();
    isValid = false;
  }

  return isValid;
};

Authentication.isAdmin = () => {
  return (
    localStorage.getItem("role") &&
    localStorage.getItem("role") === "Admin system"
  );
};

Authentication.username = () => {
  return localStorage.getItem("username");
}
Authentication.userId = () => {
  return localStorage.getItem("userId");
}
Authentication.userEmail = () => {
  return localStorage.getItem("userEmail");
}

export default Authentication;
