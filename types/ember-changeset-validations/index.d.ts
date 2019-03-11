import { ValidatorFunc } from 'ember-changeset/types';
import { validator } from 'ember-validations';

export type ValidatorFunction = (key: string, result: any) => string | string[] | true;

export function lookupValidator(validator: validatorObject): ValidatorFunc;

// FIXME: Below doesn't actually work, but setting it aside for now to get actual
// functionality implemented. James is upgrading types a bit, and the following
// will make more sense after.

export type ValidationObject<M> = {
    [F in keyof M]?: any;
};
