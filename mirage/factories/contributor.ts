import { association, Collection, Factory, trait, Trait } from 'ember-cli-mirage';
import faker from 'faker';

import Contributor from 'ember-osf-web/models/contributor';
import { Permission } from 'ember-osf-web/models/osf-model';

interface ContributorTraits {
    registered: Trait;
    unregistered: Trait;
}

export default Factory.extend<Contributor & ContributorTraits>({
    permission(i) {
        const permissions = Object.values(Permission);
        return permissions[i % permissions.length];
    },
    bibliographic: true,
    unregisteredContributor() {
        return faker.random.number(5) ? undefined : faker.name.firstName();
    },
    index(i: number) {
        return i;
    },
    users: association() as Contributor['users'],

    fullName() {
        return `${faker.name.firstName()} ${faker.name.lastName()}`;
    },

    afterCreate(contributor) {
        if (contributor.bibliographic) {
            const { node } = contributor;
            if (node) {
                node.bibliographicContributors = [
                    ...node.bibliographicContributors.models,
                    contributor,
                ] as unknown as Collection<Contributor>;
                node.save();
            }
        }
    },

    registered: trait({ unregisteredContributor: undefined }),
    unregistered: trait({ unregisteredContributor: 'unregistered' }),
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        contributors: Contributor;
    } // eslint-disable-line semi
}
