const request = require('request');
const jsdom = require('jsdom');
const fs = require('fs');

const { JSDOM } = jsdom;

function obterConteudo() { //função para obter os dados
    const url = `https://pokemondb.net/pokedex/all`;//Guarda a url do site que iremos realizar o WebScraping.
    const urlImages = `https://www.pokemon.com/br/pokedex/`;//Url de one vamos tentar coletar as imagens oficiais dos pokemons.

    request(url, function (error, response, body){
        if(error) {
            console.log(error); //Retornando caso de algum erro.
            return;
        }

        const dom = new JSDOM(body);//Simula a DOM do parametro 'body' passado.

        const pokemonsRetorno = []; //Array onde vai ser salvadas as informações

        const pokemons = dom.window.document.querySelectorAll('#pokedex > tbody > tr');//Essa linha seleciona as 'tr's do HTML
        for(const pokemon of pokemons) {// for para iterar cada 'tr' selecionada
            const pokemonRetorno = { //Objeto que sera construido e inserido dentro do array de pokemonsRetorno

            }

            //Seleciona o lugar onde esta armazenado a informação do numero da pokedex do pokemon.
            let queryPokedex = pokemon.querySelector('.infocard-cell-data');
            if(queryPokedex)//If para tratar caso o queryPokedex não exista
                pokemonRetorno.pokedex = queryPokedex.textContent;//Insere o valor extraido em uma key chamada 'pokedex'.


            //Seleciona o nome de mega evoluções ou tipos de evolução diferentes das normais.
            let DifNames = pokemon.querySelector('.text-muted');
            if(DifNames)
                pokemonRetorno.DifNames = DifNames.textContent;


            //Seleciona o Nome padrão do pokemon.
            let queryName = pokemon.querySelector('.cell-name');
            if(queryName)
                pokemonRetorno.name = queryName.textContent;


            //Seleciona os Types do pokemon.
            let queryType = pokemon.querySelectorAll('.type-icon');
            if(queryType) { 
                pokemonRetorno.types = [];//Como os pokemons podem ter mais de um tipo, inserimos os Tipos em um array
               for(const type of queryType) {
                    pokemonRetorno.types.push(type.textContent);//Iteração para pegar todos os tipos de um unico Pokemon
               }
            }


            //Seleciona o Status 'Total'
            let queryTotal = pokemon.querySelector('.cell-total');
            if(queryTotal)
                pokemonRetorno.total = queryTotal.textContent;


            //Seleciona os Status: atk, def.....
            let queryStats = pokemon.querySelectorAll('.cell-num');
            if(queryStats) {
                pokemonRetorno.hp = queryStats[1].textContent;
                pokemonRetorno.attack = queryStats[2].textContent;
                pokemonRetorno.defense = queryStats[3].textContent;
                pokemonRetorno.spAtk = queryStats[4].textContent;
                pokemonRetorno.spDef= queryStats[5].textContent;
                pokemonRetorno.speed = queryStats[6].textContent;
            }


            pokemonsRetorno.push(pokemonRetorno);//Insere o objeto criado de cada pokemon em nosso array.
        }


        console.log('Concluido com sucesso.')
        fs.writeFileSync('./pokemonsData.json', JSON.stringify(pokemonsRetorno, null, 2), 'UTF8');//Escreve o arquivo JSON com todas as informçaoes dos pokemons
    });
}; 

obterConteudo();
