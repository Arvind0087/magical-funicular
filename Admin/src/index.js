import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { store } from "redux/store";
import { SettingsProvider } from "components/settings/SettingsContext";
import App from "App";
import "simplebar/dist/simplebar.css";
import "react-quill/dist/quill.snow.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import "assets/main.css";
import SiteInfoMiddleWare from "layouts/Middleware/SiteInfoMiddleWare";
import ErrorMiddleWare from "layouts/Middleware/ErrorMiddleWare";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HelmetProvider>
    <Provider store={store}>
      <SiteInfoMiddleWare>
        <ErrorMiddleWare>
          <SettingsProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </SettingsProvider>
        </ErrorMiddleWare>
      </SiteInfoMiddleWare>
    </Provider>
  </HelmetProvider>
);
