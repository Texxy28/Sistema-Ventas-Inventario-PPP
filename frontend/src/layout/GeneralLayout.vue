<script setup lang="ts">
import { RouterView } from 'vue-router';
import HelloWorld from '../components/HelloWorld.vue';
import GeneralNavBar from '../components/GeneralNavBar.vue';

</script>

<template>
    <div class="w-full h-14 shadow-xl flex justify-end items-center">
        <GeneralNavBar/>
    </div>
    <RouterView />
</template>