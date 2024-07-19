import { Request, Response } from "express";
import { BankService } from "../service/bankService.service";

export class AccountController {
  private bankService: BankService;

  constructor() {
    this.bankService = new BankService();
  }

  public reset = (req: Request, res: Response): void => {
    this.bankService.reset(req, res);
  };

  public getBalance = (req: Request, res: Response): void => {
    this.bankService.getBalance(req, res);
  };

  public handleEvent = (req: Request, res: Response): void => {
    this.bankService.handleEvent(req, res);
  };
}
