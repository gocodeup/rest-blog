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

    // change view to loading screen
    render(null, router('/loading'));

    let request = {
        headers: getAuthBearerTokenHeader()
    }
    fetchData(route.state, request).then((props) => {
        render(props, route);
    });
}



