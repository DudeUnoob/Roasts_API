const express = require('express');
const { sentences } = require('./roasts')
const app = express();
const path = require('path');
const key = require('./models/apikey');
const validator = require('email-validator');
const { Schema } = require('./models/apikey');
const router = express.Router()
const nodemailer = require('nodemailer')

app.use(
  express.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
  })
);

const apiKeys = {
  // apiKey : customerdata
  '123xyz': 'stripeCustomerId',
};


function generateAPIKey() {
  const { randomBytes } = require('crypto');
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


app.get('/create', async (req, res) => {

try{
  const { apiKey, hashedAPIKey } = generateAPIKey();
let check = validator.validate(req.query.email)
if (check == false) {
  return res.status(400).json({ message: "invalid email" })
}
key.findOne({ email: req.query.email }, async (err, data) => {
  if (data) {

    return res.status(400).json({ message: 'There is already an api key registered for this email' })
  } else {
    new key({
      key: apiKey,
      email: req.query.email,
      password: req.query.password
      
    }).save();

    let transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      auth: {
        user: 'to.balaram@outlook.com',
        pass: 'harekrsna123'
      }
    });
    
    let mailOptions = {
      from: 'to.balaram@outlook.com',
      to: req.query.email,
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

    res.send({
      //Key: apiKey,
      Key:'API key has been sent to your email please check your spam box, the sender is to.balaram@outlook.com',
      email: req.query.email,
      message: 'Keep this api key safe'
    })

    
  }
})


} catch(error){
  res.status(400).json({ message: error })
}

  
})

app.get('/api', async (req, res) => {

  let user;


  try {
    user = await key.findOne({ key: req.query.apiKey }).exec()
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find an apikey for this user' })
    }
    let result = Math.floor((Math.random() * sentences.length))

    //res.write('<h1>Hello</h1>')
    res.send({
      message: sentences[result],
      tip: "Refresh the page to get a new roast!",
    });

  } catch (err) {
    return res.status(400).json({ message: err.message })
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

app.get('/intro', (req, res) => {
  res.sendFile('intro.html', { root: path.join(__dirname, './files') });

})

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, './files') });
})

app.get('/forgot', async(req, res) => {
  try{
  let user;
  user = await key.findOne({ email: req.query.email, password: req.query.password }).select('key')

  if(user == null){
    user = 'No api keys match those credentials'
  }
  res.status(200).send(user)
  } catch(err){
    res.status(404).send({ message: 'No api keys match those credentials' })
  }
    
  
})

app.listen(process.env.PORT || 3000, function () {
  console.log("Server listening on port 2000, http://localhost:3000");
});