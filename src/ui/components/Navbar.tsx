import { SearchSVG } from "./SvgComponents";
import { 
  BellIcon, 
} from '@heroicons/react/24/outline';
const Navbar = () => {
  return (
    <div className="bg-gray-50  dark:bg-slate-900 sticky top-0">
      <header className="flex justify-center z-50 w-full bg-gray-900 border-b border-gray-700 text-sm py-2.5 sm:py-4">
        <nav
          className="max-w-[85rem] flex basis-full items-center w-full mx-auto px-4 sm:px-6 lg:px-8"
          aria-label="Global"
        >
          <div className="w-full flex items-center justify-center">
            <div className="hidden mx-auto sm:block border border-gray-600 outline-none rounded-xl">
              <label
                htmlFor="icon"
                className="sr-only"
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20 pl-4">
                 <SearchSVG/>
                </div>
                <input
                  type="text"
                  id="icon"
                  name="icon"
                  className="py-2 px-4 pl-11 pr-20 block w-92 md:w-96 bg-transparent border-gray-700 shadow-sm rounded-md text-sm text-gray-300 focus:z-10 focus:border-gray-900 focus:ring-gray-600 placeholder:text-gray-500 outline-none"
                  placeholder="Search"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                  <span className="text-gray-500">Ctrl + /</span>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-center justify-end gap-2">
              <button
                type="button"
                className="inline-flex flex-shrink-0 justify-center items-center gap-2 h-[2.375rem] w-[2.375rem] rounded-full font-medium hover:bg-white/[.2] text-white align-middle focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all text-xs"
              >
                <BellIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
