export enum AccountQueries {
  GET_ACCOUNT_$ACID = `SELECT * FROM account WHERE account_id = $1`,
  GET_ACCOUNT_$UNAME = `SELECT * FROM account WHERE username = $1`,
  INSERT_ACCOUNT_RT_$UNAME_$PSWRD = `INSERT INTO account (username, password) VALUES ($1, $2) RETURNING *`,
}
