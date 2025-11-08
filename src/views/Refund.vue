<template>
  <div class="refund-container">
    <!-- 搜索表单 -->
    <el-card class="search-card" shadow="never">
      <template #header>
        <div class="search-header">
          <span class="search-title">退单查询</span>
        </div>
      </template>
      
      <el-form 
        ref="searchFormRef" 
        :model="searchForm" 
        :inline="true" 
        class="search-form"
      >
        <el-form-item label="退单编号" prop="refundNo">
          <el-input 
            v-model="searchForm.refundNo" 
            placeholder="请输入退单编号"
            clearable
            style="width: 180px;"
          />
        </el-form-item>

        <el-form-item label="订单编号" prop="orderNo">
          <el-input 
            v-model="searchForm.orderNo" 
            placeholder="请输入订单编号"
            clearable
            style="width: 180px;"
          />
        </el-form-item>

        <el-form-item label="退单时间" prop="refundDate">
          <el-date-picker
            v-model="searchForm.refundDate"
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
          <span class="table-title">退单列表</span>
          <div class="table-actions">
            <el-button type="primary" @click="handleSearch" >
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
        :data="tableData" 
        v-loading="loading"
        stripe
        border
        style="width: 100%;"
      >
        <el-table-column prop="refundNo" label="退单编号" width="150" align="center" />
        <el-table-column prop="orderNo" label="订单编号" width="150" align="center" />
        <el-table-column prop="refundAmount" label="退单金额" width="120" align="center">
          <template #default="scope">
            ¥{{ scope.row.refundAmount?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="refundDate" label="退单时间" width="150" align="center">
          <template #default="scope">
            {{ formatDate(scope.row.refundDate) }}
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
import { getRefundList } from '@/api/refund'

// 搜索表单
const searchFormRef = ref()
const searchForm = reactive({
  refundNo: '',
  orderNo: '',
  refundDate: []
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

// 获取退单列表
const fetchRefundList = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...searchForm
    }
    
    // 处理退单时间范围
    if (searchForm.refundDate && searchForm.refundDate.length === 2) {
      params.startDate = searchForm.refundDate[0]
      params.endDate = searchForm.refundDate[1]
    }
    delete params.refundDate
    
    const res = await getRefundList(params)
    tableData.value = res.data.list || []
    pagination.total = res.data.total || 0
  } catch (error) {
    console.error('获取退单列表失败:', error)
    ElMessage.error('获取退单列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.pageNum = 1
  fetchRefundList()
}

// 重置搜索
const handleReset = () => {
  searchFormRef.value?.resetFields()
  searchForm.refundDate = []
  handleSearch()
}

// 分页大小变化
const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchRefundList()
}

// 当前页变化
const handleCurrentChange = (val) => {
  pagination.pageNum = val
  fetchRefundList()
}

// 导出数据
const handleExport = () => {
  ElMessage.success('导出功能开发中')
}

// 初始化
onMounted(() => {
  fetchRefundList()
})
</script>

<style scoped lang="less">
.refund-container {
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