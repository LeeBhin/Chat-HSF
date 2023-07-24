import { SchInfo, info_Print } from "./Sch_Info.js";
import { SchList } from "./Sch_List.js";

const allinfo = localStorage.getItem('schinfo');
const All_Info = JSON.parse(allinfo)

function Answer(Question) {
    if (Question == '!업데이트') {
        localStorage.removeItem('schinfo');
        localStorage.removeItem('stdnt');
        localStorage.removeItem('lastUpdated');
        window.location.reload();
    }

    const schinfo = localStorage.getItem('schinfo');
    const stdnt = localStorage.getItem('stdnt');

    if (!schinfo || !stdnt) {
        return '데이터 로딩중입니다... 잠시만 기다려주세요!\n(데이터 갱신 주기 : 일주일)'
    }

    else {
        var listReturn = SchList(Question)
        console.log(listReturn)

        if (listReturn.address_Return.length == 0) {
            const Go = Question.split('고')[0] + '고';

            return info_Print(SchInfo(Go))
        } else if (!listReturn.List) {
            return '죄송하지만 찾을 수가 없네요.'
        }
        else {
            return listReturn.List
        }
    }
}

export { Answer }