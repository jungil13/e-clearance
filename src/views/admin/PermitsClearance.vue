<template>
  <div class="min-h-screen p-4 sm:p-6 lg:p-10 flex flex-col xl:flex-row gap-8 font-sans">
    
    <!-- Left Section: Data Table -->
    <div class="bg-white p-4 sm:p-6 shadow-xl rounded-2xl w-full xl:w-2/3 flex flex-col transition-all duration-300 border border-gray-100">
      
      <!-- Header & Search -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center px-2 py-3 border-b-2 border-orange-500/10 mb-4">
        <h2 class="font-extrabold text-gray-900 text-2xl tracking-tight mb-3 sm:mb-0">
          Clearance Requests <span class="text-orange-600 ml-1 font-mono text-xl">({{ totalItems }})</span>
        </h2>

        <div class="relative w-full sm:w-80">
          <!-- Magnifying Glass Icon (inline SVG replacement for heroicons) -->
          <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, purok, or purpose..."
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-inner transition duration-150"
            @input="resetPageForSearch"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="p-10 text-center text-gray-500">
        <div
          class="animate-spin inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"
        ></div>
        <p class="mt-3 font-medium">Fetching clearance data...</p>
      </div>

      <!-- Table -->
      <div v-else class="flex-grow overflow-x-auto">
        <table class="w-full text-sm min-w-[700px] border-separate border-spacing-y-3">
          <thead class="text-gray-600 uppercase tracking-wider text-xs sticky top-0 bg-white z-10 border-b border-gray-100">
            <tr>
              <th class="py-3 px-4 text-left w-[5%] font-bold">No.</th>
              <th class="py-3 px-4 text-left w-[25%] font-bold">Fullname</th>
              <th class="py-3 px-4 text-left w-[15%] font-bold hidden sm:table-cell">Gender</th>
              <th class="py-3 px-4 text-left w-[15%] font-bold">Purok</th>
              <th class="py-3 px-4 text-left w-[30%] font-bold hidden md:table-cell">Purpose</th>
              <th class="py-3 px-4 text-center w-[10%] font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(person, index) in paginatedResidents"
              :key="person.id"
              class="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 cursor-pointer border border-gray-100"
            >
              <td class="py-3 px-4 text-gray-500 rounded-l-xl font-mono">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="py-3 px-4 font-semibold text-gray-800">{{ person.fullname }}</td>
              <td class="py-3 px-4 text-gray-600 hidden sm:table-cell">
                <span :class="{'bg-blue-100 text-blue-700': person.gender === 'Male', 'bg-pink-100 text-pink-700': person.gender === 'Female', 'bg-gray-100 text-gray-600': person.gender === 'Other'}" class="px-3 py-1 rounded-full text-xs font-medium">{{ person.gender }}</span>
              </td>
              <td class="py-3 px-4 text-gray-600 font-medium">{{ person.purok }}</td>
              <td class="py-3 px-4 text-gray-600 truncate max-w-xs hidden md:table-cell">{{ person.purpose }}</td>
              <td class="py-3 px-4 text-center rounded-r-xl">
                <button
                  @click.stop="goToPrint(person)"
                  class="bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-2 rounded-full text-xs font-bold transition shadow-lg shadow-orange-300/50 hover:shadow-xl hover:shadow-orange-400/60 transform active:scale-95"
                >
                  <span class="hidden sm:inline mr-1">Generate</span>
                  <!-- SVG for Print/Download Icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8" rx="1"/></svg>
                </button>
              </td>
            </tr>
            <tr v-if="!paginatedResidents.length">
              <td colspan="6" class="p-8 text-center text-gray-500">
                <!-- SVG for No Data Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 inline-block mb-2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                <p class="font-medium text-lg">No clearance records found matching your criteria.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div
        v-if="totalPages > 1"
        class="flex flex-col sm:flex-row justify-between items-center bg-white p-4 mt-auto border-t border-gray-100"
      >
        <div class="text-sm text-gray-600 mb-4 sm:mb-0">
          Showing
          <span class="font-bold text-gray-800">{{
            Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)
          }}</span>
          to
          <span class="font-bold text-gray-800">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span>
          of
          <span class="font-bold text-gray-800">{{ totalItems }}</span> results
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="p-2 border border-gray-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition duration-150 transform active:scale-95"
          >
            <!-- ChevronLeftIcon SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          <div class="flex gap-1">
            <template v-for="page in totalPages" :key="page">
              <button
                v-if="
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                "
                @click="goToPage(page)"
                :class="[
                  'w-8 h-8 rounded-full text-sm font-bold transition duration-150 transform hover:scale-105',
                  page === currentPage
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-300/50'
                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600',
                ]"
              >
                {{ page }}
              </button>
              <span
                v-else-if="
                  (page === currentPage - 2 && currentPage > 3) ||
                  (page === currentPage + 2 && currentPage < totalPages - 2)
                "
                class="text-gray-500 w-8 h-8 flex items-center justify-center"
                >...</span
              >
            </template>
          </div>

          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="p-2 border border-gray-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition duration-150 transform active:scale-95"
          >
            <!-- ChevronRightIcon SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Right Section: New Request Form -->
    <div
      class="bg-white shadow-xl rounded-2xl w-full xl:w-1/3 p-6 space-y-6 h-fit sticky top-10 self-start border border-gray-100"
    >
      <h3 class="font-extrabold text-orange-700 text-2xl border-b pb-3 mb-2 flex items-center space-x-2">
        <!-- Plus Circle Icon (inline SVG) -->
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        <span>New Request Form</span>
      </h3>
      <p v-if="userId" class="text-xs text-gray-500 border-b border-dashed pb-2">
        Admin Mode Active | User ID:
        <span class="font-mono text-gray-700 font-semibold">{{ userId }}</span>
      </p>

      <div class="space-y-4">
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Fullname</label>
          <input
            v-model="newResident.fullname"
            class="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-orange-500 focus:border-orange-500 transition shadow-sm placeholder:text-gray-400"
            placeholder="Enter full name"
            required
          />
        </div>

        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Gender</label>
          <select
            v-model="newResident.gender"
            class="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-orange-500 focus:border-orange-500 transition shadow-sm"
            required
          >
            <option disabled value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Purok (Village/Zone)</label>
          <input
            v-model="newResident.purok"
            class="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-orange-500 focus:border-orange-500 transition shadow-sm placeholder:text-gray-400"
            placeholder="e.g., Nangka, Waling-Waling"
            required
          />
        </div>

        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Purpose of Clearance</label>
          <input
            v-model="newResident.purpose"
            class="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-orange-500 focus:border-orange-500 transition shadow-sm placeholder:text-gray-400"
            placeholder="e.g., For work, Business permit, Scholarship"
            required
          />
        </div>

        <p v-if="formError" class="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-xl border border-red-300">{{ formError }}</p>
      </div>

      <div class="flex justify-end pt-4 border-t border-gray-100">
        <button
          @click="addResident"
          :disabled="isSaving"
          class="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full text-md font-bold transition shadow-lg shadow-orange-400/50 disabled:opacity-50 transform active:scale-95"
        >
          <span
            v-if="isSaving"
            class="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"
          ></span>
          <!-- Plus Icon SVG -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 mr-2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {{ isSaving ? 'Saving...' : 'Add New Request' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
// Imported icons were removed to adhere to the single file policy if this were HTML/React, 
// but since this is a Vue template, we must provide inline SVG replacements for the heroicons, 
// as I did in the template block.
// import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

import { useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

const router = useRouter()
const isLoading = ref(true)
const isSaving = ref(false)
const formError = ref('')
const residents = ref([])
// Note: newResident uses empty string as default, which is correct for v-model.
const newResident = ref({ fullname: '', gender: '', purok: '', purpose: '' })
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(8)
const userId = ref(null)

onMounted(async () => {
  await fetchClearances()
})

const fetchClearances = async () => {
  try {
    isLoading.value = true
    const token = localStorage.getItem('token')
    // Focus only on Barangay type for admin view
    const res = await axios.get('http://localhost:5000/api/clearances/type/Barangay', {
      headers: { Authorization: `Bearer ${token}` },
    })
    // Normalize to the UI shape
    residents.value = (res.data || []).map((c) => ({
      id: c.id,
      fullname: c.fullname,
      gender: c.gender || 'Unknown', // Use 'Unknown' fallback if backend doesn't return
      purok: c.purok || 'N/A', // Use 'N/A' fallback
      purpose: c.purpose,
      type: c.type,
      pickup_date: c.pickup_date,
      requested_at: c.requested_at,
      status: c.status,
    }))
    // Best-effort derive a numeric user id if present
    userId.value = res.data?.[0]?.user_id || null
  } catch (err) {
    console.error("Failed to fetch clearances:", err)
    Swal.fire('Error', err.response?.data?.message || 'Failed to load clearances', 'error')
  } finally {
    isLoading.value = false
  }
}

const filteredResidents = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return residents.value
  return residents.value.filter(
    (r) =>
      r.fullname.toLowerCase().includes(q) ||
      r.purok.toLowerCase().includes(q) ||
      r.purpose.toLowerCase().includes(q)
  )
})

const totalItems = computed(() => filteredResidents.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))
const paginatedResidents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredResidents.value.slice(start, start + itemsPerPage.value)
})

watch(totalPages, (newPages) => {
  if (currentPage.value > newPages && newPages >= 1) currentPage.value = newPages
  else if (newPages === 0) currentPage.value = 1
})

const resetPageForSearch = () => (currentPage.value = 1)

// --- FIX APPLIED HERE: Including Purok and Gender in the API Payload ---
const addResident = async () => {
  const r = newResident.value
  if (!r.fullname.trim() || !r.gender.trim() || !r.purok.trim() || !r.purpose.trim()) {
    formError.value = 'Please fill out all fields.'
    return
  }
  
  // Use backend to create a Barangay clearance request on behalf of current user
  const token = localStorage.getItem('token')
  if (!token) {
    formError.value = 'You must be logged in.'
    return
  }
  isSaving.value = true
  
  const payload = {
    type: 'Barangay',
    full_name: r.fullname,
    purpose: r.purpose,
    // FIX: Included the missing form fields in the payload for the backend to save them
    purok: r.purok,
    gender: r.gender, 
    pickup_date: new Date().toISOString().slice(0, 10),
  }

  try {
    await axios.post(
      'http://localhost:5000/api/clearances/request',
      payload, // Using the complete payload
      { headers: { Authorization: `Bearer ${token}` } }
    )
    
    // Refresh the list to show the newly added item from the backend
    await fetchClearances()
    
    // Reset form and UI state
    newResident.value = { fullname: '', gender: '', purok: '', purpose: '' }
    currentPage.value = 1
    formError.value = ''
    Swal.fire('Success', 'Clearance request added successfully!', 'success')
  } catch (e) {
    console.error("Failed to add resident:", e)
    formError.value = e.response?.data?.message || 'Failed to save request.'
    Swal.fire('Error', formError.value, 'error')
  } finally {
    isSaving.value = false
  }
}

const goToPrint = (resident) => {
  // Use a simple mock console log or modal if useRouter is not fully configured
  // For this environment, we rely on the user's environment to handle the router push.
  router.push({ name: 'BarangayClearancePrint', query: { data: JSON.stringify(resident) } })
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}
</script>
