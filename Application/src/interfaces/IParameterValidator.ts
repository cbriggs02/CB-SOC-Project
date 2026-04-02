/**
 * Interface for validating parameters. Implementations should provide logic to check the 
 * validity of parameters and throw errors if validation fails.
 */
export interface IParameterValidator {
    /**
     * Validates the provided parameters. Should throw an error if validation fails.
     * @param params The parameters to validate
     */
    validate (params: any): boolean;
}