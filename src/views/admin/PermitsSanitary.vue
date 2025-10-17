<template>
  <div class="min-h-screen p-4 sm:p-6 font-sans">
    <div v-if="activeView === 'list'" class="flex flex-col xl:flex-row gap-6">
      <div class="bg-white shadow-2xl rounded-2xl w-full xl:w-2/3 flex flex-col overflow-hidden transition-all duration-300">
        <div class="flex flex-col sm:flex-row justify-between items-center px-4 py-3 sm:py-4 border-b border-gray-100 mb-2">
          <h2 class="font-extrabold text-gray-900 uppercase text-xl tracking-wide mb-2 sm:mb-0">
            Barangay Sanitary <span class="text-teal-600">({{ totalItems }})</span>
          </h2>

          <div class="flex items-center gap-3 w-full sm:w-auto mt-3 sm:mt-0">
            <div class="relative flex-grow sm:w-64">
              <MagnifyingGlassIcon
                class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search requests..."
                class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition duration-150"
                @input="currentPage = 1"
              />
            </div>
            </div>
        </div>

        <div class="flex-grow overflow-x-auto p-4 pt-0">
          <table class="w-full text-sm min-w-[700px] border-separate border-spacing-y-2">
            <thead class="text-gray-600 uppercase tracking-wider text-xs sticky top-0 bg-white z-10">
              <tr>
                <th class="py-3 px-4 text-left w-[5%] font-semibold">No.</th>
                <th class="py-3 px-4 text-left w-[25%] font-semibold">Fullname</th>
                <th class="py-3 px-4 text-left w-[10%] font-semibold">Gender</th>
                <th class="py-3 px-4 text-left w-[15%] font-semibold">Purok</th>
                <th class="py-3 px-4 text-left w-[35%] font-semibold">Business Purpose</th>
                <th class="py-3 px-4 text-center w-[10%] font-semibold">Action</th>
              </tr>
            </thead>
            <tbody v-if="isLoading">
              <tr>
                <td colspan="6" class="p-8 text-center text-teal-600 font-medium">Loading records...</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr
                v-for="(person, index) in paginatedPermits"
                :key="index"
                class="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
              >
                <td class="py-3 px-4 text-gray-500 rounded-l-lg">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="py-3 px-4 font-semibold text-gray-800">{{ person.fullname }}</td>
                <td class="py-3 px-4 text-gray-600">{{ person.gender }}</td>
                <td class="py-3 px-4 text-gray-600">{{ person.purok }}</td>
                <td class="py-3 px-4 text-gray-600 truncate max-w-xs">{{ person.purpose }}</td>
                <td class="py-3 px-4 text-center rounded-r-lg">
                  <button
                    @click.stop="switchToPrint(person)"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full text-xs font-bold transition shadow-md shadow-blue-300/50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline sm:mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4.5A.5.5 0 015.5 4h9a.5.5 0 01.5.5v7.5a.5.5 0 01-.5.5h-2a.5.5 0 000 1h2A1.5 1.5 0 0017 12V4a1.5 1.5 0 00-1.5-1.5h-9A1.5 1.5 0 005 4v7.5a.5.5 0 001 0V4.5z" />
                      <path fill-rule="evenodd" d="M11.97 10.03a.75.75 0 011.06 0l3.25 3.25a.75.75 0 01-1.06 1.06L13.5 11.56V18a.75.75 0 01-1.5 0v-6.44l-1.68 1.69a.75.75 0 11-1.06-1.06l3.25-3.25z" clip-rule="evenodd" />
                    </svg>
                    <span class="hidden sm:inline">Generate</span>
                  </button>
                </td>
              </tr>
              <tr v-if="!paginatedPermits.length && !isLoading">
                <td colspan="6" class="p-8 text-center text-gray-500 bg-white/70">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 inline-block mb-1 text-gray-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-2.25A3.375 3.375 0 0010.5 12.75v3.375m8.25-1.5h-2.25m3.75 0v2.25m-4.5 0v3.375M12 21h4.5M15.75 3h.008v.008h-.008V3zm2.25 0h.008v.008h-.008V3zm2.25 0h.008v.008h-.008V3z" />
                  </svg>
                  <p class="font-medium">No sanitary records found matching your criteria.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="totalPages > 1"
          class="flex flex-col sm:flex-row justify-between items-center bg-white/80 p-4 border-t border-gray-100 mt-auto"
        >
          <div class="text-sm text-gray-600 mb-3 sm:mb-0">
            Showing
            <span class="font-bold text-gray-800">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
            to
            <span class="font-bold text-gray-800">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span>
            of
            <span class="font-bold text-gray-800">{{ totalItems }}</span> results
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="p-2 border border-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-100 transition duration-150"
            >
              <ChevronLeftIcon class="w-5 h-5 text-gray-600" />
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
                    'w-8 h-8 rounded-full text-sm font-bold transition duration-150',
                    page === currentPage
                      ? 'bg-teal-600 text-white shadow-lg shadow-teal-300/50'
                      : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600',
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
              class="p-2 border border-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-100 transition duration-150"
            >
              <ChevronRightIcon class="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <transition name="slide-in">
        <div
          v-if="showAddForm"
          class="bg-white shadow-2xl rounded-2xl w-full xl:w-1/3 p-6 space-y-5 h-fit sticky top-6 self-start"
        >
          <h3 class="font-bold text-gray-800 text-xl border-b pb-3 mb-2">New Sanitary Request 📝</h3>
          
          <div v-if="formError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
            <p class="font-semibold text-sm">{{ formError }}</p>
          </div>

          <form @submit.prevent="addPermit" class="space-y-4">
            <div>
              <label for="fullname" class="text-sm font-semibold text-gray-700 block mb-1">Fullname</label>
              <input
                id="fullname"
                v-model="newPermit.fullname"
                class="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 transition shadow-sm"
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <label for="gender" class="text-sm font-semibold text-gray-700 block mb-1">Gender</label>
              <select
                id="gender"
                v-model="newPermit.gender"
                class="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 appearance-none transition shadow-sm"
                required
              >
                <option disabled value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div>
              <label for="purok" class="text-sm font-semibold text-gray-700 block mb-1">Purok (Village/Zone)</label>
              <input
                id="purok"
                v-model="newPermit.purok"
                class="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 transition shadow-sm"
                placeholder="e.g., Nangka, Waling-Waling"
                required
              />
            </div>
            <div>
              <label for="purpose" class="text-sm font-semibold text-gray-700 block mb-1">Business Purpose</label>
              <input
                id="purpose"
                v-model="newPermit.purpose"
                class="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 transition shadow-sm"
                placeholder="e.g., Food business, Laundry shop, etc."
                required
              />
            </div>
          
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="submit"
                :disabled="isSaving"
                class="flex items-center bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-lg shadow-teal-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 mr-1">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                {{ isSaving ? 'Saving...' : 'Add Request' }}
              </button>
            </div>
          </form>
        </div>
      </transition>
    </div>

    <div v-else-if="activeView === 'print'" class="bg-white shadow-2xl rounded-2xl p-6">
      <div class="flex justify-between items-center mb-6 border-b pb-4">
        <h2 class="text-2xl font-bold text-teal-700">Sanitary Permit Print Preview</h2>
        <div class="flex gap-3">
          <button @click="switchToList" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold transition">
            &larr; Back to List
          </button>
          <button @click="printPage" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition">
            Print Document 🖨️
          </button>
        </div>
      </div>
      <div class="p-10 border border-gray-300 rounded-lg min-h-[400px]">
        <p class="text-lg font-medium text-gray-800">Permit Details for **{{ printPermit.fullname }}**</p>
        <p class="text-gray-600">This is where the detailed, styled print document for the Sanitary Permit would be rendered.</p>
        <pre class="mt-4 bg-gray-100 p-4 rounded text-xs text-gray-700">{{ printPermit }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// --- Fixed Missing Imports ---
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'
import axios from 'axios'
import Swal from 'sweetalert2'

// --- View State & Navigation ---
const router = useRouter()
const activeView = ref('list') // 'list' or 'print'
const printPermit = ref({}) // Data for the currently selected permit for printing

const switchToPrint = (permit) => {
  const detailed = generatePermitDetails(permit)
  // NOTE: Assuming 'BarangaySanitaryPrint' is a route name defined in your router configuration.
  // The 'data' query param is used to pass the details to that print view.
  router.push({ name: 'BarangaySanitaryPrint', query: { data: JSON.stringify(detailed) } })
}

const switchToList = () => {
  printPermit.value = {}
  activeView.value = 'list'
}

const printPage = () => window.print()

// --- Data & Logic ---
const permits = ref([]) // all sanitary permits
const showAddForm = ref(true)
const newPermit = ref({ fullname: '', gender: '', purok: '', purpose: '' })
const formError = ref('')
const isLoading = ref(false) // State for fetching data
const isSaving = ref(false)  // State for adding a new permit

// --- Search, Filter, Pagination ---
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

const filteredPermits = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return permits.value
  return permits.value.filter(
    (p) =>
      p.fullname.toLowerCase().includes(q) ||
      p.purok.toLowerCase().includes(q) ||
      p.purpose.toLowerCase().includes(q)
  )
})

const totalItems = computed(() => filteredPermits.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))
const paginatedPermits = computed(() => {
  // Logic to adjust currentPage if totalPages changes (e.g., due to search)
  if (currentPage.value > totalPages.value && totalPages.value >= 1) {
    currentPage.value = totalPages.value
  } else if (totalPages.value === 0) {
    currentPage.value = 1
  }
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredPermits.value.slice(start, end)
})

// --- Add Sanitary Permit Request ---
const addPermit = async () => {
  const r = newPermit.value
  if (!r.fullname.trim() || !r.gender.trim() || !r.purok.trim() || !r.purpose.trim()) {
    formError.value = 'Please fill out all fields.'
    return
  }

  const token = localStorage.getItem('token')
  if (!token) {
    formError.value = 'You must be logged in.'
    Swal.fire('Login Required', 'Please log in to submit a request.', 'warning')
    return
  }

  isSaving.value = true
  formError.value = ''

  const payload = {
    type: 'Sanitary',
    full_name: r.fullname,
    gender: r.gender,
    purok: r.purok,
    purpose: r.purpose,
    // Using a more reliable way to get a simple YYYY-MM-DD date
    pickup_date: new Date().toISOString().slice(0, 10), 
  }

  try {
    // Assuming this endpoint is correct for adding a new clearance request
    await axios.post('http://localhost:5000/api/clearances/request', payload, {
      headers: { Authorization: `Bearer ${token}` },
    })

    await fetchPermits()
    newPermit.value = { fullname: '', gender: '', purok: '', purpose: '' }
    currentPage.value = 1
    Swal.fire('Success', 'Sanitary clearance request added successfully!', 'success')
  } catch (e) {
    console.error('Failed to add sanitary permit:', e)
    // Access nested message if available, otherwise use a generic message
    const msg = e.response?.data?.message || e.message || 'Failed to save request.'
    formError.value = msg
    Swal.fire('Error', msg, 'error')
  } finally {
    isSaving.value = false
  }
}

// --- Fetch Sanitary Clearances (Admin or User) ---
const fetchPermits = async () => {
  try {
    isLoading.value = true
    const token = localStorage.getItem('token')
    
    if (!token) {
      Swal.fire('Error', 'Authentication token is missing. Cannot fetch data.', 'error')
      permits.value = []
      return
    }

    // Assuming this endpoint fetches all clearances of type 'Sanitary'
    const res = await axios.get('http://localhost:5000/api/clearances/type/Sanitary', {
      headers: { Authorization: `Bearer ${token}` },
    })

    permits.value = (res.data || []).map((c) => ({
      id: c.id,
      // Handle potential variations in key names from API response
      fullname: c.full_name || c.fullname || 'Unknown', 
      gender: c.gender || 'Unknown',
      purok: c.purok || 'N/A',
      purpose: c.purpose || 'N/A',
      type: c.type,
      pickup_date: c.pickup_date,
      requested_at: c.requested_at,
      status: c.status,
    }))
  } catch (err) {
    console.error('Failed to fetch sanitary clearances:', err)
    Swal.fire('Error', err.response?.data?.message || 'Failed to load sanitary clearances', 'error')
    permits.value = []
  } finally {
    isLoading.value = false
  }
}

// --- Pagination ---
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

// --- Print Details Helper ---
const generatePermitDetails = (resident) => {
  const today = new Date()
  const currentYear = today.getFullYear()
  const issuedDate = `${currentYear}-01-01`
  const expiryDate = `${currentYear}-12-31`
  
  // FIX: 'type' was undefined in the original code. Set it explicitly.
  const type = 'Sanitary Permit' 

  return {
    ...resident,
    registeredName: resident.fullname.toUpperCase().replace(/\s/g, '-') + '-ENTERPRISES', // Added global regex for spaces
    type: type, // Fixed: Now uses the defined type variable
    address: `PUROK ${resident.purok.toUpperCase()}, BARANGAY BANG-BANG, CORDOVA CEBU`,
    permitNo: Math.floor(Math.random() * 10000) + '-' + currentYear, // Increased random range
    dateIssued: issuedDate,
    expirationDate: expiryDate,
    formattedDateIssued: formatDateForPrint(issuedDate),
    formattedExpirationDate: formatDateForPrint(expiryDate),
    // You might want to add other signing details here (Barangay Captain, Health Officer, etc.)
  }
}

const formatDateForPrint = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  // Ensure date is valid before proceeding
  if (isNaN(date)) return dateString

  const day = date.getDate()
  const month = date.toLocaleDateString('en-US', { month: 'long' }).toUpperCase()
  const year = date.getFullYear()
  return `${month} ${day}, ${year}`
}

// --- Lifecycle ---
onMounted(fetchPermits)
</script>

<style scoped>
/* Tailwind-based slide-in animation for the add form */
.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
.slide-in-enter-from,
.slide-in-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>