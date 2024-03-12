import { SchInfo, info_Print, printDuplicates, info_PrintC } from "./Sch_Info.js";
import { SchList } from "./Sch_List.js";

var ifDuplicate = false;

var All_Info;
var Student_number;

import info from './info.js'
import students from './students.js'
All_Info = info.list
Student_number = students.list

// const openDBForReading = () => {
//     return new Promise((resolve, reject) => {
//         const request = indexedDB.open('myDatabase', 1);

//         request.onerror = (event) => {
//             reject('Failed to open database');
//         };

//         request.onsuccess = (event) => {
//             const db = event.target.result;
//             resolve(db);
//         };
//     });
// };

// const fetchDataFromDB = async () => {
//     try {
//         const db = await openDBForReading();
//         const transaction = db.transaction('data', 'readonly');
//         const objectStore = transaction.objectStore('data');

//         const schInfoRequest = objectStore.get('schinfo');
//         const stdntRequest = objectStore.get('stdnt');

//         schInfoRequest.onsuccess = (event) => {
//             const result = event.target.result;
//             if (result) {
//                 All_Info = result.data;
//             }
//         };

//         stdntRequest.onsuccess = (event) => {
//             const result = event.target.result;
//             if (result) {
//                 Student_number = result.data;
//             }
//         };
//     } catch (error) {
//         console.error('Error fetching data from IndexedDB:', error);
//     }
// };
// fetchDataFromDB();

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
    // 데이터 로딩 중인지 확인
    if (!All_Info || !Student_number) {
        return '데이터 로딩중입니다... 잠시만 기다려주세요!\n(데이터 갱신 주기 : 일주일)';
    } else {
        try {
            // question 문자열에 공백이 있는지 확인
            if (Question.includes(' ')) {
                // 공백이 있다면 학교 리스트 반환
                const schoolList = SchList(Question)
                return schoolList.List;
            } else {
                // 공백이 없다면 특정 학교 정보 반환
                const Go = Question.split('고')[0] + '고'; // '고'까지의 문자열
                document.getElementById('answertype').innerText = 'info';
                document.getElementById('mbheader').innerText = SchInfo(Go);
                document.title = SchInfo(Go);
                document.getElementById('logs').insertAdjacentHTML('beforeend', `<button id="logElmt">
                    <span> 🏫&nbsp; `+ SchInfo(Go) + `</span>
                </button>`);
                return info_Print(SchInfo(Go));
            }
        } catch (error) {
            console.log(error);
            return '죄송하지만 질문을 다시 한번 확인해주세요.';
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
    return schulRdnas;
}

export { Answer }
