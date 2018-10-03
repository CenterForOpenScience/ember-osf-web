import Controller from '@ember/controller';

export default class Application extends Controller {
}

declare module '@ember/controller' {
    interface Registry {
        'osf/application': Application;
    }
}
