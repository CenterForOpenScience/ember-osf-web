/* eslint-disable max-len */
import CedarMetadataTemplateModel from 'ember-osf-web/models/cedar-metadata-template';
import { biosampleTemplate } from './cedar-templates/cedar-template.biosample';
import { ffisTemplate } from './cedar-templates/cedar-template.ffis';
import { licenseTemplate } from './cedar-templates/cedar-template.license';
import { radxTemplate } from './cedar-templates/cedar-template.radx';
import { bibframeTemplate } from './cedar-templates/cedar-template.bibframe';
import { healTemplate } from './cedar-templates/cedar-template.heal';
import { testingTemplate } from './cedar-templates/cedar-template.testing';


const cedarMetadataTemplates: Array<Partial<CedarMetadataTemplateModel>> = [
    {
        id: '2',
        schemaName: 'Biosample Submission',
        cedarId: 'https://repo.metadatacenter.net/templates/58098c2d-dea9-4ec6-8f5d-d85d5f1b4f6f',
        active: true,
        template: biosampleTemplate,
        templateVersion: 1,
    },
    {
        id: '3',
        schemaName: 'Ffis Funder Draft',
        cedarId: 'https://repo.metadatacenter.org/templates/352a29d7-3df8-4bdd-bd75-e09d16c7063d',
        active: true,
        template: ffisTemplate,
        templateVersion: 1,
    },
    {
        id: '1',
        schemaName: 'BIDS Dataset Description',
        cedarId: 'https://repo.metadatacenter.org/template-fields/8b51634a-42df-414b-be27-6cfdfb611591',
        active: true,
        template: licenseTemplate,
        templateVersion: 1,
    },
    {
        id: '6',
        schemaName: 'HEAL Study Core Metadata',
        cedarId: 'https://repo.metadatacenter.org/templates/d01330c7-ccd1-4e99-856a-86e08937347c',
        active: true,
        template: healTemplate,
        templateVersion: 1,
    },
    {
        id: '4',
        schemaName: 'Radx Metadata Specification',
        cedarId: 'https://repo.metadatacenter.org/templates/ec918d9b-fcd2-4e6e-b63b-2c67aece9f68',
        active: true,
        template: radxTemplate,
        templateVersion: 1,
    },
    {
        id: '5',
        schemaName: 'BIBFRAME AUDIO WORK',
        cedarId: 'https://repo.metadatacenter.net/template-fields/6214d1f3-9667-492c-9d87-8ce5e7b65960',
        active: true,
        template: bibframeTemplate,
        templateVersion: 1,
    },
    {
        id: '7',
        schemaName: 'TESTING',
        cedarId: 'https://repo.metadatacenter.org/template-fields/2b0906ae-2761-4a4c-b85c-78c9275426f6',
        active: true,
        template: testingTemplate,
        templateVersion: 1,
    },
];

export default cedarMetadataTemplates as CedarMetadataTemplateModel[];
