<template>
  <div class="container mx-auto px-4">
    <header class="py-6">
      <h1 class="text-3xl font-bold text-center text-gray-800">工具导航</h1>
      <p class="text-center text-gray-600 mt-2">您的工具网站集中管理平台</p>
    </header>

    <div class="mb-6">
      <div class="flex justify-between items-center mb-4">
        <div class="relative w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="按名称或维护人搜索..."
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span v-if="searchQuery" @click="searchQuery = ''" class="absolute right-3 top-2.5 cursor-pointer text-gray-500">
            ✕
          </span>
        </div>
        <button
          @click="showAddForm = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          添加工具
        </button>
      </div>
    </div>

    <div v-if="filteredTools.length === 0 && searchQuery" class="text-center py-10">
      <p class="text-gray-600 text-lg">没有找到匹配"{{ searchQuery }}"的工具</p>
    </div>

    <div v-else-if="tools.length === 0" class="text-center py-10">
      <p class="text-gray-600 text-lg">还没有添加工具。点击"添加工具"开始使用。</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ToolCard
        v-for="tool in filteredTools"
        :key="tool.id"
        :tool="tool"
        @edit="editTool"
        @delete="deleteTool"
      />
    </div>

    <ToolForm
      v-if="showAddForm"
      :tool="currentTool"
      :isEdit="isEditing"
      @save="saveTool"
      @cancel="cancelForm"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import ToolCard from './components/ToolCard.vue';
import ToolForm from './components/ToolForm.vue';

interface Tool {
  id: string;
  name: string;
  description?: string;
  maintainer: string;
  version: string;
  url: string;
}

export default defineComponent({
  name: 'App',
  components: {
    ToolCard,
    ToolForm
  },
  setup() {
    const tools = ref<Tool[]>([]);
    const searchQuery = ref('');
    const showAddForm = ref(false);
    const isEditing = ref(false);
    const currentTool = ref<Tool | null>(null);

    // 组件挂载时从localStorage加载工具
    onMounted(() => {
      const savedTools = localStorage.getItem('tools');
      if (savedTools) {
        tools.value = JSON.parse(savedTools);
      }
    });

    // 根据搜索查询过滤工具
    const filteredTools = computed(() => {
      if (!searchQuery.value) return tools.value;
      
      const query = searchQuery.value.toLowerCase();
      return tools.value.filter(tool => 
        tool.name.toLowerCase().includes(query) || 
        tool.maintainer.toLowerCase().includes(query) ||
        (tool.description && tool.description.toLowerCase().includes(query))
      );
    });

    // 保存工具到localStorage
    const saveToLocalStorage = () => {
      localStorage.setItem('tools', JSON.stringify(tools.value));
    };

    // 添加或更新工具
    const saveTool = (tool: Tool) => {
      if (isEditing.value) {
        const index = tools.value.findIndex(t => t.id === tool.id);
        if (index !== -1) {
          tools.value[index] = tool;
        }
      } else {
        tool.id = Date.now().toString();
        tools.value.push(tool);
      }
      
      saveToLocalStorage();
      resetForm();
    };

    // 编辑工具
    const editTool = (tool: Tool) => {
      currentTool.value = { ...tool };
      isEditing.value = true;
      showAddForm.value = true;
    };

    // 删除工具
    const deleteTool = (id: string) => {
      tools.value = tools.value.filter(tool => tool.id !== id);
      saveToLocalStorage();
    };

    // 重置表单
    const resetForm = () => {
      showAddForm.value = false;
      isEditing.value = false;
      currentTool.value = null;
    };

    // 取消表单
    const cancelForm = () => {
      resetForm();
    };

    return {
      tools,
      searchQuery,
      showAddForm,
      isEditing,
      currentTool,
      filteredTools,
      saveTool,
      editTool,
      deleteTool,
      cancelForm
    };
  }
});
</script>
