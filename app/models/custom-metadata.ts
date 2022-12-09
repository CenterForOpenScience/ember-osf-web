import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import GuidModel from 'ember-osf-web/models/user';

import OsfModel from './osf-model';

export const resourceTypeGeneralOptions = [
    'Audiovisual',
    'Book',
    'BookChapter',
    'Collection',
    'ComputationalNotebook',
    'ConferencePaper',
    'ConferenceProceeding',
    'DataPaper',
    'Dataset',
    'Dissertation',
    'Event',
    'Image',
    'InteractiveResource',
    'Journal',
    'JournalArticle',
    'Model',
    'OutputManagementPlan',
    'PeerReview',
    'PhysicalObject',
    'Preprint',
    'Report',
    'Service',
    'Software',
    'Sound',
    'Standard',
    'Text',
    'Workflow',
    'Other',
];

export default class CustomMetadataModel extends OsfModel {
    @attr('fixstring') resourceTypeGeneral?: string;

    @belongsTo('guid', { inverse: 'customMetadata' })
    guid!: AsyncBelongsTo<GuidModel> & GuidModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'custom-metadata': CustomMetadataModel;
    } // eslint-disable-line semi
}
