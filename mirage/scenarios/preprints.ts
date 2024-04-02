import { ModelInstance, Server } from 'ember-cli-mirage';
import { Permission } from 'ember-osf-web/models/osf-model';
import { PreprintDataLinksEnum, PreprintPreregLinksEnum } from 'ember-osf-web/models/preprint';

import PreprintProvider from 'ember-osf-web/models/preprint-provider';
import { ReviewsState } from 'ember-osf-web/models/provider';
import User from 'ember-osf-web/models/user';
import faker from 'faker';

export function preprintsScenario(
    server: Server,
    currentUser: ModelInstance<User>,
) {
    buildOSF(server, currentUser);
    buildrXiv(server, currentUser);
    buildThesisCommons(server, currentUser);
    buildAgrixiv(server, currentUser);
    buildNutrixiv(server);
    buildBiohackrxiv(server);
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

    const rejectedAdminPreprint = server.create('preprint', {
        provider: osf,
        id: 'osf-rejected-admin',
        title: 'Preprint RWF: Pre-moderation, Admin and Rejected with Review Actions comment',
        currentUserPermissions: [Permission.Admin],
        reviewsState: ReviewsState.REJECTED,
        tags: [],
    }, 'reviewAction');

    const approvedAdminPreprint = server.create('preprint', {
        provider: osf,
        id: 'osf-approved-admin',
        title: 'Preprint RWF: Pre-moderation, Admin and Approved',
        currentUserPermissions: [Permission.Admin],
        reviewsState: ReviewsState.ACCEPTED,
        description: `${faker.lorem.sentence(200)}\n${faker.lorem.sentence(100)}`,
        doi: '10.30822/artk.v1i1.79',
        originalPublicationDate: new Date('2016-11-30T16:00:00.000000Z'),
        preprintDoiCreated: new Date('2016-11-30T16:00:00.000000Z'),
        hasCoi: true,
        hasDataLinks: PreprintDataLinksEnum.NOT_APPLICABLE,
        hasPreregLinks: PreprintPreregLinksEnum.NOT_APPLICABLE,
    });

    const osfApprovedAdminIdentifier = server.create('identifier');

    approvedAdminPreprint.update({ identifiers: [osfApprovedAdminIdentifier] });

    const notContributorPreprint = server.create('preprint', {
        provider: osf,
        id: 'osf-not-contributor',
        title: 'Preprint RWF: Pre-moderation, Non-Admin and Rejected',
        currentUserPermissions: [],
        reviewsState: ReviewsState.REJECTED,
        hasDataLinks: PreprintDataLinksEnum.NO,
        hasPreregLinks: PreprintPreregLinksEnum.NO,
        whyNoData: `Why No Data\n${faker.lorem.sentence(200)}\n${faker.lorem.sentence(300)}`,
        whyNoPrereg: `Why No Prereg\n${faker.lorem.sentence(200)}\n${faker.lorem.sentence(300)}`,
        tags: [],
    });

    const rejectedPreprint = server.create('preprint', {
        provider: osf,
        id: 'osf-rejected',
        title: 'Preprint RWF: Pre-moderation, Non-Admin and Rejected',
        currentUserPermissions: [],
        reviewsState: ReviewsState.REJECTED,
        hasDataLinks: PreprintDataLinksEnum.NO,
        hasPreregLinks: PreprintPreregLinksEnum.NO,
        tags: [],
    }, 'isContributor');

    const approvedPreprint = server.create('preprint', {
        provider: osf,
        id: 'osf-approved',
        title: 'Preprint RWF: Pre-moderation, Non-Admin and Approved',
        currentUserPermissions: [],
        datePublished: new Date('2016-12-25T16:00:00.000000Z'),
        dateModified: new Date('2016-12-31T16:00:00.000000Z'),
        doi: '10.30822/artk.v1i1.79',
        reviewsState: ReviewsState.ACCEPTED,
        description: `${faker.lorem.sentence(200)}\n${faker.lorem.sentence(300)}`,
        originalPublicationDate: new Date('2016-11-30T16:00:00.000000Z'),
        preprintDoiCreated: new Date('2016-11-30T16:00:00.000000Z'),
        hasCoi: true,
        hasDataLinks: PreprintDataLinksEnum.AVAILABLE,
        dataLinks: ['Data link 1', 'Data link 2', 'Data link 3'],
        hasPreregLinks: PreprintPreregLinksEnum.AVAILABLE,
        preregLinks: ['Prereg link 1', 'Prereg link 2', 'Prereg link 3'],
        conflictOfInterestStatement: `${faker.lorem.sentence(200)}\n${faker.lorem.sentence(300)}`,
    }, 'isContributor');

    const orphanedPreprint = server.create('preprint', {
        provider: osf,
        id: 'osf-orphan',
        title: 'Preprint RWF: Pre-moderation, Non-Admin and Approved',
        currentUserPermissions: [],
        reviewsState: ReviewsState.ACCEPTED,
        isPreprintOrphan: true,
    }, 'isContributor');

    const privatePreprint = server.create('preprint', Object({
        provider: osf,
        id: 'osf-private',
        title: 'Preprint RWF: Pre-moderation, Non-Admin and Approved',
        currentUserPermissions: [],
        reviewsState: ReviewsState.ACCEPTED,
        public: false,
        isPreprintDoi: false,
    }), 'isContributor');

    const publicDoiPreprint = server.create('preprint', Object({
        provider: osf,
        id: 'osf-public-doi',
        title: 'Preprint RWF: Pre-moderation, Non-Admin and Approved',
        currentUserPermissions: [],
        reviewsState: ReviewsState.ACCEPTED,
        public: true,
        hasCoi: false,
        isPreprintDoi: false,
        isPublished: true,
    }), 'isContributor');

    const notPublishedPreprint = server.create('preprint', {
        provider: osf,
        id: 'osf-not-published',
        title: 'Preprint RWF: Pre-moderation, Non-Admin and Approved',
        currentUserPermissions: [],
        reviewsState: ReviewsState.ACCEPTED,
        isPublished: false,
    }, 'isContributor');

    const withdrawnPreprint = server.create('preprint', Object({
        provider: osf,
        id: 'osf-withdrawn',
        title: 'Preprint Non-Admin, Not Published and withdrawn - no license - no justification',
        currentUserPermissions: [],
        reviewsState: ReviewsState.ACCEPTED,
        isPublished: false,
        dateWithdrawn: new Date(),
        addLicenseName: false,
    }), 'isContributor', 'withdrawn' );

    const withdrawnLicensePreprint = server.create('preprint', Object({
        provider: osf,
        id: 'osf-withdrawn-license',
        title: 'Preprint Non-Admin, Not Published and withdrawn - license - justification - tombstone',
        currentUserPermissions: [],
        reviewsState: ReviewsState.ACCEPTED,
        isPublished: false,
        dateWithdrawn: new Date(),
        withdrawalJustification: 'This is the justification',
        description: `${faker.lorem.sentence(200)}\n${faker.lorem.sentence(100)}`,
    }), 'isContributor', 'withdrawn');

    const pendingWithdrawalPreprint = server.create('preprint', {
        provider: osf,
        id: 'osf-pending-withdrawal',
        title: 'Preprint Non-Admin, Not Published and Pending Withdrawal',
        currentUserPermissions: [],
        reviewsState: ReviewsState.ACCEPTED,
        isPublished: false,
    }, 'pendingWithdrawal', 'isContributor');

    const rejectedWithdrawalPreprintNoComment = server.create('preprint', {
        provider: osf,
        id: 'osf-rejected-withdrawal-no-comment',
        title: 'Preprint Non-Admin, Not Published and Rejected Withdrawal - No Comment',
        currentUserPermissions: [],
        reviewsState: ReviewsState.ACCEPTED,
        isPublished: false,
    }, 'rejectedWithdrawalNoComment', 'isContributor');

    const rejectedWithdrawalPreprintComment = server.create('preprint', {
        provider: osf,
        id: 'osf-rejected-withdrawal-comment',
        title: 'Preprint Non-Admin, Not Published and Rejected Withdrawal - Comment - Reviews Allowed',
        currentUserPermissions: [],
        reviewsState: ReviewsState.ACCEPTED,
        isPublished: false,
    }, 'rejectedWithdrawalComment', 'isContributor');

    const acceptedWithdrawalPreprintComment = server.create('preprint', {
        provider: osf,
        id: 'osf-accepted-withdrawal-comment',
        title: 'Preprint Non-Admin, Not Published and Accepted Withdrawal - Comment - Reviews Allowed',
        currentUserPermissions: [],
        reviewsState: ReviewsState.ACCEPTED,
        isPublished: false,
    }, 'acceptedWithdrawalComment');

    const examplePreprint = server.create('preprint', {
        provider: osf,
        id: 'khbvy',
        title: 'The "See Example" hard-coded preprint',
        currentUserPermissions: [],
        reviewsState: ReviewsState.ACCEPTED,
        description: `${faker.lorem.sentence(200)}\n${faker.lorem.sentence(100)}`,
        doi: '10.30822/artk.v1i1.79',
        originalPublicationDate: new Date('2016-11-30T16:00:00.000000Z'),
        preprintDoiCreated: new Date('2016-11-30T16:00:00.000000Z'),
        hasCoi: true,
        hasDataLinks: PreprintDataLinksEnum.NOT_APPLICABLE,
        hasPreregLinks: PreprintPreregLinksEnum.NOT_APPLICABLE,
    });

    const subjects = server.createList('subject', 7);

    osf.update({
        allowSubmissions: true,
        highlightedSubjects: subjects,
        licensesAcceptable: server.schema.licenses.all(),
        // currentUser,
        // eslint-disable-next-line max-len
        advisory_board: '<div class=\'preprint-advisory-header\'>\n<h2>Advisory Group</h2>\n<p>Our advisory group includes leaders in preprints and scholarly communication\n</p></div>\n<div class=\'preprint-advisory-list\'><div class=\'preprint-advisory-list-column\'>\n<ul>\n<li><strong>Devin Berg</strong> : engrXiv, University of Wisconsin-Stout</li>\n<li><strong>Pete Binfield</strong> : PeerJ PrePrints</li>\n<li><strong>Benjamin Brown</strong> : PsyArXiv, Georgia Gwinnett College</li>\n<li><strong>Philip Cohen</strong> : SocArXiv, University of Maryland</li>\n<li><strong>Kathleen Fitzpatrick</strong> : Modern Language Association</li>\n</ul>\n</div>\n<div class=\'preprint-advisory-list-column\'>\n<ul>\n<li><strong>John Inglis</strong> : bioRxiv, Cold Spring Harbor Laboratory Press</li>\n<li><strong>Rebecca Kennison</strong> : K | N Consultants</li>\n<li><strong>Kristen Ratan</strong> : CoKo Foundation</li>\n<li><strong>Oya Riege</strong>r : Ithaka S+R</li>\n<li><strong>Judy Ruttenberg</strong> : SHARE, Association of Research Libraries</li>\n</ul>\n</div>\n</div>',
        footer_links: '',
        brand,
        moderators: [currentUserModerator],
        preprints: [
            examplePreprint,
            rejectedAdminPreprint,
            approvedAdminPreprint,
            approvedPreprint,
            rejectedPreprint,
            orphanedPreprint,
            privatePreprint,
            notPublishedPreprint,
            withdrawnPreprint,
            withdrawnLicensePreprint,
            pendingWithdrawalPreprint,
            rejectedWithdrawalPreprintNoComment,
            rejectedWithdrawalPreprintComment,
            acceptedWithdrawalPreprintComment,
            notContributorPreprint,
            publicDoiPreprint,
        ],
        description: 'This is the description for osf',
    });
}

function buildrXiv(
    server: Server,
    currentUser: ModelInstance<User>,
) {
    const preprintrxiv = server.schema.preprintProviders.find('preprintrxiv') as ModelInstance<PreprintProvider>;
    preprintrxiv.update({
        citationStyles: [server.schema.citationStyles.find('another-citation')],
    });

    const brand = server.create('brand', {
        primaryColor: '#286090',
        secondaryColor: '#fff',
        heroLogoImage: 'images/default-brand/osf-preprints-white.png',
        heroBackgroundImage: 'images/default-brand/bg-dark.jpg',
    });

    const currentUserModerator = server.create('moderator',
        { id: currentUser.id, user: currentUser, provider: preprintrxiv}, 'asAdmin');

    const rejectedWithdrawalPreprintCommentPrivate = server.create('preprint', {
        provider: preprintrxiv,
        id: 'preprintrxiv-rejected-withdrawal-comment',
        title: 'Preprint Non-Admin, Not Published and Rejected Withdrawal - Comment - Reviews Disabled',
        currentUserPermissions: [],
        reviewsState: ReviewsState.ACCEPTED,
        isPublished: false,
    }, 'rejectedWithdrawalComment', 'isContributor');

    const pendingPreprint = server.create('preprint', Object({
        provider: preprintrxiv,
        id: 'preprintrxiv-pending',
        title: 'Preprint Non-Admin, Pending - Pre Moderation',
        currentUserPermissions: [],
        reviewsState: ReviewsState.PENDING,
        isPublished: false,
    }) , 'isContributor');

    const subjects = server.createList('subject', 7);

    preprintrxiv.update({
        allowSubmissions: true,
        highlightedSubjects: subjects,
        licensesAcceptable: server.schema.licenses.all(),
        // eslint-disable-next-line max-len
        advisory_board: '<div class=\'preprint-advisory-header\'>\n<h2>Advisory Group</h2>\n<p>Our advisory group includes leaders in preprints and scholarly communication\n</p></div>\n<div class=\'preprint-advisory-list\'><div class=\'preprint-advisory-list-column\'>\n<ul>\n<li><strong>Devin Berg</strong> : engrXiv, University of Wisconsin-Stout</li>\n<li><strong>Pete Binfield</strong> : PeerJ PrePrints</li>\n<li><strong>Benjamin Brown</strong> : PsyArXiv, Georgia Gwinnett College</li>\n<li><strong>Philip Cohen</strong> : SocArXiv, University of Maryland</li>\n<li><strong>Kathleen Fitzpatrick</strong> : Modern Language Association</li>\n</ul>\n</div>\n<div class=\'preprint-advisory-list-column\'>\n<ul>\n<li><strong>John Inglis</strong> : bioRxiv, Cold Spring Harbor Laboratory Press</li>\n<li><strong>Rebecca Kennison</strong> : K | N Consultants</li>\n<li><strong>Kristen Ratan</strong> : CoKo Foundation</li>\n<li><strong>Oya Riege</strong>r : Ithaka S+R</li>\n<li><strong>Judy Ruttenberg</strong> : SHARE, Association of Research Libraries</li>\n</ul>\n</div>\n</div>',
        footer_links: '',
        brand,
        moderators: [currentUserModerator],
        preprints: [
            rejectedWithdrawalPreprintCommentPrivate, pendingPreprint,
        ],
        description: 'This is the description for preprintrXiv',
    });
}

function buildThesisCommons(
    server: Server,
    currentUser: ModelInstance<User>,
) {
    const thesisCommons = server.schema.preprintProviders.find('thesiscommons') as ModelInstance<PreprintProvider>;
    const brand = server.create('brand', {
        primaryColor: '#821e1e',
        secondaryColor: '#94918e',
        heroBackgroundImage: 'https://singlecolorimage.com/get/94918e/1000x1000',
    });
    const currentUserModerator = server.create('moderator',
        { id: currentUser.id, user: currentUser, provider: thesisCommons }, 'asAdmin');

    const preprints = server.createList('preprint', 3, {
        provider: thesisCommons,
    });

    const subjects = server.createList('subject', 2);


    thesisCommons.update({
        highlightedSubjects: subjects,
        brand,
        licensesAcceptable: server.schema.licenses.all(),
        moderators: [currentUserModerator],
        preprints,
        description: '<p style="color: red">This is the description for Thesis Commons and it has an inline-style!</p>',
        // eslint-disable-next-line max-len
        advisory_board: '<h2><strong>Steering Committee</strong></h2>\n<div class=\'col-xs-6\'>\n<ul>\n<li><strong>Obasegun Ayodele</strong>, Vilsquare.org, Nigeria </li>\n<li><strong>Fayza Mahmoud</strong>, Alexandria University, Egypt</li>\n<li><strong>Johanssen Obanda</strong>, Jabulani Youths for Transformation (JAY4T), Kenya</li>\n<li><strong>Umar Ahmad</strong>, University Putra Malaysia (UPM) and the Malaysia Genome Institute (MGI)</li>\n<li><strong>Michael Cary</strong>, West Virginia University, USA</li>\n<li><strong>Nada Fath</strong>, Mohamed V University &amp; Hassan II Institute of Agronomy and Veterinary Medicine, Rabat, Morocco</li>\n<li><strong>Greg Simpson</strong>, Cranfield University, England &amp; South Africa</li>\n</ul>\n</div>\n<ul>\n<li><strong>Hisham Arafat</strong>, EMEA Applications Consulting, Egypt</li>\n<li><strong>Justin Sègbédji Ahinon</strong>, AfricArXiv co-founder, IGDORE, Bénin</li>\n<li><strong>Mahmoud M Ibrahim</strong>, Uniklinik RWTH Aachen, Germany &amp; Egypt</li>\n<li><strong>Luke Okelo</strong>, Technical University of Kenya </li>\n<li><strong>Ryszard Auksztulewicz</strong>, MPI of Empirical Aesthetics, Germany &amp; City University of Hong Kong</li>\n<li><strong>Osman Aldirdiri</strong>, University of Khartoum, Sudan</li>\n<li><strong>Jo Havemann</strong>, AfricArXiv co-founder, Access 2 Perspectives‘, IGDORE, Germany &amp; Kenya</li>\n</ul>',
        // eslint-disable-next-line max-len
        footer_links: '<p><span><span style="vertical-align: baseline;">AfricArXiv: <a href="https://info.africarxiv.org/">About</a> | </span></span><span><span style="vertical-align: baseline;"><a href="https://info.africarxiv.org/before-you-submit/" target="_blank">Submission Guidelines</a> | </span></span><span><span style="vertical-align: baseline;"><a href="mailto:support+africarxiv@osf.io">Support</a> | <a href="mailto:contact+africarxiv@osf.io">Contact</a> |</span></span><span style="text-align: center;"> </span><a href="https://twitter.com/AfricArxiv" style="text-align: center;" target="_blank" title="AfricArxiv on Twitter"><span class="fa fa-twitter fa-2x" style="vertical-align: middle;"> </span></a><span style="text-align: center;"> </span><a href="https://www.facebook.com/africarxiv" style="text-align: center;" target="_blank" title="AfricArxiv on Facebook"><span class="fa fa-facebook fa-2x" style="vertical-align: middle;"> </span></a></p>',
        email_support: 'overwritten-email@osf.io',
    });
}

function buildAgrixiv(
    server: Server,
    currentUser: ModelInstance<User>,
) {
    const agrixiv = server.schema.preprintProviders.find('agrixiv') as ModelInstance<PreprintProvider>;

    const agrixivBrand = server.create('brand', {
        primaryColor: '#85BF9B',
        secondaryColor: '#E7F7E1',
        heroBackgroundImage: 'https://singlecolorimage.com/get/E7F7E1/1000x1000',
    });

    const currentUserModerator = server.create('moderator',
        { id: currentUser.id, user: currentUser, provider: agrixiv}, 'asAdmin');

    const rejectedWithdrawalPreprintComment = server.create('preprint', {
        provider: agrixiv,
        id: 'agrixiv-rejected-withdrawal-comment',
        title: 'Preprint Non-Admin, Not Published and Rejected Withdrawal - Comment - Reviews Allowed',
        currentUserPermissions: [],
        reviewsState: ReviewsState.ACCEPTED,
        isPublished: false,
    }, 'rejectedWithdrawalComment', 'isContributor');

    const pendingPreprint = server.create('preprint', {
        provider: agrixiv,
        id: 'agrixiv-pending',
        title: 'Preprint Non-Admin, Pending - Post Moderation',
        currentUserPermissions: [],
        reviewsState: ReviewsState.PENDING,
        isPublished: false,
    }, 'isContributor');

    agrixiv.update({
        moderators: [currentUserModerator],
        licensesAcceptable: server.schema.licenses.all(),
        brand: agrixivBrand,
        description: '<p style="color: black">This is the description for agrixiv!</p>',
        preprints: [
            rejectedWithdrawalPreprintComment,
            pendingPreprint,
        ],
    });
}

function buildNutrixiv(
    server: Server,
) {
    const nutrixiv = server.schema.preprintProviders.find('nutrixiv') as ModelInstance<PreprintProvider>;
    const nutrixivBrand = server.create('brand', {
        primaryColor: '#000000',
        secondaryColor: '#888888',
        heroBackgroundImage: 'https://singlecolorimage.com/get/4a4a4a/1000x1000',
    });
    nutrixiv.update({
        brand: nutrixivBrand,
        licensesAcceptable: server.schema.licenses.all(),
        description: '<p style="color: green">This is the description for nutrixiv!</p>',
    });
}

function buildBiohackrxiv(server: Server) {
    const biohackrxiv = server.schema.preprintProviders.find('biohackrxiv') as ModelInstance<PreprintProvider>;
    const biohackrxivBrand = server.create('brand', {
        primaryColor: '#000000',
        secondaryColor: '#ccc',
        heroBackgroundImage: 'https://singlecolorimage.com/get/ffffff/1000x1000',
    });

    const publicDoiPreprint = server.create('preprint', Object({
        provider: biohackrxiv,
        id: 'biohackrxiv-public-doi',
        title: 'Preprint RWF: No ReviewStatus, Non-Admin, Accepted, No Preprint Doi, public ',
        currentUserPermissions: [],
        reviewsState: ReviewsState.ACCEPTED,
        public: true,
        isPreprintDoi: false,
        isPublished: false,
    }));

    biohackrxiv.update({
        brand: biohackrxivBrand,
        licensesAcceptable: server.schema.licenses.all(),
        description: '<p style="color: black">This is the description for biohackrxiv!</p>',
        preprints: [publicDoiPreprint],
    });
}
