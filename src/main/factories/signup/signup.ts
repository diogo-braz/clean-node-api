import { BcryptAdapter } from "../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { makeSignUpValidation } from "./signup-validation";
import { DbAddAccount } from "../../../data/usecases/add-account/db-add-account";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account-repository/account";
import { LogMongoRepository } from "../../../infra/db/mongodb/log-repository/log";
import { LogControllerDecorator } from "../../../main/decorators/log";
import { SignUpController } from "../../../presentation/controllers/signup/signup";
import { Controller } from "../../../presentation/protocols";

export const makeSignUpController = (): Controller => {
  const hasher = new BcryptAdapter(12);
  const addAccountRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(hasher, addAccountRepository);
  const signUpController = new SignUpController(dbAddAccount, makeSignUpValidation());
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
