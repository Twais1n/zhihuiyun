<template>
  <div class="voucher-container">
    <!-- 搜索表单 -->
    <el-card class="search-card" shadow="never">
      <template #header>
        <div class="search-header">
          <span class="search-title">优惠券查询</span>
        </div>
      </template>
      
      <el-form 
        ref="searchFormRef" 
        :model="searchForm" 
        :inline="true" 
        class="search-form"
      >
        <el-form-item label="优惠券名称" prop="ENAME">
          <el-input 
            v-model="searchForm.ENAME" 
            placeholder="请输入优惠券名称"
            clearable
            style="width: 180px;"
          />
        </el-form-item>

        <el-form-item label="优惠券ID" prop="VOUCHERS_NO">
          <el-input 
            v-model="searchForm.VOUCHERS_NO" 
            placeholder="请输入优惠券ID"
            clearable
            style="width: 180px;"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="table-header">
          <span class="table-title">优惠券列表</span>
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
        <el-table-column prop="ename" label="优惠券名称" min-width="150" align="center" />
        <el-table-column prop="VOUCHERS_NO" label="优惠券ID" width="150" align="center" />
        <el-table-column prop="VOU_TYPE" label="种类" width="100" align="center" />
        <el-table-column prop="AMT_DISCOUNT" label="优惠券面额" width="120" align="center">
          <template #default="scope">
            ¥{{ scope.row.AMT_DISCOUNT?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="IS_VALID" label="是否有效" width="100" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.IS_VALID === 'Y' ? 'success' : 'danger'">
              {{ scope.row.IS_VALID === 'Y' ? '有效' : '无效' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="CREATIONDATE" label="生效时间" width="150" align="center">
          <template #default="scope">
            {{ formatDate(scope.row.CREATIONDATE) }}
          </template>
        </el-table-column>
        <el-table-column prop="VALID_DATE" label="失效时间" width="150" align="center">
          <template #default="scope">
            {{ formatDate(scope.row.VALID_DATE) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" align="center" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="success" size="small" @click="handleAnalyze(scope.row)">
              <el-icon><DataAnalysis /></el-icon>
              分析
            </el-button>
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
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Refresh, Download, Edit, DataAnalysis } from '@element-plus/icons-vue'
import { getVoucherList } from '@/api/voucher'

// 路由
const router = useRouter()

// 搜索表单
const searchFormRef = ref()
const searchForm = reactive({
  ENAME: '',         // 优惠券名称
  VOUCHERS_NO: ''    // 优惠券ID
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

// 获取优惠券列表
const fetchVoucherList = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...searchForm
    }
    
    const res = await getVoucherList(params)
    if (res.code === 200) {
        tableData.value = res.data.list || []
        pagination.total = res.data.total || 0
    } else {
      ElMessage.error(res.message || '查询失败')
    }
  } catch (error) {
    console.error('获取优惠券列表失败:', error)
    ElMessage.error('获取优惠券列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.pageNum = 1
  fetchVoucherList()
}

// 重置搜索
const handleReset = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}

// 分页大小变化
const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchVoucherList()
}

// 当前页变化
const handleCurrentChange = (val) => {
  pagination.pageNum = val
  fetchVoucherList()
}

// 导出数据
const handleExport = () => {
  ElMessage.success('导出功能开发中')
}

// 编辑优惠券
const handleEdit = (row) => {
  // 跳转到编辑页面，传递优惠券ID
  // 这里使用路由跳转，假设编辑页面路由为 /voucher/edit/:id
  router.push({
    path: `/voucher-edit/${row.VOUCHERS_NO}`,
    query: { id: row.VOUCHERS_NO }
  })
}

// 分析优惠券
const handleAnalyze = (row) => {
  // 跳转到分析页面，传递优惠券ID
  // 这里使用路由跳转，假设分析页面路由为 /voucher/analyze/:id
  router.push({
    path: `/voucher-analyze/${row.VOUCHERS_NO}`,
    query: { id: row.VOUCHERS_NO }
  })
}

// 初始化
onMounted(() => {
  fetchVoucherList()
})
</script>

<style scoped lang="less">
.voucher-container {
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