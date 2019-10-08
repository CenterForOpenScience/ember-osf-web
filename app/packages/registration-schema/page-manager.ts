import EmberObject from '@ember/object';
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

export class PageManager extends EmberObject {
    changeset: ChangesetDef;
    schemaBlockGroups: SchemaBlockGroup[];
    pageResponses: Record<string, ResponseValue>;
    pageHeadingText: string;
    isVisited: boolean;

    constructor(pageSchemaBlocks: SchemaBlock[], registrationResponses: PageResponse) {
        super();
        this.schemaBlockGroups = getSchemaBlockGroups(pageSchemaBlocks);
        this.pageHeadingText = this.schemaBlockGroups[0].labelBlock!.displayText!;
        this.pageResponses = {};
        this.isVisited = false;
        for (const group of this.schemaBlockGroups) {
            const groupKey = group.registrationResponseKey;
            if (groupKey && groupKey in registrationResponses) {
                this.pageResponses[groupKey]
                    = registrationResponses[groupKey];
                this.isVisited = true;
            }
        }
        const validations = buildValidation(this.schemaBlockGroups);
        this.changeset = new Changeset(this.pageResponses, lookupValidator(validations), validations) as ChangesetDef;
    }

    pageIsValid() {
        if (this.changeset) {
            return this.changeset.isValid;
        }
        return false;
    }

    pageIsVisited() {
        return this.isVisited;
    }

    validatePage() {
        if (this.changeset) {
            this.changeset.validate();
        }
    }
}
