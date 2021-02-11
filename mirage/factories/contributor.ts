import { association, Collection, Factory, trait, Trait } from 'ember-cli-mirage';

import Contributor from 'ember-osf-web/models/contributor';
import { Permission } from 'ember-osf-web/models/osf-model';

interface ContributorTraits {
    registered: Trait;
    unregistered: Trait;
}

export interface MirageContributor extends Contributor {
    usersId: string | number | null;
}

export default Factory.extend<MirageContributor & ContributorTraits>({
    permission(i: number) {
        const permissions = Object.values(Permission);
        return permissions[i % permissions.length];
    },
    bibliographic: true,
    unregisteredContributor: undefined,
    index(i: number) {
        return i;
    },
    users: association() as Contributor['users'],

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

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        contributor: MirageContributor;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        contributors: MirageContributor;
    } // eslint-disable-line semi
}
