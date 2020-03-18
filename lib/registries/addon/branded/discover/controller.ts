import Controller from '@ember/controller';

import Brand from 'registries/services/brand';

import { inject as service } from '@ember/service';

export default class Discover extends Controller {
    @service brand!: Brand;
}
