import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import Component from '@ember/component';

import requiredAction from 'ember-osf-web/decorators/required-action';
import Token from 'ember-osf-web/models/token';

@tagName('') // No div
export default class TokenCard extends Component {
    // Required arguments
    token!: Token;
    @requiredAction deleted!: () => unknown;

    @action
    async delete() {
        // Not a task -- if this removes the component, still want to run the callback
        this.token.deleteRecord();
        await this.token.save();
        this.deleted();
    }
}
