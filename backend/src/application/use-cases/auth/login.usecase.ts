import type { LoginDto } from "@application/dtos/auth/login.dto";
import { InvalidCredentialsException } from "@application/errors/auth/invalid-credentials.exception";
import type { PasswordHasher } from "@application/ports/password-hasher.port";
import type { TokenService } from "@application/ports/token.port";
import type { User } from "@domain/entities/user.entity";
import type { UserRepository } from "@domain/repositories/user.repository";

export class LoginUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher,
        private readonly tokenService: TokenService,
    ) {}

    private async getUserOrFail(email: string): Promise<User> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new InvalidCredentialsException();
        }

        return user;
    }

    private async validatePassword(password: string, user: User) {
        const isValid = await this.passwordHasher.compare(
            password,
            user.passwordHashValue
        );

        if (!isValid) {
            throw new InvalidCredentialsException();
        }
    }

    private generateToken(user: User): string {
        return this.tokenService.generate({
            sub: user.id,
            email: user.email
        });
    }

    async execute(input: LoginDto): Promise<{ accessToken: string }> {
        const user = await this.getUserOrFail(input.email);

        await this.validatePassword(input.password, user);

        const accessToken = this.generateToken(user);

        return { accessToken };
    }
}