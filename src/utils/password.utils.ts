import bcrypt from 'bcrypt';

export class PasswordHash {
    private static readonly SALT_ROUNDS = 10;

    static async hash(password: string): Promise<string> {
        try {
            return await bcrypt.hash(password, this.SALT_ROUNDS);
        } catch (error) {
            throw new Error('Error hashing password');
        }
    }

    static async compare(password: string, hashedPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
            throw new Error('Error comparing passwords');
        }
    }
}
