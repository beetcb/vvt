<template>
  <div class="container mx-auto align-middle">
    <h1 class="m-5"><slot></slot></h1>

    <button
      class="block m-2 mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      @click="state.count++"
    >
      plus: {{ state.count }}
    </button>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
// import { parse } from '@iarna/toml'

const state = reactive({ count: 0, input: '' })
</script>
