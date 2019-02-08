import { Factory, faker } from 'ember-cli-mirage';

import Scope from 'ember-osf-web/models/scope';
import Token from 'ember-osf-web/models/token';

export interface MirageToken extends Token {
    scopeIds: string[];
}

export default Factory.extend<MirageToken>({
    id(i: number) {
        return i.toString().padStart(5, '0');
    },

    name() {
        return faker.lorem.words(2);
    },

    afterCreate(token, server) {
        const scope = server.schema.scopes.first<Scope>() || server.create('scope');
        token.update('scopeIds', [scope.id]);
    },
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        token: MirageToken;
    } // eslint-disable-line semi
}
