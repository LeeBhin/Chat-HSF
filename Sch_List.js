/**
 * 주어진 데이터에서 필터링된 학교 리스트를 반환하는 함수
 * @param {Array} jsonData - 전체 학교 데이터 배열
 * @param {Array} addressClean - 주소 필터링에 사용할 주소 배열
 * @param {Array} typeArray - 종류 필터링에 사용할 종류 배열
 * @param {Array} gender_Clean - 성별 필터링에 사용할 성별 배열
 * @returns {string} - 필터링된 학교 리스트 문자열
 */
function getListFunction(jsonData, addressClean = [], typeArray = [], gender_Clean = []) {
    const filteredData = jsonData.filter(data =>
        (addressClean.length === 0 || addressClean.some(address =>
            data.SCHUL_RDNMA.includes(address) || data.ADRES_BRKDN.includes(address)
        )) &&
        (typeArray.length === 0 || typeArray.some(type =>
            data.HS_KND_SC_NM.includes(type)
        )) &&
        (gender_Clean.length === 0 || gender_Clean.includes(data.COEDU_SC_CODE))
    );

    const printData = filteredData.map(data => `⦁ ${data.SCHUL_NM}`).join('\n');
    return printData;
}

/**
 * 주어진 문자열에서 특정 키워드를 예외 처리하여 반환하는 함수
 * @param {string} str - 예외 처리할 문자열
 * @returns {string} - 예외 처리된 문자열
 */
function stringFilter(str) {
    const replacements = {
        "Common": "일반고등학교",
        "Special": "특성화고등학교",
        "Purpose": "특수목적고등학교",
        "Free": "자율고등학교",
        "Female": "녀",
        "Male": "남",
        "Mixed": "남녀공학"
    };

    return str.replace(/일반고등학교|일반고|일반학교|특성화고등학교|특성화고|특성화학교|특수목적고등학교|특목고|특수목적고|특수목적학교|특목학교|자율고등학교|자율고|자율학교|여자고등학교|여고|여자고|여자학교|여학교|남자고등학교|남고|남자고|남자학교|남학교|고등학교|공학|공학학교|서울|제주|제주도/g, match => replacements[match] || match);
}

/**
 * 문자열에서 종류와 성별에 해당하는 키워드를 추출하여 반환하는 함수
 * @param {string} str - 추출할 키워드가 있는 문자열
 * @returns {Object} - 추출된 종류와 성별 키워드를 담은 객체
 */
function extractKeywords(str) {
    const typeKeywords = ['Common', 'Special', 'Purpose', 'Free'];
    const genderKeywords = ['Female', 'Male', 'Mixed'];

    const result = {};

    typeKeywords.forEach(keyword => {
        if (str.includes(keyword)) {
            result.Type = result.Type || [];
            result.Type.push(keyword);
        }
    });

    genderKeywords.forEach(keyword => {
        if (str.includes(keyword)) {
            result.Gender = result.Gender || [];
            result.Gender.push(keyword);
        }
    });

    return result;
}

/**
 * 검색어를 받아서 필터링된 학교 리스트와 관련된 정보를 반환하는 함수
 * @param {string} searchString - 검색어 문자열
 * @returns {Object} - 필터링된 학교 리스트와 관련된 정보를 담은 객체
 */
function getSchoolList(searchString) {
    const filteredString = stringFilter(searchString); // 예외 처리된 문자열
    const keywords = extractKeywords(filteredString); // 종류, 성별 키워드
    const addressList = getAddressList(filteredString, All_Info); // 주소 리스트

    const result = {
        List: getListFunction(All_Info, addressList, keywords.Type, keywords.Gender),
        address_Return: addressList,
        types_Return: keywords.Type,
        genders_Return: keywords.Gender
    };

    return result;
}

var Sp = false;

/**
 * 주소를 추출하여 배열로 반환하는 함수
 * @param {string} input - 추출할 주소를 포함하는 문자열
 * @param {Array} jsonDataArray - 전체 학교 데이터 배열
 * @returns {Array} - 추출된 주소를 담은 배열
 */
function getAddressList(input, jsonDataArray) {
    input = input.replace(/ /g, "");

    const regions = ['경상도', '전라도', '충청도', '경상', '전라', '충청', '경남', '경북', '전남', '전북', '충남', '충북'];
    const result = [];

    regions.forEach(region => {
        if (input.includes(region)) {
            if (region === '경상도' || region === '경상') {
                Sp = true;
                result.push('경상남도', '경상북도');
                input = input.replace(region, '');
            } else if (region === '전라도' || region === '전라') {
                Sp = true;
                result.push('전라남도', '전라북도');
                input = input.replace(region, '');
            } else if (region === '충청도' || region === '충청') {
                Sp = true;
                result.push('충청남도', '충청북도');
                input = input.replace(region, '');
            } else if (region === '경남') {
                result.push('경상남도');
                input = input.replace(region, '');
            } else if (region === '경북') {
                result.push('경상북도');
                input = input.replace(region, '');
            } else if (region === '전남') {
                result.push('전라남도');
                input = input.replace(region, '');
            } else if (region === '전북') {
                result.push('전라북도');
                input = input.replace(region, '');
            } else if (region === '충남') {
                result.push('충청남도');
                input = input.replace(region, '');
            } else if (region === '충북') {
                result.push('충청북도');
                input = input.replace(region, '');
            } else {
                result.push(region);
                input = input.replace(region, '');
            }
        }
    });

    const checkArray = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            if (input.includes(arr[i]) || isSubstringInOrder(input, arr[i])) {
                result.push(arr[i]);
                input = input.replace(arr[i], ''); // input에서 해당 문자열 제거
            }
        }
    };

    const isSubstringInOrder = (str, substring) => {
        let strIndex = 0;
        let subIndex = 0;
        let matchCount = 0;

        while (strIndex < str.length && subIndex < substring.length) {
            if (str[strIndex] === substring[subIndex]) {
                subIndex++;
                matchCount++;
            }
            strIndex++;
        }

        return matchCount >= 3;
    };

    for (let i = 0; i < jsonDataArray.length; i++) {
        const jsonData = jsonDataArray[i];
        if (jsonData.ADRES_BRKDN) {
            checkArray(jsonData.ADRES_BRKDN.split(' '), 'ADRES_BRKDN');
        }

        if (result.length === 0 && jsonData.SCHUL_RDNMA) {
            checkArray(jsonData.SCHUL_RDNMA.split(' '), 'SCHUL_RDNMA');
        }
    }

    return result;
}

export { getSchoolList };
