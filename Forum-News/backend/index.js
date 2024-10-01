const express = require("express");
const cors = require("cors");
const db = require("./db/conn");
const user = require("./routers/UserRoutes");
const post = require("./routers/PostRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.static("public"));

app.use("/users", user);
app.use("/posts", post);

db.sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Não foi possível conectar ao banco de dados:", err);
  });
