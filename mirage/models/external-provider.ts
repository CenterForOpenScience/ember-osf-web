import { hasMany, Model } from 'ember-cli-mirage';
import { MirageExternalRegistration } from './external-registration';

export interface MirageExternalProvider {
    registrations: MirageExternalRegistration[];
}

export default Model.extend({
    registrations: hasMany('external-registration'),
});
