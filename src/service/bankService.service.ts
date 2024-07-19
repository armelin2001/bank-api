import { Account } from "../entity/account.entity";
import { Request, Response } from "express";

export class BankService {
  private accounts: Map<string, Account>;

  constructor() {
    this.accounts = new Map();
  }

  public reset(req: Request, res: Response): void {
    this.accounts.clear();
    res.sendStatus(200);
  }

  public getBalance(req: Request, res: Response): void {
    const accountId = req.query.account_id as string;
    const account = this.accounts.get(accountId);
    if (account) {
      res.status(200).send(`${account.balance}`);
    } else {
      res.status(404).send("0");
    }
  }

  public handleEvent(req: Request, res: Response): void {
    const { type, destination, origin, amount } = req.body;

    switch (type) {
      case "deposit":
        this.deposit(destination, amount, res);
        break;

      case "withdraw":
        this.withdraw(origin, amount, res);
        break;

      case "transfer":
        this.transfer(origin, destination, amount, res);
        break;

      default:
        res.sendStatus(400);
    }
  }

  private deposit(destination: string, amount: number, res: Response): void {
    if (!this.accounts.has(destination)) {
      this.accounts.set(destination, { id: destination, balance: 0 });
    }
    const account = this.accounts.get(destination);
    if (account) {
      account.balance += amount;
      res.status(201).json({ destination: account });
    }
  }

  private withdraw(origin: string, amount: number, res: Response): void {
    const account = this.accounts.get(origin);
    if (account) {
      account.balance -= amount;
      res.status(201).json({ origin: account });
    } else {
      res.status(404).send("0");
    }
  }

  private transfer(
    origin: string,
    destination: string,
    amount: number,
    res: Response
  ): void {
    const fromAccount = this.accounts.get(origin);
    const toAccount = this.accounts.get(destination);

    if (fromAccount && toAccount) {
      fromAccount.balance -= amount;
      toAccount.balance += amount;
      res.status(201).json({ origin: fromAccount, destination: toAccount });
    } else if (fromAccount) {
      fromAccount.balance -= amount;
      this.accounts.set(destination, { id: destination, balance: amount });
      res.status(201).json({
        origin: fromAccount,
        destination: this.accounts.get(destination),
      });
    } else {
      res.status(404).send("0");
    }
  }
}
