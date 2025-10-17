<template>
  <!-- Main container for the Sanitary Permit -->
  <div id="print-area" class="bg-white mx-auto max-w-4xl p-12 lg:p-16 font-serif text-gray-900 relative min-h-[297mm] shadow-lg">
    
    <!-- Watermark - Reusing the same style -->
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
      <h2 class="font-bold text-xl uppercase underline decoration-gray-400 tracking-wide pt-1 text-red-700">Barangay Sanitary Permit</h2>
    </div>

    <!-- Permit Body: Main Content Card/Box -->
    <div class="relative z-10 border-2 border-gray-900 p-8 pt-6 mx-auto mt-12 bg-gray-50/50">
        <div class="text-center mb-6">
            <p class="text-2xl font-extrabold uppercase tracking-widest text-red-700">CERTIFICATE OF SANITARY PERMIT</p>
            <p class="text-sm font-medium text-gray-700 mt-1">ISSUED FOR COMPLIANCE WITH BARANGAY ORDINANCE NO. 2025-01</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-base leading-relaxed">
            <div class="space-y-4">
                <p>
                    <span class="font-bold text-gray-600 block text-xs uppercase">Permit No:</span>
                    <span class="font-extrabold text-lg text-gray-900">{{ sanitaryData.permitNo }}</span>
                </p>
                <p>
                    <span class="font-bold text-gray-600 block text-xs uppercase">Name of Establishment:</span>
                    <span class="font-bold underline text-red-600">{{ sanitaryData.registeredName }}</span>
                </p>
                <p>
                    <span class="font-bold text-gray-600 block text-xs uppercase">Type of Business:</span>
                    <span class="font-bold">{{ sanitaryData.type }}</span>
                </p>
            </div>

            <div class="space-y-4">
                <p>
                    <span class="font-bold text-gray-600 block text-xs uppercase">Business Address:</span>
                    <span class="font-medium">{{ sanitaryData.address }}</span>
                </p>
                <p>
                    <span class="font-bold text-gray-600 block text-xs uppercase">Date Issued:</span>
                    <span class="font-medium">{{ sanitaryData.dateIssued }}</span>
                </p>
                <p>
                    <span class="font-bold text-gray-600 block text-xs uppercase">Expiration Date:</span>
                    <span class="font-bold text-red-700">{{ sanitaryData.expirationDate }}</span>
                </p>
            </div>
        </div>
        
        <p class="mt-8 text-center text-sm italic border-t pt-4">
            This permit certifies that the aforementioned establishment has complied with the minimum sanitary requirements and health standards of the Barangay. This permit must be visibly displayed at all times.
        </p>
    </div>


    <!-- Footer - Aligned right for signature -->
    <div class="relative z-10 mt-24 flex justify-end">
      <div class="text-center w-72">
        <p class="font-semibold mb-2 text-gray-700">Issued and Approved By:</p>
        <p class="font-bold text-lg underline text-gray-900 pt-2 border-t border-gray-400">HON. ANNA JUMAO-AS</p>
        <p class="text-sm">Barangay Captain</p>
      </div>
    </div>

    <!-- Control Number/Note -->
    <div class="relative z-10 mt-16 text-left text-xs text-gray-500">
      <p>NOTE: This is not valid without the Official Barangay Dry Seal.</p>
    </div>
  </div>

  <!-- Buttons - Hidden in print mode using the 'print:hidden' class -->
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
      Print Permit
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// --- Data Calculations ---
const currentYear = new Date().getFullYear()

// Get today's date for issuing
const issuedDateObj = new Date()
const issuedDate = issuedDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

// Calculate expiration date (e.g., one year from now)
const expiryDateObj = new Date()
expiryDateObj.setFullYear(currentYear + 1)
const expiryDate = expiryDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

// --- Data Parsing ---
let parsed = null
try {
  parsed = route.query.data ? JSON.parse(route.query.data) : null
} catch (e) {
  console.error("Error parsing route query data:", e)
}

// Default dummy data if not available
const resident = parsed
  ? {
      fullname: parsed.fullname || 'MARIA LABO',
      purok: parsed.purok || 'SILANGAN',
      purpose: parsed.purpose || 'RETAIL/SERVICE INDUSTRY',
    }
  : { fullname: 'MARIA LABO', purok: 'SILANGAN', purpose: 'FOOD ESTABLISHMENT' }

// --- Sanitary Permit Data (using requested logic) ---
const sanitaryData = {
  // Use dash instead of space for enterprises name
  registeredName: resident.fullname.toUpperCase().replace(/\s+/g, '-') + ' ENTERPRISES',
  // Removed logic for type, so use purpose directly for the type of business
  type: resident.purpose.toUpperCase(),
  // Use requested address format
  address: `PUROK ${resident.purok.toUpperCase()}, BARANGAY BANG-BANG, CORDOVA CEBU`,
  // Generate a random permit number with the current year
  permitNo: Math.floor(Math.random() * 90000 + 10000) + '-' + currentYear,
  dateIssued: issuedDate,
  expirationDate: expiryDate,
}

// --- Navigation and Printing ---
const goBack = () => router.push('/admin/permits/sanitary')

// Robust print function to isolate the print area
const printPage = () => {
  const printContents = document.getElementById('print-area').innerHTML
  const originalContents = document.body.innerHTML
  document.body.innerHTML = printContents
  window.print()
  document.body.innerHTML = originalContents
  location.reload()
}
</script>

<style scoped>
/* Screen styles for better document representation */
#print-area {
  min-height: 297mm;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

@media print {
  /* General print resets */
  body {
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    font-size: 11pt; 
  }

  /* Hide elements with print:hidden class (buttons) */
  .print\:hidden {
    display: none !important;
  }

  /* Target the main print area */
  #print-area {
    /* Critical: Set padding to 1 inch to enforce physical print margins */
    display: block !important;
    margin: 0 auto !important;
    width: 100% !important; 
    padding: 1in !important; 
    background: white !important;
    box-shadow: none !important;
    border: none !important;
    min-height: auto; 
    
    /* Ensure colors/images print */
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Ensure images (watermark and logo) print correctly */
  img {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  /* Set the paper size and remove default printer margins */
  @page {
    size: A4 portrait;
    margin: 0 !important; 
  }
}
</style>
