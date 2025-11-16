<template>
  <el-container class="main-container">
    <el-main class="main" style="padding: 0">
      <el-card class="card" style="width: 100%; height: 100%">
        <!-- 顶部图标 + 描述 -->
        <div style="display: flex; align-items: center; gap: 8px; font-size: 18px; margin-bottom: 20px;">
          <el-icon style="font-size: 36px; flex-shrink: 0; color: #86909C">
            <PieChart />
          </el-icon>
          <span style="word-break: break-word; max-width: 500px; color: #86909C">
            以阶段性消费数据为基础，直观体现用户忠诚度画像。
            截止至，品牌会员分布情况如下：
          </span>
        </div>

        <!-- 主体布局：左环形图，右表格 -->
        <el-row :gutter="20">
          <!-- 左侧环形图 -->
          <el-col :span="12">
            <div ref="chart" style="height: 450px;"></div>
          </el-col>

          <!-- 右侧表格 -->
          <el-col :span="12">
            <el-table
                :data="memberLevels"
                border
                style="width: 100%"
            >
              <el-table-column prop="typeName" label="会员等级" width="120" />
              <el-table-column prop="percentage" label="等级人数占比" width="120" />
              <el-table-column prop="count" label="等级人数" width="100" />
              <el-table-column prop="todayNew" label="本日新增人数" width="120" />
              <el-table-column prop="todayOut" label="本日减少人数" width="120" />
            </el-table>
          </el-col>
        </el-row>
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { getVipLevelCount } from "@/api/customer.js"
import { PieChart } from '@element-plus/icons-vue'

const memberLevels = ref([])
const chart = ref(null)
let myChart = null

// 初始化图表
function initChart() {
  if (!myChart) myChart = echarts.init(chart.value)

  const total = memberLevels.value.reduce((a, b) => a + b.count, 0)

  myChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)' // 悬浮显示每个扇区
    },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        name: '会员等级',
        type: 'pie',
        radius: ['50%', '80%'],
        avoidLabelOverlap: false,

        // 中间显示总数
        label: {
          show: true,
          position: 'center',
          formatter: `{total|${total}}\n总会员`,
          rich: {
            total: {
              fontSize: 20,
              fontWeight: 'bold',
              color: '#333'
            }
          }
        },

        // 扇区显示配置，可不显示 label，让 tooltip 显示
        labelLine: { show: false }, // 不显示引导线
        data: memberLevels.value.map(item => ({
          value: item.count,
          name: item.typeName // 确保这里用 typeName
        }))
      }
    ]
  })
}

// 页面挂载后请求接口
onMounted(async () => {
  try {
    const res = await getVipLevelCount()
    const data = res.data

    const total = data.reduce((sum, item) => sum + item.count, 0)
    memberLevels.value = data.map(item => ({
      ...item,
      percentage: ((item.count / total) * 100).toFixed(2) + '%'
    }))

    initChart() // 数据准备好后初始化图表
  } catch (err) {
    console.error('接口请求失败', err)
  }
})
</script>

<style scoped>
.main-container {
  padding: 20px;
}

.card {
  padding: 20px;
}
</style>
