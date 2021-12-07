let ip;

fetch('https://httpbin.org/ip').then(res => res.json()).then(({ origin }) => { ip = origin }).catch(() => null);

/**
 * Send the form over http
 * @param  {HTMLFormElement} form
 * @return {String|undefined} Error message or nothing
 *
 * Prevent form's organic submit, and send it here, instead
 */
export default async function send(target) {
	try {
		const url = target.getAttribute('action');
		const method = target.getAttribute('method');
		const data = Object.assign(...[].map.call(
			target,
			({name, value}) => ({[name]: value})
		));

		ip && Object.assign(data, { ip });

		try {
			Object.assign(data, {
				browser: Object.values(navigator.userAgentData?.toJSON()?.brands?.pop()).join(':'),
				mobile: navigator.userAgentData?.mobile
			});
		} catch (error) { /* ignore */ }

		const result = await fetch(url, {
			method,
			mode: 'cors',
			body: JSON.stringify(data)
		});
		if (!result.ok) { return 'Oh geez, couldn\'t send the form. Maybe try again?'; }

		const { status } = await result.json();
		if (status !== 'success') { return `Form was sent but something went wrong along the way (status ${status}).`; }

		return undefined; // Success
	} catch (error) {
		return `Sending form failed with error: ${error.message}.`;
	}
}
