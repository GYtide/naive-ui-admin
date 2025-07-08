<template>
  <div style="width: 100%; height: 800px;">
    <div ref="chartRef" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chartInstance = null

// 构造树形结构：将 nodes + links 转换为 tree
function buildTreeData(nodes, links) {
  const idMap = new Map()
  nodes.forEach(node => {
    idMap.set(node.id, { ...node, children: [] })
  })

  const childSet = new Set()

  links.forEach(link => {
    const parent = idMap.get(link.source)
    const child = idMap.get(link.target)
    if (parent && child) {
      parent.children.push(child)
      childSet.add(link.target)
    }
  })

  // 根节点：没有被其他节点作为子节点引用的
  const roots = nodes.filter(n => !childSet.has(n.id)).map(n => idMap.get(n.id))
  return roots
}

// 加载数据
const fetchGraphData = async () => {
  const res = await fetch('/data/graph.json') // 替换为你的路径
  if (!res.ok) {
    console.error('数据加载失败')
    return { nodes: [], links: [] }
  }
  return await res.json()
}

const renderTree = async () => {
  const { nodes, links } = await fetchGraphData()
  const treeData = buildTreeData(nodes, links)

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: ({ data }) =>
        `${data.name}<br/>性别：${data.gender}<br/>年龄：${data.age}`
    },
    series: [
      {
        type: 'tree',
        data: treeData,
        top: '5%',
        left: '10%',
        bottom: '5%',
        right: '10%',
        symbolSize: 12,
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right'
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left'
          }
        },
        expandAndCollapse: true,
        initialTreeDepth: -1,
        animationDuration: 500,
        animationDurationUpdate: 750
      }
    ]
  }

  chartInstance.setOption(option)
}

onMounted(async () => {
  chartInstance = echarts.init(chartRef.value)
  await renderTree()
  window.addEventListener('resize', chartInstance.resize)
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
    window.removeEventListener('resize', chartInstance.resize)
  }
})
</script>

<style scoped></style>
