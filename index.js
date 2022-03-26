const express = require('express');
const { sentences } = require('./roasts')
const app = express();
const path = require('path');
const key = require('./models/apikey');
const validator = require('email-validator');
const { Schema } = require('./models/apikey');
const router = express.Router()
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const ejs = require('ejs')
const sessions = require('express-session')
const multer = require('multer')
const bcrypt = require('bcrypt')

// app.use(
//   express.json({
//     verify: (req, res, buffer) => (req['rawBody'] = buffer),
//   })
// );
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(sessions({
  name:'API Roast',
  secret:'theapibestroast2022',
  resave: true,
  saveUninitialized: true
  }));
let session;
app.use(bodyParser.json())
const oneDay = 1000 * 60 * 60 * 24;
app.use(express.static('public'))
app.use(sessions({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized:true,
  cookie: { maxAge: oneDay },
  resave: false
}));

const apiKeys = {
  // apiKey : customerdata
  '123xyz': 'stripeCustomerId',
};


function generateAPIKey() {
  const { randomBytes, KeyObject } = require('crypto');
  const apiKey = randomBytes(16).toString('hex');
  const hashedAPIKey = hashAPIKey(apiKey);

  if (apiKeys[hashedAPIKey]) {
    generateAPIKey();
  } else {
    return { hashedAPIKey, apiKey };
  }
}


function hashAPIKey(apiKey) {
  const { createHash } = require('crypto');

  const hashedAPIKey = createHash('sha256').update(apiKey).digest('hex');

  return hashedAPIKey;
}
app.get("/signup",(req,res)=>{
  res.set({
      "Allow-access-Allow-Origin": '*'
  })
  return res.redirect('signup.html');
})
app.post('/sign_up', async(req, res) => {
  const { apiKey, hashedAPIKey } = generateAPIKey();
  var name = req.body.name;
    var email = req.body.email;
    var phno = req.body.phno;
    var password = req.body.password;

    var data = {
        "name": name,
        "email" : email,
        "phno": phno,
        "password" : password
    }

    // db.collection('users').insertOne(data,(err,collection)=>{
    //     if(err){
    //         throw err;
    //     }
    //     console.log("Record Inserted Successfully");
    // });
    // let user;
    // user = await key.find({ email: req.body.email })
    // if(user){
    //   return res.status(400).json({ message:'already a user with that email'})
    
    // }

    //await key.create({  email: req.body.email, password: req.body.password, key: apiKey })
    key.findOne({ email: req.body.email, username: req.body.username }, async(err, data) => {
      if(data) {
        return res.status(400).json({ message: "There is already an account with this email or username" })
      } else {
        new key({
          key: apiKey,
          email: req.body.email,
          password: req.body.password,
          username: req.body.username
        }).save()
        let transporter = nodemailer.createTransport({
          host: 'smtp-mail.outlook.com',
          port: 587,
          auth: {
            user: 'to.krishna@outlook.com',
            pass: 'Balaram26'
          }
        });

        let mailOptions = {
          from: 'to.krishna@outlook.com',
          to: req.body.email,
          subject: 'API Key',
          text: apiKey
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        return res.redirect('signup_success.html')
      }
    })



})

// app.get('/create', async (req, res) => {

// try{
//   const { apiKey, hashedAPIKey } = generateAPIKey();
// let check = validator.validate(req.query.email)
// if (check == false) {
//   return res.status(400).json({ message: "invalid email" })
// }
// key.findOne({ email: req.query.email }, async (err, data) => {
//   if (data) {

//     return res.status(400).json({ message: 'There is already an api key registered for this email' })
//   } else {
//     new key({
//       key: apiKey,
//       email: req.query.email,
//       password: req.query.password

//     }).save();



//     res.send({
//       //Key: apiKey,
//       Key:'API key has been sent to your email please check your spam box, the sender is to.balaram@outlook.com',
//       email: req.query.email,
//       message: 'Keep this api key safe'
//     })


//   }
// })


// } catch(error){
//   res.status(400).json({ message: error })
// }


// })

app.get("/change",(req,res)=>{
  res.set({
      "Allow-access-Allow-Origin": '*'
  })
  return res.redirect('changepassword.html');
})

app.post('/change_password', async(req, res) => {
  let user;

  user = await key.findOne({ email: req.body.email, password: req.body.password })

  if(user == null){
    return res.status(404).json({ message: "No account matches these credentials" })
  } //else {
  //   key.findOneAndUpdate({ password: req.body.new_password })
  // }
  await key.findOneAndUpdate({ email: req.body.email, password: req.body.password }, { password: req.body.new_password })
  return res.redirect('changepasswordsuccess.html')
})

app.get('/api', async (req, res) => {

  let user;
  session = req.session


    if(req.session.views){
     // user = await key.findOne({ key: req.query.apiKey }).exec()
     // if (user == null) {
       // return res.status(404).json({ message: 'Cannot find an apikey for this user' })
     // }
      req.session.views++

      let views = await key.findOne({ key: req.query.apiKey })
      if(views == null){
        return res.status(404).json({ message: 'Cannot find an apikey for this user' })
      }
      if(views.views == null){
        views.views = 0
      }
      // if(req.session.views > views.views) {
      //   await key.findOneAndUpdate({ key: req.query.apiKey}, {views: req.session.views})
      //   console.log(views)
      // }
      let totalViews = views.views + 1
      await key.findOneAndUpdate({ key: req.query.apiKey}, { views: totalViews })


    let result = Math.floor((Math.random() * sentences.length))

    res.send({
      message: sentences[result],
      tip: "Refresh the page to get a new roast!",
    });
    // res.write('<p>' + req.session.views + '</p>')
    // res.end()

    }else{
      req.session.views = 1
      res.redirect(`/api?apiKey=${req.query.apiKey}`)
    }

});

app.get('/all', async (req, res) => {
  try {
    const users = await key.find().select('email')
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.set('view engine','ejs')

app.get('/profile', async(req, res) => {

  // let

  // res.render('profile', {
  //   email: data
  // })
  session = req.session


  if(session.userid){
  key.find({ email: req.session.userid } , function(err, email) {
    res.render('profile', {
      emails: email
    })
  })
} else {
  return res.redirect('/login')
}
})
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'Images')
//   },

//   filename: (req, file, cb) => {
//     console.log(file)
//     cb(null, Date.now() + path.extname(file.originalname))
//   }
// })

// const upload = multer({ storage: storage })
// app.get('/upload', async(req, res) => {
//   // res.sendFile('img.html', { root: path.join(__dirname, './files') });
//   res.render('upload')

// })
// app.post('/upload',upload.single('image'), async(req, res) => {
//   res.send('Image uploaded')
// })

app.get('/intro', (req, res) => {
  res.sendFile('intro.html', { root: path.join(__dirname, './files') });

})



app.get('/login', async(req, res) => {
  res.set({
    "Allow-access-Allow-Origin": "*"

  })
  session=req.session;
    if(session.userid){
        res.send('<a href="/logout">logout here</a>');
    } else
  return res.redirect('login.html')
})
app.post('/log_in', async(req, res) => {
  let user;
  user = await key.findOne({ email: req.body.email, password: req.body.password })
  if(user == null){
    return res.status(400).json({ message: 'No user found with those credentials' })
  } else{
    session = req.session;
    session.userid = req.body.email;
    console.log(req.session)
    return res.redirect('success_login.html')
  }
})
app.get('/logout',(req,res) => {
  req.session.destroy();
  console.log(`Destroyed Session at ${Date(Date.now())}`)
  res.redirect('/');
});
app.get('/forgot', async(req, res) => {

  // let user;
  // user = await key.findOne({ email: req.query.email, password: req.query.password }).select('key')

  // if(user == null){
  //   res.status(400).json({message: 'no api keys match those credentials'})
  // } else {
  //   res.send({ user })
  // }
  res.set({
    "Allow-access-Allow-Origin": "*"

  })
  return res.redirect('forgot.html')
})

app.get('/search', (req, res) => {
  key.find({} , async(err, data) => {
    res.render('search',{
      email: data,
      requests: data
    })
  })
})
app.get('/', (req, res) => {
  key.find({} , async(err, data) => {
    res.render('index',{
      email: data,
      requests: data
    })
  })
})
app.post('/for_got', async(req, res) => {
  let user;
  user = await key.findOne({ email: req.body.email, key: req.body.apiKey }).select('password')

  if(user == null){
    res.status(400).json({ message: 'Nothing matches these credentials' })
  } else {
    res.send(user)
  }
})

app.listen(process.env.PORT || 3000, function () {
  console.log("Server listening on port 3000, http://localhost:3000");
});