import { attr } from '@ember-data/model';

import ExternalServiceModel from './external-service';

export enum SupportedResourceTypes {
    AUDIOVISUAL = 'Audiovisual',
    AWARD = 'Award',
    BOOK = 'Book',
    BOOK_CHAPTER = 'BookChapter',
    COLLECTION = 'Collection',
    COMPUTATIONAL_NOTEBOOK = 'ComputationalNotebook',
    CONFERENCE_PAPER = 'ConferencePaper',
    CONFERENCE_PROCEEDING = 'ConferenceProceeding',
    DATA_PAPER = 'DataPaper',
    DATASET = 'Dataset',
    DISSERTATION = 'Dissertation',
    EVENT = 'Event',
    IMAGE = 'Image',
    INSTRUMENT = 'Instrument',
    INTERACTIVE_RESOURCE = 'InteractiveResource',
    JOURNAL = 'Journal',
    JOURNAL_ARTICLE = 'JournalArticle',
    MODEL = 'Model',
    OUTPUT_MANAGEMENT_PLAN = 'OutputManagementPlan',
    PEER_REVIEW = 'PeerReview',
    PHYSICAL_OBJECT = 'PhysicalObject',
    PREPRINT = 'Preprint',
    PROJECT = 'Project',
    REPORT = 'Report',
    SERVICE = 'Service',
    SOFTWARE = 'Software',
    SOUND = 'Sound',
    STANDARD = 'Standard',
    STUDY_REGISTRATION = 'StudyRegistration',
    TEXT = 'Text',
    WORKFLOW = 'Workflow',
    OTHER = 'Other',
}

export default class ExternalLinkServiceModel extends ExternalServiceModel {
    @attr('array') supportedResourceTypes!: SupportedResourceTypes[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'external-link-service': ExternalLinkServiceModel;
    } // eslint-disable-line semi
}
