// URL: https://observablehq.com/@zzsusan/calendar-view
// Title: Calendar View
// Author: zzsusan (@zzsusan)
// Version: 340
// Runtime version: 1

const m0 = {
  id: "d4b2b58758088d34@340",
  variables: [{
      inputs: ["md"],
      value: (function (md) {
        return (
          md `# Calendar View

This chart shows daily changes of the Dow Jones Industrial Average from 1990 to 2010. Days the index went up are green; days the index went down are pink.`
        )
      })
    },
    {
      name: "viewof weekday",
      inputs: ["html"],
      value: (function (html) {
        return (
          // <option value=weekday>Weekdays only
          html `<select>
<option value=sunday>Sunday-based weeks
<option value=monday>Monday-based weeks
</select>`
        )
      })
    },
    {
      name: "weekday",
      inputs: ["Generators", "viewof weekday"],
      value: (G, _) => G.input(_)
    },
    {
      name: "chart",
      inputs: ["d3", "data", "DOM", "width", "height", "cellSize", "weekday", "countDay", "formatDay", "timeWeek", "color", "formatDate", "format", "pathMonth", "formatMonth"],
      value: (function (d3, data, DOM, width, height, cellSize, weekday, countDay, formatDay, timeWeek, color, formatDate, format, pathMonth, formatMonth) {
        const years = d3.nest()
          .key(d => d.date.getUTCFullYear())
          .entries(data)
          .reverse();

        const svg = d3.select(DOM.svg(width, height * years.length))
          .style("font", "10px sans-serif")
          .style("width", "100%")
          .style("height", "auto");

        const year = svg.selectAll("g")
          .data(years)
          .join("g")
          .attr("transform", (d, i) => `translate(40,${height * i + cellSize * 1.5})`);

        year.append("text")
          .attr("x", -5)
          .attr("y", -5)
          .attr("font-weight", "bold")
          .attr("text-anchor", "end")
          .text(d => d.key);

        year.append("g")
          .attr("text-anchor", "end")
          .selectAll("text")
          .data((weekday === "weekday" ? d3.range(2, 7) : d3.range(7)).map(i => new Date(2014, 0, i)))
          .join("text")
          .attr("x", -5)
          .attr("y", d => (countDay(d) + 0.5) * cellSize)
          .attr("dy", "0.31em")
          .text(formatDay);

        year.append("g")
          .selectAll("rect")
          .data(d => d.values)
          .join("rect")
          .attr("width", cellSize - 1)
          .attr("height", cellSize - 1)
          // 
          .attr("x", d => timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 0.5)
          .attr("y", d => countDay(d.date) * cellSize + 0.5)
          .attr("fill", d => color(d.value))
          .append("title")
          .text(d => `${formatDate(d.date)}: ${format(d.value)}`);

        // 鼠标放在小格子上显示日期和value
        const month = year.append("g")
          .selectAll("g")
          .data(d => d3.utcMonths(d3.utcMonth(d.values[0].date), d.values[d.values.length - 1].date))
          .join("g");

        month.filter((d, i) => i).append("path")
          .attr("fill", "none")
          .attr("stroke", "#fff")
          .attr("stroke-width", 3)
          .attr("d", pathMonth);

        month.append("text")
          .attr("x", d => timeWeek.count(d3.utcYear(d), timeWeek.ceil(d)) * cellSize + 2)
          .attr("y", -5)
          .text(formatMonth);

        return svg.node();
      })
    },
    {
      name: "cellSize",
      value: (function () {
        return (
          17
        )
      })
    },
    {
      name: "width",
      value: (function () {
        return (
          964
        )
      })
    },
    {
      name: "height",
      inputs: ["cellSize", "weekday"],
      value: (function (cellSize, weekday) {
        return (
          cellSize * (weekday === "weekday" ? 7 : 9)
        )
      })
    },
    {
      // timeWeek是下拉框选择的which-day based week
      name: "timeWeek",
      inputs: ["weekday", "d3"],
      value: (function (weekday, d3) {
        return (
          // 如果是sunday的话返回基于周日的周（否则返回基于周一的周），返回类型是周
          weekday === "sunday" ? d3.utcSunday : d3.utcMonday
        )
      })
    },
    {
      name: "countDay",
      inputs: ["weekday"],
      value: (function (weekday) {
        return (
          weekday === "sunday" ? d => d.getUTCDay() : d => (d.getUTCDay() + 6) % 7
        )
      })
    },
    {
      name: "pathMonth",
      inputs: ["weekday", "countDay", "timeWeek", "d3", "cellSize"],
      value: (function (weekday, countDay, timeWeek, d3, cellSize) {
        return (
          function pathMonth(t) {
            const n = weekday === "weekday" ? 5 : 7;
            const d = Math.max(0, Math.min(n, countDay(t)));
            const w = timeWeek.count(d3.utcYear(t), t);
            return `${d === 0 ? `M${w * cellSize},0`
      : d === n ? `M${(w + 1) * cellSize},0`
      : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`}V${n * cellSize}`;
          }
        )
      })
    },
    {
      name: "format",
      inputs: ["d3"],
      value: (function (d3) {
        return (
          d3.format("+.2%")
        )
      })
    },
    {
      name: "formatDate",
      inputs: ["d3"],
      value: (function (d3) {
        return (
          d3.utcFormat("%x")
        )
      })
    },
    {
      name: "formatDay",
      value: (function () {
        return (
          d => "SMTWTFS" [d.getUTCDay()]
        )
      })
    },
    {
      name: "formatMonth",
      inputs: ["d3"],
      value: (function (d3) {
        return (
          d3.utcFormat("%b")
        )
      })
    },
    {
      name: "color",
      inputs: ["d3"],
      value: (function (d3) {
        return (
          d3.scaleSequential(d3.interpolatePiYG).domain([-0.05, 0.05])
        )
      })
    },
    {
      name: "data",
      inputs: ["d3"],
      value: (async function (d3) {
        const data = await d3.csv("https://gist.githubusercontent.com/mbostock/354a9c93174a17eb6b80f4678e3d3ae9/raw/9d20ec96a40cc3fd5b8ddc9a306bd7397d5cfd16/dji.csv", d3.autoType);
        return d3.pairs(data, ({
          close: previous
        }, {
          date,
          close
        }) => {
          return {
            date,
            value: (close - previous) / previous
          };
        });
      })
    },
    {
      // D3的（版本）？
      name: "d3",
      inputs: ["require"],
      value: (function (require) {
        return (
          require("d3@^5.9")
        )
      })
    }
  ]
};

const notebook = {
  id: "d4b2b58758088d34@340",
  modules: [m0]
};

export default notebook;