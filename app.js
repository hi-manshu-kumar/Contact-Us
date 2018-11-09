const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io'); 
const keys = require('./config/keys');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');

//Init app
const app = express();

// Init Nexmo
const nexmo = new Nexmo({
    apiKey: keys.nexmoApiKey,
    apiSecret: keys.nexmoApiSecret
}, {debug: true});


//template engine setup
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
// app.engine('handlebars', exphbs());
// app.set('view engine', 'handlebars');

//public folder setup
app.use(express.static(__dirname + '/public'));

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index route
app.get('/', (req, res) => {
    res.render('index');
});

//Catch form Submit
app.post('/' , (req, res) => {
    // res.send(req.body);
    // console.log(req.body);

    const number = req.body.number;
    const text = req.body.text;
    const from = 'Nexmo';
    
    nexmo.message.sendSms(
        from , number, text, { type: 'unicode'}, 
        (err, responseData) => {
            if(err) {
                console.log(err);
            } else {
                console.dir(responseData);
                // GEt data from the response
                const data  = {
                    id: responseData.messages[0]['message-id'],
                    number: responseData.message[0]['to'] 
                }

                // Emit to the client
                io.emit('smsStatus', data);
            }
        });
});


// define port
const port = 3000;

const server = app.listen(3000, () => console.log(`Server started on port ${port}`));

const io = socketio(server);
io.on('connection', (socket) => {
    console.log('Connected');
    io.on('disconnect', () => {
        console.log('disconnected')
    })
})