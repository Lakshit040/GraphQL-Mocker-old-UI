import AppSidebar from "./components/AppSidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="h-screen bg-gray-900">
      <div className="flex bg-gray-900">
        <div className="hidden lg:flex lg:w-64 ">
          <AppSidebar />
        </div>
        <div className="flex-1 bg-gray-900 text-white">
          <div className="sticky top-0 z-50">
            <Navbar />
          </div>
          <div className="h-auto">
            <div className="flex ">
              <div className="w-full h-full  border-r border-gray-800 overflow-y-auto">
                <Dashboard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
