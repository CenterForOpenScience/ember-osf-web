/* eslint-disable max-len */
export const biosampleRecord = Object({
    '@context': {
        'schema:isBasedOn': {
            '@type': '@id',
        },
        'schema:name': {
            '@type': 'xsd:string',
        },
        'oslc:modifiedBy': {
            '@type': '@id',
        },
        schema: 'http://schema.org/',
        'pav:createdBy': {
            '@type': '@id',
        },
        xsd: 'http://www.w3.org/2001/XMLSchema#',
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        nCBISubmissionDescription: 'https://schema.metadatacenter.net/properties/nCBISubmissionDescription',
        'rdfs:label': {
            '@type': 'xsd:string',
        },
        'pav:derivedFrom': {
            '@type': '@id',
        },
        skos: 'http://www.w3.org/2004/02/skos/core#',
        'pav:lastUpdatedOn': {
            '@type': 'xsd:dateTime',
        },
        oslc: 'http://open-services.net/ns/core#',
        bioSample: 'https://schema.metadatacenter.net/properties/bioSample',
        'skos:notation': {
            '@type': 'xsd:string',
        },
        pav: 'http://purl.org/pav/',
        'schema:description': {
            '@type': 'xsd:string',
        },
        'pav:createdOn': {
            '@type': 'xsd:dateTime',
        },
    },
    nCBISubmissionDescription: {
        '@context': {
            nCBIOrganization: 'https://schema.metadatacenter.net/properties/nCBIOrganization',
            comment: 'https://schema.metadatacenter.net/properties/comment',
            releaseDate: 'https://schema.metadatacenter.net/properties/releaseDate',
        },
        comment: {
            '@value': 'This is a comment',
        },
        releaseDate: {
            '@value': '2024-01-09',
            '@type': 'xsd:date',
        },
        nCBIOrganization: {
            '@context': {
                nCBIContact: 'https://schema.metadatacenter.net/properties/nCBIContact',
                institutionName: 'https://schema.metadatacenter.net/properties/institutionName',
            },
            institutionName: {
                '@value': 'Center for Open Science',
            },
            nCBIContact: {
                '@context': {
                    nCBIName: 'https://schema.metadatacenter.net/properties/nCBIName',
                    untitled: 'https://schema.metadatacenter.net/properties/untitled',
                },
                untitled: {
                    '@value': 'email@email.com',
                },
                nCBIName: {
                    '@context': {
                        lastName: 'https://schema.metadatacenter.net/properties/lastName',
                        firstName: 'https://schema.metadatacenter.net/properties/firstName',
                        middleInitial: 'https://schema.metadatacenter.net/properties/middleInitial',
                    },
                    firstName: {
                        '@value': 'John',
                    },
                    middleInitial: {
                        '@value': null,
                    },
                    lastName: {
                        '@value': 'Doe',
                    },
                },
            },
        },
    },
    bioSample: {
        '@context': {
            bioSampleAttribute: 'https://schema.metadatacenter.net/properties/bioSampleAttribute',
            bioProjectID: 'https://schema.metadatacenter.net/properties/bioProjectID',
            nCBIOrganism: 'https://schema.metadatacenter.net/properties/nCBIOrganism',
            bioSampleSampleID: 'https://schema.metadatacenter.net/properties/bioSampleSampleID',
            biosamplePathogenCl10Attributes: 'https://schema.metadatacenter.net/properties/biosamplePathogenCl10Attributes',
            package: 'https://schema.metadatacenter.net/properties/package',
            bioSampleDescriptor: 'https://schema.metadatacenter.net/properties/bioSampleDescriptor',
        },
        bioProjectID: {
            '@value': 'mst3k',
        },
        package: {
            '@value': 'arandonpackageid',
        },
        bioSampleSampleID: {
            '@context': {
                label: 'https://schema.metadatacenter.net/properties/label',
                nCBISPUID: 'https://schema.metadatacenter.net/properties/nCBISPUID',
                display: 'https://schema.metadatacenter.net/properties/display',
            },
            label: {
                '@value': 'arandomlabelid',
            },
            display: {
                '@value': 'A Label',
            },
            nCBISPUID: {
                '@context': {
                    namespace: 'https://schema.metadatacenter.net/properties/namespace',
                    value: 'https://schema.metadatacenter.net/properties/value',
                    submitterID: 'https://schema.metadatacenter.net/properties/submitterID',
                },
                submitterID: {
                    '@value': 'itzy',
                },
                namespace: {
                    '@value': 'nspace',
                },
                value: {
                    '@value': '25',
                },
            },
        },
        bioSampleDescriptor: {
            '@context': {
                title: 'https://schema.metadatacenter.net/properties/title',
                description: 'https://schema.metadatacenter.net/properties/description',
                externalLink: 'https://schema.metadatacenter.net/properties/externalLink',
            },
            title: {
                '@value': 'This is a title',
            },
            description: {
                '@value': 'This is a description',
            },
            externalLink: {
                '@value': 'this is an external link',
            },
        },
        nCBIOrganism: {
            '@context': {
                organismName: 'https://schema.metadatacenter.net/properties/organismName',
                label: 'https://schema.metadatacenter.net/properties/label',
                breed: 'https://schema.metadatacenter.net/properties/breed',
                isolateName: 'https://schema.metadatacenter.net/properties/isolateName',
                strain: 'https://schema.metadatacenter.net/properties/strain',
                cultivar: 'https://schema.metadatacenter.net/properties/cultivar',
            },
            organismName: {
                '@value': 'Center for Open Science',
            },
            label: {
                '@value': 'A label',
            },
            strain: {
                '@value': 'nCov2019',
            },
            isolateName: {
                '@value': 'SARS-CoV-2',
            },
            breed: {
                '@value': 'Omicron',
            },
            cultivar: {
                '@value': 'XBB.1.16\t',
            },
        },
        biosamplePathogenCl10Attributes: {
            '@context': {
                isolationSource: 'https://schema.metadatacenter.net/properties/isolationSource',
                'latitude/Longitude': 'https://schema.metadatacenter.net/properties/latitude/Longitude',
                collectionDate: 'https://schema.metadatacenter.net/properties/collectionDate',
                strain: 'https://schema.metadatacenter.net/properties/strain',
                hostDisease: 'https://schema.metadatacenter.net/properties/hostDisease',
                gEOLocationName: 'https://schema.metadatacenter.net/properties/gEOLocationName',
                host: 'https://schema.metadatacenter.net/properties/host',
                collectedBy: 'https://schema.metadatacenter.net/properties/collectedBy',
            },
            strain: {
                '@value': 'i dunno',
            },
            collectionDate: {
                '@value': '2024-01-09',
                '@type': 'xsd:date',
            },
            collectedBy: {
                '@value': 'Me',
            },
            gEOLocationName: {
                '@value': 'Somewhere',
            },
            isolationSource: {
                '@value': 'Animals',
            },
            'latitude/Longitude': {
                '@value': '12.23',
            },
            host: {
                '@value': 'Human',
            },
            hostDisease: {
                '@value': 'COVID',
            },
        },
        bioSampleAttribute: [
            {
                '@context': {
                    attributeValue: 'https://schema.metadatacenter.net/properties/attributeValue',
                    attributeName: 'https://schema.metadatacenter.net/properties/attributeName',
                },
                attributeName: {
                    '@value': 'attr1',
                },
                attributeValue: {
                    '@value': 'a',
                },
            },
            {
                '@context': {
                    attributeValue: 'https://schema.metadatacenter.net/properties/attributeValue',
                    attributeName: 'https://schema.metadatacenter.net/properties/attributeName',
                },
                attributeName: {
                    '@value': 'attr2',
                },
                attributeValue: {
                    '@value': 'b',
                },
            },
        ],
    },
});
