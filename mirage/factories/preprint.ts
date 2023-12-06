import { Factory, Trait, trait } from 'ember-cli-mirage';
import faker from 'faker';
import { ReviewActionTrigger } from 'ember-osf-web/models/review-action';

import PreprintModel from 'ember-osf-web/models/preprint';
import { Permission } from 'ember-osf-web/models/osf-model';
import { ReviewsState } from 'ember-osf-web/models/provider';

import { guid, guidAfterCreate} from './utils';

function buildLicenseText(): string {
    let text = faker.lorem.sentence(100);
    [250, 100, 250, 300].map((length: number) => {
        text = `${text}\n\n${faker.lorem.sentence(length)}`;
    });
    return text;
}

export interface PreprintMirageModel extends PreprintModel {
    isPreprintDoi: boolean;
    addLicenseName: boolean;
}

export interface PreprintTraits {
    pendingWithdrawal: Trait;
    isContributor: Trait;
    rejectedWithdrawalComment: Trait;
    acceptedWithdrawalComment: Trait;
    rejectedWithdrawalNoComment: Trait;
    reviewAction: Trait;
    pngImage: Trait;
}

export default Factory.extend<PreprintMirageModel & PreprintTraits>({
    id: guid('preprint'),
    title: faker.lorem.sentence(),

    isPreprintDoi: true,

    addLicenseName: true,

    currentUserPermissions: [Permission.Admin],

    reviewsState: ReviewsState.REJECTED,

    public: true,

    isPreprintOrphan: false,

    description: faker.lorem.sentence(),

    licenseRecord: {
        copyright_holders: [
            'Futa',
            'Yuhuai',
            'Brian G.',
        ],
        year: '2023',
    },

    dateWithdrawn: null,

    doi: null,

    tags() {
        return faker.lorem.words(5).split(' ');
    },

    citation: null,

    apiMeta: {
        metrics: {
            downloads: faker.random.number(1000),
            views: faker.random.number(10000),
        },
    },

    afterCreate(preprint, server) {
        guidAfterCreate(preprint, server);

        const file = server.create('file', {
            id: 'afile',
            target: preprint,
            links: {
                info: 'http://localhost:4200/assets/osf-assets/mfr-test.pdf',
                move: 'http://localhost:4200/assets/osf-assets/mfr-test.pdf',
                delete: 'http://localhost:4200/assets/osf-assets/mfr-test.pdf',
                html: 'http://localhost:4200/assets/osf-assets/mfr-test.pdf',
                upload: 'http://localhost:4200/assets/osf-assets/mfr-test.pdf',
                download: 'http://localhost:4200/assets/osf-assets/mfr-test.pdf',
            },
        });

        const node = server.create('node');

        const license = server.create('license', {
            name: preprint.addLicenseName ? 'Mozilla Public License 3.0' : undefined,
            text: buildLicenseText(),
            url: 'https://creativecommons.org/licenses/by/4.0/legalcode',
            requiredFields: [],
        });

        const subjects = [
            server.create('subject', 'withChildren'),
            server.create('subject'),
            server.create('subject', 'withChildren'),
        ];

        const contributorUser = server.create('user', {
            givenName: 'Emmit',
            familyName: 'Stud',
        });

        const contributor = server.create('contributor', {
            preprint,
            users: contributorUser,
            index: 0,
        });

        const secondContributor = server.create('contributor');

        const unregisteredContributor = server.create('contributor', 'unregistered');

        const thirdContributor = server.create('contributor');

        const allContributors = [contributor, unregisteredContributor, secondContributor, thirdContributor];

        preprint.update({
            contributors: allContributors,
            bibliographicContributors: allContributors,
            files: [file],
            primaryFile: file,
            license,
            subjects,
            date_created: new Date('2018-05-05T14:49:27.746938Z'),
            date_modified: new Date('2018-07-02T11:51:07.837747Z'),
            date_published: new Date('2018-05-05T14:54:01.681202Z'),
            node,
        });
    },

    pendingWithdrawal: trait<PreprintModel>({
        afterCreate(preprint, server) {
            const preprintRequest = server.create('preprintRequest', {
                target: preprint,
            }, 'pending');
            preprint.update({ requests: [preprintRequest ]});
        },
    }),

    isContributor: trait<PreprintModel>({
        afterCreate(preprint, server) {
            const { currentUserId } = server.schema.roots.first();
            server.create('contributor', {
                preprint,
                id: currentUserId,
            });
        },
    }),

    rejectedWithdrawalComment: trait<PreprintModel>({
        afterCreate(preprint, server) {
            const preprintRequest = server.create('preprintRequest', {
                target: preprint,
            }, 'rejectComment');
            preprint.update({ requests: [preprintRequest ]});
        },
    }),

    acceptedWithdrawalComment: trait<PreprintModel>({
        afterCreate(preprint, server) {
            const preprintRequest = server.create('preprintRequest', {
                target: preprint,
            }, 'acceptComment');
            preprint.update({ requests: [preprintRequest ]});
        },
    }),

    rejectedWithdrawalNoComment: trait<PreprintModel>({
        afterCreate(preprint, server) {
            const preprintRequest = server.create('preprintRequest', {
                target: preprint,
            }, 'rejectNoComment');
            preprint.update({ requests: [preprintRequest ]});
        },
    }),

    reviewAction: trait<PreprintModel>({
        afterCreate(preprint, server) {
            // console.log('created');
            const creator = server.create('user', { fullName: 'Review action Commentor' });
            const preprintReviewAction = server.create('review-action', {
                target: preprint,
                creator,
                actionTrigger: ReviewActionTrigger.RequestWithdrawal,
                comment: 'This is a job for Mario &amp; Luigi &gt;_&lt;',
            });
            preprint.update({ reviewActions: [preprintReviewAction]});
        },
    }),

    pngImage: trait<PreprintModel>({
        afterCreate(preprint) {
            preprint.update({
                links: {
                    info: 'http://localhost:4200/assets/osf-assets/amazon.png',
                    move: 'http://localhost:4200/assets/osf-assets/amazon.png',
                    delete: 'http://localhost:4200/assets/osf-assets/amazon.png',
                    html: 'http://localhost:4200/assets/osf-assets/amazon.png',
                    upload: 'http://localhost:4200/assets/osf-assets/amazon.png',
                    download: 'http://localhost:4200/assets/osf-assets/amazon.png',
                },
            });
        },
    }),

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
