import ApplicationSerializer from './application';

export default class RegistrationSchemaSerializer extends ApplicationSerializer {
    keyForAttribute(attr: string) {
        if (attr === 'schemaNoConflict') {
            return 'schema';
        }
        return super.keyForAttribute(attr);
    }
}
