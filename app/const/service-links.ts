import config from 'ember-get-config';

const osfUrl = config.OSF.url;
const serviceLinks = {
    exploreActivity: `${osfUrl}explore/activity/`,
    meetingsHome: `${osfUrl}meetings/`,
    myProjects: `${osfUrl}myprojects/`,
    osfHome: osfUrl,
    osfSupport: `${osfUrl}support/`,
    preprintsDiscover: `${osfUrl}preprints/discover/`,
    preprintsHome: `${osfUrl}preprints/`,
    preprintsSubmit: `${osfUrl}preprints/submit/`,
    preprintsSupport: 'https://help.osf.io/article/376-preprints-home-page',
    profile: `${osfUrl}profile/`,
    registriesDiscover: `${osfUrl}registries/discover/`,
    registriesHome: `${osfUrl}registries/`,
    registriesSupport: 'https://help.osf.io/article/330-welcome-to-registrations',
    search: `${osfUrl}search/`,
    settings: `${osfUrl}settings/`,
    reviewsHome: `${osfUrl}reviews/`,
    institutionsLanding: `${osfUrl}institutions/`,
    collectionsHome: `${osfUrl}collections/`,
};

export {
    serviceLinks,
};
