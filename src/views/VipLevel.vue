<template>
  <div class="vip-level-container">
    
    <!-- 搜索表单 -->
    <el-card class="search-card" shadow="never">
      <template #header>
        <div class="search-header">
          <span class="search-title">会员等级查询</span>
        </div>
      </template>
      
      <el-form 
        ref="searchFormRef" 
        :model="searchForm" 
        :inline="true" 
        class="search-form"
      >
        <el-form-item label="编号" prop="code">
          <el-input 
            v-model="searchForm.code" 
            placeholder="请输入编号"
            clearable
            style="width: 180px;"
          />
        </el-form-item>

        <el-form-item label="VIP类型名称" prop="name">
          <el-input 
            v-model="searchForm.name" 
            placeholder="请输入VIP类型名称"
            clearable
            style="width: 180px;"
          />
        </el-form-item>

        <el-form-item label="是否允许升级" prop="canupgrade">
          <el-select 
            v-model="searchForm.canupgrade" 
            placeholder="请选择"
            clearable
            style="width: 180px;"
          >
            <el-option label="允许" value="Y" />
            <el-option label="不允许" value="N" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch" :loading="loading">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="table-header">
          <span class="table-title">会员等级列表</span>
          <div class="table-actions">
            <el-button type="primary" @click="handleExport">
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
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="code" label="编号" width="120" align="center" />
        <el-table-column prop="name" label="VIP类型名称" min-width="150" />
        <el-table-column prop="discount" label="默认折扣" width="120" align="center">
          <template #default="scope">
            {{ formatDiscount(scope.row.discount) }}
          </template>
        </el-table-column>
        <el-table-column prop="integralrate" label="积分比例" width="120" align="center">
          <template #default="scope">
            {{ formatRate(scope.row.integralrate) }}
          </template>
        </el-table-column>
        <el-table-column prop="defaultvalid" label="积分有效期(月)" width="140" align="center" />
        <el-table-column prop="canupgrade" label="允许升级" width="100" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.canupgrade === 'Y' ? 'success' : 'danger'">
              {{ scope.row.canupgrade === 'Y' ? '允许' : '不允许' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amt_lst" label="累计消费" width="120" align="center">
          <template #default="scope">
            {{ formatCurrency(scope.row.amt_lst) }}
          </template>
        </el-table-column>
        <el-table-column prop="one_amt" label="一次性消费" width="120" align="center">
          <template #default="scope">
            {{ formatCurrency(scope.row.one_amt) }}
          </template>
        </el-table-column>
        <el-table-column prop="month_start" label="起始月份" width="100" align="center" />
        <el-table-column prop="peoplenum" label="人数" width="80" align="center" />
        
        
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Download } from '@element-plus/icons-vue'
import { getVipLevels } from '@/api/customer'

// 搜索表单
const searchFormRef = ref()
const searchForm = reactive({
  code: '',
  name: '',
  canupgrade: ''
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

// 格式化折扣
const formatDiscount = (discount) => {
  if (!discount) return '-';
  return `${(discount * 100).toFixed(0)}%`;
}

// 格式化比例
const formatRate = (rate) => {
  if (!rate) return '-';
  return `${(rate * 100).toFixed(2)}%`;
}

// 格式化金额
const formatCurrency = (amount) => {
  if (!amount) return '-';
  return `¥${parseFloat(amount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// 获取会员等级列表
const getVipLevelList = async () => {
  try {
    loading.value = true
    
    // 构建请求参数
    const params = {
      ...searchForm,
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize
    }
    
    const response = await getVipLevels(params)
    
    if (response.code === 200) {
      tableData.value = response.data.list || []
      pagination.total = response.data.total || 0
    } else {
      ElMessage.error(response.message || '获取会员等级列表失败')
    }
  } catch (error) {
    console.error('获取会员等级列表错误:', error)
    ElMessage.error('网络请求失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.pageNum = 1
  getVipLevelList()
}

// 重置
const handleReset = () => {
  searchFormRef.value?.resetFields()
  pagination.pageNum = 1
  getVipLevelList()
}

// 分页大小改变
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.pageNum = 1
  getVipLevelList()
}

// 页码改变
const handleCurrentChange = (page) => {
  pagination.pageNum = page
  getVipLevelList()
}

// 查看详情
const handleView = (row) => {
  ElMessage.info(`查看会员等级: ${row.name}`)
  // 实际项目中这里可以跳转到详情页面
}

// 编辑
const handleEdit = (row) => {
  ElMessage.info(`编辑会员等级: ${row.name}`)
  // 实际项目中这里可以打开编辑对话框
}

// 导出数据
const handleExport = () => {
  ElMessage.info('导出功能开发中...')
  // 实际项目中这里可以实现数据导出功能
}

// 页面加载时获取数据
onMounted(() => {
  getVipLevelList()
})
</script>

<style scoped lang="scss">
.vip-level-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.search-card {
  margin-bottom: 20px;
  border-radius: 8px;
  
  .search-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .search-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 16px;
    margin-right: 16px;
  }
}

.table-card {
  border-radius: 8px;
  
  .table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .table-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

// 响应式设计
@media (max-width: 1200px) {
  .search-form {
    :deep(.el-form-item) {
      margin-right: 12px;
    }
  }
}

@media (max-width: 768px) {
  .vip-level-container {
    padding: 15px;
  }
  
  .search-form {
    :deep(.el-form-item) {
      width: 100%;
      margin-right: 0;
      
      .el-form-item__content {
        width: 100%;
        
        .el-input,
        .el-select,
        .el-date-editor {
          width: 100% !important;
        }
      }
    }
  }
}
</style>