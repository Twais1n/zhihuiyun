<template>
  <div class="member-container">
    

    <!-- 搜索表单 -->
    <el-card class="search-card" shadow="never">
      
      <el-form 
        ref="searchFormRef" 
        :model="searchForm" 
        :inline="true" 
        class="search-form"
      >
        <el-form-item label="VIP类型" prop="c_vip_name">
          <el-select 
            v-model="searchForm.c_vip_name" 
            placeholder="请选择VIP类型"
            clearable
            style="width: 180px;"
          >
            <el-option label="普通会员" value="普通会员" />
            <el-option label="银卡会员" value="银卡会员" />
            <el-option label="金卡会员" value="金卡会员" />
            <el-option label="钻石会员" value="钻石会员" />
            <el-option label="黑金会员" value="黑金会员" />
          </el-select>
        </el-form-item>

        <el-form-item label="开卡店仓" prop="c_store_name">
          <el-input 
            v-model="searchForm.c_store_name" 
            placeholder="请输入开卡店仓"
            clearable
            style="width: 180px;"
          />
        </el-form-item>

        <el-form-item label="会员姓名" prop="vipname">
          <el-input 
            v-model="searchForm.vipname" 
            placeholder="请输入会员姓名"
            clearable
            style="width: 180px;"
          />
        </el-form-item>

        <el-form-item label="手机号码" prop="mobil">
          <el-input 
            v-model="searchForm.mobil" 
            placeholder="请输入手机号码"
            clearable
            style="width: 180px;"
          />
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <el-select 
            v-model="searchForm.sex" 
            placeholder="请选择性别"
            clearable
            style="width: 180px;"
          >
            <el-option label="男" value="1" />
            <el-option label="女" value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="注册时间" prop="ENTERDATE">
          <el-date-picker
            v-model="searchForm.ENTERDATE"
            type="date"
            placeholder="请选择注册时间"
            value-format="YYYYMMDD"
            style="width: 180px;"
          />
        </el-form-item>

      
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="table-header">
          <span class="table-title">会员列表</span>
          <div class="table-actions">
            <el-button type="primary" @click="handleSearch" >
              <el-icon><Search /></el-icon>
              查询
            </el-button>
            <el-button @click="handleReset">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
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
        <el-table-column prop="cardno" label="会员卡号" width="120" align="center">
          <template #default="scope">
            <el-button type="primary" link @click="handleViewMemberDetail(scope.row)">
              {{ scope.row.cardno }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="storename" label="注册门店" min-width="150" />
        <el-table-column prop="mobil" label="手机号码" width="120" align="center" />
        <el-table-column prop="vipname" label="会员姓名" width="100" align="center" />
      
        <el-table-column prop="ENTERDATE" label="注册时间" width="120" align="center">
          <template #default="scope">
            {{ formatDate(scope.row.ENTERDATE) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="handleView(scope.row)">
              查看
            </el-button>
            <el-button type="primary" link @click="handleEdit(scope.row)">
              编辑
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Download } from '@element-plus/icons-vue'
import { getCustomerList } from '@/api/customer'

const router = useRouter()

// 搜索表单
const searchFormRef = ref()
const searchForm = reactive({
  c_vip_name: '',      // VIP类型ID
  c_store_name: '',    // 开卡店仓ID
  vipname: '',         // 会员姓名
  mobil: '',           // 手机号码
  sex: '',             // 性别
  ENTERDATE: ''        // 注册时间
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
  return new Date(date).toLocaleDateString('zh-CN')
}

// 获取会员列表
const getMemberList = async () => {
  try {
    loading.value = true
    
    // 构建请求参数，根据接口文档
    const params = {
      c_vip_name: searchForm.c_vip_name || undefined,    // VIP类型ID
      c_store_name: searchForm.c_store_name || undefined, // 开卡店仓ID
      vipname: searchForm.vipname || undefined,          // 会员姓名
      mobil: searchForm.mobil || undefined,               // 手机号码
      sex: searchForm.sex || undefined,                   // 性别
      ENTERDATE: searchForm.ENTERDATE || undefined,      // 注册时间
      pageNum: pagination.pageNum,                        // 页码
      pageSize: pagination.pageSize                       // 每页条数
    }
    
    // 移除undefined的参数
    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === '') {
        delete params[key]
      }
    })
    
    const response = await getCustomerList(params)
    
    if (response.code === 200) {
      tableData.value = response.data.list || []
      pagination.total = response.data.total || 0
    } else {
      ElMessage.error(response.message || '获取会员列表失败')
    }
  } catch (error) {
    console.error('获取会员列表错误:', error)
    ElMessage.error('网络请求失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.pageNum = 1
  getMemberList()
}

// 重置
const handleReset = () => {
  searchFormRef.value?.resetFields()
  pagination.pageNum = 1
  getMemberList()
}

// 分页大小改变
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.pageNum = 1
  getMemberList()
}

// 页码改变
const handleCurrentChange = (page) => {
  pagination.pageNum = page
  getMemberList()
}

// 查看详情
const handleView = (row) => {
  ElMessage.info(`查看会员: ${row.vipname}`)
  // 实际项目中这里可以跳转到详情页面
}

// 查看会员详情
const handleViewMemberDetail = (row) => {
  // 跳转到会员详情页，传递会员ID
  router.push(`/member-detail/${row.id || row.cardno}`)
}

// 编辑
const handleEdit = (row) => {
  ElMessage.info(`编辑会员: ${row.vipname}`)
  // 实际项目中这里可以打开编辑对话框
}

// 导出数据
const handleExport = () => {
  ElMessage.info('导出功能开发中...')
  // 实际项目中这里可以实现数据导出功能
}

// 页面加载时获取数据
onMounted(() => {
  getMemberList()
})
</script>

<style scoped lang="scss">
.member-container {
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

// 响应式设计
@media (max-width: 1200px) {
  .search-form {
    :deep(.el-form-item) {
      margin-right: 12px;
    }
  }
}

@media (max-width: 768px) {
  .member-container {
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