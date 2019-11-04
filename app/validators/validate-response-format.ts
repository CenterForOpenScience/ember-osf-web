import { isEmpty } from '@ember/utils';
import { FileReference } from 'ember-osf-web/packages/registration-schema';

export function validateFileReference() {
    return (_: string, newValue: FileReference[]) => {
        if (newValue) {
            for (const file of newValue) {
                if (!isEmpty(file.file_id) && !isEmpty(file.file_name)) {
                    return true;
                }
            }
            return 'Invalid files list';
        }
        return true;
    };
}
