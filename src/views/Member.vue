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
        <el-row>
          <el-col :span="7">
            <el-form-item label="会员姓名" prop="vipname" >
              <el-input
                v-model="searchForm.vipname"
                placeholder="请输入会员姓名"
                clearable
                style="width: 180px;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="手机号码" prop="mobil">
              <el-input
                v-model="searchForm.mobil"
                placeholder="请输入手机号"
                clearable
                style="width: 180px;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="会员卡号（智简）" prop="cardno">
              <el-input
                v-model="searchForm.cardno"
                placeholder="请输入会员卡号"
                clearable
                style="width: 180px;"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="7">
            <el-form-item label="所属导购" prop="salesperson">
              <el-select
                v-model="searchForm.salesperson"
                placeholder="请选择导购"
                clearable
                filterable
                :loading="salespersonLoading"
                style="width: 180px;"
              >
                <el-option
                  v-for="item in salespersonOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="客户类型" prop="memberType">
              <el-select
                v-model="searchForm.memberType"
                placeholder="请选择类型"
                clearable
                style="width: 180px;"
              >
                <el-option label="全部" value="1" />
                <el-option label="会员" value="2" />
                <el-option label="非会员" value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7" class="advanced-toggle">
            <el-link type="primary" @click="toggleAdvancedFilters">
              {{ advancedVisible ? '\u6536\u8d77\u9ad8\u7ea7\u7b5b\u9009' : '\u9ad8\u7ea7\u7b5b\u9009' }}
            </el-link>
            <el-link
              v-if="advancedVisible"
              type="info"
              @click="clearAdvancedFilters"
            >
              清空高级筛选
            </el-link>
          </el-col>

        </el-row>

        <transition name="fade">
          <div v-if="advancedVisible" class="advanced-panel">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="手机号" prop="phoneList">
                  <el-input
                    v-model="searchForm.phoneList"
                    type="textarea"
                    :rows="2"
                    placeholder="手机号, 支持多个, 用逗号分隔"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="线下会员卡号" prop="offlineCardNo">
                  <el-input
                    v-model="searchForm.offlineCardNo"
                    placeholder="请输入线下会员卡号"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="会员状态">
                  <el-radio-group v-model="radio">
                    <el-radio :value="3">全部</el-radio>
                    <el-radio :value="6">正常</el-radio>
                    <el-radio :value="9">冻结</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否有标签" prop="hasTag">
                  <el-select
                    v-model="searchForm.hasTag"
                    placeholder="全部"
                    clearable
                  >
                    <el-option
                      v-for="item in yesNoOptions"
                      :key="`tag-${item.value || 'all'}`"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="注册时间" prop="registerTime">
                  <el-date-picker
                    v-model="searchForm.registerTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="导购更新时间" prop="guideUpdateTime">
                  <el-date-picker
                    v-model="searchForm.guideUpdateTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="累计消费次数" prop="consumeFrequency">
                  <div class="consume-frequency-field">
                    <el-select
                      v-model="searchForm.cumulativeConsumeOperator"
                      placeholder="请选择"
                      style="width: 120px;"
                    >
                      <el-option
                        v-for="item in consumeOperatorOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-input
                      v-model="searchForm.cumulativeConsumeValue"
                      type="number"
                      placeholder="次数"
                      clearable
                      style="flex: 1;"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="数据创建时间" prop="dataCreateTime">
                  <el-date-picker
                    v-model="searchForm.dataCreateTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="最近消费时间" prop="recentConsumeTime">
                  <el-date-picker
                    v-model="searchForm.recentConsumeTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="未沟通天数" prop="notCommunicatedDays">
                  <el-select
                    v-model="searchForm.notCommunicatedDays"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in notCommunicatedOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否微信好友" prop="wechatFriend">
                  <el-select
                    v-model="searchForm.wechatFriend"
                    placeholder="全部"
                    clearable
                  >
                    <el-option
                      v-for="item in yesNoOptions"
                      :key="`wechat-${item.value || 'all'}`"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="是否企微好友" prop="enterpriseWechatFriend">
                  <el-select
                    v-model="searchForm.enterpriseWechatFriend"
                    placeholder="全部"
                    clearable
                  >
                    <el-option
                      v-for="item in yesNoOptions"
                      :key="`enterprise-${item.value || 'all'}`"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </transition>

      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="table-header">
          <span class="table-title">会员列表</span>
          <div class="table-actions">
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              查询
            </el-button>
            <el-button @click="handleReset">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
<!--            <el-button type="primary" @click="handleExport">-->
<!--              <el-icon><Download /></el-icon>-->
<!--              导出数据-->
<!--            </el-button>-->
          </div>
        </div>
      </template>

      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="cardNo" label="会员卡号" width="120" align="center">
          <template #default="scope">
            <el-button type="primary" link @click="handleViewMemberDetail(scope.row)">
              {{ scope.row.cardNo }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="signUpStore" label="开卡门店" min-width="150" />
        <el-table-column prop="mobil" label="手机号码" width="120" align="center" />
        <el-table-column prop="vipname" label="会员姓名" width="100" align="center" />
        <el-table-column prop="enterDate" label="注册时间" width="120" align="center">
          <template #default="scope">
            {{ formatDate(scope.row.enterDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="vipState" label="会员状态" width="100" align="center" />
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
          v-model:current-page="pagination.page"
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

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getCustomerList, getSalespersonList } from '../api/customer'

const radio = ref(3)
const advancedVisible = ref(false)
const router = useRouter()

const yesNoOptions = [
  { label: '全部', value: '' },
  { label: '是', value: 'Y' },
  { label: '否', value: 'N' }
]

const consumeOperatorOptions = [
  { label: '大于等于', value: '>=' },
  { label: '小于等于', value: '<=' },
  { label: '等于', value: '=' }
]

const notCommunicatedOptions = [
  { label: '7天内', value: '7' },
  { label: '15天内', value: '15' },
  { label: '30天内', value: '30' },
  { label: '30天以上', value: '30+' }
]

// 搜索表单
const searchFormRef = ref()
const searchForm = reactive({
  cVipName: '',
  cStoreName: '',
  vipname: '',
  mobil: '',
  sex: '',
  enterDate: '',
  cardno: '',
  salesperson: '',
  memberType: '',
  phoneList: '',
  hasTag: '',
  registerTime: [],
  guideUpdateTime: [],
  offlineCardNo: '',
  cumulativeConsumeOperator: '',
  cumulativeConsumeValue: '',
  dataCreateTime: [],
  recentConsumeTime: [],
  notCommunicatedDays: '',
  wechatFriend: '',
  enterpriseWechatFriend: ''
})

// 导购选项列表
const salespersonOptions = ref([])
const salespersonLoading = ref(false)

const getSalespersonOptions = async () => {
  try {
    salespersonLoading.value = true
    const response = await getSalespersonList()
    if (response.code === 200) {
      salespersonOptions.value = response.data || []
    } else {
      ElMessage.error(response.message || '获取导购列表失败')
    }
  } catch (error) {
    console.error('获取导购列表失败:', error)
    ElMessage.error('获取导购列表失败，请稍后再试')
  } finally {
    salespersonLoading.value = false
  }
}

const toggleAdvancedFilters = () => {
  advancedVisible.value = !advancedVisible.value
}

const clearAdvancedFilters = () => {
  searchForm.phoneList = ''
  searchForm.hasTag = ''
  searchForm.registerTime = []
  searchForm.guideUpdateTime = []
  searchForm.offlineCardNo = ''
  searchForm.cumulativeConsumeOperator = ''
  searchForm.cumulativeConsumeValue = ''
  searchForm.dataCreateTime = []
  searchForm.recentConsumeTime = []
  searchForm.notCommunicatedDays = ''
  searchForm.wechatFriend = ''
  searchForm.enterpriseWechatFriend = ''
}

const appendRangeParams = (range: string[] | undefined, startKey: string, endKey: string, params: Record<string, unknown>) => {
  if (Array.isArray(range) && range.length === 2 && range[0] && range[1]) {
    params[startKey] = range[0]
    params[endKey] = range[1]
  }
}


// 表格数据 & 分页配置
const tableData = ref([])
const loading = ref(false)
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 格式化日期
const formatDate = (date: string | number) => {
  if (!date) return '-'

  if (/^\d{8}$/.test(String(date))) {
    const str = String(date)
    const year = str.substring(0, 4)
    const month = str.substring(4, 6)
    const day = str.substring(6, 8)
    return `${year}-${month}-${day}`
  }

  const d = new Date(date)
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString('zh-CN')
}

// 获取会员列表
const getMemberList = async () => {
  try {
    loading.value = true

    const params: Record<string, unknown> = {
      vipname: searchForm.vipname || undefined,
      mobil: searchForm.mobil || undefined,
      cardno: searchForm.cardno || undefined,
      salesperson: searchForm.salesperson || undefined,
      memberType: searchForm.memberType || undefined,
      vipState: radio.value === 6 ? 'Y' : radio.value === 9 ? 'N' : undefined,
      page: pagination.page,
      pageSize: pagination.pageSize
    }

    if (searchForm.phoneList && searchForm.phoneList.trim()) {
      params.phoneList = searchForm.phoneList.trim()
    }
    if (searchForm.hasTag) {
      params.hasTag = searchForm.hasTag
    }
    appendRangeParams(searchForm.registerTime, 'registerStart', 'registerEnd', params)
    appendRangeParams(searchForm.guideUpdateTime, 'guideUpdateStart', 'guideUpdateEnd', params)
    if (searchForm.offlineCardNo && searchForm.offlineCardNo.trim()) {
      params.offlineCardNo = searchForm.offlineCardNo.trim()
    }
    if (searchForm.cumulativeConsumeOperator && searchForm.cumulativeConsumeValue !== '') {
      params.cumulativeConsumeOperator = searchForm.cumulativeConsumeOperator
      params.cumulativeConsumeValue = Number(searchForm.cumulativeConsumeValue)
    }
    appendRangeParams(searchForm.dataCreateTime, 'dataCreateStart', 'dataCreateEnd', params)
    appendRangeParams(searchForm.recentConsumeTime, 'recentConsumeStart', 'recentConsumeEnd', params)
    if (searchForm.notCommunicatedDays) {
      params.notCommunicatedDays = searchForm.notCommunicatedDays
    }
    if (searchForm.wechatFriend) {
      params.wechatFriend = searchForm.wechatFriend
    }
    if (searchForm.enterpriseWechatFriend) {
      params.enterpriseWechatFriend = searchForm.enterpriseWechatFriend
    }

    Object.keys(params).forEach((key) => {
      if (params[key] === undefined || params[key] === '') {
        delete params[key]
      }
    })

    const response = await getCustomerList(params)
    if (response.code === 200) {
      tableData.value = response.data.records || []
      pagination.total = response.data.total || 0
    } else {
      ElMessage.error(response.message || '获取会员列表失败')
    }
  } catch (error) {
    console.error('获取会员列表失败:', error)
    ElMessage.error('网络请求失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// 查询
const handleSearch = () => {
  pagination.page = 1
  getMemberList()
}

// 重置
const handleReset = () => {
  searchFormRef.value?.resetFields()
  clearAdvancedFilters()
  advancedVisible.value = false
  radio.value = 3
  pagination.page = 1
  getMemberList()
}

// 分页大小改变
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  getMemberList()
}

// 页码改变
const handleCurrentChange = (page: number) => {
  pagination.page = page
  getMemberList()
}

// 查看详情
const handleView = (row: Record<string, any>) => {
  ElMessage.info(`查看会员: ${row.vipname}`)
  // 可根据需求跳转到详情页
}

const handleViewMemberDetail = (row: Record<string, any>) => {
  router.push(`/member-detail/${row.id || row.cardno}`)
}

const handleEdit = (row: Record<string, any>) => {
  ElMessage.info(`编辑会员: ${row.vipname}`)
}

const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

onMounted(() => {
  getMemberList()
  getSalespersonOptions()
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
  :deep(.el-form-item__label) {
    font-weight: 600;
    color: #303133;
  }
}

.advanced-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 100%;
}

.advanced-panel {
  margin-top: 12px;
  padding: 12px 16px 4px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  background-color: #f9fafc;
}

.consume-frequency-field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
