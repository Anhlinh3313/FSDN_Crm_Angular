export class StringHelper {
    static isNullOrEmpty(s: string): boolean {
        if (!s) {
            return true;
        } else {
            if (s.trim() === "") {
                return true;
            }
            return false;
        }
    }

    static isNumber(value: string | number): boolean {
        return ((value != null) && !isNaN(Number(value.toString())));
    }
}