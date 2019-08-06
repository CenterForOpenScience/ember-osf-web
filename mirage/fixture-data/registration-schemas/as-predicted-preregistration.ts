/* eslint-disable max-len */
// tslint:disable:max-line-length

import { MirageRegistrationSchema } from '../../fixtures/registration-schemas';

export default {
    id: 'as_predicted_preregsitration',
    active: true,
    name: 'AsPredicted Preregistration',
    schemaVersion: 2,
    // To avoid collision with mirage schema. Will be changed to 'schema' in serializer.
    schemaBlocks: [
        {
            blockType: 'page-heading',
            displayText: 'Page One',
            id: '1',
        },
        {
            blockType: 'section-heading',
            displayText: 'Existing Data',
        },
        {
            blockType: 'single-select-input',
            displayText: 'Has any data been collected for this study already?',
            questionId: 'data',
            required: true,
        },
        {
            blockType: 'select-input-option',
            displayText: 'Yes, at least some data have been collected for this study already',
            questionId: 'data',
            id: 'data-yes',
        },
        {
            blockType: 'select-input-option',
            displayText: 'No, no data have been collected for this study yet',
            questionId: 'data',
            id: 'data-no',
        },
        {
            blockType: 'page-heading',
            displayText: 'Page Two',
            id: '2',
        },
        {
            blockType: 'section-heading',
            displayText: 'Hypothesis',
        },
        {
            blockType: 'long-text-input',
            displayText: 'What is the main question being asked or hypothesis being tested in this study?',
            questionId: 'hypothesis',
            id: 'hypothesis-input',
        },
        {
            blockType: 'section-heading',
            displayText: 'Dependent variables',
        },
        {
            blockType: 'long-text-input',
            questionId: 'dependent',
            displayText: 'Describe the key dependent variable(s) specifying how they will be measured.',
            id: 'dependent-input',
        },
        {
            blockType: 'section-heading',
            displayText: 'Analyses',
        },
        {
            blockType: 'long-text-input',
            displayText: 'Specify exactly which analyses you will conduct to examine the main question/hypothesis.',
            questionId: 'analysis',
            id: 'analysis-input',
        },
        {
            blockType: 'section-heading',
            displayText: 'More analyses',
        },
        {
            blockType: 'long-text-input',
            displayText: 'Any secondary analyses?',
            questionId: 'analyses2',
            id: 'analyses2-input',
        },
        {
            blockType: 'section-heading',
            displayText: 'Sample size',
        },
        {
            blockType: 'long-text-input',
            displayText: 'How many observations will be collected or what will determine sample size? No need to justify decision, but be precise about exactly how the number will be determined.',
            questionId: 'sample',
            id: 'sample-input',
        },
        {
            blockType: 'section-heading',
            displayText: 'Other',
        },
        {
            blockType: 'long-text-input',
            displayText: 'Anything else you would like to pre-register? (e.g., data exclusions, variables collected for exploratory purposes, unusual analyses planned?',
            questionId: 'other',
            id: 'other-input',
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
