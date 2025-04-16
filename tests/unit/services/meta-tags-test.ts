import MetaTags,
{ HeadTagDef, MetaTagsData, NameMetaTagAttrs, PropMetaTagAttrs } from 'ember-osf-web/services/meta-tags';
import { setupTest } from 'ember-qunit';
import { TestContext } from 'ember-intl/test-support';
import { module, test } from 'qunit';

interface MetaTagsTestContext extends TestContext {
    service: MetaTags;
    formatHeadTags: (_: any) => {};
}

module('Unit | Service | meta-tags', hooks => {
    setupTest(hooks);

    hooks.beforeEach(async function(this: MetaTagsTestContext) {
        this.service = this.owner.lookup('service:meta-tags');

        this.formatHeadTags = (metaTags: MetaTagsData): HeadTagDef[] => this.service.getHeadTags(metaTags)
            .map((element: HeadTagDef) => {
                const attrs = element.attrs as NameMetaTagAttrs & PropMetaTagAttrs;
                if (attrs.name === 'citation_public_url'
                        || attrs.name === 'dct.identifier'
                        || attrs.property === 'og:url'
                        || attrs.property === 'og:secure_url'
                        || attrs.property === 'og:image'
                        || attrs.name === 'twitter:image'
                ) {
                    attrs.content = 'url-removed';
                }

                return element;
            });
    });


    test('it should handle getHeadTags without any contributors', function(this: MetaTagsTestContext, assert) {
        const metaTagsData = {
            title: 'preprintTitle',
        } as MetaTagsData;

        const headTags = this.formatHeadTags(metaTagsData);

        assert.deepEqual(headTags, [{
            attrs: {
                content: 'preprintTitle',
                name: 'citation_title',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'Open Science Framework',
                name: 'citation_publisher',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'Center for Open Science',
                name: 'citation_author_institution',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'Hosted on OSF',
                name: 'citation_description',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'url-removed',
                name: 'citation_public_url',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'preprintTitle',
                name: 'dct.title',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'article',
                name: 'dct.type',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'url-removed',
                name: 'dct.identifier',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'Hosted on OSF',
                name: 'dct.abstract',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'Open Science Framework',
                name: 'dc.publisher',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'en-us',
                name: 'dc.language',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: '1039002926217080',
                property: 'fb:app_id',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 345600,
                property: 'og:ttl',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'preprintTitle',
                property: 'og:title',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'article',
                property: 'og:type',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'Open Science Framework',
                property: 'og:site_name',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'url-removed',
                property: 'og:url',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'url-removed',
                property: 'og:secure_url',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'Hosted on OSF',
                property: 'og:description',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'url-removed',
                property: 'og:image',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'image/png',
                property: 'og:image:type',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 1200,
                property: 'og:image:width',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 630,
                property: 'og:image:height',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'Open Science Framework',
                property: 'og:image:alt',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'summary',
                name: 'twitter:card',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'OSFramework',
                name: 'twitter:site',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'OSFramework',
                name: 'twitter:creator',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'preprintTitle',
                name: 'twitter:title',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'Hosted on OSF',
                name: 'twitter:description',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'url-removed',
                name: 'twitter:image',
            },
            type: 'meta',
        },
        {
            attrs: {
                content: 'Open Science Framework',
                name: 'twitter:image:alt',
            },
            type: 'meta',
        },
        ]);
    });

    test('it should handle getHeadTags with any meta tags and single contributor',
        function(this: MetaTagsTestContext, assert) {
            const metaTagsData = {
                keywords: 'preprint.tags',
                contributors: Object({
                    givenName: 'taco',
                    familyName: 'bell',
                }),
            } as MetaTagsData;

            const headTags = this.formatHeadTags(metaTagsData);

            assert.deepEqual(headTags, [{
                attrs: {
                    content: 'Open Science Framework',
                    name: 'citation_publisher',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'Center for Open Science',
                    name: 'citation_author_institution',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'bell, taco',
                    name: 'citation_author',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'Hosted on OSF',
                    name: 'citation_description',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'url-removed',
                    name: 'citation_public_url',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'article',
                    name: 'dct.type',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'url-removed',
                    name: 'dct.identifier',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'Hosted on OSF',
                    name: 'dct.abstract',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'Open Science Framework',
                    name: 'dc.publisher',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'en-us',
                    name: 'dc.language',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'bell, taco',
                    name: 'dc.contributor',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'preprint.tags',
                    name: 'dc.subject',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: '1039002926217080',
                    property: 'fb:app_id',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 345600,
                    property: 'og:ttl',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'article',
                    property: 'og:type',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'Open Science Framework',
                    property: 'og:site_name',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'url-removed',
                    property: 'og:url',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'url-removed',
                    property: 'og:secure_url',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'Hosted on OSF',
                    property: 'og:description',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'url-removed',
                    property: 'og:image',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'image/png',
                    property: 'og:image:type',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 1200,
                    property: 'og:image:width',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 630,
                    property: 'og:image:height',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'Open Science Framework',
                    property: 'og:image:alt',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'summary',
                    name: 'twitter:card',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'OSFramework',
                    name: 'twitter:site',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'OSFramework',
                    name: 'twitter:creator',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'Hosted on OSF',
                    name: 'twitter:description',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'url-removed',
                    name: 'twitter:image',
                },
                type: 'meta',
            },
            {
                attrs: {
                    content: 'Open Science Framework',
                    name: 'twitter:image:alt',
                },
                type: 'meta',
            },
            {
                attrs: {
                    type: 'application/ld+json',
                },
                // eslint-disable-next-line max-len
                content: '{"@context":{"dc":"http://purl.org/dc/elements/1.1/","schema":"http://schema.org"},"@type":"schema:CreativeWork","contributor":[{"@type":"schema:Person","givenName":"taco","familyName":"bell"}]}',
                type: 'script',
            }]);
        });

    test('it should handle getHeadTags with any meta tags and multiple contributor',
        function(this: MetaTagsTestContext, assert) {
            const metaTagsData = {
                title: 'preprintTitle',
                description: 'preprint.description',
                publishedDate: 'moment(preprint.datePublished).format(\'YYYY-MM-DD\')',
                modifiedDate: 'moment(preprint.dateModified).format(\'YYYY-MM-DD\')',
                identifier: 'preprint.id',
                url: 'pathJoin(config.OSF.url, preprint.id)',
                doi: 'doi && doi.value',
                image: 'image-path',
                keywords: 'preprint.tags',
                siteName: 'OSF',
                license: 'license && (license as LicenseModel).name',
                contributors: [Object({
                    givenName: 'Taco',
                    familyName: 'Bell',
                }), Object({
                    givenName: 'Super',
                    familyName: 'User',
                }),
                ],
            } as MetaTagsData;

            const headTags = this.formatHeadTags(metaTagsData);

            assert.deepEqual(headTags, [
                {
                    attrs: {
                        content: 'preprintTitle',
                        name: 'citation_title',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'doi && doi.value',
                        name: 'citation_doi',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'OSF',
                        name: 'citation_publisher',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'Center for Open Science',
                        name: 'citation_author_institution',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'Bell, Taco',
                        name: 'citation_author',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'User, Super',
                        name: 'citation_author',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'preprint.description',
                        name: 'citation_description',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'url-removed',
                        name: 'citation_public_url',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: "moment(preprint.datePublished).format('YYYY-MM-DD')",
                        name: 'citation_publication_date',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'preprintTitle',
                        name: 'dct.title',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'article',
                        name: 'dct.type',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'url-removed',
                        name: 'dct.identifier',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'url-removed',
                        name: 'dct.identifier',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'url-removed',
                        name: 'dct.identifier',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'preprint.description',
                        name: 'dct.abstract',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'license && (license as LicenseModel).name',
                        name: 'dct.license',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: "moment(preprint.dateModified).format('YYYY-MM-DD')",
                        name: 'dct.modified',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: "moment(preprint.datePublished).format('YYYY-MM-DD')",
                        name: 'dct.created',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'OSF',
                        name: 'dc.publisher',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'en-us',
                        name: 'dc.language',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'Bell, Taco',
                        name: 'dc.contributor',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'User, Super',
                        name: 'dc.contributor',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'preprint.tags',
                        name: 'dc.subject',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: '1039002926217080',
                        property: 'fb:app_id',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 345600,
                        property: 'og:ttl',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'preprintTitle',
                        property: 'og:title',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'article',
                        property: 'og:type',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'OSF',
                        property: 'og:site_name',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'url-removed',
                        property: 'og:url',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'url-removed',
                        property: 'og:secure_url',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'preprint.description',
                        property: 'og:description',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'url-removed',
                        property: 'og:image',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'image/png',
                        property: 'og:image:type',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 1200,
                        property: 'og:image:width',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 630,
                        property: 'og:image:height',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'Open Science Framework',
                        property: 'og:image:alt',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'summary',
                        name: 'twitter:card',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'OSFramework',
                        name: 'twitter:site',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'OSFramework',
                        name: 'twitter:creator',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'preprintTitle',
                        name: 'twitter:title',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'preprint.description',
                        name: 'twitter:description',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'url-removed',
                        name: 'twitter:image',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        content: 'Open Science Framework',
                        name: 'twitter:image:alt',
                    },
                    type: 'meta',
                },
                {
                    attrs: {
                        type: 'application/ld+json',
                    },
                    // eslint-disable-next-line max-len
                    content: '{"@context":{"dc":"http://purl.org/dc/elements/1.1/","schema":"http://schema.org"},"@type":"schema:CreativeWork","contributor":[{"@type":"schema:Person","givenName":"Taco","familyName":"Bell"},{"@type":"schema:Person","givenName":"Super","familyName":"User"}]}',
                    type: 'script',
                },

            ]);
        });
});
