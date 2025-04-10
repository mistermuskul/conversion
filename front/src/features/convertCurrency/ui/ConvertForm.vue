<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-row">
      <Dropdown v-model="fromCurrency" :options="currencies" />
      <input type="number" v-model="fromAmount" @input="convert('from')" placeholder="Введите сумму" />
    </div>
    <div class="form-row">
      <Dropdown v-model="toCurrency" :options="currencies" />
      <input type="number" v-model="toAmount" @input="convert('to')" placeholder="Результат" readonly />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import Dropdown from '@/shared/ui/Dropdown.vue';
import { fetchRates } from '@/shared/api/fetchRates';

const currencies: string[] = ['USD', 'EUR', 'RUB'];
const fromCurrency = ref<string>('RUB');
const toCurrency = ref<string>('USD');
const fromAmount = ref<number>(1);
const toAmount = ref<number>(0);
const rates = ref<Record<string, number>>({});

const getAlternativeCurrency = (currentCurrency: string): string => {
  const availableCurrencies = currencies.filter(currency => currency !== currentCurrency);
  return availableCurrencies[0];
};

const loadRates = async () => {
  try {
    const fetchedRates = await fetchRates(fromCurrency.value);
    rates.value = fetchedRates;
    convert('from');
  } catch (error) {
    console.error('Ошибка при загрузке курсов:', error);
  }
};

const convert = (direction: 'from' | 'to') => {
  if (!rates.value) return;

  const directPair = `${fromCurrency.value}-${toCurrency.value}`.toLowerCase();
  const reversePair = `${toCurrency.value}-${fromCurrency.value}`.toLowerCase();

  let rate = rates.value[directPair] || (rates.value[reversePair] ? 1 / rates.value[reversePair] : null);

  if (!rate) {
    toAmount.value = 0;
    return;
  }

  if (direction === 'from') {
    toAmount.value = (fromAmount.value * rate) || 0;
  } else {
    fromAmount.value = (toAmount.value / rate) || 0;
  }

  toAmount.value = parseFloat(toAmount.value.toFixed(2));
  fromAmount.value = parseFloat(fromAmount.value.toFixed(2));
};

watch([fromCurrency, toCurrency], ([newFromCurrency, newToCurrency]) => {
  if (newFromCurrency === newToCurrency) {
    toCurrency.value = getAlternativeCurrency(newFromCurrency);
  }
  loadRates();
});

onMounted(() => {
  if (fromCurrency.value === toCurrency.value) {
    toCurrency.value = getAlternativeCurrency(fromCurrency.value);
  }
  loadRates();
});
</script>

<style scoped>
.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
</style>