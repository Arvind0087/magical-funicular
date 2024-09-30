import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import "simplebar/src/simplebar.css";
import "react-image-lightbox/style.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-quill/dist/quill.snow.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import { SettingsProvider } from "components/settings";
import "locales/i18n";
import "utils/mapboxgl";
import "assets/main.css";
import App from "App";
import { store } from "redux/store";

const persistor = persistStore(store);
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <HelmetProvider>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SettingsProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SettingsProvider>
      </PersistGate>
    </Provider>
  </HelmetProvider>
);
