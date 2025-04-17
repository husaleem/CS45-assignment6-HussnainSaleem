import React, { useState } from "react";
import UploadComponent from "./UploadComponent";
import Streamgraph from "./Streamgraph";
import Legend from "./Legend";

function App() {
  const [data, setData] = useState(null);

  return (
    <div>
      {!data ? (
        <UploadComponent onDataLoaded={setData} />
      ) : (
        <div style={{ display: "flex", justifyContent: "center", gap: "40px" }}>
          <Streamgraph data={data} />
          <Legend />
        </div>
      )}

      {/* Bottom-right credit */}
      <div style={{
        position: "fixed",
        bottom: "10px",
        right: "20px",
        fontSize: "14px",
        color: "#666",
        fontFamily: "sans-serif",
        opacity: 0.8
      }}>
        By: Hussnain Saleem
      </div>
    </div>
  );
}

export default App;
