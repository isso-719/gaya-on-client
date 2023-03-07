window.api.on('mainWindow:create', (event,  ws_url) => {
    // Websocket 通信を開始する
    const ws = new WebSocket(ws_url);
    ws.onopen = () => {
        console.log('connected');
    };
    ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.Event.type === 'message') {
            if (data.Event.content.type === 'text') {
                showText(data.Event.content.body);
            } else if (data.Event.content.type === 'emoji') {
                // body に赤文字でメッセージを表示する
                showEmoji(data.Event.content.body);
            }
        }
    };
    ws.onclose = () => {
        console.log('disconnected');
    };
});

function showEmoji(body) {
    let windowWidth = window.innerWidth;
    let sideRand = Math.floor(Math.random() * windowWidth);

    let encodedEmoji = String.fromCodePoint(parseInt(body, 16));

    const emoji = document.createElement('p');
    emoji.classList.add('emoji');
    emoji.textContent = encodedEmoji;
    emoji.style.left = sideRand + 'px';
    document.body.appendChild(emoji);
}

function showText(body) {
    const allowHeight = 300;
    let windowWidth = window.innerWidth;
    let sideRand = Math.floor(Math.random() * allowHeight);

    const text = document.createElement('p');
    text.classList.add('text');
    text.textContent = body;
    text.style.left = windowWidth + 'px';
    text.style.top = sideRand + 'px';
    text.style.width = 30 * body.length + 'px';
    document.body.appendChild(text);

    setTimeout(() => {
        text.remove();
    }, 7000);
}