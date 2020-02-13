import ComputedProperty from '@ember/object/computed';

/**
 * This class is used to box primitive types and mark them as raw literals that
 * should be used as is by the translation macro.
 *
 * This class is internal. Instead of using this class directly, use the `raw`
 * utility function, that creates an instance of this class.
 */
declare class Raw<Value> {
    constructor(value: Value);

    valueOf(): Value;

    toString(): string;
}

/**
 * Use this utility function to mark a value as a raw literal.
 *
 * @param {*} value The value to mark as a raw literal.
 * @return The same value, but boxed in the `Raw` class so that the consuming
 *  macro understands that this value should be used as is.
 */
export function raw<Value>(value: Value): Raw<Value>;

interface OptionsFor<Ctx extends object> {
    [key: string]: Raw<any> | keyof Ctx;
}

export default function createTranslatedComputedProperty<Ctx extends object>(
    key: string,
    options?: OptionsFor<Ctx>,
): ComputedProperty<() => string>;
