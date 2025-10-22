<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    selectedCategory: {
        type: Object,
        defaut: null
    }
});

const emit = defineEmits(['addCategory', 'editCategory', 'cancelEdit']);

const formCategory = ref({
    nombre: "",
    descripcion: ""
});

const cleanForm = () => {
    formCategory.value = {
        nombre: "",
        descripcion: ""
    };
};

watch(
    () => props.selectedCategory,
    (newCategory) => {
        if (newCategory) {
            formCategory.value = { ...newCategory };
        } else {
            cleanForm();
        }
    },
    { immediate: true }
);

const handleSave = () => {
    if (props.selectedCategory) {
        emit("editCategory", { ...formCategory.value });
    } else {
        emit("addCategory", { ...formCategory.value });
    }
    cleanForm();
};

const handleCancel = () => {
    cleanForm();
    emit("cancelEdit");
};

</script>

<template>

    <div class="bg-[#ECEAE5] shadow-sm m-4 shadow-[#8B5E3C]/20 p-6 rounded-lg w-96">
        <h2 class="text-[#2E2B26] text-lg font-bold mb-4">{{ props.selectedCategory ? "Editar Categoría" : "Añadir categoría" }}</h2>
        <input v-model="formCategory.nombre" placeholder="Nombre" class="border border-[#B0B0AE] p-2 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/40 w-full mb-2" />
        <input v-model="formCategory.descripcion" placeholder="Descripción" class="border border-[#B0B0AE] p-2 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/40 w-full mb-2" />
        <div class="flex justify-center gap-2">
            <button @click="handleCancel" class="bg-[#B0B0AE] text-white px-4 py-2 rounded-md hover:bg-[#8B5E3C]/70 transition cursor-pointer">Cancelar</button>
            <button @click="handleSave" type="button" class="bg-[#8B5E3C] text-white px-4 py-2 rounded-md hover:bg-[#C8A785] transition cursor-pointer">
                {{ props.selectedCategory ? "Actualizar" : "Guardar" }}
            </button>
        </div>
    </div>

</template>