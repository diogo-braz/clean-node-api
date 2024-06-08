import { AccountEntity } from "../../../domain/entities/account";

export  interface LoadAccountByEmailRepository {
  loadByEmail (email: string): Promise<AccountEntity | null>
}
