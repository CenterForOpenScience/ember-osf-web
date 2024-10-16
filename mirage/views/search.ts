import { Request, Schema } from 'ember-cli-mirage';
import faker from 'faker';
import { PaginationLinks } from 'jsonapi-typescript';

import { AttributionRoles, OsfmapResourceTypes } from 'ember-osf-web/models/index-card';
import config from 'ember-osf-web/config/environment';

import { guid } from '../factories/utils';

const osfUrl = config.OSF.url;

const sampleStorageRegions = ['United States', 'Australia - Sydney', 'Germany - Frankfurt'];

const resourceMetadataByType: Partial<Record<OsfmapResourceTypes, any>> = {
    Registration: () => ({
        '@id': faker.random.uuid(),
        // accessService: [{}],
        archivedAt: [{}], // archive.org URL
        conformsTo: [{ // Registration Schema
            '@id': 'https://api.osf.io/v2/schemas/registrations/564d31db8c5e4a7c9694b2be/',
            title: [{
                '@value': 'Open-Ended Registration',
            }],
        }],
        creator: [_sharePersonField()],
        dateAvailable: [_shareDateField()],
        dateCopyrighted: [_shareDateField()],
        dateCreated: [_shareDateField()],
        dateModified: [_shareDateField()],
        description: [{
            '@value': faker.lorem.sentence(),
        }],
        hasPart: [{}], // RegistrationComponent
        hostingInstition: [_shareOrganizationField()],
        identifier: [_shareIdentifierField(), _shareOsfIdentifier()],
        isVersionOf: [{}], // if this is from a project
        keyword: [{ // tags
            '@value': faker.random.word(),
        }],
        publisher: [_shareOrganizationField()], // Registration Provider
        qualifiedAttribution: [{
            agent: [_sharePersonField()],
            hadRole: [
                {
                    '@id': 'https://schema.org/author',
                    name: [{
                        '@value': faker.random.arrayElement(Object.values(AttributionRoles)),
                    }],
                },
            ],
        }],
        resourceNature: [{ // Registration Category
            '@id': 'https://schema.datacite.org/meta/kernel-4/#StudyRegistration',
            displayLabel: [{
                '@value': 'StudyRegistration',
                '@language': 'en',
            }],
        }],
        resourceType: [{ '@id': 'Registration' }],
        rights: [_shareLicenseField()],
        sameAs: [{}], // some DOI
        storageByteCount: [{
            '@value': faker.random.number(),
        }],
        storageRegion: [{
            prefLabel: [{
                '@value': faker.random.arrayElement(sampleStorageRegions),
            }],
        }],
        subject: [_shareSubjectField()],
        title: [{
            '@value': faker.lorem.words(3),
        }],
        usage: [_shareUsageReportField()],
    }),
    Project: () => ({
        '@id': faker.internet.url(),
        // accessService: [{}],
        creator: [_sharePersonField()],
        dateCopyrighted: [_shareDateField()],
        dateCreated: [_shareDateField()],
        dateModified: [_shareDateField()],
        description: [{
            '@value': faker.lorem.sentence(),
        }],
        funder: [_shareOrganizationField()],
        hasOsfAddon: [
            {
                prefLabel: [{
                    '@value': 'Box',
                }],
            },
        ],
        hasPart: [{}], // ProjectComponent
        hostingInstition: [_shareOrganizationField()],
        identifier: [_shareIdentifierField(), _shareOsfIdentifier()],
        keyword: [{ // tags
            '@value': faker.random.word(),
        }],
        publisher: [_shareOrganizationField()],
        qualifiedAttribution: [{
            agent: [_sharePersonField()],
            hadRole: [
                {
                    '@id': 'https://schema.org/author',
                    name: [{
                        '@value': faker.random.arrayElement(Object.values(AttributionRoles)),
                    }],
                },
            ],
        }],
        resourceNature: [{
            '@id': 'https://schema.datacite.org/meta/kernel-4/#Dataset',
            displayLabel:[
                {
                    '@value': faker.random.arrayElement(['Dataset', 'JournalArticle', 'Book']),
                    '@language': 'en',
                },
            ],
        }],
        resourceType: [{ '@id': 'Project' }],
        rights: [_shareLicenseField()],
        sameAs: [{}], // some DOI
        storageByteCount: [{
            '@value': faker.random.number(),
        }],
        storageRegion: [{
            prefLabel: [{
                '@value': faker.random.arrayElement(sampleStorageRegions),
            }],
        }],
        subject: [_shareSubjectField()],
        title: [{
            '@value': faker.lorem.words(3),
        }],
        usage: [_shareUsageReportField()],
    }),
    Preprint: () => ({
        '@id': faker.internet.url(),
        // accessService: [{}],
        creator: [_sharePersonField('http://ror.org/has-users')],
        dateAccepted: [_shareDateField()],
        dateCopyrighted: [_shareDateField()],
        dateCreated: [_shareDateField()],
        dateSubmitted: [_shareDateField()],
        dateModified: [_shareDateField()],
        description: [{
            '@value': faker.lorem.sentence(),

        }],
        hasPart: [{}], // File
        hostingInstition: [_shareOrganizationField()],
        identifier: [_shareIdentifierField(), _shareOsfIdentifier()],
        // isSupplementedBy: [{}], // if this links a project
        keyword: [{ // tags
            '@value': faker.random.word(),
        }],
        omits: [{
            ommittedMetadataProperty: [
                { '@id': 'hasPreregisteredStudyDesign' },
                { '@id': 'hasPreregisteredAnalysisPlan' },
            ],
        }],
        publisher: [_shareOrganizationField()], // Preprint Provider
        qualifiedAttribution: [{
            agent: [_sharePersonField()],
            hadRole: [
                {
                    '@id': 'https://schema.org/author',
                    name: [{
                        '@value': faker.random.arrayElement(Object.values(AttributionRoles)),
                    }],
                },
            ],
        }],
        resourceNature: [{
            '@id': 'https://schema.datacite.org/meta/kernel-4/#Preprint',
            displayLabel: [{
                '@value': 'Preprint',
                '@language': 'en',
            }],
        }],
        resourceType: [{ '@id': 'Preprint' }],
        rights: [_shareLicenseField()],
        sameAs: [{}], // some DOI
        statedConflictOfInterest: [{
            '@id': 'no-confict-of-interest',
        }],
        subject: [_shareSubjectField()],
        title: [{
            '@value': faker.lorem.words(3),
        }],
        usage: [_shareUsageReportField()],
    }),
    Agent: () => ({
        '@id': faker.internet.url(),
        // accessService: [{}],
        affiliation: [_shareOrganizationField()],
        identifier: [
            _shareIdentifierField(),
            {
                '@value': 'https://orcid.org/0000-0000-0000-0000',
            },
            _shareOsfIdentifier(),
        ],
        name: [{
            '@value': faker.name.findName(),
        }],
        resourceType: [{ '@id': OsfmapResourceTypes.Person }, { '@id': OsfmapResourceTypes.Agent }],
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
resourceMetadataByType.File = function() {
    return {
        '@id': faker.internet.url(),
        // accessService: [{}],
        dateCreated: [_shareDateField()],
        dateModified: [_shareDateField()],
        description: [{
            '@value': faker.lorem.sentence(),
        }],
        fileName: [{
            '@value': faker.system.fileName(),
        }],
        filePath: [{
            '@value': faker.system.filePath(),
        }],
        identifier: [_shareIdentifierField(), _shareOsfIdentifier()],
        isContainedBy: [{ // Parent Project
            ...resourceMetadataByType.Project(),
        }],
        language: [{
            '@value': 'eng',
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
        }],
    };
};

export function cardSearch(_: Schema, request: Request) {
    const {queryParams} = request;
    const pageCursor = queryParams['page[cursor]'];
    const pageSize = queryParams['page[size]'] ? parseInt(queryParams['page[size]'], 10) : 10;

    // cardSearchFilter[resourceType] is a comma-separated list (e.g. 'Project,ProjectComponent') or undefined
    let requestedResourceTypes = queryParams['cardSearchFilter[resourceType]']?.split(',') as OsfmapResourceTypes[];
    if (!requestedResourceTypes) {
        requestedResourceTypes = Object.keys(resourceMetadataByType) as OsfmapResourceTypes[];
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
                totalResultCount: 10,
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
                            href: 'https://staging-share.osf.io/trove/index-card-search?page%5Bcursor%5D=lmnop',
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
        const requestedResourceType: OsfmapResourceTypes
            = requestedResourceTypes[Math.floor(Math.random() * requestedResourceTypes.length)];
        const resourceTypeMetadata = resourceMetadataByType[requestedResourceType];
        const osfGuid = fakeOsfIdentifier();
        includedIndexCard.push({
            type: 'index-card',
            id: indexCardId,
            attributes: {
                resourceIdentifier: [
                    indexCardURL,
                    `https://doi.org/10.0000/osf.example/${indexCardId}`,
                    osfGuid,
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
                            href: 'https://staging-share.osf.io/trove/index-value-search?page%5Bcursor%5D=lmnop',
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
                    resourceIdentifier: ['http://dx.doi.org/10.10000/505000005050'],
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
                    resourceIdentifier: ['https://doi.org/10.10000/100000001'],
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

function _sharePersonField() {
    const fakeIdentifier = faker.internet.url();
    return {
        '@id': fakeIdentifier,
        resourceType: [{ '@id': OsfmapResourceTypes.Person }, { '@id': OsfmapResourceTypes.Agent }],
        identifier: [
            {
                '@value': 'https://orcid.org/0000-0000-0000-0000', // hard-coded as search-result looks for orcid URL
            },
            _shareIdentifierField(fakeIdentifier),
        ],
        // Pass an IRI to the _shareOrganizationField to create an organization with the same IRI
        // as one specified in your mirage scenario
        // e.g. in mirage scenario: server.create('institution', { iris: ['http://ror.org/has-users']});
        affiliation: [_shareOrganizationField('http://ror.org/has-users')],
        name: [{
            '@value': faker.name.findName(),
        }],
    };
}

function _shareOrganizationField(orgId?: string) {
    const identifier = orgId || faker.internet.url();
    return {
        '@id': identifier,
        resourceType: [{ '@id': OsfmapResourceTypes.Organization }, { '@id': OsfmapResourceTypes.Agent }],
        identifier: [_shareIdentifierField(identifier)],
        name: [{
            '@value': faker.company.companyName(),
        }],
        // sameAs: [{}], // some ROR
    };
}

function _shareIdentifierField(idValue?: string) {
    return {
        '@value': idValue || faker.internet.url(),
    };
}
function fakeOsfIdentifier() {
    const id = guid('share-result')(Math.random());
    return osfUrl + '/' + id;
}

function _shareOsfIdentifier(identifier?: string) {
    return {
        '@value': identifier || fakeOsfIdentifier(),
    };
}

function _shareDateField() {
    return {
        '@value': _randomPastYearMonthDay(),
    };
}

function _shareLicenseField() {
    return {
        '@id': 'http://creativecommons.org/licenses/by/4.0/',
        identifier: [{
            '@value': 'http://creativecommons.org/licenses/by/4.0/',
        }],
        name: [{
            '@value': 'CC-BY-4.0',
        }],
    };
}

function _shareSubjectField() {
    return {
        '@id': 'https://api.osf.io/v2/subjects/584240da54be81056cecac48',
        resourceType: [{ '@id': OsfmapResourceTypes.Concept }],
        inScheme: [{
            '@id': 'https://api.osf.io/v2/schemas/subjects/',
            resourceType: [{ '@id': OsfmapResourceTypes.ConceptScheme }],
            title: [{
                '@value': 'bepress Digital Commons Three-Tiered Taxonomy',
            }],
        }],
        prefLabel: [{
            '@value': 'Social and Behavioral Sciences',
        }],
    };
}

function _shareUsageReportField() {
    return {
        temporalCoverage: [{
            '@value': _randomPastYearMonthDay().slice(0, 7), // YYYY-MM
        }],
        viewCount: [{
            '@value': faker.random.number(),
        }],
        downloadCount: [{
            '@value': faker.random.number(),
        }],
        viewSessionCount: [{
            '@value': faker.random.number(),
        }],
        downloadSessionCount: [{
            '@value': faker.random.number(),
        }],
    };
}

function _randomPastYearMonthDay(): string {
    return faker.date.past().toISOString().split('T')[0];
}
