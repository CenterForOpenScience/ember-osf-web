/* eslint-disable max-len */
import CedarMetadataTemplateModel from 'ember-osf-web/models/cedar-metadata-template';


const cedarMetadataTemplates: Array<Partial<CedarMetadataTemplateModel>> = [
    {
        id: '2',
        schemaName: 'Biosample submission template schema',
        cedarId: 'https://repo.metadatacenter.net/templates/58098c2d-dea9-4ec6-8f5d-d85d5f1b4f6f',
        active: true,
        template: Object({
            _ui: {
                order: [
                    'nCBISubmissionDescription',
                    'bioSample',
                ],
                pages: [],
                propertyLabels: {
                    nCBISubmissionDescription: 'N Cbi Submission Description',
                    bioSample: 'Bio Sample',
                },
            },
            'schema:name': 'BioSample Submission',
            properties: {
                'schema:isBasedOn': {
                    type: 'string',
                    format: 'uri',
                },
                'schema:name': {
                    type: 'string',
                    minLength: 1,
                },
                'oslc:modifiedBy': {
                    type: [
                        'string',
                        'null',
                    ],
                    format: 'uri',
                },
                'pav:createdBy': {
                    type: [
                        'string',
                        'null',
                    ],
                    format: 'uri',
                },
                '@context': {
                    additionalProperties: false,
                    type: 'object',
                    required: [
                        'xsd',
                        'rdfs',
                        'pav',
                        'schema',
                        'oslc',
                        'nCBISubmissionDescription',
                        'bioSample',
                        'schema:isBasedOn',
                        'schema:description',
                        'schema:name',
                        'rdfs:label',
                        'oslc:modifiedBy',
                        'pav:createdBy',
                        'pav:createdOn',
                        'pav:lastUpdatedOn',
                        'skos',
                        'skos:notation',
                    ],
                    properties: {
                        'schema:isBasedOn': {
                            type: 'object',
                            properties: {
                                '@type': {
                                    enum: [
                                        '@id',
                                    ],
                                    type: 'string',
                                },
                            },
                        },
                        'schema:name': {
                            type: 'object',
                            properties: {
                                '@type': {
                                    enum: [
                                        'xsd:string',
                                    ],
                                    type: 'string',
                                },
                            },
                        },
                        'oslc:modifiedBy': {
                            type: 'object',
                            properties: {
                                '@type': {
                                    enum: [
                                        '@id',
                                    ],
                                    type: 'string',
                                },
                            },
                        },
                        schema: {
                            enum: [
                                'http://schema.org/',
                            ],
                            type: 'string',
                            format: 'uri',
                        },
                        'pav:createdBy': {
                            type: 'object',
                            properties: {
                                '@type': {
                                    enum: [
                                        '@id',
                                    ],
                                    type: 'string',
                                },
                            },
                        },
                        xsd: {
                            enum: [
                                'http://www.w3.org/2001/XMLSchema#',
                            ],
                            type: 'string',
                            format: 'uri',
                        },
                        rdfs: {
                            enum: [
                                'http://www.w3.org/2000/01/rdf-schema#',
                            ],
                            type: 'string',
                            format: 'uri',
                        },
                        nCBISubmissionDescription: {
                            enum: [
                                'https://schema.metadatacenter.net/properties/nCBISubmissionDescription',
                            ],
                        },
                        'rdfs:label': {
                            type: 'object',
                            properties: {
                                '@type': {
                                    enum: [
                                        'xsd:string',
                                    ],
                                    type: 'string',
                                },
                            },
                        },
                        'pav:derivedFrom': {
                            type: 'object',
                            properties: {
                                '@type': {
                                    enum: [
                                        '@id',
                                    ],
                                    type: 'string',
                                },
                            },
                        },
                        skos: {
                            enum: [
                                'http://www.w3.org/2004/02/skos/core#',
                            ],
                            type: 'string',
                            format: 'uri',
                        },
                        'pav:lastUpdatedOn': {
                            type: 'object',
                            properties: {
                                '@type': {
                                    enum: [
                                        'xsd:dateTime',
                                    ],
                                    type: 'string',
                                },
                            },
                        },
                        oslc: {
                            enum: [
                                'http://open-services.net/ns/core#',
                            ],
                            type: 'string',
                            format: 'uri',
                        },
                        bioSample: {
                            enum: [
                                'https://schema.metadatacenter.net/properties/bioSample',
                            ],
                        },
                        'skos:notation': {
                            type: 'object',
                            properties: {
                                '@type': {
                                    enum: [
                                        'xsd:string',
                                    ],
                                    type: 'string',
                                },
                            },
                        },
                        pav: {
                            enum: [
                                'http://purl.org/pav/',
                            ],
                            type: 'string',
                            format: 'uri',
                        },
                        'schema:description': {
                            type: 'object',
                            properties: {
                                '@type': {
                                    enum: [
                                        'xsd:string',
                                    ],
                                    type: 'string',
                                },
                            },
                        },
                        'pav:createdOn': {
                            type: 'object',
                            properties: {
                                '@type': {
                                    enum: [
                                        'xsd:dateTime',
                                    ],
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
                nCBISubmissionDescription: {
                    'bibo:status': 'bibo:draft',
                    'schema:name': 'NCBI Submission Description',
                    properties: {
                        '@context': {
                            additionalProperties: false,
                            type: 'object',
                            required: [
                                'comment',
                                'releaseDate',
                                'nCBIOrganization',
                            ],
                            properties: {
                                nCBIOrganization: {
                                    enum: [
                                        'https://schema.metadatacenter.net/properties/nCBIOrganization',
                                    ],
                                },
                                comment: {
                                    enum: [
                                        'https://schema.metadatacenter.net/properties/comment',
                                    ],
                                },
                                releaseDate: {
                                    enum: [
                                        'https://schema.metadatacenter.net/properties/releaseDate',
                                    ],
                                },
                            },
                        },
                        '@id': {
                            type: 'string',
                            format: 'uri',
                        },
                        comment: {
                            _ui: {
                                inputType: 'textfield',
                            },
                            'schema:name': 'Comment',
                            'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                            required: [
                                '@value',
                            ],
                            '@id': 'https://repo.metadatacenter.net/template-fields/3d3ccff6-d9bd-45e9-a2ad-f7b2926cad60',
                            '@context': {
                                'schema:name': {
                                    '@type': 'xsd:string',
                                },
                                schema: 'http://schema.org/',
                                'pav:createdBy': {
                                    '@type': '@id',
                                },
                                xsd: 'http://www.w3.org/2001/XMLSchema#',
                                'oslc:modifiedBy': {
                                    '@type': '@id',
                                },
                                skos: 'http://www.w3.org/2004/02/skos/core#',
                                'pav:lastUpdatedOn': {
                                    '@type': 'xsd:dateTime',
                                },
                                oslc: 'http://open-services.net/ns/core#',
                                'skos:prefLabel': {
                                    '@type': 'xsd:string',
                                },
                                pav: 'http://purl.org/pav/',
                                'skos:altLabel': {
                                    '@type': 'xsd:string',
                                },
                                'schema:description': {
                                    '@type': 'xsd:string',
                                },
                                'pav:createdOn': {
                                    '@type': 'xsd:dateTime',
                                },
                            },
                            additionalProperties: false,
                            type: 'object',
                            title: 'Comment field schema',
                            description: 'Comment field schema autogenerated by the CEDAR Template Editor',
                            'pav:lastUpdatedOn': '2016-09-13T10:23:47-07:00',
                            'pav:createdOn': '2016-09-13T10:23:47-07:00',
                            _valueConstraints: {
                                requiredValue: false,
                            },
                            'schema:schemaVersion': '1.6.0',
                            properties: {
                                '@value': {
                                    type: [
                                        'string',
                                        'null',
                                    ],
                                },
                                '@type': {
                                    oneOf: [
                                        {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        {
                                            minItems: 1,
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                                format: 'uri',
                                            },
                                            uniqueItems: true,
                                        },
                                    ],
                                },
                                'rdfs:label': {
                                    type: [
                                        'string',
                                        'null',
                                    ],
                                },
                            },
                            'schema:description': '',
                            '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                            'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                            $schema: 'http://json-schema.org/draft-04/schema#',
                        },
                        releaseDate: {
                            _ui: {
                                temporalGranularity: 'day',
                                dateType: 'single-date',
                                inputType: 'temporal',
                            },
                            'schema:name': 'Release Date',
                            'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                            required: [
                                '@value',
                            ],
                            '@id': 'https://repo.metadatacenter.net/template-fields/68a39756-8e9b-404a-aad2-c13e3ccd54d5',
                            '@context': {
                                'schema:name': {
                                    '@type': 'xsd:string',
                                },
                                schema: 'http://schema.org/',
                                'pav:createdBy': {
                                    '@type': '@id',
                                },
                                xsd: 'http://www.w3.org/2001/XMLSchema#',
                                'oslc:modifiedBy': {
                                    '@type': '@id',
                                },
                                skos: 'http://www.w3.org/2004/02/skos/core#',
                                'pav:lastUpdatedOn': {
                                    '@type': 'xsd:dateTime',
                                },
                                oslc: 'http://open-services.net/ns/core#',
                                'skos:prefLabel': {
                                    '@type': 'xsd:string',
                                },
                                pav: 'http://purl.org/pav/',
                                'skos:altLabel': {
                                    '@type': 'xsd:string',
                                },
                                'schema:description': {
                                    '@type': 'xsd:string',
                                },
                                'pav:createdOn': {
                                    '@type': 'xsd:dateTime',
                                },
                            },
                            additionalProperties: false,
                            type: 'object',
                            title: 'Release date field schema',
                            description: 'Release date field schema autogenerated by the CEDAR Template Editor',
                            'pav:lastUpdatedOn': '2016-09-13T10:23:47-07:00',
                            'pav:createdOn': '2016-09-13T10:23:47-07:00',
                            _valueConstraints: {
                                temporalType: 'xsd:date',
                                requiredValue: false,
                            },
                            'schema:schemaVersion': '1.6.0',
                            properties: {
                                '@value': {
                                    type: [
                                        'string',
                                        'null',
                                    ],
                                },
                                '@type': {
                                    oneOf: [
                                        {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        {
                                            minItems: 1,
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                                format: 'uri',
                                            },
                                            uniqueItems: true,
                                        },
                                    ],
                                },
                                'rdfs:label': {
                                    type: [
                                        'string',
                                        'null',
                                    ],
                                },
                            },
                            'schema:description': '',
                            '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                            'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                            $schema: 'http://json-schema.org/draft-04/schema#',
                        },
                        '@type': {
                            oneOf: [
                                {
                                    type: 'string',
                                    format: 'uri',
                                },
                                {
                                    minItems: 1,
                                    type: 'array',
                                    items: {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    uniqueItems: true,
                                },
                            ],
                        },
                        nCBIOrganization: {
                            'bibo:status': 'bibo:draft',
                            'schema:name': 'NCBI Organization',
                            properties: {
                                '@context': {
                                    additionalProperties: false,
                                    type: 'object',
                                    required: [
                                        'institutionName',
                                        'nCBIContact',
                                    ],
                                    properties: {
                                        nCBIContact: {
                                            enum: [
                                                'https://schema.metadatacenter.net/properties/nCBIContact',
                                            ],
                                        },
                                        institutionName: {
                                            enum: [
                                                'https://schema.metadatacenter.net/properties/institutionName',
                                            ],
                                        },
                                    },
                                },
                                '@type': {
                                    oneOf: [
                                        {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        {
                                            minItems: 1,
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                                format: 'uri',
                                            },
                                            uniqueItems: true,
                                        },
                                    ],
                                },
                                nCBIContact: {
                                    _ui: {
                                        order: [
                                            'untitled',
                                            'nCBIName',
                                        ],
                                        propertyLabels: {},
                                    },
                                    'schema:name': 'NCBI Contact',
                                    properties: {
                                        '@context': {
                                            additionalProperties: false,
                                            type: 'object',
                                            required: [
                                                'nCBIName',
                                                'untitled',
                                            ],
                                            properties: {
                                                nCBIName: {
                                                    enum: [
                                                        'https://schema.metadatacenter.net/properties/nCBIName',
                                                    ],
                                                },
                                                untitled: {
                                                    enum: [
                                                        'https://schema.metadatacenter.net/properties/untitled',
                                                    ],
                                                },
                                            },
                                        },
                                        nCBIName: {
                                            _ui: {
                                                order: [
                                                    'firstName',
                                                    'middleInitial',
                                                    'lastName',
                                                ],
                                                propertyLabels: {},
                                            },
                                            'schema:name': 'NCBI Name',
                                            properties: {
                                                lastName: {
                                                    _ui: {
                                                        inputType: 'textfield',
                                                    },
                                                    'schema:name': 'Last Name',
                                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                                    required: [
                                                        '@value',
                                                    ],
                                                    '@id': 'https://repo.metadatacenter.net/template-fields/f1e9235e-52ba-487e-b139-f96c95c693f3',
                                                    '@context': {
                                                        'schema:name': {
                                                            '@type': 'xsd:string',
                                                        },
                                                        schema: 'http://schema.org/',
                                                        'pav:createdBy': {
                                                            '@type': '@id',
                                                        },
                                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                                        'oslc:modifiedBy': {
                                                            '@type': '@id',
                                                        },
                                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                                        'pav:lastUpdatedOn': {
                                                            '@type': 'xsd:dateTime',
                                                        },
                                                        oslc: 'http://open-services.net/ns/core#',
                                                        'skos:prefLabel': {
                                                            '@type': 'xsd:string',
                                                        },
                                                        pav: 'http://purl.org/pav/',
                                                        'skos:altLabel': {
                                                            '@type': 'xsd:string',
                                                        },
                                                        'schema:description': {
                                                            '@type': 'xsd:string',
                                                        },
                                                        'pav:createdOn': {
                                                            '@type': 'xsd:dateTime',
                                                        },
                                                    },
                                                    additionalProperties: false,
                                                    type: 'object',
                                                    title: 'Last name field schema',
                                                    description: 'Last name field schema autogenerated by the CEDAR Template Editor',
                                                    'pav:lastUpdatedOn': '2016-09-13T10:18:33-07:00',
                                                    'pav:createdOn': '2016-09-13T10:18:33-07:00',
                                                    _valueConstraints: {
                                                        requiredValue: false,
                                                    },
                                                    'schema:schemaVersion': '1.6.0',
                                                    properties: {
                                                        '@value': {
                                                            type: [
                                                                'string',
                                                                'null',
                                                            ],
                                                        },
                                                        '@type': {
                                                            oneOf: [
                                                                {
                                                                    type: 'string',
                                                                    format: 'uri',
                                                                },
                                                                {
                                                                    minItems: 1,
                                                                    type: 'array',
                                                                    items: {
                                                                        type: 'string',
                                                                        format: 'uri',
                                                                    },
                                                                    uniqueItems: true,
                                                                },
                                                            ],
                                                        },
                                                        'rdfs:label': {
                                                            type: [
                                                                'string',
                                                                'null',
                                                            ],
                                                        },
                                                    },
                                                    'schema:description': '',
                                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                                },
                                                '@id': {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                '@context': {
                                                    additionalProperties: false,
                                                    type: 'object',
                                                    required: [
                                                        'lastName',
                                                        'middleInitial',
                                                        'firstName',
                                                    ],
                                                    properties: {
                                                        lastName: {
                                                            enum: [
                                                                'https://schema.metadatacenter.net/properties/lastName',
                                                            ],
                                                        },
                                                        firstName: {
                                                            enum: [
                                                                'https://schema.metadatacenter.net/properties/firstName',
                                                            ],
                                                        },
                                                        middleInitial: {
                                                            enum: [
                                                                'https://schema.metadatacenter.net/properties/middleInitial',
                                                            ],
                                                        },
                                                    },
                                                },
                                                middleInitial: {
                                                    _ui: {
                                                        inputType: 'textfield',
                                                    },
                                                    'schema:name': 'Middle Initial',
                                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                                    required: [
                                                        '@value',
                                                    ],
                                                    '@id': 'https://repo.metadatacenter.net/template-fields/27cc68dd-3769-4e34-8200-1dc8b6f07682',
                                                    '@context': {
                                                        'schema:name': {
                                                            '@type': 'xsd:string',
                                                        },
                                                        schema: 'http://schema.org/',
                                                        'pav:createdBy': {
                                                            '@type': '@id',
                                                        },
                                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                                        'oslc:modifiedBy': {
                                                            '@type': '@id',
                                                        },
                                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                                        'pav:lastUpdatedOn': {
                                                            '@type': 'xsd:dateTime',
                                                        },
                                                        oslc: 'http://open-services.net/ns/core#',
                                                        'skos:prefLabel': {
                                                            '@type': 'xsd:string',
                                                        },
                                                        pav: 'http://purl.org/pav/',
                                                        'skos:altLabel': {
                                                            '@type': 'xsd:string',
                                                        },
                                                        'schema:description': {
                                                            '@type': 'xsd:string',
                                                        },
                                                        'pav:createdOn': {
                                                            '@type': 'xsd:dateTime',
                                                        },
                                                    },
                                                    additionalProperties: false,
                                                    type: 'object',
                                                    title: 'Middle initial field schema',
                                                    description: 'Middle initial field schema autogenerated by the CEDAR Template Editor',
                                                    'pav:lastUpdatedOn': '2016-09-13T10:18:33-07:00',
                                                    'pav:createdOn': '2016-09-13T10:18:33-07:00',
                                                    _valueConstraints: {
                                                        requiredValue: false,
                                                    },
                                                    'schema:schemaVersion': '1.6.0',
                                                    properties: {
                                                        '@value': {
                                                            type: [
                                                                'string',
                                                                'null',
                                                            ],
                                                        },
                                                        '@type': {
                                                            oneOf: [
                                                                {
                                                                    type: 'string',
                                                                    format: 'uri',
                                                                },
                                                                {
                                                                    minItems: 1,
                                                                    type: 'array',
                                                                    items: {
                                                                        type: 'string',
                                                                        format: 'uri',
                                                                    },
                                                                    uniqueItems: true,
                                                                },
                                                            ],
                                                        },
                                                        'rdfs:label': {
                                                            type: [
                                                                'string',
                                                                'null',
                                                            ],
                                                        },
                                                    },
                                                    'schema:description': '',
                                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                                },
                                                '@type': {
                                                    oneOf: [
                                                        {
                                                            type: 'string',
                                                            format: 'uri',
                                                        },
                                                        {
                                                            minItems: 1,
                                                            type: 'array',
                                                            items: {
                                                                type: 'string',
                                                                format: 'uri',
                                                            },
                                                            uniqueItems: true,
                                                        },
                                                    ],
                                                },
                                                firstName: {
                                                    _ui: {
                                                        inputType: 'textfield',
                                                    },
                                                    'schema:name': 'First Name',
                                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                                    required: [
                                                        '@value',
                                                    ],
                                                    '@id': 'https://repo.metadatacenter.net/template-fields/59722701-8180-4a1b-8bf0-0b9a6febbe3c',
                                                    '@context': {
                                                        'schema:name': {
                                                            '@type': 'xsd:string',
                                                        },
                                                        schema: 'http://schema.org/',
                                                        'pav:createdBy': {
                                                            '@type': '@id',
                                                        },
                                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                                        'oslc:modifiedBy': {
                                                            '@type': '@id',
                                                        },
                                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                                        'pav:lastUpdatedOn': {
                                                            '@type': 'xsd:dateTime',
                                                        },
                                                        oslc: 'http://open-services.net/ns/core#',
                                                        'skos:prefLabel': {
                                                            '@type': 'xsd:string',
                                                        },
                                                        pav: 'http://purl.org/pav/',
                                                        'skos:altLabel': {
                                                            '@type': 'xsd:string',
                                                        },
                                                        'schema:description': {
                                                            '@type': 'xsd:string',
                                                        },
                                                        'pav:createdOn': {
                                                            '@type': 'xsd:dateTime',
                                                        },
                                                    },
                                                    additionalProperties: false,
                                                    type: 'object',
                                                    title: 'First name field schema',
                                                    description: 'First name field schema autogenerated by the CEDAR Template Editor',
                                                    'pav:lastUpdatedOn': '2016-09-13T10:18:33-07:00',
                                                    'pav:createdOn': '2016-09-13T10:18:33-07:00',
                                                    _valueConstraints: {
                                                        requiredValue: false,
                                                    },
                                                    'schema:schemaVersion': '1.6.0',
                                                    properties: {
                                                        '@value': {
                                                            type: [
                                                                'string',
                                                                'null',
                                                            ],
                                                        },
                                                        '@type': {
                                                            oneOf: [
                                                                {
                                                                    type: 'string',
                                                                    format: 'uri',
                                                                },
                                                                {
                                                                    minItems: 1,
                                                                    type: 'array',
                                                                    items: {
                                                                        type: 'string',
                                                                        format: 'uri',
                                                                    },
                                                                    uniqueItems: true,
                                                                },
                                                            ],
                                                        },
                                                        'rdfs:label': {
                                                            type: [
                                                                'string',
                                                                'null',
                                                            ],
                                                        },
                                                    },
                                                    'schema:description': '',
                                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                                },
                                            },
                                            'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                            required: [
                                                '@context',
                                                '@id',
                                                'firstName',
                                                'middleInitial',
                                                'lastName',
                                            ],
                                            '@id': 'https://repo.metadatacenter.net/template-elements/574df466-392b-4e3a-91a0-f615e0d960b9',
                                            '@context': {
                                                'pav:lastUpdatedOn': {
                                                    '@type': 'xsd:dateTime',
                                                },
                                                'schema:name': {
                                                    '@type': 'xsd:string',
                                                },
                                                schema: 'http://schema.org/',
                                                'pav:createdBy': {
                                                    '@type': '@id',
                                                },
                                                xsd: 'http://www.w3.org/2001/XMLSchema#',
                                                bibo: 'http://purl.org/ontology/bibo/',
                                                pav: 'http://purl.org/pav/',
                                                oslc: 'http://open-services.net/ns/core#',
                                                'oslc:modifiedBy': {
                                                    '@type': '@id',
                                                },
                                                'schema:description': {
                                                    '@type': 'xsd:string',
                                                },
                                                'pav:createdOn': {
                                                    '@type': 'xsd:dateTime',
                                                },
                                            },
                                            additionalProperties: false,
                                            type: 'object',
                                            title: 'Ncbi name element schema',
                                            description: 'Ncbi name element schema autogenerated by the CEDAR Template Editor',
                                            'pav:lastUpdatedOn': '2016-09-13T10:21:33-07:00',
                                            'pav:createdOn': '2016-09-13T10:21:33-07:00',
                                            'bibo:status': 'bibo:draft',
                                            'schema:schemaVersion': '1.6.0',
                                            'pav:version': '0.0.1',
                                            'schema:description': 'NCBI Name',
                                            '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                                            'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                            $schema: 'http://json-schema.org/draft-04/schema#',
                                        },
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    minItems: 1,
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        untitled: {
                                            _ui: {
                                                inputType: 'email',
                                            },
                                            'schema:name': 'Email',
                                            'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                            required: [
                                                '@value',
                                            ],
                                            '@id': 'https://repo.metadatacenter.net/template-fields/27b3fbf9-3ac2-4b4a-9424-fdcfc082bf0f',
                                            '@context': {
                                                'schema:name': {
                                                    '@type': 'xsd:string',
                                                },
                                                schema: 'http://schema.org/',
                                                'pav:createdBy': {
                                                    '@type': '@id',
                                                },
                                                xsd: 'http://www.w3.org/2001/XMLSchema#',
                                                'oslc:modifiedBy': {
                                                    '@type': '@id',
                                                },
                                                skos: 'http://www.w3.org/2004/02/skos/core#',
                                                'pav:lastUpdatedOn': {
                                                    '@type': 'xsd:dateTime',
                                                },
                                                oslc: 'http://open-services.net/ns/core#',
                                                'skos:prefLabel': {
                                                    '@type': 'xsd:string',
                                                },
                                                pav: 'http://purl.org/pav/',
                                                'skos:altLabel': {
                                                    '@type': 'xsd:string',
                                                },
                                                'schema:description': {
                                                    '@type': 'xsd:string',
                                                },
                                                'pav:createdOn': {
                                                    '@type': 'xsd:dateTime',
                                                },
                                            },
                                            additionalProperties: false,
                                            type: 'object',
                                            title: 'Email field schema',
                                            description: 'Email field schema autogenerated by the CEDAR Template Editor',
                                            'pav:lastUpdatedOn': '2016-09-13T10:21:33-07:00',
                                            'pav:createdOn': '2016-09-13T10:21:33-07:00',
                                            _valueConstraints: {
                                                requiredValue: false,
                                            },
                                            'schema:schemaVersion': '1.6.0',
                                            properties: {
                                                '@value': {
                                                    type: [
                                                        'string',
                                                        'null',
                                                    ],
                                                },
                                                '@type': {
                                                    oneOf: [
                                                        {
                                                            type: 'string',
                                                            format: 'uri',
                                                        },
                                                        {
                                                            minItems: 1,
                                                            type: 'array',
                                                            items: {
                                                                type: 'string',
                                                                format: 'uri',
                                                            },
                                                            uniqueItems: true,
                                                        },
                                                    ],
                                                },
                                                'rdfs:label': {
                                                    type: [
                                                        'string',
                                                        'null',
                                                    ],
                                                },
                                            },
                                            'schema:description': '',
                                            '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                            'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                            $schema: 'http://json-schema.org/draft-04/schema#',
                                        },
                                        '@id': {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                    },
                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    required: [
                                        '@context',
                                        '@id',
                                        'untitled',
                                        'nCBIName',
                                    ],
                                    '@id': 'https://repo.metadatacenter.net/template-elements/564980a0-a8d0-4752-a948-2a2b75db8fcc',
                                    '@context': {
                                        'pav:lastUpdatedOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        schema: 'http://schema.org/',
                                        'pav:createdBy': {
                                            '@type': '@id',
                                        },
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        bibo: 'http://purl.org/ontology/bibo/',
                                        pav: 'http://purl.org/pav/',
                                        oslc: 'http://open-services.net/ns/core#',
                                        'oslc:modifiedBy': {
                                            '@type': '@id',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'pav:createdOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                    },
                                    additionalProperties: false,
                                    type: 'object',
                                    title: 'Ncbi contact element schema',
                                    description: 'Ncbi contact element schema autogenerated by the CEDAR Template Editor',
                                    'pav:lastUpdatedOn': '2016-09-13T10:23:02-07:00',
                                    'pav:createdOn': '2016-09-13T10:23:02-07:00',
                                    'bibo:status': 'bibo:draft',
                                    'schema:schemaVersion': '1.6.0',
                                    'pav:version': '0.0.1',
                                    'schema:description': 'NCBI Contact',
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                                '@id': {
                                    type: 'string',
                                    format: 'uri',
                                },
                                institutionName: {
                                    _ui: {
                                        inputType: 'textfield',
                                    },
                                    'schema:name': 'Institution Name',
                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    required: [
                                        '@value',
                                    ],
                                    '@id': 'https://repo.metadatacenter.net/template-fields/bddef332-caab-4662-aef8-f98be77a1206',
                                    '@context': {
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        schema: 'http://schema.org/',
                                        'pav:createdBy': {
                                            '@type': '@id',
                                        },
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        'oslc:modifiedBy': {
                                            '@type': '@id',
                                        },
                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                        'pav:lastUpdatedOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                        oslc: 'http://open-services.net/ns/core#',
                                        'skos:prefLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        pav: 'http://purl.org/pav/',
                                        'skos:altLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'pav:createdOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                    },
                                    additionalProperties: false,
                                    type: 'object',
                                    title: 'Institution name field schema',
                                    description: 'Institution name field schema autogenerated by the CEDAR Template Editor',
                                    'pav:lastUpdatedOn': '2016-09-13T10:23:02-07:00',
                                    'pav:createdOn': '2016-09-13T10:23:02-07:00',
                                    _valueConstraints: {
                                        requiredValue: false,
                                    },
                                    'schema:schemaVersion': '1.6.0',
                                    properties: {
                                        '@value': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    minItems: 1,
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        'rdfs:label': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                    },
                                    'schema:description': '',
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                            },
                            'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                            required: [
                                '@context',
                                '@id',
                                'institutionName',
                                'nCBIContact',
                            ],
                            '@id': 'https://repo.metadatacenter.net/template-elements/7dfebdf0-abbf-4fa0-b7ce-2d112bd81ca9',
                            '@context': {
                                'pav:lastUpdatedOn': {
                                    '@type': 'xsd:dateTime',
                                },
                                'schema:name': {
                                    '@type': 'xsd:string',
                                },
                                schema: 'http://schema.org/',
                                'pav:createdBy': {
                                    '@type': '@id',
                                },
                                xsd: 'http://www.w3.org/2001/XMLSchema#',
                                bibo: 'http://purl.org/ontology/bibo/',
                                pav: 'http://purl.org/pav/',
                                oslc: 'http://open-services.net/ns/core#',
                                'oslc:modifiedBy': {
                                    '@type': '@id',
                                },
                                'schema:description': {
                                    '@type': 'xsd:string',
                                },
                                'pav:createdOn': {
                                    '@type': 'xsd:dateTime',
                                },
                            },
                            additionalProperties: false,
                            type: 'object',
                            title: 'Ncbi organization element schema',
                            description: 'Ncbi organization element schema autogenerated by the CEDAR Template Editor',
                            'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                            'pav:lastUpdatedOn': '2016-09-13T10:23:47-07:00',
                            'pav:createdOn': '2016-09-13T10:23:47-07:00',
                            _valueConstraints: {
                                requiredValue: false,
                            },
                            'schema:schemaVersion': '1.6.0',
                            'pav:version': '0.0.1',
                            'schema:description': 'NCBI Organization',
                            '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                            _ui: {
                                order: [
                                    'institutionName',
                                    'nCBIContact',
                                ],
                                propertyLabels: {
                                    nCBIContact: 'N Cbi Contact',
                                    institutionName: 'Institution Name',
                                },
                            },
                            $schema: 'http://json-schema.org/draft-04/schema#',
                        },
                    },
                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                    required: [
                        '@context',
                        '@id',
                        'comment',
                        'releaseDate',
                        'nCBIOrganization',
                    ],
                    '@id': 'https://repo.metadatacenter.net/template-elements/cbc6fed1-98f4-490b-b1a3-8826989c1352',
                    '@context': {
                        'pav:lastUpdatedOn': {
                            '@type': 'xsd:dateTime',
                        },
                        'schema:name': {
                            '@type': 'xsd:string',
                        },
                        schema: 'http://schema.org/',
                        'pav:createdBy': {
                            '@type': '@id',
                        },
                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                        bibo: 'http://purl.org/ontology/bibo/',
                        pav: 'http://purl.org/pav/',
                        oslc: 'http://open-services.net/ns/core#',
                        'oslc:modifiedBy': {
                            '@type': '@id',
                        },
                        'schema:description': {
                            '@type': 'xsd:string',
                        },
                        'pav:createdOn': {
                            '@type': 'xsd:dateTime',
                        },
                    },
                    additionalProperties: false,
                    type: 'object',
                    title: 'Ncbi submission description element schema',
                    description: 'Ncbi submission description element schema autogenerated by the CEDAR Template Editor',
                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                    'pav:lastUpdatedOn': '2016-09-13T10:45:24-07:00',
                    'pav:createdOn': '2016-09-13T10:45:24-07:00',
                    _valueConstraints: {
                        requiredValue: false,
                    },
                    'schema:schemaVersion': '1.6.0',
                    'pav:version': '0.0.1',
                    'schema:description': 'NCBI Submission Description',
                    '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                    _ui: {
                        order: [
                            'comment',
                            'releaseDate',
                            'nCBIOrganization',
                        ],
                        propertyLabels: {
                            nCBIOrganization: 'N Cbi Organization',
                            comment: 'Comment',
                            releaseDate: 'Release Date',
                        },
                    },
                    $schema: 'http://json-schema.org/draft-04/schema#',
                },
                'pav:derivedFrom': {
                    type: 'string',
                    format: 'uri',
                },
                bioSample: {
                    'bibo:status': 'bibo:draft',
                    'schema:name': 'BioSample',
                    properties: {
                        bioSampleAttribute: {
                            minItems: 1,
                            type: 'array',
                            items: {
                                _ui: {
                                    order: [
                                        'attributeName',
                                        'attributeValue',
                                    ],
                                    propertyLabels: {},
                                },
                                'schema:name': 'BioSample Attribute',
                                properties: {
                                    attributeValue: {
                                        _ui: {
                                            inputType: 'textfield',
                                        },
                                        'schema:name': 'Attribute Value',
                                        'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                        required: [
                                            '@value',
                                        ],
                                        '@id': 'https://repo.metadatacenter.net/template-fields/666bbf5a-94ac-4acc-ae5d-c35532a37745',
                                        '@context': {
                                            'schema:name': {
                                                '@type': 'xsd:string',
                                            },
                                            schema: 'http://schema.org/',
                                            'pav:createdBy': {
                                                '@type': '@id',
                                            },
                                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                                            'oslc:modifiedBy': {
                                                '@type': '@id',
                                            },
                                            skos: 'http://www.w3.org/2004/02/skos/core#',
                                            'pav:lastUpdatedOn': {
                                                '@type': 'xsd:dateTime',
                                            },
                                            oslc: 'http://open-services.net/ns/core#',
                                            'skos:prefLabel': {
                                                '@type': 'xsd:string',
                                            },
                                            pav: 'http://purl.org/pav/',
                                            'skos:altLabel': {
                                                '@type': 'xsd:string',
                                            },
                                            'schema:description': {
                                                '@type': 'xsd:string',
                                            },
                                            'pav:createdOn': {
                                                '@type': 'xsd:dateTime',
                                            },
                                        },
                                        additionalProperties: false,
                                        type: 'object',
                                        title: 'Attribute value field schema',
                                        description: 'Attribute value field schema autogenerated by the CEDAR Template Editor',
                                        'pav:lastUpdatedOn': '2016-09-13T10:44:33-07:00',
                                        'pav:createdOn': '2016-09-13T10:44:33-07:00',
                                        _valueConstraints: {
                                            requiredValue: false,
                                        },
                                        'schema:schemaVersion': '1.6.0',
                                        properties: {
                                            '@value': {
                                                type: [
                                                    'string',
                                                    'null',
                                                ],
                                            },
                                            '@type': {
                                                oneOf: [
                                                    {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    {
                                                        minItems: 1,
                                                        type: 'array',
                                                        items: {
                                                            type: 'string',
                                                            format: 'uri',
                                                        },
                                                        uniqueItems: true,
                                                    },
                                                ],
                                            },
                                            'rdfs:label': {
                                                type: [
                                                    'string',
                                                    'null',
                                                ],
                                            },
                                        },
                                        'schema:description': '',
                                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                        'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                        $schema: 'http://json-schema.org/draft-04/schema#',
                                    },
                                    '@context': {
                                        additionalProperties: false,
                                        type: 'object',
                                        required: [
                                            'attributeName',
                                            'attributeValue',
                                        ],
                                        properties: {
                                            attributeValue: {
                                                enum: [
                                                    'https://schema.metadatacenter.net/properties/attributeValue',
                                                ],
                                            },
                                            attributeName: {
                                                enum: [
                                                    'https://schema.metadatacenter.net/properties/attributeName',
                                                ],
                                            },
                                        },
                                    },
                                    attributeName: {
                                        _ui: {
                                            inputType: 'textfield',
                                        },
                                        'schema:name': 'Attribute Name',
                                        'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                        required: [
                                            '@value',
                                        ],
                                        '@id': 'https://repo.metadatacenter.net/template-fields/f76e69f3-47a8-4b17-84c2-d935c049d751',
                                        '@context': {
                                            'schema:name': {
                                                '@type': 'xsd:string',
                                            },
                                            schema: 'http://schema.org/',
                                            'pav:createdBy': {
                                                '@type': '@id',
                                            },
                                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                                            'oslc:modifiedBy': {
                                                '@type': '@id',
                                            },
                                            skos: 'http://www.w3.org/2004/02/skos/core#',
                                            'pav:lastUpdatedOn': {
                                                '@type': 'xsd:dateTime',
                                            },
                                            oslc: 'http://open-services.net/ns/core#',
                                            'skos:prefLabel': {
                                                '@type': 'xsd:string',
                                            },
                                            pav: 'http://purl.org/pav/',
                                            'skos:altLabel': {
                                                '@type': 'xsd:string',
                                            },
                                            'schema:description': {
                                                '@type': 'xsd:string',
                                            },
                                            'pav:createdOn': {
                                                '@type': 'xsd:dateTime',
                                            },
                                        },
                                        additionalProperties: false,
                                        type: 'object',
                                        title: 'Attribute name field schema',
                                        description: 'Attribute name field schema autogenerated by the CEDAR Template Editor',
                                        'pav:lastUpdatedOn': '2016-09-13T10:44:33-07:00',
                                        'pav:createdOn': '2016-09-13T10:44:33-07:00',
                                        _valueConstraints: {
                                            requiredValue: false,
                                        },
                                        'schema:schemaVersion': '1.6.0',
                                        properties: {
                                            '@value': {
                                                type: [
                                                    'string',
                                                    'null',
                                                ],
                                            },
                                            '@type': {
                                                oneOf: [
                                                    {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    {
                                                        minItems: 1,
                                                        type: 'array',
                                                        items: {
                                                            type: 'string',
                                                            format: 'uri',
                                                        },
                                                        uniqueItems: true,
                                                    },
                                                ],
                                            },
                                            'rdfs:label': {
                                                type: [
                                                    'string',
                                                    'null',
                                                ],
                                            },
                                        },
                                        'schema:description': '',
                                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                        'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                        $schema: 'http://json-schema.org/draft-04/schema#',
                                    },
                                    '@id': {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    '@type': {
                                        oneOf: [
                                            {
                                                type: 'string',
                                                format: 'uri',
                                            },
                                            {
                                                minItems: 1,
                                                type: 'array',
                                                items: {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                uniqueItems: true,
                                            },
                                        ],
                                    },
                                },
                                'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                required: [
                                    '@context',
                                    '@id',
                                    'attributeValue',
                                    'attributeName',
                                ],
                                '@id': 'https://repo.metadatacenter.net/template-elements/90a2675f-0567-4537-9fdb-e6a8c7d9f5a2',
                                '@context': {
                                    'pav:lastUpdatedOn': {
                                        '@type': 'xsd:dateTime',
                                    },
                                    'schema:name': {
                                        '@type': 'xsd:string',
                                    },
                                    schema: 'http://schema.org/',
                                    'pav:createdBy': {
                                        '@type': '@id',
                                    },
                                    xsd: 'http://www.w3.org/2001/XMLSchema#',
                                    bibo: 'http://purl.org/ontology/bibo/',
                                    pav: 'http://purl.org/pav/',
                                    oslc: 'http://open-services.net/ns/core#',
                                    'oslc:modifiedBy': {
                                        '@type': '@id',
                                    },
                                    'schema:description': {
                                        '@type': 'xsd:string',
                                    },
                                    'pav:createdOn': {
                                        '@type': 'xsd:dateTime',
                                    },
                                },
                                additionalProperties: false,
                                type: 'object',
                                title: 'BioSample Attribute field schema',
                                description: 'BioSample Attribute field schema autogenerated by the CEDAR Template Editor',
                                'pav:lastUpdatedOn': '2016-09-13T10:44:58-07:00',
                                'pav:createdOn': '2016-09-13T10:44:58-07:00',
                                'bibo:status': 'bibo:draft',
                                'schema:schemaVersion': '1.6.0',
                                'pav:version': '0.0.1',
                                'schema:description': 'BioSample Attribute',
                                '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                                'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                $schema: 'http://json-schema.org/draft-04/schema#',
                            },
                        },
                        bioProjectID: {
                            _ui: {
                                inputType: 'textfield',
                            },
                            'schema:name': 'Bio Project Id',
                            'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                            required: [
                                '@value',
                            ],
                            '@id': 'https://repo.metadatacenter.net/template-fields/874e436a-f188-47e8-91b2-4464bf21c1ce',
                            '@context': {
                                'schema:name': {
                                    '@type': 'xsd:string',
                                },
                                schema: 'http://schema.org/',
                                'pav:createdBy': {
                                    '@type': '@id',
                                },
                                xsd: 'http://www.w3.org/2001/XMLSchema#',
                                'oslc:modifiedBy': {
                                    '@type': '@id',
                                },
                                skos: 'http://www.w3.org/2004/02/skos/core#',
                                'pav:lastUpdatedOn': {
                                    '@type': 'xsd:dateTime',
                                },
                                oslc: 'http://open-services.net/ns/core#',
                                'skos:prefLabel': {
                                    '@type': 'xsd:string',
                                },
                                pav: 'http://purl.org/pav/',
                                'skos:altLabel': {
                                    '@type': 'xsd:string',
                                },
                                'schema:description': {
                                    '@type': 'xsd:string',
                                },
                                'pav:createdOn': {
                                    '@type': 'xsd:dateTime',
                                },
                            },
                            additionalProperties: false,
                            type: 'object',
                            title: 'Bio Project Id field schema',
                            description: 'Bio Project Id field schema generated by the CEDAR Template Editor 2.6.44',
                            'pav:lastUpdatedOn': '2016-09-13T10:44:58-07:00',
                            'pav:createdOn': '2016-09-13T10:44:58-07:00',
                            _valueConstraints: {
                                requiredValue: false,
                            },
                            'schema:schemaVersion': '1.6.0',
                            properties: {
                                '@value': {
                                    type: [
                                        'string',
                                        'null',
                                    ],
                                },
                                '@type': {
                                    oneOf: [
                                        {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        {
                                            minItems: 1,
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                                format: 'uri',
                                            },
                                            uniqueItems: true,
                                        },
                                    ],
                                },
                                'rdfs:label': {
                                    type: [
                                        'string',
                                        'null',
                                    ],
                                },
                            },
                            'schema:description': '',
                            '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                            'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                            $schema: 'http://json-schema.org/draft-04/schema#',
                        },
                        '@id': {
                            type: 'string',
                            format: 'uri',
                        },
                        nCBIOrganism: {
                            'bibo:status': 'bibo:draft',
                            'schema:name': 'NCBI Organism',
                            properties: {
                                label: {
                                    _ui: {
                                        inputType: 'textfield',
                                    },
                                    'schema:name': 'Label',
                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    required: [
                                        '@value',
                                    ],
                                    '@id': 'https://repo.metadatacenter.net/template-fields/8f941388-0303-4de3-9b8a-b97a00652381',
                                    '@context': {
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        schema: 'http://schema.org/',
                                        'pav:createdBy': {
                                            '@type': '@id',
                                        },
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        'oslc:modifiedBy': {
                                            '@type': '@id',
                                        },
                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                        'pav:lastUpdatedOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                        oslc: 'http://open-services.net/ns/core#',
                                        'skos:prefLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        pav: 'http://purl.org/pav/',
                                        'skos:altLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'pav:createdOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                    },
                                    additionalProperties: false,
                                    type: 'object',
                                    title: 'Label field schema',
                                    description: 'Label field schema autogenerated by the CEDAR Template Editor',
                                    'pav:lastUpdatedOn': '2016-09-13T10:34:29-07:00',
                                    'pav:createdOn': '2016-09-13T10:34:29-07:00',
                                    _valueConstraints: {
                                        requiredValue: false,
                                    },
                                    'schema:schemaVersion': '1.6.0',
                                    properties: {
                                        '@value': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    minItems: 1,
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        'rdfs:label': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                    },
                                    'schema:description': '',
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                                organismName: {
                                    _ui: {
                                        inputType: 'textfield',
                                    },
                                    'schema:name': 'Organism Name',
                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    required: [
                                        '@value',
                                    ],
                                    '@id': 'https://repo.metadatacenter.net/template-fields/edd6de99-db7f-4a23-aa5d-798b57f8a563',
                                    '@context': {
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        schema: 'http://schema.org/',
                                        'pav:createdBy': {
                                            '@type': '@id',
                                        },
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        'oslc:modifiedBy': {
                                            '@type': '@id',
                                        },
                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                        'pav:lastUpdatedOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                        oslc: 'http://open-services.net/ns/core#',
                                        'skos:prefLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        pav: 'http://purl.org/pav/',
                                        'skos:altLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'pav:createdOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                    },
                                    additionalProperties: false,
                                    type: 'object',
                                    title: 'Organism name field schema',
                                    description: 'Organism name field schema autogenerated by the CEDAR Template Editor',
                                    'pav:lastUpdatedOn': '2016-09-13T10:34:29-07:00',
                                    'pav:createdOn': '2016-09-13T10:34:29-07:00',
                                    _valueConstraints: {
                                        requiredValue: false,
                                    },
                                    'schema:schemaVersion': '1.6.0',
                                    properties: {
                                        '@value': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    minItems: 1,
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        'rdfs:label': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                    },
                                    'schema:description': '',
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                                '@id': {
                                    type: 'string',
                                    format: 'uri',
                                },
                                breed: {
                                    _ui: {
                                        inputType: 'textfield',
                                    },
                                    'schema:name': 'Breed',
                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    required: [
                                        '@value',
                                    ],
                                    '@id': 'https://repo.metadatacenter.net/template-fields/f047e043-8b42-4abd-ae71-29e8a9b752b2',
                                    '@context': {
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        schema: 'http://schema.org/',
                                        'pav:createdBy': {
                                            '@type': '@id',
                                        },
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        'oslc:modifiedBy': {
                                            '@type': '@id',
                                        },
                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                        'pav:lastUpdatedOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                        oslc: 'http://open-services.net/ns/core#',
                                        'skos:prefLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        pav: 'http://purl.org/pav/',
                                        'skos:altLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'pav:createdOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                    },
                                    additionalProperties: false,
                                    type: 'object',
                                    title: 'Breed field schema',
                                    description: 'Breed field schema autogenerated by the CEDAR Template Editor',
                                    'pav:lastUpdatedOn': '2016-09-13T10:34:29-07:00',
                                    'pav:createdOn': '2016-09-13T10:34:29-07:00',
                                    _valueConstraints: {
                                        requiredValue: false,
                                    },
                                    'schema:schemaVersion': '1.6.0',
                                    properties: {
                                        '@value': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    minItems: 1,
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        'rdfs:label': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                    },
                                    'schema:description': '',
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                                isolateName: {
                                    _ui: {
                                        inputType: 'textfield',
                                    },
                                    'schema:name': 'Isolate Name',
                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    required: [
                                        '@value',
                                    ],
                                    '@id': 'https://repo.metadatacenter.net/template-fields/7fbab272-f7d9-4d82-b9cd-93c619c0a331',
                                    '@context': {
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        schema: 'http://schema.org/',
                                        'pav:createdBy': {
                                            '@type': '@id',
                                        },
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        'oslc:modifiedBy': {
                                            '@type': '@id',
                                        },
                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                        'pav:lastUpdatedOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                        oslc: 'http://open-services.net/ns/core#',
                                        'skos:prefLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        pav: 'http://purl.org/pav/',
                                        'skos:altLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'pav:createdOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                    },
                                    additionalProperties: false,
                                    type: 'object',
                                    title: 'Isolate name field schema',
                                    description: 'Isolate name field schema autogenerated by the CEDAR Template Editor',
                                    'pav:lastUpdatedOn': '2016-09-13T10:34:29-07:00',
                                    'pav:createdOn': '2016-09-13T10:34:29-07:00',
                                    _valueConstraints: {
                                        requiredValue: false,
                                    },
                                    'schema:schemaVersion': '1.6.0',
                                    properties: {
                                        '@value': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    minItems: 1,
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        'rdfs:label': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                    },
                                    'schema:description': '',
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                                '@context': {
                                    additionalProperties: false,
                                    type: 'object',
                                    required: [
                                        'organismName',
                                        'label',
                                        'strain',
                                        'isolateName',
                                        'breed',
                                        'cultivar',
                                    ],
                                    properties: {
                                        organismName: {
                                            enum: [
                                                'https://schema.metadatacenter.net/properties/organismName',
                                            ],
                                        },
                                        label: {
                                            enum: [
                                                'https://schema.metadatacenter.net/properties/label',
                                            ],
                                        },
                                        breed: {
                                            enum: [
                                                'https://schema.metadatacenter.net/properties/breed',
                                            ],
                                        },
                                        isolateName: {
                                            enum: [
                                                'https://schema.metadatacenter.net/properties/isolateName',
                                            ],
                                        },
                                        strain: {
                                            enum: [
                                                'https://schema.metadatacenter.net/properties/strain',
                                            ],
                                        },
                                        cultivar: {
                                            enum: [
                                                'https://schema.metadatacenter.net/properties/cultivar',
                                            ],
                                        },
                                    },
                                },
                                strain: {
                                    _ui: {
                                        inputType: 'textfield',
                                    },
                                    'schema:name': 'Strain',
                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    required: [
                                        '@value',
                                    ],
                                    '@id': 'https://repo.metadatacenter.net/template-fields/4f3e278c-4b18-4783-923e-016bceba7b30',
                                    '@context': {
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        schema: 'http://schema.org/',
                                        'pav:createdBy': {
                                            '@type': '@id',
                                        },
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        'oslc:modifiedBy': {
                                            '@type': '@id',
                                        },
                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                        'pav:lastUpdatedOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                        oslc: 'http://open-services.net/ns/core#',
                                        'skos:prefLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        pav: 'http://purl.org/pav/',
                                        'skos:altLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'pav:createdOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                    },
                                    additionalProperties: false,
                                    type: 'object',
                                    title: 'Strain field schema',
                                    description: 'Strain field schema autogenerated by the CEDAR Template Editor',
                                    'pav:lastUpdatedOn': '2016-09-13T10:34:29-07:00',
                                    'pav:createdOn': '2016-09-13T10:34:29-07:00',
                                    _valueConstraints: {
                                        requiredValue: false,
                                    },
                                    'schema:schemaVersion': '1.6.0',
                                    properties: {
                                        '@value': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    minItems: 1,
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        'rdfs:label': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                    },
                                    'schema:description': '',
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                                cultivar: {
                                    _ui: {
                                        inputType: 'textfield',
                                    },
                                    'schema:name': 'Cultivar',
                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    required: [
                                        '@value',
                                    ],
                                    '@id': 'https://repo.metadatacenter.net/template-fields/9adad477-4cda-4e0f-a542-e56cabede9b0',
                                    '@context': {
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        schema: 'http://schema.org/',
                                        'pav:createdBy': {
                                            '@type': '@id',
                                        },
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        'oslc:modifiedBy': {
                                            '@type': '@id',
                                        },
                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                        'pav:lastUpdatedOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                        oslc: 'http://open-services.net/ns/core#',
                                        'skos:prefLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        pav: 'http://purl.org/pav/',
                                        'skos:altLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'pav:createdOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                    },
                                    additionalProperties: false,
                                    type: 'object',
                                    title: 'Cultivar field schema',
                                    description: 'Cultivar field schema autogenerated by the CEDAR Template Editor',
                                    'pav:lastUpdatedOn': '2016-09-13T10:34:29-07:00',
                                    'pav:createdOn': '2016-09-13T10:34:29-07:00',
                                    _valueConstraints: {
                                        requiredValue: false,
                                    },
                                    'schema:schemaVersion': '1.6.0',
                                    properties: {
                                        '@value': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    minItems: 1,
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        'rdfs:label': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                    },
                                    'schema:description': '',
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                                '@type': {
                                    oneOf: [
                                        {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        {
                                            minItems: 1,
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                                format: 'uri',
                                            },
                                            uniqueItems: true,
                                        },
                                    ],
                                },
                            },
                            'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                            required: [
                                '@context',
                                '@id',
                                'organismName',
                                'breed',
                                'label',
                                'strain',
                                'cultivar',
                                'isolateName',
                            ],
                            '@id': 'https://repo.metadatacenter.net/template-elements/97748dac-ae1d-4bdd-a290-22991ca5e6cd',
                            '@context': {
                                'pav:lastUpdatedOn': {
                                    '@type': 'xsd:dateTime',
                                },
                                'schema:name': {
                                    '@type': 'xsd:string',
                                },
                                schema: 'http://schema.org/',
                                'pav:createdBy': {
                                    '@type': '@id',
                                },
                                xsd: 'http://www.w3.org/2001/XMLSchema#',
                                bibo: 'http://purl.org/ontology/bibo/',
                                pav: 'http://purl.org/pav/',
                                oslc: 'http://open-services.net/ns/core#',
                                'oslc:modifiedBy': {
                                    '@type': '@id',
                                },
                                'schema:description': {
                                    '@type': 'xsd:string',
                                },
                                'pav:createdOn': {
                                    '@type': 'xsd:dateTime',
                                },
                            },
                            additionalProperties: false,
                            type: 'object',
                            title: 'Ncbi organism element schema',
                            description: 'Ncbi organism element schema autogenerated by the CEDAR Template Editor',
                            'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                            'pav:lastUpdatedOn': '2016-09-13T10:44:58-07:00',
                            'pav:createdOn': '2016-09-13T10:44:58-07:00',
                            _valueConstraints: {
                                requiredValue: false,
                            },
                            'schema:schemaVersion': '1.6.0',
                            'pav:version': '0.0.1',
                            'schema:description': 'NCBI Organism',
                            '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                            _ui: {
                                order: [
                                    'organismName',
                                    'label',
                                    'strain',
                                    'isolateName',
                                    'breed',
                                    'cultivar',
                                ],
                                propertyLabels: {
                                    organismName: 'Organism Name',
                                    label: 'Label',
                                    breed: 'Breed',
                                    isolateName: 'Isolate Name',
                                    strain: 'Strain',
                                    cultivar: 'Cultivar',
                                },
                            },
                            $schema: 'http://json-schema.org/draft-04/schema#',
                        },
                        bioSampleSampleID: {
                            'bibo:status': 'bibo:draft',
                            'schema:name': 'BioSample Sample ID',
                            properties: {
                                label: {
                                    _ui: {
                                        inputType: 'textfield',
                                    },
                                    'schema:name': 'Label',
                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    required: [
                                        '@value',
                                    ],
                                    '@id': 'https://repo.metadatacenter.net/template-fields/79de0cc9-1000-4719-9190-63572564752e',
                                    '@context': {
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        schema: 'http://schema.org/',
                                        'pav:createdBy': {
                                            '@type': '@id',
                                        },
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        'oslc:modifiedBy': {
                                            '@type': '@id',
                                        },
                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                        'pav:lastUpdatedOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                        oslc: 'http://open-services.net/ns/core#',
                                        'skos:prefLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        pav: 'http://purl.org/pav/',
                                        'skos:altLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'pav:createdOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                    },
                                    additionalProperties: false,
                                    type: 'object',
                                    title: 'Label field schema',
                                    description: 'Label field schema autogenerated by the CEDAR Template Editor',
                                    'pav:lastUpdatedOn': '2016-09-13T10:30:55-07:00',
                                    'pav:createdOn': '2016-09-13T10:30:55-07:00',
                                    _valueConstraints: {
                                        requiredValue: false,
                                    },
                                    'schema:schemaVersion': '1.6.0',
                                    properties: {
                                        '@value': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    minItems: 1,
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        'rdfs:label': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                    },
                                    'schema:description': '',
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                                display: {
                                    _ui: {
                                        inputType: 'textfield',
                                    },
                                    'schema:name': 'Display',
                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    required: [
                                        '@value',
                                    ],
                                    '@id': 'https://repo.metadatacenter.net/template-fields/1fbd7c3a-fd50-498f-aa92-f6c1a65a05ca',
                                    '@context': {
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        schema: 'http://schema.org/',
                                        'pav:createdBy': {
                                            '@type': '@id',
                                        },
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        'oslc:modifiedBy': {
                                            '@type': '@id',
                                        },
                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                        'pav:lastUpdatedOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                        oslc: 'http://open-services.net/ns/core#',
                                        'skos:prefLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        pav: 'http://purl.org/pav/',
                                        'skos:altLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'pav:createdOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                    },
                                    additionalProperties: false,
                                    type: 'object',
                                    title: 'Display field schema',
                                    description: 'Display field schema autogenerated by the CEDAR Template Editor',
                                    'pav:lastUpdatedOn': '2016-09-13T10:30:55-07:00',
                                    'pav:createdOn': '2016-09-13T10:30:55-07:00',
                                    _valueConstraints: {
                                        requiredValue: false,
                                    },
                                    'schema:schemaVersion': '1.6.0',
                                    properties: {
                                        '@value': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    minItems: 1,
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        'rdfs:label': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                    },
                                    'schema:description': '',
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                                '@id': {
                                    type: 'string',
                                    format: 'uri',
                                },
                                '@context': {
                                    additionalProperties: false,
                                    type: 'object',
                                    required: [
                                        'label',
                                        'display',
                                        'nCBISPUID',
                                    ],
                                    properties: {
                                        label: {
                                            enum: [
                                                'https://schema.metadatacenter.net/properties/label',
                                            ],
                                        },
                                        nCBISPUID: {
                                            enum: [
                                                'https://schema.metadatacenter.net/properties/nCBISPUID',
                                            ],
                                        },
                                        display: {
                                            enum: [
                                                'https://schema.metadatacenter.net/properties/display',
                                            ],
                                        },
                                    },
                                },
                                nCBISPUID: {
                                    _ui: {
                                        order: [
                                            'submitterID',
                                            'namespace',
                                            'value',
                                        ],
                                        propertyLabels: {},
                                    },
                                    'schema:name': 'NCBI SPUID',
                                    properties: {
                                        value: {
                                            _ui: {
                                                inputType: 'textfield',
                                            },
                                            'schema:name': 'Value',
                                            'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                            required: [
                                                '@value',
                                            ],
                                            '@id': 'https://repo.metadatacenter.net/template-fields/78a89853-95bf-4adc-811c-bf182a1bc6c9',
                                            '@context': {
                                                'schema:name': {
                                                    '@type': 'xsd:string',
                                                },
                                                schema: 'http://schema.org/',
                                                'pav:createdBy': {
                                                    '@type': '@id',
                                                },
                                                xsd: 'http://www.w3.org/2001/XMLSchema#',
                                                'oslc:modifiedBy': {
                                                    '@type': '@id',
                                                },
                                                skos: 'http://www.w3.org/2004/02/skos/core#',
                                                'pav:lastUpdatedOn': {
                                                    '@type': 'xsd:dateTime',
                                                },
                                                oslc: 'http://open-services.net/ns/core#',
                                                'skos:prefLabel': {
                                                    '@type': 'xsd:string',
                                                },
                                                pav: 'http://purl.org/pav/',
                                                'skos:altLabel': {
                                                    '@type': 'xsd:string',
                                                },
                                                'schema:description': {
                                                    '@type': 'xsd:string',
                                                },
                                                'pav:createdOn': {
                                                    '@type': 'xsd:dateTime',
                                                },
                                            },
                                            additionalProperties: false,
                                            type: 'object',
                                            title: 'Value field schema',
                                            description: 'Value field schema autogenerated by the CEDAR Template Editor',
                                            'pav:lastUpdatedOn': '2016-09-13T10:30:25-07:00',
                                            'pav:createdOn': '2016-09-13T10:30:25-07:00',
                                            _valueConstraints: {
                                                requiredValue: false,
                                            },
                                            'schema:schemaVersion': '1.6.0',
                                            properties: {
                                                '@value': {
                                                    type: [
                                                        'string',
                                                        'null',
                                                    ],
                                                },
                                                '@type': {
                                                    oneOf: [
                                                        {
                                                            type: 'string',
                                                            format: 'uri',
                                                        },
                                                        {
                                                            minItems: 1,
                                                            type: 'array',
                                                            items: {
                                                                type: 'string',
                                                                format: 'uri',
                                                            },
                                                            uniqueItems: true,
                                                        },
                                                    ],
                                                },
                                                'rdfs:label': {
                                                    type: [
                                                        'string',
                                                        'null',
                                                    ],
                                                },
                                            },
                                            'schema:description': '',
                                            '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                            'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                            $schema: 'http://json-schema.org/draft-04/schema#',
                                        },
                                        submitterID: {
                                            _ui: {
                                                inputType: 'textfield',
                                            },
                                            'schema:name': 'Submitter ID',
                                            'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                            required: [
                                                '@value',
                                            ],
                                            '@id': 'https://repo.metadatacenter.net/template-fields/0657871c-b5ef-4f27-984b-dd10e51af275',
                                            '@context': {
                                                'schema:name': {
                                                    '@type': 'xsd:string',
                                                },
                                                schema: 'http://schema.org/',
                                                'pav:createdBy': {
                                                    '@type': '@id',
                                                },
                                                xsd: 'http://www.w3.org/2001/XMLSchema#',
                                                'oslc:modifiedBy': {
                                                    '@type': '@id',
                                                },
                                                skos: 'http://www.w3.org/2004/02/skos/core#',
                                                'pav:lastUpdatedOn': {
                                                    '@type': 'xsd:dateTime',
                                                },
                                                oslc: 'http://open-services.net/ns/core#',
                                                'skos:prefLabel': {
                                                    '@type': 'xsd:string',
                                                },
                                                pav: 'http://purl.org/pav/',
                                                'skos:altLabel': {
                                                    '@type': 'xsd:string',
                                                },
                                                'schema:description': {
                                                    '@type': 'xsd:string',
                                                },
                                                'pav:createdOn': {
                                                    '@type': 'xsd:dateTime',
                                                },
                                            },
                                            additionalProperties: false,
                                            type: 'object',
                                            title: 'Submitter id field schema',
                                            description: 'Submitter id field schema autogenerated by the CEDAR Template Editor',
                                            'pav:lastUpdatedOn': '2016-09-13T10:30:25-07:00',
                                            'pav:createdOn': '2016-09-13T10:30:25-07:00',
                                            _valueConstraints: {
                                                requiredValue: false,
                                            },
                                            'schema:schemaVersion': '1.6.0',
                                            properties: {
                                                '@value': {
                                                    type: [
                                                        'string',
                                                        'null',
                                                    ],
                                                },
                                                '@type': {
                                                    oneOf: [
                                                        {
                                                            type: 'string',
                                                            format: 'uri',
                                                        },
                                                        {
                                                            minItems: 1,
                                                            type: 'array',
                                                            items: {
                                                                type: 'string',
                                                                format: 'uri',
                                                            },
                                                            uniqueItems: true,
                                                        },
                                                    ],
                                                },
                                                'rdfs:label': {
                                                    type: [
                                                        'string',
                                                        'null',
                                                    ],
                                                },
                                            },
                                            'schema:description': '',
                                            '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                            'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                            $schema: 'http://json-schema.org/draft-04/schema#',
                                        },
                                        '@context': {
                                            additionalProperties: false,
                                            type: 'object',
                                            required: [
                                                'submitterID',
                                                'value',
                                                'namespace',
                                            ],
                                            properties: {
                                                namespace: {
                                                    enum: [
                                                        'https://schema.metadatacenter.net/properties/namespace',
                                                    ],
                                                },
                                                value: {
                                                    enum: [
                                                        'https://schema.metadatacenter.net/properties/value',
                                                    ],
                                                },
                                                submitterID: {
                                                    enum: [
                                                        'https://schema.metadatacenter.net/properties/submitterID',
                                                    ],
                                                },
                                            },
                                        },
                                        namespace: {
                                            _ui: {
                                                inputType: 'textfield',
                                            },
                                            'schema:name': 'Namespace',
                                            'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                            required: [
                                                '@value',
                                            ],
                                            '@id': 'https://repo.metadatacenter.net/template-fields/fd5c09dd-be33-42cf-a767-7c74bb3249b1',
                                            '@context': {
                                                'schema:name': {
                                                    '@type': 'xsd:string',
                                                },
                                                schema: 'http://schema.org/',
                                                'pav:createdBy': {
                                                    '@type': '@id',
                                                },
                                                xsd: 'http://www.w3.org/2001/XMLSchema#',
                                                'oslc:modifiedBy': {
                                                    '@type': '@id',
                                                },
                                                skos: 'http://www.w3.org/2004/02/skos/core#',
                                                'pav:lastUpdatedOn': {
                                                    '@type': 'xsd:dateTime',
                                                },
                                                oslc: 'http://open-services.net/ns/core#',
                                                'skos:prefLabel': {
                                                    '@type': 'xsd:string',
                                                },
                                                pav: 'http://purl.org/pav/',
                                                'skos:altLabel': {
                                                    '@type': 'xsd:string',
                                                },
                                                'schema:description': {
                                                    '@type': 'xsd:string',
                                                },
                                                'pav:createdOn': {
                                                    '@type': 'xsd:dateTime',
                                                },
                                            },
                                            additionalProperties: false,
                                            type: 'object',
                                            title: 'Namespace field schema',
                                            description: 'Namespace field schema autogenerated by the CEDAR Template Editor',
                                            'pav:lastUpdatedOn': '2016-09-13T10:30:25-07:00',
                                            'pav:createdOn': '2016-09-13T10:30:25-07:00',
                                            _valueConstraints: {
                                                requiredValue: false,
                                            },
                                            'schema:schemaVersion': '1.6.0',
                                            properties: {
                                                '@value': {
                                                    type: [
                                                        'string',
                                                        'null',
                                                    ],
                                                },
                                                '@type': {
                                                    oneOf: [
                                                        {
                                                            type: 'string',
                                                            format: 'uri',
                                                        },
                                                        {
                                                            minItems: 1,
                                                            type: 'array',
                                                            items: {
                                                                type: 'string',
                                                                format: 'uri',
                                                            },
                                                            uniqueItems: true,
                                                        },
                                                    ],
                                                },
                                                'rdfs:label': {
                                                    type: [
                                                        'string',
                                                        'null',
                                                    ],
                                                },
                                            },
                                            'schema:description': '',
                                            '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                            'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                            $schema: 'http://json-schema.org/draft-04/schema#',
                                        },
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    minItems: 1,
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        '@id': {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                    },
                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    required: [
                                        '@context',
                                        '@id',
                                        'submitterID',
                                        'namespace',
                                        'value',
                                    ],
                                    '@id': 'https://repo.metadatacenter.net/template-elements/71e4bb09-4ea1-455a-b37d-5a3bfe3a9ae3',
                                    '@context': {
                                        'pav:lastUpdatedOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        schema: 'http://schema.org/',
                                        'pav:createdBy': {
                                            '@type': '@id',
                                        },
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        bibo: 'http://purl.org/ontology/bibo/',
                                        pav: 'http://purl.org/pav/',
                                        oslc: 'http://open-services.net/ns/core#',
                                        'oslc:modifiedBy': {
                                            '@type': '@id',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'pav:createdOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                    },
                                    additionalProperties: false,
                                    type: 'object',
                                    title: 'Ncbi spuid element schema',
                                    description: 'Ncbi spuid element schema autogenerated by the CEDAR Template Editor',
                                    'pav:lastUpdatedOn': '2016-09-13T10:30:55-07:00',
                                    'pav:createdOn': '2016-09-13T10:30:55-07:00',
                                    'bibo:status': 'bibo:draft',
                                    'schema:schemaVersion': '1.6.0',
                                    'pav:version': '0.0.1',
                                    'schema:description': 'NCBI SPUID',
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                                '@type': {
                                    oneOf: [
                                        {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        {
                                            minItems: 1,
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                                format: 'uri',
                                            },
                                            uniqueItems: true,
                                        },
                                    ],
                                },
                            },
                            'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                            required: [
                                '@context',
                                '@id',
                                'display',
                                'nCBISPUID',
                                'label',
                            ],
                            '@id': 'https://repo.metadatacenter.net/template-elements/01efe14c-b312-4445-beb3-fe0f5ceb6889',
                            '@context': {
                                'pav:lastUpdatedOn': {
                                    '@type': 'xsd:dateTime',
                                },
                                'schema:name': {
                                    '@type': 'xsd:string',
                                },
                                schema: 'http://schema.org/',
                                'pav:createdBy': {
                                    '@type': '@id',
                                },
                                xsd: 'http://www.w3.org/2001/XMLSchema#',
                                bibo: 'http://purl.org/ontology/bibo/',
                                pav: 'http://purl.org/pav/',
                                oslc: 'http://open-services.net/ns/core#',
                                'oslc:modifiedBy': {
                                    '@type': '@id',
                                },
                                'schema:description': {
                                    '@type': 'xsd:string',
                                },
                                'pav:createdOn': {
                                    '@type': 'xsd:dateTime',
                                },
                            },
                            additionalProperties: false,
                            type: 'object',
                            title: 'Biosample sample id element schema',
                            description: 'Biosample sample id element schema autogenerated by the CEDAR Template Editor',
                            'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                            'pav:lastUpdatedOn': '2016-09-13T10:44:58-07:00',
                            'pav:createdOn': '2016-09-13T10:44:58-07:00',
                            _valueConstraints: {
                                requiredValue: false,
                            },
                            'schema:schemaVersion': '1.6.0',
                            'pav:version': '0.0.1',
                            'schema:description': 'BioSample Sample ID',
                            '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                            _ui: {
                                order: [
                                    'label',
                                    'display',
                                    'nCBISPUID',
                                ],
                                propertyLabels: {
                                    label: 'Label',
                                    nCBISPUID: 'N Cbispuid',
                                    display: 'Display',
                                },
                            },
                            $schema: 'http://json-schema.org/draft-04/schema#',
                        },
                        '@context': {
                            additionalProperties: false,
                            type: 'object',
                            required: [
                                'bioProjectID',
                                'package',
                                'bioSampleSampleID',
                                'bioSampleDescriptor',
                                'nCBIOrganism',
                                'biosamplePathogenCl10Attributes',
                                'bioSampleAttribute',
                            ],
                            properties: {
                                bioSampleAttribute: {
                                    enum: [
                                        'https://schema.metadatacenter.net/properties/bioSampleAttribute',
                                    ],
                                },
                                bioProjectID: {
                                    enum: [
                                        'https://schema.metadatacenter.net/properties/bioProjectID',
                                    ],
                                },
                                nCBIOrganism: {
                                    enum: [
                                        'https://schema.metadatacenter.net/properties/nCBIOrganism',
                                    ],
                                },
                                bioSampleSampleID: {
                                    enum: [
                                        'https://schema.metadatacenter.net/properties/bioSampleSampleID',
                                    ],
                                },
                                biosamplePathogenCl10Attributes: {
                                    enum: [
                                        'https://schema.metadatacenter.net/properties/biosamplePathogenCl10Attributes',
                                    ],
                                },
                                package: {
                                    enum: [
                                        'https://schema.metadatacenter.net/properties/package',
                                    ],
                                },
                                bioSampleDescriptor: {
                                    enum: [
                                        'https://schema.metadatacenter.net/properties/bioSampleDescriptor',
                                    ],
                                },
                            },
                        },
                        biosamplePathogenCl10Attributes: {
                            'bibo:status': 'bibo:draft',
                            'schema:name': 'Biosample pathogen cl 1 0 attributes',
                            properties: {
                                isolationSource: {
                                    _ui: {
                                        inputType: 'textfield',
                                    },
                                    'schema:name': 'Isolation Source',
                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    required: [
                                        '@value',
                                    ],
                                    '@id': 'https://repo.metadatacenter.net/template-fields/eaf4a4dc-ac6a-468c-9a80-4ef2fd6621ab',
                                    '@context': {
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        schema: 'http://schema.org/',
                                        'pav:createdBy': {
                                            '@type': '@id',
                                        },
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        'oslc:modifiedBy': {
                                            '@type': '@id',
                                        },
                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                        'pav:lastUpdatedOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                        oslc: 'http://open-services.net/ns/core#',
                                        'skos:prefLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        pav: 'http://purl.org/pav/',
                                        'skos:altLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'pav:createdOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                    },
                                    additionalProperties: false,
                                    type: 'object',
                                    title: 'Isolation source field schema',
                                    description: 'Isolation source field schema autogenerated by the CEDAR Template Editor',
                                    'pav:lastUpdatedOn': '2016-09-13T10:41:10-07:00',
                                    'pav:createdOn': '2016-09-13T10:41:10-07:00',
                                    _valueConstraints: {
                                        requiredValue: false,
                                    },
                                    'schema:schemaVersion': '1.6.0',
                                    properties: {
                                        '@value': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    minItems: 1,
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        'rdfs:label': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                    },
                                    'schema:description': '',
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                                '@id': {
                                    type: 'string',
                                    format: 'uri',
                                },
                                collectionDate: {
                                    _ui: {
                                        temporalGranularity: 'day',
                                        dateType: 'single-date',
                                        inputType: 'temporal',
                                    },
                                    'schema:name': 'Collection Date',
                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    required: [
                                        '@value',
                                    ],
                                    '@id': 'https://repo.metadatacenter.net/template-fields/febd57c9-536d-478e-8120-7708f0eb216d',
                                    '@context': {
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        schema: 'http://schema.org/',
                                        'pav:createdBy': {
                                            '@type': '@id',
                                        },
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        'oslc:modifiedBy': {
                                            '@type': '@id',
                                        },
                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                        'pav:lastUpdatedOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                        oslc: 'http://open-services.net/ns/core#',
                                        'skos:prefLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        pav: 'http://purl.org/pav/',
                                        'skos:altLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'pav:createdOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                    },
                                    additionalProperties: false,
                                    type: 'object',
                                    title: 'Collection date field schema',
                                    description: 'Collection date field schema autogenerated by the CEDAR Template Editor',
                                    'pav:lastUpdatedOn': '2016-09-13T10:41:10-07:00',
                                    'pav:createdOn': '2016-09-13T10:41:10-07:00',
                                    _valueConstraints: {
                                        temporalType: 'xsd:date',
                                        requiredValue: false,
                                    },
                                    'schema:schemaVersion': '1.6.0',
                                    properties: {
                                        '@value': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    minItems: 1,
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        'rdfs:label': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                    },
                                    'schema:description': '',
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                                host: {
                                    _ui: {
                                        inputType: 'textfield',
                                    },
                                    'schema:name': 'Host',
                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    required: [
                                        '@value',
                                    ],
                                    '@id': 'https://repo.metadatacenter.net/template-fields/3576df01-53a6-4cc0-accc-dd18d36b82f1',
                                    '@context': {
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        schema: 'http://schema.org/',
                                        'pav:createdBy': {
                                            '@type': '@id',
                                        },
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        'oslc:modifiedBy': {
                                            '@type': '@id',
                                        },
                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                        'pav:lastUpdatedOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                        oslc: 'http://open-services.net/ns/core#',
                                        'skos:prefLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        pav: 'http://purl.org/pav/',
                                        'skos:altLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'pav:createdOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                    },
                                    additionalProperties: false,
                                    type: 'object',
                                    title: 'Host field schema',
                                    description: 'Host field schema autogenerated by the CEDAR Template Editor',
                                    'pav:lastUpdatedOn': '2016-09-13T10:41:10-07:00',
                                    'pav:createdOn': '2016-09-13T10:41:10-07:00',
                                    _valueConstraints: {
                                        requiredValue: false,
                                    },
                                    'schema:schemaVersion': '1.6.0',
                                    properties: {
                                        '@value': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    minItems: 1,
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        'rdfs:label': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                    },
                                    'schema:description': '',
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                                '@context': {
                                    additionalProperties: false,
                                    type: 'object',
                                    required: [
                                        'strain',
                                        'collectionDate',
                                        'collectedBy',
                                        'gEOLocationName',
                                        'isolationSource',
                                        'latitude/Longitude',
                                        'host',
                                        'hostDisease',
                                    ],
                                    properties: {
                                        isolationSource: {
                                            enum: [
                                                'https://schema.metadatacenter.net/properties/isolationSource',
                                            ],
                                        },
                                        'latitude/Longitude': {
                                            enum: [
                                                'https://schema.metadatacenter.net/properties/latitude/Longitude',
                                            ],
                                        },
                                        collectionDate: {
                                            enum: [
                                                'https://schema.metadatacenter.net/properties/collectionDate',
                                            ],
                                        },
                                        strain: {
                                            enum: [
                                                'https://schema.metadatacenter.net/properties/strain',
                                            ],
                                        },
                                        hostDisease: {
                                            enum: [
                                                'https://schema.metadatacenter.net/properties/hostDisease',
                                            ],
                                        },
                                        gEOLocationName: {
                                            enum: [
                                                'https://schema.metadatacenter.net/properties/gEOLocationName',
                                            ],
                                        },
                                        host: {
                                            enum: [
                                                'https://schema.metadatacenter.net/properties/host',
                                            ],
                                        },
                                        collectedBy: {
                                            enum: [
                                                'https://schema.metadatacenter.net/properties/collectedBy',
                                            ],
                                        },
                                    },
                                },
                                hostDisease: {
                                    _ui: {
                                        inputType: 'textfield',
                                    },
                                    'schema:name': 'Host Disease',
                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    required: [
                                        '@value',
                                    ],
                                    '@id': 'https://repo.metadatacenter.net/template-fields/be5e247a-11d4-474e-9a1a-d71a52fd0f2a',
                                    '@context': {
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        schema: 'http://schema.org/',
                                        'pav:createdBy': {
                                            '@type': '@id',
                                        },
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        'oslc:modifiedBy': {
                                            '@type': '@id',
                                        },
                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                        'pav:lastUpdatedOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                        oslc: 'http://open-services.net/ns/core#',
                                        'skos:prefLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        pav: 'http://purl.org/pav/',
                                        'skos:altLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'pav:createdOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                    },
                                    additionalProperties: false,
                                    type: 'object',
                                    title: 'Host disease field schema',
                                    description: 'Host disease field schema autogenerated by the CEDAR Template Editor',
                                    'pav:lastUpdatedOn': '2016-09-13T10:41:10-07:00',
                                    'pav:createdOn': '2016-09-13T10:41:10-07:00',
                                    _valueConstraints: {
                                        requiredValue: false,
                                    },
                                    'schema:schemaVersion': '1.6.0',
                                    properties: {
                                        '@value': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    minItems: 1,
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        'rdfs:label': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                    },
                                    'schema:description': '',
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                                collectedBy: {
                                    _ui: {
                                        inputType: 'textfield',
                                    },
                                    'schema:name': 'Collected By',
                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    required: [
                                        '@value',
                                    ],
                                    '@id': 'https://repo.metadatacenter.net/template-fields/0ca5d330-7b44-499f-827f-13e87694f206',
                                    '@context': {
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        schema: 'http://schema.org/',
                                        'pav:createdBy': {
                                            '@type': '@id',
                                        },
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        'oslc:modifiedBy': {
                                            '@type': '@id',
                                        },
                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                        'pav:lastUpdatedOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                        oslc: 'http://open-services.net/ns/core#',
                                        'skos:prefLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        pav: 'http://purl.org/pav/',
                                        'skos:altLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'pav:createdOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                    },
                                    additionalProperties: false,
                                    type: 'object',
                                    title: 'Collected by field schema',
                                    description: 'Collected by field schema autogenerated by the CEDAR Template Editor',
                                    'pav:lastUpdatedOn': '2016-09-13T10:41:10-07:00',
                                    'pav:createdOn': '2016-09-13T10:41:10-07:00',
                                    _valueConstraints: {
                                        requiredValue: false,
                                    },
                                    'schema:schemaVersion': '1.6.0',
                                    properties: {
                                        '@value': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    minItems: 1,
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        'rdfs:label': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                    },
                                    'schema:description': '',
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                                gEOLocationName: {
                                    _ui: {
                                        inputType: 'textfield',
                                    },
                                    'schema:name': 'G Eo Location Name',
                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    required: [
                                        '@value',
                                    ],
                                    '@id': 'https://repo.metadatacenter.net/template-fields/87be6f98-72c1-4fa0-bf01-78a6a4f9cdcf',
                                    '@context': {
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        schema: 'http://schema.org/',
                                        'pav:createdBy': {
                                            '@type': '@id',
                                        },
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        'oslc:modifiedBy': {
                                            '@type': '@id',
                                        },
                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                        'pav:lastUpdatedOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                        oslc: 'http://open-services.net/ns/core#',
                                        'skos:prefLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        pav: 'http://purl.org/pav/',
                                        'skos:altLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'pav:createdOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                    },
                                    additionalProperties: false,
                                    type: 'object',
                                    title: 'G Eo Location Name field schema',
                                    description: 'G Eo Location Name field schema generated by the CEDAR Template Editor 2.6.44',
                                    'pav:lastUpdatedOn': '2016-09-13T10:41:10-07:00',
                                    'pav:createdOn': '2016-09-13T10:41:10-07:00',
                                    _valueConstraints: {
                                        requiredValue: false,
                                    },
                                    'schema:schemaVersion': '1.6.0',
                                    properties: {
                                        '@value': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    minItems: 1,
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        'rdfs:label': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                    },
                                    'schema:description': '',
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                                strain: {
                                    _ui: {
                                        inputType: 'textfield',
                                    },
                                    'schema:name': 'Strain',
                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    required: [
                                        '@value',
                                    ],
                                    '@id': 'https://repo.metadatacenter.net/template-fields/2e036cf5-a725-4cd2-8c57-89b82cf2f5f1',
                                    '@context': {
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        schema: 'http://schema.org/',
                                        'pav:createdBy': {
                                            '@type': '@id',
                                        },
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        'oslc:modifiedBy': {
                                            '@type': '@id',
                                        },
                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                        'pav:lastUpdatedOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                        oslc: 'http://open-services.net/ns/core#',
                                        'skos:prefLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        pav: 'http://purl.org/pav/',
                                        'skos:altLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'pav:createdOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                    },
                                    additionalProperties: false,
                                    type: 'object',
                                    title: 'Strain field schema',
                                    description: 'Strain field schema autogenerated by the CEDAR Template Editor',
                                    'pav:lastUpdatedOn': '2016-09-13T10:41:10-07:00',
                                    'pav:createdOn': '2016-09-13T10:41:10-07:00',
                                    _valueConstraints: {
                                        requiredValue: false,
                                    },
                                    'schema:schemaVersion': '1.6.0',
                                    properties: {
                                        '@value': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    minItems: 1,
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        'rdfs:label': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                    },
                                    'schema:description': '',
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                                '@type': {
                                    oneOf: [
                                        {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        {
                                            minItems: 1,
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                                format: 'uri',
                                            },
                                            uniqueItems: true,
                                        },
                                    ],
                                },
                                'latitude/Longitude': {
                                    _ui: {
                                        inputType: 'textfield',
                                    },
                                    'schema:name': 'Latitude_ Longitude',
                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    required: [
                                        '@value',
                                    ],
                                    '@id': 'https://repo.metadatacenter.net/template-fields/84455ee3-da9c-46aa-a3ca-f0dbf1892a56',
                                    '@context': {
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        schema: 'http://schema.org/',
                                        'pav:createdBy': {
                                            '@type': '@id',
                                        },
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        'oslc:modifiedBy': {
                                            '@type': '@id',
                                        },
                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                        'pav:lastUpdatedOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                        oslc: 'http://open-services.net/ns/core#',
                                        'skos:prefLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        pav: 'http://purl.org/pav/',
                                        'skos:altLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'pav:createdOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                    },
                                    additionalProperties: false,
                                    type: 'object',
                                    title: 'Latitude_ Longitude field schema',
                                    description: 'Latitude_ Longitude field schema generated by the CEDAR Template Editor 2.6.44',
                                    'pav:lastUpdatedOn': '2016-09-13T10:41:10-0700',
                                    'pav:createdOn': '2016-09-13T10:41:10-0700',
                                    _valueConstraints: {
                                        requiredValue: false,
                                    },
                                    'schema:schemaVersion': '1.5.0',
                                    properties: {
                                        '@value': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    minItems: 1,
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        'rdfs:label': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                    },
                                    'schema:description': '',
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                            },
                            'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                            required: [
                                '@context',
                                '@id',
                                'latitude/Longitude',
                                'collectedBy',
                                'strain',
                                'isolationSource',
                                'hostDisease',
                                'gEOLocationName',
                                'host',
                                'collectionDate',
                            ],
                            '@id': 'https://repo.metadatacenter.net/template-elements/54ef63f4-a734-44af-bece-23f8b6c99428',
                            '@context': {
                                'pav:lastUpdatedOn': {
                                    '@type': 'xsd:dateTime',
                                },
                                'schema:name': {
                                    '@type': 'xsd:string',
                                },
                                schema: 'http://schema.org/',
                                'pav:createdBy': {
                                    '@type': '@id',
                                },
                                xsd: 'http://www.w3.org/2001/XMLSchema#',
                                bibo: 'http://purl.org/ontology/bibo/',
                                pav: 'http://purl.org/pav/',
                                oslc: 'http://open-services.net/ns/core#',
                                'oslc:modifiedBy': {
                                    '@type': '@id',
                                },
                                'schema:description': {
                                    '@type': 'xsd:string',
                                },
                                'pav:createdOn': {
                                    '@type': 'xsd:dateTime',
                                },
                            },
                            additionalProperties: false,
                            type: 'object',
                            title: 'Biosample pathogen cl 1 0 attributes element schema',
                            description: 'Biosample pathogen cl 1 0 attributes element schema autogenerated by the CEDAR Template Editor',
                            'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                            'pav:lastUpdatedOn': '2016-09-13T10:44:58-07:00',
                            'pav:createdOn': '2016-09-13T10:44:58-07:00',
                            _valueConstraints: {
                                requiredValue: false,
                            },
                            'schema:schemaVersion': '1.6.0',
                            'pav:version': '0.0.1',
                            'schema:description': 'Biosample pathogen cl 1 0 attributes',
                            '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                            _ui: {
                                order: [
                                    'strain',
                                    'collectionDate',
                                    'collectedBy',
                                    'gEOLocationName',
                                    'isolationSource',
                                    'latitude/Longitude',
                                    'host',
                                    'hostDisease',
                                ],
                                propertyLabels: {
                                    isolationSource: 'Isolation Source',
                                    'latitude/Longitude': 'Latitude_ Longitude',
                                    collectionDate: 'Collection Date',
                                    strain: 'Strain',
                                    hostDisease: 'Host Disease',
                                    gEOLocationName: 'G Eo Location Name',
                                    host: 'Host',
                                    collectedBy: 'Collected By',
                                },
                            },
                            $schema: 'http://json-schema.org/draft-04/schema#',
                        },
                        package: {
                            _ui: {
                                inputType: 'textfield',
                            },
                            'schema:name': 'Package',
                            'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                            required: [
                                '@value',
                            ],
                            '@id': 'https://repo.metadatacenter.net/template-fields/56f8b9b3-3805-448f-bfe4-b7832f168c39',
                            '@context': {
                                'schema:name': {
                                    '@type': 'xsd:string',
                                },
                                schema: 'http://schema.org/',
                                'pav:createdBy': {
                                    '@type': '@id',
                                },
                                xsd: 'http://www.w3.org/2001/XMLSchema#',
                                'oslc:modifiedBy': {
                                    '@type': '@id',
                                },
                                skos: 'http://www.w3.org/2004/02/skos/core#',
                                'pav:lastUpdatedOn': {
                                    '@type': 'xsd:dateTime',
                                },
                                oslc: 'http://open-services.net/ns/core#',
                                'skos:prefLabel': {
                                    '@type': 'xsd:string',
                                },
                                pav: 'http://purl.org/pav/',
                                'skos:altLabel': {
                                    '@type': 'xsd:string',
                                },
                                'schema:description': {
                                    '@type': 'xsd:string',
                                },
                                'pav:createdOn': {
                                    '@type': 'xsd:dateTime',
                                },
                            },
                            additionalProperties: false,
                            type: 'object',
                            title: 'Package field schema',
                            description: 'Package field schema autogenerated by the CEDAR Template Editor',
                            'pav:lastUpdatedOn': '2016-09-13T10:44:58-07:00',
                            'pav:createdOn': '2016-09-13T10:44:58-07:00',
                            _valueConstraints: {
                                requiredValue: false,
                            },
                            'schema:schemaVersion': '1.6.0',
                            properties: {
                                '@value': {
                                    type: [
                                        'string',
                                        'null',
                                    ],
                                },
                                '@type': {
                                    oneOf: [
                                        {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        {
                                            minItems: 1,
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                                format: 'uri',
                                            },
                                            uniqueItems: true,
                                        },
                                    ],
                                },
                                'rdfs:label': {
                                    type: [
                                        'string',
                                        'null',
                                    ],
                                },
                            },
                            'schema:description': '',
                            '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                            'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                            $schema: 'http://json-schema.org/draft-04/schema#',
                        },
                        '@type': {
                            oneOf: [
                                {
                                    type: 'string',
                                    format: 'uri',
                                },
                                {
                                    minItems: 1,
                                    type: 'array',
                                    items: {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    uniqueItems: true,
                                },
                            ],
                        },
                        bioSampleDescriptor: {
                            'bibo:status': 'bibo:draft',
                            'schema:name': 'BioSample Descriptor',
                            properties: {
                                externalLink: {
                                    _ui: {
                                        inputType: 'textfield',
                                    },
                                    'schema:name': 'External Link',
                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    required: [
                                        '@value',
                                    ],
                                    '@id': 'https://repo.metadatacenter.net/template-fields/47d7a72d-e578-4106-8e9b-40a5a6f3ef84',
                                    '@context': {
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        schema: 'http://schema.org/',
                                        'pav:createdBy': {
                                            '@type': '@id',
                                        },
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        'oslc:modifiedBy': {
                                            '@type': '@id',
                                        },
                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                        'pav:lastUpdatedOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                        oslc: 'http://open-services.net/ns/core#',
                                        'skos:prefLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        pav: 'http://purl.org/pav/',
                                        'skos:altLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'pav:createdOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                    },
                                    additionalProperties: false,
                                    type: 'object',
                                    title: 'External link field schema',
                                    description: 'External link field schema autogenerated by the CEDAR Template Editor',
                                    'pav:lastUpdatedOn': '2016-09-13T10:32:26-07:00',
                                    'pav:createdOn': '2016-09-13T10:32:26-07:00',
                                    _valueConstraints: {
                                        requiredValue: false,
                                    },
                                    'schema:schemaVersion': '1.6.0',
                                    properties: {
                                        '@value': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    minItems: 1,
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        'rdfs:label': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                    },
                                    'schema:description': '',
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                                '@context': {
                                    additionalProperties: false,
                                    type: 'object',
                                    required: [
                                        'title',
                                        'description',
                                        'externalLink',
                                    ],
                                    properties: {
                                        title: {
                                            enum: [
                                                'https://schema.metadatacenter.net/properties/title',
                                            ],
                                        },
                                        description: {
                                            enum: [
                                                'https://schema.metadatacenter.net/properties/description',
                                            ],
                                        },
                                        externalLink: {
                                            enum: [
                                                'https://schema.metadatacenter.net/properties/externalLink',
                                            ],
                                        },
                                    },
                                },
                                title: {
                                    _ui: {
                                        inputType: 'textfield',
                                    },
                                    'schema:name': 'Title',
                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    required: [
                                        '@value',
                                    ],
                                    '@id': 'https://repo.metadatacenter.net/template-fields/34f6c221-667d-4255-93a8-dcabe46939d8',
                                    '@context': {
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        schema: 'http://schema.org/',
                                        'pav:createdBy': {
                                            '@type': '@id',
                                        },
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        'oslc:modifiedBy': {
                                            '@type': '@id',
                                        },
                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                        'pav:lastUpdatedOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                        oslc: 'http://open-services.net/ns/core#',
                                        'skos:prefLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        pav: 'http://purl.org/pav/',
                                        'skos:altLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'pav:createdOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                    },
                                    additionalProperties: false,
                                    type: 'object',
                                    title: 'Title field schema',
                                    description: 'Title field schema autogenerated by the CEDAR Template Editor',
                                    'pav:lastUpdatedOn': '2016-09-13T10:32:26-07:00',
                                    'pav:createdOn': '2016-09-13T10:32:26-07:00',
                                    _valueConstraints: {
                                        requiredValue: false,
                                    },
                                    'schema:schemaVersion': '1.6.0',
                                    properties: {
                                        '@value': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    minItems: 1,
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        'rdfs:label': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                    },
                                    'schema:description': '',
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                                description: {
                                    _ui: {
                                        inputType: 'textfield',
                                    },
                                    'schema:name': 'Description',
                                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    required: [
                                        '@value',
                                    ],
                                    '@id': 'https://repo.metadatacenter.net/template-fields/fb9e046f-e9ac-4e54-bc78-2603c9338152',
                                    '@context': {
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        schema: 'http://schema.org/',
                                        'pav:createdBy': {
                                            '@type': '@id',
                                        },
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        'oslc:modifiedBy': {
                                            '@type': '@id',
                                        },
                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                        'pav:lastUpdatedOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                        oslc: 'http://open-services.net/ns/core#',
                                        'skos:prefLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        pav: 'http://purl.org/pav/',
                                        'skos:altLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'pav:createdOn': {
                                            '@type': 'xsd:dateTime',
                                        },
                                    },
                                    additionalProperties: false,
                                    type: 'object',
                                    title: 'Description field schema',
                                    description: 'Description field schema autogenerated by the CEDAR Template Editor',
                                    'pav:lastUpdatedOn': '2016-09-13T10:32:26-07:00',
                                    'pav:createdOn': '2016-09-13T10:32:26-07:00',
                                    _valueConstraints: {
                                        requiredValue: false,
                                    },
                                    'schema:schemaVersion': '1.6.0',
                                    properties: {
                                        '@value': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    minItems: 1,
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        'rdfs:label': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                    },
                                    'schema:description': '',
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                                '@type': {
                                    oneOf: [
                                        {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        {
                                            minItems: 1,
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                                format: 'uri',
                                            },
                                            uniqueItems: true,
                                        },
                                    ],
                                },
                                '@id': {
                                    type: 'string',
                                    format: 'uri',
                                },
                            },
                            'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                            required: [
                                '@context',
                                '@id',
                                'description',
                                'title',
                                'externalLink',
                            ],
                            '@id': 'https://repo.metadatacenter.net/template-elements/59157574-4b8a-4f45-8ee1-9081c3ab24c8',
                            '@context': {
                                'pav:lastUpdatedOn': {
                                    '@type': 'xsd:dateTime',
                                },
                                'schema:name': {
                                    '@type': 'xsd:string',
                                },
                                schema: 'http://schema.org/',
                                'pav:createdBy': {
                                    '@type': '@id',
                                },
                                xsd: 'http://www.w3.org/2001/XMLSchema#',
                                bibo: 'http://purl.org/ontology/bibo/',
                                pav: 'http://purl.org/pav/',
                                oslc: 'http://open-services.net/ns/core#',
                                'oslc:modifiedBy': {
                                    '@type': '@id',
                                },
                                'schema:description': {
                                    '@type': 'xsd:string',
                                },
                                'pav:createdOn': {
                                    '@type': 'xsd:dateTime',
                                },
                            },
                            additionalProperties: false,
                            type: 'object',
                            title: 'Biosample descriptor element schema',
                            description: 'Biosample descriptor element schema autogenerated by the CEDAR Template Editor',
                            'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                            'pav:lastUpdatedOn': '2016-09-13T10:44:58-07:00',
                            'pav:createdOn': '2016-09-13T10:44:58-07:00',
                            _valueConstraints: {
                                requiredValue: false,
                            },
                            'schema:schemaVersion': '1.6.0',
                            'pav:version': '0.0.1',
                            'schema:description': 'BioSample Descriptor',
                            '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                            _ui: {
                                order: [
                                    'title',
                                    'description',
                                    'externalLink',
                                ],
                                propertyLabels: {
                                    title: 'Title',
                                    description: 'Description',
                                    externalLink: 'External Link',
                                },
                            },
                            $schema: 'http://json-schema.org/draft-04/schema#',
                        },
                    },
                    'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                    required: [
                        '@context',
                        '@id',
                        'package',
                        'biosamplePathogenCl10Attributes',
                        'bioSampleAttribute',
                        'bioSampleSampleID',
                        'bioProjectID',
                        'bioSampleDescriptor',
                        'nCBIOrganism',
                    ],
                    '@id': 'https://repo.metadatacenter.net/template-elements/3e8e812c-ba32-4ef7-8820-cffe8206fb2c',
                    '@context': {
                        'pav:lastUpdatedOn': {
                            '@type': 'xsd:dateTime',
                        },
                        'schema:name': {
                            '@type': 'xsd:string',
                        },
                        schema: 'http://schema.org/',
                        'pav:createdBy': {
                            '@type': '@id',
                        },
                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                        bibo: 'http://purl.org/ontology/bibo/',
                        pav: 'http://purl.org/pav/',
                        oslc: 'http://open-services.net/ns/core#',
                        'oslc:modifiedBy': {
                            '@type': '@id',
                        },
                        'schema:description': {
                            '@type': 'xsd:string',
                        },
                        'pav:createdOn': {
                            '@type': 'xsd:dateTime',
                        },
                    },
                    additionalProperties: false,
                    type: 'object',
                    title: 'Biosample element schema',
                    description: 'Biosample element schema autogenerated by the CEDAR Template Editor',
                    'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
                    'pav:lastUpdatedOn': '2016-09-13T10:45:24-07:00',
                    'pav:createdOn': '2016-09-13T10:45:24-07:00',
                    _valueConstraints: {
                        requiredValue: false,
                    },
                    'schema:schemaVersion': '1.6.0',
                    'pav:version': '0.0.1',
                    'schema:description': 'Description',
                    '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                    _ui: {
                        order: [
                            'bioProjectID',
                            'package',
                            'bioSampleSampleID',
                            'bioSampleDescriptor',
                            'nCBIOrganism',
                            'biosamplePathogenCl10Attributes',
                            'bioSampleAttribute',
                        ],
                        propertyLabels: {
                            bioSampleAttribute: 'Bio Sample Attribute',
                            bioProjectID: 'Bio Project Id',
                            nCBIOrganism: 'N Cbi Organism',
                            bioSampleSampleID: 'Bio Sample Sample Id',
                            biosamplePathogenCl10Attributes: 'Biosample Pathogen Cl10 Attributes',
                            package: 'Package',
                            bioSampleDescriptor: 'Bio Sample Descriptor',
                        },
                    },
                    $schema: 'http://json-schema.org/draft-04/schema#',
                },
                'pav:lastUpdatedOn': {
                    type: [
                        'string',
                        'null',
                    ],
                    format: 'date-time',
                },
                'pav:createdOn': {
                    type: [
                        'string',
                        'null',
                    ],
                    format: 'date-time',
                },
                'schema:description': {
                    type: 'string',
                },
                '@type': {
                    oneOf: [
                        {
                            type: 'string',
                            format: 'uri',
                        },
                        {
                            minItems: 1,
                            type: 'array',
                            items: {
                                type: 'string',
                                format: 'uri',
                            },
                            uniqueItems: true,
                        },
                    ],
                },
                '@id': {
                    type: [
                        'string',
                        'null',
                    ],
                    format: 'uri',
                },
            },
            'oslc:modifiedBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
            required: [
                '@context',
                '@id',
                'schema:isBasedOn',
                'schema:name',
                'schema:description',
                'pav:createdOn',
                'pav:createdBy',
                'pav:lastUpdatedOn',
                'oslc:modifiedBy',
                'nCBISubmissionDescription',
                'bioSample',
            ],
            '@context': {
                'pav:lastUpdatedOn': {
                    '@type': 'xsd:dateTime',
                },
                'schema:name': {
                    '@type': 'xsd:string',
                },
                schema: 'http://schema.org/',
                'pav:createdBy': {
                    '@type': '@id',
                },
                xsd: 'http://www.w3.org/2001/XMLSchema#',
                bibo: 'http://purl.org/ontology/bibo/',
                pav: 'http://purl.org/pav/',
                oslc: 'http://open-services.net/ns/core#',
                'oslc:modifiedBy': {
                    '@type': '@id',
                },
                'schema:description': {
                    '@type': 'xsd:string',
                },
                'pav:createdOn': {
                    '@type': 'xsd:dateTime',
                },
            },
            '@id': 'https://repo.metadatacenter.net/templates/58098c2d-dea9-4ec6-8f5d-d85d5f1b4f6f',
            type: 'object',
            title: 'Biosample submission template schema',
            description: 'Biosample submission template schema generated by the CEDAR Template Editor 2.6.44',
            'pav:lastUpdatedOn': '2016-09-13T10:45:24-07:00',
            'pav:createdOn': '2016-09-13T10:11:03-07:00',
            additionalProperties: false,
            'bibo:status': 'bibo:draft',
            'schema:schemaVersion': '1.6.0',
            'pav:version': '0.0.1',
            'schema:description': 'BioSample Submission Template',
            '@type': 'https://schema.metadatacenter.org/core/Template',
            'pav:createdBy': 'https://repo.metadatacenter.net/users/6d21a887-b704-49a9-922a-aa71632f3232',
            $schema: 'http://json-schema.org/draft-04/schema#',
        }),
        templateVersion: 1,
    },
    {
        id: '3',
        schemaName: 'Ffis funder draft template schema',
        cedarId: 'https://repo.metadatacenter.org/templates/352a29d7-3df8-4bdd-bd75-e09d16c7063d',
        active: true,
        template: Object({
            description: 'Ffis funder draft template schema generated by the CEDAR Template Editor 2.6.44',
        }),
        templateVersion: 1,
    },
    {
        id: '1',
        schemaName: 'License field schema',
        cedarId: 'https://repo.metadatacenter.org/template-fields/8b51634a-42df-414b-be27-6cfdfb611591',
        active: true,
        template: Object({
            description: 'License field schema generated by the CEDAR Template Editor 2.4.10',
        }),
        templateVersion: 1,
    },
];

export default cedarMetadataTemplates as CedarMetadataTemplateModel[];
