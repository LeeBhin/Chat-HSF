let All_Info;
let Student_number;

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

/**
 * 
 * @param {All_Info} jsonData 
 * @param {Address} addressClean 
 * @param {Type} typeArray 
 * @param {Gender} gender_Clean 
 * @returns 
 */
function ListFunction(jsonData, addressClean = [], typeArray = [], gender_Clean = []) {

    // 조건에 맞는 데이터를 저장할 새로운 배열
    let matchedData = [];

    jsonData.forEach(data => {
        const isAddressMatch = addressClean.length === 0 || addressClean[Sp ? 'some' : 'every'](address =>
        ((data.SCHUL_RDNMA !== undefined && data.SCHUL_RDNMA.includes(address)) ||
            (data.ADRES_BRKDN !== undefined && data.ADRES_BRKDN.includes(address)))
        );
        const isTypeMatch = typeArray.length === 0 || typeArray.some(type =>
            data.HS_KND_SC_NM !== undefined && data.HS_KND_SC_NM.includes(type));
        const isGenderMatch = gender_Clean.length === 0 || gender_Clean.includes(data.COEDU_SC_CODE);

        if (isAddressMatch && isTypeMatch && isGenderMatch) {
            // 조건에 맞는 data.SCHUL_NM을 matchedData 배열에 추가
            matchedData.push(data.SCHUL_NM);
        }
    });

    // matchedData 배열을 사용하여 결과 문자열 생성
    const printData = matchedData.map(data => '⦁ ' + data).join('\n');

    return printData;
}

function stringFilter(str) {    //예외 처리
    str = str.replace(/일반고등학교|일반고|일반학교/g, "Common");
    str = str.replace(/특성화고등학교|특성화고|특성화학교/g, "Special");
    str = str.replace(/특수목적고등학교|특목고|특수목적고|특수목적학교|특목학교/g, "Purpose");
    str = str.replace(/자율고등학교|자율고|자율학교/g, "Free");
    str = str.replace(/여자고등학교|여고|여자고|여자학교|여학교/g, "Female");
    str = str.replace(/남자고등학교|남고|남자고|남자학교|남학교/g, "Male");
    str = str.replace(/고등학교/g, " ");
    str = str.replace(/공학|공학학교/g, "Mixed");
    return str
}

function filtered_to_Keyword(str) {
    const typeKeywords = ['Common', 'Special', 'Purpose', 'Free'];
    const genderKeywords = ['Female', 'Male', 'Mixed'];

    const result = {};

    // Type 키워드 찾기
    const foundTypes = typeKeywords.filter(keyword => str.includes(keyword));
    if (foundTypes.length > 0) {
        result.Type = foundTypes;
    }

    // Gender 키워드 찾기
    const foundGenders = genderKeywords.filter(keyword => str.includes(keyword));
    if (foundGenders.length > 0) {
        result.Gender = foundGenders;
    }

    const replacements = {
        "Common": "일반고등학교",
        "Special": "특성화고등학교",
        "Purpose": "특수목적고등학교",
        "Free": "자율고등학교",
        "Female": "녀",
        "Male": "남",
        "Mixed": "남녀공학",
        "부산": "부산광역시",
        "대구": "대구광역시",
        "인천": "인천광역시",
        "광주": "광주광역시",
        "대전": "대전광역시",
        "울산": "울산광역시",
        "세종": "세종특별자치시",
        "부산시": "부산광역시",
        "대구시": "대구광역시",
        "인천시": "인천광역시",
        "대전시": "대전광역시",
        "울산시": "울산광역시",
        "세종시": "세종특별자치시",
    };

    for (const key in result) {
        const values = result[key];
        for (let i = 0; i < values.length; i++) {
            values[i] = replacements[values[i]] || values[i];
        }
    }
    return result;
}

function SchList(string) {
    var Filtered = stringFilter(string) //예외 처리된 문자열
    var Keyword = filtered_to_Keyword(Filtered) //종류,성별
    var adr = address_Only(Filtered, All_Info)  //주소 리스트
    var Types = Keyword.Type
    var Genders = Keyword.Gender
    const Address = Array.from(new Set(adr.filter(Boolean)));

    var result = {
        "List": ListFunction(All_Info, Address, Types, Genders),
        "address_Return": Address,
        "types_Return": Types,
        "genders_Return": Genders
    };
    return result;
}

var Sp = false
function address_Only(input) {
    Sp = false
    var result = input.split(' ').filter(item => item.trim() !== '');
    // const result = [];

    const regions = ['서울', '서울시', '경기', '경기도', '강원', '강원도', '경상도', '전라도', '충청도', '경상', '전라', '충청', '경남', '경북', '전남', '전북', '충남', '충북', '제주', '제주도', '제주시', '전국', '대한민국', '한국', '국내'];
    regions.forEach(region => {
        if (input.includes(region)) {
            if (region == '경상도' || region == '경상') {
                Sp = true;
                result.push('경상남도')
                result.push('경상북도')
            } else if (region == '서울' || region == '서울시') {
                result.push('서울특별시')
            } else if (region == '강원' || region == '강원도') {
                result.push('강원특별자치도')
            } else if (region == '제주' || region == '제주시' || region == '제주도') {
                result.push('제주특별자치도')
            } else if (region == '경기' || region == '경기도') {
                result.push('경기도')
            } else if (region == '전라도' || region == '전라') {
                Sp = true;
                result.push('전라남도')
                result.push('전라북도')
            } else if (region == '충청도' || region == '충청') {
                Sp = true;
                result.push('충청남도')
                result.push('충청북도')
            } else if (region == '경남') {
                result.push('경상남도')
            } else if (region == '경북') {
                result.push('경상북도')
            } else if (region == '전남') {
                result.push('전라남도')
            } else if (region == '전북') {
                result.push('전라북도')
            } else if (region == '충남') {
                result.push('충청남도')
            } else if (region == '충북') {
                result.push('충청북도')
            } else if (region == '전국' || '한국' || '대한민국' || '국내') {
                Sp = true;
                result.push('서울특별시');
                result.push('부산광역시');
                result.push('대구광역시');
                result.push('인천광역시');
                result.push('광주광역시');
                result.push('대전광역시');
                result.push('울산광역시');
                result.push('세종특별자치시');
                result.push('경기도');
                result.push('강원도');
                result.push('충청북도');
                result.push('충청남도');
                result.push('전라북도');
                result.push('전라남도');
                result.push('경상북도');
                result.push('경상남도');
                result.push('제주특별자치도');
            }
            result = result.filter(re => re !== region);
        }

    });
    result = result.filter(re => re !== '남녀Mixed');
    result = result.filter(item => !/^[A-Za-z]+$/.test(item));
    result = [...new Set(result)];
    return result;
}

export { SchList }