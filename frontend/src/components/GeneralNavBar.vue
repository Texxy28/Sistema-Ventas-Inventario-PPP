<script setup>

import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';
import { ref } from 'vue';
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const authStore = useAuthStore();
const { logout } = authStore;

const isOpen = ref(false);

const logoutFunc = async () => {
    await logout();
    router.push("/login");
}

const toggleMenu = () => {
    isOpen.value = !isOpen.value;
};

</script>

<template>
    <nav class="flex mr-4 items-center text-[#2E2B26]">
        <div class="md:hidden">
            <Bars3Icon class="w-8 h-8 cursor-pointer" @click="toggleMenu" />
        </div>
        <div class="hidden md:flex items-center gap-3">
            <RouterLink class="hover:text-[#8B5E3C] transition" to="/">Productos</RouterLink>
            <RouterLink class="hover:text-[#8B5E3C] transition" to="/categories">Categorías</RouterLink>
            <RouterLink class="hover:text-[#8B5E3C] transition" to="/sales">Ventas</RouterLink>
            <RouterLink class="hover:text-[#8B5E3C] transition" to="/dashboard">Reportes</RouterLink>
            <button @click="logoutFunc"
                class="bg-[#2E2B26] text-[#F7F5F0] hover:bg-[#8B5E3C] px-4 py-2 rounded-lg cursor-pointer">Cerrar
                sesión</button>
        </div>
    </nav>
    <transition name="slide">
        <nav v-if="isOpen"
            class="fixed top-0 left-0 w-64 h-full bg-[#2E2B26] text-white z-40 shadow-xl flex flex-col py-6 px-4 space-y-6 transform transition-all duration-300">
            <XMarkIcon @click="toggleMenu" class="w-6 h-6 cursor-pointer self-end hover:stroke-[#C8A785]" />
            <RouterLink to="/" class="block py-2 hover:text-[#C8A785]" @click="toggleMenu">Productos</RouterLink>
            <RouterLink to="/categories" class="block py-2 hover:text-[#C8A785]" @click="toggleMenu">Categorías
            </RouterLink>
            <RouterLink to="/sales" class="block py-2 hover:text-[#C8A785]" @click="toggleMenu">Ventas</RouterLink>
            <RouterLink to="/dashboard" class="block py-2 hover:text-[#C8A785]" @click="toggleMenu">Reportes</RouterLink>
            <button @click="logoutFunc"
                class="bg-[#8B5E3C] text-[#F7F5F0] hover:bg-[#C8A785] px-4 py-2 rounded-lg cursor-pointer">Cerrar
                sesión</button>
        </nav>
    </transition>
</template>

<style scoped>
.slide-enter-from {
    transform: translateX(-100%);
}

.slide-enter-to {
    transform: translateX(0);
}

.slide-leave-from {
    transform: translateX(0);
}

.slide-leave-to {
    transform: translateX(-100%);
}
</style>