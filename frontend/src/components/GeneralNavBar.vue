<script setup>

import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';
import { onMounted, ref } from 'vue';
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';
import { useUserStore } from '../store/userStore';
import { storeToRefs } from 'pinia';

const router = useRouter();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const { logout, fetchUser } = authStore;

const userStore = useUserStore();
const { changePasswordByUser } = userStore;

const current_password = ref(null);
const password = ref(null);
const confirm_password = ref(null);

const modalChangePassword = ref(false);

const isOpen = ref(false);

const logoutFunc = async () => {
    await logout();
    router.push("/login");
}

const toggleMenu = () => {
    isOpen.value = !isOpen.value;
};

const openModal = () => {
    modalChangePassword.value = true;
}

const closeModal = () => {
    modalChangePassword.value = false;
    current_password.value = null;
    password.value = null;
    confirm_password.value = null;
}

const handleChangePassword = async () => {
    if (password.value === confirm_password.value) {
        await changePasswordByUser(current_password.value, password.value, confirm_password.value);
        modalChangePassword.value = false;
    }
}

onMounted(async () => {
    if (!user) {
        await fetchUser();
    }
})

</script>

<template>
    <div>
        <nav class="flex mr-4 items-center text-[#2E2B26]">
            <div class="md:hidden">
                <Bars3Icon class="w-8 h-8 cursor-pointer" @click="toggleMenu" />
            </div>
            <div class="hidden md:flex items-center gap-3">
                <RouterLink class="hover:text-[#8B5E3C] transition" active-class="bg-[#8B5E3C] p-2 text-white rounded hover:text-white"
                    to="/productos">Productos</RouterLink>
                <RouterLink v-if="user?.rol === 'admin'" class="hover:text-[#8B5E3C] transition" active-class="bg-[#8B5E3C] p-2 text-white rounded hover:text-white"
                    to="/categories">Categorías</RouterLink>
                <RouterLink class="hover:text-[#8B5E3C] transition" active-class="bg-[#8B5E3C] p-2 text-white rounded hover:text-white"
                    to="/sales-control">Nueva venta</RouterLink>
                <RouterLink v-if="user?.rol === 'admin'" class="hover:text-[#8B5E3C] transition" active-class="bg-[#8B5E3C] p-2 text-white rounded hover:text-white"
                    to="/sales">Ventas</RouterLink>
                <RouterLink v-if="user?.rol === 'admin'" class="hover:text-[#8B5E3C] transition" active-class="bg-[#8B5E3C] p-2 text-white rounded hover:text-white"
                    to="/movements">Movimientos</RouterLink>
                <RouterLink v-if="user?.rol === 'admin'" class="hover:text-[#8B5E3C] transition" active-class="bg-[#8B5E3C] p-2 text-white rounded hover:text-white"
                    to="/users">Usuarios</RouterLink>
                <RouterLink v-if="user?.rol === 'admin'" class="hover:text-[#8B5E3C] transition" active-class="bg-[#8B5E3C] p-2 text-white rounded hover:text-white"
                    to="/dashboard">Reportes</RouterLink>
                <button @click="logoutFunc"
                    class="bg-[#2E2B26] text-[#F7F5F0] hover:bg-[#8B5E3C] px-4 py-2 rounded-lg cursor-pointer">Cerrar
                    sesión</button>
                <button @click="openModal" class="cursor-pointer text-[#8B5E3C]">
                    Cambiar contraseña
                </button>
            </div>
        </nav>
        <transition name="slide">
            <nav v-if="isOpen"
                class="fixed top-0 left-0 w-64 h-full bg-[#2E2B26] text-white z-40 shadow-xl flex flex-col py-6 px-4 space-y-6 transform transition-all duration-300">
                <XMarkIcon @click="toggleMenu" class="w-6 h-6 cursor-pointer self-end hover:stroke-[#C8A785]" />
                <RouterLink to="/productos" class="block py-2 hover:text-[#C8A785]" @click="toggleMenu">Productos
                </RouterLink>
                <RouterLink to="/categories" class="block py-2 hover:text-[#C8A785]" @click="toggleMenu">Categorías
                </RouterLink>
                <RouterLink to="/sales-control" class="block py-2 hover:text-[#C8A785]" @click="toggleMenu">Nueva venta
                </RouterLink>
                <RouterLink to="/sales" class="block py-2 hover:text-[#C8A785]" @click="toggleMenu">Ventas</RouterLink>
                <RouterLink to="/movements" class="block py-2 hover:text-[#C8A785]" @click="toggleMenu">Movimientos
                </RouterLink>
                <RouterLink to="/users" class="block py-2 hover:text-[#C8A785]" @click="toggleMenu">Usuarios
                </RouterLink>
                <RouterLink to="/dashboard" class="block py-2 hover:text-[#C8A785]" @click="toggleMenu">Reportes
                </RouterLink>
                <button @click="logoutFunc"
                    class="bg-[#8B5E3C] text-[#F7F5F0] hover:bg-[#C8A785] px-4 py-2 rounded-lg cursor-pointer">Cerrar
                    sesión</button>
            </nav>
        </transition>

        <div v-if="modalChangePassword" class="fixed inset-0 bg-black/50 z-[1000] flex justify-center items-center">
            <div class="bg-[#F7F5F0] p-4 gap-4 flex flex-col min-w-[20vw] rounded-lg relative">
                <XMarkIcon @click="closeModal"
                    class="absolute top-1 right-1 w-8 h-8 cursor-pointer hover:stroke-[#C8A785]" />
                <label>Contraseña actual</label>
                <input v-model="current_password" type="password" placeholder="Contraseña" class="border p-2 w-full">
                <label>Contraseña</label>
                <input v-model="password" type="password" placeholder="Contraseña" class="border p-2 w-full">
                <label>Confirmar contraseña</label>
                <input v-model="confirm_password" type="password" placeholder="Contraseña" class="border p-2 w-full">
                <button @click="handleChangePassword" class="bg-[#8B5E3C] text-white px-4 py-2 rounded cursor-pointer">Aceptar</button>
            </div>
        </div>

    </div>
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