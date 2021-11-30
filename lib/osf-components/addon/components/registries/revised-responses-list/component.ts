import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { getSchemaBlockGroups, SchemaBlockGroup } from 'ember-osf-web/packages/registration-schema';
import SchemaResponseModel from 'ember-osf-web/models/schema-response';
import SchemaBlockModel from 'ember-osf-web/models/schema-block';

interface Args {
    revision: SchemaResponseModel;
    schemaBlocks: SchemaBlockModel[];
}

export default class RevisedResponsesList extends Component<Args> {
    @tracked groups?: SchemaBlockGroup[];

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        this.groups = getSchemaBlockGroups(this.args.schemaBlocks);
    }

    get updatedResponseLabels(): string[] {
        const { revision } = this.args;
        if (revision.updatedResponseKeys) {
            const allRevisedLabels = revision.updatedResponseKeys
                .reduce((labels: string[], revisedResponse: string) => {
                    const revisedGroup = this.groups?.filter(
                        (group: SchemaBlockGroup) => group.registrationResponseKey?.includes(revisedResponse),
                    );
                    if (revisedResponse) {
                        labels.push(revisedGroup![0].labelBlock!.displayText!);
                    }
                    return labels;
                }, []);
            return allRevisedLabels;
        }
        return [];
    }
}
