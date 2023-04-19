import { Request, Schema } from 'ember-cli-mirage';

export function recordSearch(_: Schema, __: Request) {
    // TODO: replace with a real metadata-record-search and use request to populate attrs
    return {
        data: {
            type: 'metadata-record-search',
            id: 'zzzzzz',
            attributes:{
                recordSearchText: 'hello',
                recordSearchFilter: [
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
                        type: 'metadata-property-search',
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
                    metadataRecord: {
                        data: {
                            type: 'metadata-record',
                            id: 'abc',
                        },
                        links: {
                            related: 'https://share.osf.io/api/v2/metadata-record/abc',
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
                    metadataRecord: {
                        data: {
                            type: 'metadata-record',
                            id: 'def',
                        },
                        links: {
                            related: 'https://share.osf.io/api/v2/metadata-record/def',
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
                    metadataRecord: {
                        data: {
                            type: 'metadata-record',
                            id: 'abc',
                        },
                        links: {
                            related: 'https://share.osf.io/api/v2/metadata-record/abc',
                        },
                    },
                },
            },
            {
                type: 'metadata-record',
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
                        // ...
                    },
                },
                links: {
                    self: 'https://share.osf.io/api/v2/metadata-record/abc',
                    resource: 'https://osf.example/abcfoo',
                },
            },
            {
                type: 'metadata-record',
                id: 'def',
            // ...
            },
            {
                type: 'metadata-record',
                id: 'ghi',
            // ...
            },
            // Related properties search object
            {
                type: 'metadata-property-search',
                id: 'tuv',
                attributes: {
                    recordSearchText: 'hello',
                    recordSearchFilter: [
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
                    metadataRecord: {
                        data: {
                            type: 'metadata-record',
                            id: 'idForPropertyRecord1',
                        },
                        links: {
                            related: 'https://share.osf.io/api/v2/metadata-record/idForPropertyRecord1',
                        },
                    },
                },
            },
            {
                type: 'search-result',
                id: 'propertyMatch2',
                // ...
            },
            {
                type: 'search-result',
                id: 'propertyMatch3',
                // ...
            },
            {
                type: 'metadata-record',
                id: 'idForPropertyRecord1',
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
                        // ...
                    },
                },
                links: {
                    self: 'https://share.osf.io/api/v2/metadata-record/idForPropertyRecord1',
                    resource: 'http://purl.org/dc/terms/license',
                },
            },
            {
                type: 'metadata-record',
                id: 'idForPropertyRecord2',
                // ...
            },
            {
                type: 'metadata-record',
                id: 'idForPropertyRecord3',
                // ...
            },
        ],
    };
}
