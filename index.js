const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

//Set Storage Engine
const storage = multer.diskStorage({
destination: './public/uploads/',
filename:function(req,file,cb){
 cb(null,file.fieldname + '-' + Date.now() + 
 path.extname(file.originalname));
}
});

//init upload 
const upload = multer({
storage: storage,
limits: {fileSize: 1000000}, //1MB
fileFilter:function(req,file,cb){
  checkFileType(file,cb);
}
}).single('myImage');

//Check File Type
function checkFileType(file,cb){
    //check extension + mimetype
    //allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    //check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
   //check mimetype
   const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
   return cb(null,true);
  }else{
      cb('Error: Images Only!!');
  }
}

//init app
const app = express();
const PORT = process.env.PORT || 3000;

//EJS
app.set('view engine','ejs');

//public folder
app.use(express.static('./public'));

app.get("/",(req,res) => res.render('app'));

app.post('/upload',(req,res) => {
    upload(req,res,(err) => {
        if(err){
            res.render('app',{
                msg:err
            });
        }else{
            if(req.file == undefined){
                res.render('app',{
                    msg:'Error: No file Selected!'
                });
            }else{
                res.render('app',{
                    msg:'File Uploaded',
                    file:`uploads/${req.file.filename}`
                });

            }

        }
    })
});

app.listen(PORT, () => {
   console.log(`Server running at port @ ${PORT}`) 
});
