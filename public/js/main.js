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
