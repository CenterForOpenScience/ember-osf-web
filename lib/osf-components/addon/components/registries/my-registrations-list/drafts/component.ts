import Component from '@glimmer/component';

export default class MyRegistrationsDraftListComponent extends Component {
    queryParam = {
        embed: [
            'provider',
            'registration_schema',
        ],
    };
}
