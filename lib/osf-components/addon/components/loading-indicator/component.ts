import Component from '@ember/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import layout from './template';

/**
 * Display a loading indicator.
 */
export default class LoadingIndicator extends Component {
    /**
     * Whether to use a dark color for use on lighter backgrounds.
     * Default: false
     */
    dark: boolean = defaultTo(this.dark, false);

    /**
     * @ignore
     */
    layout = layout;

    /**
     * @ignore
     */
    styles = styles;
}
