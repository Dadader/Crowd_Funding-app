const express = require("express");
const router = express.Router();
const client = require("../connection/connection");

router.use(express.json());
const auth = require("../middleware/auth");



router.get("/usercampaigndetails",auth, (req, res) => {
    const user=req.user.email;
    

    client.query(
        `SELECT *,(DATE_PART('day', "C_END_DATETIME" - CURRENT_TIMESTAMP) * 24 + DATE_PART('hour', "C_END_DATETIME" - CURRENT_TIMESTAMP)) as d FROM "CAMPAIGNS" FULL JOIN (select "CAMPAIGN",count("USER"),SUM ("funds") from "Back" group by "CAMPAIGN") A ON "CAMPAIGN"="C_ID",(select first_name,last_name,email from "users" ) b WHERE "U_ID"="email" and "U_ID"= $1 order by"C_START_DATETIME" desc` ,
        [user],
        (error, result) => {
            if(!error){
                res.status(200).send(result.rows);
                console.log("Project list retrive successful");
            }
            else{
                res.status(400).send("error");
                console.log("project list not get");
            }
        }
      );
  });

  module.exports = router;