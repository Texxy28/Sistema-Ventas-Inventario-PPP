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

    <div class="bg-white p-6 rounded-lg w-96">
        <h2 class="text-lg font-bold mb-4">Añadir Categoria</h2>
        <input v-model="formCategory.nombre" placeholder="Nombre" class="border p-2 w-full mb-2" />
        <input v-model="formCategory.descripcion" placeholder="Descripción" class="border p-2 w-full mb-2" />
        <div class="flex justify-center gap-2">
            <button @click="handleCancel" class="bg-gray-400 px-4 py-2 rounded">Cancelar</button>
            <button @click="handleSave" type="button" class="bg-gray-400 px-4 py-2 rounded">
                {{ props.selectedCategory ? "Actualizar" : "Guardar" }}
            </button>
        </div>
    </div>

</template>