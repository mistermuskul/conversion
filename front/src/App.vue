<template>
    <div id="app">
        <Header />

        <main class="main-content">
            <router-view />
        </main>
    </div>
</template>

<script setup lang="ts">
import Header from '@/shared/components/Header.vue';
</script>

<style scoped>
#app {
    font-family: Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
}

.main-content {
    padding: 1rem;

}
</style>