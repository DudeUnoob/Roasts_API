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

const express = require('express')
const app = express()
const port = 3000
const path = require('path')




app.listen(port, () => {
  console.log(`Example app listening on  https://localhost:${port}`)
})
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, './files')});
})
app.get('/roasts', (req, res) => {

    let sentences= [
        'so fat not even Dora can explore her',
        'so fat I swerved to miss her and ran out of gas',
        'so smelly she put on Right Guard and it went left',
        'so fat she hasnt got cellulite shes got celluheavy',
        'so fat she dont need no internet shes already world wide',
        'so hair her armpits look like Don King in a headlock',
        'so classless she could be a Marxist utopia',
        'so fat she can hear bacon cooking in Canada',
        'so fat she won The Bachelor because she all those other bitches',
        'so stupid she believes everything that Brian Williams says',
        'so ugly she scared off Flavor Flav',
        'is like Dominos Pizza, one call does it all',
        'is twice the man you are',
        'is like an ATM open 24/7',
        'You are what happens when women drink during pregnancy.',
        'When I look at you, I wish I could meet you again for the first time… and walk past.',
        'You are the sun in my life… now get 93 million miles away from me.',
        'You have such a beautiful face… But let’s put a bag over that personality.',
        'There is someone out there for everyone. For you, it’s a therapist.',
        'I would smack you, but I’m against animal abuse.',
        'If I wanted to kill myself, I would simply jump from your ego to your IQ.',
        'I can’t wait to spend my whole life without you.',
        'Whoever told you to be yourself, gave you a bad advice.',
        "They should classify you with speed's disease"
        
    ]
    let result = Math.floor((Math.random() * sentences.length))
    res.status(200).send({
        message: sentences[result],
        tip: 'Refresh the page to get a new roast everytime!'
    })
})
   

