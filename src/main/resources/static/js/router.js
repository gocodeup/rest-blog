import Home from "./views/Home.js";
import PostIndex from "./views/PostIndex.js";
import About from "./views/About.js";
import Error404 from "./views/Error404.js";
import Loading from "./views/Loading.js";
import Login from "./views/Login.js";
import LoginEvent from "./auth.js";

/**
 * Returns the route object for a specific route based on the given URI
 * @param URI
 * @returns {*}
 */
export default function router(URI) {
    const routes = {
        '/': {
            returnView: Home,
            state: {},
            uri: '/',
            title: 'Home',
            // TODO: flesh out auth
            requiresAuth: false
        },
        '/login': {
            returnView: Login,
            state: {},
            uri: '/login',
            title: "Login",
            requiresAuth: false,
            viewEvent: LoginEvent
        },
        '/posts': {
            returnView: PostIndex,
            state: {
                posts: '/api/posts'
            },
            uri: '/posts',
            title: 'All Posts',
            // TODO: flesh out auth
            requiresAuth: true
        },
        '/about': {
            returnView: About,
            state: {},
            uri: '/about',
            title: 'About',
            // TODO: flesh out auth
            requiresAuth: false
        },
        '/error': {
            returnView: Error404,
            state: {},
            uri: location.pathname,
            title: ' ERROR',
            // TODO: flesh out auth
            requiresAuth: false
        },
        '/loading': {
            returnView: Loading,
            state: {},
            uri: location.pathname,
            title: 'Loading...',
            // TODO: flesh out auth
            requiresAuth: false
        }
    };

    return routes[URI];
}

