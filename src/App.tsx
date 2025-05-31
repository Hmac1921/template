import "./App.css";
import { Input } from "./components/00-atoms/input/input";
import { Resizable } from "./components/00-atoms/resizable/resizable";

function App() {
  return (
    <div className="w-full h-full flex flex-col ">
      <table>
        <thead>
          <tr className="">
            {["No.", "First name", "Last name"].map((title) => (
              <Resizable key={title}>
                {({ ref }: { ref: React.Ref<HTMLDivElement> }) => (
                  <th className="column">
                    {title}
                    <div className="resizer" ref={ref} />
                  </th>
                )}
              </Resizable>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Andrea</td>
            <td>Ross</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Penelope</td>
            <td>Mills</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Sarah</td>
            <td>Grant</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Vanessa</td>
            <td>Roberts</td>
          </tr>
          <tr>
            <td>5</td>
            <td>Oliver</td>
            <td>Alsop</td>
          </tr>
          <tr>
            <td>6</td>
            <td>Jennifer</td>
            <td>Forsyth</td>
          </tr>
          <tr>
            <td>7</td>
            <td>Michelle</td>
            <td>King</td>
          </tr>
          <tr>
            <td>8</td>
            <td>Steven</td>
            <td>Kelly</td>
          </tr>
          <tr>
            <td>9</td>
            <td>Julian</td>
            <td>Ferguson</td>
          </tr>
          <tr>
            <td>10</td>
            <td>Chloe</td>
            <td>Ince</td>
          </tr>
        </tbody>
      </table>

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
    </div>
  );
}

export default App;
