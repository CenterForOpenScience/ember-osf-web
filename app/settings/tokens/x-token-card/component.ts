import Component from '@ember/component';
import { task } from 'ember-concurrency';

import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import requiredAction from 'ember-osf-web/decorators/required-action';
import Token from 'ember-osf-web/models/token';

@localClassNames('TokenCard')
export default class TokenCard extends Component.extend({
    deleteTask: task(function *(this: TokenCard) {
        yield this.token.destroyRecord();
        this.deleted();
    }).drop(),
}) {
    // Required arguments
    token!: Token;
    @requiredAction deleted!: () => unknown;
}
