const Authentication = {};

Authentication.clearLocalStorage = () => {
  localStorage.removeItem("AUTH__TOKEN");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("expireDate");
  localStorage.removeItem("userId");
}

Authentication.isValid = () => {
  var isValid = true;
  if (
    !localStorage.getItem("AUTH__TOKEN") ||
    !localStorage.getItem("username") ||
    !localStorage.getItem("role") ||
    !localStorage.getItem("expireDate") ||
    !localStorage.getItem("userId")    
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

export default Authentication;
