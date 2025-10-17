<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4 print:bg-white relative">
    <div
      ref="certificate"
      class="certificate-container w-full max-w-3xl bg-white shadow-lg border-2 border-gray-300 p-8 print:p-4 print:shadow-none relative"
      style="height: 12in; padding-top: 1in;"
    >
      <!-- Watermark -->
      <img
        src="@/assets/cordova.png"
        alt="Watermark"
        class="absolute top-1/2 left-1/2 w-72 h-72 opacity-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none print:opacity-10"
      />

      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <img src="@/assets/cordova.png" alt="Municipal Seal" class="w-28 h-28 object-contain" />
        <div class="text-center">
          <p class="text-sm font-semibold">REPUBLIC OF THE PHILIPPINES</p>
          <p class="text-sm font-semibold">MUNICIPALITY OF CORDOVA</p>
          <p class="text-sm font-semibold">BARANGAY BANG-BANG</p>
          <p class="text-xl font-bold mt-2 uppercase tracking-wider">BUSINESS PERMIT</p>

          <!-- Editable Certificate Number -->
          <div class="mt-1">
            <p v-if="!editingCertNo" @click="editingCertNo = true" class="text-sm cursor-pointer">
              Certificate No:
              <span class="font-semibold underline">{{ certNo }}</span>
            </p>
            <div v-else class="flex items-center justify-center gap-2">
              <label class="text-sm">Certificate No:</label>
              <input
                v-model="certNo"
                @blur="editingCertNo = false"
                class="border-b-2 border-gray-400 w-28 text-center font-semibold focus:outline-none"
              />
            </div>
          </div>
        </div>
        <img src="@/assets/bang.png" alt="Barangay Seal" class="w-28 h-28 object-contain" />
      </div>

      <hr class="border-gray-700 mb-8" />

      <!-- Body -->
      <div class="text-gray-800 text-base leading-relaxed space-y-4 text-justify">
        <p>
          This is to certify that <span class="font-bold uppercase">{{ biz.owner }}</span>, duly
          recognized business owner, is the proprietor of
          <span class="font-bold uppercase">{{ biz.name }}</span>,
          engaged in <span class="font-bold">{{ biz.nature }}</span>, and is hereby registered with
          Barangay Bang-Bang, Municipality of Cordova, Province of Cebu, in accordance with local
          regulations and laws governing business operations.
        </p>

        <p>
          This business has fulfilled all requirements for operation including the submission of
          proper documentation and compliance with Barangay ordinances. As such, it is officially
          permitted to conduct business activities within the territorial jurisdiction of Barangay
          Bang-Bang.
        </p>

        <p>
          This certificate is issued for the purpose of presenting as proof of business registration
          and may be used in transactions requiring official business clearance. Any misrepresentation
          or falsification of information shall render this certificate void.
        </p>

        <p class="mt-4">
          Issued this <span class="font-bold">{{ formattedDate }}</span> at Barangay Bang-Bang,
          Cordova, Cebu.
        </p>
      </div>

      <!-- Footer / Signatures -->
      <div class="flex justify-between mt-16">
        <!-- Barangay Captain (editable) -->
        <div class="text-center">
          <p
            v-if="!editingCaptain"
            @click="editingCaptain = true"
            class="font-bold underline cursor-pointer hover:text-blue-600"
          >
            HON. {{ captainName }}
          </p>
          <input
            v-else
            v-model="captainName"
            @blur="editingCaptain = false"
            class="border-b-2 border-gray-400 text-center font-semibold focus:outline-none w-56"
          />
          <p class="text-sm mt-1">Barangay Captain</p>
        </div>

        <!-- Municipal Mayor (static) -->
        <div class="text-center">
          <p class="font-bold underline">HON. DIDOY SUAN</p>
          <p class="text-sm mt-1">Municipal Mayor</p>
        </div>
      </div>

      <!-- Buttons -->
      <div class="mt-8 flex justify-center print:hidden gap-4">
        <button
          @click="goBack"
          class="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-md shadow-md"
        >
          Back
        </button>
        <button
          @click="printCertificate"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md"
        >
          Print
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const certificate = ref(null);

// Business data from query
const biz = JSON.parse(route.query.data || "{}");

// Editable captain name
const captainName = ref("ANNA JUMAO-AS");
const editingCaptain = ref(false);

// Editable certificate number
const certNo = ref(`BB-${Math.floor(100000 + Math.random() * 900000)}`); // random 6-digit number
const editingCertNo = ref(false);

// Date
const formattedDate = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

// Print function
const printCertificate = () => {
  const printContents = certificate.value.innerHTML;
  const originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
  window.location.reload();
};

const goBack = () => {
  router.push("/admin/permits/business");
};
</script>

<style scoped>
@media print {
  button {
    display: none !important;
  }

  @page {
    size: 8.5in 13in;
    margin: 0.5in;
  }

  .certificate-container {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
