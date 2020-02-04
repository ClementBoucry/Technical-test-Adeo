// INITIALIZATION
const mockDb = require('./data');
const res = [];
let country = '';

// FUNCTIONS
function beautifyResult(data) {
    console.log('[');
    let first;
    data.forEach(country => {
        console.log('   { name:', JSON.stringify(country.name));
        country.people.forEach(people => {
            console.log('       people:');
            console.log('       [ { name:', people.name);
            console.log('           animals:');
            first = true;
            people.animals.forEach(animal => {
                if(first) {
                    first = false;
                    console.log('               [')
                    console.log('                { name:', animal, '}');
                } else if (!first) {
                    console.log('                { name:', animal, '}');                    
                }
            });
            console.log('               ]');
            console.log('           }');
            console.log('       ]');

        });
        console.log('   }');
    });
    console.log('] ');
}

function recursiveFilter(filtre, data) {
    data.forEach(element => {
        let key = Object.keys(element)[1];
        if (key === 'people') {
            country = element.name;
            recursiveFilter(filtre, element[key]);
        } else if (key === 'animals') {
            let animalFiltred = element.animals.filter(element => element.name.includes(filtre));
            if(animalFiltred.length > 0) {
                res.push({name: country, people: [{name: element.name, animals: [animalFiltred]}]});
            }
        }
    });
    return res;
}

function recursiveCount(data) {
    data.forEach(element => {
        let key = Object.keys(element)[1];
        if (key === 'people') {
            let count = element.people.length;
            element.name += (' [' + count + ']');
            recursiveCount(element.people);
        } else if (key === 'animals') {
            let count = element.animals.length;
            element.name += (' [' + count + ']');
        }
    });
    return data;
}

// CORE APPLICATION
function main(arg) {
    let res;
    if(arg.split('=')[0] === '--filter') {
        let filtre = arg.split('=')[1];
        res = recursiveFilter(filtre, mockDb.data);
    } else if(arg.split('=')[0] === '--count') {
        res = recursiveCount(mockDb.data);
    } else {
        console.log('For filter animal\'s list use --filter=\"FILTRE\"');
        console.log('For count childs use --count');
    }
    if (res) {
        beautifyResult(res);
    }
}

main(process.argv[2]);
