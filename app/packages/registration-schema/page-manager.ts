import { assert } from '@ember/debug';
import { computed, set } from '@ember/object';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import { ChangesetDef } from 'ember-changeset/types';
import NodeModel from 'ember-osf-web/models/node';
import {
    buildValidation,
    getSchemaBlockGroups,
    SchemaBlock,
    SchemaBlockGroup,
} from 'ember-osf-web/packages/registration-schema';
import { RegistrationResponse } from 'ember-osf-web/packages/registration-schema/registration-response';

export class PageManager {
    changeset?: ChangesetDef;
    schemaBlockGroups?: SchemaBlockGroup[];
    pageHeadingText?: string;
    isVisited?: boolean;

    constructor(pageSchemaBlocks: SchemaBlock[], registrationResponses: RegistrationResponse, node?: NodeModel) {
        this.schemaBlockGroups = getSchemaBlockGroups(pageSchemaBlocks);
        if (this.schemaBlockGroups) {
            this.pageHeadingText = this.schemaBlockGroups[0].labelBlock!.displayText!;
            this.isVisited = false;

            this.isVisited = this.schemaBlockGroups.some(
                ({ registrationResponseKey: key }) => Boolean(key && (key in registrationResponses)),
            );

            const validations = buildValidation(this.schemaBlockGroups, node);
            this.changeset = new Changeset(
                registrationResponses,
                lookupValidator(validations),
                validations,
            ) as ChangesetDef;
        } else {
            assert('PageManager: schemaBlockGroups is not defined.');
        }
    }

    @computed('changeset.isValid')
    get pageIsValid() {
        if (this.changeset) {
            return this.changeset.get('isValid');
        }
        return false;
    }

    @computed('changeset.isInvalid')
    get pageIsInvalid() {
        if (this.changeset) {
            return this.changeset.get('isInvalid');
        }
        return false;
    }

    setPageIsVisited() {
        set(this, 'isVisited', true);
    }

    getPageIsVisited() {
        return this.isVisited;
    }

    validatePage() {
        if (this.changeset) {
            this.changeset.validate();
        }
    }
}
