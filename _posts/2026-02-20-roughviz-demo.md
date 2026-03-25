---
layout: post
title: "Experimenting with roughViz.js"
category: demo
---

<script src="https://unpkg.com/rough-viz@2.0.5"></script>

roughViz.js is a fantastic library for creating sketchy, hand-drawn styled charts. It brings a playful, informal aesthetic to data visualization - perfect for adding personality to blog posts.

## Bar Chart

Here's a simple bar chart showing some data:

<div id="viz0" style="width: 500px; height: 500px;" ></div>


<script src="https://unpkg.com/rough-viz@2.0.5"></script>
<script>
  // create Donut chart using defined data & customize plot options
  new roughViz.Donut(
    {
      element: '#viz0',
      data: {
        labels: ['North', 'South', 'East', 'West'],
        values: [10, 5, 8, 3]
      },
      title: "Regions",
      roughness: 8,
      colors: ['#FC3141', '#FDA666', '#26ECCB', '#9086E3'],
      stroke: 'black',
      strokeWidth: 3,
      fillStyle: 'cross-hatch',
      fillWeight: 3.5,
    }
  ); 


</script>
