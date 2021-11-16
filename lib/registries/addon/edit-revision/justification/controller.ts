import Controller from '@ember/controller';
import { alias, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';

import RevisionManager from 'registries/edit-revision/revision-manager';
import SchemaResponseModel from 'ember-osf-web/models/schema-response';

export default class EditRevisionJustification extends Controller {
    @service media!: Media;

    @alias('model.revisionManager') revisionManager?: RevisionManager;
    @alias('revisionManager.revision') revision?: SchemaResponseModel;

    @not('revision') loading!: boolean;
    @not('media.isDesktop') showMobileView!: boolean;
}
