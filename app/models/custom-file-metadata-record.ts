import { attr } from '@ember-data/model';
import CustomMetadataModel from 'ember-osf-web/models/custom-metadata';


export default class CustomFileMetadataRecordModel extends CustomMetadataModel {
    @attr('fixstring') title?: string;
    @attr('fixstring') description?: string;
    @attr('fixstring') resourceTypeGeneral?: string;
    @attr('fixstring') language?: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'custom-file-metadata-record': CustomFileMetadataRecordModel;
    } // eslint-disable-line semi
}
