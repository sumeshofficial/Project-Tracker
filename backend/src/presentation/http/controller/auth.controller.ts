import type { Request, Response } from "express";
import { RegisterUseCase } from "@application/use-cases/auth/register.usecase";
import { RegisterDtoSchema } from "@application/dtos/auth/register.dto";
import { LoginUseCase } from "@application/use-cases/auth/login.usecase";
import { LoginDtoSchema } from "@application/dtos/auth/login.dto";

export class AuthController {
  constructor(
    private _registerUseCase: RegisterUseCase,
    private _loginUseCase: LoginUseCase
  ) {}

  register = async (req: Request, res: Response) => {
    const dto = RegisterDtoSchema.parse(req.body);
    const user = await this._registerUseCase.execute(dto);
    res.status(201).json({ success: true, data: user });
  };

  login = async (req: Request, res: Response) => {
    const dto = LoginDtoSchema.parse(req.body);
    const token = await this._loginUseCase.execute(dto);
    res.status(200).json({ success: true, data: token });
  };

  getMe = async (req: Request, res: Response) => {
    const user = req.user;
    res.status(200).json({
      success: true,
      data: {
        id: user?.sub,
        email: user?.email,
      },
    });
  };
}
