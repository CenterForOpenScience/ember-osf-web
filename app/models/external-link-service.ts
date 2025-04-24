import { attr } from '@ember-data/model';

import ExternalServiceModel from './external-service';

export enum SupportedResourceTypes {
    AUDIOVISUAL = 'AUDIOVISUAL',
    AWARD = 'AWARD',
    BOOK = 'BOOK',
    BOOK_CHAPTER = 'BOOK_CHAPTER',
    COLLECTION = 'COLLECTION',
    COMPUTATIONAL_NOTEBOOK = 'COMPUTATIONAL_NOTEBOOK',
    CONFERENCE_PAPER = 'CONFERENCE_PAPER',
    CONFERENCE_PROCEEDING = 'CONFERENCE_PROCEEDING',
    DATA_PAPER = 'DATA_PAPER',
    DATASET = 'DATASET',
    DISSERTATION = 'DISSERTATION',
    EVENT = 'EVENT',
    IMAGE = 'IMAGE',
    INSTRUMENT = 'INSTRUMENT',
    INTERACTIVE_RESOURCE = 'INTERACTIVE_RESOURCE',
    JOURNAL = 'JOURNAL',
    JOURNAL_ARTICLE = 'JOURNAL_ARTICLE',
    MODEL = 'MODEL',
    OUTPUT_MANAGEMENT_PLAN = 'OUTPUT_MANAGEMENT_PLAN',
    PEER_REVIEW = 'PEER_REVIEW',
    PHYSICAL_OBJECT = 'PHYSICAL_OBJECT',
    PREPRINT = 'PREPRINT',
    PROJECT = 'PROJECT',
    REPORT = 'REPORT',
    SERVICE = 'SERVICE',
    SOFTWARE = 'SOFTWARE',
    SOUND = 'SOUND',
    STANDARD = 'STANDARD',
    STUDY_REGISTRATION = 'STUDY_REGISTRATION',
    TEXT = 'TEXT',
    WORKFLOW = 'WORKFLOW',
    OTHER = 'OTHER',
}

export default class ExternalLinkServiceModel extends ExternalServiceModel {
    @attr('array') supportedResourceTypes!: SupportedResourceTypes[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'external-link-service': ExternalLinkServiceModel;
    } // eslint-disable-line semi
}
