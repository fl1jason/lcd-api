module.exports = function (queryString) {

  this.page = queryString.page? queryString.page : 1;
  this.page_size = queryString.rows? queryString.rows : 30;
  this.search_query = queryString.query? queryString.query : '';
  this.from_user = queryString.from? queryString.from : '';
  this.to_user = queryString.to? queryString.to : '';
  this.order = 'user_created DESC';

  if (queryString.order){
    if (queryString.order == 'oldest')
      this.order = 'messages.time_stamp';

    if (queryString.order == 'newest')
      this.order = 'messages.time_stamp DESC';

    if (queryString.order == 'user')
      this.order = 'users.user_name';
  }
  
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

  this.createColumns = function () { 
    return ("messages.message_text, messages.time_stamp, users.user_name, users.user_created, users.user_avatar");
  }

  this.createTable = function () { 

    let table = 'messages';
    if (this.to_user != ''){
      table = 'messages INNER JOIN users on users.id = messages.message_from';
    }

    if (this.from_user != ''){
      table = 'messages INNER JOIN users on users.id = messages.message_to';
    }

    return (table);
  }

  this.whereClause = function () { 
    
    let filter = this.createFilter();

    let clause = '';
    if (filter != ''){
      clause = ` WHERE ${filter} `;
    }

    return clause;
  }

  this.select = function () { 
    
    let query = `SELECT ${qry.createColumns()} FROM ${qry.createTable()} ${qry.whereClause()} ORDER BY ${this.order} ${qry.pageClause()}`;
    console.log(`SQL: ${query}`);

    return query;
  }
}