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
        advertiseOnDiscoverPage: true,
        preprintWord: 'preprint',
        assets: randomAssets(1),
        footerLinks: 'fake footer links',
        reviewsWorkflow: PreprintProviderReviewsWorkFlow.PRE_MODERATION,
        assertionsEnabled: true,
        allowCommenting: true,
        allowSubmissions: true,
    },
    {
        id: 'thesiscommons',
        name: 'Thesis Commons',
        advertiseOnDiscoverPage: true,
        preprintWord: 'thesis',
        assets: randomAssets(2),
        // eslint-disable-next-line max-len
        footerLinks: '<p style="text-align: center;">LawArXiv:&nbsp;<a href="mailto:support+lawarxiv@osf.io">Support&nbsp;</a>|&nbsp;<a href="mailto:contact+lawarxiv@osf.io">Contact&nbsp;</a>|&nbsp;<a href="https://twitter.com/lawarxiv" target="_blank" title="LawArXiv on Twitter"><span class="fa fa-twitter fa-2x" style="vertical-align: middle;">&nbsp;</span></a></p>\n <p>LawrXiv is a trademark of Cornell University, used under license. This license should not be understood to indicate endorsement of content on LawArXiv by Cornell University or arXiv.</p>',
        allowSubmissions: true,
    },
    {
        id: 'preprintrxiv',
        name: 'PreprintrXiv',
        advertiseOnDiscoverPage: false,
        preprintWord: 'preprint',
        assets: randomAssets(3),
        // eslint-disable-next-line max-len
        footerLinks: 'Removed in mirage scenario',
        reviewsCommentsPrivate: true,
        reviewsWorkflow: PreprintProviderReviewsWorkFlow.PRE_MODERATION,
        allowSubmissions: true,
    },
    {
        id: 'paperxiv',
        name: 'PaperXiv',
        advertiseOnDiscoverPage: true,
        preprintWord: 'paper',
        assets: randomAssets(4),
        // eslint-disable-next-line max-len
        footerLinks: '<p style="text-align: right;" data-mce-style="text-align: right;">AgriXiv:&nbsp;<a href="mailto:support+agrixiv@osf.io" data-mce-href="mailto:support+agrixiv@osf.io">Support&nbsp;</a>|&nbsp;<a href="mailto:contact+agrixiv@osf.io" data-mce-href="mailto:contact+agrixiv@osf.io">Contact&nbsp;</a>|&nbsp;<a href="https://twitter.com/AgriXiv" target="_blank" title="AgriXiv on Twitter" rel="noopener" data-mce-href="https://twitter.com/AgriXiv"><span class="fa fa-twitter fa-2x" style="vertical-align: middle;" data-mce-style="vertical-align: middle;">&nbsp;</span></a>&nbsp;<a href="https://www.facebook.com/AgriXiv/" target="_blank" title="AgriXiv on Facebook" rel="noopener" data-mce-href="https://www.facebook.com/AgriXiv/"><span class="fa fa-facebook fa-2x" style="vertical-align: middle;" data-mce-style="vertical-align: middle;">&nbsp;</span></a>&nbsp;<a href="https://www.instagram.com/agrixiv/" target="_blank" title="AgriXiv on Instagram" rel="noopener" data-mce-href="https://www.instagram.com/agrixiv/"><span class="fa fa-2x fa-instagram" style="vertical-align: middle;" data-mce-style="vertical-align: middle;">&nbsp;</span></a><br data-mce-bogus="1"></p><p style="text-align: right;" data-mce-style="text-align: right;">arXiv is a trademark of Cornell University, used under license. This license should not be understood to indicate endorsement of content on AgriXiv by Cornell University or arXiv.</p>',
        allowSubmissions: true,
    },
    {
        id: 'thesisrxiv',
        name: 'ThesisrXiv',
        advertiseOnDiscoverPage: true,
        preprintWord: 'thesis',
        assets: randomAssets(5),
        // eslint-disable-next-line max-len
        footerLinks: '<p style="text-align: left;" data-mce-style="text-align: left;">AgriXiv:&nbsp;<a href="mailto:support+agrixiv@osf.io" data-mce-href="mailto:support+agrixiv@osf.io">Support&nbsp;</a>|&nbsp;<a href="mailto:contact+agrixiv@osf.io" data-mce-href="mailto:contact+agrixiv@osf.io">Contact&nbsp;</a>|&nbsp;<a href="https://twitter.com/AgriXiv" target="_blank" title="AgriXiv on Twitter" rel="noopener" data-mce-href="https://twitter.com/AgriXiv"><span class="fa fa-twitter fa-2x" style="vertical-align: middle;" data-mce-style="vertical-align: middle;">&nbsp;</span></a>&nbsp;<a href="https://www.facebook.com/AgriXiv/" target="_blank" title="AgriXiv on Facebook" rel="noopener" data-mce-href="https://www.facebook.com/AgriXiv/"><span class="fa fa-facebook fa-2x" style="vertical-align: middle;" data-mce-style="vertical-align: middle;">&nbsp;</span></a>&nbsp;<a href="https://www.instagram.com/agrixiv/" target="_blank" title="AgriXiv on Instagram" rel="noopener" data-mce-href="https://www.instagram.com/agrixiv/"><span class="fa fa-2x fa-instagram" style="vertical-align: middle;" data-mce-style="vertical-align: middle;">&nbsp;</span></a><br data-mce-bogus="1"></p><p style="text-align: left;" data-mce-style="text-align: left;">arXiv is a trademark of Cornell University, used under license. This license should not be understood to indicate endorsement of content on AgriXiv by Cornell University or arXiv.</p>',
        allowSubmissions: true,
    },
    {
        id: 'workrxiv',
        name: 'WorkrXiv',
        advertiseOnDiscoverPage: true,
        preprintWord: 'work',
        assets: randomAssets(6),
        footerLinks: 'fake footer links',
        allowSubmissions: true,
    },
    {
        id: 'docrxiv',
        name: 'DocrXiv',
        advertiseOnDiscoverPage: true,
        preprintWord: 'default',
        assets: randomAssets(7),
        footerLinks: 'fake footer links',
        allowSubmissions: true,
    },
    {
        id: 'agrixiv',
        name: 'AgriXiv',
        advertiseOnDiscoverPage: true,
        preprintWord: 'preprint',
        assets: randomAssets(8),
        reviewsWorkflow: PreprintProviderReviewsWorkFlow.POST_MODERATION,
        allowSubmissions: true,
    },
    {
        id: 'biohackrxiv',
        name: 'BioHackrXiv',
        advertiseOnDiscoverPage: true,
        preprintWord: 'preprint',
        assets: randomAssets(9),
        allowSubmissions: true,
    },
    {
        id: 'nutrixiv',
        name: 'NutriXiv',
        advertiseOnDiscoverPage: true,
        preprintWord: 'preprint',
        assets: randomAssets(10),
        allowSubmissions: true,
    },
    {
        id: 'paleorxiv',
        name: 'PaleoRrxiv',
        advertiseOnDiscoverPage: true,
        preprintWord: 'preprint',
        assets: randomAssets(10, false),
        allowSubmissions: true,
    },
    {
        id: 'sportrxiv',
        name: 'Sport-Rxiv',
        advertiseOnDiscoverPage: true,
        preprintWord: 'paper',
        assets: randomAssets(10),
        allowSubmissions: true,
    },
];

export default preprintProviders;
