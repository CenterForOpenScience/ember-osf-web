import { isEmpty } from '@ember/utils';
import { ValidatorFunction } from 'ember-changeset-validations';
import File from 'ember-osf-web/models/file';
import NodeModel from 'ember-osf-web/models/node';
import { allSettled } from 'rsvp';

export function validateFileList(node: NodeModel): ValidatorFunction {
    return async (_: string, newValue: File[]) => {
        if (newValue) {
            await allSettled(newValue.map(file => file.reload()));
            const detachedFiles = [];
            for (const file of newValue) {
                if (file.isError || file.target.get('id') !== node.id) {
                    detachedFiles.push(file.name);
                }
            }
            if (!isEmpty(detachedFiles)) {
                return `
                    The following file(s) "${detachedFiles.join(', ')}"
                    no longer belong to this project / component or any of its registered components
                `;
            }
            return true;
        }
        return true;
    };
}
