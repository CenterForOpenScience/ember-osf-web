import { association, Collection, Factory, faker, trait, Trait } from 'ember-cli-mirage';

import Contributor from 'ember-osf-web/models/contributor';
import { Permission } from 'ember-osf-web/models/osf-model';

interface ContributorTraits {
    registered: Trait;
    unregistered: Trait;
}

export default Factory.extend<Contributor & ContributorTraits>({
    permission: faker.list.cycle(...Object.values(Permission)),
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
    unregistered: trait<Contributor>({
        afterCreate(contributor) {
            contributor.update({ unregisteredContributor: 'unregistered user' });
        },
    }),
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        contributors: Contributor;
    } // eslint-disable-line semi
}
