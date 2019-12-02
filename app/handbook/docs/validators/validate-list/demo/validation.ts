import { ValidationObject } from 'ember-changeset-validations';
import { validatePresence } from 'ember-changeset-validations/validators';

import validateList from 'ember-osf-web/validators/list';

import { DemoObject } from './component';

// BEGIN-SNIPPET validate-list.validation
export const validation: ValidationObject<DemoObject> = {
    list: [
        validateList(
            validatePresence({
                presence: true,
                message: 'Items in {description} cannot be blank',
            }),
        ),
    ],
};
// END-SNIPPET
