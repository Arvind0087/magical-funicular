import { Suspense } from "react";
import LoadingScreen from "../loading-screen/LoadingScreen";

export const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
