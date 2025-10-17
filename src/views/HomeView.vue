<script setup>
</script>

<template>
  <section
    class="min-h-screen bg-gradient-to-br from-orange-100 via-white to-orange-200 flex flex-col justify-center items-center text-gray-800 font-poppins px-4 py-10"
  >
    <!-- Header Logos and Text -->
    <div class="flex flex-col items-center text-center animate-fade-in">
      <div class="flex items-center justify-center space-x-6 mb-4">
        <img
          src="@/assets/bang.png"
          alt="Barangay Logo"
          class="w-20 sm:w-24 h-auto rounded-full border-4 border-orange-300 shadow-md"
        />
        <div class="text-sm sm:text-base leading-tight">
          <p class="font-semibold uppercase text-gray-700">Republic of the Philippines</p>
          <p class="font-semibold uppercase text-gray-700">Province of Cebu</p>
          <p class="font-semibold uppercase text-gray-700">Municipality of Cordova</p>
          <p class="font-bold uppercase text-lg sm:text-xl mt-2 text-orange-700">
            Barangay Bangbang
          </p>
        </div>
        <img
          src="@/assets/cordova.png"
          alt="Municipal Logo"
          class="w-20 sm:w-24 h-auto rounded-full border-4 border-orange-300 shadow-md"
        />
      </div>
    </div>

    <!-- Welcome Section -->
    <div
      class="bg-white/80 backdrop-blur-md px-8 py-10 rounded-2xl shadow-xl text-center w-full max-w-md animate-slide-up border border-orange-200"
    >
      <h1 class="text-2xl sm:text-3xl font-bold tracking-wide mb-4 text-orange-800">
        Welcome to Barangay Bangbang
      </h1>
      <p class="text-base sm:text-lg mb-1 font-medium text-gray-700">
        Open hours: Monday to Friday (8:00 AM – 5:00 PM)
      </p>
      <p class="text-sm sm:text-base text-gray-600 mb-6">
        brgybangbang@gmail.com
      </p>

      <!-- Buttons -->
      <div class="space-y-3">
        <RouterLink
          to="/login"
          class="inline-block bg-orange-500 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:bg-orange-600 transition"
        >
          Get Started
        </RouterLink>

        <div class="flex justify-center space-x-4">
          <RouterLink
            to="/login"
            class="bg-blue-500 text-white px-4 py-1.5 rounded-md font-medium text-sm hover:bg-blue-600 transition"
          >
            Login
          </RouterLink>
          <RouterLink
            to="/register"
            class="bg-green-500 text-white px-4 py-1.5 rounded-md font-medium text-sm hover:bg-green-600 transition"
          >
            Register
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-10 text-sm text-gray-700 italic animate-fade-in">
      <p>“Serving the community with speed, simplicity, and sincerity.”</p>
    </footer>
  </section>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}
.animate-slide-up {
  animation: slide-up 1.2s ease-out forwards;
}
</style>
