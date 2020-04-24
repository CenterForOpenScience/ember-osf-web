import DS from 'ember-data';
import { Link } from 'jsonapi-typescript';

import BaseFileItem, { BaseFileLinks } from './base-file-item';
import FileModel from './file';
import NodeModel from './node';

export interface FileProviderLinks extends BaseFileLinks {
    storage_addons: Link; // eslint-disable-line camelcase
}

const { attr, belongsTo } = DS;

export default class FileProviderModel extends BaseFileItem {
    @attr() links!: FileProviderLinks;

    @attr('fixstring') name!: string;

    @attr('string') path!: string;

    @attr('fixstring') provider!: string;

    @belongsTo('file')
    rootFolder!: DS.PromiseObject<FileModel> & FileModel;

    @belongsTo('node')
    node!: DS.PromiseObject<NodeModel> & NodeModel;

    // BaseFileItem override
    isProvider = true;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'file-provider': FileProviderModel;
    } // eslint-disable-line semi
}
