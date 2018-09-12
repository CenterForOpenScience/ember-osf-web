import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Analytics from 'ember-osf-web/services/analytics';
import layout from './template';

export default class RegistriesServiceList extends Component {
    layout = layout;

    @service analytics!: Analytics;
}
