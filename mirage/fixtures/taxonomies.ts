import Taxnonomy from 'ember-osf-web/models/taxonomy'

const taxonomies: Array<Partial<Taxnonomy>> = [
    {
        id: 'artsandhumanities',
        text: 'Arts and Humanities',
        path: 'bepress|Arts and Humanities',
        childCount: 1,
        parent: null,
        shareTitle: 'bepress',
    },
    {
        id: 'theatreandperformancestudies',
        text: 'Theatre and Performance Studies',
        path: 'bepress|Arts and Humanities|Theatre and Performance Studies',
        childCount: 1,
        parent: {
            id: 'artsandhumanities',
            text: 'Arts and Humanities',
        },
        shareTitle: 'bepress',
    },
    {
        id: 'actiong',
        text: 'Acting',
        path: 'bepress|Arts and Humanities|Theatre and Performance Studies|Action',
        childCount: 0,
        parent: {
            id: 'theatreandperformancestudies',
            text: 'Theatre and Performance Studies',
        },
        shareTitle: 'bepress',
    },
]

export default taxonomies;