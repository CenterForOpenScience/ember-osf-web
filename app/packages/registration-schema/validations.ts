import { assert } from '@ember/debug';
import { ValidationObject, ValidatorFunction } from 'ember-changeset-validations';
import { validateLength, validatePresence } from 'ember-changeset-validations/validators';
import translations from 'ember-osf-web/locales/en/translations';
import { PageResponse } from 'ember-osf-web/packages/registration-schema';
import { SchemaBlockGroup } from 'ember-osf-web/packages/registration-schema/schema-block-group';
import { validateResponseFormat } from 'ember-osf-web/validators/validate-response-format';

export function buildValidation(groups: SchemaBlockGroup[]) {
    const ret: ValidationObject<PageResponse> = {};
    groups.forEach((group: SchemaBlockGroup) => {
        // only validating groups with actual inputs and not groups that are headings/labels only
        if (group.inputBlock) {
            let validationForResponse: ValidatorFunction[] = [];
            const responseKey = group.registrationResponseKey;
            assert(`no response key for group ${group.schemaBlockGroupKey}`, Boolean(responseKey));
            const { inputBlock } = group;
            switch (group.groupType) {
            case 'short-text-input':
            case 'long-text-input':
                if (inputBlock.required) {
                    validationForResponse = [
                        validatePresence({
                            presence: true,
                            ignoreBlank: true,
                            allowBlank: false,
                            allowNone: false,
                            message: translations.validationErrors.blank,
                        }),
                    ];
                } else {
                    validationForResponse = [
                        validatePresence({ ignoreBlank: true }),
                        validateLength({
                            allowBlank: true,
                            allowNone: true,
                        }),
                    ];
                }
                break;
            case 'contributors-input':
                if (inputBlock.required) {
                    validationForResponse = [
                        validatePresence({
                            presence: true,
                            allowBlank: false,
                            message: translations.validationErrors.empty,
                        }),
                    ];
                }
                validationForResponse = [
                    ...(validationForResponse || []),
                    validateResponseFormat({ format: 'contributor' }),
                ];
                break;
            case 'file-input':
                if (inputBlock.required) {
                    validationForResponse = [
                        validatePresence({
                            presence: true,
                            message: translations.validationErrors.empty,
                        }),
                    ];
                }
                validationForResponse = [
                    ...(validationForResponse || []),
                    validateResponseFormat({ format: 'file' }),
                ];
                break;
            case 'single-select-input':
            case 'multi-select-input':
                if (inputBlock.required) {
                    validationForResponse = [
                        validateLength({
                            min: 1,
                            allowBlank: false,
                        }),
                        validatePresence({
                            presence: true,
                            message: translations.validationErrors.empty,
                        }),
                    ];
                } else {
                    validationForResponse = [
                        validateLength({ allowBlank: true }),
                    ];
                }
                break;
            default:
                break;
            }
            ret[responseKey!] = {};
            ret[responseKey!].response = validationForResponse;
        }
    });
    return ret;
}
