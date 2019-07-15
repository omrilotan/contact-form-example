import send from './modules/send.mjs';
import autofocus from './modules/autofocus.mjs';
import formValidationListeners from './modules/form-validation-listeners.mjs';

const ATTR_DISABLED = 'x-disabled';
const SUCCESS_MESSAGE = 'Thanks! I\'ll get back to you!';

export default function enhanceForm({
	form,
	feedback,
	customAttributes: {
		disabled = ATTR_DISABLED,
		validationMessageAttr,
	} = {},
	successMessage = SUCCESS_MESSAGE,
}) {
	const originalTitle = feedback.textContent;

	form.addEventListener('submit', async event => {
		event.preventDefault();

		const { target } = event;

		if (target.getAttribute(disabled)) { return; }

		target.setAttribute(disabled, 'disabled');

		const error = await send(target);

		error
			? feed(error) || target.removeAttribute(disabled)
			: end(target)
		;
	});

	/**
	 * Replace the feedback message
	 * @param  {String} string
	 * @return undefined
	 */
	function feed(string = originalTitle) {
		[].forEach.call(
			feedback.childNodes || [],
			child => child.parentNode.removeChild(child)
		);

		feedback.appendChild(document.createTextNode(string));
		feedback.classList[
			[originalTitle, successMessage].includes(string)
				? 'remove'
				: 'add'
		]('error');

	}

	/**
	 * End the process successfully
	 * @return undefined
	 */
	function end(target) {
		feed(successMessage);
		target.classList.add('folded');
	}

	formValidationListeners(form, {
		validationMessageAttr: 'x-custom-validation-message',
		reset: feed
	});

	autofocus(form);
}
