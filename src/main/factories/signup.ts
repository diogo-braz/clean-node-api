import { EmailValidatorAdapter } from "@/utils/email-validator-adapter";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import { DbAddAccount } from "@/data/usecases/db-add-account";
import { BcryptAdapter } from "@/infra/cryptography/bcrypt-adapter";
import { AccountMongoRepository } from "@/infra/db/mongodb/account-repository/account";
import { Controller } from "@/presentation/protocols";
import { LogControllerDecorator } from "../decorators/log";

export const makeSignUpController = (): Controller => {
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const encrypter = new BcryptAdapter(12);
  const addAccountRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(encrypter, addAccountRepository);
  const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount);
  return new LogControllerDecorator(signUpController);
};
