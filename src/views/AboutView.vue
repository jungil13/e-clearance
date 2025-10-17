<template>
  <section
    class="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center px-6 py-12 font-[Poppins]"
  >
    <div
      class="max-w-5xl bg-white rounded-3xl shadow-xl p-10 md:p-16 flex flex-col md:flex-row items-center gap-10 transition-all"
    >
      <!-- Text Section -->
      <div class="flex-1 text-gray-700">
        <h2 class="text-3xl md:text-4xl font-bold text-orange-600 mb-6">
          About Us
        </h2>
        <p class="text-base leading-relaxed mb-4">
          We are the <span class="font-semibold text-gray-900">Barangay Bangbang</span> local
          government, committed to serving our residents with efficiency,
          transparency, and care.
        </p>
        <p class="text-base leading-relaxed mb-4">
          With the growing demand for faster public service, we launched the
          <span class="font-semibold text-gray-900">Barangay e-Clearance System</span> —
          a project designed to modernize how clearances are requested and processed.
        </p>

        <h3 class="text-lg font-semibold text-gray-800 mb-3">Our Mission:</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li>Provide accessible and reliable barangay services</li>
          <li>Promote digital transformation in local governance</li>
          <li>Reduce long queues and manual paperwork</li>
          <li>Ensure every resident is served with convenience and fairness</li>
        </ul>
      </div>

      <!-- Image Section -->
      <div
        class="flex-1 flex flex-col items-center justify-center bg-orange-100 rounded-2xl p-6 shadow-inner"
      >
        <img
          src="@/assets/image.png"
          alt="Community Image"
          class="w-48 h-48 md:w-56 md:h-56 rounded-2xl object-cover shadow-md"
        />
        <p class="mt-4 text-gray-600 italic text-sm">
          “Empowering community through digital service.”
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
// No logic needed yet, purely presentational
</script>
