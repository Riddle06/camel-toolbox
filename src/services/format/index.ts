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

    tryGetInteger(num: unknown, defaultValue: number | null = null): number {

        if (typeof num === "string") {
            const parsedNumber = parseInt(num);

            if (isNaN(parsedNumber)) {
                return defaultValue
            } else {
                return parsedNumber;
            }
        }

        if (typeof num === "number") {
            return Math.floor(num)
        }


        return defaultValue
    }

    tryGetNumber(num: unknown, defaultValue: number | null = null): number {

        if (typeof num === "string") {
            const parsedNumber = parseFloat(num);

            if (isNaN(parsedNumber)) {
                return defaultValue
            } else {
                return parsedNumber;
            }
        }

        if (typeof num === "number") {
            return num
        }


        return defaultValue
    }


    tryGetDate(date: unknown, defaultValue: Date | null = null): Date {

        if (date instanceof Date) {
            return date;
        }

        if (typeof date === "string") {
            const formatToSecondsLuxon = luxon.DateTime.fromFormat(date, "yyyy-MM-dd HH:mm:ss");

            if (formatToSecondsLuxon.isValid) {
                return formatToSecondsLuxon.toJSDate();
            }

            const ISOLuxon = luxon.DateTime.fromISO(date);

            if (ISOLuxon.isValid) {
                return ISOLuxon.toJSDate();
            }

            const formatToMinuteLuxon = luxon.DateTime.fromFormat(date, "yyyy-MM-dd HH:mm");

            if (formatToMinuteLuxon.isValid) {
                return formatToMinuteLuxon.toJSDate();
            }
        }

        return defaultValue
    }

    tryGetString(num: unknown, defaultValue: string | null = null): string {

        if (typeof num === "string") {
            return num;
        }

        if (typeof num === "number") {
            return num.toString();
        }

        if (Array.isArray(num)) {
            return num.join(",")
        }

        return defaultValue;
    }
    
    tryGetBoolean(value: unknown, defaultValue: boolean | null = null) {
        switch (value) {
            case true:
            case "true":
            case 1:
            case "1":
                return true;

            case false:
            case "false":
            case 0:
            case "0":
                return false;
            default:
                return defaultValue;
        }
    }
}

export const formatter = new Format();