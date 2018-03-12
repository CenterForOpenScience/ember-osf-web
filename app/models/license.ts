import DS from 'ember-data';
import OsfModel from './osf-model';

const { attr } = DS;

export default class License extends OsfModel.extend({
    name: attr('fixstring'),
    text: attr('fixstring'),
    requiredFields: attr('array'),
}) {}

declare module 'ember-data' {
    interface ModelRegistry {
        'license': License;
    }
}
