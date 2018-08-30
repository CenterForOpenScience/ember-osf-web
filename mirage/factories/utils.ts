import { faker } from 'ember-cli-mirage';

import { RegistrationMetadata, Schema } from 'ember-osf-web/models/registration-schema';

export const guid = (id: number, type: string): string => {
    const numPart = String(id);
    const typPart = type.substr(0, 5 - numPart.length);
    return `${typPart}${numPart}`;
};

/**
 * Create registration metadata with a random number of questions answered.
 *
 * @param {Schema} schema - The schema to generate metadata for.
 * @param {boolean} answerAllRequired - Whether to ensure all required questions are answered.
 * @return {RegistrationMetadata}
 */
export function createRegistrationMetadata(schema: Schema, answerAllRequired = false) {
    const registrationMetadata: RegistrationMetadata = {};
    schema.pages.forEach(page =>
        page.questions.forEach(question => {
            if (question.type === 'object' && question.properties) {
                const value: { [k: string]: { value: string } } = {};
                question.properties.forEach(property => {
                    const answerQuestion = answerAllRequired && property.required ? true : faker.random.boolean();
                    value[property.id] = {
                        value: answerQuestion ? faker.lorem.sentence().replace('.', '') : '',
                    };
                });
                registrationMetadata[question.qid] = value;
            } else {
                const answerQuestion = answerAllRequired && question.required ? true : faker.random.boolean();
                registrationMetadata[question.qid] = {
                    value: answerQuestion ? faker.lorem.sentence().replace('.', '') : '',
                };
            }
        }));
    return registrationMetadata;
}
