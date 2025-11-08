<template>
  <div class="goods-container">
    <!-- 搜索表单 -->
    <el-card class="search-card" shadow="never">
      <template #header>
        <div class="search-header">
          <span class="search-title">商品查询</span>
        </div>
      </template>
      
      <el-form 
        ref="searchFormRef" 
        :model="searchForm" 
        :inline="true" 
        class="search-form"
      >
        <el-form-item label="商品编码" prop="name">
          <el-input 
            v-model="searchForm.name" 
            placeholder="请输入商品编码"
            clearable
            style="width: 180px;"
          />
        </el-form-item>

        <el-form-item label="商品名称" prop="value">
          <el-input 
            v-model="searchForm.value" 
            placeholder="请输入商品名称"
            clearable
            style="width: 180px;"
          />
        </el-form-item>

        <el-form-item label="SKU编码" prop="sku_code">
          <el-input 
            v-model="searchForm.sku_code" 
            placeholder="请输入SKU编码"
            clearable
            style="width: 180px;"
          />
        </el-form-item>

        <el-form-item label="商品分类" prop="ATTRIBNAME">
          <el-input 
            v-model="searchForm.ATTRIBNAME" 
            placeholder="请输入商品分类"
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
          <span class="table-title">商品列表</span>
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
        <el-table-column prop="name" label="商品编码" width="150" align="center" />
        <el-table-column prop="value" label="商品名称" min-width="180" />
        <el-table-column prop="sku_code" label="SKU编码" width="150" align="center" />
        <el-table-column prop="ATTRIBNAME" label="商品分类" width="150" align="center" />
        <el-table-column prop="value1" label="颜色" width="120" align="center" />
        <el-table-column prop="value2" label="尺寸" width="120" align="center" />
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
import { getGoodsList } from '@/api/goods'

// 搜索表单
const searchFormRef = ref()
const searchForm = reactive({
  name: '',          // 商品编码
  value: '',         // 商品名称
  sku_code: '',      // SKU编码
  ATTRIBNAME: ''     // 商品分类
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

// 获取商品列表
const fetchGoodsList = async () => {
  loading.value = true
  try {
    // 构建请求参数，根据接口文档
    const params = {
      name: searchForm.name || undefined,          // 商品编码
      value: searchForm.value || undefined,        // 商品名称
      sku_code: searchForm.sku_code || undefined, // SKU编码
      ATTRIBNAME: searchForm.ATTRIBNAME || undefined, // 商品分类
      pageNum: pagination.pageNum,                 // 页码
      pageSize: pagination.pageSize                // 每页条数
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
    
    const res = await getGoodsList(params)
    if (res.code === 200) {
        tableData.value = res.data.list || []
        pagination.total = res.data.total || 0
    } else {
      ElMessage.error(res.message || '查询失败')
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.pageNum = 1
  fetchGoodsList()
}

// 重置搜索
const handleReset = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}

// 分页大小变化
const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchGoodsList()
}

// 当前页变化
const handleCurrentChange = (val) => {
  pagination.pageNum = val
  fetchGoodsList()
}

// 导出数据
const handleExport = () => {
  ElMessage.success('导出功能开发中')
}

// 初始化
onMounted(() => {
  fetchGoodsList()
})
</script>

<style scoped lang="less">
.goods-container {
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