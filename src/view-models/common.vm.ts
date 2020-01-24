export class AppError extends Error {
    public localeKey: string
    public localeParams: any;
    public code: number;
    constructor(message: string, code: number, localeKey?: string, localeParams?: any) {
        super(message);
        this.code = code;
        this.localeKey = localeKey
        this.localeParams = localeParams;
    }
}