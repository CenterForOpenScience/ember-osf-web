import CedarMetadataTemplateModel from 'ember-osf-web/models/cedar-metadata-template';


const cedarMetadataTemplates: Array<Partial<CedarMetadataTemplateModel>> = [
    {
        id: '2',
        schemaName: 'OSF Registries - 1',
        cedarId: 'abc-123',
        active: true,
        template: Object({
            description: 'A template description may or may not exist on the cedar template object',
        }),
        templateVersion: 1,
    },
    {
        id: '3',
        schemaName: 'OSF Registries - 2',
        cedarId: 'abc-123',
        active: true,
        template: Object({
            description: 'A template description may or may not exist on the cedar template object',
        }),
        templateVersion: 1,
    },
    {
        id: '1',
        schemaName: 'A - OSF Registries - 2',
        cedarId: 'abc-123',
        active: true,
        template: Object({
            description: 'A template description may or may not exist on the cedar template object',
        }),
        templateVersion: 1,
    },
];

export default cedarMetadataTemplates as CedarMetadataTemplateModel[];
