export declare async function hashPassword(password: string): string;
export declare async function verifyPassword(password: string, hashedPassword: string): object;

export declare function createAccessToken(data: {}): string;
export declare function verifyAccessToken(token: string): 
{ username: string, iat: number, exp: number } | false;

export declare function createRefreshToken(data: {}): string;
export declare function createNonRememberedRT(data: {}): string;
export declare function verifyRefreshToken(token: string): 
{ username: string, iat: number, exp: number } | false;

export declare function validatePhone(phone: string): boolean;
export declare function validateEmail(email: string): boolean;
export declare function validatePassword(password: string): boolean;
