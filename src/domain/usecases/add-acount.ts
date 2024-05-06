import { AccountEntity } from "../entities/account";

export interface AddAccount {
  add: (account: AddAccount.Params) => AddAccount.Result;
}

export namespace AddAccount {
  export interface Params {
    name: string,
    email: string,
    password: string,
  }

  export type Result = AccountEntity;
}
