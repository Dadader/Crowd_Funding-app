const express = require("express");
const router = express.Router();
const query = require("../model/user.js");
const client = require("../connection/connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.use(express.json());


router.get("/hello", (req, res) => {
    client.query(query);
    res.status(200).send("ggg");
    client.end;
});
  

// Register
router.post("/register", (req, res) => {
    // Our register logic starts here
    try {
      // Get user input
      const { email, password } = req.body;
      console.log(email + " " + password);
      const first_name = "Zain";
      const last_name = "Shakir";
  
      // Validate user input
      if (!(email && password && first_name && last_name)) {
        res.status(400).send("All input is required");
      }
  
      // check if user already exist
      // Validate if user exist in our database
  
      client.query(
        `select * from users  where email='${email}'`,
        async (err, result) => {
          if (result.rows.length >= 1) {
            console.log("Email already exist");
            res.status(400);
            res.send("Email already exist");
          } else {
            //Encrypt user password
            encryptedPassword = await bcrypt.hash(password, 10);
  
            //     // Create user in our database
            //     const user = await User.create({
            //       first_name,
            //       last_name,
            //       email: email.toLowerCase(), // sanitize: convert email to lowercase
            //       password: encryptedPassword,
            //     });
  
            client.query(
              `INSERT INTO public.users(
                  first_name, last_name, email, password)
                  VALUES ('${first_name}', '${last_name}', '${email.toLowerCase()}', '${encryptedPassword}')`,
              (error, result) => {
                // Create token
                const token = jwt.sign(
                  { email: email, first_name: first_name },
                  process.env.TOKEN_KEY,
                  {
                    expiresIn: "2h",
                  }
                );
                res.status(201).send(token);
                console.log(token);
              }
            );
          }
        }
      );
  
      //     // save user token
      //     user.token = token;
  
      //     // return new user
      //     res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
    //   // Our register logic ends here
  });
  

// Login

router.post("/login", async (req, res) => {
    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      // const user = await User.findOne({ email });
      client.query(
        `select * from users  where email='${email}'`,
        async (err, result) => {
          if (result.rows.length > 0) {
            if (
              result &&
              (await bcrypt.compare(password, result.rows[0].password))
            ) {
              // Create token
              const token = jwt.sign(
                { email: email, first_name: result.rows[0].first_name },
                process.env.TOKEN_KEY,
                {
                  expiresIn: "365d",
                }
              );
              res.status(200).send(token);
            } else {
              res.status(400).send("Invalid Credentials");
            }
          } else {
            res.status(400).send("Invalid Credentials");
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });
  
  const auth = require("../middleware/auth");
  
  router.get("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 " + req.user.first_name);
  });

module.exports = router;
