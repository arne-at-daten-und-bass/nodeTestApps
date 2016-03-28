'use strict';

var queries = {
  movies: function() {
    var queries = {
      create: 'CREATE (m:Movie {properties}) RETURN m',
      read: 'MATCH m WHERE id(m)={id} RETURN m',
      readBulkParam: 'MATCH (m:Movie { released: {released} }) RETURN m',
      readBulkWhereNotExistsParam: 'MATCH (m:Movie) WHERE NOT exists(m.released) RETURN m',
      readBulkNoParam: 'MATCH (m:Movie) RETURN m',
      getUpate: 'MATCH m WHERE id(m)={id} RETURN m',
      update: 'MATCH m WHERE id(m)={id} SET m={properties} RETURN m',
      getDelete: 'MATCH m WHERE id(m)={id} RETURN m',
      delete: 'MATCH m WHERE id(m)={id} WITH m, m.title AS title, m.released AS released, m.tagline AS tagline DETACH DELETE m RETURN title, released, tagline',
      readDistinct: {
        released: 'MATCH (m:Movie) WITH m ORDER BY m.released RETURN collect(DISTINCT m.released)',
      },
      search: {
        readLatestFourNodes: 'MATCH (m:Movie) RETURN m ORDER BY m.released DESC LIMIT 4',
      },
    };
    return queries;
  },

  persons: function() {
    var queries = {
      create: 'CREATE (p:Person {properties}) RETURN p',
      read: 'MATCH p WHERE id(p)={id} RETURN p',
      readBulkParam: 'MATCH (p:Person { born: {born} }) RETURN p',
      readBulkWhereNotExistsParam: 'MATCH (p:Person) WHERE NOT exists(p.born) RETURN p',
      readBulkNoParam: 'MATCH (p:Person) RETURN p',
      getUpate: 'MATCH p WHERE id(p)={id} RETURN p',
      update: 'MATCH p WHERE id(p)={id} SET p={properties} RETURN p',
      getDelete: 'MATCH p WHERE id(p)={id} RETURN p',
      delete: 'MATCH p WHERE id(p)={id} WITH p, p.name AS name, p.born AS born DETACH DELETE p RETURN name, born',
      readDistinct: {
        born: 'MATCH (p:Person) WITH p ORDER BY p.born RETURN collect(DISTINCT p.born)',
      },
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
      search: {
        readLabelsAmountNodes: 'MATCH (n) RETURN labels(n), count(*)',
        readTypeAmountRelationships: 'MATCH (n)-[r]->(m) RETURN type(r), count(r) ORDER BY count(r) DESC',
        readAllRelationshipsPagination: 'MATCH (s)-[r]->(t) RETURN CASE WHEN exists(s.name) = true THEN s.name WHEN exists(s.title) = true THEN s.title END, type(r), r, CASE WHEN exists(t.name) = true THEN t.name WHEN exists(t.title) = true THEN t.title END ORDER BY type(r) SKIP {offset} LIMIT {amount}',
        readTopPersons: {
          ACTED_IN: 'MATCH (p:Person)-[r:ACTED_IN]->(m:Movie) RETURN p.name AS Person, id(p) AS PersonId, count(*) AS AmountRoles, collect(m.title) AS Movies, collect(id(m)) AS MovieIds ORDER BY AmountRoles DESC LIMIT 4',
        },
        readCastMovie: 'MATCH (p:Person)-[r:ACTED_IN]->(m:Movie) WHERE id(m)={id} RETURN p.name, id(p), size(r.roles), r.roles' ,
        readTopColleagues: {
          ACTED_IN: 'MATCH (p:Person)-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(c:Person) WHERE id(p)={id} RETURN c.name, id(c), count(m), collect(m.title), collect(id(m)) ORDER BY count(m) DESC LIMIT 4',
        },
      },
    };
    return queries;
  },
};

module.exports = queries;
