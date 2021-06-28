import Store from '@ember-data/store';
import Component from '@ember/component';
import { inject as service } from '@ember/service';

import { requiredAction } from 'ember-osf-web/decorators/component';
import Token from 'ember-osf-web/models/token';

export default class TokenForm extends Component {
    // Required arguments
    @requiredAction onSave!: (token: Token) => void;

    // Optional arguments
    token?: Token; // If not provided, new token created by validated-model-form
    disabled?: boolean;

    // Private properties
    @service store!: Store;

    allScopes = this.store.findAll('scope');
}
