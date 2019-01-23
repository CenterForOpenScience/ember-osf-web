import { attr, belongsTo, hasMany } from '@ember-decorators/data';
import DS from 'ember-data';

import BaseFileItem from './base-file-item';
import FileModel from './file';
import NodeModel from './node';

export default class FileProviderModel extends BaseFileItem {
    @attr('fixstring') name!: string;
    @attr('string') path!: string;
    @attr('fixstring') provider!: string;

    @hasMany('file')
    files!: DS.PromiseManyArray<FileModel>;

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
