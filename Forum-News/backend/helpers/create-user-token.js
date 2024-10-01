const jwt = require("jsonwebtoken");

const createUserToken = async (user, req, res) => {
  const token = jwt.sign(
    { name: user.username, id: user.idusers },
    "nossosecret",
    { expiresIn: "1h" }
  );

  res.status(200).json({
    message: "Você está autenticado",
    token: token,
    userId: user.idusers,
  });
};

module.exports = createUserToken;
