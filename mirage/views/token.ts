import { faker, HandlerContext, Schema } from 'ember-cli-mirage';

export function createToken(this: HandlerContext, schema: Schema) {
    const attrs = this.normalizedRequestAttrs('token');
    const token = schema.tokens.create(attrs);
    token.attrs.tokenId = faker.random.uuid();
    return token;
}
