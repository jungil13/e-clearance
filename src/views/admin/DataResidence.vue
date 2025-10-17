<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row justify-between items-center">
      <h2 class="text-3xl font-extrabold text-gray-800 tracking-tight">
        Registered Users ({{ totalItems }})
      </h2>

      <div class="relative w-full sm:w-80">
        <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input v-model="searchQuery" type="text" placeholder="Search by name, email, or username..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-xl text-sm transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          @input="currentPage = 1" />
      </div>
    </div>

    <!-- Users Table -->
    <div class="overflow-x-auto bg-white shadow-xl rounded-xl border border-gray-100">
      <table class="min-w-full divide-y divide-gray-200 text-left text-gray-700 text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-600 rounded-tl-xl">No</th>
            <th class="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Full Name</th>
            <th class="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Age</th>
            <th class="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Gender</th>
            <th class="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Civil Status</th>
            <th class="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Purok</th>
            <th class="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Address</th>
            <th class="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Email</th>
            <th class="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
            <th
              class="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 rounded-tr-xl">
              Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(user, index) in paginatedUsers" :key="user.id" class="hover:bg-blue-50 transition duration-100">
            <td class="py-3 px-4 text-gray-500">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td class="py-3 px-4 font-medium text-gray-800">
              {{ user.first_name }} {{ user.middle_name ? user.middle_name + ' ' : '' }}{{ user.last_name }}
            </td>
            <td class="py-3 px-4">{{ user.age }}</td>
            <td class="py-3 px-4">{{ user.gender }}</td>
            <td class="py-3 px-4">{{ user.civil_status }}</td>
            <td class="py-3 px-4">{{ user.purok }}</td>
            <td class="py-3 px-4">{{ user.address }}</td>
            <td class="py-3 px-4 text-blue-600">{{ user.email }}</td>
            <td class="py-3 px-4">
              <span :class="[
                'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                user.status === 'Pending' && 'bg-yellow-100 text-yellow-800',
                user.status === 'Approved' && 'bg-green-100 text-green-800',
                user.status === 'Rejected' && 'bg-red-100 text-red-800',
              ]">
                {{ user.status }}
              </span>
            </td>
            <td class="py-3 px-4 text-center">
              <div class="flex justify-center gap-2">
                <button @click="openViewModal(user)"
                  class="p-2 rounded-full text-green-600 hover:bg-green-100 transition duration-150"
                  title="View Details">
                  <EyeIcon class="w-5 h-5" />
                </button>
                <button @click="openEditModal(user)"
                  class="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition duration-150"
                  title="Update Status">
                  <PencilSquareIcon class="w-5 h-5" />
                </button>
                <button @click="removeUser(user)"
                  class="p-2 rounded-full text-red-600 hover:bg-red-100 transition duration-150" title="Remove User">
                  <TrashIcon class="w-5 h-5" />
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="paginatedUsers.length === 0">
            <td colspan="13" class="py-6 text-center text-gray-500">
              No registered users found matching your search criteria.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div v-if="totalPages > 1"
      class="flex justify-between items-center bg-white p-4 rounded-xl shadow-md border border-gray-100">
      <div class="text-sm text-gray-600 hidden sm:block">
        Showing
        <span class="font-semibold">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
        to
        <span class="font-semibold">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span>
        of
        <span class="font-semibold">{{ totalItems }}</span> results
      </div>

      <div class="flex items-center gap-2 mx-auto sm:mx-0">
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
          class="p-2 border border-gray-300 rounded-full transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">
          <ChevronLeftIcon class="w-5 h-5 text-gray-600" />
        </button>

        <div class="flex gap-1">
          <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="[
            'w-8 h-8 rounded-full text-sm font-medium transition-colors duration-150',
            page === currentPage
              ? 'bg-blue-600 text-white shadow-blue-400/50'
              : 'text-gray-700 hover:bg-gray-200',
          ]">
            {{ page }}
          </button>
        </div>

        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
          class="p-2 border border-gray-300 rounded-full transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">
          <ChevronRightIcon class="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>

    <!-- Edit Status Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
      <div class="bg-white w-11/12 sm:w-[450px] p-8 rounded-2xl shadow-2xl">
        <h3 class="text-xl font-bold mb-5 text-gray-800 border-b pb-2">Update User Status</h3>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select v-model="form.status"
            class="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm transition focus:ring-blue-500 focus:border-blue-500 appearance-none">
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div class="flex justify-end mt-6 gap-3 pt-4 border-t">
          <button @click="closeModal"
            class="px-5 py-2 text-gray-600 rounded-xl hover:bg-gray-100 transition font-medium">
            Cancel
          </button>
          <button @click="saveStatus"
            class="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition duration-150">
            Save Status
          </button>
        </div>
      </div>
    </div>
    <!-- View User Details Modal -->
    <div v-if="showViewModal" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
      <div class="bg-white w-11/12 sm:w-[500px] p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
        <h3 class="text-xl font-bold mb-5 text-gray-800 border-b pb-2">User Details</h3>

        <div class="space-y-3 text-gray-700 text-sm">
          <p><strong>Full Name:</strong> {{ selectedUser.first_name }} {{ selectedUser.middle_name ?
            selectedUser.middle_name + ' ' : '' }}{{ selectedUser.last_name }}</p>
          <p><strong>Age:</strong> {{ selectedUser.age }}</p>
          <p><strong>Gender:</strong> {{ selectedUser.gender }}</p>
          <p><strong>Civil Status:</strong> {{ selectedUser.civil_status }}</p>
          <p><strong>Purok:</strong> {{ selectedUser.purok }}</p>
          <p><strong>Address:</strong> {{ selectedUser.address }}</p>
          <p><strong>Email:</strong> {{ selectedUser.email }}</p>
          <p><strong>Username:</strong> {{ selectedUser.username }}</p>
          <p><strong>User Type:</strong> {{ selectedUser.user_type }}</p>
          <p><strong>Status:</strong> {{ selectedUser.status }}</p>
          <p><strong>Registered At:</strong> {{ new Date(selectedUser.created_at).toLocaleString() }}</p>
          <p><strong>Valid ID:</strong></p>
          <img
            :src="selectedUser.valid_id ? `http://localhost:5000/uploads/${selectedUser.valid_id}` : 'https://placehold.co/200x200/cccccc/333333?text=N/A'"
            alt="Valid ID"
            class="w-36 h-36 object-cover rounded-lg border-2 border-gray-300 cursor-pointer hover:scale-105 transition-transform"
            @click="openImageModal(selectedUser.valid_id)" />
        </div>

        <div class="flex justify-end mt-6 gap-3 pt-4 border-t">
          <button @click="closeViewModal"
            class="px-5 py-2 text-gray-600 rounded-xl hover:bg-gray-100 transition font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
    <div
  v-if="showImageModal"
  class="fixed inset-0 flex items-center justify-center bg-black/80 z-50"
  @click="closeImageModal"
>
  <img
    :src="`http://localhost:5000/uploads/${currentImage}`"
    alt="Full Valid ID"
    class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-lg"
  />
</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { 
  EyeIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  MagnifyingGlassIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from '@heroicons/vue/24/outline'

const searchQuery = ref('')
const showModal = ref(false)
const editingId = ref(null)
const itemsPerPage = ref(10)
const currentPage = ref(1)
const users = ref([])
const form = ref({ status: 'Pending' })
const showViewModal = ref(false)
const selectedUser = ref({})
const showImageModal = ref(false)
const currentImage = ref(null)

const openImageModal = (image) => {
  if (!image) return
  currentImage.value = image
  showImageModal.value = true
}

const closeImageModal = () => {
  currentImage.value = null
  showImageModal.value = false
}

const openViewModal = (user) => {
  selectedUser.value = user
  showViewModal.value = true
}

const closeViewModal = () => {
  selectedUser.value = {}
  showViewModal.value = false
}

const fetchUsers = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:5000/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
    users.value = res.data.data || []
    console.log('✅ Users fetched:', users.value)
  } catch (err) {
    console.error('❌ Failed to fetch users:', err)
    users.value = []
  }
}

onMounted(fetchUsers)

const filteredUsers = computed(() => {
  if (!Array.isArray(users.value)) return []
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return users.value
  return users.value.filter(u =>
    u.first_name.toLowerCase().includes(q) ||
    (u.middle_name && u.middle_name.toLowerCase().includes(q)) ||
    u.last_name.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q) ||
    u.username.toLowerCase().includes(q)
  )
})

const totalItems = computed(() => filteredUsers.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))
const paginatedUsers = computed(() => {
  if (currentPage.value > totalPages.value && totalPages.value > 0) currentPage.value = 1
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredUsers.value.slice(start, start + itemsPerPage.value)
})

const openEditModal = (user) => {
  form.value.status = user.status
  editingId.value = user.id
  showModal.value = true
}

/* ✅ Save Status + Send Email Alert Feedback */
const saveStatus = async () => {
  try {
    const token = localStorage.getItem('token')
    console.log(`🟡 Sending status update for user ${editingId.value}...`)

    const res = await axios.put(
      `http://localhost:5000/api/users/${editingId.value}/status`,
      { status: form.value.status },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    console.log('✅ Backend Response:', res.data)

    const index = users.value.findIndex(u => u.id === editingId.value)
    if (index !== -1) users.value[index].status = form.value.status
    closeModal()

    // ✅ SweetAlert success message
    Swal.fire({
      icon: 'success',
      title: 'Status Updated!',
      text: `The user has been marked as "${form.value.status}".`,
      confirmButtonColor: '#3085d6'
    })

    // ✅ Check if backend confirms email sent
    if (res.data.emailSent) {
      console.log('📧 Email sent successfully to user.')
      Swal.fire({
        icon: 'info',
        title: 'Gmail Sent!',
        text: `A Gmail notification was sent to the user.`,
        confirmButtonColor: '#3085d6'
      })
    } else {
      console.log('⚠️ No email confirmation received from backend.')
    }

  } catch (err) {
    console.error('❌ Failed to update status or send email:', err)
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'Failed to update status or send email.',
      confirmButtonColor: '#d33'
    })
  }
}

const removeUser = async (user) => {
  if (!confirm('Are you sure to remove this user?')) return
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`http://localhost:5000/api/users/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    users.value = users.value.filter(u => u.id !== user.id)
    Swal.fire('Deleted!', 'User has been removed.', 'success')
  } catch (err) {
    console.error(err)
    Swal.fire('Error', 'Failed to remove user', 'error')
  }
}

const closeModal = () => showModal.value = false
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}
</script>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>