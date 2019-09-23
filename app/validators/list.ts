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
        if (typeof newValue === 'undefined') {
            // This validator validates list elements.
            // If there is no list, there's nothing to validate!
            return true;
        }
        if (!Array.isArray(newValue) || (typeof oldValue !== 'undefined' && !Array.isArray(oldValue))) {
            throw new Error('validateList can only be used for array properties');
        }
        const results: ValidatorResult[] = [];
        newValue.forEach((newItem, index) => {
            const result = validator(
                key,
                newItem,
                oldValue ? oldValue[index] : undefined,
                changes,
                content,
            );
            results.push(result);
        });
        return results.every(itemResult => itemResult === true) ? true : results;
    };
}

export function pivotErrors(errors?: Array<ValidatorResult | ValidatorResult[]>) {
    const result: ValidatorResult[][] = [];
    if (errors) {
        // pivot errors table so that items are first dimension
        // and errors for each item are second dimension
        errors.forEach(error => {
            if (Array.isArray(error)) {
                error.forEach((itemError, index) => {
                    if (result[index]) {
                        result[index].push(itemError);
                    } else {
                        result[index] = [itemError];
                    }
                });
            }
        });
    }
    return result;
}
