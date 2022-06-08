import Component from '@glimmer/component';
import config from 'ember-get-config';

export default class CrumbComponent extends Component {
    get assetPrefix() {
        return config.assetsPrefix;
    }
}
