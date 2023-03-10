import { attr } from '@ember-data/model';
import CustomMetadataModel from 'ember-osf-web/models/custom-metadata';

export interface Funder {
    funder_name?: string;
    funder_identifier?: string;
    funder_identifier_type?: string;
    award_number?: string;
    award_uri?: string;
    award_title?: string;
    funder_type?: string;
}

export default class CustomFileMetadataRecordModel extends CustomMetadataModel {
    @attr('fixstring') creatorType?: string;
    @attr('fixstring') dataType?: string;
    @attr('fixstring') description?: string;
    @attr('fixstring') funderName?: Funder['funder_name'];
    @attr('fixstring') language?: string;
    @attr('fixstring') modifiedDate?: string;
    @attr('fixstring') publishedDate?: string;
    @attr('fixstring') title?: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'custom-file-metadata-record': CustomFileMetadataRecordModel;
    } // eslint-disable-line semi
}
