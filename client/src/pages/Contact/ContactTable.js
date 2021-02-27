import React from "react";
import styles from "./css/ContactTable.module.css";

const Table = (props) => (
  <div className={[props.showTableSpinner === true ? styles.tableBlock : styles.hideTableBlock, styles.tableOuter].join(" ")}>
    <table
      style={props.data.length > 0 ? { height: "300px", display: "block", backgroundColor: "#fff", overflowY: "auto" } : { backgroundColor: "#fff" }}
    >
      <thead>
        <tr>
          {props.tableHeader.map((obj) => (
            <th key={obj.title} style={obj.style}>
              <div className="d-flex flex-row">
                <div>{obj.title}</div>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.data.map((row) => (
          <tr key={row.id} onClick={() => props.history.push("/editcontact/" + row.id)}>
            <td className={styles.tblColTitle} style={{ width: "20%" }}>
              {row.full_name ? row.full_name : "-"}
            </td>
            <td className={styles.tblColTitle} style={{ width: "20%" }}>
              {row.email ? row.email : "-"}
            </td>
            <td className={styles.tblColTitle} style={{ width: "16%" }}>
              {row.mobile_no ? row.mobile_no : "-"}
            </td>
            <td className={styles.tblColTitle} style={{ width: "16%" }}>
              {" "}
              {row.street ? row.street : "-"}
            </td>
            <td className={styles.tblColTitle} style={{ width: "16%" }}>
              {row.city ? row.city : "-"}
            </td>
            <td className={styles.tblColTitle} style={{ width: "20%" }}>
              {row.state ? row.state : "-"}
            </td>
            <td className={styles.tblColTitle} style={{ width: "20%" }}>
              {row.zip_code ? row.zip_code : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Table;
