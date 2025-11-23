interface TokenOptions {
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
    length: number;
}

export function generateToken({
                                  uppercase,
                                  lowercase,
                                  numbers,
                                  symbols,
                                  length,
                              }: TokenOptions): string {

    let chars = "";

    if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers)   chars += "0123456789";
    if (symbols)   chars += "!@#$%^&*()_+-=[]{};:,.<>/?";

    if (!chars) return "";

    let output = "";

    for (let i = 0; i < length; i++) {
        output += chars[Math.floor(Math.random() * chars.length)];
    }

    return output;
}
