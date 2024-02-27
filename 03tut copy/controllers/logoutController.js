require("dotenv").config();
const jwt = require("jsonwebtoken");
const path = require("path");
const fsPromises = require("fs").promises;
const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const handleLogout = async (req, res) => {
  // On Client Also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;
  //   Check for user with the refreshToken
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  //   Delete the RefreshToken from user
  foundUser.refreshToken = "";
  const otherUsers = usersDB.users.filter(
    (person) => person.refreshToken === refreshToken
  );
  const unsortUsers = [...otherUsers, foundUser];
  usersDB.setUsers(
    unsortUsers.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );

  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "users.json"),
    JSON.stringify(usersDB.users)
  );
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); //secure:true - in https
  res.sendStatus(204);
};

module.exports = handleLogout;
