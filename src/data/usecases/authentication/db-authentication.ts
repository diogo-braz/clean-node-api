import { LoadAccountByEmailRepository } from "../../../data/protocols/db/account/load-account-by-email-repository";
import { Authentication, AuthenticationModel } from "../../../data/protocols/authentication";
import { HashComparer } from "../../../data/protocols/cryptography/hash-comparer";
import { Encrypter } from "../../protocols/cryptography/encrypter";
import { UpdateAccessTokenRepository } from "../../protocols/db/account/update-access-token-repository";

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email);
    if (account) {
      const isValid = await this.hashComparer.compare(authentication.password, account.password);
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id);
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken);
        return accessToken;
      }
    }
    return null;
  }
}
