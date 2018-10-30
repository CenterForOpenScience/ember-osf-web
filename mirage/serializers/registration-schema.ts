import RegistrationSchema from 'ember-osf-web/models/registration-schema';
import ApplicationSerializer from './application';

export default class RegistrationSchemaSerializer extends ApplicationSerializer<RegistrationSchema> {
    keyForAttribute(attr: string) {
        if (attr === 'schemaNoConflict') {
            return 'schema';
        }
        return super.keyForAttribute(attr);
    }
}
