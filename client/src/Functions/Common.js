import { keywords } from './Params';

const createInitialInput = () => {
    let input = {};
    for (let key in keywords) {
        input[key] = JSON.parse(JSON.stringify(keywords[key]));
        input[key].selected = input[key].required;
        input[key].list = [JSON.parse(JSON.stringify(input[key]))];
        for (let i = 0; i < input[key].list.length; i++) {
            for (let prop in input[key].list[i].properties) {
                input[key].list[i].properties[prop].selected = input[key].list[i].properties[prop].required;
                input[key].list[i].properties[prop].value = input[key].list[i].properties[prop].default;
                if (input[key].list[i].increment && input[key].list[i].increment === prop)
                    input[key].list[i].properties[prop].value += i;
            }
        }
    }
    let counter = 0;
    for (let key in input) {
        for (let i = 0; i < input[key].list.length; i++) {
            for (let prop in input[key].list[i].properties) {
                input[key].list[i].properties[prop].id = counter++;
            }
        }
    }
    return { input, counter };
}

const convertJsontoN3 = (json) => {
    let converted = '';
    for (let key in json) {
        if (json[key].selected) {
            converted += '!********************************************************************************!\n'
            converted += '$' + json[key].section + '\n'
            for (let i = 0; i < json[key].list.length; i++) {
                for (let prop in json[key].list[i].properties) {
                    if (json[key].list[i].properties[prop].selected) {
                        let value = json[key].list[i].properties[prop].value
                        converted += `  ${prop}${' '.repeat(50 - prop.length)}= ${typeof value === 'object' ? value.join(' ') : value.toString()}\n`
                    }
                }
                converted += i === json[key].list.length - 1 ? '' : '\n'
            }
            converted += '$end_' + json[key].section + '\n'
            converted += '!********************************************************************************!\n\n'
        }
    }
    return converted;
}

const convertN3toJson = (n3) => {
    let commentRemoved = n3.replace(/!.*/g, '')
    let dSplited = commentRemoved.split('$')
    let brSplited = dSplited.map(item => item.split(/\r\n|\n|\r/))
    let endRemoved = brSplited.filter(item => !item[0].match(/^end/))
    let nullRemoved = endRemoved.map(item =>
        item.filter(item2 => item2 !== "" && !item2.match(/^\s*$/))
    )
    let nullArrayRemoved = nullRemoved.filter(item => item.length)
    let inputObject = nullArrayRemoved.map(item => {
        const [keyword, ...parameters] = item;
        return { keyword, parameters }
    })
    //console.log(inputObject)
    let eqSplited = inputObject.map(item => {
        return {
            keyword: item.keyword.replace(/\s+$/g, ""), parameters:
                item.parameters.map(param => {
                    let a = param.split(/\s*=\s*/)
                    let k = a[0].replace(/\s/g, '');
                    let v = a[1].replace(/\s+$/g, "");
                    return [k, v]
                })
        }
    })
    let { input, counter } = createInitialInput();
    for (let i = 0; i < eqSplited.length; i++) {
        for (let key in input) {
            if (input[key].section === eqSplited[i].keyword) {
                input[key].selected = true;
                let increment = input[key].increment;
                let c = increment ? -1 : 0;
                for (let j = 0; j < eqSplited[i].parameters.length; j++) {
                    if (increment === eqSplited[i].parameters[j][0]) {
                        c++
                        if (c > 0) {
                            let temp = JSON.parse(JSON.stringify(keywords[key]));
                            input[key].list.push(temp);
                        }
                    }
                    let isArray = !!input[key].list[c].properties[eqSplited[i].parameters[j][0]].type.match('array');
                    let value = isArray ? eqSplited[i].parameters[j][1].split(' ') : eqSplited[i].parameters[j][1]
                    input[key].list[c].properties[eqSplited[i].parameters[j][0]].selected = true
                    input[key].list[c].properties[eqSplited[i].parameters[j][0]].value = value
                }
            }
        }
    }
    counter = 0;
    for (let key in input) {
        for (let i = 0; i < input[key].list.length; i++) {
            for (let prop in input[key].list[i].properties) {
                input[key].list[i].properties[prop].id = counter++;
            }
        }
    }
    return { input, counter };
}

const getMaxCounter = (file) => {
    let input = JSON.parse(file);
    let counter = 1 +
        Math.max(...Object.keys(input).map(key =>
            Math.max(...input[key].list.map(item =>
                Math.max(...Object.keys(item.properties).map(prop =>
                    item.properties[prop].id
                ))
            ))
        ))
    return { input, counter };
}

const convertDatatoDat = (data) => {
    if (!data.length) return '';
    let json = [];
    data.list.map(item => {
        item.raw.map(content => {
            if (content.display) json.push(content);
        })
    });
    let xArray = json.map(item => item.data.map(d => d.x))
    let reduced = xArray.filter((x, i, self) => {
        for (let j = 0; j < i; j++) {
            if (x.toString() === self[j].toString()) {
                return false
            };
        }
        return true;
    });
    let xArrayList = [];
    for (let i = 0; i < reduced.length; i++) {
        for (let j = 0; j < reduced[i].length; j++) {
            xArrayList.push(reduced[i][j])
        }
    }

    let tables = [];
    for (let i = 0; i < json.length; i++) {
        tables.push([]);
        for (let j = 0; j < json.length; j++) {
            tables[i].push([])
            for (let k = 0; k < json[i].data.length; k++) {
                if (i === j) {
                    tables[i][j].push(json[j].data[k].y)
                } else {
                    tables[i][j].push('')
                }
            }
        }
    }
    let newTable = [];
    for (let i = 0; i < xArray.length; i++) {
        for (let j = 0; j < reduced.length; j++) {
            if (xArray[i].toString() === reduced[j].toString()) {
                if (newTable.length - 1 < j) {
                    newTable.push(tables[i]);
                } else {
                    for (let k = 0; k < tables[i].length; k++) {
                        for (let l = 0; l < tables[i][k].length; l++) {
                            if (tables[i][k][l] !== '') {
                                newTable[j][k][l] = tables[i][k][l];
                            }
                        }
                    }
                }
            }
        }
    }
    let lastTable = [];
    lastTable.push([json[0].xLabel, ...xArrayList]);
    for (let i = 0; i < xArray.length; i++) {
        let tempRaw = [json[i].yLabel];
        for (let j = 0; j < reduced.length; j++) {
            Array.prototype.push.apply(tempRaw, newTable[j][i])
        }
        lastTable.push(tempRaw)
    }
    let tsv = '';
    for (let i = 0; i < lastTable[0].length; i++) {
        let line = '';
        for (let j = 0; j < lastTable.length; j++) {
            line += (lastTable[j][i] === '' ? '' : lastTable[j][i]) + (j != lastTable.length - 1 ? '\t' : '');
        }
        line += i != lastTable[0].length - 1 ? '\n' : '';
        tsv += line;
    }
    return tsv;
}

export { createInitialInput, convertJsontoN3, convertN3toJson, getMaxCounter, convertDatatoDat }