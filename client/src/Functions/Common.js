import { keywords } from '../Components/Params';

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

export { createInitialInput, convertN3toJson }