/* eslint-disable max-len */
/* eslint-disable max-len */

import { MirageRegistrationSchema } from '../../fixtures/registration-schemas';

export default {
    id: 'registered_report_protocol_preregistration.',
    active: true,
    name: 'Registered Report Protocol Preregistration',
    schemaVersion: 2,
    // To avoid collision with mirage schema. Will be changed to 'schema' in serializer.
    schemaNoConflict: {
        name: 'Registered Report Protocol Preregistration',
        title: 'Registered Report Protocol Preregistration',
        version: 2,
        active: true,
        config: {
            hasFiles: true,
        },
        pages: [
            {
                id: 'page1',
                questions: [
                    {
                        required: true,
                        description: 'Provide the working title of your study.',
                        format: 'text',
                        qid: 'q1',
                        title: 'Title',
                        nav: 'Title',
                        type: 'string',
                    },
                    {
                        required: true,
                        help: 'Jimmy Stewart, Ava Gardner, Bob Hope, Greta Garbo',
                        format: 'textarea',
                        qid: 'q2',
                        title: 'Authors',
                        nav: 'Authors',
                        type: 'osf-author-import',
                    },
                ],
                title: 'Study Information',
            },
            {
                id: 'page2',
                questions: [
                    {
                        title: 'In order to complete this registration your study must be granted an "in-principle acceptance" from a journal that offers Registered Reports.',
                        qid: 'q3',
                        required: true,
                        nav: 'In-principle acceptance?',
                        type: 'multiselect',
                        options: [
                            'I confirm this study has been granted in-principle acceptance.',
                        ],
                    },
                    {
                        required: true,
                        format: 'text',
                        qid: 'q4',
                        title: 'Journal title',
                        nav: 'Journal title',
                        type: 'string',
                    },
                    {
                        required: true,
                        description: 'Format: (YYYY-MM-DD)',
                        format: 'text',
                        qid: 'q5',
                        title: 'Date of in-principle acceptance',
                        nav: 'Date of acceptance',
                        type: 'string',
                    },
                ],
                title: 'Publication Information',
            },
            {
                id: 'page3',
                questions: [
                    {
                        required: true,
                        description: 'Please attach the manuscript that has been accepted for publication as a Registered Report.',
                        format: 'osf-upload-open',
                        qid: 'q6',
                        title: 'Attach manuscript',
                        nav: 'Manuscript',
                        type: 'osf-upload',
                    },
                ],
                title: 'Manuscript',
            },
            {
                id: 'page4',
                questions: [
                    {
                        description: 'Please attach any other files that were included in your submission. These may include analysis scripts, questionnaires, or other digital materials.',
                        format: 'osf-upload-open',
                        qid: 'q7',
                        title: 'Attach any supporting documents',
                        nav: 'Supporting documents',
                        type: 'osf-upload',
                    },
                    {
                        description: 'Please include any other relevant information. This may include the date of acceptance, the anticipated date of study completion, or other important information not covered in the manuscript.',
                        format: 'textarea',
                        qid: 'q8',
                        title: 'Other information',
                        nav: 'Other information',
                        type: 'string',
                    },
                ],
                title: 'Other',
            },
        ],
        description: 'You will be asked a few simple questions about your study and given the chance to attach your accepted manuscript to the form. Use this form after receiving an "in-principle acceptance" from a journal the offers the Registered Reports format. See https://cos.io/rr for more information. This form is not eligible for a Prereg Prize.',
    },
} as MirageRegistrationSchema;

/* eslint-enable max-len */
