<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
      <div class="bg-gray-100 px-6 py-4 border-b flex justify-between items-center">
        <h3 class="text-xl font-semibold text-gray-800">{{ isEdit ? '编辑工具' : '添加新工具' }}</h3>
        <button @click="$emit('cancel')" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="p-6">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">工具名称</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入工具名称"
          />
        </div>
        
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">描述</label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入工具描述（可选）"
          ></textarea>
        </div>
        
        <div class="mb-4">
          <label for="maintainer" class="block text-sm font-medium text-gray-700 mb-1">维护人</label>
          <input
            id="maintainer"
            v-model="form.maintainer"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入维护人姓名"
          />
        </div>
        
        <div class="mb-4">
          <label for="version" class="block text-sm font-medium text-gray-700 mb-1">版本号</label>
          <input
            id="version"
            v-model="form.version"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入版本号（例如：1.0.0）"
          />
        </div>
        
        <div class="mb-6">
          <label for="url" class="block text-sm font-medium text-gray-700 mb-1">网址</label>
          <input
            id="url"
            v-model="form.url"
            type="url"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />
        </div>
        
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="$emit('cancel')"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            取消
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {{ isEdit ? '更新' : '添加' }}工具
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, watch } from 'vue';

interface Tool {
  id: string;
  name: string;
  description?: string;
  maintainer: string;
  version: string;
  url: string;
}

export default defineComponent({
  name: 'ToolForm',
  props: {
    tool: {
      type: Object as PropType<Tool | null>,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['save', 'cancel'],
  setup(props, { emit }) {
    const form = reactive({
      id: '',
      name: '',
      description: '',
      maintainer: '',
      version: '',
      url: ''
    });

    // 监听工具属性变化以更新表单
    watch(() => props.tool, (newTool) => {
      if (newTool) {
        form.id = newTool.id;
        form.name = newTool.name;
        form.description = newTool.description || '';
        form.maintainer = newTool.maintainer;
        form.version = newTool.version;
        form.url = newTool.url;
      } else {
        // 如果工具为空则重置表单
        form.id = '';
        form.name = '';
        form.description = '';
        form.maintainer = '';
        form.version = '';
        form.url = '';
      }
    }, { immediate: true });

    const handleSubmit = () => {
      // 确保URL包含协议
      if (form.url && !form.url.startsWith('http://') && !form.url.startsWith('https://')) {
        form.url = 'https://' + form.url;
      }

      emit('save', {
        id: form.id,
        name: form.name,
        description: form.description,
        maintainer: form.maintainer,
        version: form.version,
        url: form.url
      });
    };

    return {
      form,
      handleSubmit
    };
  }
});
</script>
