const electron = require('electron');
const { ipcRenderer } = electron;

ipcRenderer.on('mainWindow:create', (event, id) => {
    url = "https://lab.gaya-on.com/" + id + "/res";
    numbers = reset();
    setInterval("draw()", 100);
});

function reset(){
    temp = {};
    fetch(url)
    .then(function (data) {
        return data.json();
    })
    .then(function (json) {
        for(let shape in json["shapes"]) {
            temp[shape] = json["shapes"][shape];
        }
    });
    return temp;
}

function draw(){
    fetch(url)
    .then(function (data) {
        return data.json();
    })
    .then(function (json) {
        for (let shape in json["shapes"]) {
            if (json["shapes"][shape] != numbers[shape]) {
                for (let i = 0; i < json["shapes"][shape] - numbers[shape]; i++) {
                    showHeart(shape);
                }
                numbers[shape] = json["shapes"][shape]
            }
        }
    });
}

function showHeart(shape){
    var newElement = document.createElement("div");
    newElement.setAttribute("class","fuwafuwa");
    newElement.classList.add("class", shape);
    newElement.style.left = Math.random()*(window.innerWidth-100)+"px";
    var parentDiv = document.getElementsByTagName("body")[0];
    parentDiv.insertBefore(newElement, parentDiv.firstChild);
}