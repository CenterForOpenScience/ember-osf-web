import { ValidatorAction, ValidatorMap } from 'ember-changeset/types';
import { validator } from 'ember-validations';

export type ValidatorResult = string | string[] | true | Promise<unknown>;

export type ValidatorFunction = (
    key: string,
    newValue: unknown,
    oldValue: unknown,
    changes: Record<string, unknown>,
    content: Record<string, unknown>,
) => ValidatorResult;

export default function lookupValidator(validator: ValidatorMap): ValidatorAction;

// FIXME: Below doesn't actually work, but setting it aside for now to get actual
// functionality implemented. James is upgrading types a bit, and the following
// will make more sense after.

export type ValidationObject<M> = {
    [F in keyof M]?: any;
};
