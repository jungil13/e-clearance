<template>
  <div>
    <h2 class="text-2xl font-semibold mb-6 text-gray-800">Dashboard Overview</h2>

    <div class="grid md:grid-cols-3 gap-6">
      <div
        v-for="card in cards"
        :key="card.title"
        @click="$router.push(`/admin${card.route}`)"
        class="cursor-pointer rounded-xl p-6 text-white flex flex-col justify-between shadow-md hover:shadow-lg transition"
        :class="card.color"
      >
        <div class="flex items-center justify-between">
          <i :class="`fa-solid fa-${card.icon} text-3xl`"></i>
        </div>
        <div>
          <h3 class="text-lg font-medium mt-2">{{ card.title }}</h3>
          <p class="text-2xl font-bold">{{ card.value ?? '-' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const cards = [
  {
    title: 'Total Population',
    value: 1986,
    icon: 'users',
    color: 'bg-blue-700 hover:bg-blue-600',
    route: '/data/population',
  },
  {
    title: 'Registered Residence',
    value: 1005,
    icon: 'user-plus',
    color: 'bg-green-600 hover:bg-green-500',
    route: '/data/residence',
  },
  {
    title: 'Barangay Officials & Staff',
    value: null,
    icon: 'users',
    color: 'bg-red-800 hover:bg-red-700',
    route: '/directory/officials',
  },
  {
    title: 'Barangay Clearance',
    value: null,
    icon: 'file-alt',
    color: 'bg-gray-600 hover:bg-gray-500',
    route: '/permits/clearance',
  },
  {
    title: 'Sanitary Permit',
    value: null,
    icon: 'file-alt',
    color: 'bg-sky-500 hover:bg-sky-400',
    route: '/permits/sanitary',
  },
  {
    title: 'Business Permit',
    value: null,
    icon: 'file-alt',
    color: 'bg-amber-800 hover:bg-amber-700',
    route: '/permits/business',
  },
  {
    title: 'Requested Document',
    value: null,
    icon: 'file-alt',
    color: 'bg-neutral-800 hover:bg-neutral-700',
    route: '/requests/documents',
  },
];
</script>
