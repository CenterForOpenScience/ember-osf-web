import Route from '@ember/routing/route';
import WaffleRouteMixin from 'ember-osf-web/mixins/waffle-route';

export default class Dashboard extends Route.extend(WaffleRouteMixin).extend({
    waffleRouteFlag: 'ember_dashboard_page',
}) {}
