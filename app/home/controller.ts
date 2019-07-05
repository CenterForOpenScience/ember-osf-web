import Controller from '@ember/controller';

export default class Home extends Controller {
}

declare module '@ember/controller' {
    interface Registry {
        home: Home;
    }
}
