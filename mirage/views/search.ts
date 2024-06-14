import { Request, Schema } from 'ember-cli-mirage';
import faker from 'faker';

export function cardSearch(_: Schema, __: Request) {
    // TODO: replace with a real index-card-search and use request to populate attrs
    return {
        data: {
            type: 'index-card-search',
            id: 'zzzzzz',
            attributes:{
                cardSearchText: 'hello',
                cardSearchFilter: [
                    {
                        osfmapPropertyPath: 'resourceType',
                        filterType: 'eq',
                        filterValues: [
                            'osf:Registration',
                        ],
                    },
                    {
                        osfmapPropertyPath: 'subject',
                        filterType: 'eq',
                        filterValues: [
                            'https://subjects.org/subjectId',
                        ],
                    },
                ],
                totalResultCount: 3,
            },
            relationships: {
                searchResultPage: {
                    data: [
                        {
                            type: 'search-result',
                            id: 'abc',
                        },
                        {
                            type: 'search-result',
                            id: 'def',
                        },
                        {
                            type: 'search-result',
                            id: 'ghi',
                        },
                    ],
                    links: {
                        next: {
                            href: 'https://staging-share.osf.io/api/v3/index-card-search?page%5Bcursor%5D=lmnop',
                        },
                    },
                },
                relatedProperties: {
                    data: [
                        {
                            type: 'related-property-path',
                            id: 'propertyMatch1',
                        },
                        {
                            type: 'related-property-path',
                            id: 'propertyMatch2',
                        },
                        {
                            type: 'related-property-path',
                            id: 'propertyMatch3',
                        },
                    ],
                    links: {
                        next: {
                            href: 'https://staging-share.osf.io/api/v3/index-card-search?page%5Bcursor%5D=lmnop',
                        },
                    },
                },
            },
        },
        included: [
            {
                type: 'search-result',
                id: 'abc',
                attributes: {
                    matchEvidence: [
                        {
                            '@type': ['https://share.osf.io/vocab/2023/trove/TextMatchEvidence'],
                            osfmapPropertyPath: 'description',
                            matchingHighlight: '... say <em>hello</em>!',
                        },
                        {
                            '@type': ['https://share.osf.io/vocab/2023/trove/TextMatchEvidence'],
                            osfmapPropertyPath: 'title',
                            matchingHighlight: '... shout <em>hello</em>!',
                        },
                    ],
                },
                relationships: {
                    indexCard: {
                        data: {
                            type: 'index-card',
                            id: 'abc',
                        },
                        links: {
                            related: 'https://share.osf.io/api/v2/index-card/abc',
                        },
                    },
                },
            },
            {
                type: 'search-result',
                id: 'def',
                attributes: {
                    matchEvidence: [
                        {
                            '@type': ['https://share.osf.io/vocab/2023/trove/TextMatchEvidence'],
                            osfmapPropertyPath: 'description',
                            matchingHighlight: '... computer said <em>hello</em> world!',
                        },
                    ],
                },
                relationships: {
                    indexCard: {
                        data: {
                            type: 'index-card',
                            id: 'def',
                        },
                        links: {
                            related: 'https://share.osf.io/api/v2/index-card/def',
                        },
                    },
                },
            },
            {
                type: 'search-result',
                id: 'ghi',
                attributes: {
                    matchEvidence: [
                        {
                            '@type': ['https://share.osf.io/vocab/2023/trove/TextMatchEvidence'],
                            osfmapPropertyPath: 'title',
                            matchingHighlight: '... you said <em>hello</em>!',
                        },
                    ],
                },
                relationships: {
                    indexCard: {
                        data: {
                            type: 'index-card',
                            id: 'ghi',
                        },
                        links: {
                            related: 'https://share.osf.io/api/v2/index-card/abc',
                        },
                    },
                },
            },
            {
                type: 'index-card',
                id: 'abc',
                attributes: {
                    resourceIdentifier: [
                        'https://osf.example/abcfoo',
                        'https://doi.org/10.0000/osf.example/abcfoo',
                    ],
                    resourceMetadata: {
                        resourceType: [
                            'osf:Registration',
                            'dcterms:Dataset',
                        ],
                        '@id': 'https://osf.example/abcfoo',
                        '@type': 'osf:Registration',
                        title: [
                            {
                                '@value': 'I shout hello!',
                                '@language': 'en',
                            },
                        ],
                        description: [
                            {
                                '@value': 'I say hello!',
                                '@language': 'en',
                            },
                        ],
                        isPartOf: [
                            {
                                '@id': 'https://osf.example/xyzfoo',
                                '@type': 'osf:Registration',
                                title: [
                                    {
                                        '@value': 'a parent!',
                                        '@language': 'en',
                                    },
                                ],
                            },
                        ],
                        hasPart: [
                            {
                                '@id': 'https://osf.example/deffoo',
                                '@type': 'osf:Registration',
                                title: [
                                    {
                                        '@value': 'a child!',
                                        '@language': 'en',
                                    },
                                ],
                            },
                            {
                                '@id': 'https://osf.example/ghifoo',
                                '@type': 'osf:Registration',
                                title: [
                                    {
                                        '@value': 'another child!',
                                        '@language': 'en',
                                    },
                                ],
                            },
                        ],
                        subject: [
                            {
                                '@id': 'https://subjects.org/subjectId',
                                '@type': 'dcterms:Subject',
                                label: [
                                    {
                                        '@value': 'wibbleplop',
                                        '@language': 'wi-bl',
                                    },
                                ],
                            },
                        ],
                        creator: [{
                            '@id': 'https://osf.example/person',
                            '@type': 'dcterms:Agent',
                            specificType: 'foaf:Person',
                            name: 'person person, prsn',
                        }],
                    },
                },
                links: {
                    self: 'https://share.osf.io/api/v2/index-card/abc',
                    resource: 'https://osf.example/abcfoo',
                },
            },
            {
                type: 'index-card',
                id: 'def',
                attributes: {
                    resourceIdentifier: [
                        'https://osf.example/abcfoo',
                        'https://doi.org/10.0000/osf.example/abcfoo',
                    ],
                    resourceMetadata: {
                        resourceType: [
                            'osf:Registration',
                            'dcterms:Dataset',
                        ],
                        '@id': 'https://osf.example/abcfoo',
                        '@type': 'osf:Registration',
                        title: [
                            {
                                '@value': 'Hi!',
                                '@language': 'en',
                            },
                        ],
                    },
                },
                links: {
                    self: 'https://share.osf.io/api/v2/index-card/ghi',
                    resource: 'https://osf.example/abcfoo',
                },
            },
            {
                type: 'index-card',
                id: 'ghi',
                attributes: {
                    resourceIdentifier: [
                        'https://osf.example/abcfoo',
                        'https://doi.org/10.0000/osf.example/abcfoo',
                    ],
                    resourceMetadata: {
                        resourceType: [
                            'osf:Registration',
                            'dcterms:Dataset',
                        ],
                        '@id': 'https://osf.example/abcfoo',
                        '@type': 'osf:Registration',
                        title: [
                            {
                                '@value': 'Ahoj! That\'s hello in Czech!',
                                '@language': 'en',
                            },
                        ],
                        description: [
                            {
                                '@value': 'Some description',
                                '@language': 'en',
                            },
                        ],
                    },
                },
                links: {
                    self: 'https://share.osf.io/api/v2/index-card/ghi',
                    resource: 'https://osf.example/abcfoo',
                },
            },
            // Related properties
            {
                type: 'related-property-path',
                id: 'propertyMatch1',
                attributes: {
                    propertyPathKey: 'rights',
                    matchEvidence: [
                        {
                            '@type': ['https://share.osf.io/vocab/2023/trove/IriMatchEvidence'],
                            osfmapPropertyPath: 'resourceType',
                            matchingIri: 'rdf:Property',
                        },
                    ],
                    cardSearchResultCount: 345,
                    propertyPath: [
                        {
                            '@id': 'http://purl.org/dc/terms/license',
                            resourceType: [
                                {
                                    '@id': 'Property',
                                },
                            ],
                            displayLabel: [
                                {
                                    '@value': 'License',
                                    '@language': 'en',
                                },
                            ],
                            shortFormLabel: [
                                {
                                    '@value': 'rights',
                                    '@language': 'en',
                                },
                            ],
                        },
                    ],
                    suggestedFilterOperator: 'any-of',
                },
            },
            {
                type: 'related-property-path',
                id: 'propertyMatch2',
                attributes: {
                    propertyPathKey: 'datePublished',
                    matchEvidence: [
                        {
                            '@type': ['https://share.osf.io/vocab/2023/trove/IriMatchEvidence'],
                            osfmapPropertyPath: 'resourceType',
                            matchingIri: 'rdf:Property',
                        },
                    ],
                    cardSearchResultCount: 123,
                    propertyPath: [
                        {
                            '@id': 'http://purl.org/dc/terms/published',
                            resourceType: [
                                {
                                    '@id': 'Property',
                                },
                            ],
                            displayLabel: [
                                {
                                    '@value': 'Date Published',
                                    '@language': 'en',
                                },
                            ],
                            shortFormLabel: [
                                {
                                    '@value': 'datePublished',
                                    '@language': 'en',
                                },
                            ],
                        },
                    ],
                    suggestedFilterOperator: 'any-of',
                },
            },
            {
                type: 'related-property-path',
                id: 'propertyMatch3',
                attributes: {
                    propertyPathKey: 'funder',
                    matchEvidence: [
                        {
                            '@type': ['https://share.osf.io/vocab/2023/trove/IriMatchEvidence'],
                            osfmapPropertyPath: 'resourceType',
                            matchingIri: 'rdf:Property',
                        },
                    ],
                    cardSearchResultCount: 33,
                    propertyPath: [
                        {
                            '@id': 'http://purl.org/dc/terms/funder',
                            resourceType: [
                                {
                                    '@id': 'Property',
                                },
                            ],
                            displayLabel: [
                                {
                                    '@value': 'Funder',
                                    '@language': 'en',
                                },
                            ],
                            shortFormLabel: [
                                {
                                    '@value': 'funder',
                                    '@language': 'en',
                                },
                            ],
                        },
                    ],
                    suggestedFilterOperator: 'any-of',
                },
            },
        ],
    };
}

export function valueSearch(_: Schema, __: Request) {
    const property1Id = faker.random.uuid();
    const property2Id = faker.random.uuid();
    return {
        data: {
            type: 'index-value-search',
            id: 'lmnop',
            attributes: {
                valueSearchText: 'Institute of Health',
                valueSearchFilter: [
                    {
                        osfmapPropertyPath: 'resourceType',
                        filterType: 'eq',
                        filterValues: ['datacite:Funder'],
                    },
                ],
                cardSearchText: 'influenza',
                cardSearchFilter: [
                    {
                        osfmapPropertyPath: 'resourceType',
                        filterType: 'eq',
                        filterValues: ['datacite:Dataset'],
                    },
                ],
                totalResultCount: 2,
            },
            relationships: {
                searchResultPage: {
                    data: [
                        {type: 'search-result', id: property1Id},
                        {type: 'search-result', id: property2Id},
                    ],
                    links: {
                        next: {
                            href: 'https://staging-share.osf.io/api/v3/index-value-search?page%5Bcursor%5D=lmnop',
                        },
                    },
                },
            },
        },
        included: [
            {
                type: 'search-result',
                id: property1Id,
                attributes: {
                    matchEvidence: [
                        {
                            '@type': ['https://share.osf.io/vocab/2023/trove/TextMatchEvidence'],
                            osfmapPropertyPath: 'title',
                            matchingHighlight: 'National <em>Institute of Health</em>',
                        },
                    ],
                    cardSearchResultCount: 3,
                },
                relationships: {
                    indexCard: {
                        data: {type: 'index-card', id: property1Id},
                        links: {related: 'https://share.osf.example/index-card/abc'},
                    },
                },
            },
            {
                type: 'search-result',
                id: property2Id,
                attributes: {
                    matchEvidence: [
                        {
                            '@type': ['https://share.osf.io/vocab/2023/trove/TextMatchEvidence'],
                            osfmapPropertyPath: 'title',
                            matchingHighlight: 'Virginia <em>Institute of Health</em>',
                        },
                    ],
                    cardSearchResultCount: 2,
                },
                relationships: {
                    indexCard: {
                        data: {type: 'index-card', id: property2Id},
                        links: {related: 'https://share.osf.example/index-card/def'},
                    },
                },
            },
            {
                type: 'index-card',
                id: property1Id,
                attributes: {
                    resourceType: 'osf:Funder',
                    resourceIdentifier: 'http://dx.doi.org/10.10000/505000005050',
                    resourceMetadata: {
                        '@id': 'http://dx.doi.org/10.10000/505000005050',
                        '@type': 'datacite:Funder',
                        title: [{'@value': faker.lorem.words(3), '@language':'en'}],
                    },
                },
            },
            {
                type: 'index-card',
                id: property2Id,
                attributes: {
                    resourceType: 'osf:Funder',
                    resourceIdentifier: 'https://doi.org/10.10000/100000001',
                    resourceMetadata: {
                        '@id': 'http://dx.doi.org/10.10000/100000001',
                        '@type': 'datacite:Funder',
                        title: [{'@value':faker.lorem.word(), '@language':'en'}],
                    },
                },
            },
        ],
    };
}
