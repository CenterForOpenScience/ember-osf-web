/* eslint-disable max-len */
/* eslint-disable max-len */

import { MirageRegistrationSchema } from '../../fixtures/registration-schemas';

export default {
    id: 'osf_standard_pre_data_collection_registration',
    active: true,
    name: 'OSF-Standard Pre-Data Collection Registration',
    schemaVersion: 2,
    // To avoid collision with mirage schema. Will be changed to 'schema' in serializer.
    schemaNoConflict: {
        description: 'You will be asked if data collection is underway and if you have looked at your data already. You will be provided an opportunity to post other comments about your project. This registration form is not a valid submission for the Pre-registration Prize.',
        title: 'OSF-Standard Pre-Data Collection Registration',
        version: 2,
        active: true,
        pages: [
            {
                id: 'page1',
                questions: [
                    {
                        description: 'Please choose',
                        format: 'singleselect',
                        qid: 'datacompletion',
                        title: 'Has data collection begun for this project?',
                        nav: 'Data Completion',
                        type: 'choose',
                        options: [
                            'No, data collection has not begun',
                            'Yes, data collection is underway or complete',
                        ],
                    },
                    {
                        description: 'Please choose',
                        format: 'singleselect',
                        qid: 'looked',
                        title: 'Have you looked at the data?',
                        nav: 'Looked at Data',
                        type: 'choose',
                        options: [
                            'Yes',
                            'No',
                        ],
                    },
                    {
                        qid: 'comments',
                        format: 'textarea',
                        title: 'Other Comments',
                        nav: 'Comments',
                        type: 'string',
                    },
                ],
                title: 'OSF-Standard Pre-Data Collection Registration',
            },
        ],
        name: 'OSF-Standard Pre-Data Collection Registration',
    },
} as MirageRegistrationSchema;

/* eslint-enable max-len */
