import { attr } from '@ember-decorators/data';
import OsfModel from './osf-model';

export default class License extends OsfModel {
    @attr('fixstring') name!: string; // eslint-disable-line no-restricted-globals
    @attr('fixstring') text!: string;
    @attr('array') requiredFields!: string[];
}

declare module 'ember-data' {
    interface ModelRegistry {
        'license': License;
    }
}
