<template>
  <div class="currency-list">
    <h2>Курсы валют (базовая: {{ baseCurrency }})</h2>
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">Ошибка при загрузке данных</div>
    <ul v-else class="rates-list">
      <li v-for="(rate, currency) in displayedRates" :key="currency" class="rate-item">
        <span class="currency-code">1 {{ currency }}</span>
        <span class="rate-value">= {{ rate ? rate.toFixed(2) : 'N/A' }} {{ baseCurrency }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { fetchRates } from '@/shared/api/fetchRates';
import { useCurrencyStore } from '@/stores/currencyStore';

const loading = ref(true);
const error = ref(false);
const rates = ref<Record<string, number>>({});
const displayedRates = ref<Record<string, number | null>>({});

const currencyStore = useCurrencyStore();
const baseCurrency = ref(currencyStore.baseCurrency);

const convertRates = (rawRates: Record<string, number>, targetCurrency: string): Record<string, number | null> => {
  const result: Record<string, number | null> = {};

  const currenciesToDisplay = ['USD', 'EUR', 'RUB'].filter(c => c !== targetCurrency);

  currenciesToDisplay.forEach(currency => {
    const directPair = `${currency}-${targetCurrency}`.toLowerCase();
    const reversePair = `${targetCurrency}-${currency}`.toLowerCase();

    if (rawRates[directPair]) {
      result[currency] = rawRates[directPair];
    } else if (rawRates[reversePair]) {
      result[currency] = 1 / rawRates[reversePair];
    } else {
      result[currency] = null;
    }
  });

  return result;
};

const loadRates = async (): Promise<void> => {
  loading.value = true;
  error.value = false;

  try {
    const fetchedRates = await fetchRates(baseCurrency.value);
    rates.value = fetchedRates;
    displayedRates.value = convertRates(fetchedRates, baseCurrency.value);
  } catch (err) {
    console.error('Ошибка при загрузке курсов:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const setupAutoRefresh = (): (() => void) => {
  const interval = setInterval(loadRates, 5 * 60 * 1000);
  return () => clearInterval(interval);
};

onMounted(() => {
  const handleStorageChange = () => {
    baseCurrency.value = currencyStore.baseCurrency;
    loadRates();
  };

  const unsubscribe = currencyStore.$subscribe(() => {
    handleStorageChange();
  });

  const clearInterval = setupAutoRefresh();
  loadRates();

  onUnmounted(() => {
    clearInterval();
    unsubscribe();
  });
});

watch(baseCurrency, (newVal) => {
  currencyStore.setBaseCurrency(newVal);
  loadRates();
});
</script>

<style scoped>
.currency-list {
  font-family: Arial, sans-serif;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.loading,
.error {
  text-align: center;
  padding: 12px;
  margin: 10px 0;
  border-radius: 4px;
}

.loading {
  background-color: #f0f0f0;
  color: #666;
}

.error {
  background-color: #ffebee;
  color: #d32f2f;
}

.rates-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.rate-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  margin-bottom: 8px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.currency-code {
  font-weight: 600;
  color: #2c3e50;
}

.rate-value {
  color: #42b983;
  font-weight: 500;
}
</style>