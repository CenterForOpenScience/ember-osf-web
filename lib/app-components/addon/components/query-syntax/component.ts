import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import I18N from 'ember-i18n/services/i18n';
import styles from './styles';
import layout from './template';

// Adapted from Ember-SHARE
export default class QuerySyntax extends Component {
    layout = layout;
    styles = styles;

    @service i18n!: I18N;
}
