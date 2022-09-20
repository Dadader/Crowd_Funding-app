// const http = require("http");
const app = require("./app");
// const config = require("config");
require("dotenv").config();
var cors = require("cors");
app.use(cors());

// if (!config.get("jwtPrivateKey")) {
//   console.error("FATAL ERROR:jwtPrivateKEy is not defined.");
//   process.exit(1);
// }
//const server = http.createServer(app);
if (!process.env.TOKEN_KEY) {
  console.error("FATAL ERROR:jwtPrivateKEy is not defined.");
  process.exit(1);
}
const PORT = process.env.PORT || 3080;


app.listen(PORT, () => {
  console.log("Sever is now listening at port 3300");
});
