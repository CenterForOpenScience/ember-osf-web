// import { attr } from '@ember-decorators/data';
import OsfModel from './osf-model';

export default class UserAddonModel extends OsfModel {
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        userAddon: UserAddonModel;
    } // eslint-disable-line semi
}
