import Changeset from 'ember-changeset';
import { getSchemaBlockGroup, SchemaBlock, SchemaBlockGroup } from 'ember-osf-web/packages/registration-schema';

type ResponseValue = string | string[] | FileReference[] | null;

interface FileReference {
    id: string;
    name: string;
}

export class PageManager {
    changeSet?: Changeset;
    schemaBlockGroups?: SchemaBlockGroup[];
    pageValidations?: any;
    pageResponses?: Record<string, ResponseValue>;
    pageIsValid?: boolean;
    pageHeadingText?: string;

    constructor(pageSchemaBlocks: SchemaBlock[]) {
        this.schemaBlockGroups = [];
        for (const block of pageSchemaBlocks) {
            if (block.schemaBlockGroupKey) {
                if (!this.schemaBlockGroups.find(group => group.schemaBlockGroupKey === block.schemaBlockGroupKey)) {
                    this.schemaBlockGroups.push(getSchemaBlockGroup(pageSchemaBlocks, block.schemaBlockGroupKey));
                }
            } else {
                this.schemaBlockGroups.push({
                    labelBlock: block,
                });
            }
        }
        this.pageHeadingText = this.schemaBlockGroups[0].labelBlock!.displayText;
        this.pageResponses = {};
        for (const group of this.schemaBlockGroups) {
            if (group.registrationResponseKey) {
                this.pageResponses[group.registrationResponseKey] = null;
            }
        }
        this.changeSet = new Changeset(this.pageResponses);
        this.pageIsValid = false;
    }
}
