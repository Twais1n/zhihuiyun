<template>
  <el-aside class="aside" :width="width">
    <!-- 侧边栏内容区域 -->
    <div class="aside-content">
      
      <!-- 菜单项 -->
      <el-menu 
        :collapse="isCollapse" 
        router="true" 
        class="menu-container"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        background-color="transparent"
        text-color="#606266"
        active-text-color="#409eff"
        :default-active="$route.path"
      >
        <!-- 主导航 -->
        <div class="menu-group-title" v-if="!isCollapse">主导航</div>
        <el-menu-item 
          v-for="item in mainMenu" 
          :key="item.path"
          :index="item.path"
          :class="{ 'active-menu': $route.path === item.path }"
        >
          <component class="icons" :is="item.icon"></component>
          <span>{{ item.label }}</span>
        </el-menu-item>

        <!-- 系统管理 -->
        <div class="menu-group-title" v-if="!isCollapse">系统管理</div>
        <el-menu-item 
          v-for="item in systemMenu" 
          :key="item.path"
          :index="item.path"
          :class="{ 'active-menu': $route.path === item.path }"
        >
          <component class="icons" :is="item.icon"></component>
          <span>{{ item.label }}</span>
        </el-menu-item>

        <!-- 帮助与支持 -->
        
      </el-menu>
    </div>
  </el-aside>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAllDataStore } from '@/stores/index.js'


// 路由实例
const route = useRoute()
const store = useAllDataStore()

// 折叠提示状态
const showTooltip = ref(false)

// 主导航菜单
const mainMenu = ref([
  { "path": "/", "label": "主页", "icon": "HomeFilled", "url": "/" },
  { "path": "/member", "label": "会员管理", "icon": "User", "url": "/member" },
  { "path": "/order", "label": "订单管理", "icon": "List", "url": "/order" },
  { "path": "/goods", "label": "商品管理", "icon": "Goods", "url": "/goods" },
  { "path": "/refund", "label": "退款管理", "icon": "Money", "url": "/refund" },
  { "path": "/vip-level", "label": "会员等级", "icon": "Star", "url": "/vip-level" },
  { "path": "/voucher", "label": "优惠券管理", "icon": "Postcard", "url": "/voucher" }
])

// 系统管理菜单
const systemMenu = ref([
  { "path": "/data-analysis", "label": "数据分析", "icon": "TrendCharts", "url": "/data-analysis" },
  { "path": "/voucher-analyze", "label": "优惠券分析", "icon": "PieChart", "url": "/voucher-analyze" },
  { "path": "/system-settings", "label": "系统设置", "icon": "Setting", "url": "/system-settings" },
  { "path": "/operator", "label": "操作员管理", "icon": "User", "url": "/operator" },
  { "path": "/log", "label": "日志管理", "icon": "View", "url": "/log" }
])

// 帮助与支持菜单


// 响应式状态
const isCollapse = computed(() => store.state.isCollapse)
const width = computed(() => store.state.isCollapse ? '60px' : '220px')

// 鼠标悬停事件 - 用于折叠状态下的提示
const handleMouseEnter = () => {
  if (isCollapse.value) {
    showTooltip.value = true
  }
}

const handleMouseLeave = () => {
  showTooltip.value = false
}

// 点击折叠状态的侧边栏展开菜单
const handleAsideClick = () => {
  if (isCollapse.value) {
    store.state.isCollapse = false
  }
}

// 响应式调整
onMounted(() => {
  const handleResize = () => {
    // 在小屏幕上自动折叠侧边栏
    if (window.innerWidth < 1024 && !isCollapse.value) {
      store.state.isCollapse = true
    }
  }
  
  window.addEventListener('resize', handleResize)
  handleResize() // 初始化时检查
  
  // 清理事件监听
  return () => {
    window.removeEventListener('resize', handleResize)
  }
})
</script>

<style scoped lang="less">
/* 调整图标基础样式 - 增大折叠状态下的图标 */
.icons {
  width: 18px; 
  height: 18px; 
  transition: all 0.3s ease;
}

/* 侧边栏基础样式 */
.aside {
  height: 100%;
  background: #ffffff !important;
  border-right: 1px solid #e8e8e8;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* 菜单容器样式 */
.menu-container {
  flex: 1;
  border-right: none !important;
  background: transparent !important;
  padding-top: 16px;
  transition: all 0.3s ease;
  position: relative;
}

/* 菜单项分组标题 - 加粗字体并调整为蓝色调 */
.menu-group-title {
  font-size: 12px;
  color: #409eff; /* 蓝色 */
  padding: 0 20px;
  margin-bottom: 8px;
  margin-top: 20px;
  font-weight: 700; /* 加粗字体 */
  transition: all 0.3s ease;
}

/* 菜单项基础样式 - 增强蓝白主题 */
.el-menu-item {
  font-size: 14px;
  font-weight: 600; /* 加粗字体 */
  height: 44px;
  line-height: 44px;
  padding: 0 20px !important;
  color: #606266;
  margin: 0 !important;
  border-radius: 0 !important;
  position: relative;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  background: transparent;
  
  &:hover {
    background: #ecf5ff !important; /* 浅蓝色背景 */
    color: #409eff !important; /* 蓝色文字 */
    padding-left: 24px !important;
  }
  
  &.is-active {
    background: #409eff !important; /* 蓝色背景 */
    color: white !important; /* 白色文字 */
    padding-left: 24px !important;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 24px;
      background: white; /* 白色指示条 */
      border-radius: 0 3px 3px 0;
    }
  }
  
  .icons {
    color: #606266;
    font-size: 16px;
    transition: color 0.3s ease;
    margin-right: 12px;
  }
  
  &:hover .icons {
    color: #409eff !important; /* 悬停时蓝色图标 */
  }
  
  &.is-active .icons {
    color: white !important; /* 激活时白色图标 */
  }
}

/* 折叠状态样式 - 放大图标并调整为蓝白配色 */
.el-menu.is-collapsed {
  .el-menu-item {
    padding: 0 !important;
    text-align: center;
    border-radius: 6px !important;
    margin: 0 8px !important;
    
    &:hover {
      padding: 0 !important;
      background: #ecf5ff !important;
    }
    
    &.is-active {
      padding: 0 !important;
      background: #409eff !important; /* 蓝色背景 */
      color: white !important; /* 白色文字 */
      
      &::before {
        display: none;
      }
    }
    
    .icons {
      margin-right: 0;
      width: 24px; /* 放大折叠状态下的图标 */
      height: 24px; /* 放大折叠状态下的图标 */
      font-size: 20px; /* 放大折叠状态下的图标 */
    }
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .menu-container {
    padding-top: 12px;
  }
  
  .menu-group-title {
    margin-top: 16px;
    margin-bottom: 6px;
  }
  
  .el-menu-item {
    height: 40px;
    line-height: 40px;
  }
}

@media (max-width: 768px) {
  .aside {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 2000;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  }
}
</style>