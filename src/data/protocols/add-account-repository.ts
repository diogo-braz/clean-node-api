import { AccountEntity } from "@/domain/entities/account";

export interface AddAccountRepository {
  add: (account: AddAccountRepository.Params) => Promise<AddAccountRepository.Result>
}

export namespace AddAccountRepository {
  export interface Params {
    name: string,
    email: string,
    password: string,
  }

  export type Result = AccountEntity | null;
}
