import { SchInfo, info_Print, printDuplicates, info_PrintC } from "./Sch_Info.js";
import { SchList } from "./Sch_List.js";

var ifDuplicate = false;

const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('myDatabase', 1);

        request.onerror = (event) => {
            reject('Failed to open database');
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('data')) {
                const objectStore = db.createObjectStore('data', { keyPath: 'id' });
            }
        };
    });
};

const fetchDataFromDB = async () => {
    try {
        const db = await openDB();
        const transaction = db.transaction('data', 'readonly');
        const objectStore = transaction.objectStore('data');

        const schinfo = await objectStore.get('schinfo');
        const stdnt = await objectStore.get('stdnt');

        // 이제 schinfo와 stdnt 데이터를 사용할 수 있습니다.
        // 예를 들어 console.log(schinfo)로 데이터 확인 가능
        return { schinfo, stdnt };
    } catch (error) {
        console.error('Error fetching data from IndexedDB:', error);
    }
};

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

    const data = await fetchDataFromDB();
    const schinfo = JSON.parse(data.schinfo.data);
    const stdnt = JSON.parse(data.stdnt.data);

    if (!schinfo || !stdnt) {
        return '데이터 로딩중입니다... 잠시만 기다려주세요!\n(데이터 갱신 주기 : 일주일)';
    } else {
        try {
            if (ifDuplicate) {
                var num = Question.replace(/\D/g, "") * 1;

                var code = schulCodes[num - 1];

                ifDuplicate = false;

                document.getElementById('answertype').innerText = 'info'
                return info_PrintC(code)
            } else if (!ifDuplicate) {
                var listReturn = SchList(Question);

                console.log(listReturn)
                const Go = Question.split('고')[0] + '고';  //'고'까지의 문자열
                var duplicate = printDuplicates(SchInfo(Go));

                if (compareStrings(Question, SchInfo(Go)) && !listReturn.types_Return && !listReturn.genders_Return) {

                    if (duplicate.length > 1) {  //학교 이름 중복

                        ifDuplicate = true;
                        document.getElementById('answertype').innerText = 'number'
                        return Duplicates(duplicate).map((item, index) => `${index + 1}. ${item}`).join('\n');

                    } else {
                        document.getElementById('answertype').innerText = 'info'
                        document.title = SchInfo(Go)
                        document.getElementById('logs').insertAdjacentHTML('beforeend', `<button id="logElmt">
                            <span> 🏫&nbsp; `+ SchInfo(Go) + `</span>
                        </button>`);
                        return info_Print(SchInfo(Go))
                    }

                } else if (!compareStrings(Question, SchInfo(Go))) {
                    return '죄송하지만 찾을 수가 없네요.'
                } else {
                    document.getElementById('answertype').innerText = 'list'
                    return listReturn.List;
                }
            }

        } catch (error) {
            console.log(error)
            return '죄송하지만 질문을 다시 한번 확인해주세요.'
        }
    }
}

function compareStrings(str1, str2) {
    const commonCharacters = [];

    for (const char1 of str1) {
        if (str2.includes(char1) && !commonCharacters.includes(char1)) {
            commonCharacters.push(char1);
        }
    }

    return commonCharacters.join('').length >= 3;
}


var schulCodes;

function Duplicates(data) {
    const schulRdnas = data.map(item => item.SCHUL_RDNDA);

    schulCodes = data.map(item => item.SCHUL_CODE);
    console.log(schulCodes)
    return schulRdnas;
}

export { Answer }