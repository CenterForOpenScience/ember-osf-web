import { belongsTo, Model } from 'ember-cli-mirage';
import { MirageExternalProvider } from './external-provider';

export interface MirageExternalRegistration {
    provider: MirageExternalProvider;
}

export default Model.extend({
    provider: belongsTo('external-provider'),
});
