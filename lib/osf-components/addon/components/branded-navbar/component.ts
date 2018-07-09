import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Analytics from 'ember-osf-web/services/analytics';
import styles from './styles';
import layout from './template';

type ObjectType = 'collection' | 'preprint' | 'registration';

export default class BrandedNavbar extends Component {
    layout = layout;
    styles = styles;

    @service analytics!: Analytics;

    objectType: ObjectType = this.objectType;
}
