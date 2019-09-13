import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import { ChangesetDef } from 'ember-changeset/types';
import {
    buildValidation,
    getSchemaBlockGroups,
    ResponseValue,
    SchemaBlock,
    SchemaBlockGroup,
} from 'ember-osf-web/packages/registration-schema';

export class PageManager {
    changeSet?: ChangesetDef;
    schemaBlockGroups?: SchemaBlockGroup[];
    pageValidations?: any;
    pageResponses?: Record<string, ResponseValue>;
    pageHeadingText?: string;

    constructor(pageSchemaBlocks: SchemaBlock[]) {
        this.schemaBlockGroups = getSchemaBlockGroups(pageSchemaBlocks);
        this.pageHeadingText = this.schemaBlockGroups[0].labelBlock!.displayText;
        this.pageResponses = {};
        for (const group of this.schemaBlockGroups) {
            if (group.registrationResponseKey) {
                this.pageResponses[group.registrationResponseKey] = null;
            }
        }
        const validations = buildValidation(this.schemaBlockGroups);
        this.changeSet = new Changeset(this.pageResponses, lookupValidator(validations), validations) as ChangesetDef;
    }

    pageIsValid() {
        if (this.changeSet) {
            this.changeSet.validate();
            return this.changeSet.isValid;
        }
        return false;
    }
}
