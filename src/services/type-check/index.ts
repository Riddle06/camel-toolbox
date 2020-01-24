import * as uuidValidate from "uuid-validate";
class TypeCheck {
    isNullOrUndefinedOrWhiteSpace(value: string): boolean {

        if (value === null) {
            return true;
        }

        if (value === undefined) {
            return true;
        }

        if (value.replace(/\s/g, '') === '') {
            return true;
        }

        return false;
    }

    /**
     * 是否為大於 0 的整數
     */
    isNaturalInteger(num: number): boolean {
        const regex = /^\+?[1-9][0-9]*$/;

        return regex.test(num.toString());
    }

    isNullOrUndefinedObject(obj: any): boolean {
        return obj === undefined || obj === null;
    }

    isEmail(str: string): boolean {
        let mailRegExp: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return mailRegExp.test(str);
    }

    isUUID(id: string): boolean {
        return uuidValidate(id);
    }

    isMobile(mobile: string, callingCode: string): boolean {

        const mobileRegexDic = {
            "886": /^(9)([0-9]{8})$/,
            "60": /^(1)[0-46-9][0-9]{7,8}$/,
        }

        if (this.isNullOrUndefinedObject(mobileRegexDic[callingCode])) {
            return false;
        }

        const mobileRegex: RegExp = mobileRegexDic[callingCode]

        return mobileRegex.test(mobile);
    }

    /**
     * 手機條碼載具
     * 格式為「/」+「7碼英、數、符號(+ - .)」，共8碼（全大寫）
     * ref. https://www.powerweb.tw/modules/qna/V121.html
     */
    isMobileBarcodeCarrier(carrierId: string): boolean {
        const regex = /^\/[A-Z0-9+-.]{7}$/;

        return regex.test(carrierId);
    }

    /**
     * 自然人憑證載具
     * 格式為「2碼大寫英文」+「14碼數字」
     */
    isNaturalPersonCertificateCarrier(carrierId: string): boolean {
        const regex = /^[A-Z]{2}[0-9]{14}$/;

        return regex.test(carrierId);
    }

    /**
     * 統一編號格式驗證
     */
    isTaxNo(idd: string): boolean {
        idd = `${idd}`;
        let sum = 0;
        const tmp = '12121241';
        const re = /^\d{8}$/;
        if (!re.test(idd)) {
            return false;
        }
        const valid = (n: number): boolean => {
            return (n % 10 === 0) ? true : false;
        }
        const cal = (n: number): number => {
            let sum = 0;
            while (n !== 0) {
                sum += (n % 10);
                n = (n - n % 10) / 10;  // 取整數
            }
            return sum;
        }
        for (let i = 0; i < 8; i++) {
            const s1 = parseInt(idd.substr(i, 1), 10);
            const s2 = parseInt(tmp.substr(i, 1), 10);
            sum += cal(s1 * s2);
        }
        if (!valid(sum)) {
            if (idd.substr(6, 1) === '7') return (valid(sum + 1));
        }
        return (valid(sum));
    }

    /**
     *  台灣身分證格式驗證
     */
    isTaiwanId(id: string): boolean {
        id = id.toUpperCase();

        const format = /^[A-Z][12]\d{8}$/i;
        if (!format.test(id)) {
            return false;
        }

        // ref. https://jaichang2008.pixnet.net/blog/post/25344846-javascript-%E8%BA%AB%E4%BB%BD%E8%AD%89%E5%AD%97%E8%99%9F%E9%A9%97%E8%AD%89
        const prefix = "ABCDEFGHJKLMNPQRSTUVXYWZIO"
        const A1 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3];
        const A2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5];
        const Mx = [9, 8, 7, 6, 5, 4, 3, 2, 1, 1];

        const index = prefix.indexOf(id.charAt(0));
        if (index < 0) {
            return false;
        }
        let sum = A1[index] + A2[index] * 9;

        for (let i = 1; i < 10; i++) {
            const v = parseInt(id.charAt(i));
            if (isNaN(v)) {
                return false;
            }
            sum = sum + v * Mx[i];
        }

        return sum % 10 === 0;
    }

    /**
     * 台灣居留證（外來人口統一證號）格式驗證
     * ARC = Alien Resident Certificate
     */
    isTaiwanARC(id: string): boolean {
        id = id.toUpperCase();

        const format = /^[A-Z][A-D][\d]{8}$/;
        if (!format.test(id)) {
            return false;
        }

        // ref. https://github.com/yutin1987/taiwanid/blob/master/src/index.js
        const prefix = {
            A: 10, B: 11, C: 12, D: 13,
            E: 14, F: 15, G: 16, H: 17,
            I: 34, J: 18, K: 19, L: 20,
            M: 21, N: 22, O: 35, P: 23,
            Q: 24, R: 25, S: 26, T: 27,
            U: 28, V: 29, W: 32, X: 30,
            Y: 31, Z: 33,
        };
        let total = 0;
        const Mx = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1];
        const idArr = id.split('');

        const studIdNumber = `${(prefix[idArr[0]])}${(prefix[idArr[1]] % 10)}${id.substr(2,8)}`;
        
        Mx.forEach((num, index) => {
            total += parseInt(studIdNumber[index], 10) * num;
        })
        
        return total % 10 === 0;
    }

    /**
     * 是否為正確的密碼格式
     * 必要條件：minLength(預設8) ~ maxLength(預設20) 字內的英數混合
     * 可使用的特殊符號清單 ! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [  ] ^ _` { | } ~ \
     * @param password 
     * @param maxLength 
     * ref. http://support.ricoh.com/bb_v1oi/pub_e/oi_view/0001059/0001059099/view/security/int/0010.htm
     * ref. https://www.owasp.org/index.php/Password_special_characters
     */
    isPassword(password: string, minLength = 8, maxLength = 20): boolean {
        const passwordRegex = new RegExp(`^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d!\\"\\#\\$\\%\\&\\'\\(\\)\\*\\+\\,\\-\\.\\/\\:\\;\\<\\=\\>\\?\\@\\[\\]\\^\\_\`\\{\\|\\}\\~\\\\]{${minLength},${maxLength}}$`);
        
        return passwordRegex.test(password);
    }

    /**
     * 是否為護照號碼
     * 7-9位的英數
     * ex. 台灣是9碼數字無英文
     */
    isPassport(value: string): boolean {
        const regex = /^[A-Z0-9]{7,9}$/;
        return regex.test(value);
    }
}

export const typeChecker = new TypeCheck()