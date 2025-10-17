<template>
  <div class="min-h-screen bg-gray-100 p-6 font-[Poppins] flex justify-center">
    <div class="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

      <!-- Profile Info -->
      <form @submit.prevent="updateProfile" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input v-model="profile.first_name" placeholder="First Name" class="input" required />
          <input v-model="profile.middle_name" placeholder="Middle Name" class="input" />
          <input v-model="profile.last_name" placeholder="Last Name" class="input" required />
          <input v-model="profile.age" type="number" placeholder="Age" class="input" />
          
          <!-- Gender -->
          <select v-model="profile.gender" class="input">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <!-- Civil Status -->
          <select v-model="profile.civil_status" class="input">
            <option value="">Select Civil Status</option>
            <option>Single</option>
            <option>Married</option>
            <option>Widowed</option>
            <option>Separated</option>
            <option>Divorced</option>
          </select>

          <!-- Purok -->
          <input v-model="profile.purok" type="text" placeholder="Purok" class="input" />

          <!-- Address -->
          <input v-model="profile.address" type="text" placeholder="Address" class="input" />

          <input v-model="profile.email" type="email" placeholder="Email" class="input" />

          <!-- Valid ID Upload -->
          <div class="col-span-1 md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Valid ID</label>
            <input type="file" @change="previewImage" class="input" accept="image/*" />
            <div v-if="preview" class="mt-2">
              <img
                :src="preview"
                alt="Valid ID Preview"
                class="w-32 h-auto cursor-pointer rounded-lg border"
                @click="openModal(preview)"
              />
            </div>
          </div>
        </div>

        <button type="submit" class="btn-primary">Update Profile</button>
      </form>

      <hr class="my-6" />

      <!-- Change Password -->
      <form @submit.prevent="updatePassword" class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-700">Change Password</h2>
        <input v-model="passwords.current_password" type="password" placeholder="Current Password" class="input" required />
        <input v-model="passwords.new_password" type="password" placeholder="New Password" class="input" required />
        <button type="submit" class="btn-primary">Change Password</button>
      </form>
    </div>

    <!-- Modal for full image -->
    <div
      v-if="modalImage"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      @click="modalImage = null"
    >
      <img :src="modalImage" alt="Valid ID Full" class="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-lg" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const profile = ref({
  first_name: "",
  middle_name: "",
  last_name: "",
  age: "",
  gender: "",
  civil_status: "",
  purok: "",
  address: "",
  email: "",
  valid_id: null,
});

const passwords = ref({
  current_password: "",
  new_password: "",
});

const preview = ref(null);
const modalImage = ref(null);
const token = localStorage.getItem("token");

// Load profile on mount
onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    profile.value = res.data;
    if (profile.value.valid_id) {
      preview.value = `http://localhost:5000/uploads/${profile.value.valid_id}`;
    }
  } catch (err) {
    Swal.fire("Error", err.response?.data?.message || "Failed to load profile", "error");
  }
});

// Preview valid ID image
const previewImage = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  profile.value.valid_id = file;
  preview.value = URL.createObjectURL(file);
};

// Open modal to view full image
const openModal = (img) => {
  modalImage.value = img;
};

// Update profile
const updateProfile = async () => {
  try {
    const formData = new FormData();
    for (const key in profile.value) {
      formData.append(key, profile.value[key]);
    }

    await axios.put("http://localhost:5000/api/users/profile", formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    Swal.fire("Success", "Profile updated successfully", "success");
  } catch (err) {
    Swal.fire("Error", err.response?.data?.message || "Failed to update profile", "error");
  }
};

// Change password
const updatePassword = async () => {
  try {
    await axios.put("http://localhost:5000/api/users/change-password", passwords.value, {
      headers: { Authorization: `Bearer ${token}` },
    });
    Swal.fire("Success", "Password changed successfully", "success");
    passwords.value.current_password = "";
    passwords.value.new_password = "";
  } catch (err) {
    Swal.fire("Error", err.response?.data?.message || "Failed to change password", "error");
  }
};
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  outline: none;
  transition: all 0.2s;
}
.input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.2);
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background-color: #4f46e5;
  color: white;
  font-weight: 600;
  border-radius: 0.75rem;
  transition: all 0.2s;
}
.btn-primary:hover {
  background-color: #4338ca;
}
</style>
