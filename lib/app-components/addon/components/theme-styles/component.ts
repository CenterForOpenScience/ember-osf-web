import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { Assets } from 'ember-osf-web/models/provider';
import Theme from 'ember-osf-web/services/theme';
import styles from './styles';
import layout from './template';

export default class ErrorPage extends Component {
    layout = layout;
    styles = styles;

    @service theme!: Theme;

    @alias('theme.provider.assets') assets!: Assets;
}
