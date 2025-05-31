import { createContext, useContext, useReducer } from "react";

const TableContext = createContext();

function Table(props) {
  const { state, dispatch } = useReducer(initialState, reducer);

  return (
    <TableContext.Provider value={{ state, dispatch }}>
      <div className="table">{props.children}</div>
    </TableContext.Provider>
  );
}

function Header({ children }) {
  const { data } = useContext(TableContext);
  return data && <ul>{children}</ul>;
}

function RowClick({ children }) {
  const { onClick } = useContext(TableContext);
  return <Row onClick={(row) => onClick(row)}>{children}</Row>;
}

function Row({ children }) {
  const { row, onHover } = useContext(TableContext);
  return (
    data && (
      <div onMouseOver={() => onHover(row)} className="table-row">
        {children}
      </div>
    )
  );
}

function Item({ children }) {
  return <li>{children}</li>;
}

Table.Header = Header;
Table.Row = Row;
Table.RowClick = RowClick;
Table.Item = Item;
