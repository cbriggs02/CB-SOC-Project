import { ERRORS } from "../../constants/errors";
import { IParameterValidator } from "../../interfaces/IParameterValidator";

/**
 * Service for validating parameters. This implementation checks that parameters are not 
 * null or undefined, and that they are of the correct type (object). It also checks that individual parameters within the object are not null or undefined.
 */
export class ParameterValidatorService implements IParameterValidator {

    /**
     * Validates the provided parameters. Should throw an error if validation fails.
     * @param params 
     */
    public validate (params: any): boolean {
        if (!params) {
            this.throwError();
        }

        if (typeof params !== "object") {
            this.throwError();
        }

        for (const key in params) {
            if (params[key] === null || params[key] === undefined) {
                this.throwError();
            }
        }
        return true;
    }

    private throwError (): void {
        throw new Error(ERRORS.INTERNAL_ERROR);
    }
}