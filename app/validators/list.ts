import { ValidatorFunction, ValidatorResult } from 'ember-changeset-validations';

export type ListValidatorFunction = (
    key: string,
    newValue: undefined | unknown,
    oldValue: undefined | unknown,
    changes: Record<string, unknown>,
    content: Record<string, unknown>,
) => true | ValidatorResult[];

/**
 * Validate each item in a list using the given validator.
 */
export default function validateList(validator: ValidatorFunction): ListValidatorFunction {
    return (key, newValue, oldValue, changes, content) => {
        if ((typeof newValue !== 'undefined' && !Array.isArray(newValue))
            || (typeof oldValue !== 'undefined' && !Array.isArray(oldValue))) {
            throw new Error('validateList can only be used for array properties');
        }
        if (typeof newValue === 'undefined' || newValue.length === 0) {
            // This validator validates list elements.
            // If there is no list, there's nothing to validate!
            return true;
        }
        const results = newValue.map((newItem, index) => validator(
            key,
            newItem,
            oldValue ? oldValue[index] : undefined,
            changes,
            content,
        ));
        return results.every(result => result === true) ? true : results;
    };
}

/**
 * Transpose a ValidatorResult table so that items are the first dimension and
 * validator results for each item are the second dimension, excluding validator
 * results that are not arrays (and thus aren't for individual list items).
 */
export function transposeResults(results?: Array<ValidatorResult | ValidatorResult[]>) {
    const transposer = (acc: ValidatorResult[][], validatorResults: ValidatorResult[]) => validatorResults.map(
        (val, index) => [...(acc[index] || []), val],
    );
    return results ? results.filter(Array.isArray).reduce(transposer, []) : undefined;
}
