const Actions = require('../actions/actions-model');
const Projects = require('../projects/projects-model');

// ** Actions middleware

function validateAction(req, res, next) {
	if (req.body && Object.keys(req.body).length > 1) {
		next();
	} else if (!req.body.description) {
		next({
			...Error(),
			status: 400,
			message: 'missing required description field',
		});
	} else if (!req.body.notes) {
		next({
			...Error(),
			status: 400,
			message: 'missing required notes field',
		});
	} else {
		next({ ...Error(), status: 400, message: 'missing action data' });
	}
}

async function validateActionId(req, res, next) {
	const { id } = req.params;
	try {
		const action = await Actions.get(id);
		if (action) {
			req.action = action;
			next();
		} else {
			next({ ...Error(), status: 404, message: 'invalid id' });
		}
	} catch (err) {
		next({ ...err, status: 500, message: 'error processing request' });
	}
}

module.exports = { validateAction, validateActionId };
