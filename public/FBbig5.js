d3.csv('/mypersonality_final_fix.csv', function(d) {
    // console.log(columns);
    // console.log(i);
    return d;
}, function(error, data) {
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
    console.log(data);
    let btn = document.querySelector('input[type="button"]');
    btn.addEventListener('click', function() {
        // console.log("on")
        submit(fbdata);
    });
});

/**
 * return n*n matrix
 * @param {number} n - *n matrix
 * @return {array}
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
 * @param {array} Mat - Mat
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
 * normalize a dist
 * @param {array} dists - dist
 * @return {array}
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
 * get big5dist dists
 * @param {object} data - source data object
 * @return {array}
 */
function big5dist(data) {
    let pointlist = [];
    for (let i = 0; i < data.length; i++) {
        let point = [];
        point.push(data[i].AUTHID);
        point.push(data[i].BIG5.sEXT);
        point.push(data[i].BIG5.sNEU);
        point.push(data[i].BIG5.sAGR);
        point.push(data[i].BIG5.sCON);
        point.push(data[i].BIG5.sOPN);
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
 * @return {array}
 */
function propertydist(data) {
    let pointlist = [];
    for (let i = 0; i < data.length; i++) {
        let point = [];
        point.push(data[i].AUTHID);
        point.push(data[i].PROPERTY.BETWEENNESS);
        point.push(data[i].PROPERTY.BROKERAGE);
        point.push(data[i].PROPERTY.DENSITY);
        point.push(data[i].PROPERTY.NBETWEENNESS);
        point.push(data[i].PROPERTY.NBROKERAGE);
        point.push(data[i].PROPERTY.NETWORKSIZE);
        point.push(data[i].PROPERTY.TRANSITIVITY);
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
 * @param {num} perplexity
 * @param {num} dim
 * @param {num} iteration
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
 * @param {num} px - pixel
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

    let color = d3.scaleLinear()
        .domain([0, 5])
        .range(['white', 'black']);

    let tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
    // .style("width","200px")
    // .style("height","30px");

    let svg = d3.select('#graph').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('id', 'big5');

    svg.selectAll('circle').data(data).enter().append('circle')
        .attr('class', 'circle')
        .attr('cx', function(d) {
            return x(d.BPLOT.x);
        })
        .attr('cy', function(d) {
            return y(d.BPLOT.y);
        })
        .attr('r', 5)
        .style('fill', function(d) {
            // return color(d.BIG5.sEXT);
            // console.log("rgb("+d.BIG5.sEXT * 51+","+d.BIG5.sCON*51+","+d.BIG5.sAGR*51+")")
            return 'rgb(' + Math.round(d.BIG5.sEXT * 51) + ',' + Math.round(d.BIG5.sCON * 51) + ',' + Math.round(d.BIG5.sAGR * 51) + ')';
        })
        .on('mouseover', function(d) {
            d3.select('#property').selectAll('circle')
                .style('fill', function(s) {
                    // console.log(d.AUTHID)
                    if (d.AUTHID === s.AUTHID) {
                        return 'white';
                    } else {
                        return 'rgb(' + Math.round(s.PROPERTY.NBETWEENNESS) + ',' + Math.round(s.PROPERTY.NETWORKSIZE * 0.1) + ',' + Math.round(s.PROPERTY.TRANSITIVITY * 500) + ')';
                    }
                });
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html('ID=' + d.AUTHID + '<br/>' + 'sAGR=' + d.BIG5.sAGR + '<br/>' + 'sCON=' + d.BIG5.sCON + '<br/>' + 'sEXT=' + d.BIG5.sEXT + '<br/>' + 'sNEU=' + d.BIG5.sNEU + '<br/>' + 'sOPN=' + d.BIG5.sOPN)
                .style('left', (d3.event.pageX + 5) + 'px')
                .style('top', (d3.event.pageY - 30) + 'px');
        })
        .on('mouseout', function(d) {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        })
        .on('click', function(d) {

        })
        .on('click', function(d) {
            status(d);
        });
}

/**
 * render property plot
 * @param {object} P
 * @param {object} data
 * @param {num} px - pixel
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

    let color = d3.scaleLinear()
        .domain([0, 5])
        .range(['white', 'black']);

    let tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
    // .style("width","200px")
    // .style("height","30px");

    let svg = d3.select('#graph').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('id', 'property');

    svg.selectAll('circle').data(data).enter().append('circle')
        .attr('class', 'circle')
        .attr('cx', function(d) {
            return x(d.PPLOT.x);
        })
        .attr('cy', function(d) {
            return y(d.PPLOT.y);
        })
        .attr('r', 5)
        .style('fill', function(d) {
            // return color(d.BIG5.sEXT);
            // console.log("rgb("+d.BIG5.sEXT * 51+","+d.BIG5.sCON*51+","+d.BIG5.sAGR*51+")")
            return 'rgb(' + Math.round(d.PROPERTY.NBETWEENNESS) + ',' + Math.round(d.PROPERTY.NETWORKSIZE * 0.1) + ',' + Math.round(d.PROPERTY.TRANSITIVITY * 500) + ')';
        })
        .on('mouseover', function(d) {
            d3.select('#big5').selectAll('circle')
                .style('fill', function(s) {
                    // console.log(d.AUTHID)
                    if (d.AUTHID === s.AUTHID) {
                        return 'white';
                    } else {
                        return 'rgb(' + Math.round(s.BIG5.sEXT * 51) + ',' + Math.round(s.BIG5.sCON * 51) + ',' + Math.round(s.BIG5.sAGR * 51) + ')';
                    }
                });
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html('ID=' + d.AUTHID + '<br/>' + 'BETWEENNESS=' + d.PROPERTY.BETWEENNESS + '<br/>' + 'BROKERAGE=' + d.PROPERTY.BROKERAGE + '<br/>' + 'DENSITY=' + d.PROPERTY.DENSITY + '<br/>' + 'NBETWEENNESS=' + d.PROPERTY.NBETWEENNESS + '<br/>' + 'NBROKERAGE=' + d.PROPERTY.NBROKERAGE + '<br/>' + 'NETWORKSIZE=' + d.PROPERTY.NETWORKSIZE + '<br/>' + 'TRANSITIVITY=' + d.PROPERTY.TRANSITIVITY)
                .style('left', (d3.event.pageX + 5) + 'px')
                .style('top', (d3.event.pageY - 30) + 'px');
        })
        .on('mouseout', function(d) {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        })
        .on('click', function(d) {
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
 */
function formchecked() {
    // var checkedValue = document.querySelector('Big5:checked').value;
    let value = document.getElementsByName('Big5').value;
    console.log(document.getElementsByName('Big5')[0].checked);
    // return value;
}

/**
 * sumit option and render
 * @param {object} data - source data
 */
function submit(data) {
    // Y is an array of 2-D points that you can plot
    let Y = getplot(10, 15, 2, 100, big5dist(data));
    let Z = getplot(10, 15, 2, 100, propertydist(data));
    console.log(Y);
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
    console.log(data);
    drawbig5(Y, data, 500);
    drawproperty(Z, data, 500);
}
