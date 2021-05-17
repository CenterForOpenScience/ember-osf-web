import Component from '@glimmer/component';

export default class MyRegistrationsListRegistrationsComponent extends Component {
    queryParam = {
        filter: {
            parent: null,
        },
        embed: [
            'bibliographic_contributors',
            'provider',
            'registration_schema',
        ],
    };
}
