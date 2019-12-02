import { ValidationObject } from 'ember-changeset-validations';
import { validatePresence } from 'ember-changeset-validations/validators';
import NodeModel from 'ember-osf-web/models/node';

export const nodeValidation: ValidationObject<NodeModel> = {
    title: [
        validatePresence(true),
    ],
    description: [
        validatePresence(true),
    ],
};
