let All_Info;
let Student_number;

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

        All_Info = await objectStore.get('schinfo').data;
        console.log(await objectStore.get('schinfo'))
        console.log(await objectStore.get('schinfo').data)
        console.log(await objectStore.get('schinfo').result)
        Student_number = await objectStore.get('stdnt').data;

    } catch (error) {
        console.error('Error fetching data from IndexedDB:', error);
    }
};
fetchDataFromDB();



// 학교 이름 리스트 생성 함수
function SchNm() {
    return All_Info.map(item => item.SCHUL_NM);
}

// 학교 이름으로 학생 정보를 필터링하는 함수
function Stdnt(School) {
    return Student_number
        .filter(item => item.SCHUL_NM === School)
        .map(({ COL_MSUM, COL_WSUM, SCHUL_NM }) => ({ COL_MSUM, COL_WSUM, SchNm: SCHUL_NM }));
}

// 학교 코드로 학생 정보를 필터링하는 함수
function StdntC(SchoolCode) {
    return Student_number
        .filter(item => item.SCHUL_CODE === SchoolCode)
        .map(({ COL_MSUM, COL_WSUM, SCHUL_NM }) => ({ COL_MSUM, COL_WSUM, SchNm: SCHUL_NM }));
}

// 문자열 비교하여 가장 유사한 항목 찾는 함수 (Levenshtein distance X)
function SchInfo(inputString) {

    if (inputString.length < 3) {
        return 0;
    }

    var stringList = SchNm();

    // 유사한 항목 찾기
    let bestMatch = null;
    let bestMatchScore = 0;

    for (let i = 0; i < stringList.length; i++) {
        const currentString = stringList[i];
        let matchCount = 0;

        // 세 글자 이상 일치 여부 확인
        if (currentString.length < 3) {
            continue;
        }

        // 일치하는 글자 수 계산
        for (let j = 0; j < inputString.length; j++) {
            if (currentString.includes(inputString[j])) {
                matchCount++;
            }
        }

        // 가장 유사한 항목 판단
        if (matchCount > bestMatchScore) {
            bestMatch = currentString;
            bestMatchScore = matchCount;
        } else if (matchCount === bestMatchScore) {
            // 글자 순서 비교하여 더 유사한 항목 선택
            let bestMatchChars = bestMatch.split('');
            let currentChars = currentString.split('');
            let inputChars = inputString.split('');

            let bestMatchDiff = 0;
            let currentDiff = 0;

            for (let k = 0; k < inputChars.length; k++) {
                if (bestMatchChars[k] !== inputChars[k]) {
                    bestMatchDiff++;
                }

                if (currentChars[k] !== inputChars[k]) {
                    currentDiff++;
                }
            }

            if (currentDiff <= bestMatchDiff) {
                bestMatch = currentString;
                bestMatchScore = matchCount;
            }
        }
    }

    return bestMatch;
}

// 중복 데이터를 필터링하여 반환하는 함수
function printDuplicates(Sch) {
    const filteredInfo = All_Info.filter(item => item.SCHUL_NM === Sch);
    return filteredInfo.map(({ SCHUL_NM, SCHUL_RDNDA, SCHUL_CODE }) => ({ SCHUL_NM, SCHUL_RDNDA, SCHUL_CODE }));
}

var schcode;

// 학교 정보 출력 함수
function info_Print(School) {
    const schoolData = All_Info.find(item => item.SCHUL_NM === School);
    const stdntData = Stdnt(School)[0];
    const MS = stdntData.COL_MSUM + '명';
    const WS = stdntData.COL_WSUM + '명';

    schcode = schoolData.SCHUL_CODE
    document.getElementById('code').innerText = schcode

    // const Birth = date(schoolData.FOND_YMD);
    const Open = date(schoolData.FOAS_MEMRD);

    const gdM = schoolData.COEDU_SC_CODE === '남' ? '남자고등학교' : schoolData.COEDU_SC_CODE === '녀' ? '여자고등학교' : '남녀공학';
    const birthYear = schoolData.FOND_YMD.substring(0, 4) + '년';

    return `학교명: ${schoolData.SCHUL_NM}\n종류: ${schoolData.HS_KND_SC_NM}\n남녀 구분: ${gdM}\n남학생 수: ${MS}\n여학생 수: ${WS}\n설립구분: ${schoolData.FOND_SC_CODE}\n설립유형: ${schoolData.SCHUL_FOND_TYP_CODE}\n설립연도: ${birthYear}\n개교기념일: ${Open}\n주소: ${schoolData.ADRES_BRKDN}\n도로명 주소: ${schoolData.SCHUL_RDNMA}\n우편번호: ${schoolData.ZIP_CODE}\n전화번호: ${schoolData.USER_TELNO}\n팩스번호: ${schoolData.PERC_FAXNO}\n홈페이지: ㉾${schoolData.HMPG_ADRES}㉾\n시도교육청: ${schoolData.ATPT_OFCDC_ORG_NM}\n주야구분: ${schoolData.DGHT_SC_CODE}\n`;
}

// 학교 코드로 학교 정보 출력 함수
function info_PrintC(code) {
    const schoolData = All_Info.find(item => item.SCHUL_CODE === code);
    const stdntData = StdntC(code)[0];
    const MS = stdntData.COL_MSUM + '명';
    const WS = stdntData.COL_WSUM + '명';

    schcode = schoolData.SCHUL_CODE
    document.getElementById('code').innerText = schcode

    // const Birth = date(schoolData.FOND_YMD);
    const Open = date(schoolData.FOAS_MEMRD);

    const gdM = schoolData.COEDU_SC_CODE === '남' ? '남자고등학교' : schoolData.COEDU_SC_CODE === '녀' ? '여자고등학교' : '남녀공학';
    const birthYear = schoolData.FOND_YMD.substring(0, 4) + '년';

    return `학교명: ${schoolData.SCHUL_NM}\n종류: ${schoolData.HS_KND_SC_NM}\n남녀 구분: ${gdM}\n남학생 수: ${MS}\n여학생 수: ${WS}\n설립구분: ${schoolData.FOND_SC_CODE}\n설립유형: ${schoolData.SCHUL_FOND_TYP_CODE}\n설립연도: ${birthYear}\n개교기념일: ${Open}\n주소: ${schoolData.ADRES_BRKDN}\n도로명 주소: ${schoolData.SCHUL_RDNMA}\n우편번호: ${schoolData.ZIP_CODE}\n전화번호: ${schoolData.USER_TELNO}\n팩스번호: ${schoolData.PERC_FAXNO}\n홈페이지: ㉾${schoolData.HMPG_ADRES}㉾\n시도교육청: ${schoolData.ATPT_OFCDC_ORG_NM}\n주야구분: ${schoolData.DGHT_SC_CODE}\n`;
}

// 날짜 형식 변경 함수
function date(date) {
    return date.substring(0, 4) + '년 ' + date.substring(4, 6) + '월 ' + date.substring(6) + '일';
}

// 학교 코드로 학교 위치를 필터링하는 함수
function findCode(SchoolCode) {
    return All_Info
        .filter(item => item.SCHUL_CODE === SchoolCode)
        .map(({ LTTUD, LGTUD }) => ({ LTTUD, LGTUD }));

}

export { SchInfo, printDuplicates, info_Print, info_PrintC, findCode };
