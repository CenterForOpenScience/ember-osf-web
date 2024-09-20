import { ModelInstance, Server } from 'ember-cli-mirage';
import { Permission } from 'ember-osf-web/models/osf-model';
import {
    PreprintDataLinksEnum,
    PreprintPreregLinksEnum,
} from 'ember-osf-web/models/preprint';

import PreprintProvider from 'ember-osf-web/models/preprint-provider';
import { ReviewsState } from 'ember-osf-web/models/provider';
import User from 'ember-osf-web/models/user';
import faker from 'faker';

export function preprintsAffiliatedInstitutionsScenario(
    server: Server,
    currentUser: ModelInstance<User>,
) {
    buildOSF(server, currentUser);
}

function buildOSF(
    server: Server,
    currentUser: ModelInstance<User>,
) {
    const osf = server.schema.preprintProviders.find('osf') as ModelInstance<PreprintProvider>;

    const brand = server.create('brand', {
        primaryColor: '#286090',
        secondaryColor: '#fff',
        heroLogoImage: 'images/default-brand/osf-preprints-white.png',
        heroBackgroundImage: 'images/default-brand/bg-dark.jpg',
    });

    const currentUserModerator = server.create('moderator',
        { id: currentUser.id, user: currentUser, provider: osf }, 'asAdmin');

    const noAffiliatedInstitutionsPreprint = server.create('preprint', {
        provider: osf,
        id: 'osf-no-affiliated-institutions',
        title: 'Preprint RWF: Pre-moderation, Admin and Approved',
        currentUserPermissions: [Permission.Admin,Permission.Write,Permission.Read],
        reviewsState: ReviewsState.ACCEPTED,
        description: `${faker.lorem.sentence(200)}\n${faker.lorem.sentence(100)}`,
        doi: '10.30822/artk.v1i1.79',
        originalPublicationDate: new Date('2016-11-30T16:00:00.000000Z'),
        preprintDoiCreated: new Date('2016-11-30T16:00:00.000000Z'),
        customPublicationCitation: 'This is the publication Citation',
        hasCoi: true,
        conflictOfInterestStatement: 'This is the conflict of interest statement',
        hasDataLinks: PreprintDataLinksEnum.NOT_APPLICABLE,
        dataLinks: [
            'http://www.datalink.com/1',
            'http://www.datalink.com/2',
            'http://www.datalink.com/3',
        ],
        hasPreregLinks: PreprintPreregLinksEnum.NOT_APPLICABLE,
    });

    const osfApprovedAdminIdentifier = server.create('identifier');

    noAffiliatedInstitutionsPreprint.update({ identifiers: [osfApprovedAdminIdentifier] });

    const affiliatedInstitutionsPreprint = server.create('preprint', {
        provider: osf,
        id: 'osf-affiliated-institutions',
        title: 'Preprint RWF: Pre-moderation, Admin and Approved',
        currentUserPermissions: [Permission.Admin,Permission.Write,Permission.Read],
        reviewsState: ReviewsState.ACCEPTED,
        description: `${faker.lorem.sentence(200)}\n${faker.lorem.sentence(100)}`,
        doi: '10.30822/artk.v1i1.79',
        originalPublicationDate: new Date('2016-11-30T16:00:00.000000Z'),
        preprintDoiCreated: new Date('2016-11-30T16:00:00.000000Z'),
        customPublicationCitation: 'This is the publication Citation',
        hasCoi: true,
        conflictOfInterestStatement: 'This is the conflict of interest statement',
        hasDataLinks: PreprintDataLinksEnum.NOT_APPLICABLE,
        dataLinks: [
            'http://www.datalink.com/1',
            'http://www.datalink.com/2',
            'http://www.datalink.com/3',
        ],
        hasPreregLinks: PreprintPreregLinksEnum.NOT_APPLICABLE,
    }, 'withAffiliatedInstitutions');

    const subjects = server.createList('subject', 7);

    osf.update({
        allowSubmissions: true,
        highlightedSubjects: subjects,
        subjects,
        licensesAcceptable: server.schema.licenses.all(),
        // currentUser,
        // eslint-disable-next-line max-len
        advisory_board: '<div class=\'preprint-advisory-header\'>\n<h2>Advisory Group</h2>\n<p>Our advisory group includes leaders in preprints and scholarly communication\n</p></div>\n<div class=\'preprint-advisory-list\'><div class=\'preprint-advisory-list-column\'>\n<ul>\n<li><strong>Devin Berg</strong> : engrXiv, University of Wisconsin-Stout</li>\n<li><strong>Pete Binfield</strong> : PeerJ PrePrints</li>\n<li><strong>Benjamin Brown</strong> : PsyArXiv, Georgia Gwinnett College</li>\n<li><strong>Philip Cohen</strong> : SocArXiv, University of Maryland</li>\n<li><strong>Kathleen Fitzpatrick</strong> : Modern Language Association</li>\n</ul>\n</div>\n<div class=\'preprint-advisory-list-column\'>\n<ul>\n<li><strong>John Inglis</strong> : bioRxiv, Cold Spring Harbor Laboratory Press</li>\n<li><strong>Rebecca Kennison</strong> : K | N Consultants</li>\n<li><strong>Kristen Ratan</strong> : CoKo Foundation</li>\n<li><strong>Oya Riege</strong>r : Ithaka S+R</li>\n<li><strong>Judy Ruttenberg</strong> : SHARE, Association of Research Libraries</li>\n</ul>\n</div>\n</div>',
        footer_links: '',
        brand,
        moderators: [currentUserModerator],
        preprints: [
            noAffiliatedInstitutionsPreprint,
            affiliatedInstitutionsPreprint,
        ],
        description: 'This is the description for osf',
    });
}
