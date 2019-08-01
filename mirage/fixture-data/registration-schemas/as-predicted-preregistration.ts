/* eslint-disable max-len */
// tslint:disable:max-line-length

import { MirageRegistrationSchema } from '../../fixtures/registration-schemas';

export default {
    id: 'as_predicted_preregsitration',
    active: true,
    name: 'AsPredicted Preregistration',
    schemaVersion: 2,
    // To avoid collision with mirage schema. Will be changed to 'schema' in serializer.
    formBlocks: [
        {
            blockType: 'page-heading',
            blockText: 'Page One',
            blockId: '1',
        },
        {
            blockType: 'section-heading',
            blockText: 'Existing Data',
            blockId: 'data',
        },
        {
            blockType: 'input label',
            blockText: 'Has any data been collected for this study already?',
            blockId: 'data',
        },
        {
            blockType: 'single-select input',
            blockId: 'data',
        },
        {
            blockType: 'single-select option',
            blockText: 'Yes, at least some data have been collected for this study already',
            blockId: 'data',
            value: 'yes',
        },
        {
            blockType: 'single-select option',
            blockText: 'No, no data have been collected for this study yet',
            blockId: 'data',
            value: 'no',
        },
        {
            blockType: 'section-heading',
            blockText: 'Hypothesis',
        },
        {
            blockType: 'input label',
            blockText: 'What is the main question being asked or hypothesis being tested in this study?',
            blockId: 'hypothesis',
        },
        {
            blockType: 'long-text input',
            blockId: 'hypothesis',
        },
        {
            blockType: 'section-heading',
            blockText: 'Dependent variables',
        },
        {
            blockType: 'input label',
            blockText: 'Describe the key dependent variable(s) specifying how they will be measured.',
            blockId: 'dependent',
        },
        {
            blockType: 'long-text input',
            blockId: 'dependent',
        },
        {
            blockType: 'section-heading',
            blockText: 'Analyses',
        },
        {
            blockType: 'input label',
            blockText: 'Specify exactly which analyses you will conduct to examine the main question/hypothesis.',
            blockId: 'analysis',
        },
        {
            blockType: 'long-text input',
            blockId: 'analysis',
        },
        {
            blockType: 'section-heading',
            blockText: 'More analyses',
        },
        {
            blockType: 'input label',
            blockText: 'Any secondary analyses?',
        },
        {
            blockType: 'long-text input',
        },
        {
            blockType: 'section-heading',
            blockText: 'Sample size',
        },
        {
            blockType: 'input label',
            blockText: 'How many observations will be collected or what will determine sample size? No need to justify decision, but be precise about exactly how the number will be determined.',
        },
        {
            blockType: 'long-text input',
        },
        {
            blockType: 'section-heading',
            blockText: 'Other',
        },
        {
            blockType: 'input label',
            blockText: 'Anything else you would like to pre-register? (e.g., data exclusions, variables collected for exploratory purposes, unusual analyses planned?',
        },
        {
            blockType: 'long-text input',
        },
    ],
    schemaNoConflict: {
        description: 'You will be asked to answer 8 questions about your study. This registration form uses the content recommended on the website AsPredicted.org.',
        title: 'AsPredicted Preregistration',
        version: 2,
        active: true,
        pages: [
            {
                id: 'page1',
                questions: [
                    {
                        description: 'Please choose',
                        format: 'singleselect',
                        qid: 'data',
                        title: 'Have any data been collected for this study already?',
                        nav: 'Data Collection',
                        type: 'choose',
                        options: [
                            'Yes, at least some data have been collected for this study already',
                            'No, no data have been collected for this study yet',
                        ],
                    },
                    {
                        qid: 'hypothesis',
                        format: 'textarea',
                        title: "What's the main question being asked or hypothesis being tested in this study?",
                        nav: 'Hypothesis',
                        type: 'string',
                    },
                    {
                        qid: 'dependent',
                        format: 'textarea',
                        title: 'Describe the key dependent variable(s) specifying how they will be measured.',
                        nav: 'Dependent variables',
                        type: 'string',
                    },
                    {
                        qid: 'conditions',
                        format: 'textarea',
                        title: 'How many and which conditions will participants be assigned to?',
                        nav: 'Conditions',
                        type: 'string',
                    },
                    {
                        qid: 'analyses',
                        format: 'textarea',
                        title: 'Specify exactly which analyses you will conduct to examine the main question/hypothesis.',
                        nav: 'Analyses',
                        type: 'string',
                    },
                    {
                        qid: 'analyses2',
                        format: 'textarea',
                        title: 'Any secondary analyses?',
                        nav: 'More analyses',
                        type: 'string',
                    },
                    {
                        qid: 'sample',
                        format: 'textarea',
                        title: 'How many observations will be collected or what will determine sample size? No need to justify decision, but be precise about exactly how the number will be determined.',
                        nav: 'Sample size',
                        type: 'string',
                    },
                    {
                        qid: 'other',
                        format: 'textarea',
                        title: 'Anything else you would like to pre-register? (e.g., data exclusions, variables collected for exploratory purposes, unusual analyses planned?)',
                        nav: 'Other',
                        type: 'string',
                    },
                ],
                title: 'AsPredicted Preregistration',
            },
        ],
        name: 'AsPredicted Preregistration',
    },
} as MirageRegistrationSchema;

/* eslint-enable max-len */
