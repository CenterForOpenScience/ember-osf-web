/* eslint-disable max-len */
export const testingRecord = Object({
    '@context': {
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        xsd: 'http://www.w3.org/2001/XMLSchema#',
        pav: 'http://purl.org/pav/',
        schema: 'http://schema.org/',
        oslc: 'http://open-services.net/ns/core#',
        skos: 'http://www.w3.org/2004/02/skos/core#',
        'rdfs:label': {
            '@type': 'xsd:string',
        },
        'schema:isBasedOn': {
            '@type': '@id',
        },
        'schema:name': {
            '@type': 'xsd:string',
        },
        'schema:description': {
            '@type': 'xsd:string',
        },
        'pav:derivedFrom': {
            '@type': '@id',
        },
        'pav:createdOn': {
            '@type': 'xsd:dateTime',
        },
        'pav:createdBy': {
            '@type': '@id',
        },
        'pav:lastUpdatedOn': {
            '@type': 'xsd:dateTime',
        },
        'oslc:modifiedBy': {
            '@type': '@id',
        },
        'skos:notation': {
            '@type': 'xsd:string',
        },
        catalogTitle: 'http://purl.org/dc/terms/title',
        catalogDescription: 'http://purl.org/dc/terms/description',
        datasetIdentifier: 'http://www.w3.org/ns/dcat#dataset',
        publisher: 'https://schema.metadatacenter.org/properties/692e6014-f507-4d4a-8f5f-112ae8d3edb4',
        catalogIdentifier: 'https://schema.metadatacenter.org/properties/4191b152-a77d-4cf8-afb0-04301031a983',
    },
    catalogTitle: {
        '@value': 'Catalog Title',
    },
    catalogDescription: {
        '@value': 'Catalog Description',
    },
    publisher: {
        '@id': 'Publisher',
    },
    datasetIdentifier: [
        {
            1: 'dataset identifier',
            '@id': '1',
        },
    ],
    catalogIdentifier: [
        {
            1: 'catalog identifier',
            '@id': '1',
        },
    ],
    'schema:isBasedOn': 'https://repo.metadatacenter.org/templates/3900b140-a27c-4fca-8a00-c1ccb0f3647f',
    'schema:name': 'Data Catalog metadata',
    'schema:description': 'DCAT v3 template for data catalog metadata',
    'pav:createdOn': '2024-01-31T11:07:43-08:00',
    'pav:createdBy': 'https://metadatacenter.org/users/da9fa72f-c58d-4823-b599-5a821f093054',
    'pav:lastUpdatedOn': '2024-01-31T11:07:43-08:00',
    'oslc:modifiedBy': 'https://metadatacenter.org/users/da9fa72f-c58d-4823-b599-5a821f093054',
    '@id': 'https://repo.metadatacenter.org/template-instances/e5bcecab-e086-4022-9fe8-49d673cacdc4',
});
