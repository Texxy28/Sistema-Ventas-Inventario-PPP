<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    selectedUser: {
        type: Object,
        defaut: null
    }
});

const emit = defineEmits(['addUser', 'editUser', 'cancelEdit']);

const formUser = ref({
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: "",
    rol: "",
});

const ROLES = [
    'admin',
    'vendedor'
]

const cleanForm = () => {
    formUser.value = {
        nombre: "",
        apellido: "",
        correo: "",
        contraseña: "",
        rol: "",
    };
};

watch(
    () => props.selectedUser,
    (newUser) => {
        if (newUser) {
            formUser.value = { ...newUser };
        } else {
            cleanForm();
        }
    },
    { immediate: true }
);

const handleSave = () => {
    if (props.selectedUser) {
        emit("editUser", { ...formUser.value });
    } else {
        emit("addUser", { ...formUser.value });
    }
    cleanForm();
};

const handleCancel = () => {
    cleanForm();
    emit("cancelEdit");
};

</script>

<template>
    <div class="bg-[#ECEAE5] shadow-sm m-4 shadow-[#8B5E3C]/20 p-6 lg:p-4 rounded-lg w-96">
        <h2 class="text-[#2E2B26] text-lg font-bold mb-4">{{ props.selectedUser ? "Editar Usuario" : "Añadir usuario" }}
        </h2>
        <input v-model="formUser.nombre" placeholder="Nombres"
            class="border border-[#B0B0AE] p-2 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/40 w-full mb-2" />
        <input v-model="formUser.apellido" placeholder="Apellidos"
            class="border border-[#B0B0AE] p-2 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/40 w-full mb-2" />
        <input v-model="formUser.correo" placeholder="Correo"
            class="border border-[#B0B0AE] p-2 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/40 w-full mb-2" />
        <input v-if="!props.selectedUser" v-model="formUser.contraseña" placeholder="Contraseña"
            class="border border-[#B0B0AE] p-2 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/40 w-full mb-2" />
        <div>
            <select v-model="formUser.rol"
                class="border border-[#B0B0AE] p-2 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/40 w-full mb-2">
                <option disabled value="">Seleccione un rol</option>
                <option v-for="rol in ROLES" :key="rol" :value="rol">
                    {{ rol }}
                </option>
            </select>
        </div>
        <div class="flex justify-center gap-2">
            <button @click="handleCancel"
                class="bg-[#B0B0AE] text-white px-4 py-2 rounded-md hover:bg-[#8B5E3C]/70 transition cursor-pointer">Cancelar</button>
            <button @click="handleSave" type="button"
                class="bg-[#8B5E3C] text-white px-4 py-2 rounded-md hover:bg-[#C8A785] transition cursor-pointer">
                {{ props.selectedUser ? "Actualizar" : "Guardar" }}
            </button>
        </div>
    </div>
</template>