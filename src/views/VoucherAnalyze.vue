<template>
  <div class="voucher-analyze-container">
    <el-card class="analyze-card" shadow="never">
      <template #header>
        <div class="analyze-header">
          <span class="analyze-title">优惠券分析</span>
          <div class="analyze-actions">
            <el-button @click="handleBack">
              <el-icon><ArrowLeft /></el-icon>
              返回
            </el-button>
            <el-button type="primary" @click="handleRefresh">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </div>
      </template>

      <!-- 优惠券基本信息 -->
      <el-descriptions title="优惠券基本信息" :column="3" border>
        <el-descriptions-item label="优惠券ID">{{ voucherInfo.VOUCHERS_NO }}</el-descriptions-item>
        <el-descriptions-item label="优惠券名称">{{ voucherInfo.ENAME }}</el-descriptions-item>
        <el-descriptions-item label="优惠券种类">{{ getVoucherTypeName(voucherInfo.VOU_TYPE) }}</el-descriptions-item>
        <el-descriptions-item label="优惠券面额">¥{{ voucherInfo.AMT_DISCOUNT?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="是否有效">
          <el-tag :type="voucherInfo.IS_VALID === 'Y' ? 'success' : 'danger'">
            {{ voucherInfo.IS_VALID === 'Y' ? '有效' : '无效' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="有效期">
          {{ formatDate(voucherInfo.CREATIONDATE) }} 至 {{ formatDate(voucherInfo.VALID_DATE) }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 统计数据 -->
      <div class="statistics-container">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card shadow="hover" class="statistic-card">
              <template #header>
                <div class="statistic-header">
                  <span>发放总数</span>
                </div>
              </template>
              <div class="statistic-value">{{ statistics.totalCount }}</div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="statistic-card">
              <template #header>
                <div class="statistic-header">
                  <span>已使用数</span>
                </div>
              </template>
              <div class="statistic-value">{{ statistics.usedCount }}</div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="statistic-card">
              <template #header>
                <div class="statistic-header">
                  <span>使用率</span>
                </div>
              </template>
              <div class="statistic-value">{{ statistics.usageRate }}%</div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 使用趋势图表 -->
      <div class="chart-container">
        <div class="chart-title">使用趋势</div>
        <div ref="chartRef" class="chart"></div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Refresh } from '@element-plus/icons-vue'
// import * as echarts from 'echarts'

const router = useRouter()
const route = useRoute()
const chartRef = ref()

// 优惠券信息
const voucherInfo = reactive({
  VOUCHERS_NO: '',
  ENAME: '',
  VOU_TYPE: '',
  AMT_DISCOUNT: 0,
  IS_VALID: 'Y',
  CREATIONDATE: '',
  VALID_DATE: ''
})

// 统计数据
const statistics = reactive({
  totalCount: 0,
  usedCount: 0,
  usageRate: 0
})

// 获取优惠券种类名称
const getVoucherTypeName = (type) => {
  const typeMap = {
    '1': '满减券',
    '2': '折扣券',
    '3': '兑换券'
  }
  return typeMap[type] || '未知'
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

// 获取优惠券详情
const fetchVoucherDetail = async () => {
  const voucherId = route.query.id || route.params.id
  if (!voucherId) {
    ElMessage.error('缺少优惠券ID')
    return
  }
  
  try {
    // 这里应该调用获取优惠券详情的API
    // const res = await getVoucherDetail(voucherId)
    // if (res.code === 200) {
    //   Object.assign(voucherInfo, res.data)
    // } else {
    //   ElMessage.error(res.message || '获取优惠券详情失败')
    // }
    
    // 模拟数据
    Object.assign(voucherInfo, {
      VOUCHERS_NO: voucherId,
      ENAME: '测试优惠券',
      VOU_TYPE: '1',
      AMT_DISCOUNT: 100,
      IS_VALID: 'Y',
      CREATIONDATE: '2023-01-01 00:00:00',
      VALID_DATE: '2023-12-31 23:59:59'
    })
    
    // 获取统计数据
    fetchStatistics()
  } catch (error) {
    console.error('获取优惠券详情失败:', error)
    ElMessage.error('获取优惠券详情失败')
  }
}

// 获取统计数据
const fetchStatistics = async () => {
  try {
    // 这里应该调用获取优惠券统计数据的API
    // const res = await getVoucherStatistics(voucherInfo.VOUCHERS_NO)
    // if (res.code === 200) {
    //   Object.assign(statistics, res.data)
    // } else {
    //   ElMessage.error(res.message || '获取统计数据失败')
    // }
    
    // 模拟数据
    Object.assign(statistics, {
      totalCount: 1000,
      usedCount: 350,
      usageRate: 35
    })
    
    // 初始化图表
    nextTick(() => {
      initChart()
    })
  } catch (error) {
    console.error('获取统计数据失败:', error)
    ElMessage.error('获取统计数据失败')
  }
}

// 初始化图表
const initChart = () => {
  // if (!chartRef.value) return
  
  // const chart = echarts.init(chartRef.value)
  
  // const option = {
  //   title: {
  //     text: '优惠券使用趋势'
  //   },
  //   tooltip: {
  //     trigger: 'axis'
  //   },
  //   legend: {
  //     data: ['发放数量', '使用数量']
  //   },
  //   xAxis: {
  //     type: 'category',
  //     data: ['1月', '2月', '3月', '4月', '5月', '6月']
  //   },
  //   yAxis: {
  //     type: 'value'
  //   },
  //   series: [
  //     {
  //       name: '发放数量',
  //       type: 'line',
  //       data: [120, 132, 101, 134, 90, 230]
  //     },
  //     {
  //       name: '使用数量',
  //       type: 'line',
  //       data: [20, 32, 41, 34, 40, 130]
  //     }
  //   ]
  // }
  
  // chart.setOption(option)
  
  // 响应式调整
  // window.addEventListener('resize', () => {
  //   chart.resize()
  // })
}

// 刷新
const handleRefresh = () => {
  fetchVoucherDetail()
}

// 返回
const handleBack = () => {
  router.push('/voucher')
}

// 初始化
onMounted(() => {
  fetchVoucherDetail()
})
</script>

<style scoped lang="less">
.voucher-analyze-container {
  padding: 20px;
  
  .analyze-card {
    .analyze-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .analyze-title {
        font-size: 16px;
        font-weight: bold;
      }
      
      .analyze-actions {
        display: flex;
        gap: 10px;
      }
    }
    
    .statistics-container {
      margin: 20px 0;
      
      .statistic-card {
        .statistic-header {
          font-size: 14px;
        }
        
        .statistic-value {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          margin-top: 10px;
        }
      }
    }
    
    .chart-container {
      margin-top: 20px;
      
      .chart-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      
      .chart {
        height: 300px;
        width: 100%;
      }
    }
  }
}
</style>