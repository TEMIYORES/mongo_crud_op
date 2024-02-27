const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const handleUserAuth = async (req, res) => {
  console.log("hello");
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username and password are required" });
  }
  const foundUser = usersDB.users.find(
    (person) => person.username === username
  );
  if (!foundUser) {
    return res.status(401).json({ message: "User not Authorized!" });
  }
  //   evaluate Password
  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) {
    return res.status(401).json({ message: "User not Authorized!" });
  }
  const roles = Object.values(foundUser.roles);
  //   Create Jwts
  const accessToken = jwt.sign(
    { userInfo: { username: foundUser.username, roles: roles } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "2m" }
  );
  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  //   Storing refreshToken with user
  const updatedUser = { ...foundUser, refreshToken };
  const otherUsers = usersDB.users.filter(
    (person) => person.username !== updatedUser.username
  );
  const unsortedUsers = [...otherUsers, updatedUser];
  usersDB.setUsers(
    unsortedUsers.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );
  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "users.json"),
    JSON.stringify(usersDB.users)
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "None",
    secure: true,
  });
  return res.status(200).json({ accessToken });
};

module.exports = handleUserAuth;
