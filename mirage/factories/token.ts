import { Factory, faker } from 'ember-cli-mirage';

import Token from 'ember-osf-web/models/token';

interface TokenAttrs extends Token {
    scopeIds: string[];
}

export default Factory.extend<TokenAttrs>({
    id(i: number) {
        return i.toString().padStart(5, '0');
    },

    name() {
        return faker.lorem.words(2);
    },

    afterCreate(token, server) {
        const scope = server.schema.scopes.first() || server.create('scope');
        token.update('scopeIds', [scope.id]);
    },
});
