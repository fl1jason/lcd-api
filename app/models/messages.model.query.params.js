module.exports = function (queryString) {

  this.page = queryString.page? queryString.page : 1;
  this.page_size = queryString.rows? queryString.rows : 30;
  this.search_query = queryString.query? queryString.query : '';
  this.from_user = queryString.from? queryString.from : '';
  this.to_user = queryString.to? queryString.to : '';

  let offset = (this.page -1)  * this.page_size;
  
  this.pageClause = function () { 
      return ` LIMIT ${offset}, ${this.page_size}`;
  }

  this.createFilter = function () { 
  
    let clause = '';
    function addClause(filter)
    {
      if (clause.length)
      {
        clause = clause + ' AND ' + filter;
      } else {
        clause = filter;
      }
    }
    
    if (this.search_query != ''){
      addClause(`message_text LIKE '%${this.search_query}%'`);
    }

    if (this.from_user != ''){
      addClause(`messages.message_from = ${this.from_user}`);
    }

    if (this.to_user != ''){
      addClause(`messages.message_to = ${this.to_user}`);
    }
    
    return clause;
  }

  this.whereClause = function () { 
    
    let filter = this.createFilter();

    let clause = '';
    if (filter != ''){
      clause = ` WHERE ${filter} `;
    }

    return clause;
  }
}