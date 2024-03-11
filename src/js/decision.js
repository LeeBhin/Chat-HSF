import { SchInfo, info_Print, printDuplicates, info_PrintC } from "./Sch_Info.js";
import { SchList } from "./Sch_List.js";

let ifDuplicate = false;
let All_Info;
let Student_number;

const openDBForReading = () => new Promise((resolve, reject) => {
    const request = indexedDB.open('myDatabase', 1);
    request.onerror = event => reject('Failed to open database');
    request.onsuccess = event => resolve(event.target.result);
});

const fetchDataFromDB = async () => {
    try {
        const db = await openDBForReading();
        const transaction = db.transaction('data', 'readonly');
        const objectStore = transaction.objectStore('data');
        const schInfoRequest = objectStore.get('schinfo');
        const stdntRequest = objectStore.get('stdnt');

        schInfoRequest.onsuccess = event => All_Info = event.target.result.data;
        stdntRequest.onsuccess = event => Student_number = event.target.result.data;
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

    if (!All_Info || !Student_number) return '데이터 로딩중입니다... 잠시만 기다려주세요!\n(데이터 갱신 주기 : 일주일)';

    try {
        if (ifDuplicate) {
            const num = parseInt(Question.replace(/\D/g, ""));
            if (num >= 1 && num <= schulCodes.length) {
                ifDuplicate = false;
                document.getElementById('answertype').innerText = 'info';
                document.getElementById('mbheader').innerText = SchInfo(Go);
                return info_PrintC(schulCodes[num - 1]);
            } else {
                return '올바른 번호를 입력해주세요.';
            }
        } else {
            const listReturn = SchList(Question);
            const Go = Question.split('고')[0] + '고';
            const duplicate = printDuplicates(SchInfo(Go));

            if (compareStrings(Question, SchInfo(Go)) && !listReturn.types_Return && !Question.includes('있는') && !Question.includes('위치') && !Question.includes('소재')) {
                if (duplicate.length > 1) {
                    ifDuplicate = true;
                    document.getElementById('answertype').innerText = 'number';
                    return Duplicates(duplicate).map((item, index) => `${index + 1}. ${item}`).join('\n');
                } else {
                    document.getElementById('answertype').innerText = 'info';
                    document.getElementById('mbheader').innerText = SchInfo(Go);
                    document.title = SchInfo(Go);
                    document.getElementById('logs').insertAdjacentHTML('beforeend', `<button id="logElmt"><span> 🏫&nbsp; ${SchInfo(Go)}</span></button>`);
                    return info_Print(SchInfo(Go));
                }
            } else if (!compareStrings(Question, SchInfo(Go))) {
                return '학교를 찾을 수 없어요.';
            } else {
                document.getElementById('answertype').innerText = 'list';
                return listReturn.List === "" ? '조건에 해당하는 학교를 찾을 수 없습니다.' : listReturn.List;
            }
        }
    } catch (error) {
        console.log(error);
        return '죄송하지만 질문을 다시 한번 확인해주세요.';
    }
}

function compareStrings(str1, str2) {
    const commonCharacters = [];
    for (const char1 of str1) if (str2.includes(char1) && !commonCharacters.includes(char1)) commonCharacters.push(char1);
    return commonCharacters.join('').length >= 3;
}

let schulCodes;
function Duplicates(data) {
    schulCodes = data.map(item => item.SCHUL_CODE);
    return data.map(item => item.SCHUL_RDNDA);
}

export { Answer };