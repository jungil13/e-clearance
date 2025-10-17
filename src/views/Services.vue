<template>
  <section
    class="min-h-screen bg-gradient-to-b from-orange-100 to-white font-[Poppins] flex flex-col items-center py-16 px-6"
  >
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-3xl md:text-4xl font-bold text-orange-600 mb-3">
        Our Services
      </h1>
      <p class="text-gray-700 max-w-2xl mx-auto text-base">
        Choose from our available e-services below and easily request your
        barangay documents online.
      </p>
    </div>

    <!-- Services Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
      <!-- Service Card -->
      <div
        v-for="service in services"
        :key="service.title"
        class="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition hover:-translate-y-2 hover:shadow-2xl duration-300"
      >
        <!-- Icon -->
        <div
          class="w-20 h-20 flex items-center justify-center rounded-full bg-orange-100 mb-6 relative"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-orange-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <!-- Title -->
        <h2 class="text-lg font-bold text-gray-800 mb-2 uppercase">
          {{ service.title }}
        </h2>

        <!-- Description -->
        <p class="text-gray-600 text-sm mb-6 whitespace-pre-line">
          {{ service.description }}
        </p>

        <!-- Button -->
        <RouterLink
          :to="service.link"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow-md transition"
        >
          Continue
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
const services = [
  {
    title: "Brgy. Clearance",
    description: "Requirements:\n• Indorsement letter from Purok President\n• Valid ID",
    link: "/clearance",
  },
  {
    title: "Brgy. Business Permit",
    description:
      "Provide the requirements needed for Barangay Business Permit and request online.",
    link: "/business-permit",
  },
  {
    title: "Sanitary Permit",
    description:
      "Provide the requirements needed for Sanitary Clearance and request online.",
    link: "/sanitary",
  },
];
</script>
