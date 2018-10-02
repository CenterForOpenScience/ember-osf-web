import { attr } from '@ember-decorators/data';
import { Deserialized } from 'ember-osf-web/transforms/node-license';
import OsfModel from './osf-model';

export default class License extends OsfModel {
    @attr('fixstring') name!: string; // eslint-disable-line no-restricted-globals
    @attr('fixstring') text!: string;
    @attr('array') requiredFields!: Array<keyof Deserialized>;
}

declare module 'ember-data' {
    interface ModelRegistry {
        license: License;
    }
}
