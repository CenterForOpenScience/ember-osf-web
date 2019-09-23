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
import { PageResponse } from 'ember-osf-web/packages/registration-schema/page-response';

export class PageManager {
    changeset?: ChangesetDef;
    schemaBlockGroups?: SchemaBlockGroup[];
    pageResponses?: Record<string, ResponseValue>;
    pageHeadingText?: string;

    constructor(pageSchemaBlocks: SchemaBlock[], registrationResponses: PageResponse) {
        this.schemaBlockGroups = getSchemaBlockGroups(pageSchemaBlocks);
        this.pageHeadingText = this.schemaBlockGroups[0].labelBlock!.displayText;
        this.pageResponses = {};
        for (const group of this.schemaBlockGroups) {
            if (group.registrationResponseKey) {
                this.pageResponses[group.registrationResponseKey]
                    = registrationResponses[group.registrationResponseKey];
            }
        }
        const validations = buildValidation(this.schemaBlockGroups);
        this.changeset = new Changeset(this.pageResponses, lookupValidator(validations), validations) as ChangesetDef;
    }

    pageIsValid() {
        if (this.changeset) {
            this.changeset.validate();
            return this.changeset.isValid;
        }
        return false;
    }
}
