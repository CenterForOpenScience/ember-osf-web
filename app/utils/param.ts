export default function param(params: Record<string, string>) {
    return Object.entries(params).map(
        entry => entry.map(comp => encodeURIComponent(comp)).join('='),
    ).join('&');
}

function deserializeQueryString(queryString: string): Record<string, string> {
    return queryString.split('&').reduce(
        (acc, q) => {
            if (q) {
                const [key, val] = q.split('=');
                acc[key] = val;
            }
            return acc;
        },
        {} as Record<string, string>,
    );
}

export function addQueryParam(url: string, key: string, value: string): string {
    const [path, queryString, fragment] = url.split(/\?|#/) as Array<string | undefined>;
    const queryParams = {
        ...deserializeQueryString(queryString || ''),
        [key]: value,
    };
    const newUrl = `${path}?${param(queryParams)}`;
    return fragment ? `${newUrl}#${fragment}` : newUrl;
}
