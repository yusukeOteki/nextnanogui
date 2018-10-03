import { keywords } from './Params';

const createInitialInput = () => {
    let initialInput = {};
    for (let key in keywords) {
        initialInput[key] = JSON.parse(JSON.stringify(keywords[key]));
        initialInput[key].selected = initialInput[key].required;
        initialInput[key].list = [JSON.parse(JSON.stringify(initialInput[key]))];
        for (let i = 0; i < initialInput[key].list.length; i++) {
            for (let prop in initialInput[key].list[i].properties) {
                initialInput[key].list[i].properties[prop].selected = initialInput[key].list[i].properties[prop].required;
                initialInput[key].list[i].properties[prop].value = initialInput[key].list[i].properties[prop].default;
                if (initialInput[key].list[i].increment && initialInput[key].list[i].increment === prop)
                    initialInput[key].list[i].properties[prop].value += i;
            }
        }
    }
    return initialInput;
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
    let initialInput = createInitialInput();
    for (let i = 0; i < eqSplited.length; i++) {
        for (let key in initialInput) {
            if (initialInput[key].section === eqSplited[i].keyword) {
                initialInput[key].selected = true;
                let increment = initialInput[key].increment;
                let c = increment ? -1 : 0;
                for (let j = 0; j < eqSplited[i].parameters.length; j++) {
                    if (increment === eqSplited[i].parameters[j][0]) {
                        c++
                        if (c > 0) {
                            let temp = JSON.parse(JSON.stringify(keywords[key]));
                            initialInput[key].list.push(temp);
                        }
                    }
                    let isArray = !!initialInput[key].list[c].properties[eqSplited[i].parameters[j][0]].type.match('array');
                    let value = isArray ? eqSplited[i].parameters[j][1].split(' ') : eqSplited[i].parameters[j][1]
                    initialInput[key].list[c].properties[eqSplited[i].parameters[j][0]].selected = true
                    initialInput[key].list[c].properties[eqSplited[i].parameters[j][0]].value = value
                }
            }
        }
    }
    return initialInput;
}

const convertDatatoDat = (data) => {
    if(!data.length) return '';
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
                if (newTable.length-1 < j) {
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

export { createInitialInput, convertN3toJson, convertDatatoDat }