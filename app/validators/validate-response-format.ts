import ContributorModel from 'ember-osf-web/models/contributor';

function isEmptyString(checkString: string) {
    if (checkString === undefined || checkString === null || checkString === '') {
        return true;
    }
    return false;
}

// tslint:disable-next-line: variable-name
const isContributorModel = (_input: any): _input is ContributorModel => true;

export function validateResponseFormat(opts: {format: string}) {
    return (value: any) => {
        if (opts.format) {
            switch (opts.format) {
            case 'file':
                if (!isEmptyString(value.id) && !isEmptyString(value.name)) {
                    return true;
                }
                return 'Not a valid file';
            case 'contributor':
                if (isContributorModel && !isEmptyString(value.id)) {
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
