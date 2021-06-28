/* eslint-disable max-len */
/* eslint-disable max-len */

import { MirageRegistrationSchema } from '../../fixtures/registration-schemas';

export default {
    id: 'pre_registration_in_social_psychology',
    active: true,
    name: "Pre-Registration in Social Psychology (van 't Veer & Giner-Sorolla, 2016): Pre-Registration",
    schemaVersion: 2,
    // To avoid collision with mirage schema. Will be changed to 'schema' in serializer.
    schemaNoConflict: {
        name: "Pre-Registration in Social Psychology (van 't Veer & Giner-Sorolla, 2016): Pre-Registration",
        title: "Pre-Registration in Social Psychology (van 't Veer & Giner-Sorolla, 2016): Pre-Registration",
        version: 2,
        active: true,
        config: {
            hasFiles: true,
        },
        pages: [
            {
                description: "For any required question that does not apply to your study put 'N/A' in the space for the relevant field. See van 't Veer & Giner-Sorolla (2016) or https://osf.io/56g8e/ for additional information.",
                id: 'page1-essential',
                questions: [
                    {
                        qid: 'description-hypothesis',
                        type: 'object',
                        properties: [
                            {
                                description: 'Describe the (numbered) hypotheses in terms of directional relationships between your (manipulated or measured) variables.',
                                required: true,
                                type: 'string',
                                id: 'question1a',
                                format: 'textarea-xl',
                            },
                            {
                                description: 'For interaction effects, describe the expected shape of the interactions.',
                                required: true,
                                type: 'string',
                                id: 'question2a',
                                format: 'textarea',
                            },
                            {
                                description: 'If you are manipulating a variable, make predictions for successful check variables or explain why no manipulation check is included.',
                                required: true,
                                type: 'string',
                                id: 'question3a',
                                format: 'textarea',
                            },
                        ],
                        title: 'Description of essential elements',
                    },
                ],
                title: 'A. Hypotheses - Essential elements',
            },
            {
                description: "For any required question that does not apply to your study put 'N/A' in the space for the relevant field. See van 't Veer & Giner-Sorolla (2016) or https://osf.io/56g8e/ for additional information.",
                id: 'page1-recommended',
                questions: [
                    {
                        qid: 'recommended-hypothesis',
                        type: 'object',
                        properties: [
                            {
                                description: 'A figure or table may be helpful to describe complex interactions; this facilitates correct specification of the ordering of all group means.',
                                type: 'osf-upload',
                                id: 'question4a',
                                format: 'osf-upload-open',
                            },
                            {
                                description: 'For original research, add rationales or theoretical frameworks for why a certain hypothesis is tested.',
                                type: 'string',
                                id: 'question5a',
                                format: 'textarea-lg',
                            },
                            {
                                description: 'If multiple predictions can be made for the same IV-DV combination, describe what outcome would be predicted by which theory.',
                                type: 'string',
                                id: 'question6a',
                                format: 'textarea',
                            },
                        ],
                        title: 'Recommended elements',
                    },
                ],
                title: 'Recommended elements',
            },
            {
                description: "For any required question that does not apply to your study put 'N/A' in the space for the relevant field. See van 't Veer & Giner-Sorolla (2016) or https://osf.io/56g8e/ for additional information.",
                id: 'page2-essential',
                questions: [
                    {
                        qid: 'description-methods',
                        type: 'object',
                        properties: [
                            {
                                description: 'Design',
                                type: 'object',
                                id: 'design',
                                properties: [
                                    {
                                        description: 'List, based on your hypotheses from section A:\n\nIndependent variables with all their levels\n    a. whether they are within- or between-participant\n    b. the relationship between them (e.g., orthogonal, nested).',
                                        required: true,
                                        id: 'question2a',
                                        format: 'textarea-lg',
                                    },
                                    {
                                        description: 'List dependent variables, or variables in a correlational design',
                                        required: true,
                                        type: 'string',
                                        id: 'question2b',
                                        format: 'textarea-xl',
                                    },
                                    {
                                        description: 'Third variables acting as covariates or moderators.',
                                        required: true,
                                        type: 'string',
                                        id: 'question3b',
                                        format: 'textarea',
                                    },
                                ],
                            },
                            {
                                description: 'Planned Sample',
                                type: 'object',
                                id: 'planned-sample',
                                properties: [
                                    {
                                        description: 'If applicable, describe pre-selection rules.',
                                        required: true,
                                        type: 'string',
                                        id: 'question4b',
                                        format: 'textarea',
                                    },
                                    {
                                        description: 'Indicate where, from whom and how the data will be collected.',
                                        required: true,
                                        type: 'string',
                                        id: 'question5b',
                                        format: 'textarea',
                                    },
                                    {
                                        description: 'Justify planned sample size',
                                        required: true,
                                        type: 'string',
                                        id: 'question6b',
                                        format: 'textarea',
                                    },
                                    {
                                        description: 'If applicable, you can upload a file related to your power analysis here (e.g., a protocol of power analyses from G*Power, a script, a screenshot, etc.).',
                                        required: false,
                                        type: 'osf-upload',
                                        id: 'question6b-upload',
                                        format: 'osf-upload-toggle',
                                    },
                                    {
                                        description: 'Describe data collection termination rule.',
                                        required: true,
                                        type: 'string',
                                        id: 'question7b',
                                        format: 'textarea',
                                    },
                                ],
                            },
                            {
                                description: 'Exclusion Criteria',
                                type: 'object',
                                id: 'exclusion-criteria',
                                properties: [
                                    {
                                        description: 'Describe anticipated specific data exclusion criteria. For example:\n\n    a) missing, erroneous, or overly consistent responses;\n    b) failing check-tests or suspicion probes;\n    c) demographic exclusions;\n    d) data-based outlier criteria;\n    e) method-based outlier criteria (e.g. too short or long response times).',
                                        required: true,
                                        type: 'string',
                                        id: 'question8b',
                                        format: 'textarea',
                                    },
                                ],
                            },
                            {
                                description: 'Procedure',
                                type: 'object',
                                id: 'procedure',
                                properties: [
                                    {
                                        description: 'Describe all manipulations, measures, materials and procedures including the order of presentation and the method of randomization and blinding (e.g., single or double blind), as in a published Methods section.',
                                        required: true,
                                        type: 'string',
                                        id: 'question10b',
                                        format: 'textarea-xl',
                                    },
                                ],
                            },
                        ],
                        title: 'Description of essential elements',
                    },
                ],
                title: 'B. Methods - Essential elements',
            },
            {
                description: "For any required question that does not apply to your study put 'N/A' in the space for the relevant field. See van 't Veer & Giner-Sorolla (2016) or https://osf.io/56g8e/ for additional information.",
                id: 'page2-recommended',
                questions: [
                    {
                        qid: 'recommended-methods',
                        type: 'object',
                        properties: [
                            {
                                description: 'Procedure',
                                type: 'object',
                                id: 'procedure',
                                properties: [
                                    {
                                        description: 'Set fail-safe levels of exclusion at which the whole study needs to be stopped, altered, and restarted. You may pre-determine what proportion of excluded participants will cause the study to be stopped and restarted.',
                                        type: 'string',
                                        id: 'question9b',
                                        format: 'textarea',
                                    },
                                    {
                                        description: 'If applicable, you can upload any files related to your methods and procedure here (e.g., a paper describing a scale you are using, experimenter instructions, etc.)',
                                        type: 'osf-upload',
                                        id: 'question9b-file',
                                        format: 'osf-upload-toggle',
                                    },
                                ],
                            },
                        ],
                        title: 'Recommended elements',
                    },
                ],
                title: 'Recommended elements',
            },
            {
                description: "For any required question that does not apply to your study put 'N/A' in the space for the relevant field. See van 't Veer & Giner-Sorolla (2016) or https://osf.io/56g8e/ for additional information.",
                id: 'page3-essential',
                questions: [
                    {
                        qid: 'confirmatory-analyses-first',
                        type: 'object',
                        properties: [
                            {
                                description: 'Describe the analyses that will test the first main prediction from the hypotheses section. Include:',
                                type: 'object',
                                id: 'first',
                                properties: [
                                    {
                                        description: 'the relevant variables and how they are calculated;',
                                        required: true,
                                        type: 'string',
                                        id: 'question1c',
                                        format: 'textarea-lg',
                                    },
                                    {
                                        description: 'the statistical technique;',
                                        required: true,
                                        type: 'string',
                                        id: 'question2c',
                                        format: 'textarea',
                                    },
                                    {
                                        description: 'each variable’s role in the technique (e.g., IV, DV, moderator, mediator, covariate);',
                                        required: true,
                                        type: 'string',
                                        id: 'question3c',
                                        format: 'textarea',
                                    },
                                    {
                                        description: 'rationale for each covariate used, if any;',
                                        required: true,
                                        type: 'string',
                                        id: 'question4c',
                                        format: 'textarea',
                                    },
                                    {
                                        description: 'if using techniques other than null hypothesis testing (for example, Bayesian statistics), describe your criteria and inputs toward making an evidential conclusion, including prior values or distributions.',
                                        required: true,
                                        type: 'string',
                                        id: 'question5c',
                                        format: 'textarea',
                                    },
                                ],
                            },
                        ],
                        title: 'Confirmatory Analyses',
                    },
                    {
                        qid: 'confirmatory-analyses-second',
                        type: 'object',
                        properties: [
                            {
                                description: 'Describe the analyses that will test the second main prediction from the hypotheses section. Include:',
                                type: 'object',
                                id: 'second',
                                properties: [
                                    {
                                        description: 'the relevant variables and how they are calculated;',
                                        type: 'string',
                                        id: 'question1c',
                                        format: 'textarea-lg',
                                    },
                                    {
                                        description: 'the statistical technique;',
                                        type: 'string',
                                        id: 'question2c',
                                        format: 'textarea',
                                    },
                                    {
                                        description: 'each variable’s role in the technique (e.g., IV, DV, moderator, mediator, covariate);',
                                        type: 'string',
                                        id: 'question3c',
                                        format: 'textarea',
                                    },
                                    {
                                        description: 'rationale for each covariate used, if any;',
                                        type: 'string',
                                        id: 'question4c',
                                        format: 'textarea',
                                    },
                                    {
                                        description: 'if using techniques other than null hypothesis testing (for example, Bayesian statistics), describe your criteria and inputs toward making an evidential conclusion, including prior values or distributions.',
                                        type: 'string',
                                        id: 'question5c',
                                        format: 'textarea',
                                    },
                                ],
                            },
                        ],
                        title: 'Second Prediction',
                    },
                    {
                        qid: 'confirmatory-analyses-third',
                        type: 'object',
                        properties: [
                            {
                                description: 'Describe the analyses that will test the third main prediction from the hypotheses section. Include:',
                                type: 'object',
                                id: 'third',
                                properties: [
                                    {
                                        description: 'the relevant variables and how they are calculated;',
                                        type: 'string',
                                        id: 'question1c',
                                        format: 'textarea-lg',
                                    },
                                    {
                                        description: 'the statistical technique;',
                                        type: 'string',
                                        id: 'question2c',
                                        format: 'textarea',
                                    },
                                    {
                                        description: 'each variable’s role in the technique (e.g., IV, DV, moderator, mediator, covariate);',
                                        type: 'string',
                                        id: 'question3c',
                                        format: 'textarea',
                                    },
                                    {
                                        description: 'rationale for each covariate used, if any;',
                                        type: 'string',
                                        id: 'question4c',
                                        format: 'textarea',
                                    },
                                    {
                                        description: 'if using techniques other than null hypothesis testing (for example, Bayesian statistics), describe your criteria and inputs toward making an evidential conclusion, including prior values or distributions.',
                                        type: 'string',
                                        id: 'question5c',
                                        format: 'textarea',
                                    },
                                ],
                            },
                        ],
                        title: 'Third Prediction',
                    },
                    {
                        qid: 'confirmatory-analyses-fourth',
                        type: 'object',
                        properties: [
                            {
                                description: 'Describe the analyses that will test the fourth main prediction from the hypotheses section. Include:',
                                type: 'object',
                                id: 'fourth',
                                properties: [
                                    {
                                        description: 'the relevant variables and how they are calculated;',
                                        type: 'string',
                                        id: 'question1c',
                                        format: 'textarea-lg',
                                    },
                                    {
                                        description: 'the statistical technique;',
                                        type: 'string',
                                        id: 'question2c',
                                        format: 'textarea',
                                    },
                                    {
                                        description: 'each variable’s role in the technique (e.g., IV, DV, moderator, mediator, covariate);',
                                        type: 'string',
                                        id: 'question3c',
                                        format: 'textarea',
                                    },
                                    {
                                        description: 'rationale for each covariate used, if any;',
                                        type: 'string',
                                        id: 'question4c',
                                        format: 'textarea',
                                    },
                                    {
                                        description: 'if using techniques other than null hypothesis testing (for example, Bayesian statistics), describe your criteria and inputs toward making an evidential conclusion, including prior values or distributions.',
                                        type: 'string',
                                        id: 'question5c',
                                        format: 'textarea',
                                    },
                                ],
                            },
                        ],
                        title: 'Fourth Prediction',
                    },
                    {
                        qid: 'confirmatory-analyses-further',
                        type: 'object',
                        properties: [
                            {
                                description: 'Describe the analyses that will test any further (main) predictions from the hypotheses section. Include:',
                                type: 'object',
                                id: 'further',
                                properties: [
                                    {
                                        description: 'the relevant variables and how they are calculated;',
                                        type: 'string',
                                        id: 'question1c',
                                        format: 'textarea-lg',
                                    },
                                    {
                                        description: 'the statistical technique;',
                                        type: 'string',
                                        id: 'question2c',
                                        format: 'textarea',
                                    },
                                    {
                                        description: 'each variable’s role in the technique (e.g., IV, DV, moderator, mediator, covariate);',
                                        type: 'string',
                                        id: 'question3c',
                                        format: 'textarea',
                                    },
                                    {
                                        description: 'rationale for each covariate used, if any;',
                                        type: 'string',
                                        id: 'question4c',
                                        format: 'textarea',
                                    },
                                    {
                                        description: 'if using techniques other than null hypothesis testing (for example, Bayesian statistics), describe your criteria and inputs toward making an evidential conclusion, including prior values or distributions.',
                                        type: 'string',
                                        id: 'question5c',
                                        format: 'textarea',
                                    },
                                ],
                            },
                        ],
                        title: 'Further Predictions',
                    },
                ],
                title: 'C. Analysis plan - Essential elements',
            },
            {
                description: "For any required question that does not apply to your study put 'N/A' in the space for the relevant field. See van 't Veer & Giner-Sorolla (2016) or https://osf.io/56g8e/ for additional information.",
                id: 'page3-recommended',
                questions: [
                    {
                        qid: 'recommended-analysis',
                        required: false,
                        type: 'object',
                        properties: [
                            {
                                description: 'Specify contingencies and assumptions, such as:',
                                required: false,
                                type: 'object',
                                id: 'specify',
                                properties: [
                                    {
                                        description: 'Method of correction for multiple tests.',
                                        type: 'string',
                                        id: 'question6c',
                                        format: 'textarea',
                                    },
                                    {
                                        description: 'The method of missing data handling (e.g., pairwise or listwise deletion, imputation, interpolation).',
                                        type: 'string',
                                        id: 'question7c',
                                        format: 'textarea',
                                    },
                                    {
                                        description: 'Reliability criteria for item inclusion in scale.',
                                        type: 'string',
                                        id: 'question8c',
                                        format: 'textarea',
                                    },
                                    {
                                        description: 'Anticipated data transformations.',
                                        type: 'string',
                                        id: 'question9c',
                                        format: 'textarea',
                                    },
                                    {
                                        description: 'Assumptions of analyses, and plans for alternative/corrected analyses if each assumption is violated.',
                                        type: 'string',
                                        id: 'question10c',
                                        format: 'textarea',
                                    },
                                    {
                                        description: 'Optionally, upload any files here that are related to your analyses (e.g., syntaxes, scripts, etc.).',
                                        type: 'osf-upload',
                                        id: 'question11c',
                                        format: 'osf-upload-toggle',
                                    },
                                ],
                            },
                        ],
                        title: 'Recommended Elements',
                    },
                ],
                title: 'Recommended elements',
            },
            {
                description: "For any required question that does not apply to your study put 'N/A' in the space for the relevant field. See van 't Veer & Giner-Sorolla (2016) or https://osf.io/56g8e/ for additional information.",
                id: 'page4',
                questions: [
                    {
                        required: true,
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
                        required: true,
                        description: 'Please choose',
                        format: 'singleselect',
                        qid: 'looked',
                        title: 'If data collection has begun, have you looked at the data?',
                        nav: 'Looked at Data',
                        type: 'choose',
                        options: [
                            'Yes',
                            'No',
                        ],
                    },
                    {
                        qid: 'dataCollectionDates',
                        format: 'textarea',
                        title: 'The (estimated) start and end dates for this project are',
                        nav: 'Data collection period',
                        type: 'string',
                    },
                    {
                        qid: 'additionalComments',
                        format: 'textarea',
                        title: 'Any additional comments before I pre-register this project',
                        nav: 'Additional comments',
                        type: 'string',
                    },
                ],
                title: 'Final questions',
            },
        ],
        description: "This registration form is intended for use when conducting a pre-registration. You will be asked to fill out the elements for a pre-registration as described in: van 't Veer & Giner-Sorolla (2016). This preregistration form is not a valid submission for the Pre-registration Prize.",
    },
} as MirageRegistrationSchema;

/* eslint-enable max-len */
