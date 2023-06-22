import CollapsibleMockResponseConfigComponent from "./components/CollapsibleMockResponseConfigComponent";

function App() {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      {/* Toolbar should come here */}
      <div className="h-full w-full flex flex-col items-center p-5">
        <CollapsibleMockResponseConfigComponent />
        <CollapsibleMockResponseConfigComponent />
      </div>
    </div>
  );
}

export default App;
