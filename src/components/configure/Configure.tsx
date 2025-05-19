import { Link, Outlet, useRouterState } from "@tanstack/react-router";

const ConfigureScreen = () => {
  const { location } = useRouterState();
  const isRobotActive = location.pathname === "/configure";
  const isUserActive = location.pathname === "/configure/user";

  // const isRobotActive = useMatch({ from: "/configure", strict: true });
  // const isUserActive = useMatch({ from: "/configure/user", strict: true });

  return (
    <div className="h-[calc(100vh_-_64px)] flex flex-col bg-gray-100">
      <div className="px-4 py-4 flex justify-between items-cente w-screen border-b border-gray-200 bg-white shadow-lg">
        <h2 className="text-3xl font-bold">Configure</h2>
      </div>
      <div className="flex justify-center items-center w-screen flex-1  bg-gray-300 ">
        <div className="flex w-full h-full">
          <div className="w-[200px] bg-white">
            <ul>
              <li>
                <Link
                  to="/configure"
                  className={`block p-4 text-gray-700 ${isRobotActive ? " bg-gray-500 " : "hover:bg-gray-300"}`}
                >
                  Robot
                </Link>
              </li>
              <li>
                <Link
                  to="/configure/user"
                  className={`block p-4 text-gray-700 ${isUserActive ? " bg-gray-500 " : "hover:bg-gray-300"}`}
                >
                  User
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex-1 bg-gray-200">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigureScreen;
