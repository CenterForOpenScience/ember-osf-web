import { faker, ModelInstance, Server } from 'ember-cli-mirage';
import SeedRandom from 'seedrandom';

import { RegistrationMetadata, Schema } from 'ember-osf-web/models/registration-schema';

const GUID_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

export function guid(referentType: string) {
    return (id: number) => {
        // Generate a pseudo-random guid
        const prng = new SeedRandom(`${referentType}-${id}`);
        const chars = new Array(5).fill(undefined).map(
            () => GUID_CHARS[Math.floor(prng() * GUID_CHARS.length)],
        );
        return ''.concat(...chars);
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
