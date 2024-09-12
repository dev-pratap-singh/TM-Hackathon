import { createStore } from 'redux';

// Define initial state
const initialState = {
  selectedOption: 'motor',
};

// Define reducer function
const reducer = (state = initialState, action: { type: any; payload: any; }) => {
  switch (action.type) {
    case 'SET_SELECTED_OPTION':
      return { ...state, selectedOption: action.payload };
    default:
      return state;
  }
};

// Create and export the store
const store = createStore(reducer);
export default store;
