import Component from '@glimmer/component';
import config from 'ember-osf-web/config/environment';


interface Args {
    instanceObject: any;
    templateObject: any;
}

export default class CedarMetadataRenderer extends Component<Args> {
    config = config.cedarConfig.viewerConfig;
}
