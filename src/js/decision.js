import { SchInfo, info_Print, printDuplicates } from "./Sch_Info.js";
import { SchList } from "./Sch_List.js";

var ifDuplicate = false;

var All_Info;
var Student_number;

// import info from './info.js'
// import students from './students.js'
// All_Info = info.list
// Student_number = students.list

const openDBForReading = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('myDatabase', 1);

        request.onerror = (event) => {
            reject('Failed to open database');
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            resolve(db);
        };
    });
};

const fetchDataFromDB = async () => {
    try {
        const db = await openDBForReading();
        const transaction = db.transaction('data', 'readonly');
        const objectStore = transaction.objectStore('data');

        const schInfoRequest = objectStore.get('schinfo');
        const stdntRequest = objectStore.get('stdnt');

        schInfoRequest.onsuccess = (event) => {
            const result = event.target.result;
            if (result) {
                All_Info = result.data;
            }
        };

        stdntRequest.onsuccess = (event) => {
            const result = event.target.result;
            if (result) {
                Student_number = result.data;
            }
        };
    } catch (error) {
        console.error('Error fetching data from IndexedDB:', error);
    }
};
fetchDataFromDB();

async function Answer(Question) {
    if (Question == '!업데이트') {
        const db = await openDB();
        const transaction = db.transaction('data', 'readwrite');
        const objectStore = transaction.objectStore('data');

        objectStore.delete('schinfo');
        objectStore.delete('stdnt');
        objectStore.delete('lastUpdated');
        window.location.reload();
    }
    if (Question == '!설명서') {
        return howToUse()
    }
    const Go = Question.split('고')[0] + '고';
    // 데이터 로딩 중인지 확인
    if (!All_Info || !Student_number) {
        return `데이터 로딩중입니다... 잠시만 기다려주세요!
        (자동 데이터 갱신 주기 : 일주일)`;
    } else {
        try {
            // question 문자열에 공백이 있는지 확인
            if (Question.includes(' ')) {
                // 공백이 있다면 학교 리스트 반환
                if (SchList(Question).List === '') {
                    return `고등학교를 찾을 수 없습니다.
                    "!설명서"를 통해 사용법을 확인하실 수 있습니다.`;
                }
                const schoolList = SchList(Question)
                return schoolList.List;
            }
            else if (ifDuplicate) {
                var num = Question.replace(/\D/g, "") * 1;

                var code = schulCodes[num - 1];

                ifDuplicate = false;

                document.getElementById('answertype').innerText = 'info'
                document.getElementById('mheaderTitle').innerText = SchInfo(Go)

                return info_Print(code, true)
            }
            else {
                var duplicate = printDuplicates(SchInfo(Go));

                if (duplicate.length > 1) {  //학교 이름 중복
                    ifDuplicate = true;
                    document.getElementById('answertype').innerText = 'number'
                    return '번호를 입력해주세요.\n' + Duplicates(duplicate).map((item, index) => `${index + 1}. ${item}`).join('\n');
                } else {
                    document.getElementById('answertype').innerText = 'info';
                    document.getElementById('mheaderTitle').innerText = SchInfo(Go);
                    document.title = SchInfo(Go);
                    document.getElementById('logs').insertAdjacentHTML('beforeend', `<button id="logElmt"><span> 🏫&nbsp;` + SchInfo(Go) + `</span></button>`);
                    return info_Print(SchInfo(Go), false);
                }
            }
        } catch (error) {
            console.log(error);
            return `죄송합니다. 질문을 다시 한번 확인해주세요.
             "!설명서"를 통해 사용법을 확인하실 수 있습니다.`;
        }
    }
}

function howToUse() {
    return `<'고등학교 찾아주는 봇' 사용 설명서>

            1. 고등학교 정보 보기
            - 고등학교 이름만 입력해야 하며, 공백이 없어야 합니다.
            - 줄여서 검색할 수 있지만, 가장 비슷한 학교 이름이 검색되므로
              원하지 않는 결과가 나올 수 있습니다.
            ex) 세명컴퓨터고등학교 O
            ex) 세명컴고 O
            ex) 세명 컴퓨터고등학교 X

            2. 지역별 고등학교 찾기
            - 도/시를 제외한 군/구/읍/면/리 등의 행정구역은 생략할 수 없습니다.
            - 지역을 '전국'으로 입력하면 전국의 고등학교가 검색됩니다.
            ex) 강남구/서울/서울시/서울특별시 O 
            ex) 강남/은평/서대문 X
            
            3. 종류별 고등학교 찾기
            - '일반고등학교/특성화고등학교/특수목적고등학교/자율고등학교'로 나뉘며,
            일반고/특성화고/특목고/자율고 등으로 줄일 수 있습니다.
            - 모든 종류를 원한다면 '고등학교'를 입력하면 됩니다.
            ex) 서울 고등학교
            ex) 서울 고등학교 공학
            
            4. 성별별 고등학교 찾기
            - 남녀공학/남자고등학교/여자고등학교로 나뉘며,
            공학/남고/여고 등으로 줄일 수 있습니다.
            
            지역, 종류, 성별 모두 함께 사용할 수 있습니다.
            지역은 한 곳만 지정 가능하며, 종류 및 성별은 개수 제한이 없습니다.
            ex) 서울 은평구 남고 여고 특성화고 특목고 O
            ex) 서울 경남 일반고 X
            
            검색시 각 단어 사이에 한 칸씩의 공백을 둬야 합니다.
            ex) 서울 은평구 일반고 공학 O
            ex) 서울은평구 일반고공학 X
            
            본 봇은 AI가 아닌 정해진 명령어대로만 작동하는 점 참고바랍니다.`
}

var schulCodes;

function Duplicates(data) {
    const schulRdnas = data.map(item => item.SCHUL_RDNDA);

    schulCodes = data.map(item => item.SCHUL_CODE);
    return schulRdnas;
}

export { Answer }
