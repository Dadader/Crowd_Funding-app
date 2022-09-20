const express = require("express");
const router = express.Router();
const query = require("../model/user.js");
const client = require("../connection/connection");

router.use(express.json());
const auth = require("../middleware/auth");

router.get("/popularprojectdetails", (req,res) => {
    client.query(
        `select * from "CAMPAIGNS" ,(select "CAMPAIGN",count("USER"),SUM ("funds") from "Back" group by "CAMPAIGN") A,(select first_name,last_name,email from "users" ) b where "C_END_DATETIME" > CURRENT_TIMESTAMP AND "U_ID"="email" and "CAMPAIGN"="C_ID" and "count">50 AND "sum">"C_GOAL" order by "sum" desc`,
        (error, result) => {
            if(!error){
              if(result.rowCount==0){
                console.log("object");
                client.query(`select * from "CAMPAIGNS" ,(select "CAMPAIGN",count("USER"),SUM ("funds") from "Back" group by "CAMPAIGN") A,(select first_name,last_name,email from "users" ) b where "C_END_DATETIME" > CURRENT_TIMESTAMP and "U_ID"="email" and "CAMPAIGN"="C_ID" order by sum desc limit 3`,(error,result)=>{
                  if(!error){
                    res.status(200).send(result.rows);
                    console.log("Project list retrive successful");
                  }
                  else {
                    res.status(400).send("error");
                    console.log("Project list not retrive successful");
                  }
                });
              }else{
                res.status(200).send(result.rows);
                console.log("Project list retrive successful");
              }
            }
            else{
                res.status(400).send("error");
                console.log("project list not get");
            }
        }
      );
});

router.post("/comment",auth, (req, res) => {
  const {msg,cid} = req.body;
  const name=req.user.first_name;
  const email=req.user.email;
  
  client.query(
      `INSERT INTO public."Comments"(name, msg, "C_ID", "U_ID") VALUES ($1,$2,$3,$4)`
      ,[name, msg,cid,email],
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

router.post("/backed",auth, async(req, res) => {
  const {cid, amount,rid} = req.body;

  const user=req.user.email;
  console.log("object");
  await client.query(
      `SELECT * FROM public."Back" where "REWARD"=${rid} and "CAMPAIGN" =${cid} and "USER"= '${user}'`,
       async(error, result) => {
          if(!error){
           // console.log(result.rows);
           if(result.rowCount>0){
            var total=result.rows[0].funds;
            var quant=result.rows[0].quantity;
            total=parseInt(total)+amount;
            quant=parseInt(quant)+1;
            console.log(total);
            await client.query(
              `UPDATE public."Back" SET funds=${total}, quantity=${quant} WHERE "REWARD" =${rid}`,
               (error) => {
                if(!error){
                  res.send("ok");
                  return;
                }
                else{
                  res.send(error);
                  return;
                }
               });
           
           }
           else{
            await client.query(
              `INSERT INTO public."Back" ("USER", "CAMPAIGN", funds, quantity,"REWARD") VALUES('${user}','${cid}','${amount}',1,'${rid}')`,
               (error) => {
                if(!error){
                  res.send("ok");
                  return;
                }
                else{
                  res.send(error);
                  return;
                }
               });
           }
              // res.status(200).send("ok");
              //  console.log(result.rows);
              //  res.status(200).send("ok");
          }
          else{
              res.status(400).send(error.stack);
              console.log("not updated");
          }
      }
    );

});
router.get("/comments/:id", (req, res) => {
  const cid=req.params.id;
  
  client.query(
      `SELECT "msg","com_time","first_name" FROM public."Comments" JOIN public."users" ON "U_ID"="email" where "C_ID"=$1 order by com_time asc`,
      [cid],(error, result) => {
          if(!error){
              res.status(200).send(result.rows);
              console.log("Edit successfully");
          }
          else{
              res.status(400).send(error.stack);
              console.log("not updated");
          }
      }
    );

});

router.get("/getbackers/:id", (req, res) => {
  const cid=req.params.id;
  
  client.query(
      `SELECT "first_name","funds" FROM public."Back" JOIN public."users" ON "USER"="email" where "CAMPAIGN"=$1 order by funds asc`,
      [cid],(error, result) => {
          if(!error){
              res.status(200).send(result.rows);
              console.log("Edit successfully");
          }
          else{
              res.status(400).send(error.stack);
              console.log("not updated");
          }
      }
    );

});


router.get("/newprojectdetails", (req, res) => {
  client.query(
      `SELECT *,(DATE_PART('day', "C_END_DATETIME" - CURRENT_TIMESTAMP) * 24 + DATE_PART('hour', "C_END_DATETIME" - CURRENT_TIMESTAMP)) as d FROM "CAMPAIGNS" FULL JOIN (select "CAMPAIGN",count("USER"),SUM ("funds") from "Back" group by "CAMPAIGN") A ON "CAMPAIGN"="C_ID",(select first_name,last_name,email from "users" ) b WHERE "C_END_DATETIME" > CURRENT_TIMESTAMP and "U_ID"="email" and (DATE_PART('day', "C_END_DATETIME" - CURRENT_TIMESTAMP) * 24 + DATE_PART('hour', "C_END_DATETIME" - CURRENT_TIMESTAMP))>=72 order by"C_START_DATETIME" desc` ,
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

router.get("/projectdetails", (req, res) => {
  client.query(
      `SELECT *,(DATE_PART('day', "C_END_DATETIME" - CURRENT_TIMESTAMP) * 24 + DATE_PART('hour', "C_END_DATETIME" - CURRENT_TIMESTAMP)) as d FROM "CAMPAIGNS" FULL JOIN (select "CAMPAIGN",count("USER"),SUM ("funds") from "Back" group by "CAMPAIGN") A ON "CAMPAIGN"="C_ID",(select first_name,last_name,email from "users" ) b WHERE "C_END_DATETIME" > CURRENT_TIMESTAMP and "U_ID"="email" order by"C_START_DATETIME" desc` ,
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

router.patch("/setprogress",auth, (req, res) => {
  const {progress,uid}=req.body;
  const prog=parseFloat(progress);
  client.query(
      `UPDATE public.campaign_updates SET "update_progress"=$2 WHERE "update_id"= $1` ,
      [uid,prog],(error) => {
          if(!error){
              res.status(200).send("Inserted");
          }
          else{
              res.status(400).send("error");
          }
      }
    );
});

router.post("/giveupdates",auth, (req, res) => {
  const {msg,title,progress,cid}=req.body;
  const prog=parseFloat(progress);
  client.query(
      `INSERT INTO public.campaign_updates(title, update_desc, "C_ID", update_progress) VALUES ($1,$2,$3,$4)` ,
      [title,msg,cid,prog],(error) => {
          if(!error){
              res.status(200).send("Inserted");
          }
          else{
              res.status(400).send("error");
          }
      }
    );
});

router.patch("/liked",auth, (req, res) => {
  const {status,cid}=req.body;
  var a;
  if(status==true){
    a=1;
  }
  else{
    a=-1;
  }
  client.query(
      `UPDATE public."CAMPAIGNS" SET "Is_liked"=$2 WHERE "C_ID"= $1` ,
      [cid,prog],(error) => {
          if(!error){
              res.status(200).send("Inserted");
          }
          else{
              res.status(400).send("error");
          }
      }
    );
});



router.patch("/check", (req, res) => {
  const{first_campaign,last_name}=req.body;
  
  client.query(
      'UPDATE public."Users" SET "NAME"= COALESCE($1,"NAME") ,"EMAIL"= COALESCE($2,"EMAIL") WHERE "C_ID" = 1',[first_campaign,last_name]);
            res.status(200).send("result.rows");
            console.log("Project list retrive successful");


});

router.get("/endprojectdetails", (req, res) => {
  client.query(
      `SELECT *,(DATE_PART('day', "C_END_DATETIME" - CURRENT_TIMESTAMP) * 24 + DATE_PART('hour', "C_END_DATETIME" - CURRENT_TIMESTAMP)) as d FROM "CAMPAIGNS" FULL JOIN (select "CAMPAIGN",count("USER"),SUM ("funds") from "Back" group by "CAMPAIGN") A ON "CAMPAIGN"="C_ID",(select first_name,last_name,email from "users" ) b WHERE "C_END_DATETIME" > CURRENT_TIMESTAMP and "U_ID"="email" and (DATE_PART('day', "C_END_DATETIME" - CURRENT_TIMESTAMP) * 24 + DATE_PART('hour', "C_END_DATETIME" - CURRENT_TIMESTAMP))<72 order by"C_START_DATETIME" ASC` ,
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

router.get("/getuser/:id", (req, res) => {
  client.query(
      `SELECT * FROM get_backer_count(${req.params.id})`,
      (error, result) => {
          if(!error){
              res.status(200).send(result.rows);
              console.log("Backer list retrive successful");
          }
          else{
              console.log("project list not get");
          }
      }
    );
});
router.get("/getrewards/:id", (req, res) => {
  client.query(
      `SELECT * FROM public."LISTOFITEMS" where "C_ID"=${req.params.id}`,
      (error, result) => {
          if(!error){
              res.status(200).send(result.rows);
              console.log("Reward list retrive successful");
          }
          else{
              console.log("Reward list not get");
          }
      }
    );
});
router.get("/getupdates/:id", (req, res) => {
  client.query(
      `SELECT * FROM public.campaign_updates where "C_ID"=${req.params.id}`,
      (error, result) => {
          if(!error){
              res.status(200).send(result.rows);
              console.log("Reward list retrive successful");
          }
          else{
              res.send(error);
              console.log("Reward list not get");
          }
      }
    );
});

router.get("/getduration/:id", (req, res) => {
  client.query(
      `SELECT(DATE_PART('day', "C_END_DATETIME" - CURRENT_TIMESTAMP) * 24 + DATE_PART('hour', "C_END_DATETIME" - CURRENT_TIMESTAMP)) AS DURATION FROM public."CAMPAIGNS" WHERE "C_ID"=${req.params.id}`,
      (error, result) => {
          if(!error){
              res.status(200).send(result.rows);
              console.log("duration list retrive successful");
          }
          else{
              console.log("project list not get");
          }
      }
    );
});
router.post("/campaign", auth, async(req, res) => {

  var i;
  const { campaign_info,total_funds, rewards_list,project_story,image } = req.body;
  const user_id=req.user.email;
  await client.query('BEGIN', async (err) => {
    if (err){
        await client.query('ROLLBACK', (err) => {
            if (err) {
              console.error('Error committing transaction', err.stack);
            }
        });
        res.send("campaign failed 2");
        return ;

        

      }
    const queryText =  `INSERT INTO public."CAMPAIGNS"(
          "C_NAME", "C_DESCRIPTION", "C_STORY","C_FACTORS","C_IMAGE", "C_GOAL","U_ID")
         VALUES ('${campaign_info.title}', '${campaign_info.subtitle}', '${project_story.description}', '${project_story.factors}','${image}','${parseInt(total_funds)}','${user_id}') returning "C_ID"`;
    await client.query(queryText,async (err, resp) => {
      if (err){
        await client.query('ROLLBACK', err => {
            if (err) {
              console.error('Error committing transaction', err.stack)
            }
            
        });
        console.log(err);
        res.send("campaign failed 1");
        return;
      }
      for(i=0;i<rewards_list.length;i++)
      {
        console.log(resp.rows[0].C_ID);
        const listitemtext =  `INSERT INTO public."LISTOFITEMS"(
          "ITEM_NAME", "ITEM_DESCRIPTION", "ITEM_SHIPPING","C_ID")
          VALUES ('${rewards_list[i].curreward}', '${rewards_list[i].rewarddescription}', '${parseInt(rewards_list[i].price)}','${resp.rows[0].C_ID}')`;
         //   console.log(rewards_list[i].shipping);
          await client.query(listitemtext, async(err) => {
            if (err){
                console.log(err);
                await client.query('ROLLBACK', err => {
                    if (err) {
                      //console.error('Error committing transaction', err.stack)
                    }
                   
                    //return res.send("ok");
                });
                console.log(err);
                res.send("campaign failed 3");
                return;
              }
         });
         //console.log(",,,,");
    }
        await client.query('COMMIT', (err) => {
          if (err) {
            console.error('Error committing transaction', err.stack)
            res.send("campaign failed");
            return;
          }else{
            res.send("ok");
          }
        });
      });
    });

  });


  


module.exports = router;