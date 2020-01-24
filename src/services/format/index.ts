import * as luxon from "luxon";
import { AppError } from "../../view-models/common.vm";
import { ResultCode } from "../../view-models/result-code.vm";
import * as commaNumber from "comma-number";
class Format {
    toLuxonDate(dateUnKnow: unknown): luxon.DateTime {
        let luxonDate = luxon.DateTime.fromJSDate(dateUnKnow as Date);
        if (luxonDate.isValid) {
            return luxonDate
        }

        luxonDate = luxon.DateTime.fromISO(dateUnKnow as string);

        if (luxonDate.isValid) {
            return luxonDate
        }

        luxonDate = luxon.DateTime.fromFormat(dateUnKnow as string, 'yyyy-MM-dd hh:mm:ss');

        if (luxonDate.isValid) {
            return luxonDate
        }


        luxonDate = luxon.DateTime.fromFormat(dateUnKnow as string, 'yyyy/MM/dd hh:mm:ss');

        if (luxonDate.isValid) {
            return luxonDate
        }

        throw new AppError('date time format error', ResultCode.DATE_TIME_FORMAT_ERROR)
    }

    parseDecimalStringToNumber(decimalString: string): number {
        const num = parseFloat(decimalString);
        if (isNaN(num)) {
            throw new AppError(`format error`, ResultCode.DECIMAL_FORMAT_ERROR)
        }
        return num;
    }

    /**
     * 有千分為逗號的數字
     */
    parseCommaNumber(num: number | string): string {
        if (typeof num === "string") {
            const val = parseFloat(num);
            if (isNaN(val)) {
                throw new AppError(`format error`, ResultCode.DECIMAL_FORMAT_ERROR)
            }

            num = val;
        }
        return commaNumber(num)
    }

    parseNumberToDecimal(amount: number): string {
        return amount.toFixed(4);
    }

    padLeft(str: string, length: number, padLeftStr?: string): string {
        if (!padLeftStr) {
            padLeftStr = "0";
        }
        if (str.length >= length)
            return str;
        else
            return this.padLeft(padLeftStr + str, length, padLeftStr);
    }

    /**
    * 將使用者習慣輸入的手機號碼 format 成系統要吃的資料(濾掉 0)
    */
    mobile(mobile: string, callingCode: string): string {
        let newMobile: string = mobile
        switch (callingCode) {
            case "886":
                newMobile = newMobile.replace(/^09/, '9')
                break;
            case "60":
                newMobile = newMobile.replace(/^01/, '1')
                break;
        }

        return newMobile
    }

    /**
     * 回傳+國際碼及電話號碼
     * @param mobile 
     * @param callingCode 國際代碼（台灣：+886)
     */

    mobileWithPlusCallingCode(mobile: string, callingCode: string): string {

        return `+${callingCode}${mobile}`
    }
}

export const formatter = new Format();