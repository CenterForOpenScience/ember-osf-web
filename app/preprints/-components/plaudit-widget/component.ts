import Component from '@glimmer/component';
import config from 'ember-get-config';

export default class PlauditWidget extends Component {
    plauditWidgetUrl = config.PLAUDIT_WIDGET_URL;
}
