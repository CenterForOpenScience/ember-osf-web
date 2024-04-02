import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-osf-web/config/environment';

export default class CrumbComponent extends Component {
    @service features!: Features;


    get assetPrefix() {
        return config.assetsPrefix;
    }

    get useGravyWaffle() {
        return this.features.isEnabled('gravy_waffle');
    }
}
