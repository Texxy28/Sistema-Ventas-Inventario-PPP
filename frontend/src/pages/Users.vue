<script setup>
import { storeToRefs } from 'pinia';
import { useUserStore } from '../store/userStore';
import { onMounted, ref } from 'vue';
import { ArrowPathIcon, XMarkIcon, ClipboardDocumentListIcon } from '@heroicons/vue/24/outline';
import UsersTable from '../components/UsersTable.vue';
import FormUsers from '../components/FormUsers.vue';

const usersStore = useUserStore();
const { users, loadingUsers, errorUsers } = storeToRefs(usersStore);
const { fetchUsers, updateUserInfo, addUser, eraseUser, passwordByAdmin } = usersStore;

const selectedUser = ref(null);

const id_selected = ref(null);
const password = ref(null);
const confirm_password = ref(null);

const openForm = ref(false);

const passwordModal = ref(false);

const openModal = (id) => {
    passwordModal.value = true;
    id_selected.value = id
}

const closeModal = () => {
    passwordModal.value = false;
    id_selected.value = null
    password.value = null
    confirm_password.value = null
}

const toogleForm = () => {
    openForm.value = !openForm.value;
}

const selectUser = async (user) => {
    selectedUser.value = { ...user };
    openForm.value = true;
}

const saveEdit = async (user) => {
    await updateUserInfo(user.id_usuario, user);
    selectedUser.value = null;
    openForm.value = false;
};

const handleAddUser = async (user) => {
    await addUser(user);
    openForm.value = false;
}

const handleDelete = async (id) => {
    await eraseUser(id);
    selectedUser.value = null;
    openForm.value = false;
}

const handleChangePassword = async () => {
    if (password.value === confirm_password.value) {
        await passwordByAdmin(id_selected.value, { contraseña: password.value });
        passwordModal.value = false;
    } 
}

onMounted(async () => {
    await fetchUsers();
})

</script>

<template>

    <div>
        <div class="p-6 lg:grid lg:grid-cols-4 h-[90vh] max-h-full w-full">
            <div class="hidden lg:flex col-span-1">
                <FormUsers :selectedUser="selectedUser" @addUser="handleAddUser" @editUser="saveEdit"
                    @cancelEdit="selectedUser = null" />
            </div>
            <div v-if="loadingUsers" class="w-full h-full flex justify-center items-center col-span-3">
                <ArrowPathIcon class="w-8 h-8 text-[#2E2B26] animate-spin" />
                <span class="text-[#2E2B26] text-lg">Cargando...</span>
            </div>
            <div v-if="users.length && !loadingUsers"
                class="w-full h-full flex flex-col justify-center items-center col-span-3">
                <div class="w-[70vw] flex justify-end my-4">
                    <ClipboardDocumentListIcon class="lg:hidden w-8 h-8 cursor-pointer" @click="toogleForm" />
                </div>
                <UsersTable :users="users" @select="selectUser" @delete="handleDelete"
                    @changePassword="openModal" />
            </div>
        </div>

        <transition>
            <div v-if="openForm" class="fixed lg:hidden inset-0 bg-black/50 z-[1000] flex justify-center items-center">
                <div class="relative overflow-y-auto">
                    <FormUsers :selectedUser="selectedUser" @addUser="handleAddProduct" @editUser="saveEdit"
                        @cancelEdit="selectedUser = null" />
                    <XMarkIcon @click="toogleForm"
                        class="absolute top-6 right-6 w-8 h-8 cursor-pointer hover:stroke-[#C8A785]" />
                </div>
            </div>
        </transition>

        <div v-if="passwordModal" class="fixed inset-0 bg-black/50 z-[1000] flex justify-center items-center">
            <div class="bg-[#F7F5F0] p-4 gap-4 flex flex-col min-w-[20vw] rounded-lg relative">
                <XMarkIcon @click="closeModal"
                    class="absolute top-1 right-1 w-8 h-8 cursor-pointer hover:stroke-[#C8A785]" />
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
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.3s ease;
}

.slide-fade-enter-from {
    opacity: 0;
    transform: translateY(-20px);
}

.slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}
</style>