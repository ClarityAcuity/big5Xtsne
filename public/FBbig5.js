d3.csv('/mypersonality_final_fix.csv', function (d) {
    // console.log(columns);
    // console.log(i);
    return d;
}, function (error, data) {
    if (error) throw error;
    let fbdata = [];
    let ppl = -1;
    let id;
    for (let i = 0; i < data.length; i++) {
        if (data[i]['#AUTHID'] !== id) {
            // console.log(ppl);
            fbdata.push({
                AUTHID: data[i]['#AUTHID'],
                BIG5: {
                    sEXT: data[i]['sEXT'],
                    sNEU: data[i]['sNEU'],
                    sAGR: data[i]['sAGR'],
                    sCON: data[i]['sCON'],
                    sOPN: data[i]['sOPN'],
                    cEXT: data[i]['cEXT'],
                    cNEU: data[i]['cNEU'],
                    cAGR: data[i]['cAGR'],
                    cCON: data[i]['cCON'],
                    cOPN: data[i]['cOPN'],
                },
                PROPERTY: {
                    NETWORKSIZE: data[i]['NETWORKSIZE'],
                    BETWEENNESS: data[i]['BETWEENNESS'],
                    NBETWEENNESS: data[i]['NBETWEENNESS'],
                    DENSITY: data[i]['DENSITY'],
                    BROKERAGE: data[i]['BROKERAGE'],
                    NBROKERAGE: data[i]['NBROKERAGE'],
                    TRANSITIVITY: data[i]['TRANSITIVITY'],
                },
                STATUS: [],
            });
            ppl++;
            id = data[i]['#AUTHID'];
        }
        fbdata[ppl].STATUS.push(data[i]['STATUS']);
    }
    console.log(fbdata);
    // console.log(data);
    let btn = document.querySelector('input[type="button"]');
    btn.addEventListener('click', function () {
        // console.log("on")
        submit(fbdata);
    });
});

/**
 * return n*n matrix
 * @param {number} n - *n matrix
 * @return {object} - array
 */
function initMat(n) {
    let mat = [];
    for (let i = 0; i < n; i++) {
        let temp = [];
        for (let j = 0; j < n; j++) {
            temp.push(0);
        }
        mat.push(temp);
    }
    return mat;
}

/**
 * calculate point distance
 * @param {object} a - point a
 * @param {object} b - point b
 * @return {number}
 */
function distance(a, b) {
    let d = 0;
    let n = a.length;
    for (let i = 1; i < n; i++) {
        d += (a[i] - b[i]) * (a[i] - b[i]);
    }
    return Math.sqrt(d);
}

/**
 * find  max num in Mat
 * @param {object} Mat - Mat array
 * @return {number}
 */
function MatMax(Mat) {
    let max = 0;
    for (let i = 0; i < Mat.lenght; i++) {
        for (let j = 0; j < Mat.lenght; j++) {
            if (Mat[i][j] > Max) {
                Max = Mat[i][j];
            }
        }
    }
    return max;
}

/**
 * get big5dist dists
 * @param {object} data - source data object
 * @return {object} - array
 */
function big5dist(data) {
    let checked = formchecked('Big5');
    let pointlist = [];
    for (let i = 0; i < data.length; i++) {
        let point = [];
        point.push(data[i].AUTHID);
        if (checked.sEXT) {
            point.push(data[i].BIG5.sEXT);
        }
        if (checked.sNEU) {
            point.push(data[i].BIG5.sNEU);
        }
        if (checked.sAGR) {
            point.push(data[i].BIG5.sAGR);
        }
        if (checked.sCON) {
            point.push(data[i].BIG5.sCON);
        }
        if (checked.sOPN) {
            point.push(data[i].BIG5.sOPN);
        }
        pointlist.push(point);
    }
    // console.log(pointlist)
    let dists = initMat(pointlist.length);
    for (let i = 0; i < dists.length; i++) {
        for (let j = i + 1; j < dists.length; j++) {
            dists[i][j] = distance(pointlist[i], pointlist[j]);
            dists[j][i] = distance(pointlist[i], pointlist[j]);
        }
        // console.log(temp[200])
    }
    // console.log(dists);
    return dists;
}

/**
 * get network properties dist
 * @param {object} data - source data object
 * @return {object}
 */
function propertydist(data) {
    let checked = formchecked('Property');
    let pointlist = [];
    for (let i = 0; i < data.length; i++) {
        let point = [];
        point.push(data[i].AUTHID);
        if (checked.BETWEENNESS) {
            point.push(data[i].PROPERTY.BETWEENNESS);
        }
        if (checked.BROKERAGE) {
            point.push(data[i].PROPERTY.BROKERAGE);
        }
        if (checked.DENSITY) {
            point.push(data[i].PROPERTY.DENSITY);
        }
        if (checked.NBETWEENNESS) {
            point.push(data[i].PROPERTY.NBETWEENNESS);
        }
        if (checked.NBROKERAGE) {
            point.push(data[i].PROPERTY.NBROKERAGE);
        }
        if (checked.NETWORKSIZE) {
            point.push(data[i].PROPERTY.NETWORKSIZE);
        }
        if (checked.TRANSITIVITY) {
            point.push(data[i].PROPERTY.TRANSITIVITY);
        }
        pointlist.push(point);
    }
    // console.log(pointlist)
    let dists = initMat(pointlist.length);
    for (let i = 0; i < dists.length; i++) {
        for (let j = i + 1; j < dists.length; j++) {
            dists[i][j] = distance(pointlist[i], pointlist[j]);
            dists[j][i] = distance(pointlist[i], pointlist[j]);
        }
        // console.log(temp[200])
    }
    // console.log(dists);
    return dists;
}

/**
 * get scatterplot {x:,y:}
 * @param {number} epsilon
 * @param {number} perplexity
 * @param {number} dim
 * @param {number} iteration
 * @param {object} data
 * @return {object}
 */
function getplot(epsilon, perplexity, dim, iteration, data) {
    let opt = {};
    opt.epsilon = epsilon; // epsilon is learning rate (10 = default)
    opt.perplexity = perplexity; // roughly how many neighbors each point influences (30 = default)
    opt.dim = dim; // dimensionality of the embedding (2 = default)

    let tsne = new tsnejs.tSNE(opt); // create a tSNE instance

    // initialize data. Here we have 3 points and some example pairwise dissimilarities

    let inputs = data;
    // console.log(dists);

    tsne.initDataDist(inputs);

    for (let k = 0; k < iteration; k++) {
        tsne.step(); // every time you call this, solution gets better
    }
    return tsne.getSolution();
}

/**
 * render big5 plot
 * @param {object} P
 * @param {object} data
 * @param {number} px - pixel
 */
function drawbig5(P, data, px) {
    let max;
    let min;
    for (let i = 0; i < P.length; i++) {
        for (let j = 0; j < 2; j++) {
            if (P[i][j] > max || max == undefined) {
                max = P[i][j];
            }
            if (P[i][j] < min || min == undefined) {
                min = P[i][j];
            }
        }
    }

    let width = px;
    let height = px;

    let x = d3.scaleLinear()
        .domain([min, max])
        .range([15, width - 15]);

    let y = d3.scaleLinear()
        .domain([min, max])
        .range([15, height - 15]);

    let tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
    // .style("width","200px")
    // .style("height","30px");

    let graph = d3.select('#graph').append('div');
    swapcolor(data, graph, '#big5', 'defult', '220px', '50px', 'defult');
    swapcolor(data, graph, '#big5', 'sEXT', '260px', '50px', 'BIG5.sEXT');
    swapcolor(data, graph, '#big5', 'sNEU', '300px', '50px', 'BIG5.sNEU');
    swapcolor(data, graph, '#big5', 'sAGR', '340px', '50px', 'BIG5.sAGR');
    swapcolor(data, graph, '#big5', 'sCON', '380px', '50px', 'BIG5.sCON');
    swapcolor(data, graph, '#big5', 'sOPN', '420px', '50px', 'BIG5.sOPN');

    let svg = d3.select('#graph').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('id', 'big5');

    svg.selectAll('circle').data(data).enter().append('circle')
        .attr('class', 'circle')
        .attr('cx', function (d) {
            return x(d.BPLOT.x);
        })
        .attr('cy', function (d) {
            return y(d.BPLOT.y);
        })
        .attr('r', 5)
        .style('fill', function (d) {
            // return color(d.BIG5.sEXT);
            // console.log("rgb("+d.BIG5.sEXT * 51+","+d.BIG5.sCON*51+","+d.BIG5.sAGR*51+")")
            return defultcolor('#big5', d);
        })
        .on('mouseover', function (d) {
            d3.select('#property').selectAll('circle')
                .style('fill', function (s) {
                    // console.log(d.AUTHID)
                    if (d.AUTHID === s.AUTHID) {
                        return 'black';
                    } else {
                        return defultcolor('#property', s);
                    }
                });
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html('ID=' + d.AUTHID + '<br/>' + 'sAGR=' + d.BIG5.sAGR + '<br/>' + 'sCON=' + d.BIG5.sCON + '<br/>' + 'sEXT=' + d.BIG5.sEXT + '<br/>' + 'sNEU=' + d.BIG5.sNEU + '<br/>' + 'sOPN=' + d.BIG5.sOPN)
                .style('left', (d3.event.pageX + 5) + 'px')
                .style('top', (d3.event.pageY - 30) + 'px');
        })
        .on('mouseout', function (d) {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        })
        .on('click', function (d) {

        })
        .on('click', function (d) {
            status(d);
        });
    // console.log();
}

/**
 * render property plot
 * @param {object} P
 * @param {object} data
 * @param {number} px - pixel
 */
function drawproperty(P, data, px) {
    let max;
    let min;
    for (let i = 0; i < P.length; i++) {
        for (let j = 0; j < 2; j++) {
            if (P[i][j] > max || max == undefined) {
                max = P[i][j];
            }
            if (P[i][j] < min || min == undefined) {
                min = P[i][j];
            }
        }
    }

    let width = px;
    let height = px;

    let x = d3.scaleLinear()
        .domain([min, max])
        .range([15, width - 15]);

    let y = d3.scaleLinear()
        .domain([min, max])
        .range([15, height - 15]);

    let tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
    // .style("width","200px")
    // .style("height","30px");

    let graph = d3.select('#graph').append('div');
    swapcolor(data, graph, '#property', 'defult', '460px', '50px', 'defult');
    swapcolor(data, graph, '#property', 'BETWEENNESS', '500px', '50px', 'PROPERTY.BETWEENNESS');
    swapcolor(data, graph, '#property', 'BROKERAGE', '540px', '50px', 'PROPERTY.BROKERAGE');
    swapcolor(data, graph, '#property', 'DENSITY', '580px', '50px', 'PROPERTY.DENSITY');
    swapcolor(data, graph, '#property', 'NBETWEENNESS', '620px', '50px', 'PROPERTY.NBETWEENNESS');
    swapcolor(data, graph, '#property', 'NBROKERAGE', '660px', '50px', 'PROPERTY.NBROKERAGE');
    swapcolor(data, graph, '#property', 'NETWORKSIZE', '700px', '50px', 'PROPERTY.NETWORKSIZE');
    swapcolor(data, graph, '#property', 'TRANSITIVITY', '740px', '50px', 'PROPERTY.TRANSITIVITY');

    let svg = d3.select('#graph').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('id', 'property');

    svg.selectAll('circle').data(data).enter().append('circle')
        .attr('class', 'circle')
        .attr('cx', function (d) {
            return x(d.PPLOT.x);
        })
        .attr('cy', function (d) {
            return y(d.PPLOT.y);
        })
        .attr('r', 5)
        .style('fill', function (d) {
            // return color(d.BIG5.sEXT);
            // console.log("rgb("+d.BIG5.sEXT * 51+","+d.BIG5.sCON*51+","+d.BIG5.sAGR*51+")")
            return defultcolor('#property', d);
        })
        .on('mouseover', function (d) {
            d3.select('#big5').selectAll('circle')
                .style('fill', function (s) {
                    // console.log(d.AUTHID)
                    if (d.AUTHID === s.AUTHID) {
                        return 'black';
                    } else {
                        return defultcolor('#big5', s);
                    }
                });
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html('ID=' + d.AUTHID + '<br/>' + 'BETWEENNESS=' + d.PROPERTY.BETWEENNESS + '<br/>' + 'BROKERAGE=' + d.PROPERTY.BROKERAGE + '<br/>' + 'DENSITY=' + d.PROPERTY.DENSITY + '<br/>' + 'NBETWEENNESS=' + d.PROPERTY.NBETWEENNESS + '<br/>' + 'NBROKERAGE=' + d.PROPERTY.NBROKERAGE + '<br/>' + 'NETWORKSIZE=' + d.PROPERTY.NETWORKSIZE + '<br/>' + 'TRANSITIVITY=' + d.PROPERTY.TRANSITIVITY)
                .style('left', (d3.event.pageX + 5) + 'px')
                .style('top', (d3.event.pageY - 30) + 'px');
        })
        .on('mouseout', function (d) {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        })
        .on('click', function (d) {
            status(d);
        });
}

/**
 * make status table
 * @param {object} point - user point object
 */
function status(point) {
    let table = '<table style="border:3px #23415a solid;" cellpadding="13" border="1"><tbody>';
    table += '<tr>'
             + '<th width="6%">#</th>'
             + '<th width="90%">Status</th>'
             + '</tr>';
    for (let i = 0; i < point.STATUS.length; i++) {
        let s = '<tr>'
                + '<th>' + (i+1) + '</th>'
                + '<td>' + point.STATUS[i] + '</td>'
                + '</tr>';
        table += s;
    }
    table += '</tbody></table>';
    let div = document.getElementById('table');
    console.log(div);
    let index = div.innerHTML.indexOf('<table');
    div.innerHTML = div.innerHTML.slice(0, index);
    div.innerHTML += table;
}

/**
 * form checked
 * @param {string} query - getelementsbyname
 * @return {object} - array
 */
function formchecked(query) {
    // var checkedValue = document.querySelector('Big5:checked').value;
    let checked = {};
    let form = document.getElementsByName(query);
    for (let i = 0; i < form.length; i++) {
        let id = form[i].id;
        checked[id] = form[i].checked;
    }
    console.log(checked);
    // return value;
    return checked;
}

/**
 * sumit option and render
 * @param {object} data - source data
 */
function submit(data) {
    // Y is an array of 2-D points that you can plot
    let Y = getplot(10, 15, 2, 100, big5dist(data));
    let Z = getplot(10, 15, 2, 100, propertydist(data));
    // console.log(Y);
    for (let i = 0; i < data.length; i++) {
        data[i]['BPLOT'] = {
            x: Y[i][0],
            y: Y[i][1],
        };
    }
    for (let i = 0; i < data.length; i++) {
        data[i]['PPLOT'] = {
            x: Z[i][0],
            y: Z[i][1],
        };
    }
    // console.log(data);
    drawbig5(Y, data, 500);
    drawproperty(Z, data, 500);
}

/**
 * normalize a dist
 * @param {object} dists - dist array
 * @return {object} - array
 */
function normalize(dists) {
    let max = MatMax(dists);
    // console.log(max)
    let n = dists.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            dists[i][j] = dists[i][j] / max;
        }
    }
    return dists;
}

/**
 * swap color
 * @param {object} data - ref data
 * @param {object} select - element
 * @param {string} id
 * @param {string} value
 * @param {string} top
 * @param {string} left
 * @param {string} attribute
 */
function swapcolor(data, select, id, value, top, left, attribute) {
    // console.log(select.select(id).selectAll('circle'));
    select.append('input')
        .attr('type', 'button')
        .attr('class', 'btn btn-primary btn-xs')
        .attr('value', value)
        // .style('position', 'absolute')
        // .style('top', top)
        // .style('left', left)
        .on('click', function () {
            d3.select(id).selectAll('circle')
                .style('fill', function (d) {
                    if (attribute === 'defult') {
                        return defultcolor(id, d);
                    } else {
                        let domain = attrdomain(data, attribute);
                        return colorscale(domain, setDescendantProp(d, attribute));
                    }
                });
        });
}

/**
 * setDescendantProp
 * @param {object} obj
 * @param {string} desc
 * @return {any} - obj
 */
function setDescendantProp(obj, desc) {
    let arr = desc.split('.');
    while (arr.length > 1) {
        obj = obj[arr.shift()];
    }
    return obj[arr[0]];
}

/**
 * get array domain
 * @param {object} data
 * @param {string} attribute
 * @return {object}
 */
function attrdomain(data, attribute) {
    let array = [];
    for (let i = 0; i < data.length; i++) {
        array.push(setDescendantProp(data[i], attribute));
    }
    let min;
    let max;
    for (let i = 0; i < array.length; i++) {
        if (Number(array[i]) < min || min === undefined) {
            min = Number(array[i]);
        }
        if (Number(array[i]) > max || max === undefined) {
            max = Number(array[i]);
        }
    }
    return {
        'min': min,
        'max': max,
    };
}

/**
 * color scale
 * @param {object} domain
 * @param {number} value
 * @return {number}
 */
function colorscale(domain, value) {
    let color = d3.scaleLinear()
        .domain([domain.min, domain.max])
        .range(['lightgrey', 'black']);
    return color(value);
}

/**
 * set defultcolor
 * @param {string} id
 * @param {object} d
 * @return {color}
 */
function defultcolor(id, d) {
    if (id == '#property') {
        return 'rgb(' + Math.round(d.PROPERTY.NBETWEENNESS) + ',' + Math.round(d.PROPERTY.NETWORKSIZE * 0.1) + ',' + Math.round(d.PROPERTY.TRANSITIVITY * 500) + ')';
    }
    if (id == '#big5') {
        return 'rgb(' + Math.round(d.BIG5.sEXT * 51) + ',' + Math.round(d.BIG5.sCON * 51) + ',' + Math.round(d.BIG5.sAGR * 51) + ')';
    }
}