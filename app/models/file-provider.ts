import { attr, belongsTo, AsyncBelongsTo, hasMany, AsyncHasMany } from '@ember-data/model';
import { Link } from 'jsonapi-typescript';

import AbstractNodeModel from './abstract-node';
import BaseFileItem, { BaseFileLinks } from './base-file-item';
import DraftNodeModel from './draft-node';
import FileModel from './file';

export interface FileProviderLinks extends BaseFileLinks {
    storage_addons: Link; // eslint-disable-line camelcase
    download?: Link;
}

export default class FileProviderModel extends BaseFileItem {
    @attr() links!: FileProviderLinks;
    @attr('fixstring') name!: string;
    @attr('string') path!: string;
    @attr('fixstring') provider!: string;

    @belongsTo('file')
    rootFolder!: AsyncBelongsTo<FileModel> & FileModel;

    @hasMany('file', { inverse: 'parentFolder' })
    files!: AsyncHasMany<FileModel>;

    @belongsTo('abstract-node', { inverse: 'files', polymorphic: true })
    target!: (AsyncBelongsTo<AbstractNodeModel> & AbstractNodeModel) |
        (AsyncBelongsTo<DraftNodeModel> & DraftNodeModel);

    // BaseFileItem override
    isProvider = true;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'file-provider': FileProviderModel;
    } // eslint-disable-line semi
}
