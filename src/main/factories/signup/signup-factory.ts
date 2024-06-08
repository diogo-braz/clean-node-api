import { BcryptAdapter } from "../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { makeSignUpValidation } from "./signup-validation-factory";
import { DbAddAccount } from "../../../data/usecases/add-account/db-add-account";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-mongo-repository";
import { LogControllerDecorator } from "../../decorators/log-controller-decorator";
import { SignUpController } from "../../../presentation/controllers/signup/signup-controller";
import { Controller } from "../../../presentation/protocols";

export const makeSignUpController = (): Controller => {
  const hasher = new BcryptAdapter(12);
  const addAccountRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(hasher, addAccountRepository);
  const signUpController = new SignUpController(dbAddAccount, makeSignUpValidation());
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
