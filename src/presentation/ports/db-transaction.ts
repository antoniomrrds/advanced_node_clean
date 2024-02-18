export interface DBTransaction {
  openTransaction: () => Promise<void>
}
