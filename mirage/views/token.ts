import { HandlerContext, Schema } from 'ember-cli-mirage';

export function createToken(this: HandlerContext, schema: Schema) {
    const attrs = this.normalizedRequestAttrs();
    const token = schema.tokens.create(attrs);
    token.attrs.tokenId = 'blahblah';
    return token;
}
