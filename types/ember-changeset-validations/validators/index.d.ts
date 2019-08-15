declare module 'ember-changeset-validations/validators' {
    import { ValidatorFunction } from 'ember-changeset-validations';
    import { ConfirmationOptions } from 'ember-validators/validators/confirmation';
    import { ExclusionOptions } from 'ember-validators/validators/exclusion';
    import { InclusionOptions } from 'ember-validators/validators/inclusion';
    import { LengthOptions } from 'ember-validators/validators/length';
    import { NumberOptions } from 'ember-validators/validators/number';
    import { PresenceOptions } from 'ember-validators/validators/presence';

    export function validatePresence(options: PresenceOptions | boolean): ValidatorFunction;
    export function validateLength(options: LengthOptions): ValidatorFunction;
    export function validateNumber(options: NumberOptions): ValidatorFunction;
    export function validateInclusion(options: InclusionOptions): ValidatorFunction;
    export function validateExclusion(options: ExclusionOptions): ValidatorFunction;
    export function validateFormat(options: FormatOptions): ValidatorFunction;
    export function validateConfirmation(options: ConfirmationOptions): ValidatorFunction;
}
