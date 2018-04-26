import config from 'ember-get-config';

const osfUrl = config.OSF.url;
const serviceLinks = {
    exploreActivity: `${osfUrl}explore/activity/`,
    meetingsHome: `${osfUrl}meetings/`,
    myProjects: `${osfUrl}myprojects/`,
    myQuickFiles: `${osfUrl}quickfiles/`,
    osfHome: osfUrl,
    osfSupport: `${osfUrl}support/`,
    preprintsDiscover: `${osfUrl}preprints/discover/`,
    preprintsHome: `${osfUrl}preprints/`,
    preprintsSubmit: `${osfUrl}preprints/submit/`,
    preprintsSupport: 'http://help.osf.io/m/preprints/',
    profile: `${osfUrl}profile/`,
    registriesDiscover: `${osfUrl}registries/discover/`,
    registriesHome: `${osfUrl}registries/`,
    registriesSupport: 'http://help.osf.io/m/registrations/',
    search: `${osfUrl}search/`,
    settings: `${osfUrl}settings/`,
    reviewsHome: `${osfUrl}reviews/`,
    institutionsLanding: `${osfUrl}institutions/`,
};

const osfServices = [
    {
        name: 'HOME',
        url: serviceLinks.osfHome,
    },
    {
        name: 'PREPRINTS',
        url: serviceLinks.preprintsHome,
    },
    {
        name: 'REGISTRIES',
        url: serviceLinks.registriesHome,
    },
    {
        name: 'MEETINGS',
        url: serviceLinks.meetingsHome,
    },
    {
        name: 'INSTITUTIONS',
        url: serviceLinks.institutionsLanding,
    },
];

export {
    serviceLinks,
    osfServices,
};
