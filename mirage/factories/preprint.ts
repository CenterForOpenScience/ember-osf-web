import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import PreprintModel from 'ember-osf-web/models/preprint';
import { Permission } from 'ember-osf-web/models/osf-model';
import { ReviewsState } from 'ember-osf-web/models/provider';

import { guid, guidAfterCreate} from './utils';

export default Factory.extend<PreprintModel>({
    id: guid('preprint'),
    title: faker.lorem.sentence(),

    currentUserPermissions: [Permission.Admin],

    reviewsState: ReviewsState.REJECTED,

    public: true,

    isPreprintOrphan: false,

    afterCreate(newPreprint, server) {
        guidAfterCreate(newPreprint, server);

        const file = server.create('file', {id: 'afile', target: newPreprint});

        const contributorUser = server.create('user', {
            givenName: 'Emmit',
            familyName: 'Stud',
        });

        const contributor = server.create('contributor', {
            preprint: newPreprint,
            users: contributorUser,
            index: 0,
        });

        const secondContributor = server.create('contributor');

        const unregisteredContributor = server.create('contributor', 'unregistered');

        const allContributors = [contributor, unregisteredContributor, secondContributor];

        newPreprint.update({
            contributors: allContributors,
            bibliographicContributors: allContributors,
            files: [file],
            primaryFile: file,
        });
    },

});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        preprint: PreprintModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        preprint: PreprintModel;
    } // eslint-disable-line semi
}
