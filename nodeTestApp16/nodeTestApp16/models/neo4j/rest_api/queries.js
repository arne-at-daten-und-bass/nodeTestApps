'use strict';

var queries = {
  movies: function() {
    var queries = {
      create: 'CREATE (m:Movie {properties}) RETURN m',
      read: 'MATCH m WHERE id(m)={id} RETURN m',
      readBulkParam: 'MATCH (m:Movie { released: {released} }) RETURN m',
      readBulkNoParam: 'MATCH (m:Movie) RETURN m',
      getUpate: 'MATCH m WHERE id(m)={id} RETURN m',
      update: 'MATCH m WHERE id(m)={id} SET m={properties} RETURN m',
      getDelete: 'MATCH m WHERE id(m)={id} RETURN m',
      delete: 'MATCH m WHERE id(m)={id} WITH m, m.title AS title, m.released AS released, m.tagline AS tagline DETACH DELETE m RETURN title, released, tagline',
    };

    return queries;
  },

  persons: function() {
    var queries = {
      create: 'CREATE (p:Person {properties}) RETURN p',
      read: 'MATCH p WHERE id(p)={id} RETURN p',
      readBulkParam: 'MATCH (p:Person { born: {born} }) RETURN p',
      readBulkNoParam: 'MATCH (p:Person) RETURN p',
      getUpate: 'MATCH p WHERE id(p)={id} RETURN p',
      update: 'MATCH p WHERE id(p)={id} SET p={properties} RETURN p',
      getDelete: 'MATCH p WHERE id(p)={id} RETURN p',
      delete: 'MATCH p WHERE id(p)={id} WITH p, p.name AS name, p.born AS born DETACH DELETE p RETURN name, born',
    };

    return queries;
  },

  graph: function() {
    var queries = {
      readAllGraph: 'MATCH path = (n)-[r]->(m) RETURN path',
      readAllMovies: 'MATCH (m:Movie) RETURN m.title ORDER BY m.title',
      readAllPersons: 'MATCH (p:Person) RETURN p.name ORDER BY p.name',
      create_ACTED_IN: 'MATCH (p:Person { name: {source} }), (m:Movie { title: {target} }) CREATE (p)-[r:ACTED_IN {roles: [{property}] }]->(m) RETURN p.name, type(r), m.title, r.roles',
      create_DIRECTED: 'MATCH (p:Person { name: {source} }), (m:Movie { title: {target} }) CREATE (p)-[r:DIRECTED]->(m) RETURN p.name, type(r), m.title',
      create_FOLLOWS: 'MATCH (p:Person { name: {source} }), (p2:Person { name: {target} }) CREATE (p)-[r:FOLLOWS]->(p2) RETURN p.name, type(r), p2.name',
      create_PRODUCED: 'MATCH (p:Person { name: {source} }), (m:Movie { title: {target} }) CREATE (p)-[r:PRODUCED]->(m) RETURN p.name, type(r), m.title',
      create_REVIEWED: 'MATCH (p:Person { name: {source} }), (m:Movie { title: {target} }) CREATE (p)-[r:REVIEWED {summary: {property} }]->(m) RETURN p.name, type(r), m.title, r.summary',
      create_WROTE: 'MATCH (p:Person { name: {source} }), (m:Movie { title: {target} }) CREATE (p)-[r:WROTE]->(m) RETURN p.name, type(r), m.title',
    };

    return queries;
  },
};

module.exports = queries;
