export default form => [].includes.call(form, document.activeElement) || form[0].focus();
