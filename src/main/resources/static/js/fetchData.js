/**
 * Given an object containing all the required data for a given page, fetch all the needed data and return it as properties to pass to a view.
 * @param state
 * @returns {Promise<{}>}
 */
export default function fetchData(state) {
    const promises = [];
    for (let pieceOfState of Object.keys(state)) {
        promises.push(fetch(state[pieceOfState]).then(res => res.json()));
    }
    return Promise.all(promises).then(propsData => {
        const props = {};
        Object.keys(state).forEach((key, index) => {
            props[key] = propsData[index];
        });
        return props;
    });
}