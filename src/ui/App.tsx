import MockResponseConfigComponent from "./components/MockResponseConfigComponent";

function App() {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      {/* Toolbar should come here */}
      <div className="h-full w-full flex flex-col items-center p-5">
        <MockResponseConfigComponent />
        <MockResponseConfigComponent />
      </div>
    </div>
  );
}

export default App;
