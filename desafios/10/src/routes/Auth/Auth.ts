import { Request, Response, Router } from 'express';
import { checkSession } from "../../middlewares/Session/CheckSession";

// Session data definition
declare module 'express-session' {
	interface SessionData {
		user: string | undefined,
		admin: boolean | undefined
	}
}

// User type
type User = {
	[key: string]: String,
	user: String,
	password: String
};

// Users
const users: Array<User> = [
	{ user : 'admin', password : 'qwerty1234' }
];

// Endpoint router
const routes = Router();

// Routes definition
routes
	.get('/login', (request: Request, response: Response) => {
		response.render('login');
	})
	.post('/login', (request: Request, response: Response) => {
		const { username, password } = request.body;
		const user: User | undefined = users.find(({ user }) => user === username);
		if(typeof user !== 'undefined' && user.password === password) {
			request.session.user = username;
			request.session.admin = true;
			return response.redirect('/autenticado');
		}
		response.render('login', { error : true });
	})
	.get('/logout', (request: Request, response: Response) => {
		const user = request.session.user;
		request.session.destroy(err => {
			if(!err) return response.render('logout', { user });;
		});
	})
	.get('/autenticado', checkSession, (request: Request, response: Response) => {
		response.render('authenticated', { user : request.session.user });
	});

export default routes;