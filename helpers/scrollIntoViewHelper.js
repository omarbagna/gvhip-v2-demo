export const scrollIntoViewHelper = (errors) => {
	console.log(errors);
	const firstError = Object.keys(errors)[0];
	let el = document.querySelector(`[name="${firstError}"]`);

	if (el) {
		el.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	}
};
