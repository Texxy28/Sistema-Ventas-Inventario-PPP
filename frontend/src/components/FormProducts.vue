<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    selectedProduct: {
        type: Object,
        defaut: null
    },
    categories: {
        type: Array,
        defaut: () => []
    },
    loadingCategories: Boolean,
    errorCategories: String
});

const emit = defineEmits(['addProduct', 'editProduct', 'cancelEdit']);

const formProduct = ref({
    codigo: "",
    nombre: "",
    autor: "",
    descripcion: "",
    id_categoria: "",
    id_proveedor: "",
    precio: "",
    stock: "",
    punto_reorden: "",
});

const cleanForm = () => {
    formProduct.value = {
        codigo: "",
        nombre: "",
        autor: "",
        descripcion: "",
        id_categoria: "",
        id_proveedor: "",
        precio: "",
        stock: "",
        punto_reorden: "",
    };
};

watch(
    () => props.selectedProduct,
    (newProduct) => {
        if (newProduct) {
            formProduct.value = { ...newProduct };
        } else {
            cleanForm();
        }
    },
    { immediate: true }
);

const handleSave = () => {
    if (props.selectedProduct) {
        emit("editProduct", { ...formProduct.value });
    } else {
        emit("addProduct", { ...formProduct.value });
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
        <h2 class="text-[#2E2B26] text-lg font-bold mb-4">{{ props.selectedProduct ? "Editar Producto" : "Añadir producto" }}</h2>
        <input v-model="formProduct.codigo" placeholder="Código" class="border border-[#B0B0AE] p-2 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/40 w-full mb-2" />
        <input v-model="formProduct.nombre" placeholder="Nombre" class="border border-[#B0B0AE] p-2 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/40 w-full mb-2" />
        <input v-model="formProduct.autor" placeholder="Autor" class="border border-[#B0B0AE] p-2 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/40 w-full mb-2" />
        <input v-model="formProduct.descripcion" placeholder="Descripcion" class="border border-[#B0B0AE] p-2 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/40 w-full mb-2" />
        <div>
            <select v-model="formProduct.id_categoria" class="border border-[#B0B0AE] p-2 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/40 w-full mb-2">
                <option disabled value="">{{ props.loadingCategories ? "Cargando categorías..." : props.errorCategories ? props.errorCategories : "Seleccione una categoría"}}</option>
                <option v-for="category in categories" :key="category.id_categoria" :value="category.id_categoria">
                    {{ category.nombre }}
                </option>
            </select>
        </div>
        <input v-model="formProduct.id_proveedor" type="number" placeholder="Proveedor"
            class="border border-[#B0B0AE] p-2 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/40 w-full mb-2" />
        <input v-model="formProduct.precio" type="number" placeholder="Precio" class="border border-[#B0B0AE] p-2 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/40 w-full mb-2" />
        <input v-model="formProduct.stock" type="number" placeholder="Stock" class="border border-[#B0B0AE] p-2 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/40 w-full mb-2" />
        <input v-model="formProduct.punto_reorden" type="number" min="5" placeholder="Punto reorden"
            class="border border-[#B0B0AE] p-2 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/40 w-full mb-4" />
        <div class="flex justify-center gap-2">
            <button @click="handleCancel" class="bg-[#B0B0AE] text-white px-4 py-2 rounded-md hover:bg-[#8B5E3C]/70 transition cursor-pointer">Cancelar</button>
            <button @click="handleSave" type="button" class="bg-[#8B5E3C] text-white px-4 py-2 rounded-md hover:bg-[#C8A785] transition cursor-pointer">
                {{ props.selectedProduct ? "Actualizar" : "Guardar" }}
            </button>
        </div>
    </div>

</template>