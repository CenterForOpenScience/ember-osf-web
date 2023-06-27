import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';


export default class InstitutionSearchRoute extends Route {
    @service router!: RouterService;
}
