import { isEmpty } from '@ember/utils';
import ContributorModel from 'ember-osf-web/models/contributor';

const isContributorModel = (input: any) => {
    if (input instanceof ContributorModel) {
        return true;
    }
    return false;
};

export function validateResponseFormat(opts: {format: string}) {
    return (value: any) => {
        if (opts.format) {
            switch (opts.format) {
            case 'file':
                if (!isEmpty(value.id) && !isEmpty(value.name)) {
                    return true;
                }
                return 'Not a valid file';
            case 'contributor':
                if (isContributorModel(value) && !isEmpty(value.id)) {
                    return true;
                }
                return 'Not a valid contributor';
            default:
                return 'Invalid format';
            }
        } else {
            return 'Need a format';
        }
    };
}
