'use strict';

var app = (function() {

  var pagination0 = 1;
  var pagination = 0;

  var personsList;
  var relationshipsList;
  var movieList;

  var source;
  var type;
  var target;
  var asLabel;
  var property;

  function searchField(event, locale) {
    var searchBox = document.getElementById('search-field');
    if (event.keyCode == 13 && searchBox.value.length > 0) {
      location.path = ''
      return location = '/' + locale + '/graph/search/searchBox?searchParam=' + encodeURIComponent(searchBox.value);
      } else {
      return false;
    }  
  }

  function changeLocale(currentLocale, newLocale) {
    var newLocation = location.pathname.replace('/' + currentLocale + '/', newLocale + '/');
    location.assign(newLocation);
  }

  function changeLocationReadBulk(location, year, paramName) {
    if(isNaN(year)) {
      return self.location = self.location.pathname;
    } else {
      return self.location = location + '?' + paramName + '=' + year;   
    }
  }

  function changeLocationSearch(locale, nodeType, nodeId) {
    self.location.path = ''
    return self.location = '/' + locale + '/' + nodeType + '/read/' + nodeId;
  }

  function visualizeGraphDiv(url, locale, width, height, charge) {

    var force = d3.layout.force()
        .size([width, height])
        .friction(0.75)
        .charge(charge)
        .linkDistance(40)
        .gravity(0.25);

    var drag = force.drag()
        .on("dragstart", dragstart);

    var svg = d3.select('#graph').append('svg')
        .attr('viewBox', '0 0 1044 ' + height)
        .attr('preserveAspectRatio', 'xMidYMid meet');

    var color = d3.scale.ordinal()
        .domain(['Movie','Person'])
        .range(['#8bc34a', '#757575']);

    d3.json(url, function(error, graph) {
      if (error) throw error;

      var relationships =  graph.graph.links;
      var nodes = graph.graph.nodes;

      relationships.forEach(function (l, index) {
        if (!l.linkCount) { l.linkCount = 1; }
        var linkCount2 = 1;
        relationships.forEach(function (l2, index2) {
          if(relationships[index].source === relationships[index2].source && relationships[index].target === relationships[index2].target){                  
            l2.linkCount = linkCount2++;
          } 
        });
      });

      force.nodes(nodes).links(relationships).start();

      var link = svg.selectAll('link')
          .data(relationships)
          .enter().append('g')
          .attr('class', 'link');

      var linkLine = link.append('line');  

      var linkText = link.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', function(d) { return 1 - d.linkCount + 'em'; })
          .text(function(d) { return d.value; });

      var node = svg.selectAll('node')
          .data(nodes)
          .enter().append('g')
          .attr('class', 'node')
          .call(drag);

      var nodeIcon = node.append('text')
          .text(function(d) {
            if(d.label === 'Movie') { return '\ue02c'; } 
            if(d.label === 'Person') { return '\ue7fd'; } })
          .attr('class', 'material-icons')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .style('fill', function(d) { return color(d.label); });
     
      var nodeTextRect = node.append('rect')
          .attr('id', function(d) { return 'nodeTextRect_' + d.id; })
          .attr('class', 'nodeTextRect')
          .style('stroke', function(d) { return color(d.label); });

      var nodeText = node.append("svg:a")
          .attr("xlink:href", function(d){
           if(d.name === undefined) { return '/' + locale + '/movies/read/' + d.id;} 
           if(d.title === undefined) { return '/' + locale + '/persons/read/' + d.id; }})
          .append('text')
          .text(function(d) {
            if(d.name === undefined) { return d.title; } 
            if(d.title === undefined) { return d.name; } })
          .attr('id', function(d) { return 'nodeText_' + d.id; })
          .attr('class', 'nodeText')
          .attr('dy', '.35em')
          .style('fill', function(d) { return color(d.label); });

      node.on('dblclick', dblclick);

      nodeIcon.on('mouseenter', mouseenter);

      nodeIcon.on('mouseleave', mouseleave);   

      force.on('tick', function() {

        linkLine.attr('x1', function(d) { return d.source.x; })
                .attr('y1', function(d) { return d.source.y; })
                .attr('x2', function(d) { return d.target.x; })
                .attr('y2', function(d) { return d.target.y; });

        linkText.attr('transform', function(d) {
              var angle = Math.atan((d.source.y - d.target.y) / (d.source.x - d.target.x)) * 180 / Math.PI;
              return 'translate(' + [((d.source.x + d.target.x) / 2), ((d.source.y + d.target.y) / 2)] + ')rotate(' + angle + ')';
            });

        nodeIcon.attr('x', function (d) { return d.x; })
                .attr('y', function (d) { return d.y; });

        nodeTextRect.attr('x', function (d) { return d.x+22; })
                    .attr('y', function (d) { return d.y-10; });

        nodeText.attr('x', function (d) { return d.x+27; })
                .attr('y', function (d) { return d.y; });
      }); 

    });

    function dblclick(d) {
      d3.select(this).classed("fixed", d.fixed = false);
      d3.select(this).selectAll('.material-icons').on('mouseleave', mouseleave);
      d3.select(this).selectAll('.nodeText').style({display:'none'}); 
      d3.select(this).selectAll('.nodeTextRect').style({display:'none'});
    }

    function dragstart(d) {
      d3.select(this).classed("fixed", d.fixed = true);
      d3.select(this).selectAll('.material-icons').on('mouseleave', null);
      d3.select(this).selectAll('.nodeText').style({display:'inline'}); 
      //d3.select(this).selectAll('.nodeTextRect').style({display:'inline'});
      d3.select('#nodeTextRect_' + d.id)
          .style({display:'inline'})
          .attr('width', function(d) { return document.getElementById('nodeText_' + d.id).getBBox().width + 10; })
          .attr('height', 20);
      // console.log(this);
    }

    function mouseenter(d) {
      d3.select(this).style('font-size', 'xx-large');
      d3.select(this.parentNode).selectAll('.nodeText')
        .style({display:'inline'});
      d3.select('#nodeTextRect_' + d.id)
        .style({display:'inline'})
        .attr('width', function(d) { return document.getElementById('nodeText_' + d.id).getBBox().width + 10; })
        .attr('height', 20);
    }

    function mouseleave(d) {
      d3.select(this).style('font-size', 24);
      d3.select(this.parentNode).selectAll('.nodeText').style({display:'none'}); 
      d3.select(this.parentNode).selectAll('.nodeTextRect').style({display:'none'});
    }  
  }

  function createNodesTableBody(element, url) {
    var elementArray = [];
    var oldTBody = document.getElementById(element);
    var newTBody = document.createElement('tbody');
    newTBody.id = 'nodesTableBody';
    var documentFragment = document.createDocumentFragment();

    var xhr = new XMLHttpRequest();

    xhr.open('GET', encodeURI(url));

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        elementArray = JSON.parse(xhr.responseText).data;
        elementArray.forEach(function (element, index) {

          var outerTr = document.createElement('tr');
            var innterTd1 = document.createElement('td');
            innterTd1.textContent = elementArray[index].row[0];
            innterTd1.className = 'mdl-data-table__cell--non-numeric';
          outerTr.appendChild(innterTd1);
            var innterTd2 = document.createElement('td');
            innterTd2.textContent = elementArray[index].row[1];
          outerTr.appendChild(innterTd2);
          documentFragment.appendChild(outerTr);
        });

      newTBody.appendChild(documentFragment);
      if (oldTBody.parentNode) { oldTBody.parentNode.replaceChild(newTBody, oldTBody); }
      }
    };
    xhr.send();
  }

  function paginateNodesTableBodyBothWays() {
    var url;
    switch (pagination0) {
      case 0:
        url = '/api/graph/read/typeAmountRelationships';
        document.getElementById('myI').textContent = 'linear_scale';
        document.getElementById('myH').textContent = 'Relationships';
        document.getElementById('myTh').textContent = 'Type';
        pagination0 = pagination0 +1;
        break;
      case 1:
        url = '/api/graph/read/readLabelsAmountNodes';
        document.getElementById('myH').textContent = 'Nodes';
        document.getElementById('myI').textContent = 'grain';
        document.getElementById('myTh').textContent = 'Label';
        pagination0 = pagination0 -1;
        break;
      default:
        console.log('Default case.');
    } 
    createNodesTableBody('nodesTableBody', url);
  }

  function createGraphTableBody(element, url) {
    var elementArray = [];
    var oldTBody = document.getElementById(element);
    var newTBody = document.createElement('tbody');
    newTBody.id = 'graphTableBody';
    var documentFragment = document.createDocumentFragment();

    var xhr = new XMLHttpRequest();

    xhr.open('GET', encodeURI(url + pagination));

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        elementArray = JSON.parse(xhr.responseText).data;
        elementArray.forEach(function (element, index) {

          var outerTr = document.createElement('tr');
            var innterTd1 = document.createElement('td');
            innterTd1.textContent = elementArray[index].row[0];
            innterTd1.className = 'mdl-data-table__cell--non-numeric';
          outerTr.appendChild(innterTd1);
            var innterTd2 = document.createElement('td');
            innterTd2.textContent = elementArray[index].row[1];
            innterTd2.className = 'mdl-data-table__cell--non-numeric';
          outerTr.appendChild(innterTd2);
            var innterTd3 = document.createElement('td');
            innterTd3.textContent = JSON.stringify(elementArray[index].row[2]);
            innterTd3.className = 'mdl-data-table__cell--non-numeric';
          outerTr.appendChild(innterTd3);
            var innterTd4 = document.createElement('td');
            innterTd4.textContent = elementArray[index].row[3];
            innterTd4.className = 'mdl-data-table__cell--non-numeric';
          outerTr.appendChild(innterTd4);

          documentFragment.appendChild(outerTr);
        });

      newTBody.appendChild(documentFragment);
      oldTBody.parentNode.replaceChild(newTBody, oldTBody);
      if(pagination < 6) {
        document.getElementById('graphTableBodyBackward').style.opacity = 0.46;
        document.getElementById('graphTableBodyBackward').onclick = '';
      } else {
        document.getElementById('graphTableBodyBackward').style.opacity = 1.00;
        document.getElementById('graphTableBodyBackward').onclick = paginateGraphTableBodyBackward;
      }

      if (elementArray.length < 6) {
        document.getElementById('graphTableBodyForward').style.opacity = 0.46;
        document.getElementById('graphTableBodyForward').onclick='';
      } else {
        document.getElementById('graphTableBodyForward').style.opacity = 1.00;
        document.getElementById('graphTableBodyForward').onclick = paginateGraphTableBodyForward;
      }
        
      }
    };
    xhr.send();
  }

  function paginateGraphTableBodyBackward() {
    pagination = pagination - 6;
    createGraphTableBody('graphTableBody', '/api/graph/read/RelationshipsPagination?pagination=', pagination);
  }

  function paginateGraphTableBodyForward() {
    pagination = pagination + 6;
    createGraphTableBody('graphTableBody', '/api/graph/read/RelationshipsPagination?pagination=', pagination);
  }

  function createNodesMdlCardsDiv(element, url, locale, showString) {

    var elementArray = [];
    var documentFragment = document.createDocumentFragment();
    var xhr = new XMLHttpRequest();

    xhr.open('GET', encodeURI(url));

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        elementArray = JSON.parse(xhr.responseText).data;

        elementArray.forEach(function (currentElement, index) {
          var outerDiv = document.createElement('div');
          outerDiv.className = 'mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--3dp';

            var innnerDivPersonMedia = document.createElement('div');
            innnerDivPersonMedia.className = 'mdl-card__media';
              var innnerIPersonMedia = document.createElement('i');
                  innnerIPersonMedia.textContent = 'person';
                  innnerIPersonMedia.className ='material-icons';
                  innnerIPersonMedia.style.opacity = '0.76'; 
                  innnerIPersonMedia.style.color = '#37474f';
            innnerDivPersonMedia.appendChild(innnerIPersonMedia);
          outerDiv.appendChild(innnerDivPersonMedia);

            var innnerDivPersonName  = document.createElement('div');
            innnerDivPersonName.className = 'mdl-card__title';
              var innnerH4PersonName = document.createElement('h4');
                  innnerH4PersonName.className = 'mdl-card__title-text';
                  innnerH4PersonName.textContent = elementArray[index].row[0];
            innnerDivPersonName.appendChild(innnerH4PersonName);
          outerDiv.appendChild(innnerDivPersonName);

            var innnerDivRoles = document.createElement('div');
            innnerDivRoles.className = 'mdl-card__title';
              var innnerIMovieMedia = document.createElement('i');
                  innnerIMovieMedia.className = 'material-icons';
                  innnerIMovieMedia.style.opacity = '0.46';
                  if (element === 'MovieCast') {
                    console.log(element);
                    innnerIMovieMedia.textContent = 'perm_contact_calendar \v'; 
                  } else {
                    innnerIMovieMedia.textContent = 'movie \v';
                  }
                  // innnerIMovieMedia.textContent = 'movie &nbsp;';
              var innnerH4AmountRoles = document.createElement('h4');
                  innnerH4AmountRoles.className ='mdl-card__title-text';
                  innnerH4AmountRoles.textContent = elementArray[index].row[2];
            innnerDivRoles.appendChild(innnerIMovieMedia);
            innnerDivRoles.appendChild(innnerH4AmountRoles);
          outerDiv.appendChild(innnerDivRoles);

            var innerDivMovieNames = document.createElement('div');
            innerDivMovieNames.className = 'mdl-card__supporting-text';
              var innerSpanMovieNames = document.createElement('sapn');
              innerSpanMovieNames.className = 'mdl-typography--font-thin';
              elementArray[index].row[3].forEach(function (innerElement, innerIndex){
                var innerAMovieName = document.createElement('a');
                if (element === 'MovieCast') { 
                  innerAMovieName.className = 'mdl-typography--font-light mdl-typography--subhead';
                } else {
                  innerAMovieName.className = 'android-link';
                  innerAMovieName.href = '/' + locale + '/movies/read/' + elementArray[index].row[4][innerIndex];
                }

                innerAMovieName.textContent = innerElement + ' | ';
                innerSpanMovieNames.appendChild(innerAMovieName);
              });
            innerDivMovieNames.appendChild(innerSpanMovieNames);
          outerDiv.appendChild(innerDivMovieNames);

            var innerDivActions = document.createElement('div');
            innerDivActions.className = 'mdl-card__actions';
              var innerAActions = document.createElement('a');
                  innerAActions.className = 'android-link mdl-button mdl-js-buttonmdl-typography--text-uppercase';
                  innerAActions.href = '/' + locale + '/persons/read/' + elementArray[index].row[1];
                  innerAActions.textContent = showString;
            innerDivActions.appendChild(innerAActions);
          outerDiv.appendChild(innerDivActions);

          documentFragment.appendChild(outerDiv);
        });
        document.getElementById(element).appendChild(documentFragment);
      }
    };
    xhr.send();
  }

  function toggleViewReadRelationship(value) {
    property = document.getElementById('property');

    switch(value.row[1]) {
      case 'ACTED_IN':
        property.style.display = 'block';
        property.textContent = 'as ' + value.row[3] + '.';
        break;
      case 'DIRECTED':
        property.style.display = 'none';
        break;
      case 'PRODUCED':
        property.style.display = 'none';
        break;
      case 'REVIEWED':
        property.style.display = 'block';
        property.textContent = 'Summary: ' + value.row[3] + '.';
        break;
      case 'WROTE':
        property.style.display = 'none';
        break;
      case 'FOLLOWS':
        property.style.display = 'none';
        break;
      default:
        console.log('default');
    }
  }

  function toggleViewUpdateRelationship(value) {
    asLabel = document.getElementById('asLabel')
    property = document.getElementById('property');

    switch(value.row[1]) {
      case 'ACTED_IN':
        property.style.display = 'inline';
        asLabel.style.display = 'inline';
        break;
      case 'DIRECTED':
        property.style.display = 'none';
        asLabel.style.display = 'none';
        break;
      case 'PRODUCED':
        property.style.display = 'none';
        asLabel.style.display = 'none';
        break;
      case 'REVIEWED':
        property.style.display = 'inline';
        asLabel.textContent = ' Summary: '
        property.textContent = value.row[4];
        break;
      case 'WROTE':
        property.style.display = 'none';
        asLabel.style.display = 'none';
        break;
      case 'FOLLOWS':
        property.style.display = 'none';
        asLabel.style.display = 'none';
        break;
      default:
        console.log('default');
    }
  }

  function optionCreator(elementArray, unknownString, hasID) {
    var documentFragment = document.createDocumentFragment();
    elementArray.forEach(function(element, index) {
      var option = document.createElement('option');
      if (element === -1) {
        option.textContent = unknownString;
      } else {
        // option.textContent = element;
        option.textContent = hasID ? element[0] : element;
      } 
      // option.value = element;
      option.value = hasID ? element[1] : element;
      documentFragment.appendChild(option);
    });
    return documentFragment;
  }

  // function optionBuilder2(elementArray, unknownString) {
  //   var documentFragment = document.createDocumentFragment();
  //   elementArray.forEach(function(element, index) {
  //     var option = document.createElement('option');
  //     if (element === -1) {
  //       option.textContent = unknownString;
  //     } else {
  //       option.textContent = element[0];
  //     } 
  //     option.value = element[1];
  //     documentFragment.appendChild(option);
  //   });
  //   return documentFragment;
  // }

  function targetFieldChanger() {
    var valueText = type.options[type.selectedIndex].value;
    switch(valueText) {
      case 'ACTED_IN':
        target.options.length = 0;
        target.appendChild(movieList.cloneNode(true));
        asLabel.style.display = 'inline';
        property.placeholder = 'Role (in English)';
        property.size=20;
        property.style.display = 'inline';
        break;
      case 'DIRECTED':
      case 'PRODUCED':
      case 'REVIEWED':
      case 'WROTE':
        target.options.length = 0;
        target.appendChild(movieList.cloneNode(true));
        asLabel.style.display = 'none';
        if(valueText === 'REVIEWED') {
          property.placeholder='Summary (in English)';
          property.size=50;
          property.style.display = 'inline';
        } else {
          property.style.display = 'none';
        }  
        break;
      case 'FOLLOWS':
        asLabel.style.display = 'none';
        property.style.display = 'none';
        target.options.length = 0;
        target.appendChild(personsList.cloneNode(true));
        break;
      default:
        console.log('default');
    }
  }

  function createOptionsRelationship(persons, relationships, movies) {
    personsList = optionCreator(persons, '', true);
    relationshipsList = optionCreator(relationships, '', false);
    movieList = optionCreator(movies, '', true);

    source = document.getElementById('source');
    type = document.getElementById('type');
    target = document.getElementById('target');
    asLabel = document.getElementById('asLabel');
    property = document.getElementById('property');

    type.onchange = targetFieldChanger;
    
    source.appendChild(personsList.cloneNode(true));
    type.appendChild(relationshipsList.cloneNode(true));
    target.appendChild(movieList.cloneNode(true));
  }

  function createOptionsReadBulk(element, url, inQueryParam, unknownString) {
    var xhr = new XMLHttpRequest();
    var distincValues; 

    xhr.open('GET', encodeURI(url));

    xhr.onreadystatechange = function() {
      if (xhr.readyState==4 && xhr.status==200) {
        distincValues = JSON.parse(xhr.responseText).distinctValues;
        distincValues.unshift(-1);            
        element.appendChild(optionCreator(distincValues, unknownString, false));

        if(inQueryParam.length > 0) {
          element.value = inQueryParam;
        }
      }
    };

    xhr.send();
  }

  function urlValidator(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
    return xhr.status==200;
  }

  function deleteRelationship(url, source, type, target, nodeType) {
    var txt = 'Delete relationship?\n' + '"' + source  + ' ' + type.toLowerCase() + ' ' + target + '"';
    var r = confirm(txt);
    var xhr = new XMLHttpRequest();

    var back;
    if (urlValidator(document.referrer)){
      console.log(urlValidator(document.referrer));
      back = document.referrer;
    } else {
      back = window.location.origin + '/' + nodeType;
    }

    if(r == true) {
      xhr.open('POST', encodeURI(url));
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          alert("Relationships deleted: " + JSON.parse(xhr.responseText).relationship_deleted);
          window.location.href = back;
        }
      };
      xhr.send();
    } 
  }

  function deleteNode(url, node, nodeType) {
    var txt = 'Delete node?\n' + '"' + node  + '"';
    var r = confirm(txt);
    var xhr = new XMLHttpRequest();
    var back;

    if (urlValidator(document.referrer)){
      console.log(urlValidator(document.referrer));
      back = document.referrer;
    } else {
      back = window.location.origin + '/' + nodeType;
    }
    // var xhrReferrer = new XMLHttpRequest();
    // xhrReferrer.open('Head', document.referrer);
    // xhrReferrer.onreadystatechange = function() {
    //   if(xhrReferrer.readyState === 4) {
    //     if (xhrReferrer.status === 200) {
    //        return back = document.referrer;
    //     } else {
    //       back = window.location.origin + '/' + nodeType;
    //     } 
    //   } else { 
    //   }
    // }
    // xhrReferrer.send();

    if(r == true) {
      xhr.open('POST', encodeURI(url));
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          alert("Nodes deleted: " + JSON.parse(xhr.responseText).nodes_deleted);
          window.location.href = back;
        }
      };
      xhr.send();
    } 
  }

  return {
    // naming convention: verb object and optionally element id or description (if used on several elements)

    search: {
      searchField: searchField
    },
    locale: {
      changeLocale: changeLocale,
    },
    location: {
      changeLocationReadBulk: changeLocationReadBulk,
      changeLocationSearch: changeLocationSearch,
    },
    visualization: {
      visualizeGraphDiv: visualizeGraphDiv,
    },
    content: { 
      htmlElements: {
        createNodesTableBody: createNodesTableBody,
        paginateNodesTableBodyBothWays: paginateNodesTableBodyBothWays,
        createGraphTableBody: createGraphTableBody,
        paginateGraphTableBodyBackward: paginateGraphTableBodyBackward,
        paginateGraphTableBodyForward: paginateGraphTableBodyForward,
        createNodesMdlCardsDiv: createNodesMdlCardsDiv,
        toggleViewReadRelationship: toggleViewReadRelationship,
        toggleViewUpdateRelationship: toggleViewUpdateRelationship,
        createOptionsRelationship: createOptionsRelationship,
        createOptionsReadBulk: createOptionsReadBulk,
      },
      userInteraction: {
        deleteRelationship: deleteRelationship,
        deleteNode: deleteNode,
      },
    },
    //createTopActorsMdlCardsDiv
    // divBuilder: divBuilder,
    // toogleViewReadRelationship
    // toogleView: toogleView,
    // toogleView<Element ID>
    // toogleView2: toogleView2,
    // createOptions<Element ID>
    // buildOptions: buildOptions,
    // createSelect<Element ID>
    // buildDynamicDropdowns: buildDynamicDropdowns,
    // paginateTable<Element ID>BothWays
    // tablePagination: tablePagination,
    // createTable<Element ID>
    // tableBuilder: tableBuilder,
    // createTable<Element ID>
    // tableBuilder2:tableBuilder2,
    // naming conflict see above (but not public so far)
    // optionBuilder and optionBuilder2

    // content.dataVisualization
    // visulizeGraph<Element ID>
    // graphBuilder: graphBuilder,

    // content.userInteraction
    // changelocation: changelocation,
    // changelocation2: changelocation2,
    
    // locale
    // changelocale: changelocale,
  }; 
})();