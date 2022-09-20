const { Client } = require("pg");
const client = new Client({
  host: "crowdfunding.crjd6am48cl6.us-east-1.rds.amazonaws.com",
  user: "postgres",
  port: 5432,
  password: "admin12345",
  database: "Crowd_funding",
});
// const { Client } = require("pg");
// const client = new Client({
//   host: "localhost",
//   user: "postgres",
//   port: 5432,
//   password: "admin",
//   database: "Crowd_funding",
// });

client
  .connect()
  .then(() => {
    console.log("Successfully connected to Database");
  })
  .catch((error) => {
    console.log("database connection failed. exiting now...");
    console.error(error);
    process.exit(1);
  });

module.exports = client;
