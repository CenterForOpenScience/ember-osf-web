import PreprintProvider from 'ember-osf-web/models/preprint-provider';
import { placekitten } from 'ember-osf-web/mirage/utils';

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
    },
    {
        id: 'thesiscommons',
        name: 'Thesis Commons',
        preprintWord: 'thesis',
        assets: randomAssets(2),
    },
    {
        id: 'preprintrxiv',
        name: 'PreprintrXiv',
        preprintWord: 'preprint',
        assets: randomAssets(3),
    },
    {
        id: 'paperxiv',
        name: 'PaperXiv',
        preprintWord: 'paper',
        assets: randomAssets(4),
    },
    {
        id: 'thesisrxiv',
        name: 'ThesisrXiv',
        preprintWord: 'thesis',
        assets: randomAssets(5),
    },
    {
        id: 'workrxiv',
        name: 'WorkrXiv',
        preprintWord: 'work',
        assets: randomAssets(6),
    },
    {
        id: 'docrxiv',
        name: 'DocrXiv',
        preprintWord: 'default',
        assets: randomAssets(7),
    },
];

export default preprintProviders;
