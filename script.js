const pokeContainer = document.querySelector(".poke-container")
const loadMoreButton = document.querySelector(".load-more") // Select the button from the HTML

const pokemonCount = 1025 // Total number of Pokémon available
const batchSize = 100 // Number of Pokémon to load per batch
let currentCount = 0 // Tracks how many Pokémon have been loaded

const colors = {
  fire: "orange",
  grass: "lightgreen",
  electric: "yellow",
  water: "#70ffea",
  ground: "darkgrey",
  rock: "grey",
  fairy: "pink",
  poison: "greenyellow",
  bug: "#94ecbe",
  dragon: "orange",
  psychic: "#7c7db6",
  flying: "#fcca46",
  fighting: "darkgrey",
  normal: "lightgrey",
  ice: "#00f2f2",
  dark: "#4f7ecf",
  ghost: "#7685a7",
  steel: "steelblue",
}

const mainTypes = Object.keys(colors)

// Fetch a batch of Pokémon data
const fetchPokemonBatch = async () => {
  // Disable the "Load More" button while loading
  loadMoreButton.disabled = true
  loadMoreButton.textContent = "Loading..."

  const start = currentCount + 1
  const end = Math.min(currentCount + batchSize, pokemonCount)

  for (let i = start; i <= end; i++) {
    try {
      const pokemon = await getPokemon(i)
      const pokemonEl = createPokemonCard(pokemon)
      pokeContainer.appendChild(pokemonEl) // Append each card as it is created
    } catch (err) {
      console.error(`Failed to fetch Pokémon with ID ${i}:`, err)
    }
  }

  currentCount = end

  // Re-enable the "Load More" button if there are more Pokémon to load
  if (currentCount < pokemonCount) {
    loadMoreButton.disabled = false
    loadMoreButton.textContent = "Load More"
  } else {
    // Disable the button permanently if all Pokémon are loaded
    loadMoreButton.disabled = true
    loadMoreButton.textContent = "No More Pokémon"
  }
}

// Fetch a single Pokémon by ID
const getPokemon = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`
  const response = await axios.get(url)
  return response.data
}

// Create a Pokémon card
const createPokemonCard = (pokemon) => {
  const pokemonEl = document.createElement("div")
  pokemonEl.classList.add("pokemon")

  const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1)
  const id = pokemon.id.toString().padStart(3, "0")
  const pokeTypes = pokemon.types.map((typeKind) => typeKind.type.name)

  // Use different URLs based on the Pokémon ID
  const image =
    pokemon.id >= 650
      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
      : pokemon.sprites.other.dream_world.front_default ||
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`

  const fallbackImage =
    "https://www.pngmart.com/files/22/Unown-Pokemon-PNG-Isolated-HD-Pictures.png"

  const type = mainTypes.find((type) => pokeTypes.includes(type))
  const color = colors[type]

  pokemonEl.innerHTML = `
        <span class="number">#${id}</span>
        <span class="type-icon"></span>
        
        <div class="img-container">   
            <img loading="lazy" src="${image}" alt="${name}" onerror="this.src='${fallbackImage}'">    
        </div>
        <div class="info">
            <h3 class="name">${name}</h3>
            <div class="extra-info">
                <div><small>Weight</small><h5 class="weight">${
                  pokemon.weight / 10
                } kg</h5></div>
                <div><small>Height</small><h5 class="height">${
                  pokemon.height / 10
                } m</h5></div>
            </div>
            <div class="type-data"><small>Type:</small><h5 class="type">${getPokemonType(
              pokeTypes
            )}</h5></div>
        </div>
    `

  const typeColor = pokemonEl.querySelector(".type-icon")
  pokemonEl.style.border = `2px solid ${color}`
  typeColor.style.backgroundColor = color
  typeColor.setAttribute("title", type)
  typeColor.style.boxShadow = `0 0 6px ${color}`

  return pokemonEl
}

// Get Pokémon type(s)
function getPokemonType(pokeTypes) {
  return pokeTypes
    .map((type) => type[0].toUpperCase() + type.slice(1))
    .join(" / ")
}

// Initial load of Pokémon
fetchPokemonBatch()

// Add event listener to the "Load More" button
loadMoreButton.addEventListener("click", fetchPokemonBatch)

console.log(
  "All the cards were generated dynamically with the data from pokeapi.com!"
)
