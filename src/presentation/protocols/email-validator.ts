export interface EmailValidator {
  isValid: (params: EmailValidator.Params) => boolean
}

export namespace EmailValidator {
  export interface Params {
    email: string
  }
}
