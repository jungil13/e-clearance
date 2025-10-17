<template>
  <div class="space-y-6 p-6 min-h-screen">
    <!-- Header and Search -->
    <div class="flex flex-col gap-4 sm:flex-row justify-between items-center pb-2 border-b border-gray-200">
      <h2 class="text-3xl font-extrabold text-gray-800 tracking-tight">
        Barangay Officials ({{ totalItems }})
      </h2>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <div class="relative flex-grow sm:w-64">
          <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or position..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @input="currentPage = 1; fetchOfficials()"
          />
        </div>
        <button
          @click="openAdd"
          class="flex-shrink-0 flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md transition duration-150"
        >
          <UserPlusIcon class="w-5 h-5" /> Add Official
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
      <table class="min-w-full text-sm text-left divide-y divide-gray-200">
        <thead class="bg-gray-50 text-gray-700">
          <tr>
            <th class="px-4 py-3 font-semibold uppercase tracking-wider">No.</th>
            <th class="px-4 py-3 font-semibold uppercase tracking-wider">Full Name</th>
            <th class="px-4 py-3 font-semibold uppercase tracking-wider">Chairmanship</th>
            <th class="px-4 py-3 font-semibold uppercase tracking-wider">Position</th>
            <th class="px-4 py-3 font-semibold uppercase tracking-wider">Status</th>
            <th class="px-4 py-3 text-center font-semibold uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(o, idx) in officials" :key="o.id" class="hover:bg-blue-50 transition duration-100">
            <td class="px-4 py-3 text-gray-500">{{ (currentPage-1)*itemsPerPage + idx + 1 }}</td>
            <td class="px-4 py-3 font-medium text-gray-800">{{ o.fullname }}</td>
            <td class="px-4 py-3 text-gray-600">{{ o.chairmanship }}</td>
            <td class="px-4 py-3 text-gray-600">{{ o.position }}</td>
            <td class="px-4 py-3">
              <span :class="o.status==='Active'? 'bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold':'bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold'">
                {{ o.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <div class="flex justify-center gap-2">
                <button @click="editOfficial(o)" class="p-2 rounded-full text-blue-600 hover:bg-blue-100">
                  <PencilSquareIcon class="w-5 h-5" />
                </button>
                <button @click="deleteOfficial(o.id, o.fullname)" class="p-2 rounded-full text-red-600 hover:bg-red-100">
                  <TrashIcon class="w-5 h-5" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!officials.length">
            <td colspan="6" class="py-6 text-center text-gray-500">No officials found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-md border border-gray-100">
      <div class="text-sm text-gray-600 mb-4 sm:mb-0">
        Showing <span class="font-semibold">{{ (currentPage-1)*itemsPerPage+1 }}</span>
        to <span class="font-semibold">{{ Math.min(currentPage*itemsPerPage, totalItems) }}</span>
        of <span class="font-semibold">{{ totalItems }}</span> results
      </div>

      <div class="flex items-center gap-2">
        <button @click="goToPage(currentPage-1)" :disabled="currentPage===1" class="p-2 border rounded-full hover:bg-gray-100 disabled:opacity-50">
          <ChevronLeftIcon class="w-5 h-5 text-gray-600"/>
        </button>
        <div class="flex gap-1">
          <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
            :class="page===currentPage?'bg-blue-600 text-white shadow-blue-400/50 w-8 h-8 rounded-full':'text-gray-700 hover:bg-gray-200 w-8 h-8 rounded-full'">
            {{ page }}
          </button>
        </div>
        <button @click="goToPage(currentPage+1)" :disabled="currentPage===totalPages" class="p-2 border rounded-full hover:bg-gray-100 disabled:opacity-50">
          <ChevronRightIcon class="w-5 h-5 text-gray-600"/>
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <h3 class="text-xl font-bold mb-5 border-b pb-2">{{ isEdit?'Edit Official':'Add New Official' }}</h3>
        <form @submit.prevent="saveOfficial" class="space-y-4">
          <div><label>Full Name</label><input v-model="form.fullname" type="text" required class="w-full border rounded-xl px-4 py-2"/></div>
          <div><label>Chairmanship</label><input v-model="form.chairmanship" type="text" required class="w-full border rounded-xl px-4 py-2"/></div>
          <div><label>Position</label><input v-model="form.position" type="text" required class="w-full border rounded-xl px-4 py-2"/></div>
          <div><label>Status</label>
            <select v-model="form.status" class="w-full border rounded-xl px-4 py-2">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <div class="flex justify-end gap-3 pt-4 border-t">
            <button type="button" @click="closeModal" class="px-5 py-2 text-gray-600 rounded-xl hover:bg-gray-100">Cancel</button>
            <button type="submit" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md">
              {{ isEdit?'Update':'Save' }} Official
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { PencilSquareIcon, TrashIcon, UserPlusIcon, MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const totalPages = ref(1);
const officials = ref([]);

const showModal = ref(false);
const isEdit = ref(false);
const form = ref({ fullname:'', chairmanship:'', position:'', status:'Active' });
let editId = null;

const fetchOfficials = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/officials`, {
      params: { search: searchQuery.value, limit: itemsPerPage.value, page: currentPage.value }
    });
    officials.value = res.data.data;
    totalItems.value = res.data.total;
    totalPages.value = Math.ceil(totalItems.value / itemsPerPage.value);
  } catch (err) {
    console.error(err);
    officials.value = [];
    totalItems.value = 0;
    totalPages.value = 1;
  }
};

onMounted(fetchOfficials);

const openAdd = () => {
  isEdit.value = false;
  form.value = { fullname:'', chairmanship:'', position:'', status:'Active' };
  showModal.value = true;
};

const editOfficial = (o) => {
  isEdit.value = true;
  editId = o.id;
  form.value = { ...o };
  showModal.value = true;
};

const saveOfficial = async () => {
  try {
    if (isEdit.value) {
      await axios.put(`http://localhost:5000/api/officials/${editId}`, form.value);
    } else {
      await axios.post(`http://localhost:5000/api/officials`, form.value);
    }
    fetchOfficials();
    closeModal();
  } catch (err) {
    console.error(err);
    alert('Failed to save official');
  }
};

const deleteOfficial = async (id, name) => {
  if (!confirm(`Remove ${name}?`)) return;
  try {
    await axios.delete(`http://localhost:5000/api/officials/${id}`);
    fetchOfficials();
  } catch (err) {
    console.error(err);
    alert('Failed to delete official');
  }
};

const closeModal = () => { showModal.value = false; };

const goToPage = (page) => {
  if (page >=1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchOfficials();
  }
};
</script>

<style scoped>
.backdrop-blur-sm { backdrop-filter: blur(4px); }
</style>
