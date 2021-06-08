/* eslint-disable max-len */
/* eslint-disable max-len */

import { MirageRegistrationSchema } from '../../fixtures/registration-schemas';
import { schemaBlockIds } from '../schema-blocks/replication-recipe-pre-registration';

export default {
    id: 'replication_recipe_pre_registration',
    active: true,
    name: 'Replication Recipe (Brandt et al., 2013): Pre-Registration',
    schemaVersion: 2,
    // To avoid collision with mirage schema. Will be changed to 'schema' in serializer.
    schemaNoConflict: {
        description: 'This registration form is intended for use when conducting a replication. You will be asked a series of questions about the study you intend to replicate. This registration form is not a valid submission for the Pre-registration Prize.',
        title: 'Replication Recipe (Brandt et al., 2013): Pre-Registration',
        version: 2,
        active: true,
        pages: [
            {
                id: 'page1',
                questions: [
                    {
                        qid: 'item1',
                        format: 'textarea',
                        title: 'Verbal description of the effect I am trying to replicate',
                        nav: 'Effect description',
                        type: 'string',
                    },
                    {
                        qid: 'item2',
                        format: 'textarea',
                        title: 'It is important to replicate this effect because',
                        nav: 'Importance of replication',
                        type: 'string',
                    },
                    {
                        qid: 'item3',
                        format: 'text',
                        title: 'The effect size of the effect I am trying to replicate is',
                        nav: 'Original effect size',
                        type: 'string',
                    },
                    {
                        qid: 'item4',
                        format: 'text',
                        title: 'The confidence interval of the original effect is',
                        nav: 'Original confidence iterval',
                        type: 'string',
                    },
                    {
                        qid: 'item5',
                        format: 'text',
                        title: 'The sample size of the original effect is',
                        nav: 'Original sample size',
                        type: 'string',
                    },
                    {
                        qid: 'item6',
                        format: 'text',
                        title: 'Where was the original study conducted? (e.g., lab, in the field, online)',
                        nav: 'Original location',
                        type: 'string',
                    },
                    {
                        qid: 'item7',
                        format: 'text',
                        title: 'What country/region was the original study conducted in?',
                        nav: 'Country/Region',
                        type: 'string',
                    },
                    {
                        qid: 'item8',
                        format: 'text',
                        title: 'What kind of sample did the original study use? (e.g., student, Mturk, representative)',
                        nav: 'Original kind of sample',
                        type: 'string',
                    },
                    {
                        qid: 'item9',
                        format: 'text',
                        title: 'Was the original study conducted with paper-and-pencil surveys, on a computer, or something else?',
                        nav: 'Original survey format',
                        type: 'string',
                    },
                ],
                title: 'The Nature of the Effect',
            },
            {
                id: 'page2',
                questions: [
                    {
                        format: 'singleselect',
                        qid: 'item10',
                        title: 'Are the original materials for the study available from the author?',
                        nav: 'Materials available?',
                        type: 'choose',
                        options: [
                            'yes',
                            'no',
                        ],
                    },
                    {
                        qid: 'item11',
                        format: 'textarea',
                        title: 'I know that assumptions (e.g., about the meaning of the stimuli) in the original study will also hold in my replication because',
                        nav: 'Assumptions will hold',
                        type: 'string',
                    },
                    {
                        qid: 'item12',
                        format: 'textarea',
                        title: 'Location of the experimenter during data collection',
                        nav: 'Location of experimenter',
                        type: 'string',
                    },
                    {
                        qid: 'item13',
                        format: 'textarea',
                        title: 'Experimenter knowledge of participant experimental condition',
                        nav: 'Experimenter knowledge (condition)',
                        type: 'string',
                    },
                    {
                        qid: 'item14',
                        format: 'text',
                        title: 'Experimenter knowledge of overall hypotheses',
                        nav: 'Experimenter knowledge (hypothesis)',
                        type: 'string',
                    },
                    {
                        qid: 'item15',
                        format: 'text',
                        title: 'My target sample size is',
                        nav: 'Sample size',
                        type: 'string',
                    },
                    {
                        qid: 'item16',
                        format: 'text',
                        title: 'The rationale for my sample size is',
                        nav: 'Sample size rationale',
                        type: 'string',
                    },
                ],
                title: 'Designing the Replication Study',
            },
            {
                id: 'page3',
                questions: [
                    {
                        format: 'singleselect',
                        qid: 'item17',
                        title: 'The similarities/differences in the instructions are',
                        nav: 'Differences in instructions',
                        type: 'choose',
                        options: [
                            'Exact',
                            'Close',
                            'Different',
                        ],
                    },
                    {
                        format: 'singleselect',
                        qid: 'item18',
                        title: 'The similarities/differences in the measures are',
                        nav: 'Differences in measures',
                        type: 'choose',
                        options: [
                            'Exact',
                            'Close',
                            'Different',
                        ],
                    },
                    {
                        format: 'singleselect',
                        qid: 'item19',
                        title: 'The similarities/differences in the stimuli are',
                        nav: 'Differences in stimuli',
                        type: 'choose',
                        options: [
                            'Exact',
                            'Close',
                            'Different',
                        ],
                    },
                    {
                        format: 'singleselect',
                        qid: 'item20',
                        title: 'The similarities/differences in the procedure are',
                        nav: 'Differences in procedure',
                        type: 'choose',
                        options: [
                            'Exact',
                            'Close',
                            'Different',
                        ],
                    },
                    {
                        format: 'singleselect',
                        qid: 'item21',
                        title: 'The similarities/differences in the location (e.g., lab vs. online; alone vs. in groups) are',
                        nav: 'Differences in location',
                        type: 'choose',
                        options: [
                            'Exact',
                            'Close',
                            'Different',
                        ],
                    },
                    {
                        format: 'singleselect',
                        qid: 'item22',
                        title: 'The similarities/difference in remuneration are',
                        nav: 'Differences in remuneration',
                        type: 'choose',
                        options: [
                            'Exact',
                            'Close',
                            'Different',
                        ],
                    },
                    {
                        format: 'singleselect',
                        qid: 'item23',
                        title: 'The similarities/differences between participant populations are',
                        nav: 'Differences in populations',
                        type: 'choose',
                        options: [
                            'Exact',
                            'Close',
                            'Different',
                        ],
                    },
                    {
                        qid: 'item24',
                        format: 'textarea',
                        title: 'What differences between the original study and your study might be expected to influence the size and/or direction of the effect?',
                        nav: 'Expected differences',
                        type: 'string',
                    },
                    {
                        qid: 'item25',
                        format: 'textarea',
                        title: 'I have taken the following steps to test whether the differences listed in the previous question will influence the outcome of my replication attempt',
                        nav: 'Steps to test differences',
                        type: 'string',
                    },
                ],
                title: 'Documenting Differences between the Original and Replication Study',
            },
            {
                id: 'page4',
                questions: [
                    {
                        qid: 'item26',
                        format: 'textarea',
                        title: 'My exclusion criteria are (e.g., handling outliers, removing participants from analysis)',
                        nav: 'Exclusion criteria',
                        type: 'string',
                    },
                    {
                        qid: 'item27',
                        format: 'textarea',
                        title: 'My analysis plan is (justify differences from the original)',
                        nav: 'Analysis plan',
                        type: 'string',
                    },
                    {
                        qid: 'item28',
                        format: 'textarea',
                        title: 'A successful replication is defined as',
                        nav: 'Successful replication',
                        type: 'string',
                    },
                ],
                title: 'Analysis and Replication Evaluation',
            },
        ],
        name: 'Replication Recipe (Brandt et al., 2013): Pre-Registration',
    },
    schemaBlockIds,
} as MirageRegistrationSchema;

/* eslint-enable max-len */
