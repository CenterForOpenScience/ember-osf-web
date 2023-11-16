import PreprintProvider from 'ember-osf-web/models/preprint-provider';
import { placekitten } from 'ember-osf-web/mirage/utils';
import { PreprintProviderReviewsWorkFlow } from 'ember-osf-web/models/provider';

import { randomGravatar } from '../utils';

function randomAssets(i: number, includeImage = true) {
    const image = includeImage ? placekitten(150, 75, i) : undefined;
    return {
        square_color_no_transparent: randomGravatar(100),
        wide_white: image,
    };
}

const preprintProviders: Array<Partial<PreprintProvider>> = [
    {
        id: 'osf',
        name: 'Open Science Framework',
        preprintWord: 'preprint',
        assets: randomAssets(1),
        footerLinks: 'fake footer links',
        reviewsWorkflow: PreprintProviderReviewsWorkFlow.PRE_MODERATION,
    },
    {
        id: 'thesiscommons',
        name: 'Thesis Commons',
        preprintWord: 'thesis',
        assets: randomAssets(2),
        // eslint-disable-next-line max-len
        footerLinks: '<p style="text-align: center;">LawArXiv:&nbsp;<a href="mailto:support+lawarxiv@osf.io">Support&nbsp;</a>|&nbsp;<a href="mailto:contact+lawarxiv@osf.io">Contact&nbsp;</a>|&nbsp;<a href="https://twitter.com/lawarxiv" target="_blank" title="LawArXiv on Twitter"><span class="fa fa-twitter fa-2x" style="vertical-align: middle;">&nbsp;</span></a></p>\n <p>LawrXiv is a trademark of Cornell University, used under license. This license should not be understood to indicate endorsement of content on LawArXiv by Cornell University or arXiv.</p>',
    },
    {
        id: 'preprintrxiv',
        name: 'PreprintrXiv',
        preprintWord: 'preprint',
        assets: randomAssets(3),
        footerLinks: 'fake footer links',
        reviewsCommentsPrivate: true,
        reviewsWorkflow: PreprintProviderReviewsWorkFlow.PRE_MODERATION,
    },
    {
        id: 'paperxiv',
        name: 'PaperXiv',
        preprintWord: 'paper',
        assets: randomAssets(4),
        footerLinks: 'fake footer links',
    },
    {
        id: 'thesisrxiv',
        name: 'ThesisrXiv',
        preprintWord: 'thesis',
        assets: randomAssets(5),
        footerLinks: 'fake footer links',
    },
    {
        id: 'workrxiv',
        name: 'WorkrXiv',
        preprintWord: 'work',
        assets: randomAssets(6),
        footerLinks: 'fake footer links',
    },
    {
        id: 'docrxiv',
        name: 'DocrXiv',
        preprintWord: 'default',
        assets: randomAssets(7),
        footerLinks: 'fake footer links',
    },
    {
        id: 'agrixiv',
        name: 'AgriXiv',
        preprintWord: 'preprint',
        assets: randomAssets(8),
        reviewsWorkflow: PreprintProviderReviewsWorkFlow.POST_MODERATION,
    },
    {
        id: 'biohackrxiv',
        name: 'BioHackrXiv',
        preprintWord: 'preprint',
        assets: randomAssets(9),
    },
    {
        id: 'nutrixiv',
        name: 'NutriXiv',
        preprintWord: 'preprint',
        assets: randomAssets(10),
    },
    {
        id: 'paleorxiv',
        name: 'PaleoRrxiv',
        preprintWord: 'preprint',
        assets: randomAssets(10, false),
    },
    {
        id: 'sportrxiv',
        name: 'Sport-Rxiv',
        preprintWord: 'paper',
        assets: randomAssets(10),
    },
];

export default preprintProviders;
