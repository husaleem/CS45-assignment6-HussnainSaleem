import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const TooltipBarChart = ({ model, data, color }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data || !model) return;

    const svg = d3.select(ref.current).select("svg");
    const hasSvg = !svg.empty();

    const width = 300;
    const height = 160;
    const margin = { top: 10, right: 20, bottom: 30, left: 55 };

    const dates = data.map(d => d.date);
    const dateRange = d3.extent(dates);
    const paddedDomain = [
      d3.timeMonth.offset(dateRange[0], -0.5),
      d3.timeMonth.offset(dateRange[1], 0.5)
    ];

    const x = d3.scaleTime().domain(paddedDomain).range([margin.left, width - margin.right]);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d[model])])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const barWidth = (width - margin.left - margin.right) / data.length - 4;

    // Create or reuse the SVG
    const base = hasSvg
      ? svg
      : d3
          .select(ref.current)
          .append("svg")
          .attr("width", width)
          .attr("height", height);

    // === BARS WITH TRANSITION ===
    const bars = base.selectAll("rect").data(data);

    bars
      .join(
        enter =>
          enter
            .append("rect")
            .attr("x", d => x(d.date) - barWidth / 2)
            .attr("y", y(0))
            .attr("width", barWidth)
            .attr("height", 0)
            .attr("fill", color)
            .transition()
            .duration(500)
            .attr("y", d => y(d[model]))
            .attr("height", d => y(0) - y(d[model])),
        update =>
          update
            .transition()
            .duration(500)
            .attr("fill", color)
            .attr("x", d => x(d.date) - barWidth / 2)
            .attr("y", d => y(d[model]))
            .attr("height", d => y(0) - y(d[model]))
      );

    // === X AXIS ===
    const xAxis = d3.axisBottom(x)
      .ticks(data.length)
      .tickFormat(d => {
        const m = d.getMonth();
        return m >= 0 && m <= 9 ? d3.timeFormat("%b")(d) : "";
      });

    base.selectAll(".x-axis").remove(); // reset axis each time
    base
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .call(g => g.selectAll("path").attr("stroke", "#444"))
      .call(g => g.selectAll("text").attr("fill", "#111"));

    // === Y AXIS ===
    base.selectAll(".y-axis").remove();
    base
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .call(g => g.select(".domain").attr("stroke", "#444"))
      .call(g => g.selectAll("line").remove())
      .call(g => g.selectAll("text").attr("fill", "#111"));
  }, [model, data, color]);

  return <div ref={ref}></div>;
};

export default TooltipBarChart;
