import { AccountEntity } from "../../domain/entities/account";

export  interface LoadAccountByEmailRepository {
  load (email: string): Promise<AccountEntity>
}
