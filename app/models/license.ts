import { attr } from '@ember-decorators/data';
import OsfModel from './osf-model';

export default class License extends OsfModel {
    @attr('fixstring') name; // eslint-disable-line no-restricted-globals
    @attr('fixstring') text;
    @attr('array') requiredFields;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'license': License;
    }
}
