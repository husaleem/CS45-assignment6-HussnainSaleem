import React, { useRef } from "react";
import * as d3 from "d3";

const UploadComponent = ({ onDataLoaded }) => {
  const fileInputRef = useRef();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const parsed = d3.csvParse(text, (d) => ({
        date: new Date(d.Date),
        GPT4: +d["GPT-4"],
        Gemini: +d.Gemini,
        PaLM2: +d["PaLM-2"],
        Claude: +d.Claude,
        LLaMA: +d["LLaMA-3.1"],
      }));
      onDataLoaded(parsed);
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ margin: "20px" }}>
      <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} />
    </div>
  );
};

export default UploadComponent;
