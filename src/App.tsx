import "./App.css";
import { Input } from "./components/00-atoms/input/input";

function App() {
  return (
    <>
      <Input
        isDisabled={true}
        label="label"
        value="value"
        onChange={() => console.log("changed")}
      />
      <Input
        label="label"
        value="value"
        onChange={() => console.log("changed")}
      />
    </>
  );
}

export default App;
