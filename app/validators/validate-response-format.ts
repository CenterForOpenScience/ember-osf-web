import { isEmpty } from '@ember/utils';
import { ValidatorFunction } from 'ember-changeset-validations';
import File from 'ember-osf-web/models/file';
import NodeModel from 'ember-osf-web/models/node';
import getRelatedHref from 'ember-osf-web/utils/get-related-href';

const TargetIdRegex = /^.*\/v2\/nodes\/(.*)\/$/;

export function validateFileList(node: NodeModel): ValidatorFunction {
    return async (_: string, newValue: File[]) => {
        if (newValue) {
            // try {
            //     await Promise.all(newValue.map(file => file.reload()));
            // } catch (error) {
            //     console.log({ error });
            //     debugger;
            // }

            const detachedFiles = [];
            const deletedFiles = [];

            for (const file of newValue) {
                const { name } = file;
                try {
                    await file.reload();
                } catch (error) {
                    deletedFiles.push(name);
                }

                const targetHref = getRelatedHref(file.relationshipLinks.target);
                const groups = TargetIdRegex.exec(targetHref!);
                const targetId = groups && groups[1];

                if (isEmpty(file.id) || isEmpty(file.name)) {
                    return 'Invalid files list';
                } else if (targetId && (targetId !== node.id)) {
                    detachedFiles.push(file.name);
                }
            }

            if (!isEmpty(detachedFiles)) {
                return `The following file(s) "${detachedFiles.join(', ')}" no longer belong to this
                      project/component or any of its registered components`;
            }
        }
        return true;
    };
}
