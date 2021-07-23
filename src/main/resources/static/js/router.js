import Home from "./views/Home.js";
import PostIndex from "./views/PostIndex.js";
import About from "./views/About.js";
import Error404 from "./views/Error404.js";
import Loading from "./views/Loading.js";
import Login from "./views/Login.js";
import fetchData from "./fetchData.js";

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
            viewEvent: addLoginEvent
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

let addLoginEvent = () => {
    document.querySelector("#login-btn").addEventListener("click", function () {
        let obj = {
            username: document.querySelector("#username").value,
            password: document.querySelector("#password").value,
            grant_type: 'password'
        }

        let request = {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa('rest-blog-client:secret')
            },
            body: `grant_type=${obj.grant_type}&username=${obj.username}&password=${obj.password}&client_id=rest-blog-client`
        };

        fetchData(
            {
                route: `/oauth/token`
            },
            request).then((data) => {
            localStorage.setItem("access_token", data.route['access_token']);
            localStorage.setItem("refresh_token", data.route['refresh_token']);
        });
    });
}