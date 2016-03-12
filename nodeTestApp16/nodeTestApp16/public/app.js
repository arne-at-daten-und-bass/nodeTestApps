'use strict';

var app = (function() {

  var personsList;
  var relationshipsList;
  var movieList;

  var source;
  var type;
  var target;
  var asLabel;
  var property;


  function optionBuilder(elementArray) {
    var documentFragment = document.createDocumentFragment();
    elementArray.forEach(function(element, index) {
      var option = document.createElement('option');
      option.innerHTML = element;
      option.value = element;
      documentFragment.appendChild(option);
    })
    return documentFragment;
  }

  function changeTargetList() {
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

  function toogleView(value) {
    target = document.getElementById('target');
    property = document.getElementById('property');

    switch(value.row[1]) {
      case 'ACTED_IN':
        property.style.display = 'block';
        property.innerHTML = 'as ' + value.row[3][0] + '.';
        break;
      case 'DIRECTED':
        property.style.display = 'none';
        break;
      case 'PRODUCED':
        property.style.display = 'none';
        break;
      case 'REVIEWED':
        property.style.display = 'block';
        property.innerHTML = 'Summary' + value.row[3] + '.';
        break;
      case 'WROTE':
        property.style.display = 'none';
        break;
      case 'FOLLOWS':
        target.innerHTML = value.row[2];
        property.style.display = 'none';
        break;
      default:
        console.log('default');
    }
  }

  function buildOptions(personslocal, relationshipslocal, movieslocal) {
    personsList = optionBuilder(personslocal);
    relationshipsList = optionBuilder(relationshipslocal);
    movieList = optionBuilder(movieslocal);

    source = document.getElementById('source');
    type = document.getElementById('type');
    target = document.getElementById('target');
    asLabel = document.getElementById('asLabel');
    property = document.getElementById('property');

    type.onchange = changeTargetList;
    
    source.appendChild(personsList.cloneNode(true));
    type.appendChild(relationshipsList.cloneNode(true));
    target.appendChild(movieList.cloneNode(true));
  }

  return {
    toogleView: toogleView,
    buildOptions: buildOptions,
  }; 
})();



