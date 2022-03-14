// const app = require('express')();
// const PORT = 8080;

// app.listen(
//     PORT,
//     () => console.log(`API and server is alive on https://localhost:${PORT}`)
// )

// app.get('/jokes', (req, res) => {

//     res.status(200).send({
//         jokes:'lol',
//         type:'mid'
//     })
// })
const { sentences } = require('./roasts')
const express = require('express');
const { json } = require('express/lib/response');
const app = express()
const port = 3000
const path = require('path')


//app.use( express.json() )

app.listen(process.env.PORT || 2000, function(){
    console.log("Server listening on port 2000, http://localhost:2000");
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
    res.sendFile('roast.html', { root: path.join(__dirname, './files')});
})


   

