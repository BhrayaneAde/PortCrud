<template>
  <form
    @submit.prevent="savePort"
    class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md space-y-5"
  >
    <input
      v-model="port.etage_ilot"
      placeholder="Étage / Îlot"
      required
      class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <input
      v-model="port.prise"
      placeholder="Prise"
      required
      class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <input
      v-model="port.port"
      placeholder="Port associé"
      required
      class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <input
      v-model="port.switch"
      placeholder="Switch"
      required
      class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <input
      v-model="port.vlan"
      placeholder="VLAN"
      required
      class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <select
      v-model="port.site"
      required
      class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
    >
      <option disabled value="">Choisir un site</option>
      <option>Cotonou</option>
      <option>Lomé</option>
      <option>Rwanda</option>
      <option>Yaoundé</option>
    </select>
    <button
      type="submit"
      class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
    >
      Enregistrer
    </button>
  </form>
</template>

<script setup>
import { reactive } from 'vue'
import Swal from 'sweetalert2'

const initialPort = () => ({
  etage_ilot: '',
  prise: '',
  port: '',
  switch: '',
  vlan: '',
  site: '',
})

const port = reactive(initialPort())

function resetForm() {
  Object.assign(port, initialPort())
}

function savePort() {
  const ports = JSON.parse(localStorage.getItem('ports') || '[]')
  const priseExists = ports.some((p) => p.prise === port.prise)
  if (priseExists) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Le numéro de la prise est déjà enregistré.',
    })
    return
  }
  ports.push({ ...port, id: Date.now() })
  localStorage.setItem('ports', JSON.stringify(ports))
  Swal.fire({
    icon: 'success',
    title: 'Succès',
    text: 'Port enregistré avec succès.',
  }).then(() => {
    resetForm()
  })
}
</script>
