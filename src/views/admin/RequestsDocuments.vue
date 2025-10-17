<template>
  <div class="p-4 sm:p-6 md:p-10 min-h-screen font-sans">
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-5 border-b-2 border-orange-500/20 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">
            Document Requests Dashboard
          </h1>
          <p class="text-sm text-gray-500 mt-1">
            Manage and update the status of all submitted clearance requests.
          </p>
        </div>

        <!-- Search -->
        <div class="relative w-full md:w-72">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search name or type..."
            class="w-full border border-gray-300 rounded-full px-4 py-2 pl-10 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
        </div>
      </div>

      <!-- Table Container -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm min-w-[800px] border-separate border-spacing-y-2">
          <thead class="text-gray-600 uppercase tracking-wider text-xs sticky top-0 bg-gray-50 z-10">
            <tr>
              <th class="px-4 py-3 text-left font-bold w-[5%]">No</th>
              <th class="px-4 py-3 text-left font-bold w-[20%]">Name</th>
              <th class="px-4 py-3 text-left font-bold w-[15%]">Pickup Date</th>
              <th class="px-4 py-3 text-left font-bold w-[20%]">Clearance Type</th>
              <th class="px-4 py-3 text-left font-bold w-[15%]">Date Requested</th>
              <th class="px-4 py-3 text-left font-bold w-[15%]">Status</th>
              <th class="px-4 py-3 text-center font-bold w-[10%]">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(req, index) in paginatedRequests"
              :key="req.id"
              class="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 border-t border-gray-100/50"
            >
              <td class="px-4 py-4 text-gray-500 rounded-l-lg font-mono">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="px-4 py-4 font-semibold text-gray-800">
                {{ req.fullname }}
              </td>
              <td class="px-4 py-4 text-gray-600 font-medium">
                {{ formatDate(req.pickup_date) }}
              </td>
              <td class="px-4 py-4 text-orange-600 font-bold uppercase">
                {{ req.type }}
              </td>
              <td class="px-4 py-4 text-gray-600">
                {{ formatDate(req.requested_at) }}
              </td>

              <!-- Status Badge -->
              <td class="px-4 py-4">
                <span
                  :class="{
                    'bg-blue-100 text-blue-700': req.status === 'For pickup',
                    'bg-yellow-100 text-yellow-700': req.status === 'Processing',
                    'bg-red-100 text-red-700': req.status === 'Pending',
                    'bg-green-100 text-green-700': req.status === 'Released'
                  }"
                  class="px-3 py-1 text-xs font-semibold rounded-full"
                >
                  {{ req.status }}
                </span>
              </td>

              <!-- Action Button -->
              <td class="px-4 py-4 text-center rounded-r-lg">
                <button
                  class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-xs font-bold transition shadow-md shadow-orange-300/50 hover:shadow-lg hover:shadow-orange-400/60 transform active:scale-95"
                  @click="openModal(req)"
                >
                  Update Status
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="filteredRequests.length" class="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
        <p class="text-sm text-gray-600">
          Showing {{ startItem }}–{{ endItem }} of {{ filteredRequests.length }} requests
        </p>
        <div class="flex gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 bg-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 bg-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <!-- No Data -->
      <div v-if="!filteredRequests.length" class="p-12 text-center text-gray-500 bg-white/70">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 inline-block mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        <p class="font-medium text-lg">No matching requests found.</p>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity"
      @click.self="closeModal"
    >
      <div
        class="bg-white w-full max-w-sm md:max-w-md rounded-2xl shadow-2xl p-6 relative animate-zoomIn border border-gray-200"
      >
        <h2 class="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
          Update Request Status
        </h2>

        <div class="space-y-4">
          <p class="text-sm text-gray-600">
            <span class="font-semibold">Request for:</span>
            {{ selectedRequest.fullname }}
          </p>

          <label class="block text-sm font-semibold text-gray-700 mb-1">Select New Status</label>
          <select
            v-model="selectedRequest.status"
            class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition shadow-sm"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="For pickup">For pickup</option>
            <option value="Released">Released</option>
          </select>
        </div>

        <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            class="px-5 py-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 text-sm font-medium transition transform active:scale-95"
            @click="closeModal"
          >
            Cancel
          </button>
          <button
            class="px-5 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 text-sm font-bold transition shadow-lg shadow-orange-400/50 transform active:scale-95"
            @click="saveUpdate"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const requests = ref([]);
const showModal = ref(false);
const selectedRequest = ref({});
const searchQuery = ref("");
const token = localStorage.getItem("token");

// Pagination setup
const currentPage = ref(1);
const itemsPerPage = 6;

// Computed: Filtered and Paginated
const filteredRequests = computed(() => {
  return requests.value.filter((r) =>
    [r.fullname, r.type].some((field) =>
      field?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
});

const totalPages = computed(() =>
  Math.ceil(filteredRequests.value.length / itemsPerPage)
);

const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredRequests.value.slice(start, start + itemsPerPage);
});

const startItem = computed(() => (currentPage.value - 1) * itemsPerPage + 1);
const endItem = computed(() =>
  Math.min(currentPage.value * itemsPerPage, filteredRequests.value.length)
);

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

// Modal functions
const openModal = (req) => {
  selectedRequest.value = JSON.parse(JSON.stringify(req));
  showModal.value = true;
};
const closeModal = () => (showModal.value = false);

// Date formatting
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

// Fetch clearance requests
const fetchRequests = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/clearances/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    requests.value = res.data.data || res.data || [];
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "Failed to fetch requests", "error");
  }
};

// Update status
const saveUpdate = async () => {
  try {
    await axios.patch(
      `http://localhost:5000/api/clearances/status/${selectedRequest.value.id}`,
      { status: selectedRequest.value.status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "Request status has been updated",
      timer: 1500,
      showConfirmButton: false,
    });

    showModal.value = false;

    const index = requests.value.findIndex(
      (r) => r.id === selectedRequest.value.id
    );
    if (index !== -1) {
      requests.value[index].status = selectedRequest.value.status;
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "Failed to update status", "error");
  }
};

onMounted(fetchRequests);
</script>

<style scoped>
.animate-zoomIn {
  animation: zoomIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
