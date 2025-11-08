<template>
  <div class="voucher-edit-container">
    <el-card class="edit-card" shadow="never">
      <template #header>
        <div class="edit-header">
          <span class="edit-title">编辑优惠券</span>
          <div class="edit-actions">
            <el-button @click="handleBack">
              <el-icon><ArrowLeft /></el-icon>
              返回
            </el-button>
            <el-button type="primary" @click="handleSave">
              <el-icon><Check /></el-icon>
              保存
            </el-button>
          </div>
        </div>
      </template>

      <el-form 
        ref="formRef" 
        :model="form" 
        :rules="rules" 
        label-width="120px"
        class="edit-form"
      >
        <el-form-item label="优惠券ID" prop="VOUCHERS_NO">
          <el-input v-model="form.VOUCHERS_NO" disabled />
        </el-form-item>

        <el-form-item label="优惠券名称" prop="ENAME">
          <el-input v-model="form.ENAME" placeholder="请输入优惠券名称" />
        </el-form-item>

        <el-form-item label="优惠券种类" prop="VOU_TYPE">
          <el-select v-model="form.VOU_TYPE" placeholder="请选择优惠券种类" style="width: 100%">
            <el-option label="满减券" value="1" />
            <el-option label="折扣券" value="2" />
            <el-option label="兑换券" value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="优惠券面额" prop="AMT_DISCOUNT">
          <el-input-number 
            v-model="form.AMT_DISCOUNT" 
            :precision="2" 
            :step="10" 
            :min="0"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="是否有效" prop="IS_VALID">
          <el-switch
            v-model="form.IS_VALID"
            active-value="Y"
            inactive-value="N"
            active-text="有效"
            inactive-text="无效"
          />
        </el-form-item>

        <el-form-item label="生效时间" prop="CREATIONDATE">
          <el-date-picker
            v-model="form.CREATIONDATE"
            type="datetime"
            placeholder="选择生效时间"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="失效时间" prop="VALID_DATE">
          <el-date-picker
            v-model="form.VALID_DATE"
            type="datetime"
            placeholder="选择失效时间"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Check } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const formRef = ref()

// 表单数据
const form = reactive({
  VOUCHERS_NO: '',
  ENAME: '',
  VOU_TYPE: '',
  AMT_DISCOUNT: 0,
  IS_VALID: 'Y',
  CREATIONDATE: '',
  VALID_DATE: ''
})

// 表单验证规则
const rules = {
  ENAME: [
    { required: true, message: '请输入优惠券名称', trigger: 'blur' }
  ],
  VOU_TYPE: [
    { required: true, message: '请选择优惠券种类', trigger: 'change' }
  ],
  AMT_DISCOUNT: [
    { required: true, message: '请输入优惠券面额', trigger: 'blur' }
  ],
  CREATIONDATE: [
    { required: true, message: '请选择生效时间', trigger: 'change' }
  ],
  VALID_DATE: [
    { required: true, message: '请选择失效时间', trigger: 'change' }
  ]
}

// 获取优惠券详情
const fetchVoucherDetail = async () => {
  const voucherId = route.query.id || route.params.id
  if (!voucherId) {
    ElMessage.error('缺少优惠券ID')
    return
  }
  
  try {
    // 这里应该调用获取优惠券详情的API
    // const res = await getVoucherDetail(voucherId)
    // if (res.code === 200) {
    //   Object.assign(form, res.data)
    // } else {
    //   ElMessage.error(res.message || '获取优惠券详情失败')
    // }
    
    // 模拟数据
    Object.assign(form, {
      VOUCHERS_NO: voucherId,
      ENAME: '测试优惠券',
      VOU_TYPE: '1',
      AMT_DISCOUNT: 100,
      IS_VALID: 'Y',
      CREATIONDATE: '2023-01-01 00:00:00',
      VALID_DATE: '2023-12-31 23:59:59'
    })
  } catch (error) {
    console.error('获取优惠券详情失败:', error)
    ElMessage.error('获取优惠券详情失败')
  }
}

// 保存
const handleSave = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    // 这里应该调用更新优惠券的API
    // const res = await updateVoucher(form)
    // if (res.code === 200) {
    //   ElMessage.success('保存成功')
    //   router.push('/voucher')
    // } else {
    //   ElMessage.error(res.message || '保存失败')
    // }
    
    ElMessage.success('保存成功')
    router.push('/voucher')
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 返回
const handleBack = () => {
  router.push('/voucher')
}

// 初始化
onMounted(() => {
  fetchVoucherDetail()
})
</script>

<style scoped lang="less">
.voucher-edit-container {
  padding: 20px;
  
  .edit-card {
    .edit-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .edit-title {
        font-size: 16px;
        font-weight: bold;
      }
      
      .edit-actions {
        display: flex;
        gap: 10px;
      }
    }
    
    .edit-form {
      max-width: 600px;
      margin: 0 auto;
    }
  }
}
</style>