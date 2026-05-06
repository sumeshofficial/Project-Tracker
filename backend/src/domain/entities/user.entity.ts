import { randomUUID } from "node:crypto";

export class User {
  constructor(
    private readonly _id: string,
    private _fullname: string,
    private _email: string,
    private _password: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {
    this.validateEmail(this._email);
    this.validateFullname(this._fullname);
  }

  // Validations

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new Error(`Invalid email format: ${email}`);
    }
  }

  private validateFullname(fullname: string): void {
    if (!fullname || fullname.trim().length === 0) {
      throw new Error("Fullname cannot be empty");
    }

    if (fullname.length > 100) {
      throw new Error("Fullname cannot exceed 100 characters");
    }
  }

  // Getters

  get id(): string {
    return this._id;
  }

  get fullname(): string {
    return this._fullname;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  static create(data: {
    fullname: string;
    email: string;
    password: string;
  }): User {
    const now = new Date();

    return new User(
      randomUUID(),
      data.fullname,
      data.email,
      data.password,
      now,
      now
    );
  }

  // DTO

  toPrimitives() {
    return {
        id: this._id,
        fullname: this._fullname,
        email: this._email,
        createdAt: this._createdAt,
        updatedAt: this._updatedAt,
    }
  }
}

export type UserDTO = ReturnType<typeof User.prototype.toPrimitives>;