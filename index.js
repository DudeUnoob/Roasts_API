const express = require('express');
const { sentences } = require('./roasts')
const app = express();
const path = require('path');
const key = require('./models/apikey');
const router = express.Router()

app.use(
  express.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
  })
);

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
  const { apiKey, hashedAPIKey } = generateAPIKey();
  key.findOne({ key: apiKey }, async(err, data) => {
    if(data){
        
        data.save()
    } else{
      new key({
        key: apiKey
      }).save();
    }
  })

  res.send({
    Key: apiKey,
    message: 'Keep this api key safe'
  })
})

app.get('/api', async (req, res) => {

  let user;
  
  
  try{
    user = await key.findOne({ key: req.query.apiKey }).exec()
    if(user == null){
      return res.status(404).json({ message: 'Cannot find an apikey for this user'})
    }
    let result = Math.floor((Math.random() * sentences.length))

  //res.write('<h1>Hello</h1>')
  res.send({
    message: sentences[result],
    tip: "Refresh the page to get a new roast!",
  });

  } catch(err){
    return res.status(400).json({ message: err.message })
  }
});

app.get('/all', async (req, res) => {
  try {
    const users = await key.find()
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

  
app.listen(process.env.PORT || 3000, function () {
  console.log("Server listening on port 2000, http://localhost:3000");
});