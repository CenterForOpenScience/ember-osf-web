import { assert } from '@ember/debug';
import { set } from '@ember/object';
import { ValidationObject, ValidatorFunction } from 'ember-changeset-validations';
import { validatePresence } from 'ember-changeset-validations/validators';

import DraftRegistration, { DraftMetadataProperties } from 'ember-osf-web/models/draft-registration';
import NodeModel from 'ember-osf-web/models/node';
import { RegistrationResponse } from 'ember-osf-web/packages/registration-schema';
import { SchemaBlockGroup } from 'ember-osf-web/packages/registration-schema/schema-block-group';
import { validateFileList } from 'ember-osf-web/validators/validate-response-format';

function getErrorType(groupType?: string) {
    let validationErrorType = 'blank';
    switch (groupType) {
    case 'contributors-input':
        // No validation for contributors input.
        break;
    case 'short-text-input':
        break;
    case 'long-text-input':
        break;
    case 'file-input':
        validationErrorType = 'mustSelectFileMinOne';
        break;
    case 'single-select-input':
        validationErrorType = 'mustSelect';
        break;
    case 'multi-select-input':
        validationErrorType = 'mustSelectMinOne';
        break;
    default:
        break;
    }
    return validationErrorType;
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
                    validateFileList(responseKey as string, node),
                );
            }
            if (inputBlock.required) {
                validationForResponse.push(
                    validatePresence({
                        presence: true,
                        ignoreBlank: true,
                        allowBlank: false,
                        allowNone: false,
                        type: getErrorType(group.groupType),
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
        type: 'blank',
    })];
    set(validationObj, DraftMetadataProperties.Title, notBlank);
    set(validationObj, DraftMetadataProperties.Description, notBlank);
    set(validationObj, DraftMetadataProperties.License, notBlank);
    return validationObj;
}
