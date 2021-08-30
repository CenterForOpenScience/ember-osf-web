/* eslint-disable max-len */
/* eslint-disable max-len */

import { MirageRegistrationSchema } from '../../fixtures/registration-schemas';

export default {
    id: 'replication_recipe_post_completion',
    active: true,
    name: 'Replication Recipe (Brandt et al., 2013): Post-Completion',
    schemaVersion: 2,
    // To avoid collision with mirage schema. Will be changed to 'schema' in serializer.
    schemaNoConflict: {
        description: 'Replication Recipe: Post-Completion: This registration form is intended for use upon completion of a replication study, as outlined by Brandt et al., "The Replication Recipe: What Makes for a Convincing Replication?" You will be asked to answer a series of questions about the outcomes of your replication and how they compare to the original study.',
        title: 'Replication Recipe (Brandt et al., 2013): Post-Completion',
        version: 2,
        active: true,
        pages: [
            {
                id: 'page1',
                questions: [
                    {
                        qid: 'item29',
                        format: 'text',
                        title: 'The finalized materials, procedures, analysis plan etc of the replication are registered here',
                        nav: 'Finalized materials',
                        type: 'string',
                    },
                ],
                title: 'Registering the Replication Attempt',
            },
            {
                id: 'page2',
                questions: [
                    {
                        qid: 'item30',
                        format: 'text',
                        title: 'The effect size of the replication is',
                        nav: 'Effect size',
                        type: 'string',
                    },
                    {
                        qid: 'item31',
                        format: 'text',
                        title: 'The confidence interval of the replication effect size is',
                        nav: 'Confidence interval',
                        type: 'string',
                    },
                    {
                        format: 'singleselect',
                        qid: 'item32',
                        title: 'The replication effect size is',
                        nav: 'Difference in effect size',
                        type: 'choose',
                        options: [
                            'significantly different from the original effect size',
                            'not significantly different from the original effect size',
                        ],
                    },
                    {
                        format: 'singleselect',
                        qid: 'item33',
                        title: 'I judge the replication to be a(n)',
                        nav: 'Outcome',
                        type: 'choose',
                        options: [
                            'success',
                            'informative failure to replicate',
                            'practical failure to replicate',
                            'inconclusive',
                        ],
                    },
                    {
                        qid: 'item34',
                        format: 'textarea',
                        title: 'I judge it so because',
                        nav: 'Outcome justification',
                        type: 'string',
                    },
                    {
                        qid: 'item35',
                        format: 'text',
                        title: 'Interested experts can obtain my data and syntax here',
                        nav: 'Expert followup',
                        type: 'string',
                    },
                    {
                        qid: 'item36',
                        format: 'text',
                        title: 'All of the analyses were reported in the report or are available here',
                        nav: 'Location of analyses',
                        type: 'string',
                    },
                    {
                        qid: 'item37',
                        format: 'textarea',
                        title: 'The limitations of my replication study are',
                        nav: 'Limitations',
                        type: 'string',
                    },
                ],
                title: 'Reporting the Replication',
            },
        ],
        name: 'Replication Recipe (Brandt et al., 2013): Post-Completion',
    },
} as MirageRegistrationSchema;

/* eslint-enable max-len */
