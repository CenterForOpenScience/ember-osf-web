import { isEmpty } from '@ember/utils';
import { ValidatorFunction } from 'ember-changeset-validations';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import File from 'ember-osf-web/models/file';
import NodeModel from 'ember-osf-web/models/node';
import { allSettled } from 'rsvp';

export function validateFileList(responseKey: string, node?: NodeModel): ValidatorFunction {
    return async (_: string, newValue: File[]) => {
        if (newValue && node) {
            await allSettled(newValue.map(file => file.reload()));

            const detachedFiles = [];

            for (const file of newValue) {
                if (file.isError || file.belongsTo('target').id() !== node.id) {
                    detachedFiles.push(file.name);
                }
            }
            const projectOrComponent = node.isRoot ? 'project' : 'component';

            if (!isEmpty(detachedFiles)) {
                const missingFilesList = detachedFiles.join(', ');
                const numOfFiles = detachedFiles.length;

                return buildMessage(responseKey, {
                    type: 'presence',
                    context: {
                        type: 'onlyProjectOrComponentFiles',
                        translationArgs: { projectOrComponent, missingFilesList, numOfFiles },
                    },
                });
            }
        }
        return true;
    };
}
