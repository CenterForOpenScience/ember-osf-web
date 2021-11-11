import Component from '@ember/component';

import { tagName } from '@ember-decorators/component';
import { layout } from 'ember-osf-web/decorators/component';

import { assert } from '@ember/debug';
import DraftRegistrationModel from 'ember-osf-web/models/draft-registration';
import { PageManager } from 'ember-osf-web/packages/registration-schema/page-manager';
import SchemaResponseModel from 'ember-osf-web/models/schema-response';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class PageRenderer extends Component {
    // Required param
    pageManager!: PageManager;
    draftRegistration?: DraftRegistrationModel;
    revision?: SchemaResponseModel;

    init() {
        super.init();
        assert('A pageManager is needed for page-renderer', Boolean(this.pageManager));
        assert('A draftRegistration xor a revision is needed for page-renderer',
            Boolean(this.draftRegistration) !== Boolean(this.revision));
    }
}
