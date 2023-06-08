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
                        propertyPath: 'resourceType',
                        filterType: 'eq',
                        filterValues: [
                            'osf:Registration',
                        ],
                    },
                    {
                        propertyPath: 'subject',
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
                        next: '...',
                        last: '...',
                    },
                },
                relatedPropertySearch: {
                    data: {
                        type: 'index-property-search',
                        id: 'tuv',
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
                            propertyPath: 'description',
                            matchingHighlight: '... say <em>hello</em>!',
                        },
                        {
                            propertyPath: 'title',
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
                            propertyPath: 'description',
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
                            propertyPath: 'title',
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
                    resourceType: [
                        'osf:Registration',
                        'dcterms:Dataset',
                    ],
                    resourceIdentifier: [
                        'https://osf.example/abcfoo',
                        'https://doi.org/10.0000/osf.example/abcfoo',
                    ],
                    resourceMetadata: {
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
                        creator: {
                            '@id': 'https://osf.example/person',
                            '@type': 'dcterms:Agent',
                            specificType: 'foaf:Person',
                            name: 'person person, prsn',
                        },
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
                    resourceType: [
                        'osf:Registration',
                        'dcterms:Dataset',
                    ],
                    resourceIdentifier: [
                        'https://osf.example/abcfoo',
                        'https://doi.org/10.0000/osf.example/abcfoo',
                    ],
                    resourceMetadata: {
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
                    resourceType: [
                        'osf:Registration',
                        'dcterms:Dataset',
                    ],
                    resourceIdentifier: [
                        'https://osf.example/abcfoo',
                        'https://doi.org/10.0000/osf.example/abcfoo',
                    ],
                    resourceMetadata: {
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
            // Related properties search object
            {
                type: 'index-property-search',
                id: 'tuv',
                attributes: {
                    cardSearchText: 'hello',
                    cardSearchFilter: [
                        {
                            propertyPath: 'resourceType',
                            filterType: 'eq',
                            filterValues: [
                                'osf:Registration',
                            ],
                        },
                        {
                            propertyPath: 'subject',
                            filterType: 'eq',
                            filterValues: [
                                'https://subjects.org/subjectId',
                            ],
                        },
                    ],
                    propertySearchText: '',
                    propertySearchFilter: [
                        {
                            propertyPath: 'resourceType',
                            filterType: 'eq',
                            filterValues: [
                                'rdf:Property',
                            ],
                        },
                    ],
                },
                relationships: {
                    searchResultPage: {
                        data: [
                            {
                                type: 'search-result',
                                id: 'propertyMatch1',
                            },
                            {
                                type: 'search-result',
                                id: 'propertyMatch2',
                            },
                            {
                                type: 'search-result',
                                id: 'propertyMatch3',
                            },
                            {
                                type: 'search-result',
                                id: 'propertyMatch4',
                            },
                            {
                                type: 'search-result',
                                id: 'propertyMatch5',
                            },
                            {
                                type: 'search-result',
                                id: 'propertyMatch6',
                            },
                            {
                                type: 'search-result',
                                id: 'propertyMatch7',
                            },
                            {
                                type: 'search-result',
                                id: 'propertyMatch8',
                            },
                        ],
                        links: {
                            next: '...',
                            last: '...',
                        },
                    },
                },
            },
            {
                type: 'search-result',
                id: 'propertyMatch1',
                attributes: {
                    matchEvidence: [
                        {
                            propertyPath: 'resourceType',
                            matchingIri: 'rdf:Property',
                        },
                    ],
                    recordResultCount: 345,
                },
                relationships: {
                    indexCard: {
                        data: {
                            type: 'index-card',
                            id: 'idForPropertyRecord1',
                        },
                        links: {
                            related: 'https://share.osf.io/api/v2/index-card/idForPropertyRecord1',
                        },
                    },
                },
            },
            {
                type: 'search-result',
                id: 'propertyMatch2',
                attributes: {
                    matchEvidence: [
                        {
                            propertyPath: 'resourceType',
                            matchingIri: 'rdf:Property',
                        },
                    ],
                    recordResultCount: 123,
                },
                relationships: {
                    indexCard: {
                        data: {
                            type: 'index-card',
                            id: 'idForPropertyRecord2',
                        },
                        links: {
                            related: 'https://share.osf.io/api/v2/index-card/idForPropertyRecord2',
                        },
                    },
                },
            },
            {
                type: 'search-result',
                id: 'propertyMatch3',
                attributes: {
                    matchEvidence: [
                        {
                            propertyPath: 'resourceType',
                            matchingIri: 'rdf:Property',
                        },
                    ],
                    recordResultCount: 33,
                },
                relationships: {
                    indexCard: {
                        data: {
                            type: 'index-card',
                            id: 'idForPropertyRecord3',
                        },
                        links: {
                            related: 'https://share.osf.io/api/v2/index-card/idForPropertyRecord3',
                        },
                    },
                },
            },
            {
                type: 'search-result',
                id: 'propertyMatch4',
                attributes: {
                    matchEvidence: [
                        {
                            propertyPath: 'resourceType',
                            matchingIri: 'rdf:Property',
                        },
                    ],
                    recordResultCount: 33,
                },
                relationships: {
                    indexCard: {
                        data: {
                            type: 'index-card',
                            id: 'idForPropertyRecord4',
                        },
                        links: {
                            related: 'https://share.osf.io/api/v2/index-card/idForPropertyRecord4',
                        },
                    },
                },
            },
            {
                type: 'search-result',
                id: 'propertyMatch5',
                attributes: {
                    matchEvidence: [
                        {
                            propertyPath: 'resourceType',
                            matchingIri: 'rdf:Property',
                        },
                    ],
                    recordResultCount: 33,
                },
                relationships: {
                    indexCard: {
                        data: {
                            type: 'index-card',
                            id: 'idForPropertyRecord5',
                        },
                        links: {
                            related: 'https://share.osf.io/api/v2/index-card/idForPropertyRecord5',
                        },
                    },
                },
            },
            {
                type: 'search-result',
                id: 'propertyMatch6',
                attributes: {
                    matchEvidence: [
                        {
                            propertyPath: 'resourceType',
                            matchingIri: 'rdf:Property',
                        },
                    ],
                    recordResultCount: 33,
                },
                relationships: {
                    indexCard: {
                        data: {
                            type: 'index-card',
                            id: 'idForPropertyRecord6',
                        },
                        links: {
                            related: 'https://share.osf.io/api/v2/index-card/idForPropertyRecord6',
                        },
                    },
                },
            },
            {
                type: 'search-result',
                id: 'propertyMatch7',
                attributes: {
                    matchEvidence: [
                        {
                            propertyPath: 'resourceType',
                            matchingIri: 'rdf:Property',
                        },
                    ],
                    recordResultCount: 33,
                },
                relationships: {
                    indexCard: {
                        data: {
                            type: 'index-card',
                            id: 'idForPropertyRecord7',
                        },
                        links: {
                            related: 'https://share.osf.io/api/v2/index-card/idForPropertyRecord7',
                        },
                    },
                },
            },
            {
                type: 'search-result',
                id: 'propertyMatch8',
                attributes: {
                    matchEvidence: [
                        {
                            propertyPath: 'resourceType',
                            matchingIri: 'rdf:Property',
                        },
                    ],
                    recordResultCount: 33,
                },
                relationships: {
                    indexCard: {
                        data: {
                            type: 'index-card',
                            id: 'idForPropertyRecord8',
                        },
                        links: {
                            related: 'https://share.osf.io/api/v2/index-card/idForPropertyRecord8',
                        },
                    },
                },
            },
            {
                type: 'index-card',
                id: 'idForPropertyRecord1',
                attributes: {
                    resourceType: [
                        'rdf:Property',
                    ],
                    resourceIdentifier: [
                        'http://purl.org/dc/terms/published',
                    ],
                    resourceMetadata: {
                        '@id': 'http://purl.org/dc/terms/published',
                        '@type': 'rdf:Property',
                        label: [
                            {
                                '@value': 'Date Created',
                                '@language': 'en',
                            },
                        ],
                        description: [
                            {
                                '@value': 'Some description about date created in this case',
                                '@language': 'en',
                            },
                        ],
                    },
                },
                links: {
                    self: 'https://share.osf.io/api/v2/index-card/idForPropertyRecord1',
                    resource: 'http://purl.org/dc/terms/published',
                },
            },
            {
                type: 'index-card',
                id: 'idForPropertyRecord2',
                attributes: {
                    resourceType: [
                        'rdf:Property',
                    ],
                    resourceIdentifier: [
                        'http://purl.org/dc/terms/funder',
                    ],
                    resourceMetadata: {
                        '@id': 'http://purl.org/dc/terms/funder',
                        '@type': 'rdf:Property',
                        label: [
                            {
                                '@value': 'Funder',
                                '@language': 'en',
                            },
                        ],
                        description: [
                            {
                                '@value': 'Some description about funder in this case',
                                '@language': 'en',
                            },
                        ],
                    },
                },
                links: {
                    self: 'https://share.osf.io/api/v2/index-card/idForPropertyRecord2',
                    resource: 'http://purl.org/dc/terms/funder',
                },
            },
            {
                type: 'index-card',
                id: 'idForPropertyRecord3',
                attributes: {
                    resourceType: [
                        'rdf:Property',
                    ],
                    resourceIdentifier: [
                        'http://purl.org/dc/terms/subject',
                    ],
                    resourceMetadata: {
                        '@id': 'http://purl.org/dc/terms/subject',
                        '@type': 'rdf:Property',
                        label: [
                            {
                                '@value': 'Subject',
                                '@language': 'en',
                            },
                        ],
                        description: [
                            {
                                '@value': 'Some description about subject in this case',
                                '@language': 'en',
                            },
                        ],
                    },
                },
                links: {
                    self: 'https://share.osf.io/api/v2/index-card/idForPropertyRecord3',
                    resource: 'http://purl.org/dc/terms/subject',
                },
            },
            {
                type: 'index-card',
                id: 'idForPropertyRecord4',
                attributes: {
                    resourceType: [
                        'rdf:Property',
                    ],
                    resourceIdentifier: [
                        'http://purl.org/dc/terms/license',
                    ],
                    resourceMetadata: {
                        '@id': 'http://purl.org/dc/terms/license',
                        '@type': 'rdf:Property',
                        label: [
                            {
                                '@value': 'License',
                                '@language': 'en',
                            },
                        ],
                        description: [
                            {
                                '@value': 'Some description about license in this case',
                                '@language': 'en',
                            },
                        ],
                    },
                },
                links: {
                    self: 'https://share.osf.io/api/v2/index-card/idForPropertyRecord4',
                    resource: 'http://purl.org/dc/terms/license',
                },
            },
            {
                type: 'index-card',
                id: 'idForPropertyRecord5',
                attributes: {
                    resourceType: [
                        'rdf:Property',
                    ],
                    resourceIdentifier: [
                        'http://purl.org/dc/terms/resourceType',
                    ],
                    resourceMetadata: {
                        '@id': 'http://purl.org/dc/terms/resourceType',
                        '@type': 'rdf:Property',
                        label: [
                            {
                                '@value': 'Resource Type',
                                '@language': 'en',
                            },
                        ],
                        description: [
                            {
                                '@value': 'Some description about resource type in this case',
                                '@language': 'en',
                            },
                        ],
                    },
                },
                links: {
                    self: 'https://share.osf.io/api/v2/index-card/idForPropertyRecord5',
                    resource: 'http://purl.org/dc/terms/resourceType',
                },
            },
            {
                type: 'index-card',
                id: 'idForPropertyRecord6',
                attributes: {
                    resourceType: [
                        'rdf:Property',
                    ],
                    resourceIdentifier: [
                        'http://purl.org/dc/terms/collection',
                    ],
                    resourceMetadata: {
                        '@id': 'http://purl.org/dc/terms/collection',
                        '@type': 'rdf:Property',
                        label: [
                            {
                                '@value': 'Collection',
                                '@language': 'en',
                            },
                        ],
                        description: [
                            {
                                '@value': 'Some description about collection in this case',
                                '@language': 'en',
                            },
                        ],
                    },
                },
                links: {
                    self: 'https://share.osf.io/api/v2/index-card/idForPropertyRecord6',
                    resource: 'http://purl.org/dc/terms/collection',
                },
            },
            {
                type: 'index-card',
                id: 'idForPropertyRecord7',
                attributes: {
                    resourceType: [
                        'rdf:Property',
                    ],
                    resourceIdentifier: [
                        'http://purl.org/dc/terms/institution',
                    ],
                    resourceMetadata: {
                        '@id': 'http://purl.org/dc/terms/institution',
                        '@type': 'rdf:Property',
                        label: [
                            {
                                '@value': 'Institution',
                                '@language': 'en',
                            },
                        ],
                        description: [
                            {
                                '@value': 'Some description about institution in this case',
                                '@language': 'en',
                            },
                        ],
                    },
                },
                links: {
                    self: 'https://share.osf.io/api/v2/index-card/idForPropertyRecord7',
                    resource: 'http://purl.org/dc/terms/institution',
                },
            },
            {
                type: 'index-card',
                id: 'idForPropertyRecord8',
                attributes: {
                    resourceType: [
                        'rdf:Property',
                    ],
                    resourceIdentifier: [
                        'http://purl.org/dc/terms/registry',
                    ],
                    resourceMetadata: {
                        '@id': 'http://purl.org/dc/terms/registry',
                        '@type': 'rdf:Property',
                        label: [
                            {
                                '@value': 'Registry',
                                '@language': 'en',
                            },
                        ],
                        description: [
                            {
                                '@value': 'Some description about registry in this case',
                                '@language': 'en',
                            },
                        ],
                    },
                },
                links: {
                    self: 'https://share.osf.io/api/v2/index-card/idForPropertyRecord8',
                    resource: 'http://purl.org/dc/terms/registry',
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
                        propertyPath: 'resourceType',
                        filterType: 'eq',
                        filterValues: ['datacite:Funder'],
                    },
                ],
                cardSearchText: 'influenza',
                cardSearchFilter: [
                    {
                        propertyPath: 'resourceType',
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
                        next: '...',
                        last: '...',
                    },
                },
                relatedPropertySearch: {
                    data: {type: 'index-property-search', id: '12345'},
                },
            },
        },
        included: [
            {
                type: 'search-result',
                id: property1Id,
                attributes: {
                    matchEvidence: [
                        {propertyPath: 'title', matchingHighlight: 'National <em>Institute of Health</em>'},
                    ],
                    recordResultCount: 2134,
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
                        {propertyPath: 'title', matchingHighlight: 'Virginia <em>Institute of Health</em>'},
                    ],
                    recordResultCount: 2,
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
