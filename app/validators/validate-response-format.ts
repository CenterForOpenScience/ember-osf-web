import { isEmpty } from '@ember/utils';
import { ValidatorFunction } from 'ember-changeset-validations';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import DraftNode from 'ember-osf-web/models/draft-node';
import File from 'ember-osf-web/models/file';
import NodeModel from 'ember-osf-web/models/node';
import { allSettled } from 'rsvp';

export function validateFileList(responseKey: string, node?: NodeModel | DraftNode): ValidatorFunction {
    return async (_: string, newValue: File[]) => {
        if (newValue && node) {
            const fileReloads: Array<() => Promise<File>> = [];
            newValue.forEach(file => {
                if (file && !file.isError) {
                    fileReloads.push(file.reload());
                }
            });
            await allSettled(fileReloads);

            const detachedFiles = [];

            for (const file of newValue) {
                if (file.isError || file.belongsTo('target').id() !== node.id) {
                    detachedFiles.push(file.name);
                }
            }
            // TODO: update the returned translation string for no-project
            const projectOrComponent = 'isRoot' in node && node.isRoot ? 'project' : 'component';

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
