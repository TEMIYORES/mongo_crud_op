const jwt = require("jsonwebtoken");
const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;
  //   Check for user with the refreshToken
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) return res.sendStatus(403);
  //   verify Jwt
  await jwt.verify(
    foundUser.refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || foundUser.username !== decoded.username) {
        res.sendStatus(403);
      }
      const roles = Object.values(foundUser.roles);
      //   Create Jwts
      const accessToken = jwt.sign(
        { userInfo: { username: foundUser.username, roles: roles } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "2m" }
      );
      res.json({ accessToken });
    }
  );
};

module.exports = handleRefreshToken;
