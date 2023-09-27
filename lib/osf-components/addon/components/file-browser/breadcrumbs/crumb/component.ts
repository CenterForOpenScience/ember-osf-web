import Component from '@glimmer/component';
import config from 'ember-osf-web/config/environment';

export default class CrumbComponent extends Component {
    get assetPrefix() {
        return config.assetsPrefix;
    }
}
