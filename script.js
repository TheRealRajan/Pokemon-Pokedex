const pokeContainer = document.querySelector('.poke-container');
const pokemonCount = 300

const colors = {
    fire:'orange',
    grass:'lightgreen',
    electric:'yellow',
    water:'#70ffea',
    ground:'darkgrey',
    rock:'grey',
    fairy:'pink',
    poison:'greenyellow',
    bug:'#94ecbe',
    dragon:'orange',
    psychic:'#7c7db6', 
    flying:'#fcca46',
    fighting:'darkgrey',
    normal:'lightgrey',
    ice:'#00f2f2',
    dark: '#4f7ecf',
    ghost: '#7685a7',
    steel: 'steelblue',

}
//Getting the keys of the colors Object to access the color value later
const mainTypes = Object.keys(colors)
// console.log(mainTypes)

//Sending API request for each Pokemon
const fetchPokemon = async () => {
    for (let i = 1; i<= pokemonCount; i++){
       await getPokemon(i)
    }
}

// Send request to PokeApi and get Json data about each pokemon
const getPokemon = async (id) =>{
    try{
        const url = `https://pokeapi.co/api/v2/pokemon/${id}`
        const response = await axios.get(url)
        const data = response.data
        // console.log(data)
        createPokemonCard(data)
    }
    catch(err){
        console.log(err)
    }
}

//Create pokemon info card in the DOM for each pokemon
const createPokemonCard = (pokemon) =>{
     const pokemonEl = document.createElement('div')
     pokemonEl.classList.add('pokemon')

    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1)
    const id = pokemon.id.toString().padStart(3, '0')
     const pokeTypes = pokemon.types.map(typeKind =>typeKind.type.name)
    // console.log(pokeTypes)
    const type = mainTypes.find(type => pokeTypes.indexOf(type) > -1)
    const color = colors[type]

    
    // console.log(color)

     pokemonEl.innerHTML = 
     `      
            
            <span class="number">#${id}</span>
            <span class="type-icon"></span>
            
            <div class="img-container">
                <img src="https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png" alt="">    
            </div>
            <div class="info">
                
                <h3 class="name">${(name)}</h3>
                
               <div class="extra-info">
                    <div> <small> Weight</small> <h5 class="weight"> ${pokemon.weight/10} kg </h5>
                    </div>
                    <div> <small> Height</small> <h5 class="height"> ${pokemon.height/10} m</h5></div>      
                </div>
                <br>
                <div> <small> Type:</small> <h5 class="type">${getPokemonType(pokeTypes)}</h5></div>
                
     </div>

     `

     const typeColor = pokemonEl.querySelector('.type-icon')
     const imageBg = pokemonEl.querySelector('.img-container')
    //  imageBg.style.backgroundColor = color
    //  imageBg.style.boxShadow = `0 0 5px 5px ${color}`
     pokemonEl.style.border = `2px solid ${color}`
     typeColor.style.backgroundColor = color
     typeColor.setAttribute('title', type)
     typeColor.style.boxShadow = `0 0 6px ${color}`
     pokeContainer.appendChild(pokemonEl)
         
}

// Getting the type(s) for each pokemon
function getPokemonType(pokeTypes){
   if(pokeTypes.length == 1){
      const pokeType = (pokeTypes[0])[0].toUpperCase() + pokeTypes[0].slice(1)
        return pokeType
   } 
    else{ 
        pokeType1 = (pokeTypes[0])[0].toUpperCase() + pokeTypes[0].slice(1)
        pokeType2 = (pokeTypes[1])[0].toUpperCase() + pokeTypes[1].slice(1)
        return pokeType1 + ' / ' + pokeType2
    }

}


fetchPokemon()

console.log("All the cards were generated dynamically with the data from pokeapi.com. I did't just type the whole thing out lol !")