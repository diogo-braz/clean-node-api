import { AddAccount } from "../../../../domain/usecases/add-account";

export interface AddAccountRepository {
  add: (account: AddAccountRepository.Params) => Promise<AddAccountRepository.Result>
}

export namespace AddAccountRepository {
  export type Params = AddAccount.Params;
  export type Result = AddAccount.Result;
}
