let n = 0;
let clientInterval;

function startWS() {
    let socket = new WebSocket('ws://localhost:4000/wsserver');

    socket.onopen = () => {
        console.log('socket.onopen');
        clientInterval = setInterval(() => {
            let message = `10-01-client: ${++n}`;
            console.log(message);
            socket.send(message);
        }, 3000);
        setTimeout(() => {
            clearInterval(clientInterval);
            socket.close();
        }, 25000);
    };

    socket.onclose = (e) => {
        console.log('socket.onclose', e);
        clearInterval(clientInterval);
    };

    socket.onmessage = (e) => {
        console.log(`${e.data}`);
    };

    socket.onerror = function (error) {
        alert("Ошибка " + error.message);
    };
};

startWS();