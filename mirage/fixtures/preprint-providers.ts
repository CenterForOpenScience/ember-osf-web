import PreprintProvider from 'ember-osf-web/models/preprint-provider';
import { placekitten } from 'ember-osf-web/mirage/utils';
import { ReviewsWorkFlow } from 'ember-osf-web/models/provider';

import { randomGravatar } from '../utils';

function randomAssets(i: number) {
    return {
        square_color_no_transparent: randomGravatar(100),
        wide_white: placekitten(150, 75, i),
    };
}

const preprintProviders: Array<Partial<PreprintProvider>> = [
    {
        id: 'osf',
        name: 'Open Science Framework',
        preprintWord: 'preprint',
        assets: randomAssets(1),
        footerLinks: 'fake footer links',
        reviewsWorkflow: ReviewsWorkFlow.PRE_MODERATION,
    },
    {
        id: 'thesiscommons',
        name: 'Thesis Commons',
        preprintWord: 'thesis',
        assets: randomAssets(2),
        footerLinks: 'fake footer links',
    },
    {
        id: 'preprintrxiv',
        name: 'PreprintrXiv',
        preprintWord: 'preprint',
        assets: randomAssets(3),
        footerLinks: 'fake footer links',
        reviewsCommentsPrivate: true,
        reviewsWorkflow: ReviewsWorkFlow.PRE_MODERATION,
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
        reviewsWorkflow: ReviewsWorkFlow.POST_MODERATION,
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
        id: 'agrixiv',
        name: 'AgriXiv',
        preprintWord: 'preprint',
        assets: randomAssets(),
    },
    {
        id: 'biohackrxiv',
        name: 'BioHackrXiv',
        preprintWord: 'preprint',
        assets: randomAssets(),
    },
    {
        id: 'nutrixiv',
        name: 'NutriXiv',
        preprintWord: 'preprint',
        assets: randomAssets(),
    },
];

export default preprintProviders;
