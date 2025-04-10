<template>
  <div class="convert-page">
    <h1>Конвертация валют</h1>
    <ConvertForm />
  </div>
</template>

<script setup lang="ts">
import { ConvertForm } from '@/features/convertCurrency/';
</script>

<style scoped>
.convert-page {
  padding: 1rem;
}

h1 {
  margin-bottom: 1rem;
  font-size: 2rem;
  text-align: center;
}
</style>