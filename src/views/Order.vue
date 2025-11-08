<template>
  <div class="order-container">
    <!-- 搜索表单 -->
    <el-card class="search-card" shadow="never">
      <template #header>
        <div class="search-header">
          <span class="search-title">订单查询</span>
        </div>
      </template>
      
      <el-form 
        ref="searchFormRef" 
        :model="searchForm" 
        :inline="true" 
        class="search-form"
      >
        <el-form-item label="订单编号" prop="DOCNO">
          <el-input 
            v-model="searchForm.DOCNO" 
            placeholder="请输入订单编号"
            clearable
            style="width: 180px;"
          />
        </el-form-item>

        <el-form-item label="下单门店" prop="name">
          <el-input 
            v-model="searchForm.name" 
            placeholder="请输入下单门店"
            clearable
            style="width: 180px;"
          />
        </el-form-item>

        <el-form-item label="手机号" prop="mobil">
          <el-input 
            v-model="searchForm.mobil" 
            placeholder="请输入会员手机号"
            clearable
            style="width: 180px;"
          />
        </el-form-item>

        <el-form-item label="消费时间" prop="CREATIONDATE">
          <el-date-picker
            v-model="searchForm.CREATIONDATE"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px;"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="table-header">
          <span class="table-title">订单列表</span>
          <div class="table-actions">
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              查询
            </el-button>
            <el-button @click="handleReset">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
            <el-button type="success" @click="handleExport">
              <el-icon><Download /></el-icon>
              导出数据
            </el-button>
          </div>
        </div>
      </template>

      <el-table 
        :data="tableData.slice((pagination.pageNum - 1) * pagination.pageSize, pagination.pageNum * pagination.pageSize)" 
        border 
        style="width: 100%"
      >
        <el-table-column prop="DOCNO" label="订单编号" width="150" align="center">
          <template #default="scope">
            <el-link type="primary" @click="handleViewOrder(scope.row)">
              {{ scope.row.DOCNO }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="下单门店" min-width="120" />
        <el-table-column prop="TOT_AMT_LIST" label="商品总金额" width="110" align="center">
          <template #default="scope">
            ¥{{ scope.row.TOT_AMT_LIST?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="discountAmount" label="优惠金额" width="110" align="center">
          <template #default="scope">
            ¥{{ (scope.row.TOT_AMT_LIST - scope.row.TOT_AMT_ACTUAL)?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="TOT_AMT_ACTUAL" label="实际支付金额" width="120" align="center">
          <template #default="scope">
            ¥{{ scope.row.TOT_AMT_ACTUAL?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="mobil" label="会员手机号" width="120" align="center" />
        <el-table-column prop="RET_INTEGRAL" label="赠送积分" width="100" align="center" />
        <el-table-column prop="CREATIONDATE" label="下单时间" width="150" align="center">
          <template #default="scope">
            {{ formatDate(scope.row.CREATIONDATE) }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.pageNum"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, Download } from '@element-plus/icons-vue'
import { getOrderList } from '@/api/order'
import { useRouter } from 'vue-router'



// 路由
const router = useRouter()

// 搜索表单
const searchForm = reactive({
  DOCNO: '',         // 订单编号
  name: '',          // 下单门店
  mobil: '',         // 会员手机号
  CREATIONDATE: []   // 消费时间
})

// 表格数据
const tableData = ref([])
const loading = ref(false)

// 分页配置
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 格式化日期
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}



// 获取订单列表
const fetchOrderList = async () => {
  loading.value = true
  try {
    // 构建请求参数，根据接口文档
    const params = {
      DOCNO: searchForm.DOCNO || undefined,         // 订单编号
      mobil: searchForm.mobil || undefined,         // 会员手机号
      name: searchForm.name || undefined,           // 下单门店
      CREATIONDATE: searchForm.CREATIONDATE || undefined, // 消费时间
      pageNum: pagination.pageNum,                  // 页码
      pageSize: pagination.pageSize                 // 每页条数
    }
    
    // 处理消费时间范围
    if (searchForm.CREATIONDATE && searchForm.CREATIONDATE.length === 2) {
      params.CREATIONDATE = searchForm.CREATIONDATE[0] // 使用开始日期作为查询参数
    }
    
    // 移除undefined的参数，但保留分页参数
    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === '') {
        // 保留分页参数，即使它们是空字符串
        if (key !== 'pageNum' && key !== 'pageSize') {
          delete params[key]
        }
      }
    })
    
    const res = await getOrderList(params)
    if (res.code === 200) {
        tableData.value = res.data.list || []
        pagination.total = res.data.total || 0
    } else {
      ElMessage.error(res.message || '查询失败')
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.pageNum = 1
  fetchOrderList()
}

// 重置搜索
const handleReset = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}

// 分页大小变化
const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchOrderList()
}

// 当前页变化
const handleCurrentChange = (val) => {
  pagination.pageNum = val
  fetchOrderList()
}

// 跳转到订单详情页面
const handleViewOrder = (order) => {
  router.push(`/order-detail/${order.DOCNO}`)
}

// 导出数据
const handleExport = () => {
  ElMessage.success('导出功能开发中')
}

// 初始化
onMounted(() => {
  fetchOrderList()
})
</script>

<style scoped lang="less">
.order-container {
  padding: 20px;
  
  .search-card {
    margin-bottom: 20px;
    
    .search-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .search-title {
        font-size: 16px;
        font-weight: bold;
      }
    }
    
    .search-form {
      .el-form-item {
        margin-bottom: 18px;
      }
    }
  }
  
  .table-card {
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .table-title {
        font-size: 16px;
        font-weight: bold;
      }
      
      .table-actions {
        display: flex;
        gap: 10px;
      }
    }
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>