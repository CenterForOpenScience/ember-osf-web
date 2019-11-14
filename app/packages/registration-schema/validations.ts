import { assert } from '@ember/debug';
import { ValidationObject, ValidatorFunction } from 'ember-changeset-validations';
import { validatePresence } from 'ember-changeset-validations/validators';
import translations from 'ember-osf-web/locales/en/translations';
import { RegistrationResponse } from 'ember-osf-web/packages/registration-schema';
import { SchemaBlockGroup } from 'ember-osf-web/packages/registration-schema/schema-block-group';
import { validateFileReferenceList } from 'ember-osf-web/validators/validate-response-format';

// TODO: find a way to use i18n to translate error messages

export function buildValidation(groups: SchemaBlockGroup[]) {
    const ret: ValidationObject<RegistrationResponse> = {};
    groups.forEach((group: SchemaBlockGroup) => {
        // only validating groups with actual inputs and not groups that are headings/labels only
        if (group.inputBlock) {
            const validationForResponse: ValidatorFunction[] = [];
            const responseKey = group.registrationResponseKey;
            assert(`no response key for group ${group.schemaBlockGroupKey}`, Boolean(responseKey));
            const { inputBlock } = group;
            let requiredMessage = translations.validationErrors.blank;
            switch (group.groupType) {
            case 'short-text-input':
                break;
            case 'long-text-input':
                break;
            case 'file-input':
                requiredMessage = translations.validationErrors.mustSelectFileMinOne;
                validationForResponse.push(
                    validateFileReferenceList(),
                );
                break;
            case 'single-select-input':
                requiredMessage = translations.validationErrors.mustSelect;
                break;
            case 'multi-select-input':
                requiredMessage = translations.validationErrors.mustSelectMinOne;
                break;
            default:
                break;
            }
            if (inputBlock.required) {
                validationForResponse.push(
                    validatePresence({
                        presence: true,
                        ignoreBlank: true,
                        allowBlank: false,
                        allowNone: false,
                        message: requiredMessage,
                    }),
                );
            }
            ret[responseKey!] = validationForResponse;
        }
    });
    return ret;
}
