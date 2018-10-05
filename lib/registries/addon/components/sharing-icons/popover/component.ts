import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Analytics from 'ember-osf-web/services/analytics';
import layout from './template';

export default class SharingIconsPopover extends Component {
    layout = layout;

    @service analytics!: Analytics;
    resultId?: string;
}
