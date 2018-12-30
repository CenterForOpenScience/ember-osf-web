import { attr } from '@ember-decorators/data';

import OsfModel from './osf-model';

export default class FileVersionModel extends OsfModel {
    @attr('number') size!: number;
    @attr('date') dateCreated!: Date;
    @attr('fixstring') contentType!: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'file-version': FileVersionModel;
    } // eslint-disable-line semi
}
