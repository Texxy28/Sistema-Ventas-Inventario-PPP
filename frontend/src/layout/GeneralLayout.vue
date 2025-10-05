<script setup lang="ts">
import { RouterView } from 'vue-router';
import GeneralNavBar from '../components/GeneralNavBar.vue';

</script>

<template>
    <div class="flex flex-col min-h-screen">
        <header class="w-full h-16 shadow-md flex justify-end items-center bg-white">
            <GeneralNavBar />
        </header>

        <main class="flex-1 overflow-y-auto">
            <RouterView class="h-[calc(100vh-4rem)]" />
        </main>
    </div>
</template>