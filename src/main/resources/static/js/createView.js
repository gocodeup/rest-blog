import render from './render.js';
import router from './router.js';
import fetchData from "./fetchData.js";
import {getAuthBearerTokenHeader} from "./auth.js";

/**
 * Finds the correct route for a given view, builds a loading view, fetches data and builds the final rendered view.
 * @param URI
 */
export default function createView(URI) {

    let route = router(URI);

    // if route is invalid, return a 404 page
    if (!route) {
        render(null, router('/error'));
        return;
    }

    // unsecured views get rendered
    // TODO: requiresAuth will make more sense when we get to Create, Update, Delete functionality
    if (!route.requiresAuth) {
        renderOpenView(route);
        return;
    }

    // change view to loading screen
    render(null, router('/loading'));

    console.log("Header:")
    console.log(getAuthBearerTokenHeader());
    fetchData(route.state, getAuthBearerTokenHeader()).then((props) => {
        render(props, route);
    });
}

function renderOpenView(route) {
    render(null, router(
        route.uri
    ))

    if (route.viewEvent) {
        setTimeout(route.viewEvent, 500);
    }
}


