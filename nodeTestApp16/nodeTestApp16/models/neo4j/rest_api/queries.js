'use strict';

var queries = {
  movies: function() {
    var queries = {
      create: 'CREATE (m:Movie {properties}) RETURN m, id(m)',
      read: 'MATCH m WHERE id(m)={id} RETURN m',
      readBulkParam: 'MATCH (m:Movie { released: {released} }) RETURN m',
      readBulkWhereNotExistsParam: 'MATCH (m:Movie) WHERE NOT exists(m.released) RETURN m',
      readBulkNoParam: 'MATCH (m:Movie) RETURN m',
      getUpate: 'MATCH m WHERE id(m)={id} RETURN m',
      update: 'MATCH m WHERE id(m)={id} SET m={properties} RETURN m',
      // getDelete: 'MATCH m WHERE id(m)={id} RETURN m',
      // delete: 'MATCH m WHERE id(m)={id} WITH m, m.title AS title, m.released AS released, m.tagline AS tagline DETACH DELETE m RETURN title, released, tagline',
      delete: 'MATCH m WHERE id(m)={id} DETACH DELETE m',
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
      create: 'CREATE (p:Person {properties}) RETURN p, id(p)',
      read: 'MATCH p WHERE id(p)={id} RETURN p',
      readBulkParam: 'MATCH (p:Person { born: {born} }) RETURN p',
      readBulkWhereNotExistsParam: 'MATCH (p:Person) WHERE NOT exists(p.born) RETURN p',
      readBulkNoParam: 'MATCH (p:Person) RETURN p',
      getUpate: 'MATCH p WHERE id(p)={id} RETURN p',
      update: 'MATCH p WHERE id(p)={id} SET p={properties} RETURN p',
      // getDelete: 'MATCH p WHERE id(p)={id} RETURN p',
      // delete: 'MATCH p WHERE id(p)={id} WITH p, p.name AS name, p.born AS born DETACH DELETE p RETURN name, born',
      delete: 'MATCH p WHERE id(p)={id} DETACH DELETE p',
      readDistinct: {
        born: 'MATCH (p:Person) WITH p ORDER BY p.born RETURN collect(DISTINCT p.born)',
      },
    };

    return queries;
  },

  graph: function() {
    var queries = {
      readAllGraph: 'MATCH path = (n)-[r]->(m) RETURN path',
      readGraphOfMovie: 'MATCH path = (n:Movie)-[r]-(m) WHERE id(n)={id} RETURN path',
      readGraphOfPerson: 'MATCH path = (n:Person)-[r]-(m) WHERE id(n)={id} RETURN path',
      readAllMovies: 'MATCH (m:Movie) RETURN m.title, id(m) ORDER BY m.title',
      readAllPersons: 'MATCH (p:Person) RETURN p.name, id(p) ORDER BY p.name',
      // create_ACTED_IN: 'MATCH (p:Person { name: {source} }), (m:Movie { title: {target} }) CREATE (p)-[r:ACTED_IN {roles: [{property}] }]->(m) RETURN p.name, type(r), m.title, r.roles',
      create_ACTED_IN: 'MATCH (p:Person), (m:Movie) WHERE id(p)={source} AND id(m)={target} CREATE (p)-[r:ACTED_IN {roles: [{property}] }]->(m) RETURN p.name, type(r), id(r), m.title, r.roles',
      create_DIRECTED: 'MATCH (p:Person), (m:Movie) WHERE id(p)={source} AND id(m)={target} CREATE (p)-[r:DIRECTED]->(m) RETURN p.name, type(r), id(r), m.title',
      // create_FOLLOWS: 'MATCH (p:Person { name: {source} }), (p2:Person { name: {target} }) CREATE (p)-[r:FOLLOWS]->(p2) RETURN p.name, type(r), p2.name',
      create_FOLLOWS: 'MATCH (p:Person), (p2:Person) WHERE id(p)={source} AND id(p2)={target} CREATE (p)-[r:FOLLOWS]->(p2) RETURN p.name, type(r), id(r), p2.name', 
      create_PRODUCED: 'MATCH (p:Person), (m:Movie) WHERE id(p)={source} AND id(m)={target} CREATE (p)-[r:PRODUCED]->(m) RETURN p.name, type(r), id(r), m.title',
      create_REVIEWED: 'MATCH (p:Person), (m:Movie) WHERE id(p)={source} AND id(m)={target} CREATE (p)-[r:REVIEWED {summary: {property} }]->(m) RETURN p.name, type(r), id(r), m.title, r.summary',
      create_WROTE: 'MATCH (p:Person { name: {source} }), (m:Movie { title: {target} }) CREATE (p)-[r:WROTE]->(m) RETURN p.name, type(r), id(r), m.title',
      // readRelationship: 'MATCH ()-[r]->() WHERE id(r)={id} RETURN r',
      readRelationship: 'MATCH (m)-[r]->(n) WHERE id(r)={id} RETURN coalesce(m.title, m.name), type(r), coalesce(n.title, n.name), coalesce(r.roles, r.summary)',
      getUpdateRelationship: 'MATCH (m)-[r]->(n) WHERE id(r)={id} RETURN coalesce(m.title, m.name), type(r), coalesce(n.title, n.name), coalesce(r.roles, r.summary)',
      update_ACTED_IN: 'MATCH (m)-[r]->(n) WHERE id(r)={id} SET r.roles=[{property}] RETURN coalesce(m.title, m.name), type(r), coalesce(n.title, n.name), coalesce(r.roles, r.summary)',   
      update_REVIEWED: 'MATCH (m)-[r]->(n) WHERE id(r)={id} SET r.summary={property} RETURN coalesce(m.title, m.name), type(r), coalesce(n.title, n.name), coalesce(r.roles, r.summary)',
      // getDeleteRelationship: 'MATCH ()-[r]->() WHERE id(r)={id} RETURN r',
      // deleteRelationship: 'MATCH ()-[r]->() WHERE id(r)={id} WITH r, startNode(r) AS Start, type(r) AS Type, CASE WHEN exists(r.roles) = true THEN r.roles WHEN exists(r.summary) = true THEN r.summary END AS Properties, endNode(r) AS End DELETE r RETURN Start, Type, Properties, End',
      deleteRelationship: 'MATCH ()-[r]->() WHERE id(r)={id} DELETE r',
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
        // searchBox: 'MATCH (n)-[r]->(m) WHERE n.title=~{searchParam} OR n.tagline=~{searchParam} OR n.released=toInt({searchParam}) OR n.name=~{searchParam} OR n.born=toInt({searchParam}) OR ANY(label IN labels(n) WHERE label=~{searchParam}) OR m.title=~{searchParam} OR m.tagline=~{searchParam} OR m.released=toInt({searchParam}) OR m.name=~{searchParam} OR m.born=toInt({searchParam}) OR ANY(label IN labels(m) WHERE label=~{searchParam}) OR ANY(role IN r.roles WHERE role=~{searchParam}) OR type(r)=~{searchParam} OR r.summary=~{searchParam} RETURN DISTINCT *',             
        searchBox: 'MATCH (n) WHERE n.title=~{searchParam} OR n.tagline=~{searchParam} OR n.released=toInt({searchParam}) OR n.name=~{searchParam} OR n.born=toInt({searchParam}) RETURN DISTINCT n AS n, NULL AS m, NULL AS r UNION MATCH (n)-[r]->(m) WHERE n.title=~{searchParam} OR n.tagline=~{searchParam} OR n.released=toInt({searchParam}) OR n.name=~{searchParam} OR n.born=toInt({searchParam}) OR ANY(label IN labels(n) WHERE label=~{searchParam}) OR m.title=~{searchParam} OR m.tagline=~{searchParam} OR m.released=toInt({searchParam}) OR m.name=~{searchParam} OR m.born=toInt({searchParam}) OR ANY(label IN labels(m) WHERE label=~{searchParam}) OR ANY(role IN r.roles WHERE role=~{searchParam}) OR type(r)=~{searchParam} OR r.summary=~{searchParam} RETURN DISTINCT n AS n, m AS m, r AS r',
      },
    };
    return queries;
  },
};

module.exports = queries;
