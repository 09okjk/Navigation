<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div class="p-5">
      <div class="flex justify-between items-start">
        <h3 class="text-xl font-semibold text-gray-800 mb-1 truncate">{{ tool.name }}</h3>
        <div class="flex space-x-1">
          <button 
            @click.stop="$emit('edit', tool)" 
            class="text-gray-500 hover:text-blue-600 transition-colors p-1"
            title="编辑工具"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button 
            @click.stop="confirmDelete" 
            class="text-gray-500 hover:text-red-600 transition-colors p-1"
            title="删除工具"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <p v-if="tool.description" class="text-sm text-gray-600 mt-1 mb-2">{{ tool.description }}</p>
      
      <div class="mt-2 text-sm text-gray-600">
        <div class="flex items-center mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
          <span>{{ tool.maintainer }}</span>
        </div>
        
        <div class="flex items-center mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
          </svg>
          <span>v{{ tool.version }}</span>
        </div>
      </div>
      
      <a 
        :href="tool.url" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="mt-3 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200 w-full justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
        </svg>
        打开工具
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

interface Tool {
  id: string;
  name: string;
  description?: string;
  maintainer: string;
  version: string;
  url: string;
}

export default defineComponent({
  name: 'ToolCard',
  props: {
    tool: {
      type: Object as PropType<Tool>,
      required: true
    }
  },
  emits: ['edit', 'delete'],
  setup(props, { emit }) {
    const confirmDelete = () => {
      if (confirm(`确定要删除 ${props.tool.name}?`)) {
        emit('delete', props.tool.id);
      }
    };

    return {
      confirmDelete
    };
  }
});
</script>
