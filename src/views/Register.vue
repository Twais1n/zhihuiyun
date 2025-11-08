<template>
  <div class="register-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration"></div>
    
    <!-- 注册卡片 -->
    <div class="register-card">
      <!-- 品牌区域 -->
      <div class="brand-section">
        <div class="logo">
          <el-icon class="icon"><User /></el-icon>
        </div>
        <h1 class="system-name">用户注册</h1>
        <p class="system-desc">加入智能会员管理系统</p>
      </div>
      
      <!-- 注册表单 -->
      <el-form 
        ref="registerFormRef" 
        :model="registerForm" 
        :rules="registerRules" 
        class="register-form"
      >
        <el-form-item prop="username">
          <el-input 
            v-model="registerForm.username" 
            placeholder="请输入5-16位用户名"
            prefix-icon="User"
            size="large"
          ></el-input>
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input 
            v-model="registerForm.password" 
            type="password" 
            placeholder="请输入5-16位密码"
            prefix-icon="Lock"
            size="large"
            show-password
          >
            <template #suffix>
              <el-icon @click="showPassword = !showPassword">
                <View v-show="!showPassword" />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item prop="confirmPassword">
          <el-input 
            v-model="registerForm.confirmPassword" 
            type="password" 
            placeholder="请确认密码"
            prefix-icon="Lock"
            size="large"
          ></el-input>
        </el-form-item>
        
        <el-form-item prop="email">
          <el-input 
            v-model="registerForm.email" 
            placeholder="请输入邮箱"
            prefix-icon="Message"
            size="large"
          ></el-input>
        </el-form-item>
        
        <el-form-item prop="phone">
          <el-input 
            v-model="registerForm.phone" 
            placeholder="请输入11位电话号码"
            prefix-icon="Phone"
            size="large"
          ></el-input>
        </el-form-item>
        
        <el-button 
          type="primary" 
          size="large" 
          :loading="loading" 
          @click="handleRegister"
          class="register-btn"
        >
          注册
        </el-button>
        
        <div class="login-section">
          <span>已有账号?</span>
          <el-link type="primary" @click="goToLogin">立即登录</el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Lock, Message, Phone, View } from '@element-plus/icons-vue';
import { RegisterApi } from '@/api/register';

const router = useRouter();
const registerFormRef = ref(null);
const loading = ref(false);
const showPassword = ref(false);

const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  phone: ''
});

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 16, message: '用户名长度在5到16个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 16, message: '密码长度在5到16个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.value.password) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号', trigger: 'blur' }
  ]
};

const handleRegister = async () => {
  try {
    await registerFormRef.value.validate();
    loading.value = true;
    
    const response = await RegisterApi({
      username: registerForm.value.username,
      password: registerForm.value.password,
      email: registerForm.value.email,
      phone: registerForm.value.phone
    });

    if (response.code === 200) {
      ElMessage.success('注册成功');
      router.push('/login');
    } else {
      ElMessage.error(response.message || '注册失败');
    }
  } catch (error) {
    ElMessage.error('注册请求失败');
    console.error('注册错误:', error);
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped lang="less">
.register-container {
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

.register-card {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  z-index: 1;
  transition: all 0.3s ease;
}

.register-card:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.brand-section {
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

.register-form {
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }
}

.register-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  margin-bottom: 20px;
}

.login-section {
  text-align: center;
  font-size: 14px;
  color: #86909C;
  
  .el-link {
    margin-left: 8px;
  }
}
</style>