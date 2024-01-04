import CedarMetadataTemplateModel from 'ember-osf-web/models/cedar-metadata-template';


const cedarMetadataTemplates: Array<Partial<CedarMetadataTemplateModel>> = [
    {
        id: '2',
        schemaName: 'OSF Registries - 1',
        cedarId: 'https://repo.metadatacenter.net/templates/58098c2d-dea9-4ec6-8f5d-d85d5f1b4f6f',
        active: true,
        template: Object({
            description: 'A template description may or may not exist on the cedar template object',
        }),
        templateVersion: 1,
    },
    {
        id: '3',
        schemaName: 'OSF Registries - 2',
        cedarId: 'def-456',
        active: true,
        template: Object({
            description: 'A template description may or may not exist on the cedar template object',
        }),
        templateVersion: 1,
    },
    {
        id: '1',
        schemaName: 'A - OSF Registries - 2',
        cedarId: 'ghi-789',
        active: true,
        template: Object({
            description: 'A template description may or may not exist on the cedar template object',
        }),
        templateVersion: 1,
    },
];

export default cedarMetadataTemplates as CedarMetadataTemplateModel[];
