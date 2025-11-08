<template>
  <div class="home-container">
    <!-- 页面标题 -->
 

    <!-- 统计卡片区域 -->
    <div class="stats-cards">
      <el-card class="stat-card" shadow="hover">
        <div class="card-content">
          <div class="card-icon total-members">
            <el-icon><User /></el-icon>
          </div>
          <div class="card-info">
            <div class="card-value">{{ stats.totalMembers }}</div>
            <div class="card-label">总会员数</div>
          </div>
          <div class="card-trend positive">
            <el-icon><TrendingUp /></el-icon>
            <span>+12.5%</span>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="card-content">
          <div class="card-icon new-members">
            <el-icon><UserFilled /></el-icon>
          </div>
          <div class="card-info">
            <div class="card-value">{{ stats.newThisMonth }}</div>
            <div class="card-label">本月新增</div>
          </div>
          <div class="card-trend positive">
            <el-icon><TrendingUp /></el-icon>
            <span>+8.3%</span>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="card-content">
          <div class="card-icon total-consumption">
            <el-icon><Money /></el-icon>
          </div>
          <div class="card-info">
            <div class="card-value">¥{{ formatCurrency(stats.totalConsumption) }}</div>
            <div class="card-label">总消费额</div>
          </div>
          <div class="card-trend positive">
            <el-icon><TrendingUp /></el-icon>
            <span>+15.2%</span>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="card-content">
          <div class="card-icon active-rate">
            <el-icon><DataAnalysis /></el-icon>
          </div>
          <div class="card-info">
            <div class="card-value">{{ stats.activeRate }}%</div>
            <div class="card-label">活跃率</div>
          </div>
          <div class="card-trend positive">
            <el-icon><TrendingUp /></el-icon>
            <span>+2.1%</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <!-- 会员增长趋势图表 -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <span>会员增长趋势</span>
            <div class="time-tabs">
              <el-radio-group v-model="timeRange" @change="updateGrowthChart">
                <el-radio-button label="week">一周</el-radio-button>
                <el-radio-button label="month">一月</el-radio-button>
                <el-radio-button label="quarter">一季度</el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </template>
        <div class="chart-container">
          <div ref="growthChart" style="width: 100%; height: 300px;"></div>
        </div>
      </el-card>

      <!-- 会员等级分布图表 -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <span>会员等级分布</span>
          </div>
        </template>
        <div class="chart-container">
          <div ref="levelChart" style="width: 100%; height: 300px;"></div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { 
  User, 
  UserFilled, 
  Money, 
  DataAnalysis, 
  TrendCharts 
} from '@element-plus/icons-vue'

// 统计数据
const stats = ref({
  totalMembers: 12568,
  newThisMonth: 342,
  totalConsumption: 1256800,
  activeRate: 68.5
})

// 时间范围
const timeRange = ref('month')

// 图表引用
const growthChart = ref(null)
const levelChart = ref(null)

// 图表实例
let growthChartInstance = null
let levelChartInstance = null

// 格式化货币
const formatCurrency = (value) => {
  return value.toLocaleString('zh-CN')
}

// 初始化增长趋势图表
const initGrowthChart = () => {
  if (!growthChart.value) return
  
  growthChartInstance = echarts.init(growthChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>{a}: {c}人'
    },
    legend: {
      data: ['新增会员', '总会员数'],
      right: 10,
      top: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '新增会员',
        type: 'line',
        smooth: true,
        data: [120, 132, 101, 134, 90, 230, 210],
        lineStyle: {
          width: 3
        },
        itemStyle: {
          color: '#409EFF'
        }
      },
      {
        name: '总会员数',
        type: 'line',
        smooth: true,
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        lineStyle: {
          width: 3
        },
        itemStyle: {
          color: '#67C23A'
        }
      }
    ]
  }
  
  growthChartInstance.setOption(option)
}

// 初始化等级分布图表
const initLevelChart = () => {
  if (!levelChart.value) return
  
  levelChartInstance = echarts.init(levelChart.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      data: ['普通会员', '银卡会员', '金卡会员', '钻石会员', '黑金会员']
    },
    series: [
      {
        name: '会员等级分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 40, name: '普通会员', itemStyle: { color: '#909399' } },
          { value: 25, name: '银卡会员', itemStyle: { color: '#E6A23C' } },
          { value: 20, name: '金卡会员', itemStyle: { color: '#F56C6C' } },
          { value: 10, name: '钻石会员', itemStyle: { color: '#409EFF' } },
          { value: 5, name: '黑金会员', itemStyle: { color: '#67C23A' } }
        ]
      }
    ]
  }
  
  levelChartInstance.setOption(option)
}

// 更新增长图表数据
const updateGrowthChart = () => {
  if (!growthChartInstance) return
  
  let xAxisData = []
  let newMemberData = []
  let totalMemberData = []
  
  switch (timeRange.value) {
    case 'week':
      xAxisData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      newMemberData = [45, 52, 38, 61, 55, 78, 63]
      totalMemberData = [12523, 12575, 12613, 12674, 12729, 12807, 12870]
      break
    case 'month':
      xAxisData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
      newMemberData = [120, 132, 101, 134, 90, 230, 210]
      totalMemberData = [820, 932, 901, 934, 1290, 1330, 1320]
      break
    case 'quarter':
      xAxisData = ['Q1', 'Q2', 'Q3', 'Q4']
      newMemberData = [453, 524, 387, 612]
      totalMemberData = [453, 977, 1364, 1976]
      break
  }
  
  growthChartInstance.setOption({
    xAxis: {
      data: xAxisData
    },
    series: [
      {
        data: newMemberData
      },
      {
        data: totalMemberData
      }
    ]
  })
}

// 响应窗口大小变化
const handleResize = () => {
  growthChartInstance?.resize()
  levelChartInstance?.resize()
}

onMounted(() => {
  initGrowthChart()
  initLevelChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  growthChartInstance?.dispose()
  levelChartInstance?.dispose()
})
</script>

<style scoped lang="scss">
.home-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}


.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  border-radius: 12px;
  border: none;
  
  :deep(.el-card__body) {
    padding: 20px;
  }
}

.card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  
  &.total-members {
    background: linear-gradient(135deg, #409EFF, #79BBFF);
  }
  
  &.new-members {
    background: linear-gradient(135deg, #67C23A, #95D475);
  }
  
  &.total-consumption {
    background: linear-gradient(135deg, #E6A23C, #EEBD6D);
  }
  
  &.active-rate {
    background: linear-gradient(135deg, #F56C6C, #F89898);
  }
}

.card-info {
  flex: 1;
  margin-left: 15px;
}

.card-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.card-label {
  font-size: 14px;
  color: #909399;
}

.card-trend {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  
  &.positive {
    color: #67C23A;
  }
  
  &.negative {
    color: #F56C6C;
  }
  
  .el-icon {
    margin-right: 4px;
  }
}

.charts-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.chart-card {
  border-radius: 12px;
  border: none;
  
  :deep(.el-card__header) {
    border-bottom: 1px solid #ebeef5;
    padding: 16px 20px;
  }
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  span {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }
}

.chart-container {
  padding: 10px;
}

.time-tabs {
  :deep(.el-radio-group) {
    .el-radio-button {
      .el-radio-button__inner {
        border-radius: 4px;
        border: 1px solid #DCDFE6;
        
        &:hover {
          color: #409EFF;
        }
      }
      
      &.is-active {
        .el-radio-button__inner {
          background-color: #409EFF;
          border-color: #409EFF;
          color: white;
        }
      }
    }
  }
}

@media (max-width: 1200px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .home-container {
    padding: 15px;
  }
}
</style>