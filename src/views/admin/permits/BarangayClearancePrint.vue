<template>
  <div id="print-area" class="bg-white mx-auto max-w-4xl p-12 lg:p-16 font-serif text-gray-900 relative min-h-[297mm] shadow-lg">
    
    <!-- Watermark -->
    <img
      src="@/assets/bang.png"
      alt="Barangay Seal Watermark"
      class="absolute inset-0 m-auto opacity-10 w-96 h-96 object-contain pointer-events-none"
      style="z-index: 0; top: 50%; left: 50%; transform: translate(-50%, -50%);"
    />

    <!-- Header -->
    <div class="text-center relative z-10 mb-10">
      <div class="flex justify-center items-center gap-10 mb-3">
        <img src="@/assets/bang.png" alt="Logo Left" class="w-16 h-16 object-contain shrink-0" />
        <img src="@/assets/cordova.png" alt="Logo Right" class="w-16 h-16 object-contain shrink-0" />
      </div>
      <p class="text-sm font-semibold leading-tight">Republic of the Philippines</p>
      <p class="text-sm leading-tight">Municipality of Cordova</p>
      <p class="text-sm leading-tight font-bold uppercase">Province of Cebu</p>
      <h1 class="font-extrabold text-xl mt-2 tracking-wider uppercase">Barangay Bang-Bang</h1>
      <p class="text-xs font-medium text-gray-600">Mobile No. 0917-123-4567</p>
      <hr class="border-t-2 border-red-600 my-4 w-3/4 mx-auto" />
      <h2 class="font-bold text-xl uppercase underline decoration-gray-400 tracking-wide pt-1">Barangay Clearance</h2>
    </div>

    <!-- Body -->
    <div class="relative z-10 text-justify leading-loose text-base pl-16">
      <p class="font-bold mb-8">TO WHOM IT MAY CONCERN:</p>

      <p class="mb-10 indent-10">
        This is to certify that 
        <span class="font-bold underline text-red-600">{{ resident.fullname }}</span>,
        a bonafide resident of 
        <span class="font-semibold">{{ resident.purok }}, Barangay Bang-Bang, Cordova, Cebu</span>,
        is known to be of good moral character and a law-abiding citizen with no derogatory record on file in this Barangay as of this date.
      </p>

      <p class="mb-10 indent-10">
        This certification is issued upon the request of the aforementioned person for the purpose of
        <span class="font-bold uppercase text-red-600">{{ resident.purpose }}</span>, and for whatever legal purpose it may serve.
      </p>

      <p class="indent-10">
        Issued this <span class="font-semibold">{{ formalDate }}</span>, at Barangay Bang-Bang, Municipality of Cordova, Province of Cebu,
        Philippines.
      </p>
    </div>

    <!-- Footer -->
    <div class="relative z-10 mt-24 flex justify-end pr-16">
      <div class="text-center w-64">
        <p class="font-semibold mb-2 text-gray-700">Approved By:</p>
        <p class="font-bold text-lg underline text-gray-900 pt-2 border-t border-gray-400">
          {{ captainName || 'HON. JOSE RIZAL P. TEJADA' }}
        </p>
        <p class="text-sm">Barangay Captain</p>

        <!-- Editable input (hidden in print mode) -->
        <div class="mt-3 print:hidden">
          <input
            v-model="captainName"
            type="text"
            placeholder="Edit Captain Name"
            class="border border-gray-300 rounded-lg px-3 py-1 text-sm text-center focus:ring-2 focus:ring-blue-400 focus:border-blue-400 w-full"
          />
        </div>
      </div>
    </div>

    <!-- Control Number -->
    <div class="relative z-10 mt-16 text-left text-sm text-gray-700 pl-16">
      <p>Control No: <span class="font-semibold">{{ controlNo }}</span></p>
    </div>
  </div>

  <!-- Buttons -->
  <div class="flex gap-4 mt-8 print:hidden justify-center">
    <button
      @click="goBack"
      class="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium shadow-md transition"
    >
      Back
    </button>
    <button
      @click="printPage"
      class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-md transition"
    >
      Print Document
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Resident Data
let parsed = null
try {
  parsed = route.query.data ? JSON.parse(route.query.data) : null
} catch (e) {
  console.error("Error parsing route query data:", e)
}

const resident = parsed
  ? {
      fullname: parsed.fullname || 'MARIA LABO',
      purok: parsed.purok || 'Purok Sili',
      purpose: parsed.purpose || 'FOR JOB',
    }
  : { fullname: 'MARIA LABO', purok: 'Purok Sili', purpose: 'FOR JOB' }

// Editable Barangay Captain name
const captainName = ref('HON. ANNA JUMAO-AS')

const goBack = () => router.push('/admin/permits/clearance')

// Print function
const printPage = () => {
  const printContents = document.getElementById('print-area').innerHTML
  const originalContents = document.body.innerHTML
  document.body.innerHTML = printContents
  window.print()
  document.body.innerHTML = originalContents
  location.reload()
}

// Control number and date
const controlNo = Date.now()
const formalDate = computed(() => {
  const date = new Date()
  const day = date.getDate()
  const suffix = (d => (d > 3 && d < 21) ? 'th' : ['th', 'st', 'nd', 'rd'][Math.min(d % 10, 4)])(day)
  const month = date.toLocaleString('en-US', { month: 'long' })
  const year = date.getFullYear()
  return `${day}${suffix} day of ${month}, ${year}`
})
</script>

<style scoped>
#print-area {
  min-height: 297mm;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

@media print {
  body {
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    font-size: 11pt;
  }

  .print\:hidden {
    display: none !important;
  }

  #print-area {
    display: block !important;
    margin: 0 auto !important;
    width: 100% !important;
    padding: 1in !important;
    background: white !important;
    box-shadow: none !important;
    border: none !important;
    min-height: auto;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  img {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  @page {
    size: A4 portrait;
    margin: 0 !important;
  }
}
</style>
