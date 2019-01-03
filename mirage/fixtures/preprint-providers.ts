import PreprintProvider from 'ember-osf-web/models/preprint-provider';

import { randomGravatar } from '../utils';

function randomAssets() {
    return {
        square_color_no_transparent: randomGravatar(100),
    };
}

const preprintProviders: Array<Partial<PreprintProvider>> = [
    {
        id: 'osf',
        name: 'Open Science Framework',
        preprintWord: 'preprint',
        assets: randomAssets(),
    },
    {
        id: 'thesiscommons',
        name: 'Thesis Commons',
        preprintWord: 'thesis',
        assets: randomAssets(),
    },
    {
        id: 'preprintrxiv',
        name: 'PreprintrXiv',
        preprintWord: 'preprint',
        assets: randomAssets(),
    },
    {
        id: 'paperxiv',
        name: 'PaperXiv',
        preprintWord: 'paper',
        assets: randomAssets(),
    },
    {
        id: 'thesisrxiv',
        name: 'ThesisrXiv',
        preprintWord: 'thesis',
        assets: randomAssets(),
    },
    {
        id: 'workrxiv',
        name: 'WorkrXiv',
        preprintWord: 'work',
        assets: randomAssets(),
    },
    {
        id: 'docrxiv',
        name: 'DocrXiv',
        preprintWord: 'default',
        assets: randomAssets(),
    },
];

export default preprintProviders;
