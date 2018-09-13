import Controller from '@ember/controller';
import { OSFService } from 'osf-components/components/osf-navbar/component';

export default class Application extends Controller {
    activeService = OSFService.REGISTRIES;
    searchRoute = 'registries.discover';
    supportRoute = 'http://help.osf.io/m/registrations/';
}
