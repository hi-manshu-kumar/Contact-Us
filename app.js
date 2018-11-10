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
// app.set('view engine', 'html');
// app.engine('html', ejs.renderFile);
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

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

app.post('/send', (req, res) => {
    const output = `       
        <p>You have a new Contact request</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>E-mail: ${req.body.email}</li>
            <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
        `;

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: keys.user,
                pass: keys.pass
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Contact Us App" <himanshuikumar493@gmail.com>', // sender address
            to: 'himanshu.kumar394@gmail.com', // list of receivers
            subject: 'Mail from customer', // Subject line
            text: 'Hello world?', // plain text body
            html: output // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            res.render('index', {msg: 'Email has been sent'});
        });
});

// define port
const port = process.env.PORT ||3000;

const server = app.listen(port, () => console.log(`Server started on port ${port}`));

const io = socketio(server);
io.on('connection', (socket) => {
    console.log('Connected');
    io.on('disconnect', () => {
        console.log('disconnected')
    })
})