import { faker, ModelInstance, Server } from 'ember-cli-mirage';

import { RegistrationMetadata, Schema } from 'ember-osf-web/models/registration-schema';

const GUID_CHARS = '23456789abcdefghjkmnpqrstuvwxyz'.split('');

// Implementation of Java's String.hashCode -- https://stackoverflow.com/a/7616484/
function hashString(str: string): number {
    /* eslint-disable no-bitwise */
    /* tslint:disable no-bitwise */
    return Array.prototype.reduce.call(
        str,
        (hash: number, char: string) => (((hash << 5) - hash) + char.charCodeAt(0)) | 0,
        0,
    );
    /* tslint:enable no-bitwise */
    /* eslint-enable no-bitwise */
}

export function guid(referentType: string) {
    return (id: number) => {
        // Seed faker to guarantee consistent guids across page reloads
        faker.seed(hashString(`${referentType}-${id}`));

        const newGuid = Array.from(
            { length: 5 },
            () => faker.random.arrayElement(GUID_CHARS),
        ).join('');

        // Reseed so all other data is appropriately random
        faker.seed(new Date().getTime() % 1000000000);

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
