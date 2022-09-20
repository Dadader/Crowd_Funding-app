const express = require("express");
const router = express.Router();
const query = require("../model/user.js");
const client = require("../connection/connection");

router.use(express.json());
const auth = require("../middleware/auth");


router.put("/editprofile/:p_id", (req, res) => {
    const {image, first_name,last_name,email} = req.body;
    console.log(req.body);
    client.query(
        `UPDATE public."user" SET image= $1, first_name = $2, last_name = $3 , email = $4  WHERE p_id = ${req.params.p_id} `,
     [email, first_name,last_name,image],
        (error, result) => {
            if(!error){
                res.status(200).send(result.rows);
                console.log("Edit successfully");
            }
            else{
                console.log(error);
                console.log("not updated");
            }
        }
      );
});

router.patch("/editprofile",auth, (req, res) => {
    const {image, first_name,last_name} = req.body;
    const user=req.user.email;
    client.query(
        `UPDATE public.users SET "C_IMAGE"= COALESCE($4,"C_IMAGE") ,first_name= COALESCE($2,first_name),last_name= COALESCE($3,last_name) WHERE email = $1`
        ,[user,first_name,last_name,image],
        (error, result) => {
            if(!error){
                res.status(200).send("ok");
                console.log("Edit successfully");
            }
            else{
                res.status(400).send(error.stack);
                console.log("not updated");
            }
        }
      );

  });

router.get("/useprofile",auth, (req, res) => {
   // const {image, first_name,last_name,email} = req.body;
   // console.log(req.body);
   //res.status(200).send(result.rows);
   const user=req.user.email;
    client.query(
        `SELECT * FROM public.users where email=$1`,
        [user],
        (error, result) => {
            if(!error){
                res.status(200).send(result.rows);
                console.log("Edit successfully");
            }
            else{
                res.send("kk");
                console.log(error);
                console.log("not updated");
            }
        }
      );
});

module.exports = router;