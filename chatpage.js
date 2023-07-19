var example = true

const search = document.getElementById('searchbar')
search.addEventListener('input', function () {
    if (document.getElementById('searchbar').value == '') {
        // document.getElementById('sendimg').classList.remove('sendpb')
    } else {
        // document.getElementById('sendimg').classList.add('sendpb')
    }
})

function ex(element) {
    document.getElementById('searchbar').value = element.innerText.replace(/["→]/g, "").trim();
    // document.getElementById('sendimg').style.opacity = '1'
    // document.getElementById('sendimg').style.cursor = 'pointer'
}

search.addEventListener('keydown', function (event) {
    console.log(event.key)
    question = search.value

    if (event.key === 'Enter') {
        send(question);
        document.getElementById('searchbar').value = '';
    }
})

function send(question) {
    if (example) {
        document.getElementById('ex').remove();
        example = false;
    }
    console.log(question);

    Chat('me', question)
    Chat('bot', question)

    var chatpage = document.getElementById('chatpage');
    chatpage.scrollTo({ top: chatpage.scrollHeight, behavior: 'smooth' });
}

function Chat(who, chatVal) {
    var rmdiv = document.getElementById('scrollDiv');
    if (rmdiv) {
        rmdiv.parentNode.removeChild(rmdiv);
    }
    var final = false

    var chats = document.createElement('div');
    chats.className = 'Chat';

    var chatsWrap = document.createElement('div');
    chatsWrap.id = 'chatsWrap';

    var icon = document.createElement('img');
    icon.src = './search.png';
    icon.id = 'Icon';

    if (who === 'me') {
        chats.id = 'myChat';
        icon.src = './me.png'
    } else {
        chats.id = 'botChat';
        final = true;
    }

    var chatsValue = document.createElement('div');
    chatsValue.id = 'chatsValue';

    chatsWrap.appendChild(icon);
    chatsWrap.appendChild(chatsValue);
    chatsValue.innerText = chatVal;

    chats.appendChild(chatsWrap);

    document.getElementById('chatpage').appendChild(chats);

    if (final) {
        var scrollDiv = document.createElement('div')
        scrollDiv.id = 'scrollDiv';
        document.getElementById('chatpage').appendChild(scrollDiv);
    }
}