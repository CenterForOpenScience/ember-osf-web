import { attr } from '@ember-decorators/data';
import OsfModel from './osf-model';

export default class IdentifierModel extends OsfModel {
    @attr('fixstring') category!: string;
    @attr('fixstring') value!: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'identifier': IdentifierModel;
    } // eslint-disable-line semi
}
