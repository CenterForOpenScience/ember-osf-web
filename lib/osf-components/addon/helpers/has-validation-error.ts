import { helper } from '@ember/component/helper';
import { ValidatorResult } from 'ember-changeset-validations';

export function hasValidationError([results]: [ValidatorResult[] | undefined]): boolean {
    return results ? results.any(result => result !== true) : false;
}

export default helper(hasValidationError);
