import { isEmpty } from '@ember/utils';
import { ValidatorFunction } from 'ember-changeset-validations';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import DraftNode from 'ember-osf-web/models/draft-node';
import File from 'ember-osf-web/models/file';
import NodeModel from 'ember-osf-web/models/node';

export function validateFileList(responseKey: string, node?: NodeModel | DraftNode): ValidatorFunction {
    return async (_: string, newValue: File[]) => {
        if (newValue && node) {
            for (const file of newValue) {
                if (file && !file.isError) {
                    // eslint-disable-next-line no-await-in-loop
                    await file.reload();
                }
            }

            const detachedFiles = [];

            for (const file of newValue) {
                if (file.isError || file.belongsTo('target').id() !== node.id) {
                    detachedFiles.push(file.name);
                }
            }

            if (!isEmpty(detachedFiles)) {
                const missingFilesList = detachedFiles.join(', ');
                const numOfFiles = detachedFiles.length;
                let type = 'onlyProjectOrComponentFiles';
                let translationArgs = { missingFilesList, numOfFiles };
                if (node.modelName === 'node' && 'isRoot' in node) {
                    const projectOrComponent = node.isRoot ? 'project' : 'component';
                    translationArgs = { ...translationArgs, ...{ projectOrComponent } };
                } else {
                    type = 'missingFileNoProject';
                }

                return buildMessage(responseKey, {
                    type: 'presence',
                    context: {
                        type,
                        translationArgs,
                    },
                });
            }
        }
        return true;
    };
}
