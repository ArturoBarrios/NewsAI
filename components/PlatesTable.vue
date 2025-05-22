<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Admin Dashboard</h1>
    </div>

    <div class="overflow-x-auto">
      <table class="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-4 py-2">Plate Number</th>
            <th class="border border-gray-300 px-4 py-2">Number of Orders</th>
            <th class="border border-gray-300 px-4 py-2">Number of Users</th>
            <th class="border border-gray-300 px-4 py-2">Orders</th>
            <th class="border border-gray-300 px-4 py-2">Plate Image</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="plate in plates" :key="plate.id" class="hover:bg-gray-50">
            <td class="border border-gray-300 px-4 py-2">{{ plate.number }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ plate.orders }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ plate.users }}</td>
            <td class="border border-gray-300 px-4 py-2">
              <a :href="plate.ordersLink" class="text-blue-500 hover:underline">View Orders</a>
            </td>
            <td class="border border-gray-300 px-4 py-2">
              <a :href="plate.imageLink" class="text-blue-500 hover:underline">View Image</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  plates: Array<{
    id: number
    number: string
    orders: number
    users: number
    ordersLink: string
    imageLink: string
  }>
}>()
</script>
