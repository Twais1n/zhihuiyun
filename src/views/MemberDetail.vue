<template>
  <div class="member-detail-container">
    <el-card class="detail-card" shadow="never">
      <template #header>
        <div class="detail-header">
          <span class="detail-title">会员详情</span>
          <div class="detail-actions">
            <el-button @click="handleBack">
              <el-icon><ArrowLeft /></el-icon>
              返回列表
            </el-button>
          </div>
        </div>
      </template>

      <div v-loading="loading">
        <!-- 会员数据卡片 -->
        <el-card class="info-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">会员数据</span>
            </div>
          </template>
          
          <el-descriptions :column="3" border>
            <el-descriptions-item label="手机号">
              <div class="item-with-action">
                <span>{{ memberInfo.mobil }}</span>
                <el-button type="primary" link size="small" @click="handleEditPhone">
                  <el-icon><Edit /></el-icon>
                  修改
                </el-button>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="线下会员卡号">{{ memberInfo.cardno }}</el-descriptions-item>
            <el-descriptions-item label="会员等级">
              <div class="item-with-action">
                <el-tag :type="getVipLevelType(memberInfo.vipLevel)">{{ memberInfo.vipLevel }}</el-tag>
                <el-button type="primary" link size="small" @click="handleAdjustVipLevel">
                  <el-icon><Edit /></el-icon>
                  调整
                </el-button>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="注册门店">{{ memberInfo.storename }}</el-descriptions-item>
            <el-descriptions-item label="所属导购">{{ memberInfo.guideName }}</el-descriptions-item>
            <el-descriptions-item label="注册渠道">{{ memberInfo.registerChannel }}</el-descriptions-item>
            <el-descriptions-item label="注册类型">{{ memberInfo.registerType }}</el-descriptions-item>
            <el-descriptions-item label="注册时间">{{ formatDate(memberInfo.ENTERDATE) }}</el-descriptions-item>
            <el-descriptions-item label="数据创建时间">{{ formatDate(memberInfo.createTime) }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 个人信息卡片 -->
        <el-card class="info-card" shadow="never" style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <span class="card-title">个人信息</span>
            </div>
          </template>
          
          <el-tabs v-model="activeTab">
            <el-tab-pane label="会员基础资料" name="basic">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="姓名">{{ memberInfo.vipname }}</el-descriptions-item>
                <el-descriptions-item label="性别">{{ getGenderText(memberInfo.sex) }}</el-descriptions-item>
                <el-descriptions-item label="生日">{{ formatDate(memberInfo.birthday) }}</el-descriptions-item>
                <el-descriptions-item label="年龄">{{ memberInfo.age }}</el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>
            
            <el-tab-pane label="微信信息" name="wechat">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="小程序ID">{{ memberInfo.miniProgramId }}</el-descriptions-item>
                <el-descriptions-item label="微信昵称">{{ memberInfo.wechatNickname }}</el-descriptions-item>
                <el-descriptions-item label="微信头像">
                  <el-avatar v-if="memberInfo.wechatAvatar" :src="memberInfo.wechatAvatar" />
                  <span v-else>未设置</span>
                </el-descriptions-item>
                <el-descriptions-item label="绑定状态">
                  <el-tag :type="memberInfo.wechatBound ? 'success' : 'info'">
                    {{ memberInfo.wechatBound ? '已绑定' : '未绑定' }}
                  </el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>
          </el-tabs>
        </el-card>

        <!-- 个人记录列表 -->
        <el-card class="info-card" shadow="never" style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <span class="card-title">个人记录</span>
            </div>
          </template>
          
          <el-tabs v-model="recordTab">
            <el-tab-pane label="历史订单列表" name="orders">
              <el-table :data="orderList" border style="width: 100%;">
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="orderNo" label="订单编号" width="150" />
                <el-table-column prop="orderDate" label="下单时间" width="120">
                  <template #default="scope">
                    {{ formatDate(scope.row.orderDate) }}
                  </template>
                </el-table-column>
                <el-table-column prop="amount" label="订单金额" width="100" align="right">
                  <template #default="scope">
                    ¥{{ scope.row.amount?.toFixed(2) }}
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="订单状态" width="100" align="center">
                  <template #default="scope">
                    <el-tag :type="getOrderStatusType(scope.row.status)">
                      {{ getOrderStatusText(scope.row.status) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center">
                  <template #default="scope">
                    <el-button type="primary" link @click="handleViewOrder(scope.row)">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
              
              <div class="pagination-container" style="margin-top: 20px;">
                <el-pagination
                  v-model:current-page="orderPagination.pageNum"
                  v-model:page-size="orderPagination.pageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  :total="orderPagination.total"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleOrderSizeChange"
                  @current-change="handleOrderCurrentChange"
                />
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="历史退单列表" name="refunds">
              <el-table :data="refundList" border style="width: 100%;">
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="refundNo" label="退单编号" width="150" />
                <el-table-column prop="orderNo" label="原订单编号" width="150" />
                <el-table-column prop="refundDate" label="退单时间" width="120">
                  <template #default="scope">
                    {{ formatDate(scope.row.refundDate) }}
                  </template>
                </el-table-column>
                <el-table-column prop="amount" label="退单金额" width="100" align="right">
                  <template #default="scope">
                    ¥{{ scope.row.amount?.toFixed(2) }}
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="退单状态" width="100" align="center">
                  <template #default="scope">
                    <el-tag :type="getRefundStatusType(scope.row.status)">
                      {{ getRefundStatusText(scope.row.status) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center">
                  <template #default="scope">
                    <el-button type="primary" link @click="handleViewRefund(scope.row)">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
              
              <div class="pagination-container" style="margin-top: 20px;">
                <el-pagination
                  v-model:current-page="refundPagination.pageNum"
                  v-model:page-size="refundPagination.pageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  :total="refundPagination.total"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleRefundSizeChange"
                  @current-change="handleRefundCurrentChange"
                />
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="优惠券列表" name="vouchers">
              <el-table :data="voucherList" border style="width: 100%;">
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="voucherNo" label="优惠券编号" width="150" />
                <el-table-column prop="voucherName" label="优惠券名称" min-width="150" />
                <el-table-column prop="amount" label="面额" width="100" align="right">
                  <template #default="scope">
                    ¥{{ scope.row.amount?.toFixed(2) }}
                  </template>
                </el-table-column>
                <el-table-column prop="validFrom" label="有效期起" width="120">
                  <template #default="scope">
                    {{ formatDate(scope.row.validFrom) }}
                  </template>
                </el-table-column>
                <el-table-column prop="validTo" label="有效期至" width="120">
                  <template #default="scope">
                    {{ formatDate(scope.row.validTo) }}
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100" align="center">
                  <template #default="scope">
                    <el-tag :type="getVoucherStatusType(scope.row.status)">
                      {{ getVoucherStatusText(scope.row.status) }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
              
              <div class="pagination-container" style="margin-top: 20px;">
                <el-pagination
                  v-model:current-page="voucherPagination.pageNum"
                  v-model:page-size="voucherPagination.pageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  :total="voucherPagination.total"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleVoucherSizeChange"
                  @current-change="handleVoucherCurrentChange"
                />
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="积分列表" name="points">
              <el-table :data="pointsList" border style="width: 100%;">
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="pointsNo" label="积分编号" width="150" />
                <el-table-column prop="points" label="积分数量" width="100" align="right">
                  <template #default="scope">
                    <span :class="scope.row.points > 0 ? 'points-plus' : 'points-minus'">
                      {{ scope.row.points > 0 ? '+' : '' }}{{ scope.row.points }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="balance" label="积分余额" width="100" align="right">
                  <template #default="scope">
                    {{ scope.row.balance }}
                  </template>
                </el-table-column>
                <el-table-column prop="reason" label="积分原因" min-width="150" />
                <el-table-column prop="createDate" label="获取/使用时间" width="120">
                  <template #default="scope">
                    {{ formatDate(scope.row.createDate) }}
                  </template>
                </el-table-column>
              </el-table>
              
              <div class="pagination-container" style="margin-top: 20px;">
                <el-pagination
                  v-model:current-page="pointsPagination.pageNum"
                  v-model:page-size="pointsPagination.pageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  :total="pointsPagination.total"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handlePointsSizeChange"
                  @current-change="handlePointsCurrentChange"
                />
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="会员变更日志" name="logs">
              <el-timeline>
                <el-timeline-item
                  v-for="(log, index) in memberLogs"
                  :key="index"
                  :timestamp="formatDate(log.createTime)"
                  :type="getLogType(log.action)"
                >
                  {{ log.content }}
                </el-timeline-item>
              </el-timeline>
              
              <div class="pagination-container" style="margin-top: 20px;">
                <el-pagination
                  v-model:current-page="logPagination.pageNum"
                  v-model:page-size="logPagination.pageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  :total="logPagination.total"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleLogSizeChange"
                  @current-change="handleLogCurrentChange"
                />
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </el-card>

    <!-- 修改手机号对话框 -->
    <el-dialog
      v-model="phoneDialogVisible"
      title="修改手机号"
      width="500px"
    >
      <el-form :model="phoneForm" :rules="phoneRules" ref="phoneFormRef" label-width="100px">
        <el-form-item label="原手机号">
          <el-input v-model="memberInfo.mobil" disabled />
        </el-form-item>
        <el-form-item label="新手机号" prop="newPhone">
          <el-input v-model="phoneForm.newPhone" placeholder="请输入新手机号" />
        </el-form-item>
        <el-form-item label="确认手机号" prop="confirmPhone">
          <el-input v-model="phoneForm.confirmPhone" placeholder="请再次输入新手机号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="phoneDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPhoneChange">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 调整会员等级对话框 -->
    <el-dialog
      v-model="vipLevelDialogVisible"
      title="调整会员等级"
      width="500px"
    >
      <el-form :model="vipLevelForm" :rules="vipLevelRules" ref="vipLevelFormRef" label-width="100px">
        <el-form-item label="当前等级">
          <el-tag :type="getVipLevelType(memberInfo.vipLevel)">{{ memberInfo.vipLevel }}</el-tag>
        </el-form-item>
        <el-form-item label="新等级" prop="newVipLevel">
          <el-select v-model="vipLevelForm.newVipLevel" placeholder="请选择会员等级">
            <el-option label="普通会员" value="普通会员" />
            <el-option label="银卡会员" value="银卡会员" />
            <el-option label="金卡会员" value="金卡会员" />
            <el-option label="钻石会员" value="钻石会员" />
            <el-option label="黑金会员" value="黑金会员" />
          </el-select>
        </el-form-item>
        <el-form-item label="调整原因" prop="reason">
          <el-input v-model="vipLevelForm.reason" type="textarea" placeholder="请输入调整原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="vipLevelDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitVipLevelChange">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Edit } from '@element-plus/icons-vue'
// 假设这些API函数已经存在
// import { getMemberDetail, updateMemberPhone, updateMemberVipLevel, getMemberOrders, getMemberRefunds, getMemberVouchers, getMemberPoints, getMemberLogs } from '@/api/member'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

// 会员信息
const memberInfo = reactive({
  mobil: '',
  cardno: '',
  vipLevel: '',
  storename: '',
  guideName: '',
  registerChannel: '',
  registerType: '',
  ENTERDATE: null,
  createTime: null,
  vipname: '',
  sex: '',
  birthday: null,
  age: '',
  miniProgramId: '',
  wechatNickname: '',
  wechatAvatar: '',
  wechatBound: false
})

// 标签页激活状态
const activeTab = ref('basic')
const recordTab = ref('orders')

// 修改手机号对话框
const phoneDialogVisible = ref(false)
const phoneFormRef = ref()
const phoneForm = reactive({
  newPhone: '',
  confirmPhone: ''
})
const phoneRules = {
  newPhone: [
    { required: true, message: '请输入新手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  confirmPhone: [
    { required: true, message: '请再次输入新手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

// 调整会员等级对话框
const vipLevelDialogVisible = ref(false)
const vipLevelFormRef = ref()
const vipLevelForm = reactive({
  newVipLevel: '',
  reason: ''
})
const vipLevelRules = {
  newVipLevel: [
    { required: true, message: '请选择会员等级', trigger: 'change' }
  ],
  reason: [
    { required: true, message: '请输入调整原因', trigger: 'blur' }
  ]
}

// 历史订单列表
const orderList = ref([])
const orderPagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 历史退单列表
const refundList = ref([])
const refundPagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 优惠券列表
const voucherList = ref([])
const voucherPagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 积分列表
const pointsList = ref([])
const pointsPagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 会员变更日志
const memberLogs = ref([])
const logPagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 获取会员详情
const fetchMemberDetail = async () => {
  const memberId = route.params.id
  if (!memberId) {
    ElMessage.error('会员ID不存在')
    return
  }

  loading.value = true
  try {
    // 模拟API调用
    // const res = await getMemberDetail(memberId)
    // Object.assign(memberInfo, res.data)
    
    // 模拟数据
    Object.assign(memberInfo, {
      mobil: '13800138000',
      cardno: 'VIP20230001',
      vipLevel: '金卡会员',
      storename: '北京旗舰店',
      guideName: '张导购',
      registerChannel: '线下门店',
      registerType: '普通注册',
      ENTERDATE: new Date('2023-01-15'),
      createTime: new Date('2023-01-15T10:30:00'),
      vipname: '张三',
      sex: '1',
      birthday: new Date('1990-05-20'),
      age: '33',
      miniProgramId: 'wx_miniprogram_001',
      wechatNickname: '张三的微信',
      wechatAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      wechatBound: true
    })
    
    // 加载各个列表数据
    fetchMemberOrders()
    fetchMemberRefunds()
    fetchMemberVouchers()
    fetchMemberPoints()
    fetchMemberLogs()
  } catch (error) {
    console.error('获取会员详情失败:', error)
    ElMessage.error('获取会员详情失败')
  } finally {
    loading.value = false
  }
}

// 获取会员订单列表
const fetchMemberOrders = async () => {
  try {
    // 模拟API调用
    // const res = await getMemberOrders(memberId, orderPagination)
    // orderList.value = res.data.list
    // orderPagination.total = res.data.total
    
    // 模拟数据
    orderList.value = [
      {
        orderNo: 'ORD20230001',
        orderDate: new Date('2023-06-15'),
        amount: 299.00,
        status: 'completed'
      },
      {
        orderNo: 'ORD20230002',
        orderDate: new Date('2023-07-20'),
        amount: 599.00,
        status: 'completed'
      }
    ]
    orderPagination.total = 2
  } catch (error) {
    console.error('获取会员订单列表失败:', error)
    ElMessage.error('获取会员订单列表失败')
  }
}

// 获取会员退单列表
const fetchMemberRefunds = async () => {
  try {
    // 模拟API调用
    // const res = await getMemberRefunds(memberId, refundPagination)
    // refundList.value = res.data.list
    // refundPagination.total = res.data.total
    
    // 模拟数据
    refundList.value = [
      {
        refundNo: 'REF20230001',
        orderNo: 'ORD20230003',
        refundDate: new Date('2023-08-10'),
        amount: 199.00,
        status: 'completed'
      }
    ]
    refundPagination.total = 1
  } catch (error) {
    console.error('获取会员退单列表失败:', error)
    ElMessage.error('获取会员退单列表失败')
  }
}

// 获取会员优惠券列表
const fetchMemberVouchers = async () => {
  try {
    // 模拟API调用
    // const res = await getMemberVouchers(memberId, voucherPagination)
    // voucherList.value = res.data.list
    // voucherPagination.total = res.data.total
    
    // 模拟数据
    voucherList.value = [
      {
        voucherNo: 'VOU20230001',
        voucherName: '满100减10优惠券',
        amount: 10.00,
        validFrom: new Date('2023-09-01'),
        validTo: new Date('2023-10-31'),
        status: 'valid'
      },
      {
        voucherNo: 'VOU20230002',
        voucherName: '满200减30优惠券',
        amount: 30.00,
        validFrom: new Date('2023-08-15'),
        validTo: new Date('2023-09-15'),
        status: 'expired'
      }
    ]
    voucherPagination.total = 2
  } catch (error) {
    console.error('获取会员优惠券列表失败:', error)
    ElMessage.error('获取会员优惠券列表失败')
  }
}

// 获取会员积分列表
const fetchMemberPoints = async () => {
  try {
    // 模拟API调用
    // const res = await getMemberPoints(memberId, pointsPagination)
    // pointsList.value = res.data.list
    // pointsPagination.total = res.data.total
    
    // 模拟数据
    pointsList.value = [
      {
        pointsNo: 'PTS20230001',
        points: 100,
        balance: 100,
        reason: '注册赠送',
        createDate: new Date('2023-01-15')
      },
      {
        pointsNo: 'PTS20230002',
        points: 50,
        balance: 150,
        reason: '购物积分',
        createDate: new Date('2023-02-20')
      },
      {
        pointsNo: 'PTS20230003',
        points: -30,
        balance: 120,
        reason: '积分兑换',
        createDate: new Date('2023-03-10')
      }
    ]
    pointsPagination.total = 3
  } catch (error) {
    console.error('获取会员积分列表失败:', error)
    ElMessage.error('获取会员积分列表失败')
  }
}

// 获取会员变更日志
const fetchMemberLogs = async () => {
  try {
    // 模拟API调用
    // const res = await getMemberLogs(memberId, logPagination)
    // memberLogs.value = res.data.list
    // logPagination.total = res.data.total
    
    // 模拟数据
    memberLogs.value = [
      {
        action: 'register',
        content: '会员注册',
        createTime: new Date('2023-01-15T10:30:00')
      },
      {
        action: 'vip_upgrade',
        content: '会员等级从普通会员升级为银卡会员',
        createTime: new Date('2023-03-20T14:15:00')
      },
      {
        action: 'vip_upgrade',
        content: '会员等级从银卡会员升级为金卡会员',
        createTime: new Date('2023-06-10T11:30:00')
      },
      {
        action: 'wechat_bind',
        content: '绑定微信小程序',
        createTime: new Date('2023-07-05T16:45:00')
      }
    ]
    logPagination.total = 4
  } catch (error) {
    console.error('获取会员变更日志失败:', error)
    ElMessage.error('获取会员变更日志失败')
  }
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

// 获取性别文本
const getGenderText = (sex) => {
  return sex === '1' ? '男' : sex === '2' ? '女' : '-'
}

// 获取会员等级类型
const getVipLevelType = (level) => {
  const levelMap = {
    '普通会员': 'info',
    '银卡会员': '',
    '金卡会员': 'warning',
    '钻石会员': 'success',
    '黑金会员': 'danger'
  }
  return levelMap[level] || 'info'
}

// 获取订单状态类型
const getOrderStatusType = (status) => {
  const statusMap = {
    'pending': 'warning',
    'paid': 'primary',
    'completed': 'success',
    'cancelled': 'info',
    'refunding': 'warning',
    'refunded': 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取订单状态文本
const getOrderStatusText = (status) => {
  const statusMap = {
    'pending': '待支付',
    'paid': '已支付',
    'completed': '已完成',
    'cancelled': '已取消',
    'refunding': '退款中',
    'refunded': '已退款'
  }
  return statusMap[status] || status
}

// 获取退单状态类型
const getRefundStatusType = (status) => {
  const statusMap = {
    'pending': 'warning',
    'processing': 'primary',
    'completed': 'success',
    'rejected': 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取退单状态文本
const getRefundStatusText = (status) => {
  const statusMap = {
    'pending': '待处理',
    'processing': '处理中',
    'completed': '已完成',
    'rejected': '已拒绝'
  }
  return statusMap[status] || status
}

// 获取优惠券状态类型
const getVoucherStatusType = (status) => {
  const statusMap = {
    'valid': 'success',
    'used': 'info',
    'expired': 'warning',
    'invalid': 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取优惠券状态文本
const getVoucherStatusText = (status) => {
  const statusMap = {
    'valid': '有效',
    'used': '已使用',
    'expired': '已过期',
    'invalid': '已失效'
  }
  return statusMap[status] || status
}

// 获取日志类型
const getLogType = (action) => {
  const actionMap = {
    'register': 'success',
    'vip_upgrade': 'warning',
    'vip_downgrade': 'danger',
    'wechat_bind': 'primary',
    'wechat_unbind': 'info',
    'phone_change': 'warning',
    'info_update': 'primary'
  }
  return actionMap[action] || 'info'
}

// 返回列表
const handleBack = () => {
  router.go(-1)
}

// 修改手机号
const handleEditPhone = () => {
  phoneForm.newPhone = ''
  phoneForm.confirmPhone = ''
  phoneDialogVisible.value = true
}

// 提交手机号修改
const submitPhoneChange = () => {
  phoneFormRef.value?.validate(async (valid) => {
    if (valid) {
      if (phoneForm.newPhone !== phoneForm.confirmPhone) {
        ElMessage.error('两次输入的手机号不一致')
        return
      }
      
      try {
        // 模拟API调用
        // await updateMemberPhone(memberInfo.id, phoneForm.newPhone)
        
        memberInfo.mobil = phoneForm.newPhone
        phoneDialogVisible.value = false
        ElMessage.success('手机号修改成功')
      } catch (error) {
        console.error('修改手机号失败:', error)
        ElMessage.error('修改手机号失败')
      }
    }
  })
}

// 调整会员等级
const handleAdjustVipLevel = () => {
  vipLevelForm.newVipLevel = ''
  vipLevelForm.reason = ''
  vipLevelDialogVisible.value = true
}

// 提交会员等级调整
const submitVipLevelChange = () => {
  vipLevelFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        // 模拟API调用
        // await updateMemberVipLevel(memberInfo.id, vipLevelForm.newVipLevel, vipLevelForm.reason)
        
        memberInfo.vipLevel = vipLevelForm.newVipLevel
        vipLevelDialogVisible.value = false
        ElMessage.success('会员等级调整成功')
        
        // 刷新日志
        fetchMemberLogs()
      } catch (error) {
        console.error('调整会员等级失败:', error)
        ElMessage.error('调整会员等级失败')
      }
    }
  })
}

// 查看订单详情
const handleViewOrder = (row) => {
  router.push(`/order-detail/${row.orderNo}`)
}

// 查看退单详情
const handleViewRefund = (row) => {
  router.push(`/refund-detail/${row.refundNo}`)
}

// 订单分页大小改变
const handleOrderSizeChange = (size) => {
  orderPagination.pageSize = size
  orderPagination.pageNum = 1
  fetchMemberOrders()
}

// 订单页码改变
const handleOrderCurrentChange = (page) => {
  orderPagination.pageNum = page
  fetchMemberOrders()
}

// 退单分页大小改变
const handleRefundSizeChange = (size) => {
  refundPagination.pageSize = size
  refundPagination.pageNum = 1
  fetchMemberRefunds()
}

// 退单页码改变
const handleRefundCurrentChange = (page) => {
  refundPagination.pageNum = page
  fetchMemberRefunds()
}

// 优惠券分页大小改变
const handleVoucherSizeChange = (size) => {
  voucherPagination.pageSize = size
  voucherPagination.pageNum = 1
  fetchMemberVouchers()
}

// 优惠券页码改变
const handleVoucherCurrentChange = (page) => {
  voucherPagination.pageNum = page
  fetchMemberVouchers()
}

// 积分分页大小改变
const handlePointsSizeChange = (size) => {
  pointsPagination.pageSize = size
  pointsPagination.pageNum = 1
  fetchMemberPoints()
}

// 积分页码改变
const handlePointsCurrentChange = (page) => {
  pointsPagination.pageNum = page
  fetchMemberPoints()
}

// 日志分页大小改变
const handleLogSizeChange = (size) => {
  logPagination.pageSize = size
  logPagination.pageNum = 1
  fetchMemberLogs()
}

// 日志页码改变
const handleLogCurrentChange = (page) => {
  logPagination.pageNum = page
  fetchMemberLogs()
}

// 页面加载时获取数据
onMounted(() => {
  fetchMemberDetail()
})
</script>

<style scoped lang="scss">
.member-detail-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.detail-card {
  border-radius: 8px;
  
  .detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .detail-title {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }
  }
}

.info-card {
  border-radius: 8px;
  
  .card-header {
    display: flex;
    align-items: center;
    
    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }
}

.item-with-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .el-button {
    margin-left: 10px;
  }
}

.points-plus {
  color: #67c23a;
  font-weight: bold;
}

.points-minus {
  color: #f56c6c;
  font-weight: bold;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>