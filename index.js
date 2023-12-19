const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
var vimeo = require('vimeo').Vimeo;





const app = express();
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());




// const storage = multer.diskStorage({
//     destination: path.join(__dirname, './image/UploadImage/', 'uploads'),
//     filename: function (req, file, cb) {   
//         // null as first argument means no error
//         cb(null, Date.now() + '-' + file.originalname)  
//     }
// })


// one config
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sdp2_project'
});


connection.connect(function(err) {
    if (err) {
       console.error('error: ' + err.message);
    }else{
        // insertFormation(connection)
        // app.get('/getTableInfo',(req,res) => {
        //    const SQLQuery = "SELECT * FROM `quiz_table`";
        //    connection.query(SQLQuery,(err,result)=>{
        //     if(err){
        //         console.log("request failed")
        //     }else{
        //         res.send(result)
        //     }
        // })
        // })


        app.post('/generalUser',(req,res)=>{
            const {name,email} = req.body;
            const SQLQuery = `INSERT INTO generaluser(name,email) VALUES ('${name}','${email}')`;
            connection.query(SQLQuery,(err)=>{
                         if(err){
                             console.log("insert fail")
                         }else{
                             res.send("successfully")
                         }
                     })
        })
    }
  


    app.post('/contentCreator',(req,res) => {
        const {randomUser,name,email,age,password} = req.body;
        const SQLQuery = `INSERT INTO contentcreator(randomUserId,name, email, age, password) VALUES ('${randomUser}','${name}','${email}','${age}','${password}')`;
        connection.query(SQLQuery,(err)=>{
            if(err){
                console.log("insert fail");
            }else{
                res.send("successfully");
            }
        })
    })



    app.post('/videoUpload',(req,res)=>{
        console.log(req.files)
        const sampleFile = req.files.myVideo;
        const uploadPath = 'upload/'+sampleFile.name;
        console.log(uploadPath)
        sampleFile.mv(uploadPath, function(err) {
            if (err){
              console.log("upload failed");
            }else{
                const videoName = sampleFile.name;
                const url = req.body.url;
               
                 const title = req.body.title;
                 const description = req.body.description;
                 const playlist = req.body.playlist;
                 const category = req.body.category;
                 const random = req.body.random;

            // const SQLQuery = "create table videouploads(id int auto_increment primary key, title varchar(100), description text, playlistName varchar(100),category varchar(50),videoName varchar(200),url varchar(200), randomUser int, Foreign key(randomUser) References contentcreator(randomUserId))";
            //   connection.query(SQLQuery,(err,result)=>{
            //    if(err){
            //     console.log("request failed")
            //    }else{
            //     console.log('tableCreated suuccessfully')
            //  }
            // })
                 const SQLQuery = `INSERT INTO uploadvideos(title, description, playlistName, category, videoName, url) VALUES ('${title}','${description}','${playlist}','${category}','${videoName}','${url}')`;
                 connection.query(SQLQuery,(err)=>{
                    if(err){
                        console.log("insert fail");
                    }else{
                        res.send("successfully");
                    }
                })

                // const getRelationData = `SELECT videouploads.id,videouploads.category,videouploads.videoName,contentcreator.name FROM videouploads,contentcreator WHERE videouploads.randomUserId = contentcreator.randomUserId `;
                // connection.query(getRelationData,(err,relationResult)=>{
                //     if(err){
                //         console.log("request failed");
                //     }else{
                //           const deleteQuery = `DELETE FROM relationbetweencontentcreatorandvideo`;
                //           connection.query(deleteQuery,(err,result)=>{
                //             if(err){
                //                 console.log("request failed");
                //             }else{
                //                 console.log("deleted Successfully Successfully");
                //             }
                //         })
        
                //         relationResult.map(data => {
                //             const SQLQuery =`INSERT INTO relationbetweencontentcreatorandvideo(id, category, videoName, userName) VALUES ('${data.id}','${data.category}','${data.videoName}','${data.name}')`;
                //             connection.query(SQLQuery,(err,result)=>{
                //                 if(err){
                //                     console.log("request failed");
                //                 }else{
                //                     console.log("Inserted Successfully");
                //                 }
                //             })
                //        })
                //     }
                // })
            }
          });
    })


    app.get('/getVideo/:item',(req,res) => {
        const param = req.params.item;
        
        const SQLQuery = `select * from uploadvideos where category='${param}';`;

        connection.query(SQLQuery,(err,result)=>{
                 if(err){
                     console.log("request failed")
                 }else{
                     res.send(result);                                                                      
                 }
             })
    })


    app.post('/addSexualHealth',(req,res)=> {
        
        const {title,description} = req.body;
        console.log(title,description)
        
       const SQLQuery = `INSERT INTO sexual_health(title, description) VALUES ('${title}','${description}')`;

       connection.query(SQLQuery,(err,result)=>{
        if(err){
            console.log("inserted failed");
        }else{
            console.log("successfully");
        }
    })
    })


    app.post('/addHerbalData',(req,res)=> {
        const {title,description} = req.body;

        const SQLQuery = `INSERT INTO herbalmedico(title, description) VALUES ('${title}','${description}')`;
        connection.query(SQLQuery,(err,result)=>{
            if(err){
                console.log("request failed");
            }else{
                console.log("successfully");
            }
        })
    })


    app.post('/addQuiz',(req,res)=> {
        const {title,question,option1,option2,option3,option4,answer} = req.body;
        const SQLQuery = `INSERT INTO quiz(title,question, option1, option2, option3, option4, answer) VALUES ('${title}','${question}','${option1}','${option2}','${option3}','${option4}','${answer}')`;
        connection.query(SQLQuery,(err,result)=>{
            if(err){
                console.log("request failed");
            }else{
                console.log("successfully");
            }
        })
    })


    app.get('/getSexualHealth',(req,res)=>{
        const SQLQuery = `SELECT * FROM sexual_health `;
        connection.query(SQLQuery,(err,result)=>{
            if(err){
                console.log("request failed")
            }else{
                res.send(result);
            }
        })
    })

    app.get('/getHerbal',(req,res)=>{
        const SQLQuery = `SELECT * FROM herbalmedico`;
        connection.query(SQLQuery,(err,result)=>{
            if(err){
                console.log("request failed")
            }else{
                res.send(result);
            }
        })
    })

    app.get('/getQuiz',(req,res)=>{
        const SQLQuery = `SELECT * FROM quiz`;
        connection.query(SQLQuery,(err,result)=>{
            if(err){
                console.log("request failed")
            }else{
                res.send(result);
            }
        })
    })


    app.post('/comment',(req,res)=>{
        
        const {description,videoId} = req.body;
        console.log(description,videoId)
        // SQLQuery = "create table comment(id int auto_increment primary key, description text, video_id int, Foreign key(video_id) References uploadvideos(id))";
        // connection.query(SQLQuery,(err,result)=>{
        //     if(err){
        //         console.log("request failed")
        //     }else{
        //         res.send(result);
        //     }
        // })


        const SQLQuery = `INSERT INTO comment(description, video_id) VALUES ('${description}','${videoId}')`;
        connection.query(SQLQuery,(err,result)=>{
            if(err){
                console.log("inserted failed");
            }else{
                console.log("Inserted Successfully");
            }
        })


        const getRelationData = `SELECT comment.id,video_id,comment.description,uploadvideos.category,uploadvideos.url
        FROM comment,uploadvideos WHERE comment.video_id = uploadvideos.id`;
        connection.query(getRelationData,(err,relationResult)=>{
            if(err){
                console.log("request failed");
            }else{
                  const deleteQuery = `DELETE FROM relationbetweencommentandvideo`;
                  connection.query(deleteQuery,(err,result)=>{
                    if(err){
                        console.log("request failed");
                    }else{
                        console.log("deleted Successfully Successfully");
                    }
                })

                relationResult.map(data => {
                    const SQLQuery =`INSERT INTO relationbetweencommentandvideo(id, video_id,description,category,url) VALUES ('${data.id}','${data.video_id}','${data.description}','${data.category}','${data.url}')`;
                    connection.query(SQLQuery,(err,result)=>{
                        if(err){
                            console.log("request failed");
                        }else{
                            console.log("Inserted Successfully");
                        }
                    })
               })
            }
        })

    })


    // app.post('/imageupload', async (req, res) => {	
    //     try {
    //         // 'avatar' is the name of our file input field in the HTML form
    
    //         let upload = multer({ storage: storage}).single('avatar');
    
    //         upload(req, res, function(err) {
    //             // req.file contains information of uploaded file
    //             // req.body contains information of text fields
    
    //             if (!req.file) {
    //                 return res.send('Please select an image to upload');
    //             }
    //             else if (err instanceof multer.MulterError) {
    //                 return res.send(err);
    //             }
    //             else if (err) {
    //                 return res.send(err);
    //             }
    
    //             const classifiedsadd = {
    //                 image: req.file.filename
    //             };
    //             const sql = "INSERT INTO users SET ?";
    //             connection.query(sql, classifiedsadd, (err, results) => {  if (err) throw err;
    //                 res.json({ success: 1 })      
    
    //             });  
    
    //         }); 
    
    //     }catch (err) {console.log(err)}
    // })

  });

//   function insertFormation(connection){
//     const SQLQuery = "INSERT INTO `quiz_table`(`quiz_id`, `quiz_title`, `q_question`, `q_answer`) VALUES ('123','becomeDoctor','what is your aim?','software Engineer')";
//     connection.query(SQLQuery,(err)=>{
//         if(err){
//             console.log("insert fail")
//         }else{
//             console.log("data inserted successfully")
//         }
//     })
//   }
  



app.get('/home',(req,res)=>{
    res.send("Hey,How are You?")
})

app.listen(5000,()=>console.log("Server is running"));