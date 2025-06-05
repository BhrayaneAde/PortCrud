const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const app = express()

app.use(cors())
app.use(express.json())

const filePath = path.join(__dirname, '../public/ports.json')

// Crée le dossier public si besoin
const dirPath = path.dirname(filePath)
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true })
}

// Crée le fichier s'il n'existe pas
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([]))
}

// Fonction utilitaire pour lire les ports depuis le fichier
function readPortsFromFile() {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]))
    }
    const data = fs.readFileSync(filePath, 'utf8')
    return data ? JSON.parse(data) : []
  } catch (err) {
    return []
  }
}

// Fonction utilitaire pour écrire les ports dans le fichier
function writePortsToFile(ports) {
  fs.writeFileSync(filePath, JSON.stringify(ports, null, 2))
}

// Route pour récupérer tous les ports
app.get('/api/ports', (req, res) => {
  const ports = readPortsFromFile()
  res.json(ports)
})

// Route pour stocker un port
app.post('/api/ports', (req, res) => {
  const { etage_ilot, prise, port, switch: sw, vlan, site } = req.body

  if (!etage_ilot || !prise || !port) {
    return res.status(400).json({ message: 'Champs manquants' })
  }

  const newPort = {
    id: Date.now(),
    etage_ilot,
    prise,
    port,
    switch: sw,
    vlan,
    site,
  }

  const ports = readPortsFromFile()
  ports.push(newPort)
  writePortsToFile(ports)

  res.status(201).json({ message: 'Port enregistré avec succès', port: newPort })
})

// Route pour modifier un port (PUT)
app.put('/api/ports/:id', (req, res) => {
  const id = Number(req.params.id)
  const ports = readPortsFromFile()
  const index = ports.findIndex((p) => p.id === id)
  if (index === -1) {
    return res.status(404).json({ message: 'Port non trouvé' })
  }

  const { etage_ilot, prise, port, switch: sw, vlan, site } = req.body

  ports[index] = {
    id,
    etage_ilot,
    prise,
    port,
    switch: sw,
    vlan,
    site,
  }

  writePortsToFile(ports)
  res.json({ message: 'Port modifié avec succès', port: ports[index] })
})

// Route pour supprimer un port (DELETE)
app.delete('/api/ports/:id', (req, res) => {
  const id = Number(req.params.id)
  const ports = readPortsFromFile()
  const index = ports.findIndex((p) => p.id === id)
  if (index === -1) {
    return res.status(404).json({ message: 'Port non trouvé' })
  }

  ports.splice(index, 1)
  writePortsToFile(ports)
  res.json({ message: 'Port supprimé avec succès' })
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`)
})
