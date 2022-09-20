const express = require("express");
const router = express.Router();
const query = require("../model/user.js");
const client = require("../connection/connection");

router.use(express.json());
const auth = require("../middleware/auth");



router.get("/backedprojectdetails",auth, (req, res) => {
    const user=req.user.email;
    client.query(
        `SELECT * FROM "CAMPAIGNS" JOIN (select "CAMPAIGN",count("USER"), SUM ("funds")from "Back" where "USER" = $1 group by "CAMPAIGN") A ON "CAMPAIGN"="C_ID" JOIN (select first_name,last_name,email from "users" ) B ON "U_ID"="email" order by"C_START_DATETIME" desc` ,
        [user],(error, result) => {
            if(!error){
                res.status(200).send(result.rows);
                console.log("Project list retrive successful");
            }
            else{
                res.status(400).send(error);
                console.log("project list not get");
            }
        }
      );
  });

  router.get("/getuser_rewards",auth, (req, res) => {
    const user=req.user.email;
    client.query(
        `SELECT "C_NAME", "USER", "funds", "quantity","ITEM_NAME","ITEM_DESCRIPTION" from "Back" B JOIN "LISTOFITEMS" L ON "REWARD"="R_ID" JOIN "CAMPAIGNS" CA ON CA."C_ID"=L."C_ID" WHERE "USER"=$1` ,
        [user],(error, result) => {
            if(!error){
                res.status(200).send(result.rows);
                console.log("Project list retrive successful");
            }
            else{
                res.status(400).send(error);
                console.log("project list not get");
            }
        }
      );
  });


module.exports = router;