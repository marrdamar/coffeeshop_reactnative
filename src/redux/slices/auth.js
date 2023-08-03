/* eslint-disable prettier/prettier */
const {createSlice} = require('@reduxjs/toolkit');

const initialState = {
  token: null,
  id: null,
  image: '',
  displayName: null,
  address: null,
  role: null,
  phone: null,
  isloading: false,
  isRejected: false,
  isFulfilled: false,
  err: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authLogin: (prevState, action) => {
      console.log(action.payload);
      return {
        ...prevState,
        token: action.payload.token,
        id: action.payload.dataUser.id,
        image: action.payload.dataUser.profile_image,
        displayName: action.payload.dataUser.display_name,
        address: action.payload.dataUser.address,
        role: action.payload.dataUser.roles_id,
        phone: action.payload.dataUser.phone_number,
      };
    },
    editProfile: (prevState, action) => {
      // console.log('PAYLOAD UPDATE', action.payload);
      return {
        ...prevState,
        image: action.payload.profile_image,
        displayName: action.payload.display_name,
        address: action.payload.address,
        // phone: action.payload.phone,
      };
    },
    editDeliveryAddress: (prevState, action) => {
      // console.log('PAYLOAD UPDATE', action.payload);
      return {
        ...prevState,
        displayName: action.payload.display_name,
        address: action.payload.address,
        phone: action.payload.phone_number,
      };
    },
    authLogout: () => {
      return initialState;
    },
  },
});

export const userAction = {...userSlice.actions};
export default userSlice.reducer;
