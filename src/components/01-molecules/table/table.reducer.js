const ACTION_TYPES = {
  INIT: "init",
  HANDLE_CLICK: "handle-click",
  LOADING: "loading",
};

const initialState = {
  data: [],
  row: null,
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.INIT: {
      return {
        data: action.data,
        loading: false,
      };
    }
    case ACTION_TYPES.LOADING: {
      return {
        loading: true,
      };
    }

    default:
      state;
  }
}
