import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import config from 'ember-get-config';
import I18N from 'ember-i18n/services/i18n';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import layout from './template';

const { OSF: { url } } = config;

function getQuery(text: string) {
    return `${url}search/?q=${encodeURIComponent(text)}`;
}

interface SearchExample {
    link: string;
    text: string;
}

/**
 * @module ember-osf-web
 * @submodule components
 */

/**
 * Display a search dropdown as used in the OSF navbar
 *
 * Sample usage:
 * ```handlebars
 *   {{search-dropdown closeSearchAction=(action 'closeSearch')}}
 * ```
 * @class search-dropdown
 */
export default class SearchDropdown extends Component {
    layout = layout;
    styles = styles;

    @service analytics!: Analytics;
    @service i18n!: I18N;

    closeSearchAction?: () => void;

    isOpen: boolean = defaultTo(this.isOpen, false);
    query: string = defaultTo(this.query, '');

    searchExamples: SearchExample[] = [
        'repro*',
        'brian AND title:many',
        'tags:(psychology)',
    ].map(text => ({
        link: getQuery(text),
        text,
    }));

    @action
    search() {
        if (this.query) {
            window.location.href = getQuery(this.query);
        }
    }
}
