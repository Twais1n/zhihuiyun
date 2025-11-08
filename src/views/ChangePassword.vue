<template>
  <div class="change-password-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration"></div>
    
    <!-- 修改密码卡片 -->
    <div class="password-card">
      <!-- 标题区域 -->
      <div class="title-section">
        <div class="logo">
          <el-icon class="icon"><Lock /></el-icon>
        </div>
        <h1 class="system-name">修改密码</h1>
        <p class="system-desc">请设置新的登录密码</p>
      </div>
      
      <!-- 修改密码表单 -->
      <el-form 
        ref="passwordFormRef" 
        :model="passwordForm" 
        :rules="passwordRules" 
        class="password-form"
      >
        <el-form-item prop="oldPassword">
          <el-input 
            v-model="passwordForm.oldPassword" 
            type="password" 
            placeholder="请输入当前密码"
            prefix-icon="Lock"
            size="large"
            show-password
          >
            <template #suffix>
              <el-icon @click="showOldPassword = !showOldPassword">
                <View v-show="!showOldPassword" />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item prop="newPassword">
          <el-input 
            v-model="passwordForm.newPassword" 
            type="password" 
            placeholder="请输入新密码"
            prefix-icon="Lock"
            size="large"
            show-password
          >
            <template #suffix>
              <el-icon @click="showNewPassword = !showNewPassword">
                <View v-show="!showNewPassword" />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item prop="confirmPassword">
          <el-input 
            v-model="passwordForm.confirmPassword" 
            type="password" 
            placeholder="请确认新密码"
            prefix-icon="Lock"
            size="large"
            show-password
          >
            <template #suffix>
              <el-icon @click="showConfirmPassword = !showConfirmPassword">
                <View v-show="!showConfirmPassword" />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-button 
          type="primary" 
          size="large" 
          :loading="loading" 
          @click="handleChangePassword"
          class="change-btn"
        >
          确认修改
        </el-button>
        
        <div class="back-section">
          <el-link type="primary" @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            返回首页
          </el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Lock, View, ArrowLeft } from '@element-plus/icons-vue';
import { ChangePasswordApi } from '@/api/user';

const router = useRouter();
const passwordFormRef = ref(null);
const loading = ref(false);
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 密码验证规则
const validatePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else if (value.length < 6) {
    callback(new Error('密码长度不能少于6个字符'));
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(value)) {
    callback(new Error('密码必须包含大小写字母和数字'));
  } else {
    callback();
  }
};

const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请确认密码'));
  } else if (value !== passwordForm.value.newPassword) {
    callback(new Error('两次输入密码不一致'));
  } else {
    callback();
  }
};

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
};

// 修改密码逻辑
const handleChangePassword = async () => {
  try {
    await passwordFormRef.value.validate();
    loading.value = true;
    
    const response = await ChangePasswordApi({
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword
    });

    if (response.code === 200) {
      ElMessage.success('密码修改成功');
      
      // 清空表单
      passwordFormRef.value.resetFields();
      
      // 延迟跳转，让用户看到成功消息
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } else {
      ElMessage.error(response.message || '密码修改失败');
    }
  } catch (error) {
    console.error('修改密码错误:', error);
    if (error.response && error.response.status === 401) {
      ElMessage.error('当前密码错误，请重新输入');
    } else {
      ElMessage.error('网络请求失败，请检查网络连接');
    }
  } finally {
    loading.value = false;
  }
};

// 返回首页
const goBack = () => {
  router.push('/');
};
</script>

<style scoped lang="less">
.change-password-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  position: relative;
  overflow: hidden;
}

.bg-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(22, 93, 255, 0.05) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(22, 93, 255, 0.05) 0%, transparent 40%);
}

.password-card {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  z-index: 1;
  transition: all 0.3s ease;
}

.password-card:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.title-section {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 60px;
  height: 60px;
  margin: 0 auto 15px;
  background-color: #e8f3ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo .icon {
  font-size: 28px;
  color: #165DFF;
}

.system-name {
  font-size: 24px;
  font-weight: 600;
  color: #1D2129;
  margin-bottom: 8px;
}

.system-desc {
  color: #86909C;
  font-size: 14px;
}

.password-form {
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }
}

.change-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  margin-bottom: 20px;
}

.back-section {
  text-align: center;
  font-size: 14px;
  color: #86909C;
  
  .el-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
}

// 响应式设计
@media (max-width: 480px) {
  .password-card {
    margin: 20px;
    padding: 30px 20px;
  }
  
  .title-section {
    margin-bottom: 20px;
  }
}
</style>