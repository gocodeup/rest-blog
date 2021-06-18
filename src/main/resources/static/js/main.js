import Home from './views/Home.js';
import Loading from './views/Loading.js';
import Error404 from './views/Error404.js';
import PostIndex from './views/PostIndex.js';
import About from './views/About.js';
import Navbar from './views/partials/Navbar.js';

const app = document.querySelector('#app');

/*

    MAKE IT DRY AND SOLID...

    1. Abstract each view function into a separate module
    2. Abstract partials
    3. Abstract buildView function
    4. Refactor createView function to break up
    5. Abstract router

 */

// =================== Routes

const routes = {
    '/': {
        buildView: Home,
        state: {}
    },
    '/posts': {
        buildView: PostIndex,
        state: {
            posts: '/api/posts',
            entities: '/api/entities'
        }
    },
    '/about': {
        buildView: About,
        state: {}
    }
};

// =================== Rendering the View

/**
 * Pushes the current URI to the URL bar and sets the HTML of the app div.
 * @param props - the data required for view rendering
 * @param URI - the route of the view
 * @param main - the view to generating callback function
 */
function buildView(props, URI, main) {
    history.pushState(props, null, URI);
    app.innerHTML = `${Navbar(null)} ${main(props)}`;
}

/**
 * Finds the correct route for a given view, builds a loading view, fetches data and builds the final rendered view.
 * @param URI
 */
function createView(URI) {
    const route = routes[URI];
    if (route === undefined) {
        buildView(null, URI, Error404);
        return;
    }
    buildView(null, location.pathname, Loading); // change view to loading screen
    // fetch data
    const promises = [];

    // =================== Fetching Data

    for (let pieceOfState of Object.keys(route.state)) {
        promises.push(fetch(route.state[pieceOfState]).then(res => res.json()));
    }
    Promise.all(promises).then(state => {
        const props = {};
        Object.keys(route.state).forEach((key, index) => {
            props[key] = state[index];
        });
        return props;
    }).then((props) => {
        buildView(props, URI, route.buildView);
    });

}

// =================== Page Load Generation

window.addEventListener('DOMContentLoaded', function() {
    createView(location.pathname);
});

// =================== Link Activation

document.addEventListener('click', e => {
    e.preventDefault();
    if (e.target.dataset['link'] !== undefined) {
        const URI = e.target.href.substring(location.origin.length);
        createView(URI);
    }
});