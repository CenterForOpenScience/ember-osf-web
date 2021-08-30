/* eslint-disable max-len */
/* eslint-disable max-len */

import { MirageRegistrationSchema } from '../../fixtures/registration-schemas';
import { schemaBlockIds } from '../schema-blocks/open-ended-registration';

export default {
    id: 'open_ended_registration',
    active: true,
    name: 'Open-Ended Registration',
    schemaVersion: 3,
    // To avoid collision with mirage schema. Will be changed to 'schema' in serializer.
    schemaNoConflict: {
        description: 'You will be asked to provide a narrative summary of what is contained in your project. There is no minimum character length. This registration form is not a valid submission for the Pre-registration Prize.',
        title: 'Open-Ended Registration',
        version: 2,
        active: true,
        pages: [
            {
                id: 'page1',
                questions: [
                    {
                        description: 'Provide a narrative summary of what is contained in this registration, or how it differs from prior registrations.',
                        format: 'textarea',
                        qid: 'summary',
                        title: 'Summary',
                        nav: 'Summary',
                        type: 'string',
                    },
                ],
                title: 'Summary',
            },
        ],
        name: 'Open-Ended Registration',
    },
    schemaBlockIds,
} as MirageRegistrationSchema;

/* eslint-enable max-len */
