document.getElementById('buttonJson').addEventListener('click', function(event) {
    event.preventDefault();

    fetch('http://localhost:5000/json/players.json', {
        method: 'GET',
    })
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        else {
            throw new Error('Failed to fetch the file');
        }
    })
    .then(blob => {
        const jsonContent = document.getElementById('json');
        jsonContent.textContent = JSON.stringify(blob, 0, 2);
    })
    .catch(error => {
        console.error('Error fetching file: ', error);
    }); 
});

document.getElementById('buttonXml').addEventListener('click', function(event) {
    event.preventDefault();

    fetch('http://localhost:5000/xml/players.xml', {
        method: 'GET',
    })
    .then(response => {
        if(response.ok) {
            return response.text();
        }
        else {
            throw new Error('Failed to fetch the file');
        }
    })
    .then(xmlString => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");
        const players = xmlDoc.getElementsByTagName('player');
        let output = '';

        for(let i = 0; i < players.length; i++) {
            const name = players[i].getElementsByTagName('name')[0].textContent;
            const surname = players[i].getElementsByTagName('surname')[0].textContent;
            const club = players[i].getElementsByTagName('club')[0].textContent;

            output += `${name} ${surname} - ${club}<br>`;
        }

        const resultContainer = document.getElementById('xml');
        resultContainer.innerHTML = output;
    })
})
