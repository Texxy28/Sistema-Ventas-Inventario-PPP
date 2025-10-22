<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../store/authStore';

const authStore = useAuthStore();
const router = useRouter();
const correo = ref('');
const contraseña = ref('');
const { user, loadingAuth, errorAuth } = storeToRefs(authStore);
const { login } = authStore;

const handleSubmit = async () => {
    await login(correo.value, contraseña.value);
    if (user) router.push("/")
};
</script>

<template>
    <div class="bg-[#F7F5F0] w-screen mx-auto h-full flex justify-center items-center p-6">
        <div class="flex flex-col w-[80%] md:w-[70%] lg:w-[30%] justify-center items-center">
            <h2 class="text-2xl font-[#2E2B26] font-bold mb-4">Iniciar sesión</h2>
            <input v-model="correo" placeholder="Correo" class="border p-2 w-full mb-2" />
            <input v-model="contraseña" placeholder="Contraseña" type="password" class="border p-2 w-full mb-4" />
            <div v-if="errorAuth" class="text-red-500 mb-2">{{ errorAuth }}</div>
            <button @click="handleSubmit" :disabled="loadingAuth" class="bg-[#8B5E3C] text-white px-4 py-2 rounded">Iniciar sesión</button>
        </div>
    </div>
</template>