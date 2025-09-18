mkdir models controllers && touch router.js index.js
cd models && touch loginModel.js index.js && cd ..
cd controllers && touch loginController.js && cd ..

// index.js
import express from "express";

const app = express();
const PORT = 3000;
const router = require("./router");

app.use(express.json());

app.use(router);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}...`);
});