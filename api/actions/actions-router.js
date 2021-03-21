// !! Write your "actions" router here!
const actionsRouter = require('express').Router();

const Actions = require('./actions-model');
// const Middleware = require('../middleware');

// ** Actions Endpoints

// ?? GET ==> /api/actions ==> Return array of actions
actionsRouter.get('/', (req, res) => {
	Actions.get()
		.then((actions) => {
			res.status(200).json(actions);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				message: 'The actions information could not be retrieved',
			});
		});
});

// ?? GET ==> /api/actions/:id ==> Return action with given id
actionsRouter.get('/:id', (req, res) => {
	Actions.get(req.params.id)
		.then((action) => {
			if (action) {
				res.status(200).json(action);
			} else {
				res.status(404).json({
					message: `The action with the specified ID (${req.params.id}) does not exist`,
				});
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				message: 'The actions information could not be retrieved',
			});
		});
});

// ?? POST ==> /api/actions ==> Return newly created action
actionsRouter.post('/', async (req, res) => {
	const action = req.body;

	if (!action.project_id || !action.description || !action.notes) {
		res.status(400).json({
			message: 'Please provide description and notes for the action',
		});
	} else {
		try {
			const newAction = await Actions.insert(action);
			res.status(201).json(newAction);
		} catch (err) {
			console.log(err);
			res.status(500).json({
				message:
					'There was an error while saving the action top the database',
			});
		}
	}
});

// ?? PUT ==> /api/actions/:id ==> Return updated action
actionsRouter.put('/:id', async (req, res) => {
	const { id } = req.params;
	const action = req.body;
	try {
		const updatedAction = await Actions.update(id, action);
		if (action) {
			res.status(200).json(updatedAction);
		} else if (
			!action.description ||
			!action.notes ||
			!action.completed
		) {
			res.status(400).json({
				message:
					'Please provide description, notes and completion for the action',
			});
		} else {
			res.status(404).json({
				message: `The action with the specified ID (${id}) does not exist`,
			});
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'The action information could not be modified',
		});
	}
});

// ?? DELETE ==> /api/actions/:id ==> Return no response
actionsRouter.delete('/:id', (req, res) => {
	Actions.remove(req.params.id)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({
					message: 'The action has been deleted',
				});
			} else {
				res.status(404).json({
					message: `The action with the specified ID ${req.params.id}) does not exist`,
				});
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				message: ' The action could not be removed',
			});
		});
});

module.exports = actionsRouter;
