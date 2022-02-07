import { ModelInstance, Server } from 'ember-cli-mirage';
import faker from 'faker';
import SeedRandom from 'seedrandom';

import { GUID_ALPHABET } from 'ember-osf-web/const/guid-alphabet';
import Guid from 'ember-osf-web/models/guid';
import { Answer, Question, RegistrationMetadata, Subquestion } from 'ember-osf-web/models/registration-schema';

import {
    FileReference, getSchemaBlockGroups, RegistrationResponse, SchemaBlockGroup,
} from 'ember-osf-web/packages/registration-schema';
import SchemaBlockModel from 'ember-osf-web/models/schema-block';
import { MirageRegistrationSchema } from './registration-schema';

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

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        guids: Guid;
    } // eslint-disable-line semi
}

export function guidAfterCreate(newObj: ModelInstance, server: Server) {
    server.schema.guids.create({
        id: newObj.id,
        referentType: newObj.modelName,
    });
}

const anonymizedQuestions = ['Authors'];

function fakeAnswer(question: Question | Subquestion, answerIfRequired: boolean): Answer<any> {
    const answer: Answer<any> = {
        comments: [],
        extra: [],
        value: '',
    };
    if (question.type === 'object' && question.properties) {
        const value: RegistrationMetadata = {};
        question.properties.forEach(property => {
            value[property.id] = fakeAnswer(property, answerIfRequired);
        });
        answer.value = value;
    } else if ((answerIfRequired && question.required) || faker.random.boolean()) {
        if (question.type === 'osf-upload') {
            const numFiles = faker.random.number({ min: 1, max: 5 });
            answer.extra = Array.from({ length: numFiles }).map(() => ({
                selectedFileName: faker.system.commonFileName(
                    faker.system.commonFileExt(),
                ),
                viewUrl: '/',
            }));
            answer.value = (answer.extra[0] as any).selectedFileName;
        } else if (question.type === 'choose' || question.type === 'multiselect') {
            if (question.format === 'singleselect') {
                answer.value = faker.random.arrayElement(question.options!);
            } else {
                answer.value = Array.from(
                    { length: faker.random.number({ min: 1, max: question.options!.length }) },
                    () => faker.random.arrayElement(question.options!),
                );
            }
            if (typeof answer.value !== 'string' && 'text' in answer.value) {
                answer.value = answer.value.text;
            }
        } else {
            answer.value = faker.lorem.sentences(faker.random.number({ min: 1, max: 10 }));
        }
    }
    return answer;
}

function fakeFileReference(): FileReference[] {
    const range = faker.random.number({ min: 1, max: 10 });
    return Array.from({ length: range }, () => (
        {
            file_id: faker.random.uuid(),
            file_name: faker.system.fileName(),
            file_urls: {
                html: faker.system.filePath(),
                download: faker.system.filePath(),
            },
            file_hashes: {
                sha256: faker.random.uuid(),
            },
        }
    ));
}

function fakeContributorList(): string {
    const range = faker.random.number({ min: 1, max: 10 });
    const contributors = Array.from({ length: range }, () => faker.name.findName());
    return contributors.join(', ');
}

function fakeMultiSelectInputResponse(group: SchemaBlockGroup): string[] {
    let optionValues = group.optionBlocks!.map(item => item.displayText);
    const range = faker.random.number({ min: 1, max: optionValues.length });
    return Array.from({ length: range }, () => {
        const randomValue = faker.random.arrayElement(optionValues);
        optionValues = optionValues.filter(item => item !== randomValue);
        return randomValue!;
    });
}

function fakeSingleSelectInputResponse(group: SchemaBlockGroup): string {
    const optionValues = group.optionBlocks!.map(item => item.displayText);
    return faker.random.arrayElement(optionValues)!;
}

/**
 * Create registration metadata with a random number of questions answered.
 *
 * @param {MirageRegistrationSchema} registrationsSchema - The registration schema to generate metadata for.
 * @param {boolean} answerAllRequired - Whether to ensure all required questions are answered.
 * @return {RegistrationMetadata}
 */
export function createRegistrationMetadata(
    registrationSchema: ModelInstance<MirageRegistrationSchema>,
    answerAllRequired = false,
    anonymized = false,
) {
    const registrationMetadata: RegistrationMetadata = {};
    if (registrationSchema.schemaNoConflict) {
        registrationSchema.schemaNoConflict.pages.forEach(page => page.questions.forEach(question => {
            if (anonymized && anonymizedQuestions.includes(question.title)) {
                return;
            }
            if (question.type === 'object' && question.properties) {
                const value: RegistrationMetadata = { };
                question.properties.forEach(property => {
                    value[property.id] = fakeAnswer(property, answerAllRequired);
                });
                registrationMetadata[question.qid] = {
                    comments: [],
                    extra: [],
                    value,
                };
            } else {
                registrationMetadata[question.qid] = fakeAnswer(question, answerAllRequired);
            }
        }));
    }
    return registrationMetadata;
}

/**
 * Create registrationResponse according to schemaBlocks
 */
export function createRegistrationResponses(
    registrationSchema: ModelInstance<MirageRegistrationSchema>,
) {
    const { schemaBlocks } = registrationSchema;
    // The strange type casting here is to silence TS linting errors
    // `getSchemaBlockGroups` was supposed take in the FE `SchemaBlockModel` as argument
    // Here it takes in a Mirage BE model, hence the type mismatch
    const schemaBlockGroups = getSchemaBlockGroups(schemaBlocks as unknown as SchemaBlockModel[]);
    const registrationResponses = {} as RegistrationResponse;
    if (schemaBlockGroups) {
        for (const group of schemaBlockGroups) {
            const { groupType, registrationResponseKey } = group;
            if (registrationResponseKey) {
                switch (groupType) {
                default:
                    break;
                case 'long-text-input':
                    registrationResponses[group.registrationResponseKey!] = faker.lorem.paragraph();
                    break;
                case 'short-text-input':
                    registrationResponses[group.registrationResponseKey!] = faker.lorem.sentence();
                    break;
                case 'file-input':
                    registrationResponses[group.registrationResponseKey!] = fakeFileReference();
                    break;
                case 'contributors-input':
                    registrationResponses[group.registrationResponseKey!] = fakeContributorList();
                    break;
                case 'single-select-input':
                    registrationResponses[group.registrationResponseKey!] = fakeSingleSelectInputResponse(group);
                    break;
                case 'multi-select-input':
                    registrationResponses[group.registrationResponseKey!] = fakeMultiSelectInputResponse(group);
                    break;
                }
            }
        }
        return registrationResponses;
    }
    return null;
}
