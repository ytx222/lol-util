const key = '46jUsQph3cgNHjzKT2sfow:14840';

const [s, p] = key.split(':');

export let baseUrl = `https://riot:${s}@127.0.0.1:${p}`;

export function updateBaseUrl(url:string) {
	baseUrl = url;
}
