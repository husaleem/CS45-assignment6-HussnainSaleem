import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import TooltipBarChart from "./TooltipBarChart";

const colors = {
  GPT4: "#e41a1c",
  Gemini: "#377eb8",
  PaLM2: "#4daf4a",
  Claude: "#984ea3",
  LLaMA: "#ff7f00"
};

const Streamgraph = ({ data }) => {
  const ref = useRef();
  const [tooltip, setTooltip] = useState({ visible: false });

  useEffect(() => {
    if (!data) return;
    d3.select(ref.current).selectAll("*").remove();

    const margin = { top: 20, right: 100, bottom: 30, left: 50 };
    const width = 900 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .on("mouseleave", () => setTooltip({ visible: false }))
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const keys = ["GPT4", "Gemini", "PaLM2", "Claude", "LLaMA"];
    const stack = d3.stack().keys(keys).offset(d3.stackOffsetWiggle);
    const series = stack(data);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(series, layer => d3.min(layer, d => d[0])),
        d3.max(series, layer => d3.max(layer, d => d[1]))
      ])
      .range([height, 0]);

    const area = d3
      .area()
      .x((d, i) => x(data[i].date))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]));

    svg
      .selectAll("path")
      .data(series)
      .join("path")
      .attr("d", area)
      .attr("fill", (_, i) => colors[keys[i]])
      .attr("stroke", "#fff")
      .style("cursor", "pointer")
      .on("mousemove", function (event, layer) {
        const modelIndex = series.indexOf(layer);
        const model = keys[modelIndex];
        const [mx, my] = d3.pointer(event);

        setTooltip({
          visible: true,
          x: mx + margin.left + 20,  // tooltip offset X
          y: my + margin.top - 60,   // tooltip offset Y
          model,
          color: colors[model]
        });
      });

    // X Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Y Axis
    svg.append("g").call(d3.axisLeft(y));
  }, [data]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={ref}></div>
      {tooltip.visible && (
        <div
          style={{
            position: "absolute",
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            background: "white",
            borderRadius: "12px",
            border: "1px solid #ccc",
            padding: "16px",
            pointerEvents: "none",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            zIndex: 999,
            minWidth: "230px",
            transition: "top 0.1s ease, left 0.1s ease"
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              marginBottom: "8px",
              textAlign: "left"
            }}
          >
            {tooltip.model
              .replace("GPT4", "GPT-4")
              .replace("PaLM2", "PaLM-2")
              .replace("LLaMA", "LLaMA-3.1")}
          </div>
          <TooltipBarChart
            model={tooltip.model}
            data={data}
            color={tooltip.color}
          />
        </div>
      )}
    </div>
  );
};

export default Streamgraph;
