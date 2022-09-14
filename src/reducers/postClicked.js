/* Change to postClickedRecucer */

const postClicked = (state = false, action) => {
    switch (action.type) {
        case 'POST_CLICK':
            return !state;
        default:
            return state
    }
}

export default postClicked;