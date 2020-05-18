/* eslint-disable max-len */
// tslint:disable:max-line-length

import SchemaBlock from 'ember-osf-web/models/schema-block';

const schemaBlocks: Array<Partial<SchemaBlock>> = [
    {
        displayText: 'Summary',
        exampleText: '',
        blockType: 'page-heading',
        registrationResponseKey: null,
        index: 0,
        required: false,
        helpText: '',
        schemaBlockGroupKey: '',
        id: '5da4cf5ff04bcd000155f330',
    },
    {
        displayText: 'Summary',
        exampleText: '',
        blockType: 'question-label',
        registrationResponseKey: null,
        index: 1,
        required: false,
        helpText: 'Provide a narrative summary of what is contained in this registration, or how it differs from prior registrations.',
        schemaBlockGroupKey: '5da4cf5ff04bcd000155f331',
        id: '5da4cf5ff04bcd000155f332',
    },
    {
        displayText: '',
        exampleText: '',
        blockType: 'long-text-input',
        registrationResponseKey: 'summary',
        index: 2,
        required: false,
        helpText: '',
        schemaBlockGroupKey: '5da4cf5ff04bcd000155f331',
        id: '5da4cf5ff04bcd000155f333',
    },
    {
        displayText: '',
        exampleText: '',
        blockType: 'file-input',
        registrationResponseKey: 'uploader',
        index: 3,
        required: false,
        helpText: '',
        schemaBlockGroupKey: '5e72398a31655a0001ea8ef8',
        id: '5e72398a31655a0001ea8efa',
    },
];

export const schemaBlockIds = schemaBlocks.map(block => block.id);

export default schemaBlocks;

/* eslint-enable max-len */
