import HOME_ROUTES from './home/routes';
import LOGIN_ROUTES from './auth/login/routes';
import REGISTRATION_ROUTES from './auth/registration/routes';
const routes = [
    ...HOME_ROUTES,
    ...LOGIN_ROUTES,
    ...REGISTRATION_ROUTES
]

export default routes;