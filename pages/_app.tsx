import '../styles/globals.css'
import userReducer from '../state/state';
import { Provider } from 'react-redux'
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import {persistStore,persistReducer} from "redux-persist"
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "chatting-app",
  storage,
};
const persistedReducer = persistReducer(persistConfig, userReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});


let appPersistor=persistStore(store)
function MyApp({ Component, pageProps }) {




 return (
   <Provider store={store}>
<PersistGate loading={null} persistor={appPersistor}>

      <Component {...pageProps} />
</PersistGate>
   </Provider>

 )
 
 

 
}

export default MyApp
