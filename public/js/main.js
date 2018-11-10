const numberInput = document.getElementById("number"),
      textInput = document.getElementById('msg'),
      button = document.getElementById('button'),
      response = document.querySelector('.response');

button.addEventListener('click', send , false);

const socket = io();
socket.on('smsStatus', function(data){
    response.innerHTML = '<h5>Text Message sent to ' + data.number + '</h5>';
})

function send(){
    const number = numberInput.value.replace(/\D/g, '');
    const text = textInput.value;
    console.log('btn click');
    fetch('/', {
        method: 'post',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({number: number, text: text})
    }).then((data) => {
        console.log(data)
    }).catch((err) =>{
        console.log(err)
    });
}

// document.getElementsByClassName("clickChat").addEventListener("click", clickChat);
var click = document.getElementsByClassName("clickChat");
for(let i= 0; i<click.length; i++)
    click[i].addEventListener('click', clickChat);

function clickChat() {
    document.getElementById("collect-chat-launcher-button").click();
}

var clickmail = document.getElementsByClassName("clickMail");
for(let i= 0; i<clickmail.length; i++)
    clickmail[i].addEventListener('click', clickMail);

function clickMail(){
    document.getElementById("mailContent").classList.add("show");
    document.getElementById("mailContent").classList.remove("hide");
    document.getElementById("content").classList.add("hide");
    document.getElementById("mailContent").classList.remove("show");
}

var clicksms = document.getElementsByClassName("clickSMS");
for(let i= 0; i<clicksms.length; i++)
    clicksms[i].addEventListener('click', clickSMS);

function clickSMS(){
    document.getElementById("content").classList.add("show");
    document.getElementById("content").classList.remove("hide");
    document.getElementById("mailContent").classList.add("hide");
    document.getElementById("mailContent").classList.remove("show");
}