const request = require('request');
const jsdom = require('jsdom');
const fs = require('fs');

const { JSDOM } = jsdom;

function obterConteudo() { //função para obter os dados
    const url = `https://pokemondb.net/pokedex/all`;
    const urlImages = `https://www.pokemon.com/br/pokedex/`;

    request(url, function (error, response, body){
        if(error) {
            console.log(error);
            return;
        }

        const dom = new JSDOM(body);

        const pokemonsRetorno = [];
        const pokemonsImage = dom.window.document.querySelectorAll
        const pokemons = dom.window.document.querySelectorAll('#pokedex > tbody > tr');
        for(const pokemon of pokemons) {
            const pokemonRetorno = {

            }

            let queryPokedex = pokemon.querySelector('.infocard-cell-data');
            if(queryPokedex)
                pokemonRetorno.pokedex = queryPokedex.textContent;


            let DifNames = pokemon.querySelector('.text-muted');
            if(DifNames)
                pokemonRetorno.DifNames = DifNames.textContent;


            let queryName = pokemon.querySelector('.cell-name');
            if(queryName)
                pokemonRetorno.name = queryName.textContent;


            let queryType = pokemon.querySelectorAll('.type-icon');
            if(queryType) { 
                pokemonRetorno.types = [];
               for(const type of queryType) {
                    pokemonRetorno.types.push(type.textContent);
               }
            }

            let queryTotal = pokemon.querySelector('.cell-total')
            if(queryTotal)
                pokemonRetorno.total = queryTotal.textContent;

            pokemonsRetorno.push(pokemonRetorno);

            let queryStats = pokemon.querySelectorAll('.cell-num')
            if(queryStats) {
                pokemonRetorno.hp = queryStats[1].textContent;
                pokemonRetorno.attack = queryStats[2].textContent;
                pokemonRetorno.defense = queryStats[3].textContent;
                pokemonRetorno.spAtk = queryStats[4].textContent;
                pokemonRetorno.spDef= queryStats[5].textContent;
                pokemonRetorno.speed = queryStats[6].textContent;
            }

        }


        console.log('Concluido com sucesso.')
        fs.writeFileSync('./pokemonsData.json', JSON.stringify(pokemonsRetorno, null, 2), 'UTF8');
    });
}; 

obterConteudo();
