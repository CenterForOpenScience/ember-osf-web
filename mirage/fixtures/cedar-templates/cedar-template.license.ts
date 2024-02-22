/* eslint-disable max-len */
export const licenseTemplate = Object({
    _ui: {
        order: [
            'BIDS Dataset Description Element',
        ],
        pages: [],
        propertyLabels: {
            'BIDS Dataset Description Element': 'BIDS Dataset Description',
        },
        propertyDescriptions: {
            'BIDS Dataset Description Element': 'Describes the core attributes of the dataset. Every dataset MUST include a description with these metadata fields.',
        },
    },
    'schema:name': 'BIDS Dataset Description',
    properties: {
        'schema:isBasedOn': {
            type: 'string',
            format: 'uri',
        },
        'schema:name': {
            type: 'string',
            minLength: 1,
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
                'pav',
                'schema',
                'oslc',
                'schema:isBasedOn',
                'schema:name',
                'schema:description',
                'pav:createdOn',
                'pav:createdBy',
                'pav:lastUpdatedOn',
                'oslc:modifiedBy',
                'BIDS Dataset Description Element',
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
                schema: {
                    enum: [
                        'http://schema.org/',
                    ],
                    type: 'string',
                    format: 'uri',
                },
                pav: {
                    enum: [
                        'http://purl.org/pav/',
                    ],
                    type: 'string',
                    format: 'uri',
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
                'BIDS Dataset Description Element': {
                    enum: [
                        'https://schema.metadatacenter.org/properties/6e3dbb08-1c81-426a-b2fb-aab3ed61328a',
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
            },
        },
        'oslc:modifiedBy': {
            type: [
                'string',
                'null',
            ],
            format: 'uri',
        },
        'pav:derivedFrom': {
            type: 'string',
            format: 'uri',
        },
        'pav:lastUpdatedOn': {
            type: [
                'string',
                'null',
            ],
            format: 'date-time',
        },
        '@id': {
            type: [
                'string',
                'null',
            ],
            format: 'uri',
        },
        'BIDS Dataset Description Element': {
            _ui: {
                order: [
                    'Dataset Name',
                    'BIDSVersion',
                    'DatasetType',
                    'License',
                    'LicenseIdentifier',
                    'Authors',
                    'Acknowledgments',
                    'HowToAcknowledge',
                    'Funding',
                    'EthicsApprovals',
                    'ReferencesAndLinks',
                    'DatasetDOI',
                ],
                propertyLabels: {
                    License: 'License',
                    LicenseIdentifier: 'LicenseIdentifier',
                    DatasetDOI: 'DatasetDOI',
                    Funding: 'Funding',
                    DatasetType: 'DatasetType',
                    ReferencesAndLinks: 'ReferencesAndLinks',
                    Authors: 'Authors',
                    EthicsApprovals: 'EthicsApprovals',
                    'Dataset Name': 'Dataset Name',
                    HowToAcknowledge: 'HowToAcknowledge',
                    Acknowledgments: 'Acknowledgments',
                    BIDSVersion: 'BIDSVersion',
                },
                propertyDescriptions: {
                    License: 'The license for the dataset. The use of license name abbreviations is RECOMMENDED for specifying a license (see Appendix II). The corresponding full license text MAY be specified in an additional LICENSE file. (RECOMMENDED)',
                    LicenseIdentifier: 'The license for the dataset. The use of license name identifiers is RECOMMENDED for specifying a license (see Appendix II). The corresponding full license text MAY be specified in an additional LICENSE file. (RECOMMENDED)',
                    DatasetDOI: 'The Document Object Identifier of the dataset (not the corresponding paper). (OPTIONAL)',
                    Funding: 'List of sources of funding (grant numbers). (OPTIONAL)',
                    DatasetType: 'The interpretation of the dataset. MUST be one of "raw" or "derivative". For backwards compatibility, the default value is "raw". (RECOMMENDED)',
                    ReferencesAndLinks: 'List of references to publication that contain information on the dataset, or links. (OPTIONAL)',
                    Authors: 'List of individuals who contributed to the creation/curation of the dataset. (OPTIONAL)',
                    EthicsApprovals: 'List of ethics committee approvals of the research protocols and/or protocol identifiers. (OPTIONAL)',
                    'Dataset Name': 'Name of the dataset. (REQUIRED)',
                    HowToAcknowledge: 'Text containing instructions on how researchers using this dataset should acknowledge the original authors. This field can also be used to define a publication that should be cited in publications that use the dataset. (OPTIONAL)',
                    Acknowledgments: 'Text acknowledging contributions of individuals or institutions beyond those listed in Authors or Funding. (OPTIONAL)',
                    BIDSVersion: 'The version of the BIDS standard that was used. (REQUIRED)',
                },
            },
            'schema:name': 'BIDS Dataset Description Element',
            properties: {
                License: {
                    _ui: {
                        inputType: 'textfield',
                    },
                    'schema:name': 'License',
                    'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                    required: [
                        '@value',
                    ],
                    '@id': 'https://repo.metadatacenter.org/template-fields/8b51634a-42df-414b-be27-6cfdfb611591',
                    '@context': {
                        'schema:name': {
                            '@type': 'xsd:string',
                        },
                        schema: 'http://schema.org/',
                        pav: 'http://purl.org/pav/',
                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                        bibo: 'http://purl.org/ontology/bibo/',
                        'pav:createdOn': {
                            '@type': 'xsd:dateTime',
                        },
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
                        'skos:altLabel': {
                            '@type': 'xsd:string',
                        },
                        'schema:description': {
                            '@type': 'xsd:string',
                        },
                        'pav:createdBy': {
                            '@type': '@id',
                        },
                    },
                    additionalProperties: false,
                    type: 'object',
                    title: 'License field schema',
                    description: 'License field schema generated by the CEDAR Template Editor 2.4.10',
                    'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                    'pav:lastUpdatedOn': '2020-07-07T11:38:20-07:00',
                    'pav:createdOn': '2020-07-07T11:38:20-07:00',
                    'skos:prefLabel': 'License for the dataset',
                    'schema:schemaVersion': '1.6.0',
                    _valueConstraints: {
                        requiredValue: false,
                    },
                    'schema:description': 'The license for the dataset. The use of license name abbreviations is RECOMMENDED for specifying a license (see Appendix II). The corresponding full license text MAY be specified in an additional LICENSE file. (RECOMMENDED)',
                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
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
                    $schema: 'http://json-schema.org/draft-04/schema#',
                },
                LicenseIdentifier: {
                    _ui: {
                        inputType: 'textfield',
                    },
                    'schema:name': 'LicenseIdentifier',
                    'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                    'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                    '@context': {
                        'schema:name': {
                            '@type': 'xsd:string',
                        },
                        schema: 'http://schema.org/',
                        pav: 'http://purl.org/pav/',
                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                        bibo: 'http://purl.org/ontology/bibo/',
                        'pav:createdOn': {
                            '@type': 'xsd:dateTime',
                        },
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
                        'skos:altLabel': {
                            '@type': 'xsd:string',
                        },
                        'schema:description': {
                            '@type': 'xsd:string',
                        },
                        'pav:createdBy': {
                            '@type': '@id',
                        },
                    },
                    _valueConstraints: {
                        valueSets: [],
                        multipleChoice: false,
                        ontologies: [],
                        branches: [
                            {
                                uri: 'http://www.ebi.ac.uk/swo/SWO_0000002',
                                source: 'Software Ontology (SWO)',
                                name: 'licence',
                                acronym: 'SWO',
                                maxDepth: 0,
                            },
                        ],
                        classes: [],
                        requiredValue: false,
                    },
                    type: 'object',
                    title: 'LicenseIdentifier field schema',
                    description: 'LicenseIdentifier field schema generated by the CEDAR Template Editor 2.4.10',
                    'pav:lastUpdatedOn': '2020-07-07T11:38:20-07:00',
                    'pav:createdOn': '2020-07-07T11:38:20-07:00',
                    'skos:prefLabel': 'License Unique Identifier',
                    additionalProperties: false,
                    'schema:schemaVersion': '1.6.0',
                    properties: {
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
                        '@id': {
                            type: 'string',
                            format: 'uri',
                        },
                    },
                    'schema:description': 'The license for the dataset. The use of license name identifiers is RECOMMENDED for specifying a license (see Appendix II). The corresponding full license text MAY be specified in an additional LICENSE file. (RECOMMENDED)',
                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                    '@id': 'https://repo.metadatacenter.org/template-fields/37ea1310-3ddf-4b43-919f-d44a33843da2',
                    $schema: 'http://json-schema.org/draft-04/schema#',
                },
                DatasetDOI: {
                    _ui: {
                        inputType: 'textfield',
                    },
                    'schema:name': 'DatasetDOI',
                    'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                    required: [
                        '@value',
                    ],
                    '@id': 'https://repo.metadatacenter.org/template-fields/c062c2c3-73ed-4f6e-9c06-eede054bc354',
                    '@context': {
                        'schema:name': {
                            '@type': 'xsd:string',
                        },
                        schema: 'http://schema.org/',
                        pav: 'http://purl.org/pav/',
                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                        bibo: 'http://purl.org/ontology/bibo/',
                        'pav:createdOn': {
                            '@type': 'xsd:dateTime',
                        },
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
                        'skos:altLabel': {
                            '@type': 'xsd:string',
                        },
                        'schema:description': {
                            '@type': 'xsd:string',
                        },
                        'pav:createdBy': {
                            '@type': '@id',
                        },
                    },
                    additionalProperties: false,
                    type: 'object',
                    title: 'DatasetDOI field schema',
                    description: 'DatasetDOI field schema generated by the CEDAR Template Editor 2.4.10',
                    'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                    'pav:lastUpdatedOn': '2020-07-07T11:38:20-07:00',
                    'pav:createdOn': '2020-07-07T11:38:20-07:00',
                    'skos:prefLabel': 'Dataset DOI',
                    'schema:schemaVersion': '1.6.0',
                    _valueConstraints: {
                        requiredValue: false,
                    },
                    'schema:description': 'The Document Object Identifier of the dataset (not the corresponding paper). (OPTIONAL)',
                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
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
                    $schema: 'http://json-schema.org/draft-04/schema#',
                },
                '@context': {
                    additionalProperties: false,
                    type: 'object',
                    required: [
                        'Dataset Name',
                        'BIDSVersion',
                        'DatasetType',
                        'License',
                        'Authors',
                        'Acknowledgments',
                        'HowToAcknowledge',
                        'Funding',
                        'EthicsApprovals',
                        'ReferencesAndLinks',
                        'DatasetDOI',
                        'LicenseIdentifier',
                    ],
                    properties: {
                        License: {
                            enum: [
                                'https://schema.metadatacenter.org/properties/a1baf578-bd75-44fe-8b7b-44507dd01932',
                            ],
                        },
                        LicenseIdentifier: {
                            enum: [
                                'https://schema.metadatacenter.org/properties/96bbc310-6f7a-4dec-8609-9b9903264f4d',
                            ],
                        },
                        DatasetDOI: {
                            enum: [
                                'https://schema.metadatacenter.org/properties/c9bd415d-d825-4e86-8030-610f52095943',
                            ],
                        },
                        Funding: {
                            enum: [
                                'https://schema.metadatacenter.org/properties/21fd5425-b211-4edb-a45b-3ed278882d7c',
                            ],
                        },
                        DatasetType: {
                            enum: [
                                'https://schema.metadatacenter.org/properties/08898a4d-dabf-4454-8d2b-fd0e8c6fd793',
                            ],
                        },
                        ReferencesAndLinks: {
                            enum: [
                                'https://schema.metadatacenter.org/properties/797a193f-85da-47f4-a136-fce3a102f86c',
                            ],
                        },
                        Authors: {
                            enum: [
                                'https://schema.metadatacenter.org/properties/1908edf4-4913-4d33-b322-ce93481d541f',
                            ],
                        },
                        EthicsApprovals: {
                            enum: [
                                'https://schema.metadatacenter.org/properties/22ee66f5-bb32-40f7-9474-6f9f5d9189b7',
                            ],
                        },
                        'Dataset Name': {
                            enum: [
                                'http://rs.tdwg.org/dwc/terms/datasetName',
                            ],
                        },
                        HowToAcknowledge: {
                            enum: [
                                'https://schema.metadatacenter.org/properties/3f978fe7-aee6-4ca6-971a-46baf75f1dc0',
                            ],
                        },
                        Acknowledgments: {
                            enum: [
                                'https://schema.metadatacenter.org/properties/3fa93aae-66c5-4ab8-93a8-cb3bf802dd10',
                            ],
                        },
                        BIDSVersion: {
                            enum: [
                                'https://schema.metadatacenter.org/properties/19f74b03-5317-4403-88fa-d102f4dcc729',
                            ],
                        },
                    },
                },
                DatasetType: {
                    _ui: {
                        inputType: 'radio',
                    },
                    'schema:name': 'DatasetType',
                    'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                    required: [
                        '@value',
                    ],
                    '@id': 'https://repo.metadatacenter.org/template-fields/6cb73ef8-02b5-430c-82dd-3c81dc25830b',
                    '@context': {
                        'schema:name': {
                            '@type': 'xsd:string',
                        },
                        schema: 'http://schema.org/',
                        pav: 'http://purl.org/pav/',
                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                        bibo: 'http://purl.org/ontology/bibo/',
                        'pav:createdOn': {
                            '@type': 'xsd:dateTime',
                        },
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
                        'skos:altLabel': {
                            '@type': 'xsd:string',
                        },
                        'schema:description': {
                            '@type': 'xsd:string',
                        },
                        'pav:createdBy': {
                            '@type': '@id',
                        },
                    },
                    additionalProperties: false,
                    type: 'object',
                    title: 'DatasetType field schema',
                    description: 'DatasetType field schema generated by the CEDAR Template Editor 2.4.10',
                    'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                    'pav:lastUpdatedOn': '2020-07-07T11:38:20-07:00',
                    'pav:createdOn': '2020-07-07T11:38:20-07:00',
                    'skos:prefLabel': 'Dataset Interpretation Type',
                    'schema:schemaVersion': '1.6.0',
                    _valueConstraints: {
                        multipleChoice: false,
                        literals: [
                            {
                                label: 'raw',
                                selectedByDefault: true,
                            },
                            {
                                label: 'derivative',
                            },
                        ],
                        requiredValue: false,
                    },
                    'schema:description': 'The interpretation of the dataset. MUST be one of "raw" or "derivative". For backwards compatibility, the default value is "raw". (RECOMMENDED)',
                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
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
                    $schema: 'http://json-schema.org/draft-04/schema#',
                },
                ReferencesAndLinks: {
                    minItems: 1,
                    type: 'array',
                    items: {
                        _ui: {
                            inputType: 'textfield',
                        },
                        'schema:name': 'ReferencesAndLinks',
                        'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                        required: [
                            '@value',
                        ],
                        '@context': {
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            schema: 'http://schema.org/',
                            pav: 'http://purl.org/pav/',
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            bibo: 'http://purl.org/ontology/bibo/',
                            'pav:createdOn': {
                                '@type': 'xsd:dateTime',
                            },
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
                            'skos:altLabel': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'pav:createdBy': {
                                '@type': '@id',
                            },
                        },
                        additionalProperties: false,
                        type: 'object',
                        title: 'ReferencesAndLinks field schema',
                        description: 'ReferencesAndLinks field schema generated by the CEDAR Template Editor 2.4.10',
                        'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                        'pav:lastUpdatedOn': '2020-07-07T11:38:20-07:00',
                        'schema:description': 'List of references to publication that contain information on the dataset, or links. (OPTIONAL)',
                        'pav:createdOn': '2020-07-07T11:38:20-07:00',
                        'skos:prefLabel': 'References and Links',
                        '@id': 'https://repo.metadatacenter.org/template-fields/3222ce8c-2b5f-4558-9237-41b76e6a6f5d',
                        _valueConstraints: {
                            requiredValue: false,
                        },
                        'schema:schemaVersion': '1.6.0',
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
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
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                },
                Funding: {
                    minItems: 1,
                    type: 'array',
                    items: {
                        _ui: {
                            inputType: 'textfield',
                        },
                        'schema:name': 'Funding',
                        'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                        required: [
                            '@value',
                        ],
                        '@context': {
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            schema: 'http://schema.org/',
                            pav: 'http://purl.org/pav/',
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            bibo: 'http://purl.org/ontology/bibo/',
                            'pav:createdOn': {
                                '@type': 'xsd:dateTime',
                            },
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
                            'skos:altLabel': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'pav:createdBy': {
                                '@type': '@id',
                            },
                        },
                        additionalProperties: false,
                        type: 'object',
                        title: 'Funding field schema',
                        description: 'Funding field schema generated by the CEDAR Template Editor 2.4.10',
                        'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                        'pav:lastUpdatedOn': '2020-07-07T11:38:20-07:00',
                        'schema:description': 'List of sources of funding (grant numbers). (OPTIONAL)',
                        'pav:createdOn': '2020-07-07T11:38:20-07:00',
                        'skos:prefLabel': 'Funding Source(s)',
                        '@id': 'https://repo.metadatacenter.org/template-fields/e913e50d-b390-4735-8fcb-6af35a423332',
                        _valueConstraints: {
                            requiredValue: false,
                        },
                        'schema:schemaVersion': '1.6.0',
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
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
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                },
                Authors: {
                    minItems: 1,
                    type: 'array',
                    items: {
                        _ui: {
                            inputType: 'textfield',
                        },
                        'schema:name': 'Authors',
                        'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                        required: [
                            '@value',
                        ],
                        '@context': {
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            schema: 'http://schema.org/',
                            pav: 'http://purl.org/pav/',
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            bibo: 'http://purl.org/ontology/bibo/',
                            'pav:createdOn': {
                                '@type': 'xsd:dateTime',
                            },
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
                            'skos:altLabel': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'pav:createdBy': {
                                '@type': '@id',
                            },
                        },
                        additionalProperties: false,
                        type: 'object',
                        title: 'Authors field schema',
                        description: 'Authors field schema generated by the CEDAR Template Editor 2.4.10',
                        'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                        'pav:lastUpdatedOn': '2020-07-07T11:38:20-07:00',
                        'schema:description': 'List of individuals who contributed to the creation/curation of the dataset. (OPTIONAL)',
                        'pav:createdOn': '2020-07-07T11:38:20-07:00',
                        'skos:prefLabel': 'Author(s) contributing to dataset',
                        '@id': 'https://repo.metadatacenter.org/template-fields/f3a0e9ea-2e08-4a05-9420-bc00b8ecb854',
                        _valueConstraints: {
                            requiredValue: false,
                        },
                        'schema:schemaVersion': '1.6.0',
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
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
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                },
                EthicsApprovals: {
                    minItems: 1,
                    type: 'array',
                    items: {
                        _ui: {
                            inputType: 'textfield',
                        },
                        'schema:name': 'EthicsApprovals',
                        'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                        required: [
                            '@value',
                        ],
                        '@context': {
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            schema: 'http://schema.org/',
                            pav: 'http://purl.org/pav/',
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            bibo: 'http://purl.org/ontology/bibo/',
                            'pav:createdOn': {
                                '@type': 'xsd:dateTime',
                            },
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
                            'skos:altLabel': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'pav:createdBy': {
                                '@type': '@id',
                            },
                        },
                        additionalProperties: false,
                        type: 'object',
                        title: 'EthicsApprovals field schema',
                        description: 'EthicsApprovals field schema generated by the CEDAR Template Editor 2.4.10',
                        'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                        'pav:lastUpdatedOn': '2020-07-07T11:38:20-07:00',
                        'schema:description': 'List of ethics committee approvals of the research protocols and/or protocol identifiers. (OPTIONAL)',
                        'pav:createdOn': '2020-07-07T11:38:20-07:00',
                        'skos:prefLabel': 'Ethics Approval(s)',
                        '@id': 'https://repo.metadatacenter.org/template-fields/ad63b154-bda0-4654-801d-5c875242c793',
                        _valueConstraints: {
                            requiredValue: false,
                        },
                        'schema:schemaVersion': '1.6.0',
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
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
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                },
                '@id': {
                    type: 'string',
                    format: 'uri',
                },
                'Dataset Name': {
                    _ui: {
                        inputType: 'textfield',
                    },
                    'schema:name': 'Dataset Name',
                    'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                    required: [
                        '@value',
                    ],
                    '@id': 'https://repo.metadatacenter.org/template-fields/b67ce7d7-2de2-43c2-a4ff-4f6041c2002a',
                    '@context': {
                        'schema:name': {
                            '@type': 'xsd:string',
                        },
                        schema: 'http://schema.org/',
                        pav: 'http://purl.org/pav/',
                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                        bibo: 'http://purl.org/ontology/bibo/',
                        'pav:createdOn': {
                            '@type': 'xsd:dateTime',
                        },
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
                        'skos:altLabel': {
                            '@type': 'xsd:string',
                        },
                        'schema:description': {
                            '@type': 'xsd:string',
                        },
                        'pav:createdBy': {
                            '@type': '@id',
                        },
                    },
                    additionalProperties: false,
                    type: 'object',
                    title: 'Dataset Name field schema',
                    description: 'Dataset Name field schema generated by the CEDAR Template Editor 2.4.10',
                    'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                    'pav:lastUpdatedOn': '2020-07-07T11:38:20-07:00',
                    'pav:createdOn': '2020-07-07T11:38:20-07:00',
                    'skos:prefLabel': 'Dataset Name',
                    'schema:schemaVersion': '1.6.0',
                    _valueConstraints: {
                        requiredValue: true,
                    },
                    'schema:description': 'Name of the dataset. (REQUIRED)',
                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
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
                    $schema: 'http://json-schema.org/draft-04/schema#',
                },
                HowToAcknowledge: {
                    _ui: {
                        inputType: 'textarea',
                    },
                    'schema:name': 'HowToAcknowledge',
                    'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                    required: [
                        '@value',
                    ],
                    '@id': 'https://repo.metadatacenter.org/template-fields/3f32e69e-0be1-4154-8082-c8b0511a5dcc',
                    '@context': {
                        'schema:name': {
                            '@type': 'xsd:string',
                        },
                        schema: 'http://schema.org/',
                        pav: 'http://purl.org/pav/',
                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                        bibo: 'http://purl.org/ontology/bibo/',
                        'pav:createdOn': {
                            '@type': 'xsd:dateTime',
                        },
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
                        'skos:altLabel': {
                            '@type': 'xsd:string',
                        },
                        'schema:description': {
                            '@type': 'xsd:string',
                        },
                        'pav:createdBy': {
                            '@type': '@id',
                        },
                    },
                    additionalProperties: false,
                    type: 'object',
                    title: 'HowToAcknowledge field schema',
                    description: 'HowToAcknowledge field schema generated by the CEDAR Template Editor 2.4.10',
                    'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                    'pav:lastUpdatedOn': '2020-07-07T11:38:20-07:00',
                    'pav:createdOn': '2020-07-07T11:38:20-07:00',
                    'skos:prefLabel': 'Acknowledgment Instructions',
                    'schema:schemaVersion': '1.6.0',
                    _valueConstraints: {
                        requiredValue: false,
                    },
                    'schema:description': 'Text containing instructions on how researchers using this dataset should acknowledge the original authors. This field can also be used to define a publication that should be cited in publications that use the dataset. (OPTIONAL)',
                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
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
                    $schema: 'http://json-schema.org/draft-04/schema#',
                },
                Acknowledgments: {
                    _ui: {
                        inputType: 'textarea',
                    },
                    'schema:name': 'Acknowledgments',
                    'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                    required: [
                        '@value',
                    ],
                    '@context': {
                        'schema:name': {
                            '@type': 'xsd:string',
                        },
                        schema: 'http://schema.org/',
                        pav: 'http://purl.org/pav/',
                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                        bibo: 'http://purl.org/ontology/bibo/',
                        'pav:createdOn': {
                            '@type': 'xsd:dateTime',
                        },
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
                        'skos:altLabel': {
                            '@type': 'xsd:string',
                        },
                        'schema:description': {
                            '@type': 'xsd:string',
                        },
                        'pav:createdBy': {
                            '@type': '@id',
                        },
                    },
                    _valueConstraints: {
                        requiredValue: false,
                    },
                    type: 'object',
                    title: 'Acknowledgments field schema',
                    description: 'Acknowledgments field schema generated by the CEDAR Template Editor 2.4.10',
                    'pav:lastUpdatedOn': '2020-07-07T11:38:20-07:00',
                    'pav:createdOn': '2020-07-07T11:38:20-07:00',
                    '@id': 'https://repo.metadatacenter.org/template-fields/347e6373-0915-40cb-b584-cd2eaad81890',
                    additionalProperties: false,
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
                    'schema:description': 'Text acknowledging contributions of individuals or institutions beyond those listed in Authors or Funding. (OPTIONAL)',
                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                    'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
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
                BIDSVersion: {
                    _ui: {
                        inputType: 'textfield',
                    },
                    'schema:name': 'BIDSVersion',
                    'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                    required: [
                        '@value',
                    ],
                    '@id': 'https://repo.metadatacenter.org/template-fields/db17f267-5e5e-41f1-96fc-af7c64c9a20a',
                    '@context': {
                        'schema:name': {
                            '@type': 'xsd:string',
                        },
                        schema: 'http://schema.org/',
                        pav: 'http://purl.org/pav/',
                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                        bibo: 'http://purl.org/ontology/bibo/',
                        'pav:createdOn': {
                            '@type': 'xsd:dateTime',
                        },
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
                        'skos:altLabel': {
                            '@type': 'xsd:string',
                        },
                        'schema:description': {
                            '@type': 'xsd:string',
                        },
                        'pav:createdBy': {
                            '@type': '@id',
                        },
                    },
                    additionalProperties: false,
                    type: 'object',
                    title: 'BIDSVersion field schema',
                    description: 'BIDSVersion field schema generated by the CEDAR Template Editor 2.4.10',
                    'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                    'pav:lastUpdatedOn': '2020-07-07T11:38:20-07:00',
                    'pav:createdOn': '2020-07-07T11:38:20-07:00',
                    'skos:prefLabel': 'BIDS Version Used',
                    'schema:schemaVersion': '1.6.0',
                    _valueConstraints: {
                        requiredValue: true,
                    },
                    'schema:description': 'The version of the BIDS standard that was used. (REQUIRED)',
                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
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
                    $schema: 'http://json-schema.org/draft-04/schema#',
                },
            },
            'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
            required: [
                '@context',
                '@id',
                'Dataset Name',
                'BIDSVersion',
                'DatasetType',
                'License',
                'Authors',
                'Acknowledgments',
                'HowToAcknowledge',
                'Funding',
                'EthicsApprovals',
                'ReferencesAndLinks',
                'DatasetDOI',
                'LicenseIdentifier',
            ],
            '@context': {
                'pav:lastUpdatedOn': {
                    '@type': 'xsd:dateTime',
                },
                oslc: 'http://open-services.net/ns/core#',
                schema: 'http://schema.org/',
                'pav:createdBy': {
                    '@type': '@id',
                },
                xsd: 'http://www.w3.org/2001/XMLSchema#',
                'schema:name': {
                    '@type': 'xsd:string',
                },
                'pav:createdOn': {
                    '@type': 'xsd:dateTime',
                },
                'oslc:modifiedBy': {
                    '@type': '@id',
                },
                bibo: 'http://purl.org/ontology/bibo/',
                'schema:description': {
                    '@type': 'xsd:string',
                },
                pav: 'http://purl.org/pav/',
            },
            additionalProperties: false,
            type: 'object',
            title: 'Bids dataset description element element schema',
            description: 'Bids dataset description element element schema generated by the CEDAR Template Editor 2.4.10',
            'pav:lastUpdatedOn': '2020-07-07T11:39:18-07:00',
            'schema:description': 'Describes the core attributes of the dataset. Every dataset MUST include a description with these metadata fields.',
            'pav:createdOn': '2020-07-07T11:39:18-07:00',
            'bibo:status': 'bibo:draft',
            '@id': 'https://repo.metadatacenter.org/template-elements/a23c786c-6fe0-450b-a7f3-aa1e99e39611',
            'pav:version': '0.0.1',
            'schema:schemaVersion': '1.6.0',
            '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
            'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
            $schema: 'http://json-schema.org/draft-04/schema#',
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
        'pav:createdOn': {
            type: [
                'string',
                'null',
            ],
            format: 'date-time',
        },
    },
    'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
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
        'BIDS Dataset Description Element',
    ],
    '@context': {
        'pav:lastUpdatedOn': {
            '@type': 'xsd:dateTime',
        },
        oslc: 'http://open-services.net/ns/core#',
        schema: 'http://schema.org/',
        'pav:createdBy': {
            '@type': '@id',
        },
        xsd: 'http://www.w3.org/2001/XMLSchema#',
        'schema:name': {
            '@type': 'xsd:string',
        },
        'pav:createdOn': {
            '@type': 'xsd:dateTime',
        },
        'oslc:modifiedBy': {
            '@type': '@id',
        },
        bibo: 'http://purl.org/ontology/bibo/',
        'schema:description': {
            '@type': 'xsd:string',
        },
        pav: 'http://purl.org/pav/',
    },
    additionalProperties: false,
    type: 'object',
    title: 'Bids dataset description template schema',
    description: 'Bids dataset description template schema generated by the CEDAR Template Editor 2.6.44',
    'pav:lastUpdatedOn': '2020-07-07T11:39:18-07:00',
    'schema:description': 'Metadata describing a BIDS dataset.',
    'pav:createdOn': '2020-07-07T11:37:30-07:00',
    'bibo:status': 'bibo:draft',
    '@id': 'https://repo.metadatacenter.org/templates/5568fc7b-2e3b-4a13-b893-eda9a6aff5e6',
    'pav:version': '0.0.1',
    'schema:schemaVersion': '1.6.0',
    '@type': 'https://schema.metadatacenter.org/core/Template',
    'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
    $schema: 'http://json-schema.org/draft-04/schema#',
});
