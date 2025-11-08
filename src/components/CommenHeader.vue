<template>
  <div class="header-container">
    <!-- 左侧系统名称和折叠按钮 -->
    <div class="left-section">
      <el-button 
        class="collapse-btn" 
        :icon="store.state.isCollapse ? 'Expand' : 'Fold'" 
        @click="handleCollapse"
        size="small"
      />
      <div class="brand">

        <span class="system-name" v-if="!isMobile">智能会员管理系统</span>
      </div>
    </div>

    <!-- 中间部分：搜索框 (只在大屏幕显示) -->
    <div class="middle-section" v-if="!isMobile">
      <div class="search-container">
        <el-input
          v-model="searchText"
          placeholder="搜索功能、会员、订单..."
          :prefix-icon="Search"
          size="default"
          class="search-input"
          @keyup.enter="handleSearch"
        />
      </div>
    </div>

    <!-- 右侧功能区 -->
    <div class="right-section">
      <!-- 通知图标 -->
      <el-button
        icon="Bell"
        class="header-btn"
        size="small"
        v-if="!isMobile"
      />
      
      <!-- 消息图标 -->
      <el-button
        icon="Message"
        class="header-btn"
        size="small"
        v-if="!isMobile"
      />
      
      <!-- 设置图标 -->
      <el-button
        icon="Setting"
        class="header-btn"
        size="small"
        v-if="!isMobile"
      />
      
      <!-- 用户信息 -->
      <div class="user-dropdown">
        <div class="user-info" @click="toggleUserMenu">
          <el-avatar class="user-avatar" :size="32">
            {{ user.name?.substring(0, 2) || '用' }}
          </el-avatar>
          <span class="user-name" v-if="!isMobile">{{ user.name || '操作员' }}</span>
        </div>
        
        <!-- 用户菜单 -->
        <div class="user-menu" v-if="showUserMenu">
          <div class="menu-item" @click="changePassword">修改密码</div>
          <div class="menu-item logout-item" @click="logout">退出登录</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAllDataStore } from '@/stores/index.js'
import { Fold, Expand, Bell, Message, Setting, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 路由和状态管理
const router = useRouter()
const store = useAllDataStore()

// 状态管理
const user = ref({ name: '' })
const searchText = ref('')
const showUserMenu = ref(false)
const isMobile = computed(() => window.innerWidth < 768)

// 折叠侧边栏
const handleCollapse = () => {
  store.state.isCollapse = !store.state.isCollapse
}

// 搜索处理
const handleSearch = () => {
  if (searchText.value.trim()) {
    ElMessage.info(`搜索: ${searchText.value}`)
    // 实际项目中这里可以实现搜索逻辑
  }
}

// 用户操作
const logout = () => {
  ElMessageBox.confirm('确定退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(async () => {
        // 退出登录
        localStorage.removeItem('loginUser')
        router.push('/login')
        ElMessage.success('退出成功')
     })
     .catch(() => {
        console.log('取消')
     })
}

const changePassword = () => {
  router.push('/change-password')
}

// 用户菜单显示切换
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// 点击外部关闭用户菜单
const handleClickOutside = (event) => {
  if (!event.target.closest('.user-dropdown')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  const loginUser = JSON.parse(localStorage.getItem('loginUser'))
  if (loginUser && loginUser.name) {
    user.value.name = loginUser.name
  }
  
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="less">
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 16px;
  background: linear-gradient(90deg, #409eff 0%, #66b1ff 100%); /* 蓝色渐变背景 */
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

/* 左侧区域 */
.left-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.collapse-btn {
  color: white; /* 白色图标 */
  border: none;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    color: white;
  }
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #409eff;
  font-weight: bold;
  font-size: 16px;
}

.system-name {
  font-size: 16px;
  font-weight: 500;
  color: white;
  white-space: nowrap;
}

/* 中间区域 */
.middle-section {
  flex: 1;
  max-width: 400px;
  margin: 0 20px;
}

.search-container {
  position: relative;
}

.search-input {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
    background: white;
  }
  
  &:focus {
    border-color: #409eff;
    background: white;
  }
}

/* 右侧区域 */
.right-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-btn {
  color: white;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    color: white;
  }
}

.user-dropdown {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}

.user-avatar {
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: white;
  color: #409eff;
  transition: all 0.3s ease;
  
  .user-info:hover & {
    border-color: white;
  }
}

.user-name {
  font-size: 14px;
  color: white;
  white-space: nowrap;
}

/* 用户菜单 */
.user-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 4px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  min-width: 120px;
  overflow: hidden;
  z-index: 1000;
}

.menu-item {
  padding: 10px 16px;
  color: #303133;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  
  &:hover {
    background: #f5f7fa;
  }
}

.logout-item {
  color: #f56c6c;
  
  &:hover {
    background: #fef0f0;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-container {
    padding: 0 12px;
  }
  
  .middle-section {
    display: none;
  }
  
  .right-section {
    gap: 4px;
  }
  
  .header-btn:not(.user-avatar) {
    display: none;
  }
}
</style>
