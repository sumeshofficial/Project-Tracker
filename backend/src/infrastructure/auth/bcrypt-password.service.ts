import type { PasswordHasher } from "@application/ports/password-hasher.port";
import bcrypt from "bcryptjs";

export class PasswordHashService implements PasswordHasher {
    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    };

    compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    };
}