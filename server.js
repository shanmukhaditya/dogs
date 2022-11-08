import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import koaBody from 'koa-body';
import axios from 'axios';
import views from 'koa-views';
import path from 'path';
import { fileURLToPath } from 'url';
import dogBreeds from './breeds.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = new Koa();
const router = new Router();
const port = 3011;

app.use(cors({ origin: '*' }));

app.use(views(path.join(__dirname, '/public'), { extension: 'ejs' }))

//Get request to fetch the images
router.get('/', async (ctx) => {
	console.log(ctx.request.query.breed);
	var requestStatus;
	var breed = ctx.request.query.breed;
	var data = { 'message': [] }
	var message;

	if(breed) {
		console.log(`https://dog.ceo/api/breed/${breed.replace('-', '/')}/images`);
		const resp = await axios.get(`https://dog.ceo/api/breed/${breed.replace('-', '/')}/images`)
			.catch((error) => {
				if (error.response) { 
					console.log(error.response.status + " " + error.response.data); 
					requestStatus = error.response.status;
					message = `${requestStatus} - Photos not found for the breed`;
				}
			});
		if(resp){
			data = resp.data;
			requestStatus = resp.status;
		}
	}

	console.log(requestStatus + " " + breed );

	await ctx.render('index', { requestStatus: requestStatus, 
								breed: breed,
								images: data.message ? data.message : [],
								dropdown: dogBreeds,
								message:message 
							});

})

app.use(async (ctx, next) => {
	await next();
	const rt = ctx.response.get('X-Response-Time');
	console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(async (ctx, next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(router.routes());

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
