// INITIALIZATION
// data recovery
const mockDb = require('./data');
// global variable initialization
const res = [];
let country = '';

// FUNCTIONS
/*
    BeautifulResult, take one parameter data with pattern country-people-animals. 
        display this data in console.
*/
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

/*
    recursiveFilter, take two parameter filter a string and data with pattern country-people-animals. 
        filters the animals of this data to keep only those whose name contains the filter.
*/
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


/*
    recursiveFilter, take two parameter filter a data with pattern country-people-animals. 
        Count the number of children and write it in the name of the element.
*/
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
/*
    main, take one parameter, the argument of command line.. 
        executes the different functions according to the arguments retrieved from the command line.
*/
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

// application execution
main(process.argv[2]);
