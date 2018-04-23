import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import config from 'ember-get-config';
import defaultTo from 'ember-osf-web/utils/default-to';

const { OSF: { url } } = config;

function getQuery(text) {
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
    @service analytics;
    @service i18n;

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
