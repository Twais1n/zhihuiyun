<template>
  <div class="order-detail-container">
    <el-card class="detail-card" shadow="never">
      <template #header>
        <div class="detail-header">
          <span class="detail-title">订单详情</span>
          <div class="detail-actions">
            <el-button @click="handleBack">
              <el-icon><ArrowLeft /></el-icon>
              返回列表
            </el-button>
          </div>
        </div>
      </template>

      <div v-loading="loading">
        <!-- 订单基本信息卡片 -->
        <el-card class="info-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">订单基本信息</span>
            </div>
          </template>
          
          <el-descriptions :column="3" border>
            <el-descriptions-item label="订单编号">{{ orderInfo.DOCNO }}</el-descriptions-item>
            <el-descriptions-item label="下单时间">{{ formatDate(orderInfo.CREATIONDATE) }}</el-descriptions-item>
            <el-descriptions-item label="消费渠道">{{ orderInfo.CHANNEL || '-' }}</el-descriptions-item>
            <el-descriptions-item label="销售门店">{{ orderInfo.name }}</el-descriptions-item>
            <el-descriptions-item label="所属导购">{{ orderInfo.guide || '-' }}</el-descriptions-item>
            <el-descriptions-item label="营业员">{{ orderInfo.clerk || '-' }}</el-descriptions-item>
            <el-descriptions-item label="实付金额" span="3">
              <span class="amount-text">¥{{ orderInfo.TOT_AMT_ACTUAL?.toFixed(2) }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 商品信息卡片 -->
        <el-card class="info-card" shadow="never" style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <span class="card-title">商品信息</span>
            </div>
          </template>
          
          <el-table :data="orderItems" border style="width: 100%;">
            <el-table-column prop="sku_code" label="SKU编码" width="120" align="center" />
            <el-table-column prop="product_name" label="商品" min-width="180" />
            <el-table-column prop="price" label="单价" width="100" align="center">
              <template #default="scope">
                ¥{{ scope.row.price?.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="80" align="center" />
            <el-table-column prop="discount_amount" label="优惠金额" width="100" align="center">
              <template #default="scope">
                ¥{{ scope.row.discount_amount?.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="payable_amount" label="应付金额" width="100" align="center">
              <template #default="scope">
                ¥{{ scope.row.payable_amount?.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="paid_amount" label="实付金额" width="100" align="center">
              <template #default="scope">
                ¥{{ scope.row.paid_amount?.toFixed(2) }}
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 总计栏 -->
          <div class="total-section">
            <div class="total-item">
              <span class="total-label">商品总数量：</span>
              <span class="total-value">{{ totalQuantity }}</span>
            </div>
            <div class="total-item">
              <span class="total-label">商品总金额：</span>
              <span class="total-value">¥{{ totalAmount?.toFixed(2) }}</span>
            </div>
            <div class="total-item">
              <span class="total-label">总优惠金额：</span>
              <span class="total-value">¥{{ totalDiscount?.toFixed(2) }}</span>
            </div>
            <div class="total-item highlight">
              <span class="total-label">实付总金额：</span>
              <span class="total-value">¥{{ totalPaid?.toFixed(2) }}</span>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getOrderDetail } from '@/api/order'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

// 订单信息
const orderInfo = reactive({
  DOCNO: '',           // 订单编号
  CREATIONDATE: null,  // 下单时间
  CHANNEL: '',         // 消费渠道
  name: '',            // 销售门店
  guide: '',           // 所属导购
  clerk: '',           // 营业员
  TOT_AMT_ACTUAL: 0    // 实付金额
})

// 订单商品列表
const orderItems = ref([])

// 计算总计数据
const totalQuantity = computed(() => {
  return orderItems.value.reduce((sum, item) => sum + (item.quantity || 0), 0)
})

const totalAmount = computed(() => {
  return orderItems.value.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0)
})

const totalDiscount = computed(() => {
  return orderItems.value.reduce((sum, item) => sum + (item.discount_amount || 0), 0)
})

const totalPaid = computed(() => {
  return orderItems.value.reduce((sum, item) => sum + (item.paid_amount || 0), 0)
})

// 获取订单详情
const fetchOrderDetail = async () => {
  const orderId = route.params.id
  if (!orderId) {
    ElMessage.error('订单ID不存在')
    return
  }

  loading.value = true
  try {
    const res = await getOrderDetail(orderId)
    Object.assign(orderInfo, res.data)
    
    // 模拟订单商品数据
    orderItems.value = res.data.items || [
      {
        sku_code: 'SKU001',
        product_name: '示例商品1',
        price: 99.00,
        quantity: 1,
        discount_amount: 0.00,
        payable_amount: 99.00,
        paid_amount: 99.00
      },
      {
        sku_code: 'SKU002',
        product_name: '示例商品2',
        price: 199.00,
        quantity: 2,
        discount_amount: 10.00,
        payable_amount: 388.00,
        paid_amount: 388.00
      }
    ]
  } catch (error) {
    console.error('获取订单详情失败:', error)
    ElMessage.error('获取订单详情失败')
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

// 返回列表
const handleBack = () => {
  router.push('/order')
}

// 初始化
onMounted(() => {
  fetchOrderDetail()
})
</script>

<style scoped lang="less">
.order-detail-container {
  padding: 20px;
  
  .detail-card {
    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .detail-title {
        font-size: 18px;
        font-weight: bold;
      }
      
      .detail-actions {
        display: flex;
        gap: 10px;
      }
    }
  }
  
  .info-card {
    .card-header {
      .card-title {
        font-size: 16px;
        font-weight: bold;
        color: #409EFF;
      }
    }
    
    .amount-text {
      font-size: 16px;
      font-weight: bold;
      color: #F56C6C;
    }
  }
  
  .total-section {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 30px;
    
    .total-item {
      display: flex;
      align-items: center;
      
      .total-label {
        font-size: 14px;
        color: #606266;
      }
      
      .total-value {
        font-size: 16px;
        font-weight: bold;
        margin-left: 8px;
      }
      
      &.highlight {
        .total-label {
          font-size: 16px;
          font-weight: bold;
          color: #F56C6C;
        }
        
        .total-value {
          font-size: 18px;
          color: #F56C6C;
        }
      }
    }
  }
}
</style>