import {createSlice} from "@reduxjs/toolkit"

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        suggestedUsers:[],
        userProfile:null,
        selectedUser:null,
        following:[],
        followers:[],
    },
    reducers:{
        // actions
        setAuthUser:(state,action) => {
            state.user = action.payload;
        },
        setSuggestedUsers:(state,action) => {
            state.suggestedUsers = action.payload;
        },
        setUserProfile:(state,action) => {
            state.userProfile = action.payload;
        },
        setSelectedUser:(state,action) => {
            state.selectedUser = action.payload;
        },
        setFollowers: (state, action) => {
            if (state.user) {
              state.user.followers = action.payload;
            }
          },
          setFollowing: (state, action) => {
            if (state.user) {
              state.user.following = action.payload;
            }
    }
}});
export const {
    setAuthUser, 
    setSuggestedUsers, 
    setUserProfile,
    setSelectedUser,
    setFollowers,
    setFollowing,
} = authSlice.actions;
export default authSlice.reducer;