import express  from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import bodyParser from "body-parser";
import input from "./routes/input.js";

const app = express();
const port = process.env.PORT || 3000;

const handle = handlebars.create({ 
    defaultLayout: 'main',
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use(express.static('public'));
app.engine('handlebars', handle.engine);
app.set('view engine', 'handlebars');

app.use(input);

const mongoDBURI = "mongodb+srv://joaopdiasventura:Jpplay2_0@cluster0.7i4iw97.mongodb.net/equalinomic";

mongoose.connect(mongoDBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Conexão com o MongoDB Atlas estabelecida com sucesso.");
    app.listen(port, () => {
      console.log(`SERVIDOR RODANDO NA PORTA ${port}`);
    });
  })
  .catch((error) => {
    console.error("Erro na conexão com o MongoDB:", error);
});