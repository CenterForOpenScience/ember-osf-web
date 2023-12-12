import { attr } from '@ember-data/model';
import { Link } from 'jsonapi-typescript';
import { NormalLinks } from 'osf-api';

import OsfModel from './osf-model';

export interface FileVersionLinks extends NormalLinks {
    download?: Link;
    render?: Link;
}

export default class FileVersionModel extends OsfModel {
    @attr('number') size!: number;
    @attr('date') dateCreated!: Date;
    @attr('fixstring') contentType!: string;
    @attr('fixstring') name!: string;
    @attr() links!: FileVersionLinks;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'file-version': FileVersionModel;
    } // eslint-disable-line semi
}
