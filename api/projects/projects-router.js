// !! Write your "projects" router here!
const projectsRouter = require('express').Router();

const Projects = require('./projects-model');
// ?? GET ==> /api/projects ==> Return array of projects
projectsRouter.get('/', (req, res) => {
	Projects.get()
		.then((projects) => {
			res.status(200).json(projects);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				message: 'The projects information could not be retrieved',
			});
		});
});

// ?? GET ==> /api/projects/:id ==> Return project with specified ID
projectsRouter.get('/:id', (req, res) => {
	Projects.get(req.params.id)
		.then((project) => {
			if (project) {
				res.status(200).json(project);
			} else {
				res.status(404).json({
					message: `The project with the specified ID (${req.params.id}) does not exist`,
				});
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				message: 'The project information could not be retrieved',
			});
		});
});

// ** GET ==> /api/projects/:id/actions ==> Return array of actions associated with specified project

// ?? POST ==> /api/projects ==> Return newly created project
projectsRouter.post('/', async (req, res) => {
	const project = req.body;

	if (!project.name || !project.description || !project.completed) {
		res.status(400).json({
			message:
				'Please provide name, description and completion data for the project',
		});
	} else {
		try {
			const newProject = await Projects.insert(project);
			res.status(201).json(newProject);
		} catch (err) {
			console.log(err);
			res.status(500).json({
				message:
					'There was an error while saving the project to the database',
			});
		}
	}
});

// ?? PUT ==> /api/projects/:id ==> Return updated project
projectsRouter.put('/:id', async (req, res) => {
	const { id } = req.params;
	const project = req.body;
	try {
		const updatedProject = await Projects.update(id, post);
		if (project) {
			res.status(200).json(updatedProject);
		} else if (
			!project.name ||
			!project.decription ||
			!project.completed
		) {
			res.status(400).json({
				message: `Please provide name, desription and completion data for the project`,
			});
		} else {
			res.status(404).json({
				message: `The project with the specified ID (${id}) does not exist`,
			});
		}
	} catch (err) {
		console.log(err);
		res.status.json({
			message: 'The project information could not be modified',
		});
	}
});

// ?? DELETE ==> /api/projects/:id ==> Return no response
projectsRouter.delete('/:id', (req, res) => {
	Projects.remove(req.params.id)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({
					message: 'The project has been deleted',
				});
			} else {
				res.status(404).json({
					message: `The project with the specified ID (${req.params.id}) does not exist`,
				});
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				message: 'The project copuld not be removed',
			});
		});
});

module.exports = projectsRouter;
