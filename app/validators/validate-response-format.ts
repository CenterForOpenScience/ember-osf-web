import { isEmpty } from '@ember/utils';
import { ValidatorFunction } from 'ember-changeset-validations';
import File from 'ember-osf-web/models/file';
import NodeModel from 'ember-osf-web/models/node';
import { allSettled } from 'rsvp';

export function validateFileList(node?: NodeModel): ValidatorFunction {
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
                return `The file(s) "${detachedFiles.join(', ')}" cannot be found on this ${projectOrComponent}.`;
            }
        }
        return true;
    };
}
