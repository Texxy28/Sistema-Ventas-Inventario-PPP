<script setup lang="ts">
import { RouterView } from 'vue-router';
import GeneralNavBar from '../components/GeneralNavBar.vue';

</script>

<template>
    <div class="flex flex-col min-h-screen bg-[#F7F5F0] text-[#2E2B26]">
        <header class="bg-[#F7F5F0] w-full h-16 shadow-md flex justify-end items-center">
            <GeneralNavBar />
        </header>

        <main class="flex-1 overflow-y-auto">
            <RouterView class="h-[calc(100vh-4rem)]" />
        </main>
    </div>
</template>