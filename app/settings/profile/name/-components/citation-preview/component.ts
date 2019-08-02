import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { and } from '@ember-decorators/object/computed';
import Component from '@ember/component';

import User from 'ember-osf-web/models/user';

@tagName('')
export default class CitationPreview extends Component {
    // Required Parameter
    user!: User;

    @and('user.givenName', 'user.familyName')
    shouldCite!: boolean;

    initials(names: string): string {
        const trimmedName = names.trim();
        return trimmedName
            .split(/\s+/)
            .map(upperCaseName => `${upperCaseName[0].toUpperCase()}.`)
            .filter(initial => initial.match(/^[a-z]/i))
            .join(' ');
    }

    suffix(suffix: string): string {
        let returnValue = suffix;
        const suffixLower = suffix.toLowerCase();
        if (['jr', 'sr'].includes(suffixLower)) {
            returnValue = `${suffix}.`;
            returnValue = suffixLower.charAt(0).toUpperCase() + suffixLower.slice(1);
        } else if (['ii', 'iii', 'iv', 'v'].includes(suffixLower)) {
            returnValue = suffixLower.toUpperCase();
        }
        return returnValue;
    }

    @computed('user.{familyName,givenName,middleNames,suffix}')
    get citeApa(): string {
        const currentUser = this.user;
        let cite = `${currentUser.familyName}, ${this.initials(currentUser.givenName)}`;
        if (currentUser.middleNames) {
            cite = `${cite} ${this.initials(currentUser.middleNames)}`;
        }
        if (currentUser.suffix) {
            cite = `${cite}, ${this.suffix(currentUser.suffix)}`;
        }
        if (!cite.endsWith('.')) {
            cite = `${cite}.`;
        }
        return cite;
    }

    @computed('user.{familyName,givenName,middleNames,suffix}')
    get citeMla() {
        const currentUser = this.user;
        let cite = `${currentUser.familyName}, ${currentUser.givenName}`;
        if (currentUser.middleNames) {
            cite = `${cite} ${this.initials(currentUser.middleNames)}`;
        }
        if (currentUser.suffix) {
            cite = `${cite}, ${this.suffix(currentUser.suffix)}`;
        }
        if (!cite.endsWith('.')) {
            cite = `${cite}.`;
        }
        return cite;
    }
}
