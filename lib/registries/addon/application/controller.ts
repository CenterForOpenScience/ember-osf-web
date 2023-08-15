import Controller from '@ember/controller';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Features from 'ember-feature-flags/services/features';

export default class Application extends Controller {
    @service features!: Features;
    @service router!: RouterService;
}
