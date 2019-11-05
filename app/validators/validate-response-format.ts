import { isEmpty } from '@ember/utils';
import { ValidatorFunction } from 'ember-changeset-validations';
import { FileReference } from 'ember-osf-web/packages/registration-schema';

export function validateFileReferenceList(): ValidatorFunction {
    return (_: string, newValue: FileReference[]) => {
        if (newValue) {
            if (newValue.some(file => isEmpty(file.file_id) || isEmpty(file.file_name))) {
                return 'Invalid files list';
            }
        }
        return true;
    };
}
