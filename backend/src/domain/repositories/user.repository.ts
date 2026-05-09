import type { User } from "@domain/entities/user.entity.js";

export interface UserRepository {
    save(user: User): Promise<void>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
}