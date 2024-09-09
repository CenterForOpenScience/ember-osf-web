import { Request, Schema } from 'ember-cli-mirage';
import faker from 'faker';
import { PaginationLinks } from 'jsonapi-typescript';

import { ShareResourceTypes } from 'ember-osf-web/models/index-card';

const rdfString = 'https://www.w3.org/1999/02/22-rdf-syntax-ns#string';
const resourceMetadataByType: Partial<Record<ShareResourceTypes, any>> = {
    Registration: () => ({
        '@id': faker.random.uuid(),
        // accessService: [{}],
        archivedAt: [{}], // archive.org URL
        conformsTo: [{ // Registration Schema
            '@id': 'https://api.osf.io/v2/schemas/registrations/564d31db8c5e4a7c9694b2be/',
            title: [{
                '@value': 'Open-Ended Registration',
                '@type': rdfString,
            }],
        }],
        creator: [{
            '@id': faker.internet.url(),
            resourceType: [{ '@id': ShareResourceTypes.Person }, { '@id': ShareResourceTypes.Agent }],
            identifier: [{
                '@value': 'https://orcid.org/0000-0000-0000-0000',
                '@type': rdfString,
            }],
            name: [{
                '@value': faker.name.findName(),
                '@type': rdfString,
            }],
        }],
        dateAvailable: [{
            '@value': _randomPastYearMonthDay(),
            '@type': rdfString,
        }],
        dateCopyrighted: [{
            '@value': _randomPastYearMonthDay(),
            '@type': rdfString,
        }],
        dateCreated: [{
            '@value': _randomPastYearMonthDay(),
            '@type': rdfString,
        }],
        dateModified: [{
            '@value': _randomPastYearMonthDay(),
            '@type': rdfString,
        }],
        description: [{
            '@value': faker.lorem.sentence(),
            '@type': rdfString,
        }],
        hasPart: [{}], // RegistrationComponent
        hostingInstition: [{
            '@id': faker.internet.url(),
            resourceType: [{ '@id': ShareResourceTypes.Agent }, { '@id': ShareResourceTypes.Organization }],
            identifier: [{
                '@value': faker.internet.url(),
                '@type': rdfString,
            }],
            name: [{
                '@value': faker.company.companyName(),
                '@type': rdfString,
            }],
            // sameAs: [{}], // some ROR
        }],
        identifier: [{
            '@value': faker.internet.url(),
            '@type': rdfString,
        }],
        isVersionOf: [{}], // if this is from a project
        keyword: [{ // tags
            '@value': faker.random.word(),
            '@type': rdfString,
        }],
        publisher: [{ // Registration Provider
            '@id': faker.internet.url(),
            resourceType: [{ '@id': ShareResourceTypes.Organization }, { '@id': ShareResourceTypes.Agent }],
            identifier: [{
                '@value': faker.internet.url(),
                '@type': rdfString,
            }],
            name: [{
                '@value': faker.company.companyName(),
                '@type': rdfString,
            }],
        }],
        resourceNature: [{ // Registration Category
            '@id': 'https://schema.datacite.org/meta/kernel-4/#StudyRegistration',
            displayLabel: [{
                '@value': 'StudyRegistration',
                '@language': 'en',
            }],
        }],
        resourceType: [{ '@id': 'Registration' }],
        rights: [{ // License
            '@id': 'http://creativecommons.org/licenses/by/4.0/',
            identifier: [{
                '@value': 'http://creativecommons.org/licenses/by/4.0/',
                '@type': rdfString,
            }],
            name: [{
                '@value': 'CC-BY-4.0',
                '@type': rdfString,
            }],
        }],
        sameAs: [{}], // some DOI
        subject: [{
            '@id': 'https://api.osf.io/v2/subjects/584240da54be81056cecac48',
            resourceType: [{ '@id': ShareResourceTypes.Concept }],
            inScheme: [{
                '@id': 'https://api.osf.io/v2/schemas/subjects/',
                resourceType: [{ '@id': ShareResourceTypes.ConceptScheme }],
                title: [{
                    '@value': 'bepress Digital Commons Three-Tiered Taxonomy',
                    '@type': rdfString,
                }],
            }],
            prefLabel: [{
                '@value': 'Social and Behavioral Sciences',
                '@type': rdfString,
            }],
        }],
        title: [{
            '@value': faker.lorem.words(3),
            '@type': rdfString,
        }],
    }),
    Project: () => ({
        '@id': faker.internet.url(),
        // accessService: [{}],
        creator: [{
            '@id': faker.internet.url(),
            resourceType: [{ '@id': ShareResourceTypes.Person }, { '@id': ShareResourceTypes.Agent }],
            identifier: [{
                '@value': 'https://orcid.org/0000-0000-0000-0000',
                '@type': rdfString,
            }],
            name: [{
                '@value': faker.name.findName(),
                '@type': rdfString,
            }],
        }],
        dateCopyrighted: [{
            '@value': _randomPastYearMonthDay(),
            '@type': rdfString,
        }],
        dateCreated: [{
            '@value': _randomPastYearMonthDay(),
            '@type': rdfString,
        }],
        dateModified: [{
            '@value': _randomPastYearMonthDay(),
            '@type': rdfString,
        }],
        description: [{
            '@value': faker.lorem.sentence(),
            '@type': rdfString,
        }],
        hasPart: [{}], // ProjectComponent
        hostingInstition: [{
            '@id': faker.internet.url(),
            resourceType: [{ '@id': ShareResourceTypes.Agent }, { '@id': ShareResourceTypes.Organization }],
            identifier: [{
                '@value': faker.internet.url(),
                '@type': rdfString,
            }],
            name: [{
                '@value': faker.company.companyName(),
                '@type': rdfString,
            }],
            // sameAs: [{}], // some ROR
        }],
        identifier: [{
            '@value': faker.internet.url(),
            '@type': rdfString,
        }],
        keyword: [{ // tags
            '@value': faker.random.word(),
            '@type': rdfString,
        }],
        publisher: [{ // Project Provider
            '@id': faker.internet.url(),
            resourceType: [{ '@id': ShareResourceTypes.Organization }, { '@id': ShareResourceTypes.Agent }],
            identifier: [{
                '@value': faker.internet.url(),
                '@type': rdfString,
            }],
            name: [{
                '@value': faker.company.companyName(),
                '@type': rdfString,
            }],
        }],
        resourceType: [{ '@id': 'Project' }],
        rights: [{ // License
            '@id': 'http://creativecommons.org/licenses/by/4.0/',
            identifier: [{
                '@value': 'http://creativecommons.org/licenses/by/4.0/',
                '@type': rdfString,
            }],
            name: [{
                '@value': 'CC-BY-4.0',
                '@type': rdfString,
            }],
        }],
        sameAs: [{}], // some DOI
        subject: [{
            '@id': 'https://api.osf.io/v2/subjects/584240da54be81056cecac48',
            resourceType: [{ '@id': ShareResourceTypes.Concept }],
            inScheme: [{
                '@id': 'https://api.osf.io/v2/schemas/subjects/',
                resourceType: [{ '@id': ShareResourceTypes.ConceptScheme }],
                title: [{
                    '@value': 'bepress Digital Commons Three-Tiered Taxonomy',
                    '@type': rdfString,
                }],
            }],
            prefLabel: [{
                '@value': 'Social and Behavioral Sciences',
                '@type': rdfString,
            }],
        }],
        title: [{
            '@value': faker.lorem.words(3),
            '@type': rdfString,
        }],
    }),
    Preprint: () => ({
        '@id': faker.internet.url(),
        // accessService: [{}],
        creator: [{
            '@id': faker.internet.url(),
            resourceType: [{ '@id': ShareResourceTypes.Person }, { '@id': ShareResourceTypes.Agent }],
            identifier: [{
                '@value': 'https://orcid.org/0000-0000-0000-0000',
                '@type': rdfString,
            }],
            name: [{
                '@value': faker.name.findName(),
                '@type': rdfString,
            }],
        }],
        dateAccepted: [{
            '@value': _randomPastYearMonthDay(),
            '@type': rdfString,
        }],
        dateCopyrighted: [{
            '@value': _randomPastYearMonthDay(),
            '@type': rdfString,
        }],
        dateCreated: [{
            '@value': _randomPastYearMonthDay(),
            '@type': rdfString,
        }],
        dateSubmitted: [{
            '@value': _randomPastYearMonthDay(),
            '@type': rdfString,
        }],
        dateModified: [{
            '@value': _randomPastYearMonthDay(),
            '@type': rdfString,
        }],
        description: [{
            '@value': faker.lorem.sentence(),
            '@type': rdfString,
        }],
        hasPart: [{}], // File
        hostingInstition: [{
            '@id': faker.internet.url(),
            resourceType: [{ '@id': ShareResourceTypes.Agent }, { '@id': ShareResourceTypes.Organization }],
            identifier: [{
                '@value': faker.internet.url(),
                '@type': rdfString,
            }],
            name: [{
                '@value': faker.company.companyName(),
                '@type': rdfString,
            }],
            // sameAs: [{}], // some ROR
        }],
        identifier: [{
            '@value': faker.internet.url(),
            '@type': rdfString,
        }],
        // isSupplementedBy: [{}], // if this links a project
        keyword: [{ // tags
            '@value': faker.random.word(),
            '@type': rdfString,
        }],
        omits: [{
            ommittedMetadataProperty: [
                { '@id': 'hasPreregisteredStudyDesign' },
                { '@id': 'hasPreregisteredAnalysisPlan' },
            ],
        }],
        publisher: [{ // Preprint Provider
            '@id': faker.internet.url(),
            resourceType: [{ '@id': ShareResourceTypes.Organization }, { '@id': ShareResourceTypes.Agent }],
            identifier: [{
                '@value': faker.internet.url(),
                '@type': rdfString,
            }],
            name: [{
                '@value': faker.company.companyName(),
                '@type': rdfString,
            }],
        }],
        resourceNature: [{
            '@id': 'https://schema.datacite.org/meta/kernel-4/#Preprint',
            displayLabel: [{
                '@value': 'Preprint',
                '@language': 'en',
            }],
        }],
        resourceType: [{ '@id': 'Preprint' }],
        rights: [{ // License
            '@id': 'http://creativecommons.org/licenses/by/4.0/',
            identifier: [{
                '@value': 'http://creativecommons.org/licenses/by/4.0/',
                '@type': rdfString,
            }],
            name: [{
                '@value': 'CC-BY-4.0',
                '@type': rdfString,
            }],
        }],
        sameAs: [{}], // some DOI
        statedConflictOfInterest: [{
            '@id': 'no-confict-of-interest',
        }],
        subject: [{
            '@id': 'https://api.osf.io/v2/subjects/584240da54be81056cecac48',
            resourceType: [{ '@id': ShareResourceTypes.Concept }],
            inScheme: [{
                '@id': 'https://api.osf.io/v2/schemas/subjects/',
                resourceType: [{ '@id': ShareResourceTypes.ConceptScheme }],
                title: [{
                    '@value': 'bepress Digital Commons Three-Tiered Taxonomy',
                    '@type': rdfString,
                }],
            }],
            prefLabel: [{
                '@value': 'Social and Behavioral Sciences',
                '@type': rdfString,
            }],
        }],
        title: [{
            '@value': faker.lorem.words(3),
            '@type': rdfString,
        }],
    }),
    File: () => ({
        '@id': faker.internet.url(),
        // accessService: [{}],
        dateCreated: [{
            '@value': _randomPastYearMonthDay(),
            '@type': rdfString,
        }],
        dateModified: [{
            '@value': _randomPastYearMonthDay(),
            '@type': rdfString,
        }],
        description: [{
            '@value': faker.lorem.sentence(),
            '@type': rdfString,
        }],
        fileName: [{
            '@value': faker.system.fileName(),
            '@type': rdfString,
        }],
        filePath: [{
            '@value': faker.system.filePath(),
            '@type': rdfString,
        }],
        identifier: [{
            '@value': faker.internet.url(),
            '@type': rdfString,
        }],
        isContainedBy: [{ // Parent Project
            '@id': faker.internet.url(),
            resourceType: [{ '@id': ShareResourceTypes.Project }],
            identifier: [{
                '@value': faker.internet.url(),
                '@type': rdfString,
            }],
            title: [{
                '@value': faker.lorem.words(3),
                '@type': rdfString,
            }],
        }],
        language: [{
            '@value': 'eng',
            '@type': rdfString,
        }],
        // 'osf:hasFileVersion': [{}], // FileVersion
        resourceNature: [{
            '@id': 'https://schema.datacite.org/meta/kernel-4/#Dataset',
            displayLabel: [{
                '@value': 'Dataset',
                '@language': 'en',
            }],
        }],
        resourceType: [{ '@id': 'File' }],
        title: [{
            '@value': faker.lorem.words(3),
            '@type': rdfString,
        }],
    }),
    Agent: () => ({
        '@id': faker.internet.url(),
        // accessService: [{}],
        affiliation: [{
            '@id': faker.internet.url(),
            resourceType: [{ '@id': ShareResourceTypes.Organization }, { '@id': ShareResourceTypes.Agent }],
            identifier: [{
                '@value': faker.internet.url(),
                '@type': rdfString,
            }],
            name: [{
                '@value': faker.company.companyName(),
                '@type': rdfString,
            }],
            // sameAs: [{}], // some ROR
        }],
        identifier: [
            {
                '@value': faker.internet.url(),
                '@type': rdfString,
            },
            {
                '@value': 'https://orcid.org/0000-0000-0000-0000',
                '@type': rdfString,
            },
        ],
        name: [{
            '@value': faker.name.findName(),
            '@type': rdfString,
        }],
        resourceType: [{ '@id': ShareResourceTypes.Person }, { '@id': ShareResourceTypes.Agent }],
        sameAs: [{ '@id': 'https://orcid.org/0000-0000-0000-0000' }], // some ORCID
    }),
};

resourceMetadataByType.ProjectComponent = function() {
    return {
        ...resourceMetadataByType.Project(),
        resourceType: [{ '@id': 'ProjectComponent' }],
        isPartOf: [{ // Parent Project
            ...resourceMetadataByType.Project(),
        }],
        hasRoot: [{ // Root Project
            ...resourceMetadataByType.Project(),
        }],
    };
};
resourceMetadataByType.RegistrationComponent = function() {
    return {
        ...resourceMetadataByType.Registration(),
        resourceType: [{ '@id': 'RegistrationComponent' }],
        isPartOf: [{ // Parent Registration
            ...resourceMetadataByType.Registration(),
        }],
        hasRoot: [{ // Root Registration
            ...resourceMetadataByType.Registration(),
        }],
    };
};

export function cardSearch(_: Schema, request: Request) {
    const {queryParams} = request;
    const pageCursor = queryParams['page[cursor]'];
    const pageSize = queryParams['page[size]'] ? parseInt(queryParams['page[size]'], 10) : 10;

    // cardSearchFilter[resourceType] is a comma-separated list (e.g. 'Project,ProjectComponent') or undefined
    let requestedResourceTypes = queryParams['cardSearchFilter[resourceType]']?.split(',') as ShareResourceTypes[];
    if (!requestedResourceTypes) {
        requestedResourceTypes = Object.keys(resourceMetadataByType) as ShareResourceTypes[];
    }

    const indexCardSearch = {
        data: {
            type: 'index-card-search',
            id: faker.random.uuid(),
            attributes: {
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
                searchResultPage: {},
            },
        },
        included: [
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

    const searchResultPageRelationship = { data: [] as any[], links: {} as PaginationLinks};
    const includedSearchResultPage: any[] = [];
    const includedIndexCard: any[] = [];
    Array.from({ length: pageSize }).forEach(() => {
        const searchResultId = faker.random.uuid();
        const indexCardId = faker.random.uuid();
        const indexCardURL = `https://share.osf.io/api/v2/index-card/${indexCardId}`;
        searchResultPageRelationship.data.push({
            type: 'search-result',
            id: searchResultId,
        });
        includedSearchResultPage.push({
            type: 'search-result',
            id: searchResultId,
            attributes: {
                matchEvidence: [
                    {
                        '@type': ['https://share.osf.io/vocab/2023/trove/TextMatchEvidence'],
                        evidenceCardIdentifier: indexCardURL,
                        matchingHighlight: [`...<em>${faker.lorem.word()}</em>...`],
                        osfmapPropertyPath: ['description'],
                        propertyPathKey: 'description',
                    },
                ],
            },
            relationships: {
                indexCard: {
                    data: {
                        type: 'index-card',
                        id: indexCardId,
                    },
                    links: {
                        related: indexCardURL,
                    },
                },
            },
        });
        // pick a random resource type among the possible ones requested
        const requestedResourceType: ShareResourceTypes
            = requestedResourceTypes[Math.floor(Math.random() * requestedResourceTypes.length)];
        const resourceTypeMetadata = resourceMetadataByType[requestedResourceType];
        includedIndexCard.push({
            type: 'index-card',
            id: indexCardId,
            attributes: {
                resourceIdentifier: [
                    indexCardURL,
                    `https://doi.org/10.0000/osf.example/${indexCardId}`,
                ],
                resourceMetadata: resourceTypeMetadata(),
            },
            links: {
                self: indexCardURL,
                resource: `https://osf.example/${indexCardId}`,
            },
        });
    });

    const cursorizedUrl = new URL(request.url);
    cursorizedUrl.searchParams.set('page[cursor]', faker.random.uuid());
    searchResultPageRelationship.links = {
        next: {
            href: cursorizedUrl.toString(),
        },
    };
    if (pageCursor) {
        searchResultPageRelationship.links.prev = {
            href: cursorizedUrl.toString(),
        };
        searchResultPageRelationship.links.first = {
            href: cursorizedUrl.toString(),
        };
    }
    indexCardSearch.data.relationships.searchResultPage = searchResultPageRelationship;
    indexCardSearch.included.push(...includedSearchResultPage, ...includedIndexCard);
    return indexCardSearch;
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

function _randomPastYearMonthDay(): string {
    return faker.date.past().toISOString().split('T')[0];
}
