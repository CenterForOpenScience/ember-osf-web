import { faker, ModelInstance, Server } from 'ember-cli-mirage';
import SeedRandom from 'seedrandom';

import { GUID_ALPHABET } from 'ember-osf-web/const/guid-alphabet';
import { RegistrationMetadata, Schema } from 'ember-osf-web/models/registration-schema';

export function guid(referentType: string) {
    return (id: number) => {
        // Generate a pseudo-random guid
        const prng = new SeedRandom(`${referentType}-${id}`);

        const newGuid = Array.from(
            { length: 5 },
            () => GUID_ALPHABET[Math.floor(prng() * GUID_ALPHABET.length)],
        ).join('');

        return newGuid;
    };
}

export function guidAfterCreate(newObj: ModelInstance, server: Server) {
    server.schema.guids.create({
        id: newObj.id,
        referentType: newObj.modelName,
    });
}

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
                const value: RegistrationMetadata = { };
                question.properties.forEach(property => {
                    const answerQuestion = answerAllRequired && property.required ? true : faker.random.boolean();
                    value[property.id] = {
                        comments: [],
                        extra: [],
                        value: answerQuestion ? faker.lorem.sentence().replace('.', '') : '',
                    };
                });
                registrationMetadata[question.qid] = { comments: [], extra: [], value };
            } else {
                const answerQuestion = answerAllRequired && question.required ? true : faker.random.boolean();
                registrationMetadata[question.qid] = {
                    comments: [],
                    extra: [],
                    value: answerQuestion ? faker.lorem.sentence().replace('.', '') : '',
                };
            }
        }));
    return registrationMetadata;
}
