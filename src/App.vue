<template>
  <div>
    <nav class="bg-white shadow mb-6">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <router-link
            to="/"
            class="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-200"
          >
            🏠 Accueil
          </router-link>
          <router-link
            to="/ajouter"
            class="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-200"
          >
            ➕ Ajouter un port
          </router-link>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<style>
/* No custom CSS needed, Tailwind handles styling */
</style>
