// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class PgConnection {
  private static instance?: PgConnection

  private constructor () {}

  static getInstance (): PgConnection {
    PgConnection.instance === undefined && (PgConnection.instance = new PgConnection())
    return PgConnection.instance
  }
}
