import { attr } from '@ember-decorators/data';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule models
 */

interface Q {
    type: 'string' | 'multiselect' | 'osf-author-import' | 'osf-upload' | 'choose' | 'object';
    required?: boolean;
    description?: string;
    properties?: Subquestion[];
}

export interface Subquestion extends Q {
    id: string;
}

export interface Question extends Q {
    qid: string;
    format: string;
    title: string;
    nav: string;
}

export interface Page {
    id: string;
    title: string;
    questions: Question[];
}

export interface Schema {
    name: string; // eslint-disable-line no-restricted-globals
    title: string;
    version: number;
    active: boolean;
    config: {
        hasFiles: boolean;
    };
    pages: Page[];
    description: string;
}

export interface Answer {
    value?: string;
}

export interface Answers {
    [id: string]: Answer;
}

export interface RegistrationMetadata {
    [qid: string]: Answer | Answers;
}

/**
 * Model for OSF APIv2 rgsitration schemas.
 * This model describes registration schemas and can be directly queried.
 *
 * @class RegistrationSchema
 */
export default class RegistrationSchema extends OsfModel {
    @attr('fixstring') name!: string; // eslint-disable-line no-restricted-globals
    @attr('number') schemaVersion!: number;
    @attr('object') schema!: Schema;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'registration-schema': RegistrationSchema;
    }
}
