const app = document.querySelector('#app');

/*

    MAKE IT DRY AND SOLID...

    1. Abstract each view function into a separate module
    2. Abstract partials
    3. Abstract buildView function
    4. Refactor createView function to break up
    5. Abstract router

 */

// =================== Views

function returnHomePage(props) {
    return `
        <header>
            <h1>Home Page</h1>
        </header>
        <main>
            <div>
                <p>
                    This is the home page text.
                </p>    
            </div>
        </main>
    `;
}

function returnLoadingPage() {
    return `<h1>Loading...</h1>`;
}

function return404Page(props) {
    return `<h1>404 ERROR</h1>`
}

function returnPostsPage(props) {
    return `
        <header>
            <h1>Posts Page</h1>
        </header>
        <main>
            <div>
                ${props.posts.map(post => `<h3>${post.title}</h3>`).join('')}   
            </div>
        </main>
    `;
}

function returnAboutPage(props) {
    return `
        <header>
            <h1>About Page</h1>
        </header>
        <main>
            <div>
                <p>About page is here.</p>  
            </div>
        </main>
    `;
}

// =================== Fragments

const navbar = `
    <nav>
        <a href="/" data-link>Home</a>
        <a href="/posts" data-link>Posts</a>
        <a href="/about" data-link>About</a>
    </nav>
`;

// =================== Routes

const routes = {
    '/': {
        buildView: returnHomePage,
        state: {}
    },
    '/posts': {
        buildView: returnPostsPage,
        state: {
            posts: '/api/posts',
            entities: '/api/entities'
        }
    },
    '/about': {
        buildView: returnAboutPage,
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
    app.innerHTML = `${navbar} ${main(props)}`;
}

/**
 * Finds the correct route for a given view, builds a loading view, fetches data and builds the final rendered view.
 * @param URI
 */
function createView(URI) {
    const route = routes[URI];
    if (route === undefined) {
        buildView(null, URI, return404Page);
        return;
    }
    buildView(null, location.pathname, returnLoadingPage); // change view to loading screen
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