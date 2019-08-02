import { Factory, faker, trait, Trait } from 'ember-cli-mirage';

import ExternalIdentity, { Status } from 'ember-osf-web/models/external-identity';

export interface ExternalIdentityTraits {
    withStatusVerified: Trait;
    withStatusLink: Trait;
    withStatusCreate: Trait;
}

function orcidPart() {
    return faker.random.number(9999).toString().padStart(4, '0');
}

export default Factory.extend<ExternalIdentity & ExternalIdentityTraits>({
    id(index: number) {
        return `${faker.hacker.abbreviation()}${index}`;
    },
    status() {
        return faker.random.arrayElement([
            Status.Verified,
            Status.Create,
            Status.Link,
        ]);
    },
    externalId() {
        return faker.internet.email();
    },
    afterCreate(identity) {
        if (identity.id === 'ORCID') {
            // eslint-disable-next-line no-param-reassign
            identity.externalId = `0000-0001-${orcidPart()}-${orcidPart()}`;
            identity.save();
        }
    },
    withStatusVerified: trait<ExternalIdentity>({
        afterCreate(identity) {
            // eslint-disable-next-line no-param-reassign
            identity.status = Status.Verified;
            identity.save();
        },
    }),
    withStatusLink: trait<ExternalIdentity>({
        afterCreate(identity) {
            // eslint-disable-next-line no-param-reassign
            identity.status = Status.Link;
            identity.save();
        },
    }),
    withStatusCreate: trait<ExternalIdentity>({
        afterCreate(identity) {
            // eslint-disable-next-line no-param-reassign
            identity.status = Status.Create;
            identity.save();
        },
    }),
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        externalIdentity: ExternalIdentity;
    } // eslint-disable-line semi
}
