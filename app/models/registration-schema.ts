import { attr } from '@ember-decorators/data';

import OsfModel from './osf-model';

export interface AbstractQuestion {
    type: 'string' | 'multiselect' | 'osf-author-import' | 'osf-upload' | 'choose' | 'object';
    format: string;
    required?: boolean;
    description?: string;
    properties?: Subquestion[];
    options?: string[];
}

export interface Subquestion extends AbstractQuestion {
    id: string;
}

export interface Question extends AbstractQuestion {
    qid: string;
    title: string;
    nav: string;
    help?: string;
}

export interface Page {
    id: string;
    title: string;
    questions: Question[];
    type?: 'object';
    description?: string;
}

export interface Schema {
    name: string;
    title: string;
    version: number;
    active: boolean;
    config: {
        hasFiles: boolean;
    };
    pages: Page[];
    description: string;
}

export interface Answer<T> {
    value?: T;
    comments?: any[]; // String?
    extra?: object[];
}

export interface RegistrationMetadata {
    [qid: string]: Answer<string | string[] | boolean | RegistrationMetadata>;
}

export default class RegistrationSchemaModel extends OsfModel {
    @attr('boolean') active!: boolean;
    @attr('fixstring') name!: string;
    @attr('number') schemaVersion!: number;
    @attr('object') schema!: Schema;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'registration-schema': RegistrationSchemaModel;
    } // eslint-disable-line semi
}
