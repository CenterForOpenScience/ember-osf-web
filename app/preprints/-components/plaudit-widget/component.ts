import Component from '@glimmer/component';
import config from 'ember-osf-web/config/environment';

export default class PlauditWidget extends Component {
    plauditWidgetUrl = config.plauditWidgetUrl;
}
