import { HandlerContext, ModelInstance, Schema } from 'ember-cli-mirage';
import Registration from 'ember-osf-web/models/registration';

export function forkRegistration(this: HandlerContext, schema: Schema) {
    const attrs = this.normalizedRequestAttrs();
    const forkedFrom = schema.registrations.find(attrs.id) as ModelInstance<Registration>;
    const registrationSchema = schema.registrationSchemas.find('prereg_challenge');
    const newFork = schema.registrations.create({
        forkedDate: new Date(),
        fork: true,
        forkedFrom,
        registrationSchema,
        title: `fork of ${forkedFrom.title}`,
    });
    return newFork;
}
