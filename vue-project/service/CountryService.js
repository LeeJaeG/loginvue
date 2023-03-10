export default class CountryService {

    getCountries() {
        return fetch('vue-project/demo/data/countries.json').then(res => res.json())
            .then(d => d.data);
    }
 }