/* eslint-disable max-len */
export const radxTemplate = Object({
    '@id': 'https://repo.metadatacenter.org/templates/ec918d9b-fcd2-4e6e-b63b-2c67aece9f68',
    _ui: {
        order: [
            'Data File Title',
            'Data File Identifier',
            'Resource Type',
            'Data File Version',
            'Data File Language',
            'Data File Subjects and Keywords',
            'Data File Description',
            'Data File Creator',
            'Data File Related Resource',
            'Data File Contributor',
            'Data File Rights',
            'Date',
            'Data File Parent Study',
            'Data File Funding Source',
            'Data File Distribution',
            'Data Characteristics Summary',
            'Data Source',
            'Data Source Stream',
            'Data File Process Version',
            'Data File Temporal Coverage',
            'Data File Spatial Coverage',
            'Data File Vertical Coverage',
            'Auxiliary Metadata',
        ],
        propertyLabels: {
            'Data File Title': 'Data File Title',
            'Data File Identifier': 'Data File Identifier',
            'Resource Type': 'Resource Type',
            'Data File Version': 'Data File Version',
            'Data File Language': 'Data File Language',
            'Data File Subjects and Keywords': 'Data File Subjects and Keywords',
            'Data File Description': 'Data File Description',
            'Data File Creator': 'Data File Creator',
            'Data File Related Resource': 'Data File Related Resource',
            'Data File Contributor': 'Data File Contributor',
            'Data File Rights': 'Data File Rights',
            Date: 'Date',
            'Data File Parent Study': 'Data File Parent Study',
            'Data File Funding Source': 'Data File Funding Source',
            'Data File Distribution': 'Data File Distribution',
            'Data Characteristics Summary': 'Data Characteristics Summary',
            'Data Source': 'Data Source',
            'Data Source Stream': 'Data Source Stream',
            'Data File Process Version': 'Data File Process Version',
            'Data File Temporal Coverage': 'Data File Temporal Coverage',
            'Data File Spatial Coverage': 'Data File Spatial Coverage',
            'Data File Vertical Coverage': 'Data File Vertical Coverage',
            'Auxiliary Metadata': 'Auxiliary Metadata',
        },
        propertyDescriptions: {
            'Data File Title': 'A name or title by which the Data File being described is known.',
            'Data File Identifier': 'Information about the globally unique and persistent identifier used to identify and optionally access (meta)data of the data file being described.',
            'Resource Type': 'Information about the type of the resource being described with metadata.',
            'Data File Version': 'Version of the resource being described.',
            'Data File Language': 'Language in which the data file being described is provided.',
            'Data File Subjects and Keywords': 'Concepts (keywords, classification, or free text terms) that define the data file or purpose (subjects which can be addressed) using the data file.',
            'Data File Description': 'Summary of the Data File and its contents.',
            'Data File Creator': 'An entity that brought into existence the data file being described. Creators can be people, organizations and/or physical or virtual infrastructure (e.g., sensors, software).',
            'Data File Related Resource': 'Information about resource related to the data file or other entity being described.',
            'Data File Contributor': 'An entity that contributed in bringing into existence the data file being described. Contributors can be people, organizations and/or physical or virtual infrastructure (e.g., sensors, software).',
            'Data File Rights': 'Way in which the data file may or may not be accessed and used.',
            Date: 'Relevant date related to the resource being described.',
            'Data File Parent Study': 'The research study for which this data file was created.',
            'Data File Funding Source': 'The sources of funding that enabled and drove the creation of the data file. (Non-monetary sources are described under Contributor.)',
            'Data File Distribution': 'Details about the distribution for this individual public presentation of the data file (if part of the Distribution metadata), or for all the public presentations of the data file being described (if part of the data file metadata).',
            'Data Characteristics Summary': 'Characteristics of the data within the data file, particularly of the cohorts in the data file.',
            'Data Source': 'Physical or conceptual entity that creates the data streams that make up the described data file. The data source may or may not be associated with a fixed location; for example, a series of discrete sensors deployed over time to a single location may be considered a single data source in some systems.',
            'Data Source Stream': 'A collection of one or more variable records originating from a single data source (e.g., sensor, process, or person). A data stream can grow over time.',
            'Data File Process Version': 'Version information for the process used to make the data file or product',
            'Data File Temporal Coverage': 'The temporal coverage and resolution of the data file being described.',
            'Data File Spatial Coverage': 'The maximum geospatial positions (locations on Earth) covered by the data file being described.',
            'Data File Vertical Coverage': 'The vertical area (altitude and/or depth)  covered by the data file being described.',
            'Auxiliary Metadata': 'Information about the data file or metadata submission that does not fit into the other categories',
        },
        pages: [],
    },
    title: 'Radx metadata specification template schema',
    description: 'Radx metadata specification template schema generated by the CEDAR Template Editor 2.6.44',
    type: 'object',
    properties: {
        'Data Characteristics Summary': {
            '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
            type: 'object',
            title: 'Element(Data Characteristics Summary)',
            description: 'Generated by CSV2CEDAR.',
            properties: {
                'Data Characteristics Table in CSV': {
                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                    '@id': 'https://repo.metadatacenter.org/template-fields/399e2b10-21eb-4200-81f3-9407060dcbf8',
                    'schema:identifier': 'data_characteristics_table_in_csv',
                    'schema:name': 'Data Characteristics Table in CSV',
                    'schema:description': 'Enter comma-separated table containing summary statistics characterizing this data file',
                    'pav:derivedFrom': '',
                    'skos:prefLabel': 'Data Characteristics Table in CSV',
                    'skos:altLabel': [],
                    'pav:version': '0.9.0',
                    'bibo:status': 'bibo:draft',
                    _valueConstraints: {
                        defaultValue: '',
                        requiredValue: false,
                        multipleChoice: false,
                    },
                    _ui: {
                        inputType: 'textarea',
                    },
                    'pav:createdOn': null,
                    'pav:createdBy': null,
                    'pav:lastUpdatedOn': null,
                    'oslc:modifiedBy': null,
                    type: 'object',
                    title: 'Field(Data Characteristics Table in CSV)',
                    description: 'Generated by CSV2CEDAR.',
                    properties: {
                        '@type': {
                            oneOf: [
                                {
                                    type: 'string',
                                    format: 'uri',
                                },
                                {
                                    type: 'array',
                                    minItems: 1,
                                    items: {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    uniqueItems: true,
                                },
                            ],
                        },
                        '@value': {
                            type: [
                                'string',
                                'null',
                            ],
                        },
                        'rdfs:label': {
                            type: [
                                'string',
                                'null',
                            ],
                        },
                    },
                    additionalProperties: false,
                    'schema:schemaVersion': '1.6.0',
                    '@context': {
                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                        pav: 'http://purl.org/pav/',
                        bibo: 'http://purl.org/ontology/bibo/',
                        oslc: 'http://open-services.net/ns/core#',
                        schema: 'http://schema.org/',
                        skos: 'http://www.w3.org/2004/02/skos/core#',
                        'schema:name': {
                            '@type': 'xsd:string',
                        },
                        'schema:description': {
                            '@type': 'xsd:string',
                        },
                        'skos:prefLabel': {
                            '@type': 'xsd:string',
                        },
                        'skos:altLabel': {
                            '@type': 'xsd:string',
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
                    },
                    $schema: 'http://json-schema.org/draft-04/schema#',
                },
                'Data Characteristics Table in HTML': {
                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                    '@id': 'https://repo.metadatacenter.org/template-fields/f91b9755-f6dd-4e67-9f1e-5fb8adf4161e',
                    'schema:identifier': 'data_characteristics_table_in_html',
                    'schema:name': 'Data Characteristics Table in HTML',
                    'schema:description': 'Formatted HTML code for a table of statistical values',
                    'pav:derivedFrom': '',
                    'skos:prefLabel': 'Data Characteristics Table in HTML',
                    'skos:altLabel': [],
                    'pav:version': '0.9.0',
                    'bibo:status': 'bibo:draft',
                    _valueConstraints: {
                        defaultValue: '',
                        requiredValue: false,
                        multipleChoice: false,
                    },
                    _ui: {
                        inputType: 'textarea',
                    },
                    'pav:createdOn': null,
                    'pav:createdBy': null,
                    'pav:lastUpdatedOn': null,
                    'oslc:modifiedBy': null,
                    type: 'object',
                    title: 'Field(Data Characteristics Table in HTML)',
                    description: 'Generated by CSV2CEDAR.',
                    properties: {
                        '@type': {
                            oneOf: [
                                {
                                    type: 'string',
                                    format: 'uri',
                                },
                                {
                                    type: 'array',
                                    minItems: 1,
                                    items: {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    uniqueItems: true,
                                },
                            ],
                        },
                        '@value': {
                            type: [
                                'string',
                                'null',
                            ],
                        },
                        'rdfs:label': {
                            type: [
                                'string',
                                'null',
                            ],
                        },
                    },
                    additionalProperties: false,
                    'schema:schemaVersion': '1.6.0',
                    '@context': {
                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                        pav: 'http://purl.org/pav/',
                        bibo: 'http://purl.org/ontology/bibo/',
                        oslc: 'http://open-services.net/ns/core#',
                        schema: 'http://schema.org/',
                        skos: 'http://www.w3.org/2004/02/skos/core#',
                        'schema:name': {
                            '@type': 'xsd:string',
                        },
                        'schema:description': {
                            '@type': 'xsd:string',
                        },
                        'skos:prefLabel': {
                            '@type': 'xsd:string',
                        },
                        'skos:altLabel': {
                            '@type': 'xsd:string',
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
                    },
                    $schema: 'http://json-schema.org/draft-04/schema#',
                },
                '@id': {
                    type: 'string',
                    format: 'uri',
                },
                'Data Characteristics Table in Key-Value Pairs': {
                    type: 'array',
                    minItems: 0,
                    items: {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'urn:uuid:1f7eae7b-3116-4829-9997-5ddaae0277ef',
                        'schema:identifier': 'data_characteristics_table_in_key-value_pairs',
                        'schema:name': 'Data Characteristics Table in Key-Value Pairs',
                        'schema:description': 'Enter the name of the characteristic being described in the first (key) field, and the value for that characteristic in the second (value) field.. Note this is a repeating field and so can support multiple key-value pairs.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Data Characteristics Table in Key-Value Pairs',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _ui: {
                            inputType: 'attribute-value',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        title: 'Field(Data Characteristics Table in Key-Value Pairs)',
                        description: 'Generated by CSV2CEDAR.',
                        type: 'string',
                        multiValued: true,
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                },
                '@context': {
                    type: 'object',
                    properties: {
                        'Data Characteristics Table in HTML': {
                            enum: [
                                'https://schema.metadatacenter.org/properties/f48a2164-fb1a-4232-b7ef-5f8c985685ae',
                            ],
                        },
                        'Data Characteristics Table in CSV': {
                            enum: [
                                'https://schema.metadatacenter.org/properties/2ecd7522-f5ec-4a35-903f-f2b087a6065c',
                            ],
                        },
                        'Data Characteristics Table in Key-Value Pairs': {
                            enum: [
                                'https://schema.metadatacenter.org/properties/0ea00320-9557-43c1-81af-ab23bc7b9142',
                            ],
                        },
                    },
                    additionalProperties: false,
                },
                '@type': {
                    oneOf: [
                        {
                            type: 'string',
                            format: 'uri',
                        },
                        {
                            type: 'array',
                            minItems: 1,
                            items: {
                                type: 'string',
                                format: 'uri',
                            },
                            uniqueItems: true,
                        },
                    ],
                },
            },
            multiValued: false,
            required: [
                '@context',
                '@id',
                'Data Characteristics Table in HTML',
                'Data Characteristics Table in CSV',
                'Data Characteristics Table in Key-Value Pairs',
            ],
            additionalProperties: {
                type: 'object',
                properties: {
                    '@value': {
                        type: [
                            'string',
                            'null',
                        ],
                    },
                    '@type': {
                        type: 'string',
                        format: 'uri',
                    },
                },
                required: [
                    '@value',
                ],
                additionalProperties: false,
            },
            'schema:schemaVersion': '1.6.0',
            '@id': 'https://repo.metadatacenter.org/template-elements/17eab50d-061c-4972-9896-8f0a853686e7',
            _ui: {
                order: [
                    'Data Characteristics Table in HTML',
                    'Data Characteristics Table in CSV',
                    'Data Characteristics Table in Key-Value Pairs',
                ],
                propertyLabels: {
                    'Data Characteristics Table in HTML': 'Data Characteristics Table in HTML',
                    'Data Characteristics Table in CSV': 'Data Characteristics Table in CSV',
                    'Data Characteristics Table in Key-Value Pairs': 'Data Characteristics Table in Key-Value Pairs',
                },
                propertyDescriptions: {
                    'Data Characteristics Table in HTML': 'Formatted HTML code for a table of statistical values',
                    'Data Characteristics Table in CSV': 'Enter comma-separated table containing summary statistics characterizing this data file',
                    'Data Characteristics Table in Key-Value Pairs': 'Enter the name of the characteristic being described in the first (key) field, and the value for that characteristic in the second (value) field.. Note this is a repeating field and so can support multiple key-value pairs.',
                },
            },
            '@context': {
                xsd: 'http://www.w3.org/2001/XMLSchema#',
                pav: 'http://purl.org/pav/',
                bibo: 'http://purl.org/ontology/bibo/',
                oslc: 'http://open-services.net/ns/core#',
                schema: 'http://schema.org/',
                'schema:name': {
                    '@type': 'xsd:string',
                },
                'schema:description': {
                    '@type': 'xsd:string',
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
            },
            'schema:identifier': 'data_characteristics_summary',
            'schema:name': 'Data Characteristics Summary',
            'schema:description': 'Characteristics of the data within the data file, particularly of the cohorts in the data file.',
            'pav:derivedFrom': '',
            'skos:prefLabel': 'Data Characteristics Summary',
            'skos:altLabel': [],
            'pav:version': '0.0.1',
            'bibo:status': 'bibo:draft',
            'pav:createdOn': '2022-08-11T21:26:18-07:00',
            'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
            'pav:lastUpdatedOn': '2022-08-11T21:26:18-07:00',
            'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
            $schema: 'http://json-schema.org/draft-04/schema#',
        },
        'Auxiliary Metadata': {
            '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
            type: 'object',
            title: 'Element(Auxiliary Metadata)',
            description: 'Generated by CSV2CEDAR.',
            properties: {
                '@id': {
                    type: 'string',
                    format: 'uri',
                },
                'Data File Descriptive Attribute': {
                    type: 'array',
                    minItems: 0,
                    items: {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'urn:uuid:a2dfde9f-116b-4ba3-8587-127c4553ecce',
                        'schema:identifier': 'data_file_descriptive_attribute',
                        'schema:name': 'Data File Descriptive Attribute',
                        'schema:description': 'This field supports entry of both the metadata attribute name (in the first field), and the value for that attribute (in the second field). Note this is a repeating field and so can support multiple key-value pairs.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Data File Descriptive Attribute',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _ui: {
                            inputType: 'attribute-value',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        title: 'Field(Data File Descriptive Attribute)',
                        description: 'Generated by CSV2CEDAR.',
                        type: 'string',
                        multiValued: true,
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                },
                '@context': {
                    type: 'object',
                    properties: {
                        'Data File Descriptive Attribute': {
                            enum: [
                                'https://schema.metadatacenter.org/properties/c3a9553f-6062-40f3-a854-fe045938ba6f',
                            ],
                        },
                        'Additional Commentary': {
                            enum: [
                                'https://schema.metadatacenter.org/properties/248a9fce-664b-4dff-bf56-da55b239e65f',
                            ],
                        },
                    },
                    additionalProperties: false,
                },
                '@type': {
                    oneOf: [
                        {
                            type: 'string',
                            format: 'uri',
                        },
                        {
                            type: 'array',
                            minItems: 1,
                            items: {
                                type: 'string',
                                format: 'uri',
                            },
                            uniqueItems: true,
                        },
                    ],
                },
                'Additional Commentary': {
                    type: 'array',
                    minItems: 1,
                    items: {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/222da83c-dea2-412f-895c-a3000272010e',
                        'schema:identifier': 'additional_commentary',
                        'schema:name': 'Additional Commentary',
                        'schema:description': 'Any additional information about the data file or provided metadata.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Additional Commentary',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textarea',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Additional Commentary)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                },
            },
            multiValued: false,
            required: [
                '@context',
                '@id',
                'Data File Descriptive Attribute',
                'Additional Commentary',
            ],
            additionalProperties: {
                type: 'object',
                properties: {
                    '@value': {
                        type: [
                            'string',
                            'null',
                        ],
                    },
                    '@type': {
                        type: 'string',
                        format: 'uri',
                    },
                },
                required: [
                    '@value',
                ],
                additionalProperties: false,
            },
            'schema:schemaVersion': '1.6.0',
            '@id': 'https://repo.metadatacenter.org/template-elements/8661ff23-03ec-4a8d-8a72-ca53d435081e',
            _ui: {
                order: [
                    'Data File Descriptive Attribute',
                    'Additional Commentary',
                ],
                propertyLabels: {
                    'Data File Descriptive Attribute': 'Data File Descriptive Attribute',
                    'Additional Commentary': 'Additional Commentary',
                },
                propertyDescriptions: {
                    'Data File Descriptive Attribute': 'This field supports entry of both the metadata attribute name (in the first field), and the value for that attribute (in the second field). Note this is a repeating field and so can support multiple key-value pairs.',
                    'Additional Commentary': 'Any additional information about the data file or provided metadata.',
                },
            },
            '@context': {
                xsd: 'http://www.w3.org/2001/XMLSchema#',
                pav: 'http://purl.org/pav/',
                bibo: 'http://purl.org/ontology/bibo/',
                oslc: 'http://open-services.net/ns/core#',
                schema: 'http://schema.org/',
                'schema:name': {
                    '@type': 'xsd:string',
                },
                'schema:description': {
                    '@type': 'xsd:string',
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
            },
            'schema:identifier': 'auxiliary_metadata',
            'schema:name': 'Auxiliary Metadata',
            'schema:description': 'Information about the data file or metadata submission that does not fit into the other categories',
            'pav:derivedFrom': '',
            'skos:prefLabel': 'Auxiliary Metadata',
            'skos:altLabel': [],
            'pav:version': '0.0.1',
            'bibo:status': 'bibo:draft',
            'pav:createdOn': '2022-08-11T21:26:18-07:00',
            'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
            'pav:lastUpdatedOn': '2022-08-11T21:26:18-07:00',
            'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
            $schema: 'http://json-schema.org/draft-04/schema#',
        },
        '@type': {
            oneOf: [
                {
                    type: 'string',
                    format: 'uri',
                },
                {
                    type: 'array',
                    minItems: 1,
                    items: {
                        type: 'string',
                        format: 'uri',
                    },
                    uniqueItems: true,
                },
            ],
        },
        'Data File Process Version': {
            type: 'array',
            minItems: 1,
            items: {
                '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                type: 'object',
                title: 'Element(Data File Process Version)',
                description: 'Generated by CSV2CEDAR.',
                properties: {
                    'Version Identifier of Process': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/3c1c12f1-2ac0-48d1-846b-22028fa1c448',
                        'schema:identifier': 'version_identifier_of_process',
                        'schema:name': 'Version Identifier of Process',
                        'schema:description': 'Version of the process used to make this data file, typically a string (e.g., 3.0.3)',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Version Identifier of Process',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Version Identifier of Process)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Process Unique Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/621aaacc-d678-4a15-ba6d-9a32bacf650f',
                        'schema:identifier': 'process_unique_identifier',
                        'schema:name': 'Process Unique Identifier',
                        'schema:description': 'Unique identifier for the process used to make the data file or product (preferably a resolvable and persistent identifier)',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Process Unique Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Process Unique Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@type': {
                        oneOf: [
                            {
                                type: 'string',
                                format: 'uri',
                            },
                            {
                                type: 'array',
                                minItems: 1,
                                items: {
                                    type: 'string',
                                    format: 'uri',
                                },
                                uniqueItems: true,
                            },
                        ],
                    },
                    'Execution Identifier of Process': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/b6d86cc7-fd03-4784-aff2-ecf3f2ede6ea',
                        'schema:identifier': 'execution_identifier_of_process',
                        'schema:name': 'Execution Identifier of Process',
                        'schema:description': 'Identification of the particular run of the process used to make this data file (a deterministic string)',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Execution Identifier of Process',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Execution Identifier of Process)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@id': {
                        type: 'string',
                        format: 'uri',
                    },
                    '@context': {
                        type: 'object',
                        properties: {
                            'Process Name': {
                                enum: [
                                    'https://schema.metadatacenter.org/properties/feb434c4-424d-4fe7-aa66-ab68c5e54217',
                                ],
                            },
                            'Process Unique Identifier': {
                                enum: [
                                    'https://schema.metadatacenter.org/properties/5399bf9a-7b19-42fc-b5e3-a0f70e73689a',
                                ],
                            },
                            'Version Identifier of Process': {
                                enum: [
                                    'https://schema.metadatacenter.org/properties/fa192c4d-c96c-48c8-85c3-68adf8ee45e5',
                                ],
                            },
                            'Execution Identifier of Process': {
                                enum: [
                                    'https://schema.metadatacenter.org/properties/7411041d-9560-49b8-8159-5442a09de7e7',
                                ],
                            },
                        },
                        additionalProperties: false,
                    },
                    'Process Name': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/de1a0182-a37c-42d1-8b54-a54991f7d249',
                        'schema:identifier': 'process_name',
                        'schema:name': 'Process Name',
                        'schema:description': 'Full name of the process for which the version is specified',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Process Name',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Process Name)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                },
                multiValued: false,
                required: [
                    '@context',
                    '@id',
                    'Process Name',
                    'Process Unique Identifier',
                    'Version Identifier of Process',
                    'Execution Identifier of Process',
                ],
                additionalProperties: false,
                'schema:schemaVersion': '1.6.0',
                '@id': 'https://repo.metadatacenter.org/template-elements/2430bda9-a175-4479-a260-b79537b05daa',
                _ui: {
                    order: [
                        'Process Name',
                        'Process Unique Identifier',
                        'Version Identifier of Process',
                        'Execution Identifier of Process',
                    ],
                    propertyLabels: {
                        'Process Name': 'Process Name',
                        'Process Unique Identifier': 'Process Unique Identifier',
                        'Version Identifier of Process': 'Version Identifier of Process',
                        'Execution Identifier of Process': 'Execution Identifier of Process',
                    },
                    propertyDescriptions: {
                        'Process Name': 'Full name of the process for which the version is specified',
                        'Process Unique Identifier': 'Unique identifier for the process used to make the data file or product (preferably a resolvable and persistent identifier)',
                        'Version Identifier of Process': 'Version of the process used to make this data file, typically a string (e.g., 3.0.3)',
                        'Execution Identifier of Process': 'Identification of the particular run of the process used to make this data file (a deterministic string)',
                    },
                },
                '@context': {
                    xsd: 'http://www.w3.org/2001/XMLSchema#',
                    pav: 'http://purl.org/pav/',
                    bibo: 'http://purl.org/ontology/bibo/',
                    oslc: 'http://open-services.net/ns/core#',
                    schema: 'http://schema.org/',
                    'schema:name': {
                        '@type': 'xsd:string',
                    },
                    'schema:description': {
                        '@type': 'xsd:string',
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
                },
                'schema:identifier': 'data_file_process_version',
                'schema:name': 'Data File Process Version',
                'schema:description': 'Version information for the process used to make the data file or product',
                'pav:derivedFrom': '',
                'skos:prefLabel': 'Data File Process Version',
                'skos:altLabel': [],
                'pav:version': '0.0.1',
                'bibo:status': 'bibo:draft',
                'pav:createdOn': '2022-08-11T21:26:18-07:00',
                'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                'pav:lastUpdatedOn': '2022-08-11T21:26:18-07:00',
                'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                $schema: 'http://json-schema.org/draft-04/schema#',
            },
        },
        'pav:createdOn': {
            type: [
                'string',
                'null',
            ],
            format: 'date-time',
        },
        'Data File Vertical Coverage': {
            type: 'array',
            minItems: 1,
            items: {
                '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                type: 'object',
                title: 'Element(Data File Vertical Coverage)',
                description: 'Generated by CSV2CEDAR.',
                properties: {
                    'Vertical Extent Minimum Value': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/2d6d087f-a0b1-43ac-adc7-5df0f8d901c0',
                        'schema:identifier': 'vertical_extent_minimum_value',
                        'schema:name': 'Vertical Extent Minimum Value',
                        'schema:description': 'A minimum vertical extent of data file collection. In case of depth, this contains the maximum depth of data file collection (it is a negative number of greater absolute magnitude than the Vertical Extent Maximum Value).',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Vertical Extent Minimum Value',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            numberType: 'xsd:float',
                            unitOfMeasure: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'numeric',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Vertical Extent Minimum Value)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Vertical Extent Datum': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/eacfc903-ecbf-4aac-b10a-293f8020f7ee',
                        'schema:identifier': 'vertical_extent_datum',
                        'schema:name': 'Vertical Extent Datum',
                        'schema:description': 'The name of the Datum (reference frame) used for the Vertical Extent values.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Vertical Extent Datum',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Vertical Extent Datum)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@type': {
                        oneOf: [
                            {
                                type: 'string',
                                format: 'uri',
                            },
                            {
                                type: 'array',
                                minItems: 1,
                                items: {
                                    type: 'string',
                                    format: 'uri',
                                },
                                uniqueItems: true,
                            },
                        ],
                    },
                    'Vertical Extent Maximum Value': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/ef0b0599-305d-4b56-afd0-1b21a6264bb6',
                        'schema:identifier': 'vertical_extent_maximum_value',
                        'schema:name': 'Vertical Extent Maximum Value',
                        'schema:description': 'A maximum vertical extent of data file collection. In case of depth, this contains the minimum depth of data file collection (it is a negative number of lesser absolute magnitude than the Vertical Extent Minimum Value).',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Vertical Extent Maximum Value',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            numberType: 'xsd:float',
                            unitOfMeasure: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'numeric',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Vertical Extent Maximum Value)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Vertical Extent Datum Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/b3e34ef1-aee9-4138-b31a-18c5e629727d',
                        'schema:identifier': 'vertical_extent_datum_identifier',
                        'schema:name': 'Vertical Extent Datum Identifier',
                        'schema:description': 'The unique identifier (IRI) of the Datum (reference frame) used for the Vertical Extent values.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Vertical Extent Datum Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'link',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Vertical Extent Datum Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@id': {
                        type: 'string',
                        format: 'uri',
                    },
                    '@context': {
                        type: 'object',
                        properties: {
                            'Vertical Extent Minimum Value': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasVerticalExtentMinimumValue',
                                ],
                            },
                            'Vertical Extent Maximum Value': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasVerticalExtentMaximumValue',
                                ],
                            },
                            'Vertical Extent Unit': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasVerticalExtentUnit',
                                ],
                            },
                            'Vertical Extent Datum': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasVerticalExtentDatum',
                                ],
                            },
                            'Vertical Extent Datum Identifier': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasVerticalExtentDatumIRI',
                                ],
                            },
                        },
                        additionalProperties: false,
                    },
                    'Vertical Extent Unit': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/09bdcae4-18c0-433d-9f44-a0e87e090552',
                        'schema:identifier': 'vertical_extent_unit',
                        'schema:name': 'Vertical Extent Unit',
                        'schema:description': 'Unit used to specify Vertical Extent. May be specified as string or identifier, preferably as science units.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Vertical Extent Unit',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Vertical Extent Unit)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                },
                multiValued: false,
                required: [
                    '@context',
                    '@id',
                    'Vertical Extent Minimum Value',
                    'Vertical Extent Maximum Value',
                    'Vertical Extent Unit',
                    'Vertical Extent Datum',
                    'Vertical Extent Datum Identifier',
                ],
                additionalProperties: false,
                'schema:schemaVersion': '1.6.0',
                '@id': 'https://repo.metadatacenter.org/template-elements/276c9011-88fa-4154-9898-2ca862fed496',
                _ui: {
                    order: [
                        'Vertical Extent Minimum Value',
                        'Vertical Extent Maximum Value',
                        'Vertical Extent Unit',
                        'Vertical Extent Datum',
                        'Vertical Extent Datum Identifier',
                    ],
                    propertyLabels: {
                        'Vertical Extent Minimum Value': 'Vertical Extent Minimum Value',
                        'Vertical Extent Maximum Value': 'Vertical Extent Maximum Value',
                        'Vertical Extent Unit': 'Vertical Extent Unit',
                        'Vertical Extent Datum': 'Vertical Extent Datum',
                        'Vertical Extent Datum Identifier': 'Vertical Extent Datum Identifier',
                    },
                    propertyDescriptions: {
                        'Vertical Extent Minimum Value': 'A minimum vertical extent of data file collection. In case of depth, this contains the maximum depth of data file collection (it is a negative number of greater absolute magnitude than the Vertical Extent Maximum Value).',
                        'Vertical Extent Maximum Value': 'A maximum vertical extent of data file collection. In case of depth, this contains the minimum depth of data file collection (it is a negative number of lesser absolute magnitude than the Vertical Extent Minimum Value).',
                        'Vertical Extent Unit': 'Unit used to specify Vertical Extent. May be specified as string or identifier, preferably as science units.',
                        'Vertical Extent Datum': 'The name of the Datum (reference frame) used for the Vertical Extent values.',
                        'Vertical Extent Datum Identifier': 'The unique identifier (IRI) of the Datum (reference frame) used for the Vertical Extent values.',
                    },
                },
                '@context': {
                    xsd: 'http://www.w3.org/2001/XMLSchema#',
                    pav: 'http://purl.org/pav/',
                    bibo: 'http://purl.org/ontology/bibo/',
                    oslc: 'http://open-services.net/ns/core#',
                    schema: 'http://schema.org/',
                    'schema:name': {
                        '@type': 'xsd:string',
                    },
                    'schema:description': {
                        '@type': 'xsd:string',
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
                },
                'schema:identifier': 'data_file_vertical_coverage',
                'schema:name': 'Data File Vertical Coverage',
                'schema:description': 'The vertical area (altitude and/or depth)  covered by the data file being described.',
                'pav:derivedFrom': '',
                'skos:prefLabel': 'Data File Vertical Coverage',
                'skos:altLabel': [],
                'pav:version': '0.0.1',
                'bibo:status': 'bibo:draft',
                'pav:createdOn': '2022-08-11T21:26:18-07:00',
                'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                'pav:lastUpdatedOn': '2022-08-11T21:26:18-07:00',
                'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                $schema: 'http://json-schema.org/draft-04/schema#',
            },
        },
        'Data File Related Resource': {
            type: 'array',
            minItems: 1,
            items: {
                '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                type: 'object',
                title: 'Element(Data File Related Resource)',
                description: 'Generated by CSV2CEDAR.',
                properties: {
                    'Related Resource Identifier Type': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/f7ea6818-d720-43eb-bbef-b4897258aa2e',
                        'schema:identifier': 'related_resource_identifier_type',
                        'schema:name': 'Related Resource Identifier Type',
                        'schema:description': 'The identifier type used to identify the related resource.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Related Resource Identifier Type',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                            classes: [],
                            branches: [
                                {
                                    source: 'https://bioportal.bioontology.org/ontologies/FDC-GDMT',
                                    acronym: 'FDC-GDMT',
                                    name: 'FDC-GDMT',
                                    uri: 'http://vocab.fairdatacollective.org/gdmt/IdentifierType',
                                    maxDepth: 2147483647,
                                },
                            ],
                            ontologies: [],
                            literals: [],
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Related Resource Identifier Type)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@type': {
                        oneOf: [
                            {
                                type: 'string',
                                format: 'uri',
                            },
                            {
                                type: 'array',
                                minItems: 1,
                                items: {
                                    type: 'string',
                                    format: 'uri',
                                },
                                uniqueItems: true,
                            },
                        ],
                    },
                    'Related Resource Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/84261ae4-3d99-4147-8559-4b27758e08b8',
                        'schema:identifier': 'related_resource_identifier',
                        'schema:name': 'Related Resource Identifier',
                        'schema:description': 'A globally unique string that identifies a resource that is related to the data file being described.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Related Resource Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Related Resource Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@id': {
                        type: 'string',
                        format: 'uri',
                    },
                    'Resource Type Category': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/c37bdf90-bdfa-4403-bc10-fb52b374f16d',
                        'schema:identifier': 'resource_type_category',
                        'schema:name': 'Resource Type Category',
                        'schema:description': "Categorical type of the resource being described. (Corresponds to DataCite's resourceTypeGeneral.)",
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Resource Type Category',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                            classes: [],
                            branches: [
                                {
                                    source: 'https://bioportal.bioontology.org/ontologies/FDC-GDMT',
                                    acronym: 'FDC-GDMT',
                                    name: 'FDC-GDMT',
                                    uri: 'http://vocab.fairdatacollective.org/gdmt/ResourceTypeCategory',
                                    maxDepth: 2147483647,
                                },
                            ],
                            ontologies: [],
                            literals: [],
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Resource Type Category)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@context': {
                        type: 'object',
                        properties: {
                            'Related Resource Identifier': {
                                enum: [
                                    'http://purl.org/dc/terms/identifier',
                                ],
                            },
                            'Related Resource Identifier Type': {
                                enum: [
                                    'http://schema.org/propertyID',
                                ],
                            },
                            'Resource Type Category': {
                                enum: [
                                    'http://purl.org/dc/elements/1.1/type',
                                ],
                            },
                            'Relation of Data File to Resource': {
                                enum: [
                                    'http://rs.tdwg.org/dwc/terms/relationshipOfResource',
                                ],
                            },
                        },
                        additionalProperties: false,
                    },
                    'Relation of Data File to Resource': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/6fea13dd-6ff4-4371-b04b-4d75d4c4a7fe',
                        'schema:identifier': 'relation_of_data_file_to_resource',
                        'schema:name': 'Relation of Data File to Resource',
                        'schema:description': 'Description of the relationship of the object being described (A) to the related resource (B).',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Relation of Data File to Resource',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Relation of Data File to Resource)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                },
                multiValued: false,
                required: [
                    '@context',
                    '@id',
                    'Related Resource Identifier',
                    'Related Resource Identifier Type',
                    'Resource Type Category',
                    'Relation of Data File to Resource',
                ],
                additionalProperties: false,
                'schema:schemaVersion': '1.6.0',
                '@id': 'https://repo.metadatacenter.org/template-elements/7ba80b7a-895f-4f1b-8a6a-513c219b1dc4',
                _ui: {
                    order: [
                        'Related Resource Identifier',
                        'Related Resource Identifier Type',
                        'Resource Type Category',
                        'Relation of Data File to Resource',
                    ],
                    propertyLabels: {
                        'Related Resource Identifier': 'Related Resource Identifier',
                        'Related Resource Identifier Type': 'Related Resource Identifier Type',
                        'Resource Type Category': 'Resource Type Category',
                        'Relation of Data File to Resource': 'Relation of Data File to Resource',
                    },
                    propertyDescriptions: {
                        'Related Resource Identifier': 'A globally unique string that identifies a resource that is related to the data file being described.',
                        'Related Resource Identifier Type': 'The identifier type used to identify the related resource.',
                        'Resource Type Category': "Categorical type of the resource being described. (Corresponds to DataCite's resourceTypeGeneral.)",
                        'Relation of Data File to Resource': 'Description of the relationship of the object being described (A) to the related resource (B).',
                    },
                },
                '@context': {
                    xsd: 'http://www.w3.org/2001/XMLSchema#',
                    pav: 'http://purl.org/pav/',
                    bibo: 'http://purl.org/ontology/bibo/',
                    oslc: 'http://open-services.net/ns/core#',
                    schema: 'http://schema.org/',
                    'schema:name': {
                        '@type': 'xsd:string',
                    },
                    'schema:description': {
                        '@type': 'xsd:string',
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
                },
                'schema:identifier': 'data_file_related_resource',
                'schema:name': 'Data File Related Resource',
                'schema:description': 'Information about resource related to the data file or other entity being described.',
                'pav:derivedFrom': '',
                'skos:prefLabel': 'Data File Related Resource',
                'skos:altLabel': [],
                'pav:version': '0.0.1',
                'bibo:status': 'bibo:draft',
                'pav:createdOn': '2022-08-11T21:26:18-07:00',
                'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                'pav:lastUpdatedOn': '2022-08-11T21:26:18-07:00',
                'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                $schema: 'http://json-schema.org/draft-04/schema#',
            },
        },
        'Data File Description': {
            type: 'array',
            minItems: 1,
            items: {
                '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                type: 'object',
                title: 'Element(Data File Description)',
                description: 'Generated by CSV2CEDAR.',
                properties: {
                    '@id': {
                        type: 'string',
                        format: 'uri',
                    },
                    '@context': {
                        type: 'object',
                        properties: {
                            'Data File Description': {
                                enum: [
                                    'http://purl.org/dc/terms/description',
                                ],
                            },
                            'Description Language': {
                                enum: [
                                    'http://purl.org/dc/terms/language',
                                ],
                            },
                        },
                        additionalProperties: false,
                    },
                    'Description Language': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/2839944a-b5f6-41c7-ad68-9532f8fabeed',
                        'schema:identifier': 'description_language',
                        'schema:name': 'Description Language',
                        'schema:description': 'Language in which the Data File description is provided.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Description Language',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                            classes: [],
                            branches: [],
                            ontologies: [
                                {
                                    uri: 'https://bioportal.bioontology.org/ontologies/ISO639-1',
                                    acronym: 'ISO639-1',
                                    name: 'ISO639-1',
                                },
                            ],
                            literals: [],
                            defaultValue: {
                                termUri: 'https://www.omg.org/spec/LCC/Languages/LaISO639-1-LanguageCodes/en',
                                'rdfs:label': '[en]',
                            },
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Description Language)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@type': {
                        oneOf: [
                            {
                                type: 'string',
                                format: 'uri',
                            },
                            {
                                type: 'array',
                                minItems: 1,
                                items: {
                                    type: 'string',
                                    format: 'uri',
                                },
                                uniqueItems: true,
                            },
                        ],
                    },
                    'Data File Description': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/7e02b791-d62c-4677-99f9-b5eca4bb64a7',
                        'schema:identifier': 'data_file_description',
                        'schema:name': 'Data File Description',
                        'schema:description': 'An account of the resource; may include but is not limited to: an abstract, a table of contents, a graphical representation, or a free-text account of the resource.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Data File Description',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Data File Description)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                },
                multiValued: false,
                required: [
                    '@context',
                    '@id',
                    'Data File Description',
                    'Description Language',
                ],
                additionalProperties: false,
                'schema:schemaVersion': '1.6.0',
                '@id': 'https://repo.metadatacenter.org/template-elements/f5083cf2-503d-411b-a2c3-5d7332f5e98a',
                _ui: {
                    order: [
                        'Data File Description',
                        'Description Language',
                    ],
                    propertyLabels: {
                        'Data File Description': 'Data File Description',
                        'Description Language': 'Description Language',
                    },
                    propertyDescriptions: {
                        'Data File Description': 'An account of the resource; may include but is not limited to: an abstract, a table of contents, a graphical representation, or a free-text account of the resource.',
                        'Description Language': 'Language in which the Data File description is provided.',
                    },
                },
                '@context': {
                    xsd: 'http://www.w3.org/2001/XMLSchema#',
                    pav: 'http://purl.org/pav/',
                    bibo: 'http://purl.org/ontology/bibo/',
                    oslc: 'http://open-services.net/ns/core#',
                    schema: 'http://schema.org/',
                    'schema:name': {
                        '@type': 'xsd:string',
                    },
                    'schema:description': {
                        '@type': 'xsd:string',
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
                },
                'schema:identifier': 'data_file_description',
                'schema:name': 'Data File Description',
                'schema:description': 'Summary of the Data File and its contents.',
                'pav:derivedFrom': '',
                'skos:prefLabel': 'Data File Description',
                'skos:altLabel': [],
                'pav:version': '0.0.1',
                'bibo:status': 'bibo:draft',
                'pav:createdOn': '2022-08-11T21:26:18-07:00',
                'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                'pav:lastUpdatedOn': '2022-08-11T21:26:18-07:00',
                'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                $schema: 'http://json-schema.org/draft-04/schema#',
            },
        },
        'pav:createdBy': {
            type: [
                'string',
                'null',
            ],
            format: 'uri',
        },
        'Data File Funding Source': {
            type: 'array',
            minItems: 1,
            items: {
                '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                type: 'object',
                title: 'Element(Data File Funding Source)',
                description: 'Generated by CSV2CEDAR.',
                properties: {
                    'Award Title': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/262a879b-7b27-4cc1-b4d5-78785c387cf6',
                        'schema:identifier': 'award_title',
                        'schema:name': 'Award Title',
                        'schema:description': 'The human readable title of the award, grant, or other specific funding mechanism for the described data file.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Award Title',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Award Title)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Award Page Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/a393fe14-510d-49b9-b9c9-84975700ebd5',
                        'schema:identifier': 'award_page_identifier',
                        'schema:name': 'Award Page Identifier',
                        'schema:description': 'The unique identifier (IRI) leading to a page provided by the funder for more information about the award (grant).',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Award Page Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'link',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Award Page Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Funder Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/bd077bd4-63a2-4828-a9f6-e4f3e84d18f4',
                        'schema:identifier': 'funder_identifier',
                        'schema:name': 'Funder Identifier',
                        'schema:description': 'Globally unique string that identifies the funding provider.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Funder Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Funder Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Funder Identifier Scheme Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/50b76c9b-24e0-4245-add1-2dac907b84a9',
                        'schema:identifier': 'funder_identifier_scheme_identifier',
                        'schema:name': 'Funder Identifier Scheme Identifier',
                        'schema:description': 'The unique identifier (IRI) of the scheme or authority used for the Funder Identifier.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Funder Identifier Scheme Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'link',
                            hidden: true,
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Funder Identifier Scheme Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Funder Name': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/16f1c3aa-d065-4e53-a2ff-45cdc7547350',
                        'schema:identifier': 'funder_name',
                        'schema:name': 'Funder Name',
                        'schema:description': "Name of the organization providing the funding for the described data file ('funding provider').",
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Funder Name',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Funder Name)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@type': {
                        oneOf: [
                            {
                                type: 'string',
                                format: 'uri',
                            },
                            {
                                type: 'array',
                                minItems: 1,
                                items: {
                                    type: 'string',
                                    format: 'uri',
                                },
                                uniqueItems: true,
                            },
                        ],
                    },
                    'Award Local Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/2b4dc507-b99d-4638-b7f8-ea07c655f6ff',
                        'schema:identifier': 'award_local_identifier',
                        'schema:name': 'Award Local Identifier',
                        'schema:description': 'The code assigned by the funding provider to a sponsored award (grant). (Can be an IRI, but typically is not.)',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Award Local Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Award Local Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Funder Identifier Scheme': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/0c4cf4b4-9241-4bbc-ad39-8962138c86e2',
                        'schema:identifier': 'funder_identifier_scheme',
                        'schema:name': 'Funder Identifier Scheme',
                        'schema:description': 'Name of the scheme or authority for the Funder Identifier.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Funder Identifier Scheme',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                            classes: [],
                            branches: [
                                {
                                    source: 'https://bioportal.bioontology.org/ontologies/FDC-GDMT',
                                    acronym: 'FDC-GDMT',
                                    name: 'FDC-GDMT',
                                    uri: 'http://vocab.fairdatacollective.org/gdmt/IdentifierScheme',
                                    maxDepth: 2147483647,
                                },
                            ],
                            ontologies: [],
                            literals: [],
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Funder Identifier Scheme)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@id': {
                        type: 'string',
                        format: 'uri',
                    },
                    '@context': {
                        type: 'object',
                        properties: {
                            'Award Title': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasAwardTitle',
                                ],
                            },
                            'Award Page Identifier': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasAwardPageIRI',
                                ],
                            },
                            'Award Local Identifier': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasAwardLocalIdentifier',
                                ],
                            },
                            'Funder Name': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasFunderName',
                                ],
                            },
                            'Funder Identifier': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasFunderIdentifier',
                                ],
                            },
                            'Funder Identifier Scheme': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasFunderIdentifierScheme',
                                ],
                            },
                            'Funder Identifier Scheme Identifier': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasFunderIdentifierSchemeIRI',
                                ],
                            },
                        },
                        additionalProperties: false,
                    },
                },
                multiValued: false,
                required: [
                    '@context',
                    '@id',
                    'Award Title',
                    'Award Page Identifier',
                    'Award Local Identifier',
                    'Funder Name',
                    'Funder Identifier',
                    'Funder Identifier Scheme',
                    'Funder Identifier Scheme Identifier',
                ],
                additionalProperties: false,
                'schema:schemaVersion': '1.6.0',
                '@id': 'https://repo.metadatacenter.org/template-elements/68288b82-e26d-4d84-ae2d-419fbab912f9',
                _ui: {
                    order: [
                        'Award Title',
                        'Award Page Identifier',
                        'Award Local Identifier',
                        'Funder Name',
                        'Funder Identifier',
                        'Funder Identifier Scheme',
                        'Funder Identifier Scheme Identifier',
                    ],
                    propertyLabels: {
                        'Award Title': 'Award Title',
                        'Award Page Identifier': 'Award Page Identifier',
                        'Award Local Identifier': 'Award Local Identifier',
                        'Funder Name': 'Funder Name',
                        'Funder Identifier': 'Funder Identifier',
                        'Funder Identifier Scheme': 'Funder Identifier Scheme',
                        'Funder Identifier Scheme Identifier': 'Funder Identifier Scheme Identifier',
                    },
                    propertyDescriptions: {
                        'Award Title': 'The human readable title of the award, grant, or other specific funding mechanism for the described data file.',
                        'Award Page Identifier': 'The unique identifier (IRI) leading to a page provided by the funder for more information about the award (grant).',
                        'Award Local Identifier': 'The code assigned by the funding provider to a sponsored award (grant). (Can be an IRI, but typically is not.)',
                        'Funder Name': "Name of the organization providing the funding for the described data file ('funding provider').",
                        'Funder Identifier': 'Globally unique string that identifies the funding provider.',
                        'Funder Identifier Scheme': 'Name of the scheme or authority for the Funder Identifier.',
                        'Funder Identifier Scheme Identifier': 'The unique identifier (IRI) of the scheme or authority used for the Funder Identifier.',
                    },
                },
                '@context': {
                    xsd: 'http://www.w3.org/2001/XMLSchema#',
                    pav: 'http://purl.org/pav/',
                    bibo: 'http://purl.org/ontology/bibo/',
                    oslc: 'http://open-services.net/ns/core#',
                    schema: 'http://schema.org/',
                    'schema:name': {
                        '@type': 'xsd:string',
                    },
                    'schema:description': {
                        '@type': 'xsd:string',
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
                },
                'schema:identifier': 'data_file_funding_source',
                'schema:name': 'Data File Funding Source',
                'schema:description': 'The sources of funding that enabled and drove the creation of the data file. (Non-monetary sources are described under Contributor.)',
                'pav:derivedFrom': '',
                'skos:prefLabel': 'Data File Funding Source',
                'skos:altLabel': [],
                'pav:version': '0.0.1',
                'bibo:status': 'bibo:draft',
                'pav:createdOn': '2022-08-11T21:26:18-07:00',
                'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                'pav:lastUpdatedOn': '2022-08-11T21:26:18-07:00',
                'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                $schema: 'http://json-schema.org/draft-04/schema#',
            },
        },
        'Data Source Stream': {
            type: 'array',
            minItems: 1,
            items: {
                '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                type: 'object',
                title: 'Element(Data Source Stream)',
                description: 'Generated by CSV2CEDAR.',
                properties: {
                    'Data Stream Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/7f4e2213-fec8-4b6e-ac80-525516f4b7a8',
                        'schema:identifier': 'data_stream_identifier',
                        'schema:name': 'Data Stream Identifier',
                        'schema:description': 'Globally unique string that identifies the collection of records coming from a data source.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Data Stream Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Data Stream Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@type': {
                        oneOf: [
                            {
                                type: 'string',
                                format: 'uri',
                            },
                            {
                                type: 'array',
                                minItems: 1,
                                items: {
                                    type: 'string',
                                    format: 'uri',
                                },
                                uniqueItems: true,
                            },
                        ],
                    },
                    'Data Stream Scheme': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/1a5a9cc5-57cb-412b-8ad6-6db78956b939',
                        'schema:identifier': 'data_stream_scheme',
                        'schema:name': 'Data Stream Scheme',
                        'schema:description': 'The name of the scheme or authority used for the Data Stream Identifier.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Data Stream Scheme',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                            classes: [],
                            branches: [
                                {
                                    source: 'https://bioportal.bioontology.org/ontologies/FDC-GDMT',
                                    acronym: 'FDC-GDMT',
                                    name: 'FDC-GDMT',
                                    uri: 'http://vocab.fairdatacollective.org/gdmt/IdentifierType',
                                    maxDepth: 2147483647,
                                },
                            ],
                            ontologies: [],
                            literals: [],
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Data Stream Scheme)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Data Stream Name': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/8895b413-af11-472c-82f7-b05f0565762e',
                        'schema:identifier': 'data_stream_name',
                        'schema:name': 'Data Stream Name',
                        'schema:description': 'Human readable name of collection of records coming from a data source. A data stream is a collection of one or more variable records originating from a single data source (e.g., sensor, process, or person). A data stream can grow over time.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Data Stream Name',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Data Stream Name)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@id': {
                        type: 'string',
                        format: 'uri',
                    },
                    '@context': {
                        type: 'object',
                        properties: {
                            'Data Stream Name': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasDataStream',
                                ],
                            },
                            'Data Stream Identifier': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasDataStreamIRI',
                                ],
                            },
                            'Data Stream Scheme': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasDataStreamScheme',
                                ],
                            },
                            'Data Stream Scheme Identifier': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasDataStreamSchemeIRI',
                                ],
                            },
                        },
                        additionalProperties: false,
                    },
                    'Data Stream Scheme Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/205775e9-01a9-4674-8ff1-42b4ab4a5b27',
                        'schema:identifier': 'data_stream_scheme_identifier',
                        'schema:name': 'Data Stream Scheme Identifier',
                        'schema:description': 'The unique identifier (IRI) of the scheme or authority used for the Data Stream Identifier.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Data Stream Scheme Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'link',
                            hidden: true,
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Data Stream Scheme Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                },
                multiValued: false,
                required: [
                    '@context',
                    '@id',
                    'Data Stream Name',
                    'Data Stream Identifier',
                    'Data Stream Scheme',
                    'Data Stream Scheme Identifier',
                ],
                additionalProperties: false,
                'schema:schemaVersion': '1.6.0',
                '@id': 'https://repo.metadatacenter.org/template-elements/d7b8e30e-9995-40b5-a409-759cc3ddadaf',
                _ui: {
                    order: [
                        'Data Stream Name',
                        'Data Stream Identifier',
                        'Data Stream Scheme',
                        'Data Stream Scheme Identifier',
                    ],
                    propertyLabels: {
                        'Data Stream Name': 'Data Stream Name',
                        'Data Stream Identifier': 'Data Stream Identifier',
                        'Data Stream Scheme': 'Data Stream Scheme',
                        'Data Stream Scheme Identifier': 'Data Stream Scheme Identifier',
                    },
                    propertyDescriptions: {
                        'Data Stream Name': 'Human readable name of collection of records coming from a data source. A data stream is a collection of one or more variable records originating from a single data source (e.g., sensor, process, or person). A data stream can grow over time.',
                        'Data Stream Identifier': 'Globally unique string that identifies the collection of records coming from a data source.',
                        'Data Stream Scheme': 'The name of the scheme or authority used for the Data Stream Identifier.',
                        'Data Stream Scheme Identifier': 'The unique identifier (IRI) of the scheme or authority used for the Data Stream Identifier.',
                    },
                },
                '@context': {
                    xsd: 'http://www.w3.org/2001/XMLSchema#',
                    pav: 'http://purl.org/pav/',
                    bibo: 'http://purl.org/ontology/bibo/',
                    oslc: 'http://open-services.net/ns/core#',
                    schema: 'http://schema.org/',
                    'schema:name': {
                        '@type': 'xsd:string',
                    },
                    'schema:description': {
                        '@type': 'xsd:string',
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
                },
                'schema:identifier': 'data_source_stream',
                'schema:name': 'Data Source Stream',
                'schema:description': 'A collection of one or more variable records originating from a single data source (e.g., sensor, process, or person). A data stream can grow over time.',
                'pav:derivedFrom': '',
                'skos:prefLabel': 'Data Source Stream',
                'skos:altLabel': [],
                'pav:version': '0.0.1',
                'bibo:status': 'bibo:draft',
                'pav:createdOn': '2022-08-11T21:26:18-07:00',
                'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                'pav:lastUpdatedOn': '2022-08-11T21:26:18-07:00',
                'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                $schema: 'http://json-schema.org/draft-04/schema#',
            },
        },
        'Data File Language': {
            '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
            type: 'object',
            title: 'Element(Data File Language)',
            description: 'Generated by CSV2CEDAR.',
            properties: {
                'Primary Language': {
                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                    '@id': 'https://repo.metadatacenter.org/template-fields/b246b473-bd28-4c79-a41d-d68bda9b1ddb',
                    'schema:identifier': 'primary_language',
                    'schema:name': 'Primary Language',
                    'schema:description': 'Primary language used to present the data file (if multiple languages are present).',
                    'pav:derivedFrom': '',
                    'skos:prefLabel': 'Primary Language',
                    'skos:altLabel': [],
                    'pav:version': '0.9.0',
                    'bibo:status': 'bibo:draft',
                    _valueConstraints: {
                        requiredValue: false,
                        multipleChoice: false,
                        classes: [],
                        branches: [],
                        ontologies: [
                            {
                                uri: 'https://bioportal.bioontology.org/ontologies/ISO639-1',
                                acronym: 'ISO639-1',
                                name: 'ISO639-1',
                            },
                        ],
                        literals: [],
                        defaultValue: {
                            termUri: 'https://www.omg.org/spec/LCC/Languages/LaISO639-1-LanguageCodes/en',
                            'rdfs:label': '[en]',
                        },
                    },
                    _ui: {
                        inputType: 'textfield',
                    },
                    'pav:createdOn': null,
                    'pav:createdBy': null,
                    'pav:lastUpdatedOn': null,
                    'oslc:modifiedBy': null,
                    type: 'object',
                    title: 'Field(Primary Language)',
                    description: 'Generated by CSV2CEDAR.',
                    properties: {
                        '@type': {
                            oneOf: [
                                {
                                    type: 'string',
                                    format: 'uri',
                                },
                                {
                                    type: 'array',
                                    minItems: 1,
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
                    additionalProperties: false,
                    'schema:schemaVersion': '1.6.0',
                    '@context': {
                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                        pav: 'http://purl.org/pav/',
                        bibo: 'http://purl.org/ontology/bibo/',
                        oslc: 'http://open-services.net/ns/core#',
                        schema: 'http://schema.org/',
                        skos: 'http://www.w3.org/2004/02/skos/core#',
                        'schema:name': {
                            '@type': 'xsd:string',
                        },
                        'schema:description': {
                            '@type': 'xsd:string',
                        },
                        'skos:prefLabel': {
                            '@type': 'xsd:string',
                        },
                        'skos:altLabel': {
                            '@type': 'xsd:string',
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
                    },
                    $schema: 'http://json-schema.org/draft-04/schema#',
                },
                '@id': {
                    type: 'string',
                    format: 'uri',
                },
                '@context': {
                    type: 'object',
                    properties: {
                        'Primary Language': {
                            enum: [
                                'http://vocab.fairdatacollective.org/gdmt/hasPrimaryLanguage',
                            ],
                        },
                        'Other Language': {
                            enum: [
                                'http://purl.org/dc/terms/language',
                            ],
                        },
                    },
                    additionalProperties: false,
                },
                'Other Language': {
                    type: 'array',
                    minItems: 1,
                    items: {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/6062a3cd-ac6b-4ae3-a7a5-49fbb175ea94',
                        'schema:identifier': 'other_language',
                        'schema:name': 'Other Language',
                        'schema:description': 'A language in which the data file being described is provided.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Other Language',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                            classes: [],
                            branches: [],
                            ontologies: [
                                {
                                    uri: 'https://bioportal.bioontology.org/ontologies/ISO639-1',
                                    acronym: 'ISO639-1',
                                    name: 'ISO639-1',
                                },
                            ],
                            literals: [],
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Other Language)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                },
                '@type': {
                    oneOf: [
                        {
                            type: 'string',
                            format: 'uri',
                        },
                        {
                            type: 'array',
                            minItems: 1,
                            items: {
                                type: 'string',
                                format: 'uri',
                            },
                            uniqueItems: true,
                        },
                    ],
                },
            },
            multiValued: false,
            required: [
                '@context',
                '@id',
                'Primary Language',
                'Other Language',
            ],
            additionalProperties: false,
            'schema:schemaVersion': '1.6.0',
            '@id': 'https://repo.metadatacenter.org/template-elements/250eeb13-1f1d-4b20-98b6-21a072d7f595',
            _ui: {
                order: [
                    'Primary Language',
                    'Other Language',
                ],
                propertyLabels: {
                    'Primary Language': 'Primary Language',
                    'Other Language': 'Other Language',
                },
                propertyDescriptions: {
                    'Primary Language': 'Primary language used to present the data file (if multiple languages are present).',
                    'Other Language': 'A language in which the data file being described is provided.',
                },
            },
            '@context': {
                xsd: 'http://www.w3.org/2001/XMLSchema#',
                pav: 'http://purl.org/pav/',
                bibo: 'http://purl.org/ontology/bibo/',
                oslc: 'http://open-services.net/ns/core#',
                schema: 'http://schema.org/',
                'schema:name': {
                    '@type': 'xsd:string',
                },
                'schema:description': {
                    '@type': 'xsd:string',
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
            },
            'schema:identifier': 'data_file_language',
            'schema:name': 'Data File Language',
            'schema:description': 'Language in which the data file being described is provided.',
            'pav:derivedFrom': '',
            'skos:prefLabel': 'Data File Language',
            'skos:altLabel': [],
            'pav:version': '0.0.1',
            'bibo:status': 'bibo:draft',
            'pav:createdOn': '2022-08-11T21:26:18-07:00',
            'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
            'pav:lastUpdatedOn': '2022-08-11T21:26:18-07:00',
            'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
            $schema: 'http://json-schema.org/draft-04/schema#',
        },
        'oslc:modifiedBy': {
            type: [
                'string',
                'null',
            ],
            format: 'uri',
        },
        '@id': {
            type: [
                'string',
                'null',
            ],
            format: 'uri',
        },
        'Data File Creator': {
            type: 'array',
            minItems: 1,
            items: {
                '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                type: 'object',
                title: 'Element(Data File Creator)',
                description: 'Generated by CSV2CEDAR.',
                properties: {
                    'Creator Identifier Scheme Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/598b03c7-b97f-4308-8d08-135c6cf5e964',
                        'schema:identifier': 'creator_identifier_scheme_identifier',
                        'schema:name': 'Creator Identifier Scheme Identifier',
                        'schema:description': 'The unique identifier (IRI) of the scheme or authority used for the Creator Identifier.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Creator Identifier Scheme Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'link',
                            hidden: true,
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Creator Identifier Scheme Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Creator Role': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/8e3b217c-95c7-4d9e-a942-e3238e8f5d3a',
                        'schema:identifier': 'creator_role',
                        'schema:name': 'Creator Role',
                        'schema:description': 'The role of the creator in bringing the described data file into existence.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Creator Role',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                            classes: [],
                            branches: [
                                {
                                    source: 'https://bioportal.bioontology.org/ontologies/FDC-GDMT',
                                    acronym: 'FDC-GDMT',
                                    name: 'FDC-GDMT',
                                    uri: 'http://vocab.fairdatacollective.org/gdmt/ContributorRole',
                                    maxDepth: 2147483647,
                                },
                            ],
                            ontologies: [],
                            literals: [],
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Creator Role)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Creator Type': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/eddef290-6784-42bc-a1aa-402951944215',
                        'schema:identifier': 'creator_type',
                        'schema:name': 'Creator Type',
                        'schema:description': 'The type of the creator of the described data file (person or organization).',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Creator Type',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                            classes: [],
                            branches: [
                                {
                                    source: 'https://bioportal.bioontology.org/ontologies/FDC-GDMT',
                                    acronym: 'FDC-GDMT',
                                    name: 'FDC-GDMT',
                                    uri: 'http://vocab.fairdatacollective.org/gdmt/ResourceCreatorType',
                                    maxDepth: 2147483647,
                                },
                            ],
                            ontologies: [],
                            literals: [],
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Creator Type)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Creator Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/c2338c38-81e7-4f3f-9003-82e9012e1734',
                        'schema:identifier': 'creator_identifier',
                        'schema:name': 'Creator Identifier',
                        'schema:description': 'Globally unique string that identifies the creator (an individual or legal entity).',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Creator Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Creator Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Creator Affiliation Identifier Scheme Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/e0f83530-7fb1-4814-9bc4-4562c105206e',
                        'schema:identifier': 'creator_affiliation_identifier_scheme_identifier',
                        'schema:name': 'Creator Affiliation Identifier Scheme Identifier',
                        'schema:description': 'The unique identifier (IRI) of the scheme or authority used for the Subject Identifier.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Creator Affiliation Identifier Scheme Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'link',
                            hidden: true,
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Creator Affiliation Identifier Scheme Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@type': {
                        oneOf: [
                            {
                                type: 'string',
                                format: 'uri',
                            },
                            {
                                type: 'array',
                                minItems: 1,
                                items: {
                                    type: 'string',
                                    format: 'uri',
                                },
                                uniqueItems: true,
                            },
                        ],
                    },
                    'Creator Identifier Scheme': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/3aefa9ca-8ebd-472d-8e21-862437782bc2',
                        'schema:identifier': 'creator_identifier_scheme',
                        'schema:name': 'Creator Identifier Scheme',
                        'schema:description': 'The name of the scheme or authority used for the Creator Identifier.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Creator Identifier Scheme',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                            classes: [],
                            branches: [
                                {
                                    source: 'https://bioportal.bioontology.org/ontologies/FDC-GDMT',
                                    acronym: 'FDC-GDMT',
                                    name: 'FDC-GDMT',
                                    uri: 'http://vocab.fairdatacollective.org/gdmt/IdentifierScheme',
                                    maxDepth: 2147483647,
                                },
                            ],
                            ontologies: [],
                            literals: [],
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Creator Identifier Scheme)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Creator Family Name': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/bf8ef2a5-cc9a-4337-981d-cb9247bffdf1',
                        'schema:identifier': 'creator_family_name',
                        'schema:name': 'Creator Family Name',
                        'schema:description': 'If the creator is a person, the surname(s) of the creator (e.g., last name in Western languagues, first name in Asian languages).',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Creator Family Name',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Creator Family Name)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@context': {
                        type: 'object',
                        properties: {
                            'Creator Type': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasCreatorType',
                                ],
                            },
                            'Creator Name': {
                                enum: [
                                    'http://purl.org/dc/terms/creator',
                                ],
                            },
                            'Creator Given Name': {
                                enum: [
                                    'http://xmlns.com/foaf/0.1/givenName',
                                ],
                            },
                            'Creator Family Name': {
                                enum: [
                                    'http://xmlns.com/foaf/0.1/familyName',
                                ],
                            },
                            'Creator Identifier': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasCreatorIdentifier',
                                ],
                            },
                            'Creator Identifier Scheme': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasCreatorIdentifierScheme',
                                ],
                            },
                            'Creator Identifier Scheme Identifier': {
                                enum: [
                                    'https://schema.metadatacenter.org/properties/cffc1d3a-abb7-4d1b-b523-76948f3452a9',
                                ],
                            },
                            'Creator Affiliation': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasCreatorAffiliation',
                                ],
                            },
                            'Creator Affiliation Identifier': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasCreatorAffiliationIdentifier',
                                ],
                            },
                            'Creator Affiliation Identifier Scheme': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasCreatorAffiliationIdentifierScheme',
                                ],
                            },
                            'Creator Affiliation Identifier Scheme Identifier': {
                                enum: [
                                    'https://schema.metadatacenter.org/properties/e8678031-13bc-44d2-a80e-b7af75bfa4d5',
                                ],
                            },
                            'Creator Email': {
                                enum: [
                                    'http://xmlns.com/foaf/0.1/mbox',
                                ],
                            },
                            'Creator Role': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasCreatorRole',
                                ],
                            },
                        },
                        additionalProperties: false,
                    },
                    'Creator Affiliation Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/34293eda-7e7c-4f5b-ab5d-fd45a8073c94',
                        'schema:identifier': 'creator_affiliation_identifier',
                        'schema:name': 'Creator Affiliation Identifier',
                        'schema:description': 'Globally unique string that identifies the organizational affiliation of the creator.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Creator Affiliation Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Creator Affiliation Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Creator Given Name': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/2f2c141f-5694-4035-80f2-5f2e422a446f',
                        'schema:identifier': 'creator_given_name',
                        'schema:name': 'Creator Given Name',
                        'schema:description': 'If the creator is a person, the personal name(s) of the creator (e.g., first and optionally middle name in Western languagues, optionally middle and last name in Asian languages).',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Creator Given Name',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Creator Given Name)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Creator Email': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/8aad13d2-1137-46ae-ab20-ff88c3313c28',
                        'schema:identifier': 'creator_email',
                        'schema:name': 'Creator Email',
                        'schema:description': 'An email address of the creator.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Creator Email',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'email',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Creator Email)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Creator Name': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/c281adb4-27dd-46f7-983f-6df5801a4134',
                        'schema:identifier': 'creator_name',
                        'schema:name': 'Creator Name',
                        'schema:description': 'The full name of the creator.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Creator Name',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Creator Name)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Creator Affiliation': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/2c4b1ad1-235b-49bb-8085-0b5f46116ce3',
                        'schema:identifier': 'creator_affiliation',
                        'schema:name': 'Creator Affiliation',
                        'schema:description': 'The organizational or institutional affiliation of the creator.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Creator Affiliation',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Creator Affiliation)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@id': {
                        type: 'string',
                        format: 'uri',
                    },
                    'Creator Affiliation Identifier Scheme': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/b2bf4248-a08c-48d2-98f9-4206f765a469',
                        'schema:identifier': 'creator_affiliation_identifier_scheme',
                        'schema:name': 'Creator Affiliation Identifier Scheme',
                        'schema:description': 'The name of the scheme or authority used for the Creator Affiliation Identifier.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Creator Affiliation Identifier Scheme',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                            classes: [],
                            branches: [
                                {
                                    source: 'https://bioportal.bioontology.org/ontologies/FDC-GDMT',
                                    acronym: 'FDC-GDMT',
                                    name: 'FDC-GDMT',
                                    uri: 'http://vocab.fairdatacollective.org/gdmt/IdentifierScheme',
                                    maxDepth: 2147483647,
                                },
                            ],
                            ontologies: [],
                            literals: [],
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Creator Affiliation Identifier Scheme)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                },
                multiValued: false,
                required: [
                    '@context',
                    '@id',
                    'Creator Type',
                    'Creator Name',
                    'Creator Given Name',
                    'Creator Family Name',
                    'Creator Identifier',
                    'Creator Identifier Scheme',
                    'Creator Identifier Scheme Identifier',
                    'Creator Affiliation',
                    'Creator Affiliation Identifier',
                    'Creator Affiliation Identifier Scheme',
                    'Creator Affiliation Identifier Scheme Identifier',
                    'Creator Email',
                    'Creator Role',
                ],
                additionalProperties: false,
                'schema:schemaVersion': '1.6.0',
                '@id': 'https://repo.metadatacenter.org/template-elements/167697dc-265c-4e9a-95e6-55f69b2f8f4a',
                _ui: {
                    order: [
                        'Creator Type',
                        'Creator Name',
                        'Creator Given Name',
                        'Creator Family Name',
                        'Creator Identifier',
                        'Creator Identifier Scheme',
                        'Creator Identifier Scheme Identifier',
                        'Creator Affiliation',
                        'Creator Affiliation Identifier',
                        'Creator Affiliation Identifier Scheme',
                        'Creator Affiliation Identifier Scheme Identifier',
                        'Creator Email',
                        'Creator Role',
                    ],
                    propertyLabels: {
                        'Creator Type': 'Creator Type',
                        'Creator Name': 'Creator Name',
                        'Creator Given Name': 'Creator Given Name',
                        'Creator Family Name': 'Creator Family Name',
                        'Creator Identifier': 'Creator Identifier',
                        'Creator Identifier Scheme': 'Creator Identifier Scheme',
                        'Creator Identifier Scheme Identifier': 'Creator Identifier Scheme Identifier',
                        'Creator Affiliation': 'Creator Affiliation',
                        'Creator Affiliation Identifier': 'Creator Affiliation Identifier',
                        'Creator Affiliation Identifier Scheme': 'Creator Affiliation Identifier Scheme',
                        'Creator Affiliation Identifier Scheme Identifier': 'Creator Affiliation Identifier Scheme Identifier',
                        'Creator Email': 'Creator Email',
                        'Creator Role': 'Creator Role',
                    },
                    propertyDescriptions: {
                        'Creator Type': 'The type of the creator of the described data file (person or organization).',
                        'Creator Name': 'The full name of the creator.',
                        'Creator Given Name': 'If the creator is a person, the personal name(s) of the creator (e.g., first and optionally middle name in Western languagues, optionally middle and last name in Asian languages).',
                        'Creator Family Name': 'If the creator is a person, the surname(s) of the creator (e.g., last name in Western languagues, first name in Asian languages).',
                        'Creator Identifier': 'Globally unique string that identifies the creator (an individual or legal entity).',
                        'Creator Identifier Scheme': 'The name of the scheme or authority used for the Creator Identifier.',
                        'Creator Identifier Scheme Identifier': 'The unique identifier (IRI) of the scheme or authority used for the Creator Identifier.',
                        'Creator Affiliation': 'The organizational or institutional affiliation of the creator.',
                        'Creator Affiliation Identifier': 'Globally unique string that identifies the organizational affiliation of the creator.',
                        'Creator Affiliation Identifier Scheme': 'The name of the scheme or authority used for the Creator Affiliation Identifier.',
                        'Creator Affiliation Identifier Scheme Identifier': 'The unique identifier (IRI) of the scheme or authority used for the Subject Identifier.',
                        'Creator Email': 'An email address of the creator.',
                        'Creator Role': 'The role of the creator in bringing the described data file into existence.',
                    },
                },
                '@context': {
                    xsd: 'http://www.w3.org/2001/XMLSchema#',
                    pav: 'http://purl.org/pav/',
                    bibo: 'http://purl.org/ontology/bibo/',
                    oslc: 'http://open-services.net/ns/core#',
                    schema: 'http://schema.org/',
                    'schema:name': {
                        '@type': 'xsd:string',
                    },
                    'schema:description': {
                        '@type': 'xsd:string',
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
                },
                'schema:identifier': 'data_file_creator',
                'schema:name': 'Data File Creator',
                'schema:description': 'An entity that brought into existence the data file being described. Creators can be people, organizations and/or physical or virtual infrastructure (e.g., sensors, software).',
                'pav:derivedFrom': '',
                'skos:prefLabel': 'Data File Creator',
                'skos:altLabel': [],
                'pav:version': '0.0.1',
                'bibo:status': 'bibo:draft',
                'pav:createdOn': '2022-08-11T21:26:18-07:00',
                'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                'pav:lastUpdatedOn': '2022-08-11T21:26:18-07:00',
                'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                $schema: 'http://json-schema.org/draft-04/schema#',
            },
        },
        'Data File Version': {
            '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
            type: 'object',
            title: 'Element(Data File Version)',
            description: 'Generated by CSV2CEDAR.',
            properties: {
                '@id': {
                    type: 'string',
                    format: 'uri',
                },
                '@context': {
                    type: 'object',
                    properties: {
                        Version: {
                            enum: [
                                'http://schema.org/version',
                            ],
                        },
                    },
                    additionalProperties: false,
                },
                Version: {
                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                    '@id': 'https://repo.metadatacenter.org/template-fields/b4e196b9-9aaf-49cf-9235-4e3866a40379',
                    'schema:identifier': 'version',
                    'schema:name': 'Version',
                    'schema:description': 'The string identifying the version of the data file or other resource being described.',
                    'pav:derivedFrom': '',
                    'skos:prefLabel': 'Version',
                    'skos:altLabel': [],
                    'pav:version': '0.9.0',
                    'bibo:status': 'bibo:draft',
                    _valueConstraints: {
                        defaultValue: '',
                        requiredValue: false,
                        multipleChoice: false,
                    },
                    _ui: {
                        inputType: 'textfield',
                    },
                    'pav:createdOn': null,
                    'pav:createdBy': null,
                    'pav:lastUpdatedOn': null,
                    'oslc:modifiedBy': null,
                    type: 'object',
                    title: 'Field(Version)',
                    description: 'Generated by CSV2CEDAR.',
                    properties: {
                        '@type': {
                            oneOf: [
                                {
                                    type: 'string',
                                    format: 'uri',
                                },
                                {
                                    type: 'array',
                                    minItems: 1,
                                    items: {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    uniqueItems: true,
                                },
                            ],
                        },
                        '@value': {
                            type: [
                                'string',
                                'null',
                            ],
                        },
                        'rdfs:label': {
                            type: [
                                'string',
                                'null',
                            ],
                        },
                    },
                    additionalProperties: false,
                    'schema:schemaVersion': '1.6.0',
                    '@context': {
                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                        pav: 'http://purl.org/pav/',
                        bibo: 'http://purl.org/ontology/bibo/',
                        oslc: 'http://open-services.net/ns/core#',
                        schema: 'http://schema.org/',
                        skos: 'http://www.w3.org/2004/02/skos/core#',
                        'schema:name': {
                            '@type': 'xsd:string',
                        },
                        'schema:description': {
                            '@type': 'xsd:string',
                        },
                        'skos:prefLabel': {
                            '@type': 'xsd:string',
                        },
                        'skos:altLabel': {
                            '@type': 'xsd:string',
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
                    },
                    $schema: 'http://json-schema.org/draft-04/schema#',
                },
                '@type': {
                    oneOf: [
                        {
                            type: 'string',
                            format: 'uri',
                        },
                        {
                            type: 'array',
                            minItems: 1,
                            items: {
                                type: 'string',
                                format: 'uri',
                            },
                            uniqueItems: true,
                        },
                    ],
                },
            },
            multiValued: false,
            required: [
                '@context',
                '@id',
                'Version',
            ],
            additionalProperties: false,
            'schema:schemaVersion': '1.6.0',
            '@id': 'https://repo.metadatacenter.org/template-elements/e6c6d89b-9af7-4f9b-9d9a-daafbe8684ef',
            _ui: {
                order: [
                    'Version',
                ],
                propertyLabels: {
                    Version: 'Version',
                },
                propertyDescriptions: {
                    Version: 'The string identifying the version of the data file or other resource being described.',
                },
            },
            '@context': {
                xsd: 'http://www.w3.org/2001/XMLSchema#',
                pav: 'http://purl.org/pav/',
                bibo: 'http://purl.org/ontology/bibo/',
                oslc: 'http://open-services.net/ns/core#',
                schema: 'http://schema.org/',
                'schema:name': {
                    '@type': 'xsd:string',
                },
                'schema:description': {
                    '@type': 'xsd:string',
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
            },
            'schema:identifier': 'data_file_version',
            'schema:name': 'Data File Version',
            'schema:description': 'Version of the resource being described.',
            'pav:derivedFrom': '',
            'skos:prefLabel': 'Data File Version',
            'skos:altLabel': [],
            'pav:version': '0.0.1',
            'bibo:status': 'bibo:draft',
            'pav:createdOn': '2022-08-11T21:26:18-07:00',
            'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
            'pav:lastUpdatedOn': '2022-08-11T21:26:18-07:00',
            'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
            $schema: 'http://json-schema.org/draft-04/schema#',
        },
        'Data File Rights': {
            type: 'array',
            minItems: 1,
            items: {
                '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                type: 'object',
                title: 'Element(Data File Rights)',
                description: 'Generated by CSV2CEDAR.',
                properties: {
                    'License Name': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/c26853f5-2e33-4a00-a8c6-04237dd31fb6',
                        'schema:identifier': 'license_name',
                        'schema:name': 'License Name',
                        'schema:description': 'A standardized version of the license name.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'License Name',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                            classes: [],
                            branches: [
                                {
                                    source: 'https://bioportal.bioontology.org/ontologies/FDC-GDMT',
                                    acronym: 'FDC-GDMT',
                                    name: 'FDC-GDMT',
                                    uri: 'http://vocab.fairdatacollective.org/gdmt/LicenseIdentifier',
                                    maxDepth: 2147483647,
                                },
                            ],
                            ontologies: [],
                            literals: [],
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(License Name)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@id': {
                        type: 'string',
                        format: 'uri',
                    },
                    'License Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/0e24ca6d-3f79-43f2-8e18-37c1083e2207',
                        'schema:identifier': 'license_identifier',
                        'schema:name': 'License Identifier',
                        'schema:description': 'The unique identifier (IRI) of the license for the data file being described.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'License Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'link',
                            hidden: true,
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(License Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@context': {
                        type: 'object',
                        properties: {
                            'License Name': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasLicenseName',
                                ],
                            },
                            'License Identifier': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasLicenseIdentifier',
                                ],
                            },
                            'License Text': {
                                enum: [
                                    'http://purl.org/dc/terms/rights',
                                ],
                            },
                        },
                        additionalProperties: false,
                    },
                    '@type': {
                        oneOf: [
                            {
                                type: 'string',
                                format: 'uri',
                            },
                            {
                                type: 'array',
                                minItems: 1,
                                items: {
                                    type: 'string',
                                    format: 'uri',
                                },
                                uniqueItems: true,
                            },
                        ],
                    },
                    'License Text': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/6553d689-dbf4-4354-af91-7e5107e12ab1',
                        'schema:identifier': 'license_text',
                        'schema:name': 'License Text',
                        'schema:description': 'Text string describing any rights information for the data file being described.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'License Text',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(License Text)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                },
                multiValued: false,
                required: [
                    '@context',
                    '@id',
                    'License Name',
                    'License Identifier',
                    'License Text',
                ],
                additionalProperties: false,
                'schema:schemaVersion': '1.6.0',
                '@id': 'https://repo.metadatacenter.org/template-elements/56706780-ceba-4ae6-a183-ee41b8ecbab7',
                _ui: {
                    order: [
                        'License Name',
                        'License Identifier',
                        'License Text',
                    ],
                    propertyLabels: {
                        'License Name': 'License Name',
                        'License Identifier': 'License Identifier',
                        'License Text': 'License Text',
                    },
                    propertyDescriptions: {
                        'License Name': 'A standardized version of the license name.',
                        'License Identifier': 'The unique identifier (IRI) of the license for the data file being described.',
                        'License Text': 'Text string describing any rights information for the data file being described.',
                    },
                },
                '@context': {
                    xsd: 'http://www.w3.org/2001/XMLSchema#',
                    pav: 'http://purl.org/pav/',
                    bibo: 'http://purl.org/ontology/bibo/',
                    oslc: 'http://open-services.net/ns/core#',
                    schema: 'http://schema.org/',
                    'schema:name': {
                        '@type': 'xsd:string',
                    },
                    'schema:description': {
                        '@type': 'xsd:string',
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
                },
                'schema:identifier': 'data_file_rights',
                'schema:name': 'Data File Rights',
                'schema:description': 'Way in which the data file may or may not be accessed and used.',
                'pav:derivedFrom': '',
                'skos:prefLabel': 'Data File Rights',
                'skos:altLabel': [],
                'pav:version': '0.0.1',
                'bibo:status': 'bibo:draft',
                'pav:createdOn': '2022-08-11T21:26:18-07:00',
                'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                'pav:lastUpdatedOn': '2022-08-11T21:26:18-07:00',
                'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                $schema: 'http://json-schema.org/draft-04/schema#',
            },
        },
        'Data File Parent Study': {
            type: 'array',
            minItems: 1,
            items: {
                '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                type: 'object',
                title: 'Element(Data File Parent Study)',
                description: 'Generated by CSV2CEDAR.',
                properties: {
                    'Study Identifier Scheme': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/b05f4c23-5610-4e23-944b-9e35fd671226',
                        'schema:identifier': 'study_identifier_scheme',
                        'schema:name': 'Study Identifier Scheme',
                        'schema:description': 'The name of the scheme or authority used for the Study Identifier.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Study Identifier Scheme',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                            classes: [],
                            branches: [
                                {
                                    source: 'https://bioportal.bioontology.org/ontologies/FDC-GDMT',
                                    acronym: 'FDC-GDMT',
                                    name: 'FDC-GDMT',
                                    uri: 'http://vocab.fairdatacollective.org/gdmt/IdentifierType',
                                    maxDepth: 2147483647,
                                },
                            ],
                            ontologies: [],
                            literals: [],
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Study Identifier Scheme)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Study End Date': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/684d5931-0e9b-4ad8-bda7-bcc24603a4aa',
                        'schema:identifier': 'study_end_date',
                        'schema:name': 'Study End Date',
                        'schema:description': 'The official end date for the study for which this data file was created.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Study End Date',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            temporalType: 'xsd:date',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            temporalGranularity: 'day',
                            valueRecommendationEnabled: true,
                            inputType: 'temporal',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Study End Date)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Study Start Date': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/6ec4c383-e9d9-44d8-a6cc-e0b45f4bfa5d',
                        'schema:identifier': 'study_start_date',
                        'schema:name': 'Study Start Date',
                        'schema:description': 'The official start date for the study for which this data file was created.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Study Start Date',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            temporalType: 'xsd:date',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            temporalGranularity: 'day',
                            valueRecommendationEnabled: true,
                            inputType: 'temporal',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Study Start Date)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@type': {
                        oneOf: [
                            {
                                type: 'string',
                                format: 'uri',
                            },
                            {
                                type: 'array',
                                minItems: 1,
                                items: {
                                    type: 'string',
                                    format: 'uri',
                                },
                                uniqueItems: true,
                            },
                        ],
                    },
                    'Study Local Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/734e7238-d070-43cf-acb3-2c17d1c5a259',
                        'schema:identifier': 'study_local_identifier',
                        'schema:name': 'Study Local Identifier',
                        'schema:description': 'A local identifier, such as a phs number, that identifies the study for which this data file was created.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Study Local Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: true,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Study Local Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Study Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/18edb9f7-9caf-40fe-9b72-a4370d52fa03',
                        'schema:identifier': 'study_identifier',
                        'schema:name': 'Study Identifier',
                        'schema:description': 'Globally unique string that identifies the study for which this data file was created.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Study Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Study Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Study Identifier Scheme Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/b1fedc9e-df7d-4e2c-9b90-fc02bd3c9efc',
                        'schema:identifier': 'study_identifier_scheme_identifier',
                        'schema:name': 'Study Identifier Scheme Identifier',
                        'schema:description': 'The unique identifier (IRI) of the scheme or authority used for the Study Identifier.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Study Identifier Scheme Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'link',
                            hidden: true,
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Study Identifier Scheme Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@id': {
                        type: 'string',
                        format: 'uri',
                    },
                    '@context': {
                        type: 'object',
                        properties: {
                            'Study Local Identifier': {
                                enum: [
                                    'https://schema.metadatacenter.org/properties/437aa34a-63dd-4b17-8529-bef37c10e7d7',
                                ],
                            },
                            'Study Identifier': {
                                enum: [
                                    'https://schema.metadatacenter.org/properties/bfeef781-7d46-425b-8c6c-5727361104bb',
                                ],
                            },
                            'Study Identifier Scheme': {
                                enum: [
                                    'https://schema.metadatacenter.org/properties/0128c4b0-7962-4dd1-b445-3df29c6eec26',
                                ],
                            },
                            'Study Identifier Scheme Identifier': {
                                enum: [
                                    'https://schema.metadatacenter.org/properties/f3526909-340f-41c2-adf4-e06a6bccb9c9',
                                ],
                            },
                            'Study Name': {
                                enum: [
                                    'https://schema.metadatacenter.org/properties/d6177674-f67b-464a-af13-e9f590d98cc7',
                                ],
                            },
                            'Study Start Date': {
                                enum: [
                                    'https://schema.metadatacenter.org/properties/3cc5cb74-d84a-4f84-9667-a565a2c2a999',
                                ],
                            },
                            'Study End Date': {
                                enum: [
                                    'https://schema.metadatacenter.org/properties/3c161e48-00a2-4fbd-b668-015c16541673',
                                ],
                            },
                        },
                        additionalProperties: false,
                    },
                    'Study Name': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/8e11ad78-60df-4df0-9b24-8f9932a605ac',
                        'schema:identifier': 'study_name',
                        'schema:name': 'Study Name',
                        'schema:description': 'The name of the research study for which this data file was created.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Study Name',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Study Name)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                },
                multiValued: false,
                required: [
                    '@context',
                    '@id',
                    'Study Local Identifier',
                    'Study Identifier',
                    'Study Identifier Scheme',
                    'Study Identifier Scheme Identifier',
                    'Study Name',
                    'Study Start Date',
                    'Study End Date',
                ],
                additionalProperties: false,
                'schema:schemaVersion': '1.6.0',
                '@id': 'https://repo.metadatacenter.org/template-elements/c17f7942-e99a-4146-b364-63a06e889e1d',
                _ui: {
                    order: [
                        'Study Local Identifier',
                        'Study Identifier',
                        'Study Identifier Scheme',
                        'Study Identifier Scheme Identifier',
                        'Study Name',
                        'Study Start Date',
                        'Study End Date',
                    ],
                    propertyLabels: {
                        'Study Local Identifier': 'Study Local Identifier',
                        'Study Identifier': 'Study Identifier',
                        'Study Identifier Scheme': 'Study Identifier Scheme',
                        'Study Identifier Scheme Identifier': 'Study Identifier Scheme Identifier',
                        'Study Name': 'Study Name',
                        'Study Start Date': 'Study Start Date',
                        'Study End Date': 'Study End Date',
                    },
                    propertyDescriptions: {
                        'Study Local Identifier': 'A local identifier, such as a phs number, that identifies the study for which this data file was created.',
                        'Study Identifier': 'Globally unique string that identifies the study for which this data file was created.',
                        'Study Identifier Scheme': 'The name of the scheme or authority used for the Study Identifier.',
                        'Study Identifier Scheme Identifier': 'The unique identifier (IRI) of the scheme or authority used for the Study Identifier.',
                        'Study Name': 'The name of the research study for which this data file was created.',
                        'Study Start Date': 'The official start date for the study for which this data file was created.',
                        'Study End Date': 'The official end date for the study for which this data file was created.',
                    },
                },
                '@context': {
                    xsd: 'http://www.w3.org/2001/XMLSchema#',
                    pav: 'http://purl.org/pav/',
                    bibo: 'http://purl.org/ontology/bibo/',
                    oslc: 'http://open-services.net/ns/core#',
                    schema: 'http://schema.org/',
                    'schema:name': {
                        '@type': 'xsd:string',
                    },
                    'schema:description': {
                        '@type': 'xsd:string',
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
                },
                'schema:identifier': 'data_file_parent_study',
                'schema:name': 'Data File Parent Study',
                'schema:description': 'The research study for which this data file was created.',
                'pav:derivedFrom': '',
                'skos:prefLabel': 'Data File Parent Study',
                'skos:altLabel': [],
                'pav:version': '0.0.1',
                'bibo:status': 'bibo:draft',
                'pav:createdOn': '2022-08-11T21:26:18-07:00',
                'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                'pav:lastUpdatedOn': '2022-08-11T21:26:18-07:00',
                'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                $schema: 'http://json-schema.org/draft-04/schema#',
            },
        },
        'Data File Temporal Coverage': {
            type: 'array',
            minItems: 1,
            items: {
                '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                type: 'object',
                title: 'Element(Data File Temporal Coverage)',
                description: 'Generated by CSV2CEDAR.',
                properties: {
                    '@type': {
                        oneOf: [
                            {
                                type: 'string',
                                format: 'uri',
                            },
                            {
                                type: 'array',
                                minItems: 1,
                                items: {
                                    type: 'string',
                                    format: 'uri',
                                },
                                uniqueItems: true,
                            },
                        ],
                    },
                    'Temporal Extent Minimum Value': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/8072a4c8-e20b-408d-948c-c9877947069a',
                        'schema:identifier': 'temporal_extent_minimum_value',
                        'schema:name': 'Temporal Extent Minimum Value',
                        'schema:description': 'The start date (and optionally time) of the data.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Temporal Extent Minimum Value',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            temporalType: 'xsd:date',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            temporalGranularity: 'day',
                            valueRecommendationEnabled: true,
                            inputType: 'temporal',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Temporal Extent Minimum Value)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Temporal Extent Maximum Value': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/f89820cb-d044-4b90-9676-5dfa8eff4153',
                        'schema:identifier': 'temporal_extent_maximum_value',
                        'schema:name': 'Temporal Extent Maximum Value',
                        'schema:description': 'The end date (and optionally time) of the data.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Temporal Extent Maximum Value',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            temporalType: 'xsd:date',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            temporalGranularity: 'day',
                            valueRecommendationEnabled: true,
                            inputType: 'temporal',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Temporal Extent Maximum Value)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Temporal Resolution': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/2ae8e38c-0cd5-4d94-a463-e963363ebd9b',
                        'schema:identifier': 'temporal_resolution',
                        'schema:name': 'Temporal Resolution',
                        'schema:description': 'Interval between two consecutive data records.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Temporal Resolution',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Temporal Resolution)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    Duration: {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/6a162b6c-4d69-4554-9cd7-411aba2ffbdb',
                        'schema:identifier': 'duration',
                        'schema:name': 'Duration',
                        'schema:description': 'The total duration of data temporal coverage.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Duration',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Duration)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@id': {
                        type: 'string',
                        format: 'uri',
                    },
                    '@context': {
                        type: 'object',
                        properties: {
                            'Temporal Extent Minimum Value': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasTemporalExtentMinimumValue',
                                ],
                            },
                            'Temporal Extent Maximum Value': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasTemporalExtentMaximumValue',
                                ],
                            },
                            'Temporal Resolution': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasTemporalResolution',
                                ],
                            },
                            Duration: {
                                enum: [
                                    'http://schema.org/duration',
                                ],
                            },
                        },
                        additionalProperties: false,
                    },
                },
                multiValued: false,
                required: [
                    '@context',
                    '@id',
                    'Temporal Extent Minimum Value',
                    'Temporal Extent Maximum Value',
                    'Temporal Resolution',
                    'Duration',
                ],
                additionalProperties: false,
                'schema:schemaVersion': '1.6.0',
                '@id': 'https://repo.metadatacenter.org/template-elements/98c2245a-c029-44da-9273-3465fa1716c6',
                _ui: {
                    order: [
                        'Temporal Extent Minimum Value',
                        'Temporal Extent Maximum Value',
                        'Temporal Resolution',
                        'Duration',
                    ],
                    propertyLabels: {
                        'Temporal Extent Minimum Value': 'Temporal Extent Minimum Value',
                        'Temporal Extent Maximum Value': 'Temporal Extent Maximum Value',
                        'Temporal Resolution': 'Temporal Resolution',
                        Duration: 'Duration',
                    },
                    propertyDescriptions: {
                        'Temporal Extent Minimum Value': 'The start date (and optionally time) of the data.',
                        'Temporal Extent Maximum Value': 'The end date (and optionally time) of the data.',
                        'Temporal Resolution': 'Interval between two consecutive data records.',
                        Duration: 'The total duration of data temporal coverage.',
                    },
                },
                '@context': {
                    xsd: 'http://www.w3.org/2001/XMLSchema#',
                    pav: 'http://purl.org/pav/',
                    bibo: 'http://purl.org/ontology/bibo/',
                    oslc: 'http://open-services.net/ns/core#',
                    schema: 'http://schema.org/',
                    'schema:name': {
                        '@type': 'xsd:string',
                    },
                    'schema:description': {
                        '@type': 'xsd:string',
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
                },
                'schema:identifier': 'data_file_temporal_coverage',
                'schema:name': 'Data File Temporal Coverage',
                'schema:description': 'The temporal coverage and resolution of the data file being described.',
                'pav:derivedFrom': '',
                'skos:prefLabel': 'Data File Temporal Coverage',
                'skos:altLabel': [],
                'pav:version': '0.0.1',
                'bibo:status': 'bibo:draft',
                'pav:createdOn': '2022-08-11T21:26:18-07:00',
                'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                'pav:lastUpdatedOn': '2022-08-11T21:26:18-07:00',
                'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                $schema: 'http://json-schema.org/draft-04/schema#',
            },
        },
        '@context': {
            properties: {
                schema: {
                    type: 'string',
                    format: 'uri',
                    enum: [
                        'http://schema.org/',
                    ],
                },
                'Data Characteristics Summary': {
                    enum: [
                        'https://schema.metadatacenter.org/properties/857e5338-c698-48a4-af29-a2d049bc8152',
                    ],
                },
                'Auxiliary Metadata': {
                    enum: [
                        'https://schema.metadatacenter.org/properties/b604db75-3cad-422d-8b85-5bb363635134',
                    ],
                },
                'Data File Process Version': {
                    enum: [
                        'https://schema.metadatacenter.org/properties/c14dea39-018f-49c4-ba44-6254a88fd173',
                    ],
                },
                xsd: {
                    type: 'string',
                    format: 'uri',
                    enum: [
                        'http://www.w3.org/2001/XMLSchema#',
                    ],
                },
                'pav:createdOn': {
                    type: 'object',
                    properties: {
                        '@type': {
                            type: 'string',
                            enum: [
                                'xsd:dateTime',
                            ],
                        },
                    },
                },
                skos: {
                    type: 'string',
                    format: 'uri',
                    enum: [
                        'http://www.w3.org/2004/02/skos/core#',
                    ],
                },
                'Data File Vertical Coverage': {
                    enum: [
                        'https://schema.metadatacenter.org/properties/13f51100-1cf8-451a-b7a0-52932377171e',
                    ],
                },
                rdfs: {
                    type: 'string',
                    format: 'uri',
                    enum: [
                        'http://www.w3.org/2000/01/rdf-schema#',
                    ],
                },
                'Data File Related Resource': {
                    enum: [
                        'https://schema.metadatacenter.org/properties/848dc135-9068-4a5b-ba8c-98a5994f9d59',
                    ],
                },
                'Data File Description': {
                    enum: [
                        'https://schema.metadatacenter.org/properties/595ca75a-a61e-45f8-964c-a2d00c1874b4',
                    ],
                },
                'pav:createdBy': {
                    type: 'object',
                    properties: {
                        '@type': {
                            type: 'string',
                            enum: [
                                '@id',
                            ],
                        },
                    },
                },
                'Data File Funding Source': {
                    enum: [
                        'https://schema.metadatacenter.org/properties/fe98b0dc-7056-44d1-b0a7-4b02ef8ccc6f',
                    ],
                },
                'Data Source Stream': {
                    enum: [
                        'https://schema.metadatacenter.org/properties/b012de2c-549b-4c51-b0be-2e0bb12bf9cb',
                    ],
                },
                'Data File Language': {
                    enum: [
                        'https://schema.metadatacenter.org/properties/a690b6b3-230b-4ef9-91a7-ce56209368ab',
                    ],
                },
                'rdfs:label': {
                    type: 'object',
                    properties: {
                        '@type': {
                            type: 'string',
                            enum: [
                                'xsd:string',
                            ],
                        },
                    },
                },
                'oslc:modifiedBy': {
                    type: 'object',
                    properties: {
                        '@type': {
                            type: 'string',
                            enum: [
                                '@id',
                            ],
                        },
                    },
                },
                'skos:notation': {
                    type: 'object',
                    properties: {
                        '@type': {
                            type: 'string',
                            enum: [
                                'xsd:string',
                            ],
                        },
                    },
                },
                'Data File Creator': {
                    enum: [
                        'https://schema.metadatacenter.org/properties/1926be54-a337-491a-9613-929176770ad3',
                    ],
                },
                'Data File Version': {
                    enum: [
                        'https://schema.metadatacenter.org/properties/6e0d575a-f73d-4fe8-997d-26c35ac5630b',
                    ],
                },
                'Data File Rights': {
                    enum: [
                        'https://schema.metadatacenter.org/properties/a61a2f7e-b26c-4773-b0fe-4b426e7b1f6e',
                    ],
                },
                pav: {
                    type: 'string',
                    format: 'uri',
                    enum: [
                        'http://purl.org/pav/',
                    ],
                },
                'Data File Parent Study': {
                    enum: [
                        'https://schema.metadatacenter.org/properties/6927832f-a6c4-4ff3-8e36-88d43401ae40',
                    ],
                },
                'Data File Temporal Coverage': {
                    enum: [
                        'https://schema.metadatacenter.org/properties/150a6aa5-9d67-41f6-b02e-212cf2fdbd3d',
                    ],
                },
                Date: {
                    enum: [
                        'https://schema.metadatacenter.org/properties/cf0b53d3-495f-408d-9109-411785903323',
                    ],
                },
                oslc: {
                    type: 'string',
                    format: 'uri',
                    enum: [
                        'http://open-services.net/ns/core#',
                    ],
                },
                'Resource Type': {
                    enum: [
                        'https://schema.metadatacenter.org/properties/f01ed633-83ff-42ff-8449-a85267d46077',
                    ],
                },
                'Data File Spatial Coverage': {
                    enum: [
                        'https://schema.metadatacenter.org/properties/9767716e-1651-4a48-9a45-6d69bab4a39d',
                    ],
                },
                'Data File Identifier': {
                    enum: [
                        'https://schema.metadatacenter.org/properties/d2d5081f-566e-4125-8cd7-b5ce78c7a4a6',
                    ],
                },
                'Data File Distribution': {
                    enum: [
                        'https://schema.metadatacenter.org/properties/1282a865-396b-467a-bc08-7d7942925a91',
                    ],
                },
                'Data Source': {
                    enum: [
                        'https://schema.metadatacenter.org/properties/08608e7f-1d8d-49a7-94ad-33e8e7da45b0',
                    ],
                },
                'schema:isBasedOn': {
                    type: 'object',
                    properties: {
                        '@type': {
                            type: 'string',
                            enum: [
                                '@id',
                            ],
                        },
                    },
                },
                'schema:description': {
                    type: 'object',
                    properties: {
                        '@type': {
                            type: 'string',
                            enum: [
                                'xsd:string',
                            ],
                        },
                    },
                },
                'Data File Title': {
                    enum: [
                        'https://schema.metadatacenter.org/properties/7a9a025e-076c-4ae1-a05a-8729d791b460',
                    ],
                },
                'pav:lastUpdatedOn': {
                    type: 'object',
                    properties: {
                        '@type': {
                            type: 'string',
                            enum: [
                                'xsd:dateTime',
                            ],
                        },
                    },
                },
                'Data File Contributor': {
                    enum: [
                        'https://schema.metadatacenter.org/properties/fa095d1a-9352-4036-a310-e2eec826eeb2',
                    ],
                },
                'schema:name': {
                    type: 'object',
                    properties: {
                        '@type': {
                            type: 'string',
                            enum: [
                                'xsd:string',
                            ],
                        },
                    },
                },
                'pav:derivedFrom': {
                    type: 'object',
                    properties: {
                        '@type': {
                            type: 'string',
                            enum: [
                                '@id',
                            ],
                        },
                    },
                },
                'Data File Subjects and Keywords': {
                    enum: [
                        'https://schema.metadatacenter.org/properties/d5a2dc1d-5403-4bf2-b42d-ae52a09a43c6',
                    ],
                },
            },
            type: 'object',
            required: [
                'Data File Title',
                'Data File Identifier',
                'Resource Type',
                'Data File Version',
                'Data File Language',
                'Data File Subjects and Keywords',
                'Data File Description',
                'Data File Creator',
                'Data File Related Resource',
                'Data File Contributor',
                'Data File Rights',
                'Date',
                'Data File Parent Study',
                'Data File Funding Source',
                'Data File Distribution',
                'Data Characteristics Summary',
                'Data Source',
                'Data Source Stream',
                'Data File Process Version',
                'Data File Temporal Coverage',
                'Data File Spatial Coverage',
                'Data File Vertical Coverage',
                'Auxiliary Metadata',
                'oslc:modifiedBy',
                'pav:createdBy',
                'pav:createdOn',
                'pav:derivedFrom',
                'pav:lastUpdatedOn',
                'schema:description',
                'schema:isBasedOn',
                'schema:name',
            ],
            additionalProperties: false,
        },
        Date: {
            type: 'array',
            minItems: 1,
            items: {
                '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                type: 'object',
                title: 'Element(Date)',
                description: 'Generated by CSV2CEDAR.',
                properties: {
                    'Data File Date Type': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/a7a52fe5-1475-433d-8b11-85c72c8fff55',
                        'schema:identifier': 'data_file_date_type',
                        'schema:name': 'Data File Date Type',
                        'schema:description': 'Type of the date with respect to the data file.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Data File Date Type',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                            classes: [],
                            branches: [
                                {
                                    source: 'https://bioportal.bioontology.org/ontologies/FDC-GDMT',
                                    acronym: 'FDC-GDMT',
                                    name: 'FDC-GDMT',
                                    uri: 'http://vocab.fairdatacollective.org/gdmt/DateType',
                                    maxDepth: 2147483647,
                                },
                            ],
                            ontologies: [],
                            literals: [],
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Data File Date Type)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@id': {
                        type: 'string',
                        format: 'uri',
                    },
                    '@context': {
                        type: 'object',
                        properties: {
                            'Data File Date Type': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasDatasetDateType',
                                ],
                            },
                            'Data File Date': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasDatasetDate',
                                ],
                            },
                        },
                        additionalProperties: false,
                    },
                    '@type': {
                        oneOf: [
                            {
                                type: 'string',
                                format: 'uri',
                            },
                            {
                                type: 'array',
                                minItems: 1,
                                items: {
                                    type: 'string',
                                    format: 'uri',
                                },
                                uniqueItems: true,
                            },
                        ],
                    },
                    'Data File Date': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/1af8bfcb-6fb9-4d98-8ed9-7b872b1a1aa9',
                        'schema:identifier': 'data_file_date',
                        'schema:name': 'Data File Date',
                        'schema:description': 'Date relevant to data file.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Data File Date',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            temporalType: 'xsd:date',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            temporalGranularity: 'day',
                            valueRecommendationEnabled: true,
                            inputType: 'temporal',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Data File Date)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                },
                multiValued: false,
                required: [
                    '@context',
                    '@id',
                    'Data File Date Type',
                    'Data File Date',
                ],
                additionalProperties: false,
                'schema:schemaVersion': '1.6.0',
                '@id': 'https://repo.metadatacenter.org/template-elements/3db0d338-8c0d-42d7-b4fd-376340c8a531',
                _ui: {
                    order: [
                        'Data File Date Type',
                        'Data File Date',
                    ],
                    propertyLabels: {
                        'Data File Date Type': 'Data File Date Type',
                        'Data File Date': 'Data File Date',
                    },
                    propertyDescriptions: {
                        'Data File Date Type': 'Type of the date with respect to the data file.',
                        'Data File Date': 'Date relevant to data file.',
                    },
                },
                '@context': {
                    xsd: 'http://www.w3.org/2001/XMLSchema#',
                    pav: 'http://purl.org/pav/',
                    bibo: 'http://purl.org/ontology/bibo/',
                    oslc: 'http://open-services.net/ns/core#',
                    schema: 'http://schema.org/',
                    'schema:name': {
                        '@type': 'xsd:string',
                    },
                    'schema:description': {
                        '@type': 'xsd:string',
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
                },
                'schema:identifier': 'date',
                'schema:name': 'Date',
                'schema:description': 'Relevant date related to the resource being described.',
                'pav:derivedFrom': '',
                'skos:prefLabel': 'Date',
                'skos:altLabel': [],
                'pav:version': '0.0.1',
                'bibo:status': 'bibo:draft',
                'pav:createdOn': '2022-08-11T21:26:18-07:00',
                'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                'pav:lastUpdatedOn': '2022-08-11T21:26:18-07:00',
                'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                $schema: 'http://json-schema.org/draft-04/schema#',
            },
        },
        'Resource Type': {
            '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
            type: 'object',
            title: 'Element(Resource Type)',
            description: 'Generated by CSV2CEDAR.',
            properties: {
                '@id': {
                    type: 'string',
                    format: 'uri',
                },
                'Resource Type Category': {
                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                    '@id': 'https://repo.metadatacenter.org/template-fields/e7f005a4-98c5-47fd-a654-2b2ed7963eec',
                    'schema:identifier': 'resource_type_category',
                    'schema:name': 'Resource Type Category',
                    'schema:description': "Categorical type of the resource being described. (Corresponds to DataCite's resourceTypeGeneral.)",
                    'pav:derivedFrom': '',
                    'skos:prefLabel': 'Resource Type Category',
                    'skos:altLabel': [],
                    'pav:version': '0.9.0',
                    'bibo:status': 'bibo:draft',
                    _valueConstraints: {
                        requiredValue: false,
                        multipleChoice: false,
                        classes: [],
                        branches: [
                            {
                                source: 'https://bioportal.bioontology.org/ontologies/FDC-GDMT',
                                acronym: 'FDC-GDMT',
                                name: 'FDC-GDMT',
                                uri: 'https://vocab.fairdatacollective.org/gdmt/ResourceTypeCategory',
                                maxDepth: 2147483647,
                            },
                        ],
                        ontologies: [],
                        literals: [],
                    },
                    _ui: {
                        inputType: 'textfield',
                    },
                    'pav:createdOn': null,
                    'pav:createdBy': null,
                    'pav:lastUpdatedOn': null,
                    'oslc:modifiedBy': null,
                    type: 'object',
                    title: 'Field(Resource Type Category)',
                    description: 'Generated by CSV2CEDAR.',
                    properties: {
                        '@type': {
                            oneOf: [
                                {
                                    type: 'string',
                                    format: 'uri',
                                },
                                {
                                    type: 'array',
                                    minItems: 1,
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
                    additionalProperties: false,
                    'schema:schemaVersion': '1.6.0',
                    '@context': {
                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                        pav: 'http://purl.org/pav/',
                        bibo: 'http://purl.org/ontology/bibo/',
                        oslc: 'http://open-services.net/ns/core#',
                        schema: 'http://schema.org/',
                        skos: 'http://www.w3.org/2004/02/skos/core#',
                        'schema:name': {
                            '@type': 'xsd:string',
                        },
                        'schema:description': {
                            '@type': 'xsd:string',
                        },
                        'skos:prefLabel': {
                            '@type': 'xsd:string',
                        },
                        'skos:altLabel': {
                            '@type': 'xsd:string',
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
                    },
                    $schema: 'http://json-schema.org/draft-04/schema#',
                },
                '@context': {
                    type: 'object',
                    properties: {
                        'Resource Type Category': {
                            enum: [
                                'http://purl.org/dc/terms/type',
                            ],
                        },
                        'Resource Type Detail': {
                            enum: [
                                'http://purl.org/dc/elements/1.1/type',
                            ],
                        },
                    },
                    additionalProperties: false,
                },
                'Resource Type Detail': {
                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                    '@id': 'https://repo.metadatacenter.org/template-fields/e7a71d2c-456b-4234-af93-43046d8ded17',
                    'schema:identifier': 'resource_type_detail',
                    'schema:name': 'Resource Type Detail',
                    'schema:description': "Brief free-text characterization of the type details for the resource being described. (Known as 'ResourceType' in  DataCite Scheme: \"Text formats can be free-text OR terms from the CASRAI Publications resource type list.\")",
                    'pav:derivedFrom': '',
                    'skos:prefLabel': 'Resource Type Detail',
                    'skos:altLabel': [],
                    'pav:version': '0.9.0',
                    'bibo:status': 'bibo:draft',
                    _valueConstraints: {
                        defaultValue: '',
                        requiredValue: false,
                        multipleChoice: false,
                    },
                    _ui: {
                        inputType: 'textfield',
                    },
                    'pav:createdOn': null,
                    'pav:createdBy': null,
                    'pav:lastUpdatedOn': null,
                    'oslc:modifiedBy': null,
                    type: 'object',
                    title: 'Field(Resource Type Detail)',
                    description: 'Generated by CSV2CEDAR.',
                    properties: {
                        '@type': {
                            oneOf: [
                                {
                                    type: 'string',
                                    format: 'uri',
                                },
                                {
                                    type: 'array',
                                    minItems: 1,
                                    items: {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    uniqueItems: true,
                                },
                            ],
                        },
                        '@value': {
                            type: [
                                'string',
                                'null',
                            ],
                        },
                        'rdfs:label': {
                            type: [
                                'string',
                                'null',
                            ],
                        },
                    },
                    additionalProperties: false,
                    'schema:schemaVersion': '1.6.0',
                    '@context': {
                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                        pav: 'http://purl.org/pav/',
                        bibo: 'http://purl.org/ontology/bibo/',
                        oslc: 'http://open-services.net/ns/core#',
                        schema: 'http://schema.org/',
                        skos: 'http://www.w3.org/2004/02/skos/core#',
                        'schema:name': {
                            '@type': 'xsd:string',
                        },
                        'schema:description': {
                            '@type': 'xsd:string',
                        },
                        'skos:prefLabel': {
                            '@type': 'xsd:string',
                        },
                        'skos:altLabel': {
                            '@type': 'xsd:string',
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
                    },
                    $schema: 'http://json-schema.org/draft-04/schema#',
                },
                '@type': {
                    oneOf: [
                        {
                            type: 'string',
                            format: 'uri',
                        },
                        {
                            type: 'array',
                            minItems: 1,
                            items: {
                                type: 'string',
                                format: 'uri',
                            },
                            uniqueItems: true,
                        },
                    ],
                },
            },
            multiValued: false,
            required: [
                '@context',
                '@id',
                'Resource Type Category',
                'Resource Type Detail',
            ],
            additionalProperties: false,
            'schema:schemaVersion': '1.6.0',
            '@id': 'https://repo.metadatacenter.org/template-elements/654bf0af-9a64-4802-a084-82bc6a4fb7b5',
            _ui: {
                order: [
                    'Resource Type Category',
                    'Resource Type Detail',
                ],
                propertyLabels: {
                    'Resource Type Category': 'Resource Type Category',
                    'Resource Type Detail': 'Resource Type Detail',
                },
                propertyDescriptions: {
                    'Resource Type Category': "Categorical type of the resource being described. (Corresponds to DataCite's resourceTypeGeneral.)",
                    'Resource Type Detail': "Brief free-text characterization of the type details for the resource being described. (Known as 'ResourceType' in  DataCite Scheme: \"Text formats can be free-text OR terms from the CASRAI Publications resource type list.\")",
                },
            },
            '@context': {
                xsd: 'http://www.w3.org/2001/XMLSchema#',
                pav: 'http://purl.org/pav/',
                bibo: 'http://purl.org/ontology/bibo/',
                oslc: 'http://open-services.net/ns/core#',
                schema: 'http://schema.org/',
                'schema:name': {
                    '@type': 'xsd:string',
                },
                'schema:description': {
                    '@type': 'xsd:string',
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
            },
            'schema:identifier': 'resource_type',
            'schema:name': 'Resource Type',
            'schema:description': 'Information about the type of the resource being described with metadata.',
            'pav:derivedFrom': '',
            'skos:prefLabel': 'Resource Type',
            'skos:altLabel': [],
            'pav:version': '0.0.1',
            'bibo:status': 'bibo:draft',
            'pav:createdOn': '2022-08-11T21:26:18-07:00',
            'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
            'pav:lastUpdatedOn': '2022-08-11T21:26:18-07:00',
            'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
            $schema: 'http://json-schema.org/draft-04/schema#',
        },
        'Data File Spatial Coverage': {
            type: 'array',
            minItems: 1,
            items: {
                '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                type: 'object',
                title: 'Element(Data File Spatial Coverage)',
                description: 'Generated by CSV2CEDAR.',
                properties: {
                    'Southernmost Latitude': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/71f3147b-f7a5-4048-bedf-168329c718af',
                        'schema:identifier': 'southernmost_latitude',
                        'schema:name': 'Southernmost Latitude',
                        'schema:description': 'Location of the southernmost data point in this data file, expressed in north latitude decimal degrees (southern latitudes are negative)',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Southernmost Latitude',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Southernmost Latitude)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Westernmost Longitude': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/8b37b831-9d05-418d-a161-2c19ab41340c',
                        'schema:identifier': 'westernmost_longitude',
                        'schema:name': 'Westernmost Longitude',
                        'schema:description': 'Location of the westernmost data point in this data file, expressed in east longitude decimal degrees (western longitudes are negative)',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Westernmost Longitude',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Westernmost Longitude)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Northernmost Latitude': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/c6fe1d38-42c0-445c-9dc6-ba7156090ee6',
                        'schema:identifier': 'northernmost_latitude',
                        'schema:name': 'Northernmost Latitude',
                        'schema:description': 'Location of the northernmost data point in this data file, expressed in north latitude decimal degrees (southern latitudes are negative)',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Northernmost Latitude',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Northernmost Latitude)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@type': {
                        oneOf: [
                            {
                                type: 'string',
                                format: 'uri',
                            },
                            {
                                type: 'array',
                                minItems: 1,
                                items: {
                                    type: 'string',
                                    format: 'uri',
                                },
                                uniqueItems: true,
                            },
                        ],
                    },
                    'Easternmost Longitude': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/2d91ce3e-c323-4455-9aef-627476ac0635',
                        'schema:identifier': 'easternmost_longitude',
                        'schema:name': 'Easternmost Longitude',
                        'schema:description': 'Location of the easternmost data point in this data file, expressed in east longitude decimal degrees (western longitudes are negative)',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Easternmost Longitude',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Easternmost Longitude)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@id': {
                        type: 'string',
                        format: 'uri',
                    },
                    '@context': {
                        type: 'object',
                        properties: {
                            'Northernmost Latitude': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasNorthBoundLatitude',
                                ],
                            },
                            'Southernmost Latitude': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasSouthBoundLatitude',
                                ],
                            },
                            'Westernmost Longitude': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasWestBoundLongitude',
                                ],
                            },
                            'Easternmost Longitude': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasEastBoundLongitude',
                                ],
                            },
                            'Data File Shape Coverage': {
                                enum: [
                                    'https://schema.metadatacenter.org/properties/5f364583-bd6b-4c71-bcc2-8ec297117bb5',
                                ],
                            },
                        },
                        additionalProperties: false,
                    },
                    'Data File Shape Coverage': {
                        type: 'array',
                        minItems: 1,
                        items: {
                            '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                            type: 'object',
                            title: 'Element(Data File Shape Coverage)',
                            description: 'Generated by CSV2CEDAR.',
                            properties: {
                                'Point Number': {
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                    '@id': 'https://repo.metadatacenter.org/template-fields/d054672a-99d8-4deb-98b8-5ec2b282f876',
                                    'schema:identifier': 'point_number',
                                    'schema:name': 'Point Number',
                                    'schema:description': 'Monotonically increasing identifier of the point in the shape being defined (defined in clockwise order and containing the right side of the closed shape).',
                                    'pav:derivedFrom': '',
                                    'skos:prefLabel': 'Point Number',
                                    'skos:altLabel': [],
                                    'pav:version': '0.9.0',
                                    'bibo:status': 'bibo:draft',
                                    _valueConstraints: {
                                        numberType: 'xsd:int',
                                        unitOfMeasure: '',
                                        requiredValue: false,
                                        multipleChoice: false,
                                    },
                                    _ui: {
                                        inputType: 'numeric',
                                    },
                                    'pav:createdOn': null,
                                    'pav:createdBy': null,
                                    'pav:lastUpdatedOn': null,
                                    'oslc:modifiedBy': null,
                                    type: 'object',
                                    title: 'Field(Point Number)',
                                    description: 'Generated by CSV2CEDAR.',
                                    properties: {
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    type: 'array',
                                                    minItems: 1,
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        '@value': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                        'rdfs:label': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                    },
                                    additionalProperties: false,
                                    'schema:schemaVersion': '1.6.0',
                                    '@context': {
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        pav: 'http://purl.org/pav/',
                                        bibo: 'http://purl.org/ontology/bibo/',
                                        oslc: 'http://open-services.net/ns/core#',
                                        schema: 'http://schema.org/',
                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'skos:prefLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        'skos:altLabel': {
                                            '@type': 'xsd:string',
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
                                    },
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                                Latitude: {
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                    '@id': 'https://repo.metadatacenter.org/template-fields/690adcb1-8770-4c71-9463-20da78d8f940',
                                    'schema:identifier': 'latitude',
                                    'schema:name': 'Latitude',
                                    'schema:description': 'Location of this point in north latitude decimal degrees (southern latitudes are negative)',
                                    'pav:derivedFrom': '',
                                    'skos:prefLabel': 'Latitude',
                                    'skos:altLabel': [],
                                    'pav:version': '0.9.0',
                                    'bibo:status': 'bibo:draft',
                                    _valueConstraints: {
                                        defaultValue: '',
                                        requiredValue: false,
                                        multipleChoice: false,
                                    },
                                    _ui: {
                                        inputType: 'textfield',
                                    },
                                    'pav:createdOn': null,
                                    'pav:createdBy': null,
                                    'pav:lastUpdatedOn': null,
                                    'oslc:modifiedBy': null,
                                    type: 'object',
                                    title: 'Field(Latitude)',
                                    description: 'Generated by CSV2CEDAR.',
                                    properties: {
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    type: 'array',
                                                    minItems: 1,
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        '@value': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                        'rdfs:label': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                    },
                                    additionalProperties: false,
                                    'schema:schemaVersion': '1.6.0',
                                    '@context': {
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        pav: 'http://purl.org/pav/',
                                        bibo: 'http://purl.org/ontology/bibo/',
                                        oslc: 'http://open-services.net/ns/core#',
                                        schema: 'http://schema.org/',
                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'skos:prefLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        'skos:altLabel': {
                                            '@type': 'xsd:string',
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
                                    },
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                                '@id': {
                                    type: 'string',
                                    format: 'uri',
                                },
                                '@context': {
                                    type: 'object',
                                    properties: {
                                        'Point Number': {
                                            enum: [
                                                'https://schema.metadatacenter.org/properties/b4b39b09-26e6-4c2a-b3cb-17c37169ae77',
                                            ],
                                        },
                                        Latitude: {
                                            enum: [
                                                'https://schema.metadatacenter.org/properties/f088e6f4-4d3b-48c8-9a9a-449c5c9c88d5',
                                            ],
                                        },
                                        Longitude: {
                                            enum: [
                                                'https://schema.metadatacenter.org/properties/6f0931c5-3fdd-4a93-9e88-e5fbd76ed071',
                                            ],
                                        },
                                    },
                                    additionalProperties: false,
                                },
                                Longitude: {
                                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                    '@id': 'https://repo.metadatacenter.org/template-fields/07425f05-25cd-428a-8218-15b4b888115e',
                                    'schema:identifier': 'longitude',
                                    'schema:name': 'Longitude',
                                    'schema:description': 'Location of this point in east longitude decimal degrees (western longitudes are negative)',
                                    'pav:derivedFrom': '',
                                    'skos:prefLabel': 'Longitude',
                                    'skos:altLabel': [],
                                    'pav:version': '0.9.0',
                                    'bibo:status': 'bibo:draft',
                                    _valueConstraints: {
                                        defaultValue: '',
                                        requiredValue: false,
                                        multipleChoice: false,
                                    },
                                    _ui: {
                                        inputType: 'textfield',
                                    },
                                    'pav:createdOn': null,
                                    'pav:createdBy': null,
                                    'pav:lastUpdatedOn': null,
                                    'oslc:modifiedBy': null,
                                    type: 'object',
                                    title: 'Field(Longitude)',
                                    description: 'Generated by CSV2CEDAR.',
                                    properties: {
                                        '@type': {
                                            oneOf: [
                                                {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                {
                                                    type: 'array',
                                                    minItems: 1,
                                                    items: {
                                                        type: 'string',
                                                        format: 'uri',
                                                    },
                                                    uniqueItems: true,
                                                },
                                            ],
                                        },
                                        '@value': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                        'rdfs:label': {
                                            type: [
                                                'string',
                                                'null',
                                            ],
                                        },
                                    },
                                    additionalProperties: false,
                                    'schema:schemaVersion': '1.6.0',
                                    '@context': {
                                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                                        pav: 'http://purl.org/pav/',
                                        bibo: 'http://purl.org/ontology/bibo/',
                                        oslc: 'http://open-services.net/ns/core#',
                                        schema: 'http://schema.org/',
                                        skos: 'http://www.w3.org/2004/02/skos/core#',
                                        'schema:name': {
                                            '@type': 'xsd:string',
                                        },
                                        'schema:description': {
                                            '@type': 'xsd:string',
                                        },
                                        'skos:prefLabel': {
                                            '@type': 'xsd:string',
                                        },
                                        'skos:altLabel': {
                                            '@type': 'xsd:string',
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
                                    },
                                    $schema: 'http://json-schema.org/draft-04/schema#',
                                },
                                '@type': {
                                    oneOf: [
                                        {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        {
                                            type: 'array',
                                            minItems: 1,
                                            items: {
                                                type: 'string',
                                                format: 'uri',
                                            },
                                            uniqueItems: true,
                                        },
                                    ],
                                },
                            },
                            multiValued: false,
                            required: [
                                '@context',
                                '@id',
                                'Point Number',
                                'Latitude',
                                'Longitude',
                            ],
                            additionalProperties: false,
                            'schema:schemaVersion': '1.6.0',
                            '@id': 'https://repo.metadatacenter.org/template-elements/7ad99be2-8a5c-4205-bccf-60aa2d3b8e8b',
                            _ui: {
                                order: [
                                    'Point Number',
                                    'Latitude',
                                    'Longitude',
                                ],
                                propertyLabels: {
                                    'Point Number': 'Point Number',
                                    Latitude: 'Latitude',
                                    Longitude: 'Longitude',
                                },
                                propertyDescriptions: {
                                    'Point Number': 'Monotonically increasing identifier of the point in the shape being defined (defined in clockwise order and containing the right side of the closed shape).',
                                    Latitude: 'Location of this point in north latitude decimal degrees (southern latitudes are negative)',
                                    Longitude: 'Location of this point in east longitude decimal degrees (western longitudes are negative)',
                                },
                            },
                            '@context': {
                                xsd: 'http://www.w3.org/2001/XMLSchema#',
                                pav: 'http://purl.org/pav/',
                                bibo: 'http://purl.org/ontology/bibo/',
                                oslc: 'http://open-services.net/ns/core#',
                                schema: 'http://schema.org/',
                                'schema:name': {
                                    '@type': 'xsd:string',
                                },
                                'schema:description': {
                                    '@type': 'xsd:string',
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
                            },
                            'schema:identifier': 'data_file_shape_coverage',
                            'schema:name': 'Data File Shape Coverage',
                            'schema:description': 'A complex geospatial area (region on Earth) covered by the data file being described',
                            'pav:derivedFrom': '',
                            'skos:prefLabel': 'Data File Shape Coverage',
                            'skos:altLabel': [],
                            'pav:version': '0.0.1',
                            'bibo:status': 'bibo:draft',
                            'pav:createdOn': null,
                            'pav:createdBy': null,
                            'pav:lastUpdatedOn': null,
                            'oslc:modifiedBy': null,
                            $schema: 'http://json-schema.org/draft-04/schema#',
                        },
                    },
                },
                multiValued: false,
                required: [
                    '@context',
                    '@id',
                    'Northernmost Latitude',
                    'Southernmost Latitude',
                    'Westernmost Longitude',
                    'Easternmost Longitude',
                    'Data File Shape Coverage',
                ],
                additionalProperties: false,
                'schema:schemaVersion': '1.6.0',
                '@id': 'https://repo.metadatacenter.org/template-elements/35be733e-67d7-4bf6-9ffc-0162dfef3a1a',
                _ui: {
                    order: [
                        'Northernmost Latitude',
                        'Southernmost Latitude',
                        'Westernmost Longitude',
                        'Easternmost Longitude',
                        'Data File Shape Coverage',
                    ],
                    propertyLabels: {
                        'Northernmost Latitude': 'Northernmost Latitude',
                        'Southernmost Latitude': 'Southernmost Latitude',
                        'Westernmost Longitude': 'Westernmost Longitude',
                        'Easternmost Longitude': 'Easternmost Longitude',
                        'Data File Shape Coverage': 'Data File Shape Coverage',
                    },
                    propertyDescriptions: {
                        'Northernmost Latitude': 'Location of the northernmost data point in this data file, expressed in north latitude decimal degrees (southern latitudes are negative)',
                        'Southernmost Latitude': 'Location of the southernmost data point in this data file, expressed in north latitude decimal degrees (southern latitudes are negative)',
                        'Westernmost Longitude': 'Location of the westernmost data point in this data file, expressed in east longitude decimal degrees (western longitudes are negative)',
                        'Easternmost Longitude': 'Location of the easternmost data point in this data file, expressed in east longitude decimal degrees (western longitudes are negative)',
                        'Data File Shape Coverage': 'A complex geospatial area (region on Earth) covered by the data file being described',
                    },
                },
                '@context': {
                    xsd: 'http://www.w3.org/2001/XMLSchema#',
                    pav: 'http://purl.org/pav/',
                    bibo: 'http://purl.org/ontology/bibo/',
                    oslc: 'http://open-services.net/ns/core#',
                    schema: 'http://schema.org/',
                    'schema:name': {
                        '@type': 'xsd:string',
                    },
                    'schema:description': {
                        '@type': 'xsd:string',
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
                },
                'schema:identifier': 'data_file_spatial_coverage',
                'schema:name': 'Data File Spatial Coverage',
                'schema:description': 'The maximum geospatial positions (locations on Earth) covered by the data file being described.',
                'pav:derivedFrom': '',
                'skos:prefLabel': 'Data File Spatial Coverage',
                'skos:altLabel': [],
                'pav:version': '0.0.1',
                'bibo:status': 'bibo:draft',
                'pav:createdOn': '2022-08-11T21:26:18-07:00',
                'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                'pav:lastUpdatedOn': '2022-08-11T21:26:18-07:00',
                'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                $schema: 'http://json-schema.org/draft-04/schema#',
            },
        },
        'Data File Identifier': {
            '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
            type: 'object',
            title: 'Element(Data File Identifier)',
            description: 'Generated by CSV2CEDAR.',
            properties: {
                'Data File Identifier Type': {
                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                    '@id': 'https://repo.metadatacenter.org/template-fields/0af3bcea-ae63-4c20-b550-4e8bbe5acc4d',
                    'schema:identifier': 'data_file_identifier_type',
                    'schema:name': 'Data File Identifier Type',
                    'schema:description': 'The identifier type used to identify the resource being described.',
                    'pav:derivedFrom': '',
                    'skos:prefLabel': 'Data File Identifier Type',
                    'skos:altLabel': [],
                    'pav:version': '0.9.0',
                    'bibo:status': 'bibo:draft',
                    _valueConstraints: {
                        defaultValue: '',
                        requiredValue: false,
                        multipleChoice: false,
                    },
                    _ui: {
                        inputType: 'textfield',
                    },
                    'pav:createdOn': null,
                    'pav:createdBy': null,
                    'pav:lastUpdatedOn': null,
                    'oslc:modifiedBy': null,
                    type: 'object',
                    title: 'Field(Data File Identifier Type)',
                    description: 'Generated by CSV2CEDAR.',
                    properties: {
                        '@type': {
                            oneOf: [
                                {
                                    type: 'string',
                                    format: 'uri',
                                },
                                {
                                    type: 'array',
                                    minItems: 1,
                                    items: {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    uniqueItems: true,
                                },
                            ],
                        },
                        '@value': {
                            type: [
                                'string',
                                'null',
                            ],
                        },
                        'rdfs:label': {
                            type: [
                                'string',
                                'null',
                            ],
                        },
                    },
                    additionalProperties: false,
                    'schema:schemaVersion': '1.6.0',
                    '@context': {
                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                        pav: 'http://purl.org/pav/',
                        bibo: 'http://purl.org/ontology/bibo/',
                        oslc: 'http://open-services.net/ns/core#',
                        schema: 'http://schema.org/',
                        skos: 'http://www.w3.org/2004/02/skos/core#',
                        'schema:name': {
                            '@type': 'xsd:string',
                        },
                        'schema:description': {
                            '@type': 'xsd:string',
                        },
                        'skos:prefLabel': {
                            '@type': 'xsd:string',
                        },
                        'skos:altLabel': {
                            '@type': 'xsd:string',
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
                    },
                    $schema: 'http://json-schema.org/draft-04/schema#',
                },
                'Data File Name ': {
                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                    '@id': 'https://repo.metadatacenter.org/template-fields/f293b347-8727-4959-a051-c9c1cd9bedf3',
                    'schema:identifier': 'data_file_name_',
                    'schema:name': 'Data File Name ',
                    'schema:description': 'The local name of the resource (e.g., in a file-based operating system or web service)',
                    'pav:derivedFrom': '',
                    'skos:prefLabel': 'Data File Name ',
                    'skos:altLabel': [],
                    'pav:version': '0.9.0',
                    'bibo:status': 'bibo:draft',
                    _valueConstraints: {
                        defaultValue: '',
                        requiredValue: false,
                        multipleChoice: false,
                    },
                    _ui: {
                        inputType: 'textfield',
                    },
                    'pav:createdOn': null,
                    'pav:createdBy': null,
                    'pav:lastUpdatedOn': null,
                    'oslc:modifiedBy': null,
                    type: 'object',
                    title: 'Field(Data File Name )',
                    description: 'Generated by CSV2CEDAR.',
                    properties: {
                        '@type': {
                            oneOf: [
                                {
                                    type: 'string',
                                    format: 'uri',
                                },
                                {
                                    type: 'array',
                                    minItems: 1,
                                    items: {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    uniqueItems: true,
                                },
                            ],
                        },
                        '@value': {
                            type: [
                                'string',
                                'null',
                            ],
                        },
                        'rdfs:label': {
                            type: [
                                'string',
                                'null',
                            ],
                        },
                    },
                    additionalProperties: false,
                    'schema:schemaVersion': '1.6.0',
                    '@context': {
                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                        pav: 'http://purl.org/pav/',
                        bibo: 'http://purl.org/ontology/bibo/',
                        oslc: 'http://open-services.net/ns/core#',
                        schema: 'http://schema.org/',
                        skos: 'http://www.w3.org/2004/02/skos/core#',
                        'schema:name': {
                            '@type': 'xsd:string',
                        },
                        'schema:description': {
                            '@type': 'xsd:string',
                        },
                        'skos:prefLabel': {
                            '@type': 'xsd:string',
                        },
                        'skos:altLabel': {
                            '@type': 'xsd:string',
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
                    },
                    $schema: 'http://json-schema.org/draft-04/schema#',
                },
                '@id': {
                    type: 'string',
                    format: 'uri',
                },
                'Data File Identifier': {
                    '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                    '@id': 'https://repo.metadatacenter.org/template-fields/2cecd62b-b0e1-48cc-83a2-4632091807d0',
                    'schema:identifier': 'data_file_identifier',
                    'schema:name': 'Data File Identifier',
                    'schema:description': 'A globally unique string that identifies the resource being described.',
                    'pav:derivedFrom': '',
                    'skos:prefLabel': 'Data File Identifier',
                    'skos:altLabel': [],
                    'pav:version': '0.9.0',
                    'bibo:status': 'bibo:draft',
                    _valueConstraints: {
                        defaultValue: '',
                        requiredValue: false,
                        multipleChoice: false,
                    },
                    _ui: {
                        inputType: 'textfield',
                    },
                    'pav:createdOn': null,
                    'pav:createdBy': null,
                    'pav:lastUpdatedOn': null,
                    'oslc:modifiedBy': null,
                    type: 'object',
                    title: 'Field(Data File Identifier)',
                    description: 'Generated by CSV2CEDAR.',
                    properties: {
                        '@type': {
                            oneOf: [
                                {
                                    type: 'string',
                                    format: 'uri',
                                },
                                {
                                    type: 'array',
                                    minItems: 1,
                                    items: {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    uniqueItems: true,
                                },
                            ],
                        },
                        '@value': {
                            type: [
                                'string',
                                'null',
                            ],
                        },
                        'rdfs:label': {
                            type: [
                                'string',
                                'null',
                            ],
                        },
                    },
                    additionalProperties: false,
                    'schema:schemaVersion': '1.6.0',
                    '@context': {
                        xsd: 'http://www.w3.org/2001/XMLSchema#',
                        pav: 'http://purl.org/pav/',
                        bibo: 'http://purl.org/ontology/bibo/',
                        oslc: 'http://open-services.net/ns/core#',
                        schema: 'http://schema.org/',
                        skos: 'http://www.w3.org/2004/02/skos/core#',
                        'schema:name': {
                            '@type': 'xsd:string',
                        },
                        'schema:description': {
                            '@type': 'xsd:string',
                        },
                        'skos:prefLabel': {
                            '@type': 'xsd:string',
                        },
                        'skos:altLabel': {
                            '@type': 'xsd:string',
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
                    },
                    $schema: 'http://json-schema.org/draft-04/schema#',
                },
                '@context': {
                    type: 'object',
                    properties: {
                        'Data File Identifier': {
                            enum: [
                                'http://purl.org/dc/terms/identifier',
                            ],
                        },
                        'Data File Identifier Type': {
                            enum: [
                                'http://schema.org/propertyID',
                            ],
                        },
                        'Data File Name ': {
                            enum: [
                                'https://schema.metadatacenter.org/properties/f0a901ca-59ca-4104-815f-923eaee313d9',
                            ],
                        },
                    },
                    additionalProperties: false,
                },
                '@type': {
                    oneOf: [
                        {
                            type: 'string',
                            format: 'uri',
                        },
                        {
                            type: 'array',
                            minItems: 1,
                            items: {
                                type: 'string',
                                format: 'uri',
                            },
                            uniqueItems: true,
                        },
                    ],
                },
            },
            multiValued: false,
            required: [
                '@context',
                '@id',
                'Data File Identifier',
                'Data File Identifier Type',
                'Data File Name ',
            ],
            additionalProperties: false,
            'schema:schemaVersion': '1.6.0',
            '@id': 'https://repo.metadatacenter.org/template-elements/91d3b374-2d76-4f2d-bff1-5d346e5f0a40',
            _ui: {
                order: [
                    'Data File Identifier',
                    'Data File Identifier Type',
                    'Data File Name ',
                ],
                propertyLabels: {
                    'Data File Identifier': 'Data File Identifier',
                    'Data File Identifier Type': 'Data File Identifier Type',
                    'Data File Name ': 'Data File Name ',
                },
                propertyDescriptions: {
                    'Data File Identifier': 'A globally unique string that identifies the resource being described.',
                    'Data File Identifier Type': 'The identifier type used to identify the resource being described.',
                    'Data File Name ': 'The local name of the resource (e.g., in a file-based operating system or web service)',
                },
            },
            '@context': {
                xsd: 'http://www.w3.org/2001/XMLSchema#',
                pav: 'http://purl.org/pav/',
                bibo: 'http://purl.org/ontology/bibo/',
                oslc: 'http://open-services.net/ns/core#',
                schema: 'http://schema.org/',
                'schema:name': {
                    '@type': 'xsd:string',
                },
                'schema:description': {
                    '@type': 'xsd:string',
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
            },
            'schema:identifier': 'data_file_identifier',
            'schema:name': 'Data File Identifier',
            'schema:description': 'Information about the globally unique and persistent identifier used to identify and optionally access (meta)data of the data file being described.',
            'pav:derivedFrom': '',
            'skos:prefLabel': 'Data File Identifier',
            'skos:altLabel': [],
            'pav:version': '0.0.1',
            'bibo:status': 'bibo:draft',
            'pav:createdOn': '2022-08-11T21:26:18-07:00',
            'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
            'pav:lastUpdatedOn': '2022-08-11T21:26:18-07:00',
            'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
            $schema: 'http://json-schema.org/draft-04/schema#',
        },
        'Data File Distribution': {
            type: 'array',
            minItems: 1,
            items: {
                '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                type: 'object',
                title: 'Element(Data File Distribution)',
                description: 'Generated by CSV2CEDAR.',
                properties: {
                    'Distribution Publisher Identifier Scheme Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/825d1b95-2a81-46dd-a4b8-013d4a459205',
                        'schema:identifier': 'distribution_publisher_identifier_scheme_identifier',
                        'schema:name': 'Distribution Publisher Identifier Scheme Identifier',
                        'schema:description': 'The unique identifier (IRI) of the scheme or authority used for the Distribution Publisher Identifier.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Distribution Publisher Identifier Scheme Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'link',
                            hidden: true,
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Distribution Publisher Identifier Scheme Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Data File Publication Date': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                        type: 'object',
                        title: 'Element(Data File Publication Date)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@id': {
                                type: 'string',
                                format: 'uri',
                            },
                            'Data File Publication Date': {
                                '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                '@id': 'https://repo.metadatacenter.org/template-fields/44e52e07-f52a-4a4d-8cb1-4888fbedf553',
                                'schema:identifier': 'data_file_publication_date',
                                'schema:name': 'Data File Publication Date',
                                'schema:description': 'Date on which this distribution of the data file was published',
                                'pav:derivedFrom': '',
                                'skos:prefLabel': 'Data File Publication Date',
                                'skos:altLabel': [],
                                'pav:version': '0.9.0',
                                'bibo:status': 'bibo:draft',
                                _valueConstraints: {
                                    temporalType: 'xsd:date',
                                    requiredValue: false,
                                    multipleChoice: false,
                                },
                                _ui: {
                                    temporalGranularity: 'day',
                                    valueRecommendationEnabled: true,
                                    inputType: 'temporal',
                                },
                                'pav:createdOn': null,
                                'pav:createdBy': null,
                                'pav:lastUpdatedOn': null,
                                'oslc:modifiedBy': null,
                                type: 'object',
                                title: 'Field(Data File Publication Date)',
                                description: 'Generated by CSV2CEDAR.',
                                properties: {
                                    '@type': {
                                        oneOf: [
                                            {
                                                type: 'string',
                                                format: 'uri',
                                            },
                                            {
                                                type: 'array',
                                                minItems: 1,
                                                items: {
                                                    type: 'string',
                                                    format: 'uri',
                                                },
                                                uniqueItems: true,
                                            },
                                        ],
                                    },
                                    '@value': {
                                        type: [
                                            'string',
                                            'null',
                                        ],
                                    },
                                    'rdfs:label': {
                                        type: [
                                            'string',
                                            'null',
                                        ],
                                    },
                                },
                                additionalProperties: false,
                                'schema:schemaVersion': '1.6.0',
                                '@context': {
                                    xsd: 'http://www.w3.org/2001/XMLSchema#',
                                    pav: 'http://purl.org/pav/',
                                    bibo: 'http://purl.org/ontology/bibo/',
                                    oslc: 'http://open-services.net/ns/core#',
                                    schema: 'http://schema.org/',
                                    skos: 'http://www.w3.org/2004/02/skos/core#',
                                    'schema:name': {
                                        '@type': 'xsd:string',
                                    },
                                    'schema:description': {
                                        '@type': 'xsd:string',
                                    },
                                    'skos:prefLabel': {
                                        '@type': 'xsd:string',
                                    },
                                    'skos:altLabel': {
                                        '@type': 'xsd:string',
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
                                },
                                $schema: 'http://json-schema.org/draft-04/schema#',
                            },
                            '@context': {
                                type: 'object',
                                properties: {
                                    'Data File Publication Date': {
                                        enum: [
                                            'https://schema.metadatacenter.org/properties/93f8d4b7-08b0-4cad-bbf2-081ff71e9ebd',
                                        ],
                                    },
                                    'Publication Date Type': {
                                        enum: [
                                            'https://schema.metadatacenter.org/properties/d267c041-a23d-48b2-aeac-2ad909086940',
                                        ],
                                    },
                                },
                                additionalProperties: false,
                            },
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            'Publication Date Type': {
                                '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                                '@id': 'https://repo.metadatacenter.org/template-fields/5f03ff30-0d97-47d4-a8c7-7502e5e9f7ac',
                                'schema:identifier': 'publication_date_type',
                                'schema:name': 'Publication Date Type',
                                'schema:description': "Type of the date ('Published') with respect to the data file.",
                                'pav:derivedFrom': '',
                                'skos:prefLabel': 'Publication Date Type',
                                'skos:altLabel': [],
                                'pav:version': '0.9.0',
                                'bibo:status': 'bibo:draft',
                                _valueConstraints: {
                                    requiredValue: false,
                                    multipleChoice: false,
                                    classes: [],
                                    branches: [
                                        {
                                            source: 'https://bioportal.bioontology.org/ontologies/FDC-GDMT',
                                            acronym: 'FDC-GDMT',
                                            name: 'FDC-GDMT',
                                            uri: 'http://vocab.fairdatacollective.org/gdmt/DataType',
                                            maxDepth: 2147483647,
                                        },
                                    ],
                                    ontologies: [],
                                    literals: [],
                                    defaultValue: {
                                        termUri: 'https://bioportal.bioontology.org/ontologies/FDC-GDMT/?p=classes&conceptid=http://vocab.fairdatacollective.org/gdmt/Published',
                                        'rdfs:label': '[Published]',
                                    },
                                },
                                _ui: {
                                    inputType: 'textfield',
                                    hidden: true,
                                },
                                'pav:createdOn': null,
                                'pav:createdBy': null,
                                'pav:lastUpdatedOn': null,
                                'oslc:modifiedBy': null,
                                type: 'object',
                                title: 'Field(Publication Date Type)',
                                description: 'Generated by CSV2CEDAR.',
                                properties: {
                                    '@type': {
                                        oneOf: [
                                            {
                                                type: 'string',
                                                format: 'uri',
                                            },
                                            {
                                                type: 'array',
                                                minItems: 1,
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
                                additionalProperties: false,
                                'schema:schemaVersion': '1.6.0',
                                '@context': {
                                    xsd: 'http://www.w3.org/2001/XMLSchema#',
                                    pav: 'http://purl.org/pav/',
                                    bibo: 'http://purl.org/ontology/bibo/',
                                    oslc: 'http://open-services.net/ns/core#',
                                    schema: 'http://schema.org/',
                                    skos: 'http://www.w3.org/2004/02/skos/core#',
                                    'schema:name': {
                                        '@type': 'xsd:string',
                                    },
                                    'schema:description': {
                                        '@type': 'xsd:string',
                                    },
                                    'skos:prefLabel': {
                                        '@type': 'xsd:string',
                                    },
                                    'skos:altLabel': {
                                        '@type': 'xsd:string',
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
                                },
                                $schema: 'http://json-schema.org/draft-04/schema#',
                            },
                        },
                        multiValued: false,
                        required: [
                            '@context',
                            '@id',
                            'Data File Publication Date',
                            'Publication Date Type',
                        ],
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@id': 'https://repo.metadatacenter.org/template-elements/db5b8ece-3f0d-4d05-84b2-a783c9f6120c',
                        _ui: {
                            order: [
                                'Data File Publication Date',
                                'Publication Date Type',
                            ],
                            propertyLabels: {
                                'Data File Publication Date': 'Data File Publication Date',
                                'Publication Date Type': 'Publication Date Type',
                            },
                            propertyDescriptions: {
                                'Data File Publication Date': 'Date on which this distribution of the data file was published',
                                'Publication Date Type': "Type of the date ('Published') with respect to the data file.",
                            },
                        },
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
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
                        },
                        'schema:identifier': 'data_file_publication_date',
                        'schema:name': 'Data File Publication Date',
                        'schema:description': 'Publication date of this distribution the data file.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Data File Publication Date',
                        'skos:altLabel': [],
                        'pav:version': '0.0.1',
                        'bibo:status': 'bibo:draft',
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@type': {
                        oneOf: [
                            {
                                type: 'string',
                                format: 'uri',
                            },
                            {
                                type: 'array',
                                minItems: 1,
                                items: {
                                    type: 'string',
                                    format: 'uri',
                                },
                                uniqueItems: true,
                            },
                        ],
                    },
                    'Distribution Publisher Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/9a32ab0a-a331-4239-822f-0219a3fc61f5',
                        'schema:identifier': 'distribution_publisher_identifier',
                        'schema:name': 'Distribution Publisher Identifier',
                        'schema:description': 'Globally unique string that identifies the Distribution Publisher.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Distribution Publisher Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Distribution Publisher Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Distribution Access Configuration': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/e54ac95d-a099-47e4-b716-0ad2f6877f6e',
                        'schema:identifier': 'distribution_access_configuration',
                        'schema:name': 'Distribution Access Configuration',
                        'schema:description': 'The access protocol configuration for querying the data file distribution.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Distribution Access Configuration',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Distribution Access Configuration)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Distribution Format': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/a0d90d27-c99b-4370-8acc-a02816f13fb5',
                        'schema:identifier': 'distribution_format',
                        'schema:name': 'Distribution Format',
                        'schema:description': 'An established standard to which the data file distribution conforms.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Distribution Format',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Distribution Format)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@context': {
                        type: 'object',
                        properties: {
                            'Data File Publication Date': {
                                enum: [
                                    'https://schema.metadatacenter.org/properties/93f8d4b7-08b0-4cad-bbf2-081ff71e9ebd',
                                ],
                            },
                            'Publication Date Type': {
                                enum: [
                                    'https://schema.metadatacenter.org/properties/d267c041-a23d-48b2-aeac-2ad909086940',
                                ],
                            },
                        },
                        additionalProperties: false,
                    },
                    'Distribution Media Type': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/a9272afe-cd07-4cc9-a106-cd27e6a75600',
                        'schema:identifier': 'distribution_media_type',
                        'schema:name': 'Distribution Media Type',
                        'schema:description': 'A media type, formerly known as a MIME type, of data file distribution.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Distribution Media Type',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                            classes: [],
                            branches: [
                                {
                                    source: 'https://bioportal.bioontology.org/ontologies/FDC-GDMT',
                                    acronym: 'FDC-GDMT',
                                    name: 'FDC-GDMT',
                                    uri: 'http://vocab.fairdatacollective.org/gdmt/MIMEType',
                                    maxDepth: 2147483647,
                                },
                            ],
                            ontologies: [],
                            literals: [],
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Distribution Media Type)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Distribution Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/c379cd66-4739-40b6-a81f-db5c61555088',
                        'schema:identifier': 'distribution_identifier',
                        'schema:name': 'Distribution Identifier',
                        'schema:description': 'A globally unique string that identifies the data file distribution.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Distribution Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Distribution Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Distribution Identifier Type': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/5aebe008-8b02-43ad-ab89-145567337818',
                        'schema:identifier': 'distribution_identifier_type',
                        'schema:name': 'Distribution Identifier Type',
                        'schema:description': 'The identifier type used to identify the data file distribution.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Distribution Identifier Type',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                            classes: [],
                            branches: [
                                {
                                    source: 'https://bioportal.bioontology.org/ontologies/FDC-GDMT',
                                    acronym: 'FDC-GDMT',
                                    name: 'FDC-GDMT',
                                    uri: 'http://vocab.fairdatacollective.org/gdmt/IdentifierType',
                                    maxDepth: 2147483647,
                                },
                            ],
                            ontologies: [],
                            literals: [],
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Distribution Identifier Type)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Distribution Publisher': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/2f424720-9c97-4638-93da-5eab461a041b',
                        'schema:identifier': 'distribution_publisher',
                        'schema:name': 'Distribution Publisher',
                        'schema:description': 'The organization or resource that services to make publicly available this distribution of the data file.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Distribution Publisher',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Distribution Publisher)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@id': {
                        type: 'string',
                        format: 'uri',
                    },
                    'Distribution Size': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/dcd682d5-34a4-4125-ac45-67f73c5b9337',
                        'schema:identifier': 'distribution_size',
                        'schema:name': 'Distribution Size',
                        'schema:description': 'Total size of data file distribution (in bytes).',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Distribution Size',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Distribution Size)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Distribution Publisher Identifier Scheme': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/57b5ac5f-41b0-4ac6-bd04-5e1a456a06e9',
                        'schema:identifier': 'distribution_publisher_identifier_scheme',
                        'schema:name': 'Distribution Publisher Identifier Scheme',
                        'schema:description': 'Name of the scheme or authority for the Distribution Publisher Identifier.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Distribution Publisher Identifier Scheme',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                            classes: [],
                            branches: [
                                {
                                    source: 'https://bioportal.bioontology.org/ontologies/FDC-GDMT',
                                    acronym: 'FDC-GDMT',
                                    name: 'FDC-GDMT',
                                    uri: 'http://vocab.fairdatacollective.org/gdmt/IdentifierScheme',
                                    maxDepth: 2147483647,
                                },
                            ],
                            ontologies: [],
                            literals: [],
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Distribution Publisher Identifier Scheme)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Distribution Access Protocol': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/abddcdd2-069c-4829-9a5c-71713bfbe284',
                        'schema:identifier': 'distribution_access_protocol',
                        'schema:name': 'Distribution Access Protocol',
                        'schema:description': 'The protocol used to access the data file distribution.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Distribution Access Protocol',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Distribution Access Protocol)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Distribution Query Statement': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/6f347382-fe49-40ef-86e0-b1fc2c5ad8d7',
                        'schema:identifier': 'distribution_query_statement',
                        'schema:name': 'Distribution Query Statement',
                        'schema:description': 'Technical statement(s) for querying the data file distribution.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Distribution Query Statement',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Distribution Query Statement)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                },
                multiValued: false,
                required: [
                    '@context',
                    '@id',
                    'Distribution Publisher',
                    'Distribution Publisher Identifier',
                    'Distribution Publisher Identifier Scheme',
                    'Distribution Publisher Identifier Scheme Identifier',
                    'Distribution Identifier',
                    'Distribution Identifier Type',
                    'Distribution Format',
                    'Distribution Media Type',
                    'Distribution Size',
                    'Distribution Access Protocol',
                    'Distribution Access Configuration',
                    'Distribution Query Statement',
                    'Data File Publication Date',
                ],
                additionalProperties: false,
                'schema:schemaVersion': '1.6.0',
                '@id': 'https://repo.metadatacenter.org/template-elements/d6b204d2-b777-4c8e-b6dc-5495a70f67db',
                _ui: {
                    order: [
                        'Distribution Publisher',
                        'Distribution Publisher Identifier',
                        'Distribution Publisher Identifier Scheme',
                        'Distribution Publisher Identifier Scheme Identifier',
                        'Distribution Identifier',
                        'Distribution Identifier Type',
                        'Distribution Format',
                        'Distribution Media Type',
                        'Distribution Size',
                        'Distribution Access Protocol',
                        'Distribution Access Configuration',
                        'Distribution Query Statement',
                        'Data File Publication Date',
                    ],
                    propertyLabels: {
                        'Distribution Publisher': 'Distribution Publisher',
                        'Distribution Publisher Identifier': 'Distribution Publisher Identifier',
                        'Distribution Publisher Identifier Scheme': 'Distribution Publisher Identifier Scheme',
                        'Distribution Publisher Identifier Scheme Identifier': 'Distribution Publisher Identifier Scheme Identifier',
                        'Distribution Identifier': 'Distribution Identifier',
                        'Distribution Identifier Type': 'Distribution Identifier Type',
                        'Distribution Format': 'Distribution Format',
                        'Distribution Media Type': 'Distribution Media Type',
                        'Distribution Size': 'Distribution Size',
                        'Distribution Access Protocol': 'Distribution Access Protocol',
                        'Distribution Access Configuration': 'Distribution Access Configuration',
                        'Distribution Query Statement': 'Distribution Query Statement',
                        'Data File Publication Date': 'Data File Publication Date',
                    },
                    propertyDescriptions: {
                        'Distribution Publisher': 'The organization or resource that services to make publicly available this distribution of the data file.',
                        'Distribution Publisher Identifier': 'Globally unique string that identifies the Distribution Publisher.',
                        'Distribution Publisher Identifier Scheme': 'Name of the scheme or authority for the Distribution Publisher Identifier.',
                        'Distribution Publisher Identifier Scheme Identifier': 'The unique identifier (IRI) of the scheme or authority used for the Distribution Publisher Identifier.',
                        'Distribution Identifier': 'A globally unique string that identifies the data file distribution.',
                        'Distribution Identifier Type': 'The identifier type used to identify the data file distribution.',
                        'Distribution Format': 'An established standard to which the data file distribution conforms.',
                        'Distribution Media Type': 'A media type, formerly known as a MIME type, of data file distribution.',
                        'Distribution Size': 'Total size of data file distribution (in bytes).',
                        'Distribution Access Protocol': 'The protocol used to access the data file distribution.',
                        'Distribution Access Configuration': 'The access protocol configuration for querying the data file distribution.',
                        'Distribution Query Statement': 'Technical statement(s) for querying the data file distribution.',
                        'Data File Publication Date': 'Publication date of this distribution the data file.',
                    },
                },
                '@context': {
                    xsd: 'http://www.w3.org/2001/XMLSchema#',
                    pav: 'http://purl.org/pav/',
                    bibo: 'http://purl.org/ontology/bibo/',
                    oslc: 'http://open-services.net/ns/core#',
                    schema: 'http://schema.org/',
                    'schema:name': {
                        '@type': 'xsd:string',
                    },
                    'schema:description': {
                        '@type': 'xsd:string',
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
                },
                'schema:identifier': 'data_file_distribution',
                'schema:name': 'Data File Distribution',
                'schema:description': 'Details about the distribution for this individual public presentation of the data file (if part of the Distribution metadata), or for all the public presentations of the data file being described (if part of the data file metadata).',
                'pav:derivedFrom': '',
                'skos:prefLabel': 'Data File Distribution',
                'skos:altLabel': [],
                'pav:version': '0.0.1',
                'bibo:status': 'bibo:draft',
                'pav:createdOn': '2022-08-11T21:26:18-07:00',
                'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                'pav:lastUpdatedOn': '2022-08-11T21:26:18-07:00',
                'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                $schema: 'http://json-schema.org/draft-04/schema#',
            },
        },
        'Data Source': {
            type: 'array',
            minItems: 1,
            items: {
                '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                type: 'object',
                title: 'Element(Data Source)',
                description: 'Generated by CSV2CEDAR.',
                properties: {
                    'Data Source Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/53da83ae-2c14-4053-b7ca-6a7bbdc85d05',
                        'schema:identifier': 'data_source_identifier',
                        'schema:name': 'Data Source Identifier',
                        'schema:description': 'Globally unique string that identifies the data source (e.g., PID of an instrument).',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Data Source Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Data Source Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@type': {
                        oneOf: [
                            {
                                type: 'string',
                                format: 'uri',
                            },
                            {
                                type: 'array',
                                minItems: 1,
                                items: {
                                    type: 'string',
                                    format: 'uri',
                                },
                                uniqueItems: true,
                            },
                        ],
                    },
                    'Data Source Scheme Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/d4b2772a-82a0-4c07-8f8c-3180e4d202b5',
                        'schema:identifier': 'data_source_scheme_identifier',
                        'schema:name': 'Data Source Scheme Identifier',
                        'schema:description': 'The unique identifier (IRI) of the scheme or authority used for the Data Source Identifier.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Data Source Scheme Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'link',
                            hidden: true,
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Data Source Scheme Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Data Source Name': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/00b41332-e5f9-42ce-81a3-52dcd948ae9b',
                        'schema:identifier': 'data_source_name',
                        'schema:name': 'Data Source Name',
                        'schema:description': 'Human readable name of data source from which the variable(s) come(s). Physical or conceptual entity that creates the data streams that make up the described data file. The data source may or may not be associated with a fixed location; for example, a series of discrete sensors deployed over time to a single location may be considered a single data source in some systems.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Data Source Name',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Data Source Name)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@id': {
                        type: 'string',
                        format: 'uri',
                    },
                    '@context': {
                        type: 'object',
                        properties: {
                            'Data Source Name': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasDataSource',
                                ],
                            },
                            'Data Source Identifier': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasDataSourceIRI',
                                ],
                            },
                            'Data Source Scheme': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasDataSourceScheme',
                                ],
                            },
                            'Data Source Scheme Identifier': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasDataSourceSchemeIRI',
                                ],
                            },
                        },
                        additionalProperties: false,
                    },
                    'Data Source Scheme': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/3639378a-ae56-4da5-9983-2941c3883064',
                        'schema:identifier': 'data_source_scheme',
                        'schema:name': 'Data Source Scheme',
                        'schema:description': 'The name of the scheme or authority used for the Data Source Identifier.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Data Source Scheme',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                            classes: [],
                            branches: [
                                {
                                    source: 'https://bioportal.bioontology.org/ontologies/FDC-GDMT',
                                    acronym: 'FDC-GDMT',
                                    name: 'FDC-GDMT',
                                    uri: 'http://vocab.fairdatacollective.org/gdmt/IdentifierType',
                                    maxDepth: 2147483647,
                                },
                            ],
                            ontologies: [],
                            literals: [],
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Data Source Scheme)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                },
                multiValued: false,
                required: [
                    '@context',
                    '@id',
                    'Data Source Name',
                    'Data Source Identifier',
                    'Data Source Scheme',
                    'Data Source Scheme Identifier',
                ],
                additionalProperties: false,
                'schema:schemaVersion': '1.6.0',
                '@id': 'https://repo.metadatacenter.org/template-elements/ff5806c8-d09c-4ea9-af9b-a73af234cfdf',
                _ui: {
                    order: [
                        'Data Source Name',
                        'Data Source Identifier',
                        'Data Source Scheme',
                        'Data Source Scheme Identifier',
                    ],
                    propertyLabels: {
                        'Data Source Name': 'Data Source Name',
                        'Data Source Identifier': 'Data Source Identifier',
                        'Data Source Scheme': 'Data Source Scheme',
                        'Data Source Scheme Identifier': 'Data Source Scheme Identifier',
                    },
                    propertyDescriptions: {
                        'Data Source Name': 'Human readable name of data source from which the variable(s) come(s). Physical or conceptual entity that creates the data streams that make up the described data file. The data source may or may not be associated with a fixed location; for example, a series of discrete sensors deployed over time to a single location may be considered a single data source in some systems.',
                        'Data Source Identifier': 'Globally unique string that identifies the data source (e.g., PID of an instrument).',
                        'Data Source Scheme': 'The name of the scheme or authority used for the Data Source Identifier.',
                        'Data Source Scheme Identifier': 'The unique identifier (IRI) of the scheme or authority used for the Data Source Identifier.',
                    },
                },
                '@context': {
                    xsd: 'http://www.w3.org/2001/XMLSchema#',
                    pav: 'http://purl.org/pav/',
                    bibo: 'http://purl.org/ontology/bibo/',
                    oslc: 'http://open-services.net/ns/core#',
                    schema: 'http://schema.org/',
                    'schema:name': {
                        '@type': 'xsd:string',
                    },
                    'schema:description': {
                        '@type': 'xsd:string',
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
                },
                'schema:identifier': 'data_source',
                'schema:name': 'Data Source',
                'schema:description': 'Physical or conceptual entity that creates the data streams that make up the described data file. The data source may or may not be associated with a fixed location; for example, a series of discrete sensors deployed over time to a single location may be considered a single data source in some systems.',
                'pav:derivedFrom': '',
                'skos:prefLabel': 'Data Source',
                'skos:altLabel': [],
                'pav:version': '0.0.1',
                'bibo:status': 'bibo:draft',
                'pav:createdOn': '2022-08-11T21:26:18-07:00',
                'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                'pav:lastUpdatedOn': '2022-08-11T21:26:18-07:00',
                'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                $schema: 'http://json-schema.org/draft-04/schema#',
            },
        },
        'schema:isBasedOn': {
            type: 'string',
            format: 'uri',
        },
        'schema:description': {
            type: 'string',
        },
        'Data File Title': {
            type: 'array',
            minItems: 1,
            items: {
                '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                type: 'object',
                title: 'Element(Data File Title)',
                description: 'Generated by CSV2CEDAR.',
                properties: {
                    'Title Language': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/78a7f0bb-eea6-48a3-82bd-ac5fd97cea42',
                        'schema:identifier': 'title_language',
                        'schema:name': 'Title Language',
                        'schema:description': 'Language in which the Data File title is provided.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Title Language',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                            classes: [],
                            branches: [],
                            ontologies: [
                                {
                                    uri: 'https://bioportal.bioontology.org/ontologies/ISO639-1',
                                    acronym: 'ISO639-1',
                                    name: 'ISO639-1',
                                },
                            ],
                            literals: [],
                            defaultValue: {
                                termUri: 'https://www.omg.org/spec/LCC/Languages/LaISO639-1-LanguageCodes/en',
                                'rdfs:label': '[en]',
                            },
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Title Language)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@id': {
                        type: 'string',
                        format: 'uri',
                    },
                    '@context': {
                        type: 'object',
                        properties: {
                            'Data File Title': {
                                enum: [
                                    'http://purl.org/dc/elements/1.1/title',
                                ],
                            },
                            'Title Language': {
                                enum: [
                                    'http://purl.org/dc/terms/language',
                                ],
                            },
                        },
                        additionalProperties: false,
                    },
                    '@type': {
                        oneOf: [
                            {
                                type: 'string',
                                format: 'uri',
                            },
                            {
                                type: 'array',
                                minItems: 1,
                                items: {
                                    type: 'string',
                                    format: 'uri',
                                },
                                uniqueItems: true,
                            },
                        ],
                    },
                    'Data File Title': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/6eb84ebb-c72c-455d-92ac-165a514fb757',
                        'schema:identifier': 'data_file_title',
                        'schema:name': 'Data File Title',
                        'schema:description': 'A name or title by which the Data File being described is known.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Data File Title',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: true,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Data File Title)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                },
                multiValued: false,
                required: [
                    '@context',
                    '@id',
                    'Data File Title',
                    'Title Language',
                ],
                additionalProperties: false,
                'schema:schemaVersion': '1.6.0',
                '@id': 'https://repo.metadatacenter.org/template-elements/161d0864-1624-4ebf-989d-67005dd09385',
                _ui: {
                    order: [
                        'Data File Title',
                        'Title Language',
                    ],
                    propertyLabels: {
                        'Data File Title': 'Data File Title',
                        'Title Language': 'Title Language',
                    },
                    propertyDescriptions: {
                        'Data File Title': 'A name or title by which the Data File being described is known.',
                        'Title Language': 'Language in which the Data File title is provided.',
                    },
                },
                '@context': {
                    xsd: 'http://www.w3.org/2001/XMLSchema#',
                    pav: 'http://purl.org/pav/',
                    bibo: 'http://purl.org/ontology/bibo/',
                    oslc: 'http://open-services.net/ns/core#',
                    schema: 'http://schema.org/',
                    'schema:name': {
                        '@type': 'xsd:string',
                    },
                    'schema:description': {
                        '@type': 'xsd:string',
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
                },
                'schema:identifier': 'data_file_title',
                'schema:name': 'Data File Title',
                'schema:description': 'A name or title by which the Data File being described is known.',
                'pav:derivedFrom': '',
                'skos:prefLabel': 'Data File Title',
                'skos:altLabel': [],
                'pav:version': '0.0.1',
                'bibo:status': 'bibo:draft',
                'pav:createdOn': '2022-08-11T21:26:18-07:00',
                'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                'pav:lastUpdatedOn': '2022-08-11T21:26:18-07:00',
                'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                $schema: 'http://json-schema.org/draft-04/schema#',
            },
        },
        'pav:lastUpdatedOn': {
            type: [
                'string',
                'null',
            ],
            format: 'date-time',
        },
        'Data File Contributor': {
            type: 'array',
            minItems: 1,
            items: {
                '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                type: 'object',
                title: 'Element(Data File Contributor)',
                description: 'Generated by CSV2CEDAR.',
                properties: {
                    'Contributor Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/cc5ba1a9-3a03-4e62-b043-a73bf5b80a54',
                        'schema:identifier': 'contributor_identifier',
                        'schema:name': 'Contributor Identifier',
                        'schema:description': 'Globally unique string that identifies the contributor (an individual or legal entity).',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Contributor Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Contributor Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Contributor Email': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/f2ffa6d9-8f67-4d69-b460-361b4d3e6b65',
                        'schema:identifier': 'contributor_email',
                        'schema:name': 'Contributor Email',
                        'schema:description': 'An email address of the contributor.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Contributor Email',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'email',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Contributor Email)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Contributor Name': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/c06f5f61-330e-49b8-a55b-65e14f6f7cc7',
                        'schema:identifier': 'contributor_name',
                        'schema:name': 'Contributor Name',
                        'schema:description': 'The full name of the contributor.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Contributor Name',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Contributor Name)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Contributor Affiliation Identifier Scheme Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/281d4746-1366-47c3-b424-f2ca99484b24',
                        'schema:identifier': 'contributor_affiliation_identifier_scheme_identifier',
                        'schema:name': 'Contributor Affiliation Identifier Scheme Identifier',
                        'schema:description': 'The unique identifier (IRI) of the scheme or authority used for the Contributor Affiliation Identifier Scheme.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Contributor Affiliation Identifier Scheme Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'link',
                            hidden: true,
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Contributor Affiliation Identifier Scheme Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@type': {
                        oneOf: [
                            {
                                type: 'string',
                                format: 'uri',
                            },
                            {
                                type: 'array',
                                minItems: 1,
                                items: {
                                    type: 'string',
                                    format: 'uri',
                                },
                                uniqueItems: true,
                            },
                        ],
                    },
                    'Contributor Type': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/7534371c-843c-4666-8861-ecbfb64d1a5e',
                        'schema:identifier': 'contributor_type',
                        'schema:name': 'Contributor Type',
                        'schema:description': 'The type of the contributor of the described data file (person or organization).',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Contributor Type',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                            classes: [],
                            branches: [
                                {
                                    source: 'https://bioportal.bioontology.org/ontologies/FDC-GDMT',
                                    acronym: 'FDC-GDMT',
                                    name: 'FDC-GDMT',
                                    uri: 'http://vocab.fairdatacollective.org/gdmt/ResourceCreatorType',
                                    maxDepth: 2147483647,
                                },
                            ],
                            ontologies: [],
                            literals: [],
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Contributor Type)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Contributor Affiliation Identifier Scheme': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/ad6a972e-29d4-45af-9774-d0d335bcab22',
                        'schema:identifier': 'contributor_affiliation_identifier_scheme',
                        'schema:name': 'Contributor Affiliation Identifier Scheme',
                        'schema:description': 'The name of the scheme or authority used for the Contributor Affiliation Identifier.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Contributor Affiliation Identifier Scheme',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                            classes: [],
                            branches: [
                                {
                                    source: 'https://bioportal.bioontology.org/ontologies/FDC-GDMT',
                                    acronym: 'FDC-GDMT',
                                    name: 'FDC-GDMT',
                                    uri: 'http://vocab.fairdatacollective.org/gdmt/IdentifierScheme',
                                    maxDepth: 2147483647,
                                },
                            ],
                            ontologies: [],
                            literals: [],
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Contributor Affiliation Identifier Scheme)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Contributor Affiliation Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/eba64c01-8656-43d3-9ae2-149ef3bb21c9',
                        'schema:identifier': 'contributor_affiliation_identifier',
                        'schema:name': 'Contributor Affiliation Identifier',
                        'schema:description': 'Globally unique string that identifies the organizational affiliation of the contributor.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Contributor Affiliation Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Contributor Affiliation Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Contributor Role': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/f74d6b2d-ee90-460a-b099-877fa62720a7',
                        'schema:identifier': 'contributor_role',
                        'schema:name': 'Contributor Role',
                        'schema:description': 'The role of the contributor in bringing the described data file into existence.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Contributor Role',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                            classes: [],
                            branches: [
                                {
                                    source: 'https://bioportal.bioontology.org/ontologies/FDC-GDMT',
                                    acronym: 'FDC-GDMT',
                                    name: 'FDC-GDMT',
                                    uri: 'http://vocab.fairdatacollective.org/gdmt/ContributorRole',
                                    maxDepth: 2147483647,
                                },
                            ],
                            ontologies: [],
                            literals: [],
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Contributor Role)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@context': {
                        type: 'object',
                        properties: {
                            'Contributor Type': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasContributorType',
                                ],
                            },
                            'Contributor Name': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasContributorNameInfo',
                                ],
                            },
                            'Contributor Given Name': {
                                enum: [
                                    'http://xmlns.com/foaf/0.1/givenName',
                                ],
                            },
                            'Contributor Family Name': {
                                enum: [
                                    'http://xmlns.com/foaf/0.1/familyName',
                                ],
                            },
                            'Contributor Identifier': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasContributorIdentifier',
                                ],
                            },
                            'Contributor Identifier Scheme': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasContributorIdentifierScheme',
                                ],
                            },
                            'Contributor Identifier Scheme Identifier': {
                                enum: [
                                    'https://schema.metadatacenter.org/properties/ca5a8523-a6b4-4dbd-a35c-91e0278bf8d2',
                                ],
                            },
                            'Contributor Affiliation': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasContributorAffiliation',
                                ],
                            },
                            'Contributor Affiliation Identifier': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasContributorAffiliationIdentifier',
                                ],
                            },
                            'Contributor Affiliation Identifier Scheme': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasContributorAffiliationIdentifierScheme',
                                ],
                            },
                            'Contributor Affiliation Identifier Scheme Identifier': {
                                enum: [
                                    'https://schema.metadatacenter.org/properties/9719c516-7873-4794-a532-5bbbf0f70f22',
                                ],
                            },
                            'Contributor Email': {
                                enum: [
                                    'http://xmlns.com/foaf/0.1/mbox',
                                ],
                            },
                            'Contributor Role': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasContributorRole',
                                ],
                            },
                        },
                        additionalProperties: false,
                    },
                    'Contributor Family Name': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/f4f4140b-332e-4106-b59b-3e534d0e430c',
                        'schema:identifier': 'contributor_family_name',
                        'schema:name': 'Contributor Family Name',
                        'schema:description': 'If the contributor is a person, the surname(s) of the conributor (e.g., last name in Western languagues, first name in Asian languages).',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Contributor Family Name',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Contributor Family Name)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Contributor Identifier Scheme': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/51480627-2561-453a-aac3-be9bfc42b36b',
                        'schema:identifier': 'contributor_identifier_scheme',
                        'schema:name': 'Contributor Identifier Scheme',
                        'schema:description': 'The name of the scheme or authority used for the Contributor Identifier.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Contributor Identifier Scheme',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                            classes: [],
                            branches: [
                                {
                                    source: 'https://bioportal.bioontology.org/ontologies/FDC-GDMT',
                                    acronym: 'FDC-GDMT',
                                    name: 'FDC-GDMT',
                                    uri: 'http://vocab.fairdatacollective.org/gdmt/IdentifierScheme',
                                    maxDepth: 2147483647,
                                },
                            ],
                            ontologies: [],
                            literals: [],
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Contributor Identifier Scheme)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Contributor Given Name': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/525ebf61-e32e-4a6e-a1be-a528222d89a9',
                        'schema:identifier': 'contributor_given_name',
                        'schema:name': 'Contributor Given Name',
                        'schema:description': 'If the contributor is a person, the personal name(s) of the contributor (e.g., first and optionally middle name in Western languagues, optionally middle and last name in Asian languages).',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Contributor Given Name',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Contributor Given Name)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Contributor Affiliation': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/1a3d7d12-347b-42a0-8d67-b3fc9a2f3bca',
                        'schema:identifier': 'contributor_affiliation',
                        'schema:name': 'Contributor Affiliation',
                        'schema:description': 'If the contributor is a person, the organizational or institutional affiliation of the contributor.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Contributor Affiliation',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Contributor Affiliation)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Contributor Identifier Scheme Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/9c096368-fa0e-434f-825c-6360991166db',
                        'schema:identifier': 'contributor_identifier_scheme_identifier',
                        'schema:name': 'Contributor Identifier Scheme Identifier',
                        'schema:description': 'The unique identifier (IRI) of the scheme or authority used for the Contributor Identifier.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Contributor Identifier Scheme Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'link',
                            hidden: true,
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Contributor Identifier Scheme Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
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
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@id': {
                        type: 'string',
                        format: 'uri',
                    },
                },
                multiValued: false,
                required: [
                    '@context',
                    '@id',
                    'Contributor Type',
                    'Contributor Name',
                    'Contributor Given Name',
                    'Contributor Family Name',
                    'Contributor Identifier',
                    'Contributor Identifier Scheme',
                    'Contributor Identifier Scheme Identifier',
                    'Contributor Affiliation',
                    'Contributor Affiliation Identifier',
                    'Contributor Affiliation Identifier Scheme',
                    'Contributor Affiliation Identifier Scheme Identifier',
                    'Contributor Email',
                    'Contributor Role',
                ],
                additionalProperties: false,
                'schema:schemaVersion': '1.6.0',
                '@id': 'https://repo.metadatacenter.org/template-elements/0ee400b5-219c-4c43-956a-e35f17397348',
                _ui: {
                    order: [
                        'Contributor Type',
                        'Contributor Name',
                        'Contributor Given Name',
                        'Contributor Family Name',
                        'Contributor Identifier',
                        'Contributor Identifier Scheme',
                        'Contributor Identifier Scheme Identifier',
                        'Contributor Affiliation',
                        'Contributor Affiliation Identifier',
                        'Contributor Affiliation Identifier Scheme',
                        'Contributor Affiliation Identifier Scheme Identifier',
                        'Contributor Email',
                        'Contributor Role',
                    ],
                    propertyLabels: {
                        'Contributor Type': 'Contributor Type',
                        'Contributor Name': 'Contributor Name',
                        'Contributor Given Name': 'Contributor Given Name',
                        'Contributor Family Name': 'Contributor Family Name',
                        'Contributor Identifier': 'Contributor Identifier',
                        'Contributor Identifier Scheme': 'Contributor Identifier Scheme',
                        'Contributor Identifier Scheme Identifier': 'Contributor Identifier Scheme Identifier',
                        'Contributor Affiliation': 'Contributor Affiliation',
                        'Contributor Affiliation Identifier': 'Contributor Affiliation Identifier',
                        'Contributor Affiliation Identifier Scheme': 'Contributor Affiliation Identifier Scheme',
                        'Contributor Affiliation Identifier Scheme Identifier': 'Contributor Affiliation Identifier Scheme Identifier',
                        'Contributor Email': 'Contributor Email',
                        'Contributor Role': 'Contributor Role',
                    },
                    propertyDescriptions: {
                        'Contributor Type': 'The type of the contributor of the described data file (person or organization).',
                        'Contributor Name': 'The full name of the contributor.',
                        'Contributor Given Name': 'If the contributor is a person, the personal name(s) of the contributor (e.g., first and optionally middle name in Western languagues, optionally middle and last name in Asian languages).',
                        'Contributor Family Name': 'If the contributor is a person, the surname(s) of the conributor (e.g., last name in Western languagues, first name in Asian languages).',
                        'Contributor Identifier': 'Globally unique string that identifies the contributor (an individual or legal entity).',
                        'Contributor Identifier Scheme': 'The name of the scheme or authority used for the Contributor Identifier.',
                        'Contributor Identifier Scheme Identifier': 'The unique identifier (IRI) of the scheme or authority used for the Contributor Identifier.',
                        'Contributor Affiliation': 'If the contributor is a person, the organizational or institutional affiliation of the contributor.',
                        'Contributor Affiliation Identifier': 'Globally unique string that identifies the organizational affiliation of the contributor.',
                        'Contributor Affiliation Identifier Scheme': 'The name of the scheme or authority used for the Contributor Affiliation Identifier.',
                        'Contributor Affiliation Identifier Scheme Identifier': 'The unique identifier (IRI) of the scheme or authority used for the Contributor Affiliation Identifier Scheme.',
                        'Contributor Email': 'An email address of the contributor.',
                        'Contributor Role': 'The role of the contributor in bringing the described data file into existence.',
                    },
                },
                '@context': {
                    xsd: 'http://www.w3.org/2001/XMLSchema#',
                    pav: 'http://purl.org/pav/',
                    bibo: 'http://purl.org/ontology/bibo/',
                    oslc: 'http://open-services.net/ns/core#',
                    schema: 'http://schema.org/',
                    'schema:name': {
                        '@type': 'xsd:string',
                    },
                    'schema:description': {
                        '@type': 'xsd:string',
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
                },
                'schema:identifier': 'data_file_contributor',
                'schema:name': 'Data File Contributor',
                'schema:description': 'An entity that contributed in bringing into existence the data file being described. Contributors can be people, organizations and/or physical or virtual infrastructure (e.g., sensors, software).',
                'pav:derivedFrom': '',
                'skos:prefLabel': 'Data File Contributor',
                'skos:altLabel': [],
                'pav:version': '0.0.1',
                'bibo:status': 'bibo:draft',
                'pav:createdOn': '2022-08-11T21:26:18-07:00',
                'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                'pav:lastUpdatedOn': '2022-08-11T21:26:18-07:00',
                'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                $schema: 'http://json-schema.org/draft-04/schema#',
            },
        },
        'schema:name': {
            type: 'string',
            minLength: 1,
        },
        'pav:derivedFrom': {
            type: 'string',
            format: 'uri',
        },
        'Data File Subjects and Keywords': {
            type: 'array',
            minItems: 1,
            items: {
                '@type': 'https://schema.metadatacenter.org/core/TemplateElement',
                type: 'object',
                title: 'Element(Data File Subjects and Keywords)',
                description: 'Generated by CSV2CEDAR.',
                properties: {
                    'Subject Identifier Scheme Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/a281f9b6-2f71-4095-9f6e-fa9901b54f47',
                        'schema:identifier': 'subject_identifier_scheme_identifier',
                        'schema:name': 'Subject Identifier Scheme Identifier',
                        'schema:description': 'The unique identifier (IRI) of the scheme or authority used for the Subject Identifier.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Subject Identifier Scheme Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                            hidden: true,
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Subject Identifier Scheme Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    Keyword: {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/89085965-8269-4572-acd9-61d767a41d6e',
                        'schema:identifier': 'keyword',
                        'schema:name': 'Keyword',
                        'schema:description': 'Free text subject, keyword, classification code, or key phrase describing the data file or purpose for which the data file can be used.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Keyword',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Keyword)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@type': {
                        oneOf: [
                            {
                                type: 'string',
                                format: 'uri',
                            },
                            {
                                type: 'array',
                                minItems: 1,
                                items: {
                                    type: 'string',
                                    format: 'uri',
                                },
                                uniqueItems: true,
                            },
                        ],
                    },
                    'Subject Identifier': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/f02a5d40-7293-46f9-afae-091c3ccde46c',
                        'schema:identifier': 'subject_identifier',
                        'schema:name': 'Subject Identifier',
                        'schema:description': 'The unique identifier (IRI) of a concept (keyword, classification code, or controlled key phrase) that defines the data file or indicates for which concepts the data file can be used.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Subject Identifier',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Subject Identifier)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    'Subject Identifier Scheme': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/b4ca33bc-7766-48b0-9127-668e54019c4c',
                        'schema:identifier': 'subject_identifier_scheme',
                        'schema:name': 'Subject Identifier Scheme',
                        'schema:description': 'The name of the scheme or authority used for the Subject Identifier.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Subject Identifier Scheme',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Subject Identifier Scheme)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                    '@id': {
                        type: 'string',
                        format: 'uri',
                    },
                    '@context': {
                        type: 'object',
                        properties: {
                            'Subject Label': {
                                enum: [
                                    'http://purl.org/dc/terms/subject',
                                ],
                            },
                            'Subject Identifier': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasSubjectIRI',
                                ],
                            },
                            'Subject Identifier Scheme': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasSubjectScheme',
                                ],
                            },
                            'Subject Identifier Scheme Identifier': {
                                enum: [
                                    'http://vocab.fairdatacollective.org/gdmt/hasSubjectSchemeIRI',
                                ],
                            },
                            Keyword: {
                                enum: [
                                    'http://www.w3.org/ns/dcat#keyword',
                                ],
                            },
                        },
                        additionalProperties: false,
                    },
                    'Subject Label': {
                        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
                        '@id': 'https://repo.metadatacenter.org/template-fields/a7f47f9c-d030-4a02-ab80-6b3a2e5765dc',
                        'schema:identifier': 'subject_label',
                        'schema:name': 'Subject Label',
                        'schema:description': 'Text string corresponding to the subject IRI attribute.',
                        'pav:derivedFrom': '',
                        'skos:prefLabel': 'Subject Label',
                        'skos:altLabel': [],
                        'pav:version': '0.9.0',
                        'bibo:status': 'bibo:draft',
                        _valueConstraints: {
                            defaultValue: '',
                            requiredValue: false,
                            multipleChoice: false,
                        },
                        _ui: {
                            inputType: 'textfield',
                        },
                        'pav:createdOn': null,
                        'pav:createdBy': null,
                        'pav:lastUpdatedOn': null,
                        'oslc:modifiedBy': null,
                        type: 'object',
                        title: 'Field(Subject Label)',
                        description: 'Generated by CSV2CEDAR.',
                        properties: {
                            '@type': {
                                oneOf: [
                                    {
                                        type: 'string',
                                        format: 'uri',
                                    },
                                    {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'string',
                                            format: 'uri',
                                        },
                                        uniqueItems: true,
                                    },
                                ],
                            },
                            '@value': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                            'rdfs:label': {
                                type: [
                                    'string',
                                    'null',
                                ],
                            },
                        },
                        additionalProperties: false,
                        'schema:schemaVersion': '1.6.0',
                        '@context': {
                            xsd: 'http://www.w3.org/2001/XMLSchema#',
                            pav: 'http://purl.org/pav/',
                            bibo: 'http://purl.org/ontology/bibo/',
                            oslc: 'http://open-services.net/ns/core#',
                            schema: 'http://schema.org/',
                            skos: 'http://www.w3.org/2004/02/skos/core#',
                            'schema:name': {
                                '@type': 'xsd:string',
                            },
                            'schema:description': {
                                '@type': 'xsd:string',
                            },
                            'skos:prefLabel': {
                                '@type': 'xsd:string',
                            },
                            'skos:altLabel': {
                                '@type': 'xsd:string',
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
                        },
                        $schema: 'http://json-schema.org/draft-04/schema#',
                    },
                },
                multiValued: false,
                required: [
                    '@context',
                    '@id',
                    'Subject Label',
                    'Subject Identifier',
                    'Subject Identifier Scheme',
                    'Subject Identifier Scheme Identifier',
                    'Keyword',
                ],
                additionalProperties: false,
                'schema:schemaVersion': '1.6.0',
                '@id': 'https://repo.metadatacenter.org/template-elements/0b2302ad-a045-49c3-b807-b4c034ccf3c5',
                _ui: {
                    order: [
                        'Subject Label',
                        'Subject Identifier',
                        'Subject Identifier Scheme',
                        'Subject Identifier Scheme Identifier',
                        'Keyword',
                    ],
                    propertyLabels: {
                        'Subject Label': 'Subject Label',
                        'Subject Identifier': 'Subject Identifier',
                        'Subject Identifier Scheme': 'Subject Identifier Scheme',
                        'Subject Identifier Scheme Identifier': 'Subject Identifier Scheme Identifier',
                        Keyword: 'Keyword',
                    },
                    propertyDescriptions: {
                        'Subject Label': 'Text string corresponding to the subject IRI attribute.',
                        'Subject Identifier': 'The unique identifier (IRI) of a concept (keyword, classification code, or controlled key phrase) that defines the data file or indicates for which concepts the data file can be used.',
                        'Subject Identifier Scheme': 'The name of the scheme or authority used for the Subject Identifier.',
                        'Subject Identifier Scheme Identifier': 'The unique identifier (IRI) of the scheme or authority used for the Subject Identifier.',
                        Keyword: 'Free text subject, keyword, classification code, or key phrase describing the data file or purpose for which the data file can be used.',
                    },
                },
                '@context': {
                    xsd: 'http://www.w3.org/2001/XMLSchema#',
                    pav: 'http://purl.org/pav/',
                    bibo: 'http://purl.org/ontology/bibo/',
                    oslc: 'http://open-services.net/ns/core#',
                    schema: 'http://schema.org/',
                    'schema:name': {
                        '@type': 'xsd:string',
                    },
                    'schema:description': {
                        '@type': 'xsd:string',
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
                },
                'schema:identifier': 'data_file_subjects_and_keywords',
                'schema:name': 'Data File Subjects and Keywords',
                'schema:description': 'Concepts (keywords, classification, or free text terms) that define the data file or purpose (subjects which can be addressed) using the data file.',
                'pav:derivedFrom': '',
                'skos:prefLabel': 'Data File Subjects and Keywords',
                'skos:altLabel': [],
                'pav:version': '0.0.1',
                'bibo:status': 'bibo:draft',
                'pav:createdOn': '2022-08-11T21:26:18-07:00',
                'pav:createdBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                'pav:lastUpdatedOn': '2022-08-11T21:26:18-07:00',
                'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
                $schema: 'http://json-schema.org/draft-04/schema#',
            },
        },
    },
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
        'Data File Title',
        'Data File Identifier',
        'Resource Type',
        'Data File Version',
        'Data File Language',
        'Data File Subjects and Keywords',
        'Data File Description',
        'Data File Creator',
        'Data File Related Resource',
        'Data File Contributor',
        'Data File Rights',
        'Date',
        'Data File Parent Study',
        'Data File Funding Source',
        'Data File Distribution',
        'Data Characteristics Summary',
        'Data Source',
        'Data Source Stream',
        'Data File Process Version',
        'Data File Temporal Coverage',
        'Data File Spatial Coverage',
        'Data File Vertical Coverage',
        'Auxiliary Metadata',
    ],
    multiValued: false,
    additionalProperties: false,
    'schema:identifier': 'Template',
    'schema:name': 'RADx Metadata Specification',
    'schema:description': 'Template generated by CEDARCSV',
    'pav:derivedFrom': '',
    'skos:prefLabel': 'Template',
    'skos:altLabel': [],
    'pav:version': '0.0.1',
    'bibo:status': 'bibo:draft',
    'pav:createdOn': '2022-08-11T17:34:56-07:00',
    'pav:createdBy': 'https://metadatacenter.org/users/819b3cfd-49a9-4e72-b5d5-18166366f014',
    'pav:lastUpdatedOn': '2022-08-11T21:26:18-07:00',
    'oslc:modifiedBy': 'https://metadatacenter.org/users/1adf5ee5-cee0-47d1-9769-efbe00cdebee',
    '@context': {
        xsd: 'http://www.w3.org/2001/XMLSchema#',
        pav: 'http://purl.org/pav/',
        bibo: 'http://purl.org/ontology/bibo/',
        oslc: 'http://open-services.net/ns/core#',
        schema: 'http://schema.org/',
        'schema:name': {
            '@type': 'xsd:string',
        },
        'schema:description': {
            '@type': 'xsd:string',
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
    },
    '@type': 'https://schema.metadatacenter.org/core/Template',
    'schema:schemaVersion': '1.6.0',
    $schema: 'http://json-schema.org/draft-04/schema#',
});
