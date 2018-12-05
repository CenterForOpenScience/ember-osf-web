import Component from '@ember/component';
import { layout } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

/**
 * Display a loading indicator.
 */
@layout(template, styles)
export default class LoadingIndicator extends Component {
    /**
     * Whether to use a dark color for use on lighter backgrounds.
     * Default: false
     */
    dark: boolean = defaultTo(this.dark, false);

    /**
     * Whether to use the inline loading icon.
     * Default: false
     */
    inline: boolean = defaultTo(this.inline, false);
}
