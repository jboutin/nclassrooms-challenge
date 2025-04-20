import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface PieChartProps {
  data: { label: string; value: number }[];
  title: string;
}

const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Set dimensions
    const width = 500;
    const height = 400;
    const margin = 40;
    const radius = Math.min(width - 150, height) / 2 - margin; // Adjust radius to leave space for legend

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${(width - 100) / 2}, ${height / 2})`); // Shift chart left to make room for legend

    // Filter out data with 0 values
    const filteredData = data.filter(d => d.value > 0);

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(filteredData.map(d => d.label))
      .range(d3.schemeCategory10);

    // Compute position of each group on the pie
    const pie = d3.pie<any>()
      .value(d => d.value);
    
    const pieData = pie(filteredData);

    // Build arcs
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    // Build the pie chart
    svg.selectAll('pieces')
      .data(pieData)
      .enter()
      .append('path')
      .attr('d', arc as any)
      .attr('fill', d => color(d.data.label) as string)
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

    // Add labels only for segments with significant percentages (> 1%)
    svg.selectAll('labels')
      .data(pieData)
      .enter()
      .append('text')
      .filter(d => d.data.value > 1) // Only show labels for segments > 1%
      .text(d => `${d.data.value.toFixed(1)}%`) // Simplified label
      .attr('transform', d => `translate(${arc.centroid(d as any)})`)
      .style('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', 'white');

    // Add title
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -height/2 + 20)
      .text(title)
      .style('font-size', '16px');

    // Add legend to the right side of the chart
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${radius + 20}, ${-radius})`); // Position legend to the right

    // Add legend items
    filteredData.forEach((d, i) => {
      const legendItem = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);
      
      legendItem.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', color(d.label) as string);
      
      legendItem.append('text')
        .attr('x', 20)
        .attr('y', 10)
        .text(`${d.label}: ${d.value.toFixed(1)}%`)
        .style('font-size', '12px');
    });

  }, [data, title]);

  return <svg ref={svgRef}></svg>;
};

export default PieChart;