import Controller from '@ember/controller';

export default class NewHome extends Controller {
}

declare module '@ember/controller' {
    interface Registry {
        'new-home': NewHome;
    }
}
