<template>
  <div class="space-y-6">
    <!-- Header and Controls -->
    <div class="flex flex-col gap-4 sm:flex-row justify-between items-center">
      <h2 class="text-3xl font-extrabold text-gray-800 tracking-tight">
        Total Population ({{ totalItems }})
      </h2>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <!-- Search Input -->
        <div class="relative w-full">
          <MagnifyingGlassIcon
            class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by Fullname..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300  bg-white rounded-xl text-sm transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            @input="currentPage = 1"
          />
        </div>

        <!-- Add Button -->
        <button
          @click="openAddModal"
          class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition duration-150 transform hover:scale-[1.02]"
        >
          <PlusIcon class="w-5 h-5" />
          <span class="hidden sm:inline">Add Resident</span>
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="overflow-x-auto bg-white shadow-xl rounded-xl border border-gray-100">
      <table class="min-w-full divide-y divide-gray-200 text-left text-gray-700 text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-600 rounded-tl-xl">No</th>
            <th class="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Fullname</th>
            <th class="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Age</th>
            <th class="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Gender</th>
            <th class="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Civil Status</th>
            <th class="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Purok</th>
            <th class="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 rounded-tr-xl">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="(resident, index) in paginatedResidents"
            :key="resident.id"
            class="hover:bg-blue-50 transition duration-100"
          >
            <!-- Adjusted index for correct pagination sequence -->
            <td class="py-3 px-4 text-gray-500">
              {{ (currentPage - 1) * itemsPerPage + index + 1 }}
            </td>
            <td class="py-3 px-4 font-medium text-gray-800">{{ resident.fullname }}</td>
            <td class="py-3 px-4">{{ resident.age }}</td>
            <td class="py-3 px-4">{{ resident.gender }}</td>
            <td class="py-3 px-4">{{ resident.status }}</td>
            <td class="py-3 px-4">{{ resident.purok }}</td>
            <td class="py-3 px-4 text-center">
              <div class="flex justify-center gap-2">
                <!-- Edit Button with Icon -->
                <button
                  @click="openEditModal(resident)"
                  class="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition duration-150"
                  title="Edit Resident"
                >
                  <PencilSquareIcon class="w-5 h-5" />
                </button>
                <!-- Remove Button with Icon -->
                <button
                  @click="removeResident(resident)"
                  class="p-2 rounded-full text-red-600 hover:bg-red-100 transition duration-150"
                  title="Remove Resident"
                >
                  <TrashIcon class="w-5 h-5" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedResidents.length === 0">
            <td colspan="7" class="py-6 text-center text-gray-500">
              No residents found matching your search criteria.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div
      v-if="totalPages > 1"
      class="flex justify-between items-center bg-white p-4 rounded-xl shadow-md border border-gray-100"
    >
      <div class="text-sm text-gray-600 hidden sm:block">
        Showing
        <span class="font-semibold">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
        to
        <span class="font-semibold">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span>
        of
        <span class="font-semibold">{{ totalItems }}</span> results
      </div>

      <div class="flex items-center gap-2 mx-auto sm:mx-0">
        <!-- Previous Button -->
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="p-2 border border-gray-300 rounded-full transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          <ChevronLeftIcon class="w-5 h-5 text-gray-600" />
        </button>

        <!-- Page Numbers -->
        <div class="flex gap-1">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'w-8 h-8 rounded-full text-sm font-medium transition-colors duration-150',
              page === currentPage
                ? 'bg-blue-600 text-white shadow-blue-400/50'
                : 'text-gray-700 hover:bg-gray-200',
            ]"
          >
            {{ page }}
          </button>
        </div>

        <!-- Next Button -->
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="p-2 border border-gray-300 rounded-full transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          <ChevronRightIcon class="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
    
    <!-- Modal (Styling Improved) -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm"
    >
      <div class="bg-white w-11/12 sm:w-[450px] p-8 rounded-2xl shadow-2xl transform transition-all duration-300 scale-100">
        <h3 class="text-xl font-bold mb-5 text-gray-800 border-b pb-2">
          {{ isEditing ? 'Edit Resident Details' : 'Add New Resident' }}
        </h3>

        <form class="space-y-4" @submit.prevent="saveResident">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fullname</label>
            <input
              v-model="form.fullname"
              type="text"
              required
              class="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm transition focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                v-model="form.age"
                type="number"
                min="0"
                required
                class="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm transition focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                v-model="form.gender"
                required
                class="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm transition focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="" disabled>Select</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Civil Status</label>
              <input
                v-model="form.status"
                type="text"
                required
                class="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm transition focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Purok</label>
              <input
                v-model="form.purok"
                type="text"
                required
                class="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm transition focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </form>

        <div class="flex justify-end mt-6 gap-3 pt-4 border-t">
          <button
            @click="closeModal"
            class="px-5 py-2 text-gray-600 rounded-xl hover:bg-gray-100 transition font-medium"
          >
            Cancel
          </button>
          <button
            @click="saveResident"
            class="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition duration-150"
            type="submit"
          >
            {{ isEditing ? 'Save Changes' : 'Add Resident' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  MagnifyingGlassIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from '@heroicons/vue/24/outline'

// --- State ---
const searchQuery = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const itemsPerPage = ref(8)
const currentPage = ref(1)

const residents = ref([])
const form = ref({ fullname: '', age: null, gender: '', status: '', purok: '' })

const API_URL = 'http://localhost:5000/api/residents'

// --- Fetch Residents from Backend ---
const fetchResidents = async () => {
  try {
    const res = await axios.get(API_URL)
    residents.value = res.data
  } catch (err) {
    console.error('Failed to fetch residents:', err)
    Swal.fire('Error', 'Failed to fetch residents', 'error')
  }
}

// --- Computed ---
const filteredResidents = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return residents.value
  return residents.value.filter(r =>
    r.fullname.toLowerCase().includes(query) ||
    String(r.age).includes(query) ||
    r.purok.toLowerCase().includes(query)
  )
})

const totalItems = computed(() => filteredResidents.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))
const paginatedResidents = computed(() => {
  if (currentPage.value > totalPages.value && totalPages.value > 0) currentPage.value = 1
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredResidents.value.slice(start, end)
})

// --- Pagination ---
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

// --- Modal ---
const openAddModal = () => {
  form.value = { fullname: '', age: null, gender: '', status: '', purok: '' }
  isEditing.value = false
  showModal.value = true
}

const openEditModal = (resident) => {
  form.value = { ...resident }
  editingId.value = resident.id
  isEditing.value = true
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

// --- CRUD ---
const saveResident = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`${API_URL}/${editingId.value}`, form.value)
      Swal.fire('Updated!', 'Resident details updated successfully.', 'success')
    } else {
      await axios.post(API_URL, form.value)
      Swal.fire('Added!', 'New resident added successfully.', 'success')
    }
    await fetchResidents()
    closeModal()
  } catch (err) {
    console.error('Failed to save resident:', err)
    Swal.fire('Error', 'Failed to save resident', 'error')
  }
}

const removeResident = async (resident) => {
  const result = await Swal.fire({
    title: `Delete ${resident.fullname}?`,
    text: "This action cannot be undone!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  })

  if (result.isConfirmed) {
    try {
      await axios.delete(`${API_URL}/${resident.id}`)
      await fetchResidents()
      Swal.fire('Deleted!', `${resident.fullname} has been deleted.`, 'success')
    } catch (err) {
      console.error('Failed to delete resident:', err)
      Swal.fire('Error', 'Failed to delete resident', 'error')
    }
  }
}

// --- Lifecycle ---
onMounted(() => {
  fetchResidents()
})
</script>


<style scoped>
/* Custom style for the modal backdrop blur effect */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Hide default stepper arrows for number input */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
button.w-8.h-8 {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
button.w-8.h-8:hover {
  background-color: #e0e7ff; /* light blue hover */
}
button.bg-blue-600.text-white {
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
}
</style>
