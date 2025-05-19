import { Link } from "@tanstack/react-router";
import Lottie from "react-lottie";
import NotFoundRobo from "./lottie/NotFoundRobo.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: NotFoundRobo,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh_-_64px)] bg-white">
      <div className="w-full flex justify-center items-center">
        <Lottie
          options={defaultOptions}
          isClickToPauseDisabled
          style={{ width: 500, maxHeight: "60vh" }}
        />
      </div>
      <Link to="/">
        <img src="./goBackHome.png" alt="Back to HOME" />
      </Link>
    </div>
  );
};

export default NotFound;
