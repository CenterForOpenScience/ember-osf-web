import { assert } from '@ember/debug';
import { set } from '@ember/object';
import { ValidationObject, ValidatorFunction } from 'ember-changeset-validations';
import { validatePresence } from 'ember-changeset-validations/validators';

import translations from 'ember-osf-web/locales/en/translations';
import DraftRegistration, { DraftMetadataProperties } from 'ember-osf-web/models/draft-registration';
import NodeModel from 'ember-osf-web/models/node';
import { RegistrationResponse } from 'ember-osf-web/packages/registration-schema';
import { SchemaBlockGroup } from 'ember-osf-web/packages/registration-schema/schema-block-group';
import { validateFileList } from 'ember-osf-web/validators/validate-response-format';

// TODO: find a way to use i18n to translate error messages

function getRequiredMessage(groupType?: string) {
    let requiredMessage = translations.validationErrors.blank;
    switch (groupType) {
    case 'contributors-input':
        // No validation for contributors input.
        break;
    case 'short-text-input':
        break;
    case 'long-text-input':
        break;
    case 'file-input':
        requiredMessage = translations.validationErrors.mustSelectFileMinOne;
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
    return requiredMessage;
}

export function buildValidation(groups: SchemaBlockGroup[], node?: NodeModel) {
    const ret: ValidationObject<RegistrationResponse> = {};
    groups.forEach((group: SchemaBlockGroup) => {
        // only validating groups with actual inputs and not groups that are headings/labels only
        if (group.inputBlock) {
            const validationForResponse: ValidatorFunction[] = [];
            const responseKey = group.registrationResponseKey;
            assert(`no response key for group ${group.schemaBlockGroupKey}`, Boolean(responseKey));
            const { inputBlock } = group;
            if (group.groupType === 'file-input') {
                validationForResponse.push(
                    validateFileList(node),
                );
            }
            if (inputBlock.required) {
                validationForResponse.push(
                    validatePresence({
                        presence: true,
                        ignoreBlank: true,
                        allowBlank: false,
                        allowNone: false,
                        message: getRequiredMessage(group.groupType),
                    }),
                );
            }
            ret[responseKey!] = validationForResponse;
        }
    });
    return ret;
}

export function buildMetadataValidations() {
    const validationObj: ValidationObject<DraftRegistration> = {};
    const notBlank: ValidatorFunction[] = [validatePresence({
        presence: true,
        ignoreBlank: true,
        allowBlank: false,
        allowNone: false,
        message: translations.validationErrors.blank,
    })];
    set(validationObj, DraftMetadataProperties.Title, notBlank);
    set(validationObj, DraftMetadataProperties.Description, notBlank);
    set(validationObj, DraftMetadataProperties.License, notBlank);
    return validationObj;
}
