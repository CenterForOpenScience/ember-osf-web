import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import CedarMetadataTemplateModel from 'ember-osf-web/models/cedar-metadata-template';
import AbstractNodeModel from 'ember-osf-web/models/abstract-node';
import FileModel from 'ember-osf-web/models/file';
import { tracked } from '@glimmer/tracking';

import OsfModel from './osf-model';


/**
 * CedarMetadataRecordModel
 *
 * @description The cedar metadata record model
 */
export default class CedarMetadataRecordModel extends OsfModel {
    @attr('object') metadata!: any;
    @attr('boolean') isPublished!: boolean;

    @tracked templateName!: string;

    @belongsTo('cedar-metadata-template', { inverse: null })
    template!: AsyncBelongsTo<CedarMetadataTemplateModel> | CedarMetadataTemplateModel;

    @belongsTo('base-file-item', { inverse: 'cedarMetadataRecords' , polymorphic: true })
    target!: (AsyncBelongsTo<AbstractNodeModel> | AbstractNodeModel) | (AsyncBelongsTo<FileModel> | FileModel);
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'cedar-metadata-record': CedarMetadataRecordModel;
    } // eslint-disable-line semi
}
