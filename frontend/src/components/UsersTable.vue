<script setup>
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
    users: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['select', 'delete', 'changePassword']);

const handleSelect = (user) => {
    emit('select', user);
}

const handleDelete = (id) => {
    emit('delete', id);
}

const handleChangePassword = (id) => {
    emit('changePassword', id);
}

</script>

<template>
    <div class="w-[80%] h-[90%]">
        <div class="max-h-full overflow-y-auto">
            <table
                class="hidden md:table min-w-full max-h-[70vh] border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <thead class="bg-[#2E2B26] border-b border-gray-300">
                    <tr>
                        <th class="px-4 py-2 text-left font-semibold text-white">Nombres</th>
                        <th class="px-4 py-2 text-left font-semibold text-white">Apellidos</th>
                        <th class="px-4 py-2 text-left font-semibold text-white">Correo</th>
                        <th class="px-4 py-2 text-left font-semibold text-white">Rol</th>
                        <th class="px-4 py-2 text-left font-semibold text-white">Editar</th>
                        <th class="px-4 py-2 text-left font-semibold text-white">Eliminar</th>
                        <th class="px-4 py-2 text-left font-semibold text-white">Cambiar contraseña</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="user in users" :key="user.id_usuario" class="border-b hover:bg-gray-50 transition">
                        <td class="px-4 py-2">{{ user.nombre }}</td>
                        <td class="px-4 py-2">{{ user.apellido }}</td>
                        <td class="px-4 py-2 font-medium">{{ user.correo }}</td>
                        <td class="px-4 py-2 font-medium">{{ user.rol }}</td>
                        <td class="px-4 py-2">
                            <PencilSquareIcon class="h-5 w-5 cursor-pointer" @click="handleSelect(user)" />
                        </td>
                        <td class="px-4 py-2">
                            <TrashIcon class="h-5 w-5 cursor-pointer" @click="handleDelete(user.id_usuario)" />
                        </td>
                        <td class="px-4 py-2">
                            <PencilSquareIcon class="h-5 w-5 cursor-pointer" @click="handleChangePassword(user.id_usuario)" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="md:hidden space-y-4">
            <div v-for="user in users" :key="user.id_venta"
                class="rounded-lg p-4 inset-shadow-sm bg-F7F5F0">
                <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Nombres</span>
                    <span>{{ user.nombre }}</span>
                </div>

                <div class="flex justify-between text-sm mt-1">
                    <span class="text-gray-500">Apellidos</span>
                    <span>{{ user.apellido }}</span>
                </div>

                <div class="flex justify-between text-sm mt-1">
                    <span class="text-gray-500">Correo</span>
                    <span class="font-medium">{{ user.correo }}</span>
                </div>

                <div class="flex justify-between text-sm mt-1">
                    <span class="text-gray-500">Rol</span>
                    <span class="font-medium">{{ user.rol }}</span>
                </div>

                <div class="flex justify-between text-sm mt-1">
                    <span class="text-gray-500">Editar</span>
                    <span class="font-medium">
                        <PencilSquareIcon class="h-5 w-5 cursor-pointer" @click="handleSelect(user)" />
                    </span>
                </div>
                
                <div class="flex justify-between text-sm mt-1">
                    <span class="text-gray-500">Eliminar</span>
                    <span class="font-medium">
                        <TrashIcon class="h-5 w-5 cursor-pointer" @click="handleDelete(user.id_usuario)"/>
                    </span>
                </div>

                <div class="flex justify-between text-sm mt-1">
                    <span class="text-gray-500">Cambiar contraseña</span>
                    <span class="font-medium">
                        <PencilSquareIcon class="h-5 w-5 cursor-pointer" @click="handleChangePassword(user.id_usuario)" />
                    </span>
                </div>

            </div>
        </div>

    </div>
</template>