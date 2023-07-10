import { DashboardSVG, DocumentationSVG, HistorySVG, UsersDownSVG, UsersSVG } from "./SvgComponents";

const AppSidebar = () => {
  return (
    <div className="bg-gray-50 dark:bg-slate-900 sm:display-none">

      <div
        id="application-sidebar-dark"
        className="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 left-0 bottom-0 z-[60] w-64 bg-gray-900 border-r border-gray-800 pt-7 pb-10 overflow-y-auto scrollbar-y lg:block lg:translate-x-0 lg:right-auto lg:bottom-0"
      >
        <div className="px-6">
          <a
            className="flex-none text-xl  text-white font-mono"
            href="#"
            title="GraphQL Mocker"
          >
            GraphQL Mocker
          </a>
        </div>
        <nav
          className="hs-accordion-group p-6 w-full flex flex-col flex-wrap"
        >
          <ul className="space-y-1.5">
            <li>
              <a
                className="flex items-center gap-x-3 py-2 px-2.5 bg-gray-700 text-sm text-white rounded-md"
                href="#"
                title="Dashboard"
              >
                <DashboardSVG data-testid="dashboard-svg"/>
                Dashboard
              </a>
            </li>
            <li>
              <a
                className="hs-accordion-toggle flex items-center gap-x-3.5 py-2 px-2.5 hs-accordion-active:text-white hs-accordion-active:hover:bg-transparent text-sm text-gray-400 rounded-md hover:bg-gray-800 hover:text-white"
                href="#"
                title="User profiles"
              >
                <UsersSVG data-testid="users-svg"/>
                Users
                <UsersDownSVG data-testid="usersdown-svg"/>
              </a>
            </li>

            <li>
              <a
                className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-400 rounded-md hover:bg-gray-800 hover:text-white-300"
                href="#"
                title="Response history"
              >
                <HistorySVG data-testid="history-svg"/>
                Response History
              </a>
            </li>
            <li>
              <a
                className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-400 rounded-md hover:bg-gray-800 hover:text-white-300"
                href="#"
                title="Documentation"
              >
                <DocumentationSVG data-testid="documentation-svg"/>
                Documentation
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AppSidebar;
