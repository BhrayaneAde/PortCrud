<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Modal d'édition -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
        <h2 class="text-xl font-bold mb-4">Modifier les informations du port</h2>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium">Étage / Îlot</label>
            <input v-model="editPortData.etage_ilot" class="border rounded px-2 py-1 w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium">Prise</label>
            <input v-model="editPortData.prise" class="border rounded px-2 py-1 w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium">Port</label>
            <input v-model="editPortData.port" class="border rounded px-2 py-1 w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium">Switch</label>
            <input v-model="editPortData.switch" class="border rounded px-2 py-1 w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium">VLAN</label>
            <input v-model="editPortData.vlan" class="border rounded px-2 py-1 w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium">Site</label>
            <input v-model="editPortData.site" class="border rounded px-2 py-1 w-full" />
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-4">
          <button @click="cancelEdit" class="bg-gray-400 text-white px-4 py-2 rounded">
            Annuler
          </button>
          <button
            @click="saveEdit(editPortData.id)"
            class="bg-green-500 text-white px-4 py-2 rounded"
          >
            Enregistrer
          </button>
        </div>

        <button
          @click="cancelEdit"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
          aria-label="Close modal"
        >
          ×
        </button>
      </div>
    </div>

    <div class="mb-6 flex items-center gap-4 flex-wrap">
      <label for="site-filter" class="font-medium text-gray-700">Filtrer par site :</label>
      <select
        id="site-filter"
        v-model="filterSite"
        class="rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
      >
        <option value="">Tous les sites</option>
        <option>Cotonou</option>
        <option>Lomé</option>
        <option>Rwanda</option>
        <option>Yaoundé</option>
      </select>

      <button
        @click="exportToPDF"
        class="ml-4 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2"
      >
        <span>📄</span>
        <span>Exporter en PDF</span>
      </button>

      <label for="sort-by" class="font-medium text-gray-700 ml-8">Trier par :</label>
      <select
        id="sort-by"
        v-model="sortBy"
        class="rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
      >
        <option value="port">Port</option>
        <option value="etage_ilot">Étage / Îlot</option>
      </select>
      <button
        @click="sortAsc = !sortAsc"
        class="ml-2 px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        :title="sortAsc ? 'Tri croissant' : 'Tri décroissant'"
        aria-label="Toggle sort order"
      >
        <span v-if="sortAsc">▲</span>
        <span v-else>▼</span>
      </button>
    </div>

    <div class="overflow-x-auto rounded-lg shadow">
      <table class="min-w-full bg-white">
        <thead>
          <tr class="bg-blue-600 text-white">
            <th class="py-3 px-4 text-left font-semibold">Étage / Îlot</th>
            <th class="py-3 px-4 text-left font-semibold">Prise</th>
            <th class="py-3 px-4 text-left font-semibold">Port</th>
            <th class="py-3 px-4 text-left font-semibold">Switch</th>
            <th class="py-3 px-4 text-left font-semibold">VLAN</th>
            <th class="py-3 px-4 text-left font-semibold">Site</th>
            <th class="py-3 px-4 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in sortedPorts" :key="p.id" class="border-b hover:bg-blue-50 transition">
            <template v-if="editId === p.id">
              <td class="py-2 px-4">
                <input v-model="editPortData.etage_ilot" class="border rounded px-2 py-1 w-full" />
              </td>
              <td class="py-2 px-4">
                <input v-model="editPortData.prise" class="border rounded px-2 py-1 w-full" />
              </td>
              <td class="py-2 px-4">
                <input v-model="editPortData.port" class="border rounded px-2 py-1 w-full" />
              </td>
              <td class="py-2 px-4">
                <input v-model="editPortData.switch" class="border rounded px-2 py-1 w-full" />
              </td>
              <td class="py-2 px-4">
                <input v-model="editPortData.vlan" class="border rounded px-2 py-1 w-full" />
              </td>
              <td class="py-2 px-4">
                <input v-model="editPortData.site" class="border rounded px-2 py-1 w-full" />
              </td>
              <td class="py-2 px-4 flex gap-2">
                <button @click="saveEdit(p.id)" class="px-2 py-1 bg-green-500 text-white rounded">
                  Enregistrer
                </button>
                <button @click="cancelEdit" class="px-2 py-1 bg-gray-400 text-white rounded">
                  Annuler
                </button>
              </td>
            </template>
            <template v-else>
              <td class="py-2 px-4">{{ p.etage_ilot }}</td>
              <td class="py-2 px-4">{{ p.prise }}</td>
              <td class="py-2 px-4">{{ p.port }}</td>
              <td class="py-2 px-4">{{ p.switch }}</td>
              <td class="py-2 px-4">{{ p.vlan }}</td>
              <td class="py-2 px-4">{{ p.site }}</td>
              <td class="py-2 px-4 flex gap-2">
                <button @click="startEdit(p)" class="px-2 py-1 bg-yellow-400 text-white rounded">
                  Modifier
                </button>

                <button @click="deletePort(p.id)" class="px-2 py-1 bg-red-500 text-white rounded">
                  Supprimer
                </button>
              </td>
            </template>
          </tr>
          <tr v-if="sortedPorts.length === 0">
            <td colspan="7" class="py-6 text-center text-gray-400">Aucune donnée disponible.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Swal from 'sweetalert2'

const ports = ref([])
const filterSite = ref('')
const sortBy = ref('port')
const sortAsc = ref(true)

const editId = ref(null)
const editPortData = ref({})
const showEditModal = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('ports')
  ports.value = saved ? JSON.parse(saved) : []
})

// Filtrage
const filteredPorts = computed(() => {
  return filterSite.value ? ports.value.filter((p) => p.site === filterSite.value) : ports.value
})

// Tri
const sortedPorts = computed(() => {
  const arr = [...filteredPorts.value]
  arr.sort((a, b) => {
    let valA = a[sortBy.value]
    let valB = b[sortBy.value]
    // Convertir en nombre si possible pour un tri correct
    if (!isNaN(valA) && !isNaN(valB)) {
      valA = Number(valA)
      valB = Number(valB)
    }
    if (valA < valB) return sortAsc.value ? -1 : 1
    if (valA > valB) return sortAsc.value ? 1 : -1
    return 0
  })
  return arr
})

// Export PDF
function exportToPDF() {
  const doc = new jsPDF()
  doc.text('Liste des Ports Réseaux', 14, 15)
  autoTable(doc, {
    head: [['Étage / Îlot', 'Prise', 'Port', 'Switch', 'VLAN', 'Site']],
    body: filteredPorts.value.map((p) => [p.etage_ilot, p.prise, p.port, p.switch, p.vlan, p.site]),
    startY: 20,
  })
  doc.save('ports_reseaux.pdf')
}

// Démarrer édition
function startEdit(port) {
  editId.value = port.id
  editPortData.value = { ...port } // copie profonde
  showEditModal.value = false // On affiche directement dans le tableau
}

// Annuler édition
function cancelEdit() {
  editId.value = null
  editPortData.value = {}
  showEditModal.value = false
}

// Enregistrer édition
function saveEdit(id) {
  if (!editPortData.value.etage_ilot || !editPortData.value.prise || !editPortData.value.port) {
    Swal.fire(
      'Erreur',
      'Veuillez remplir les champs obligatoires (Étage/Îlot, Prise, Port).',
      'error',
    )
    return
  }

  const index = ports.value.findIndex((p) => p.id === id)
  if (index !== -1) {
    ports.value[index] = { ...editPortData.value }
    localStorage.setItem('ports', JSON.stringify(ports.value))
    Swal.fire('Succès', 'Port modifié avec succès.', 'success')
    cancelEdit()
  } else {
    Swal.fire('Erreur', 'Port introuvable.', 'error')
  }
}

// Supprimer port
function deletePort(id) {
  Swal.fire({
    title: 'Confirmer la suppression',
    text: 'Voulez-vous vraiment supprimer ce port ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
  }).then((result) => {
    if (result.isConfirmed) {
      ports.value = ports.value.filter((p) => p.id !== id)
      localStorage.setItem('ports', JSON.stringify(ports.value))
      Swal.fire('Supprimé', 'Le port a été supprimé.', 'success')
    }
  })
}
</script>

<style scoped>
/* Optionnel : styles complémentaires */
</style>
