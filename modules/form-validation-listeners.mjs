const ATTR_VALIDATION_MESSAGE = 'x-custom-validation-message';

export default (form, {
	validationMessageAttr = ATTR_VALIDATION_MESSAGE,
	reset = () => null
}) => [].forEach.call(
	form,
	input => {
		input.addEventListener(
			'invalid',
			({target}) => target.setCustomValidity(
				target.validity.valid
					? ''
					: [
						target.validity.valueMissing && 'This is a required field.',
						target.getAttribute(validationMessageAttr)
					].filter(Boolean).join(' ')
			)
		);
		input.addEventListener(
			'input',
			function removeFeedback({target}) {
				reset();
				target.setCustomValidity('');
			}
		);
	}
);
