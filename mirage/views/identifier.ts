import { HandlerContext, Schema } from 'ember-cli-mirage';
import faker from 'faker';

export function identifierCreate(this: HandlerContext, schema: Schema) {
    return schema.identifiers.create({
        ...this.normalizedRequestAttrs('identifier'),
        value: faker.fake('10.5555/{{company.bsNoun}}'),
    });
}
