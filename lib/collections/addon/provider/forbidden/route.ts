import Forbidden from '../../forbidden/route';

export default class ProviderForbidden extends Forbidden {
    controllerName = 'forbidden';
    templateName = 'forbidden';
}
