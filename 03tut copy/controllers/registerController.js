const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const handleNewUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username and password are required" });
  }
  //   Check for duplicate users in the database
  const duplicate = usersDB.users.find(
    (person) => person.username === username
  );
  if (duplicate) {
    return res.status(409).json({ message: "username already exists!" });
  }
  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);

    // store new user
    const newUser = {
      id: usersDB.users.length + 1,
      roles: {
        User: "8901",
      },
      username: username,
      password: hashedPwd,
    };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    res.status(201).json({ success: "New user created successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = handleNewUser;
