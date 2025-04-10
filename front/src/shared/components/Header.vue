<template>
  <header class="header">
    <nav>
      <ul>
        <li><router-link to="/">Главная</router-link></li>
        <li><router-link to="/convert">Конвертация</router-link></li>
      </ul>
    </nav>
    <Dropdown v-model="baseCurrency" :options="currencies" />
  </header>
</template>

<script setup lang="ts">
import Dropdown from '@/shared/ui/Dropdown.vue';
import { ref, watch } from 'vue';
import { useCurrencyStore } from '@/stores/currencyStore';

const currencies: string[] = ['USD', 'EUR', 'RUB'];

const currencyStore = useCurrencyStore();
const baseCurrency = ref(currencyStore.baseCurrency);

watch(baseCurrency, (newValue) => {
  currencyStore.setBaseCurrency(newValue);
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
}
nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
}
</style>