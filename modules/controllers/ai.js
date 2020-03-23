"use strict";

const config = require("../../config.json");
const apiai = require("apiai")(config.aiID);
const logger = require("../../util/logger.js");
const axios = require("axios");

const axios_instance = axios.create({
    baseURL: "https://pokeapi.co/api/v2",
    timeout: 3000,
});

const listen = (msg) => {
    if (msg.author.bot) return;

    let apiaiReq = apiai.textRequest(msg.content, {
        sessionId: "bucksy"
    });

    apiaiReq.on('response', async(response) => {
        const pokemon_endpoint = ['abilities', 'moves'];
        const pokemon_species_endpoint = ['description', 'evolution', 'about'];
        const pokemon = (response.result.parameters.pokemon) ? response.result.parameters.pokemon.toLowerCase().replace('.', '-').replace(' ', '').replace("'", "") : '';
        const specs = response.result.parameters.specs;
        const get_type_effectiveness = (response.result.parameters.type_effectiveness) ? true : false;
        let response_obj = {};

        console.log(response);

        if (specs) {
            for (let spec of specs) {
                if (pokemon_endpoint.indexOf(spec) !== -1) {
                    let fulfillmentText;
                    const { data } = await axios_instance.get(`/pokemon/${pokemon}`);
                    const value = (specs == 'abilities') ? data.abilities.map(item => item.ability.name).join(', ') : data.moves.map(item => item.move.name).join(', ');
                    fulfillmentText = `The ${specs} of ${pokemon} are: ${value}`;
                    Object.assign(response_obj, { fulfillmentText });
                }

                if (pokemon_species_endpoint.indexOf(spec) !== -1) {
                    const { data } = await axios_instance.get(`/pokemon-species/${pokemon}`);
                    const text = data.flavor_text_entries.find(item => {
                        return item.language.name == 'en';
                    });

                    let fulfillmentText;
                    if (specs == 'description') {
                        fulfillmentText = `${pokemon}:\n\n ${text.flavor_text}`;
                        Object.assign(response_obj, {
                            fulfillmentText
                        });
                    }
                }
            };
        }

        if (response.result.metadata.intentName === "evolution") {
            const { data } = await axios_instance.get(`/pokemon-species/${pokemon}`);
            const evolution_chain_id = data.evolution_chain.url.split('/')[6];
            const evolution_response = await axios_instance.get(`/evolution-chain/${evolution_chain_id}`);
            const evolution_requirement = response.result.parameters.evolutions;
            let pokemon_evolutions = [evolution_response.data.chain.species.name];
            let fulfillmentText;

            fulfillmentText = `${pokemon} has no evolution`;

            if (evolution_response.data.chain.evolves_to.length) {
                pokemon_evolutions.push(evolution_response.data.chain.evolves_to[0].species.name);
            }

            if (evolution_response.data.chain.evolves_to[0].evolves_to.length) {
                pokemon_evolutions.push(evolution_response.data.chain.evolves_to[0].evolves_to[0].species.name);
            }

            let evolution_chain = pokemon_evolutions.join(' -> ');

            const order_in_evolution_chain = pokemon_evolutions.indexOf(pokemon);
            const next_form = pokemon_evolutions[order_in_evolution_chain + 1];
            const previous_form = pokemon_evolutions[order_in_evolution_chain - 1];

            const evolution_text = {
                'evolution_chain': `${pokemon}'s evolution chain is: ${evolution_chain}`,
                'first_evolution': (pokemon == pokemon_evolutions[0]) ? `This is already the first form` : `${pokemon_evolutions[0]} is the first evolution`,
                'last_evolution': (pokemon == pokemon_evolutions[pokemon_evolutions.length - 1]) ? `This is already the final form` : pokemon_evolutions[pokemon_evolutions.length - 1],
                'next_form': `${pokemon} evolves to ${next_form}`,
                'previous_form': `${pokemon} evolves from ${previous_form}`
            };

            if (evolution_text[evolution_requirement]) {
                fulfillmentText = evolution_text[evolution_requirement];
            }

            Object.assign(response_obj, {
                fulfillmentText
            });
        }

        if (get_type_effectiveness) {
            const pokemon_type = response.result.parameters.pokemon_types;
            let type_effectiveness = response.result.parameters.type_effectiveness[0];
            // const type_effectiveness_formatted = type_effectiveness.replace(/_/g, ' ');
            const type_effectiveness_word = response.result.contexts[0].parameters['type_effectiveness.original'];
            let fulfillmentText;

            let from_or_to = type_effectiveness.split('_')[2];
            const pokemon_type_comes_first = (response.result.parameters.pokemon_types < response.result.resolvedQuery.indexOf(type_effectiveness_word)) ? true : false;
            const exempt_words = ['resistant', 'no damage', 'zero damage', 'no effect'];
            const has_exempt_words = exempt_words.some(v => type_effectiveness_word.includes(v));

            if ((pokemon_type_comes_first && !has_exempt_words) || (!pokemon_type_comes_first && has_exempt_words)) {
                let new_from_or_to = (from_or_to == 'from') ? 'to' : 'from';
                type_effectiveness = type_effectiveness.replace(from_or_to, new_from_or_to);
                from_or_to = new_from_or_to;
            }

            const output = await axios_instance.get(`/type/${pokemon_type}`);
            console.log(output, type_effectiveness);
            const damage_relations = (output.data.damage_relations[type_effectiveness].length > 0) ? output.data.damage_relations[type_effectiveness].map(item => item.name).join(', ') : 'none';
            const nature_of_damage = (from_or_to == 'from') ? 'receives' : 'inflicts';

            fulfillmentText = (nature_of_damage == 'inflicts') ?
                `${pokemon_type} type inflicts ${type_effectiveness} ${damage_relations} type` :
                `${pokemon_type} ${nature_of_damage} ${type_effectiveness} the following: ${damage_relations}`;

            Object.assign(response_obj, {
                fulfillmentText
            });
        }

        if (response_obj.fulfillmentText) {
            msg.channel.send(response_obj.fulfillmentText);
        } else {
            msg.channel.send(response.result.fulfillment.speech);
        }
    });

    apiaiReq.on('error', (error) => {
        logger.error(error);
    });

    apiaiReq.end();
};

module.exports = {
    listen
};