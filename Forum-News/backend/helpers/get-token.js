const getToken = (req) => {
  const authHeader = req.headers.authorization;
  return authHeader ? authHeader.split(" ")[1] : null;
};

module.exports = getToken;
