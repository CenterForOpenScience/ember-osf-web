import { ValidationObject } from 'ember-changeset-validations';

declare module '*/validations' {
    export const UserSettingValidation: ValidationObject<UserSettingModel>;
}
