<template>
  <div style="width: 100%; height: 850px;">
    <div ref="chartRef" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chartInstance = null

const fetchGraphData = async () => {
  const res = await fetch('/data/graph.json')
  if (!res.ok) {
    console.error('图数据加载失败')
    return { nodes: [], links: [] }
  }
  // return await res.json()
  const graph = await res.json()

  // 给每条边加唯一标识以辅助高亮（可选）
  graph.links = graph.links.map(link => ({
    ...link,
    value: link.relation,
    name: `${link.source}->${link.target}`
  }))

  return graph
}

const initChart = async () => {
  const { nodes, links } = await fetchGraphData()

  chartInstance = echarts.init(chartRef.value)

  const option = {
    title: {
      text: '',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        if (params.dataType === 'edge') {
          return `${params.data.relation}`;
        } else if (params.dataType === 'node') {
          const { name, gender, age } = params.data;
          return `${name}<br/>gender:${gender}<br/>age:${age}`;
        }
      }
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        roam: true,
        data: nodes,
        links: links,
        label: {
          show: true,
          position: 'right'
        },
        // edgeLabel: {
        //   show: true,
        //   formatter: p => p.data.relation
        // },
        emphasis: {
          focus: 'adjacency', // 自动高亮相邻节点与边
          lineStyle: {
            width: 2
          }
        },
        force: {
          repulsion: 100,
          edgeLength: 100
        },
        lineStyle: {
          color: '#aaa'
        }
      }
    ]
  }
  chartInstance.on('mouseover', function (params) {
    if (params.dataType === 'node') {
      const nodeId = params.data.id;

      // 高亮自己
      chartInstance.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: params.dataIndex
      });

      // 高亮所有相关的边和另一端的节点
      graph.links.forEach(link => {
        if (link.source === nodeId || link.target === nodeId) {
          const relatedNodeId = link.source === nodeId ? link.target : link.source;

          chartInstance.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            name: relatedNodeId // 另一端节点
          });

          chartInstance.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            name: `${link.source}->${link.target}` // 边的唯一标识（需设置）
          });
        }
      });
    }
  });

  chartInstance.on('mouseout', function () {
    // 恢复所有高亮状态
    chartInstance.dispatchAction({
      type: 'downplay',
      seriesIndex: 0
    });
  });

  chartInstance.setOption(option)
  window.addEventListener('resize', chartInstance.resize)
}



onMounted(() => {
  initChart()
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
    window.removeEventListener('resize', chartInstance.resize)
  }
})
</script>

<style scoped></style>