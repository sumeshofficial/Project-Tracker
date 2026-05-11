import type { RegisterDto } from "@application/dtos/auth/register.dto";
import { UserExistsException } from "@application/errors/auth/user-exists.exception";
import type { PasswordHasher } from "@application/ports/password-hasher.port";
import { User, type UserDTO } from "@domain/entities/user.entity";
import type { UserRepository } from "@domain/repositories/user.repository";

export class RegisterUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher
    ) {}

    private async ensureUserDoesNotExist(email: string): Promise<void> {
        const existingUser = await this.userRepository.findByEmail(email);

        if (existingUser) {
            throw new UserExistsException();
        }
    }

    async execute(input: RegisterDto): Promise<UserDTO> {
        await this.ensureUserDoesNotExist(input.email);

        const passwordHash = await this.passwordHasher.hash(input.password);

        const user = User.create({
            fullname: input.fullname,
            email: input.email,
            passwordHash: passwordHash,
        });

        await this.userRepository.save(user);

        return user.toPrimitives();
    }
}