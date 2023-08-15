import { Answer } from "./decision.js"

import { findCode } from "./Sch_Info.js";

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
    console.log(chatVal)

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

    if (document.getElementById('answertype').innerText == 'info') {
        var w, g
        setTimeout(() => {
            var wandg = findCode(document.getElementById('code').innerText)
            w = wandg[0].LTTUD
            g = wandg[0].LGTUD

            console.log(w + '\n' + g)
        }, 10);

        setTimeout(() => {
            drawMap(w, g)
            var chatpage = document.getElementById('chatpage');
            chatpage.scrollTo({ top: chatpage.scrollHeight, behavior: 'smooth' });
        }, text.length * 5);
    }
}

function drawMap(w, g) {
    if (document.querySelectorAll('#chatsValue')[document.querySelectorAll('#chatsValue').length - 1].innerText.includes('학교명:')) {
        document.querySelectorAll('#chatsValue')[document.querySelectorAll('#chatsValue').length - 1].insertAdjacentHTML('beforeend', `
    <div id="container" class="view_map">
    <div id="mapWrapper" style="width:100%;height:300px;position:relative;">
        <div id="map" style="width:100%;height:100%"></div> 
        <input type="button" id="btnRoadview" onclick="toggleMap(false, this)" title="로드뷰 보기" value="로드뷰">
    </div>
    <div id="rvWrapper" style="width:100%;height:300px;position:absolute;top:0;left:0;">
        <div id="roadview" style="height:100%"></div>
        <input type="button" id="btnMap" onclick="toggleMap(true, this)" title="지도 보기" value="지도">
    </div>
</div>
`);

        var container = document.querySelectorAll('#container')[document.querySelectorAll('#container').length - 1],    // 지도와 로드뷰를 감싸고 있는 div 입니다
            mapWrapper = document.querySelectorAll('#mapWrapper')[document.querySelectorAll('#mapWrapper').length - 1],    // 지도를 감싸고 있는 div 입니다
            btnRoadview = document.querySelectorAll('#btnRoadview')[document.querySelectorAll('#btnRoadview').length - 1], // 지도 위의 로드뷰 버튼, 클릭하면 지도는 감춰지고 로드뷰가 보입니다 
            btnMap = document.querySelectorAll('#btnMap')[document.querySelectorAll('#btnMap').length - 1],    // 로드뷰 위의 지도 버튼, 클릭하면 로드뷰는 감춰지고 지도가 보입니다 
            rvContainer = document.querySelectorAll('#roadview')[document.querySelectorAll('#roadview').length - 1],   // 로드뷰를 표시할 div 입니다
            mapContainer = document.querySelectorAll('#map')[document.querySelectorAll('#map').length - 1];    // 지도를 표시할 div 입니다


        // 지도와 로드뷰 위에 마커로 표시할 특정 장소의 좌표입니다 
        var placePosition = new kakao.maps.LatLng(w, g);

        // 지도 옵션입니다 
        var mapOption = {
            center: placePosition, // 지도의 중심좌표 
            level: 3 // 지도의 확대 레벨
        };

        // 지도를 표시할 div와 지도 옵션으로 지도를 생성합니다
        var map = new kakao.maps.Map(mapContainer, mapOption);

        // 로드뷰 객체를 생성합니다 
        var roadview = new kakao.maps.Roadview(rvContainer);
        var rc = new kakao.maps.RoadviewClient(); // 좌표를 통한 로드뷰의 panoid를 추출하기 위한 로드뷰 help객체 생성 

        // 로드뷰의 위치를 특정 장소를 포함하는 파노라마 ID로 설정합니다
        // 로드뷰의 파노라마 ID는 Wizard를 사용하면 쉽게 얻을수 있습니다 

        var rvPosition = new kakao.maps.LatLng(w, g);
        rc.getNearestPanoId(rvPosition, 200, function (panoid) {
            roadview.setPanoId(panoid, rvPosition);//좌표에 근접한 panoId를 통해 로드뷰를 실행합니다.
        });


        // 특정 장소가 잘보이도록 로드뷰의 적절한 시점(ViewPoint)을 설정합니다 
        // Wizard를 사용하면 적절한 로드뷰 시점(ViewPoint)값을 쉽게 확인할 수 있습니다
        roadview.setViewpoint({
            pan: 321,
            tilt: 0,
            zoom: 0
        });

        // 지도 중심을 표시할 마커를 생성하고 특정 장소 위에 표시합니다 
        var mapMarker = new kakao.maps.Marker({
            position: placePosition,
            map: map
        });

        // 로드뷰 초기화가 완료되면 
        kakao.maps.event.addListener(roadview, 'init', function () {

            // 로드뷰에 특정 장소를 표시할 마커를 생성하고 로드뷰 위에 표시합니다 
            var rvMarker = new kakao.maps.Marker({
                position: placePosition,
                map: roadview
            });
        });
    }
}
export { Chat }