import { createContext, useState } from "react";

const TableContext = createContext();

function Table(props) {
  const [data, onClick] = useState(false);

  return (
    <TableContext.Provider value={{ data, onClick }}>
      {props.children}
    </TableContext.Provider>
  );
}

function Row({ children }) {
  const { data } = useContext(TableContext);
  return data && <ul>{children}</ul>;
}

function Item({ children }) {
  return <li>{children}</li>;
}

Table.Toggle = Toggle;
Table.Row = Row;
Table.Item = Item;
