<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration"></div>
    
    <!-- 登录卡片 -->
    <div class="login-card">
      <!-- 品牌区域 -->
      <div class="brand-section">
        <div class="logo">
          <el-icon class="icon"><Lock /></el-icon>
        </div>
        <h1 class="system-name">智能会员管理系统</h1>
        <p class="system-desc">高效、安全的后台管理解决方案</p>
      </div>
      
      <!-- 登录表单 -->
      <el-form 
        ref="loginFormRef" 
        :model="loginForm" 
        :rules="loginRules" 
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="请输入用户名"
            prefix-icon="User"
            size="large"
          ></el-input>
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码"
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
        
        <div class="form-actions">
          <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
          <el-link type="primary" @click="handleForgotPassword">忘记密码?</el-link>
        </div>
        
        <el-button 
          type="primary" 
          size="large" 
          :loading="loading" 
          @click="handleLogin"
          class="login-btn"
        >
          登录
        </el-button>
        
        <div class="register-section">
          <span>还没有账号?</span>
          <el-link type="primary" @click="goToRegister">立即注册</el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Lock, User, View, Hide } from '@element-plus/icons-vue';
import { LoginApi } from '@/api/log';

const router = useRouter();
const loginFormRef = ref(null);
const loading = ref(false);
const showPassword = ref(false);

const loginForm = ref({
  username: '',
  password: '',
  remember: false
});

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3到20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
  ]
};

const handleLogin = async () => {
  try {
    await loginFormRef.value.validate();
    loading.value = true;
    
    const response = await LoginApi({
      username: loginForm.value.username,
      password: loginForm.value.password
    });

    if (response.code === 200) {
      localStorage.setItem('loginUser', JSON.stringify({
        token: response.data.token
      }));
      ElMessage.success('登录成功');
      router.push('/');
    } else {
      ElMessage.error(response.message || '登录失败');
    }
  } catch (error) {
    ElMessage.error('登录请求失败');
    console.error('登录错误:', error);
  } finally {
    loading.value = false;
  }
};

const handleForgotPassword = () => {
  ElMessage.info('请联系管理员重置密码');
};

const goToRegister = () => {
  router.push('/register');
};
</script>

<style scoped lang="less">
.login-container {
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

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  z-index: 1;
  transition: all 0.3s ease;
}

.login-card:hover {
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

.login-form {
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  margin-bottom: 20px;
}

.register-section {
  text-align: center;
  font-size: 14px;
  color: #86909C;
  
  .el-link {
    margin-left: 8px;
  }
}
</style>