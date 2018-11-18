import Controller from '@ember/controller';

interface FakeNode {
    links: {
        html: string;
    };
}
export default class NewProjectNavigationModalController extends Controller {
    node: FakeNode = {
        links: {
            html: '/handbook/docs',
        },
    };
    shouldShowModal: boolean = false;
}
