import { createSlice,configureStore } from "@reduxjs/toolkit";

type userObj={
  
        user: null | Object,
        token: null | String,
        messages: [] ,
        errorMsg: null| String,
        isError: false | Boolean,
        successMsg: null | String,
        receiverMail:null|String
        // allComments: [],
        // postComments:[]
      
}

const initialState:userObj = {
  user: null,
  token: null,
  messages: [],
  errorMsg: null,
  isError: false,
  successMsg: null,
  receiverMail:null
  // allComments: [],
  // postComments:[]
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogOut: (state) => {
      state.user = null;
      state.token = null;
      state.errorMsg = null;
      state.isError = false;
      state.messages = [];
      state.receiverMail=null
    },
    setReceiverMail:(state,action)=>{
      state.receiverMail=action.payload.email
    },
    setError: (state, action) => {
      state.errorMsg = action.payload.errorMsg;
    },
    setSuccessMsg: (state, action) => {
      state.successMsg = action.payload.successMsg;
    },
    setIsError: (state) => {
      state.isError = true;
    },
    setNotIsError: (state) => {
      state.isError = false;
    },
    setMessages: (state, action) => {
      state.messages = action.payload.messages;
    },
    // setAllComments: (state, action) => {
    //   state.allComments=action.payload.comments

    // },
    // setPostComments:(state,action)=>{
    //   const { comments, postId } = action.payload;
    //   const filteredComments = comments.filter(
    //     (comment: any) => comment.post_id === postId
    //   );
    //   state.postComments = filteredComments;

    // }
  },
});

export const {
  setLogin,
  setLogOut,
  setError,
  setIsError,
  setNotIsError,
  setMessages,
  setSuccessMsg,
  setReceiverMail
  // setAllComments,
  // setPostComments,
} = authSlice.actions;
export default authSlice.reducer;

