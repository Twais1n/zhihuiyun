<template>
  <div class="member-container">
    <el-card class="search-card" shadow="never">
      <el-form
        ref="searchFormRef"
        :model="searchForm"
        :inline="true"
        label-width="110px"
        class="search-form"
      >
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="会员姓名">
              <el-input
                v-model="searchForm.vipname"
                placeholder="请输入会员姓名"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号">
              <el-input
                v-model="searchForm.mobil"
                placeholder="请输入手机号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="会员卡号">
              <el-input
                v-model="searchForm.cardno"
                placeholder="请输入会员卡号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="导购顾问">
              <el-select
                v-model="searchForm.salesperson"
                placeholder="请选择导购"
                filterable
                clearable
                :loading="salespersonLoading"
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
        </el-row>

        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="客户类型">
              <el-select v-model="searchForm.memberType" placeholder="全部" clearable>
                <el-option label="全部" value="" />
                <el-option label="会员" value="2" />
                <el-option label="非会员" value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="会员状态">
              <el-radio-group v-model="searchForm.vipState">
                <el-radio value="">全部</el-radio>
                <el-radio value="Y">正常</el-radio>
                <el-radio value="N">冻结</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="手机号（批量）">
              <el-input
                v-model="searchForm.phoneList"
                type="textarea"
                :rows="2"
                placeholder="手机号，支持多个，用逗号分隔"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="线下会员卡号">
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
            <el-form-item label="是否有标签">
              <el-select v-model="searchForm.hasTag" placeholder="全部" clearable>
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
            <el-form-item label="注册时间">
              <el-date-picker
                v-model="searchForm.registerTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%;"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="导购更新时间">
              <el-date-picker
                v-model="searchForm.guideUpdateTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%;"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="数据创建时间">
              <el-date-picker
                v-model="searchForm.dataCreateTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%;"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最近消费时间">
              <el-date-picker
                v-model="searchForm.recentConsumeTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%;"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="累计消费次数">
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
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="未沟通天数">
              <el-select v-model="searchForm.notCommunicatedDays" placeholder="请选择" clearable>
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
            <el-form-item label="是否微信好友">
              <el-select v-model="searchForm.wechatFriend" placeholder="全部" clearable>
                <el-option
                  v-for="item in yesNoOptions"
                  :key="`wechat-${item.value || 'all'}`"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否企微好友">
              <el-select v-model="searchForm.enterpriseWechatFriend" placeholder="全部" clearable>
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

        <div class="form-actions">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </div>
      </el-form>
    </el-card>

    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="table-header">
          <span class="table-title">客户列表（高级）</span>
        </div>
      </template>

      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="cardNo" label="会员卡号" width="140" align="center">
          <template #default="scope">
            <el-button type="primary" link @click="handleViewMemberDetail(scope.row)">
              {{ scope.row.cardNo }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="signUpStore" label="注册门店" min-width="150" />
        <el-table-column prop="mobil" label="手机号" width="140" align="center" />
        <el-table-column prop="vipname" label="会员姓名" width="120" align="center" />
        <el-table-column prop="enterDate" label="注册时间" width="150" align="center">
          <template #default="scope">
            {{ formatDate(scope.row.enterDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="vipState" label="会员状态" width="120" align="center" />
      </el-table>

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
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getCustomerList, getSalespersonList } from '../api/customer'

type DateRange = [string, string] | []

const searchFormRef = ref()
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

const salespersonOptions = ref<Record<string, any>[]>([])
const salespersonLoading = ref(false)

const searchForm = reactive({
  vipname: '',
  mobil: '',
  cardno: '',
  salesperson: '',
  memberType: '',
  vipState: '',
  phoneList: '',
  offlineCardNo: '',
  hasTag: '',
  registerTime: [] as DateRange,
  guideUpdateTime: [] as DateRange,
  dataCreateTime: [] as DateRange,
  recentConsumeTime: [] as DateRange,
  cumulativeConsumeOperator: '',
  cumulativeConsumeValue: '',
  notCommunicatedDays: '',
  wechatFriend: '',
  enterpriseWechatFriend: ''
})

const tableData = ref<Record<string, any>[]>([])
const loading = ref(false)
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const appendRangeParams = (
  range: DateRange,
  startKey: string,
  endKey: string,
  params: Record<string, unknown>
) => {
  if (Array.isArray(range) && range.length === 2 && range[0] && range[1]) {
    params[startKey] = range[0]
    params[endKey] = range[1]
  }
}

const formatDate = (date: string | number) => {
  if (!date) return '-'
  if (/^\d{8}$/.test(String(date))) {
    const str = String(date)
    return `${str.substring(0, 4)}-${str.substring(4, 6)}-${str.substring(6, 8)}`
  }
  const d = new Date(date)
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString('zh-CN')
}

const getSalespersonOptions = async () => {
  try {
    salespersonLoading.value = true
    const response = await getSalespersonList()
    if (response.code === 200) {
      salespersonOptions.value = response.data || []
    } else {
      ElMessage.error(response.message || '获取导购顾问失败')
    }
  } catch (err) {
    console.error('获取导购顾问失败', err)
    ElMessage.error('获取导购顾问失败，请稍后再试')
  } finally {
    salespersonLoading.value = false
  }
}

const getMemberList = async () => {
  try {
    loading.value = true
    const params: Record<string, unknown> = {
      vipname: searchForm.vipname?.trim(),
      mobil: searchForm.mobil?.trim(),
      cardno: searchForm.cardno?.trim(),
      salesperson: searchForm.salesperson || undefined,
      memberType: searchForm.memberType || undefined,
      vipState: searchForm.vipState || undefined,
      phoneList: searchForm.phoneList?.trim(),
      offlineCardNo: searchForm.offlineCardNo?.trim(),
      hasTag: searchForm.hasTag || undefined,
      cumulativeConsumeOperator: searchForm.cumulativeConsumeOperator || undefined,
      cumulativeConsumeValue: searchForm.cumulativeConsumeValue !== '' ? Number(searchForm.cumulativeConsumeValue) : undefined,
      notCommunicatedDays: searchForm.notCommunicatedDays || undefined,
      wechatFriend: searchForm.wechatFriend || undefined,
      enterpriseWechatFriend: searchForm.enterpriseWechatFriend || undefined,
      page: pagination.page,
      pageSize: pagination.pageSize
    }

    appendRangeParams(searchForm.registerTime, 'registerStart', 'registerEnd', params)
    appendRangeParams(searchForm.guideUpdateTime, 'guideUpdateStart', 'guideUpdateEnd', params)
    appendRangeParams(searchForm.dataCreateTime, 'dataCreateStart', 'dataCreateEnd', params)
    appendRangeParams(searchForm.recentConsumeTime, 'recentConsumeStart', 'recentConsumeEnd', params)

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
      ElMessage.error(response.message || '获取客户列表失败')
    }
  } catch (error) {
    console.error('获取客户列表失败', error)
    ElMessage.error('获取数据失败，请稍后再试')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  getMemberList()
}

const resetSearchForm = () => {
  searchForm.vipname = ''
  searchForm.mobil = ''
  searchForm.cardno = ''
  searchForm.salesperson = ''
  searchForm.memberType = ''
  searchForm.vipState = ''
  searchForm.phoneList = ''
  searchForm.offlineCardNo = ''
  searchForm.hasTag = ''
  searchForm.registerTime = []
  searchForm.guideUpdateTime = []
  searchForm.dataCreateTime = []
  searchForm.recentConsumeTime = []
  searchForm.cumulativeConsumeOperator = ''
  searchForm.cumulativeConsumeValue = ''
  searchForm.notCommunicatedDays = ''
  searchForm.wechatFriend = ''
  searchForm.enterpriseWechatFriend = ''
}

const handleReset = () => {
  searchFormRef.value?.resetFields?.()
  resetSearchForm()
  pagination.page = 1
  getMemberList()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  getMemberList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  getMemberList()
}

const handleViewMemberDetail = (row: Record<string, any>) => {
  if (!row?.id && !row?.cardno && !row?.cardNo) {
    return
  }
  const identifier = row.id || row.cardno || row.cardNo
  router.push(`/member-detail/${identifier}`)
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
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 16px;
  }
  :deep(.el-form-item__label) {
    font-weight: 600;
    color: #303133;
  }
}

.consume-frequency-field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-actions {
  margin-top: 10px;
}

.table-card {
  border-radius: 8px;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-title {
  font-size: 16px;
  font-weight: 600;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
