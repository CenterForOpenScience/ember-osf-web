import Controller from '@ember/controller';
import { alias, not } from '@ember/object/computed';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import BrandModel from 'ember-osf-web/models/brand';
import RegistrationModel from 'ember-osf-web/models/registration';
import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import RevisionModel from 'ember-osf-web/models/revision';
import Media from 'ember-responsive';

export default class EditRevisionController extends Controller {
    @service media!: Media;
    @service router!: RouterService;

    @not('media.isDesktop') showMobileView!: boolean;

    @alias('model.revision') revision?: RevisionModel;
    @alias('model.registration') registration?: RegistrationModel;
    @alias('model.provider') provider?: RegistrationProviderModel;
    @alias('model.provider.brand') brand?: BrandModel;
}
