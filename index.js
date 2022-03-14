const { sentences } = require('./roasts')
const express = require('express');
//const { json } = require('express/lib/response');
const app = express()
const port = 3000
const path = require('path');



//app.use( express.json() )

app.listen(process.env.PORT || 3000, function(){
    console.log("Server listening on port 2000, http://localhost:3000");
  });
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, './files')});
})


app.get('/roasts', (req, res) => {
    
    
    let result = Math.floor((Math.random() * sentences.length))
    
    //res.write('<h1>Hello</h1>')
    res.status(200).send({
         message: sentences[result],
         tip: "Refresh the page to get a new roast!",
     });

    
});

app.get('/intro', (req,res) => {
    res.sendFile('intro.html', { root: path.join(__dirname, './files')});
    
})

// app.get('/files/favicon-32x32.png', (req, res) => {
//     res.sendFile('favicon-32x32.png', { root: path.join(__dirname, './files')})
// })



