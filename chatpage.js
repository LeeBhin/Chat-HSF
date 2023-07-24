import { Answer } from "./decision.js"

// 초기 변수 설정
var example = true;

// 검색창 요소 가져오기
const search = document.getElementById('searchbar');

// 검색창 입력 이벤트 리스너 추가
search.addEventListener('input', function () {
    if (document.getElementById('searchbar').value == '') {
        // 검색창이 비어있을 때 처리
        // document.getElementById('sendimg').classList.remove('sendpb')
    } else {
        // 검색창이 비어있지 않을 때 처리
        // document.getElementById('sendimg').classList.add('sendpb')
    }
});

// 검색창에 예시 문장 추가하는 함수
function ex(element) {
    document.getElementById('searchbar').value = element.innerText.replace(/["→]/g, "").trim();
    // document.getElementById('sendimg').style.opacity = '1'
    // document.getElementById('sendimg').style.cursor = 'pointer'
}

// 검색창 엔터키 이벤트 리스너 추가
search.addEventListener('keydown', function (event) {
    var question = search.value;

    if (event.key === 'Enter') {
        // 엔터키를 눌렀을 때 처리
        send(question);
        document.getElementById('searchbar').value = '';
    }
});

function send(question) {
    if (example) {
        // 예시가 화면에 있을 때 삭제
        document.getElementById('ex').remove();
        example = false;
    }

    Chat('me', question);
    Chat('bot', Answer(question))
}

// 대화창에 채팅 추가 함수
function Chat(who, chatVal) {

    var chatsValue = document.createElement('div');
    chatsValue.id = 'chatsValue';

    var rmdiv = document.getElementById('scrollDiv');
    if (rmdiv) {
        rmdiv.parentNode.removeChild(rmdiv);
    }
    var final = false;

    var chats = document.createElement('div');
    chats.className = 'Chat';

    var chatsWrap = document.createElement('div');
    chatsWrap.id = 'chatsWrap';

    var icon = document.createElement('img');
    icon.src = './search.png';
    icon.id = 'Icon';

    if (who === 'me') {
        // 내 채팅일 때 아이콘 변경
        chats.id = 'myChat';
        icon.src = './me.png';

        chatsValue.innerHTML = chatVal
    } else {
        // 봇 채팅일 때 아이콘 변경
        chats.id = 'botChat';
        final = true;

        // 봇일 경우에만 글자를 한 글자씩 출력하는 함수 호출
        printOneByOne(chatVal, chatsValue);
    }

    chatsWrap.appendChild(icon);
    chatsWrap.appendChild(chatsValue);
    chats.appendChild(chatsWrap);

    document.getElementById('chatpage').appendChild(chats);

    if (final) {
        var scrollDiv = document.createElement('div');
        scrollDiv.id = 'scrollDiv';
        document.getElementById('chatpage').appendChild(scrollDiv);
    }
}

// 한 글자씩 출력하는 함수 (주소 클릭 시 새 탭에서 열리는 버전)
function printOneByOne(text, chatsValue) {
    var index = 0;
    var interval = 2; // 출력 간격(ms)

    function addNextCharacter() {
        if (index < text.length) {
            var char = text.charAt(index);

            if (char === '㉾') {
                var url = "";
                var urlEndIndex = text.indexOf('㉾', index + 1);
                if (urlEndIndex !== -1) {
                    url = text.substring(index + 1, urlEndIndex);
                    var link = document.createElement('a');
                    link.href = url;
                    link.target = "_blank"; // 새 탭에서 열리도록 설정
                    link.innerText = url;
                    chatsValue.appendChild(link);
                    index = urlEndIndex + 1;
                } else {
                    chatsValue.innerHTML += char;
                    index++;
                }
            } else {
                if (char === '\n') {
                    chatsValue.innerHTML += '<br>';
                } else {
                    chatsValue.innerHTML += char;
                }
                index++;
            }

            setTimeout(addNextCharacter, interval);
        }

        var chatpage = document.getElementById('chatpage');
        chatpage.scrollTo({ top: chatpage.scrollHeight, behavior: 'smooth' });
    }

    addNextCharacter();
}

export { Chat, ex }