import * as nodeCrypto from "crypto";
import * as NodeRSA from "node-rsa";
class UtilCrypto {
    /**
    * SHA 256 加密
    * @param str 欲加密字串
    * @param secretStr 金鑰
    */
    sha256Encrypt(str: string, secretStr?: string): string {
        secretStr = secretStr === undefined ? "" : secretStr;
        return nodeCrypto.createHmac('sha256', secretStr).update(str).digest('hex');
    }

    /**
     * SHA 256 hash
     * @param str 要 hash 的字串
     */
    sha256Hash(str: string): string {
        return nodeCrypto.createHash('sha256').update(str).digest("hex");
    }

    sha1Encrypt(str: string): string {
        return nodeCrypto.createHash('sha1').update(str, 'utf8').digest('hex')
    }
    /**
     * 取得 public key 物件
     * @param publicKey public key
     */
    getPublicKey(publicKey: string): RSAPublicKey {
        return new RSAPublicKey(publicKey)
    }

    /**
     * 取得 private key 物件
     * @param privateKey private key
     */
    getPrivateKey(privateKey: string): RSAPrivateKey {
        return new RSAPrivateKey(privateKey)
    }
}

type Encoding = 'ascii' | 'utf8' | 'utf16le' | 'ucs2' | 'latin1'
    | 'base64' | 'hex' | 'binary' | 'buffer';

export class RSAPublicKey {
    private nodeRSA: NodeRSA = null;
    constructor(protected publicKey: string) {
        this.nodeRSA = new NodeRSA(publicKey);
    }

    /**
     * 加密
     * @param message 欲加密字串
     * @param encode encoding 的種類 預設為 base64
     */
    encrypt(message: string, encode: Encoding = "base64"): string {
        return this.nodeRSA.encrypt(message, encode);
    }
}

export class RSAPrivateKey {
    private nodeRSA: NodeRSA = null;
    constructor(protected privateKey: string) {
        this.nodeRSA = new NodeRSA(privateKey);
    }
    /**
     * 解密
     * @param message 欲解密字串
     * @param encode encoding 的種類 預設為 utf8
     */
    decrypt(message: string, encode: Encoding = "utf8"): string {
        return this.nodeRSA.decrypt(message, encode);
    }
}

export const crypto = new UtilCrypto();