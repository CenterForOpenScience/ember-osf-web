import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import { Link } from 'jsonapi-typescript';

import BaseFileItem, { BaseFileLinks } from './base-file-item';
import DraftNodeModel from './draft-node';
import FileModel from './file';
import NodeModel from './node';

export interface FileProviderLinks extends BaseFileLinks {
    storage_addons: Link; // eslint-disable-line camelcase
}

export default class FileProviderModel extends BaseFileItem {
    @attr() links!: FileProviderLinks;
    @attr('fixstring') name!: string;
    @attr('string') path!: string;
    @attr('fixstring') provider!: string;

    @belongsTo('file')
    rootFolder!: AsyncBelongsTo<FileModel>;

    @belongsTo('abstract-node', { polymorphic: true })
    target!: AsyncBelongsTo<NodeModel> | AsyncBelongsTo<DraftNodeModel>;

    // BaseFileItem override
    isProvider = true;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'file-provider': FileProviderModel;
    } // eslint-disable-line semi
}
