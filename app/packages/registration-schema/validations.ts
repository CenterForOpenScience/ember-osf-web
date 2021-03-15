import { assert } from '@ember/debug';
import { set } from '@ember/object';
import { ValidationObject, ValidatorFunction } from 'ember-changeset-validations';
import { validatePresence } from 'ember-changeset-validations/validators';
import DraftNode from 'ember-osf-web/models/draft-node';

import DraftRegistration, { DraftMetadataProperties } from 'ember-osf-web/models/draft-registration';
import NodeModel, { NodeLicense } from 'ember-osf-web/models/node';
import { RegistrationResponse } from 'ember-osf-web/packages/registration-schema';
import { SchemaBlockGroup } from 'ember-osf-web/packages/registration-schema/schema-block-group';
import { validateFileList } from 'ember-osf-web/validators/validate-response-format';

export const NodeLicenseFields: Record<keyof NodeLicense, string> = {
    copyrightHolders: 'Copyright Holders',
    year: 'Year',
};

function getErrorType(groupType?: string) {
    let validationErrorType = 'blank';
    switch (groupType) {
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

export function buildValidation(groups: SchemaBlockGroup[], node?: NodeModel | DraftNode) {
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
            // TODO: remove check for contributors-input
            if (inputBlock.required && inputBlock.blockType !== 'contributors-input') {
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

export function validateNodeLicense() {
    return async (_: unknown, __: unknown, ___: unknown, changes: DraftRegistration, content: DraftRegistration) => {
        let validateLicenseTarget = await content.license;
        let validateNodeLicenseTarget = content.nodeLicense;
        if (changes.license) {
            validateLicenseTarget = changes.license;
        }
        if (changes.nodeLicense) {
            validateNodeLicenseTarget = changes.nodeLicense;
        }
        if (!validateLicenseTarget || validateLicenseTarget.get('requiredFields').length === 0) {
            return true;
        }
        const missingFieldsList: Array<keyof NodeLicense> = [];
        for (const item of validateLicenseTarget.get('requiredFields')) {
            if (!validateNodeLicenseTarget || !validateNodeLicenseTarget[item]) {
                missingFieldsList.push(item);
            }
        }
        if (missingFieldsList.length === 0) {
            return true;
        }
        const missingFields = missingFieldsList.map(field => NodeLicenseFields[field]).join(', ');
        return {
            context: {
                type: 'node_license_missing_fields',
                translationArgs: {
                    missingFields,
                    numOfFields: missingFieldsList.length,
                },
            },
        };
    };
}

export function validateNodeLicenseYear() {
    return (_: unknown, __: unknown, ___: unknown, changes: any, content: DraftRegistration) => {
        let validateYearTarget: string = '';
        if (content.nodeLicense && content.nodeLicense.year) {
            validateYearTarget = content.nodeLicense.year;
        }
        if (changes.nodeLicense && changes.nodeLicense.year) {
            validateYearTarget = changes.nodeLicense.year;
        }
        const regex = /^((?!(0))[0-9]{4})$/;
        if (validateYearTarget && !validateYearTarget.match(regex)) {
            return {
                context: {
                    type: 'year_format',
                },
            };
        }
        return true;
    };
}

export function validateSubjects() {
    return (_: unknown, __: unknown, ___: unknown, ____: unknown, content: DraftRegistration) => {
        const subjects = content.hasMany('subjects').value();
        if (!subjects || subjects.length === 0) {
            return {
                context: {
                    type: 'min_subjects',
                },
            };
        }
        return true;
    };
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
    set(validationObj, DraftMetadataProperties.Subjects, validateSubjects());
    set(validationObj, DraftMetadataProperties.NodeLicenseProperty, [validateNodeLicense(), validateNodeLicenseYear()]);
    return validationObj;
}
